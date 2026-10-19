"""HTTP contract and Redis transport boundaries for the deployed counter."""
from contextlib import contextmanager
from http.server import ThreadingHTTPServer
from io import BytesIO
import json
import os
import threading
import unittest
from unittest.mock import patch
from urllib.error import HTTPError
from urllib.request import Request, urlopen
from api.visits import handler, redis_command, TOTAL_KEY, VISIT_SCRIPT


@contextmanager
def server():
    http = ThreadingHTTPServer(('127.0.0.1', 0), handler)
    thread = threading.Thread(target=http.serve_forever, daemon=True)
    thread.start()
    try:
        yield f'http://127.0.0.1:{http.server_port}/api/visits'
    finally:
        http.shutdown()
        http.server_close()
        thread.join()


class VercelCounterTests(unittest.TestCase):
    def test_get_does_not_increment_and_does_not_cache(self):
        with patch('api.visits.redis_command', return_value='27') as command, server() as url:
            with urlopen(url) as response:
                self.assertEqual(json.load(response), {'visits': 27})
                self.assertEqual(response.headers['Cache-Control'], 'no-store')
            command.assert_called_once_with(['GET', TOTAL_KEY])

    def test_post_uses_one_atomic_script_and_hashes_address(self):
        with patch.dict(os.environ, {'KV_REST_API_TOKEN': 'test-only-secret'}), patch('api.visits.redis_command', return_value=28) as command, server() as url:
            request = Request(url, data=b'{}', headers={'Content-Type': 'application/json', 'Origin': 'https://www.lucasflowers.net', 'X-Vercel-Forwarded-For': '192.0.2.1'})
            with urlopen(request) as response:
                self.assertEqual(json.load(response), {'visits': 28})
            args = command.call_args.args[0]
            self.assertEqual(args[:4], ['EVAL', VISIT_SCRIPT, 3, TOTAL_KEY])
            self.assertNotIn('192.0.2.1', str(args))
            self.assertNotIn('test-only-secret', str(args))
            self.assertIn("'EXPIRE'", VISIT_SCRIPT)

    def test_invalid_writes_never_reach_database(self):
        with patch('api.visits.redis_command') as command, server() as url:
            for body, origin, expected in [(b'{}', 'https://evil.example', 403), (b'{"visits":99}', 'https://lucasflowers.net', 400), (b'[]', 'https://lucasflowers.net', 400), (b'bad', 'https://lucasflowers.net', 400), (b'x' * 65, 'https://lucasflowers.net', 400)]:
                with self.assertRaises(HTTPError) as error:
                    urlopen(Request(url, data=body, headers={'Content-Type': 'application/json', 'Origin': origin}))
                self.assertEqual(error.exception.code, expected)
                error.exception.close()
            command.assert_not_called()

    def test_rate_limit_is_explicit(self):
        with patch.dict(os.environ, {'KV_REST_API_TOKEN': 'test-only-secret'}), patch('api.visits.redis_command', return_value=-1), server() as url:
            with self.assertRaises(HTTPError) as error:
                urlopen(Request(url, data=b'{}', headers={'Content-Type': 'application/json'}))
            self.assertEqual(error.exception.code, 429)
            self.assertEqual(error.exception.headers['Retry-After'], '60')
            error.exception.close()

    def test_storage_failure_and_invalid_values_are_not_fake_counts(self):
        with server() as url:
            for bad in [True, -2, {}, '1.5', 9007199254740992]:
                with patch('api.visits.redis_command', return_value=bad), self.assertRaises(HTTPError) as error:
                    urlopen(url)
                self.assertEqual(error.exception.code, 503)
                error.exception.close()
            with patch('api.visits.redis_command', side_effect=TimeoutError()), self.assertRaises(HTTPError) as error:
                urlopen(url)
            self.assertEqual(error.exception.code, 503)
            error.exception.close()

    def test_redis_http_transport_keeps_token_out_of_url_and_validates_response(self):
        env = {'KV_REST_API_URL': 'https://test.upstash.io', 'KV_REST_API_TOKEN': 'test-only-secret'}
        with patch.dict(os.environ, env), patch('api.visits.urlopen', return_value=BytesIO(b'{"result":"9"}')) as send:
            self.assertEqual(redis_command(['GET', TOTAL_KEY]), '9')
            request = send.call_args.args[0]
            self.assertEqual(request.full_url, env['KV_REST_API_URL'])
            self.assertEqual(json.loads(request.data), ['GET', TOTAL_KEY])
            self.assertEqual(request.get_header('Authorization'), 'Bearer test-only-secret')
        with patch.dict(os.environ, env), patch('api.visits.urlopen', return_value=BytesIO(b'{"error":"broken"}')), self.assertRaises(ValueError):
            redis_command(['GET', TOTAL_KEY])


if __name__ == '__main__':
    unittest.main()
