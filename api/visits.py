"""Vercel counter backed by durable Redis; credentials stay in server environment."""
import hashlib
import hmac
from http.server import BaseHTTPRequestHandler
import json
import os
import time
from urllib.parse import urlsplit
from urllib.request import Request, urlopen

TOTAL_KEY = 'lf:{visits}:total'
VISIT_SCRIPT = '''
local client = tonumber(redis.call('GET', KEYS[2]) or '0')
local global = tonumber(redis.call('GET', KEYS[3]) or '0')
if client >= 30 or global >= 300 then return -1 end
redis.call('INCR', KEYS[2])
redis.call('EXPIRE', KEYS[2], 120)
redis.call('INCR', KEYS[3])
redis.call('EXPIRE', KEYS[3], 120)
return redis.call('INCR', KEYS[1])
'''


def redis_command(command):
    endpoint = os.environ.get('KV_REST_API_URL') or os.environ.get('UPSTASH_REDIS_REST_URL', '')
    token = os.environ.get('KV_REST_API_TOKEN') or os.environ.get('UPSTASH_REDIS_REST_TOKEN', '')
    url = urlsplit(endpoint)
    if url.scheme != 'https' or not url.hostname or not url.hostname.endswith('.upstash.io') or not token:
        raise ValueError('Counter storage is not configured')
    request = Request(endpoint, data=json.dumps(command).encode(), headers={
        'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json',
    }, method='POST')
    with urlopen(request, timeout=4) as response:
        data = json.load(response)
    if not isinstance(data, dict) or 'error' in data or 'result' not in data:
        raise ValueError('Counter storage unavailable')
    return data['result']


def counter_value(result):
    if result is None:
        return 0
    if isinstance(result, bool) or not str(result).isascii() or not str(result).isdecimal():
        raise ValueError('Invalid counter value')
    value = int(result)
    if not 0 <= value <= 9007199254740991:
        raise ValueError('Invalid counter value')
    return value


class handler(BaseHTTPRequestHandler):
    def log_message(self, *_):
        pass  # No application log of visitor addresses or credentials.

    def respond(self, status, data):
        body = json.dumps(data).encode()
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Cache-Control', 'no-store')
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('Content-Length', str(len(body)))
        if status == 429:
            self.send_header('Retry-After', '60')
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        try:
            self.respond(200, {'visits': counter_value(redis_command(['GET', TOTAL_KEY]))})
        except (OSError, ValueError, TypeError):
            self.respond(503, {'error': 'Counter temporarily unavailable'})

    def do_POST(self):
        origins = {'https://lucasflowers.net', 'https://www.lucasflowers.net'}
        if os.environ.get('VERCEL_URL'):
            origins.add('https://' + os.environ['VERCEL_URL'])
        if self.headers.get('Origin') not in (None, *origins) or self.headers.get('Sec-Fetch-Site') == 'cross-site':
            return self.respond(403, {'error': 'Origin not allowed'})
        try:
            length = int(self.headers.get('Content-Length', '0'))
            if not 0 < length <= 64 or self.headers.get('Content-Type', '').split(';')[0] != 'application/json':
                return self.respond(400, {'error': 'Expected an empty JSON object'})
            if json.loads(self.rfile.read(length)) != {}:
                return self.respond(400, {'error': 'Expected an empty JSON object'})
        except (ValueError, UnicodeDecodeError):
            return self.respond(400, {'error': 'Invalid request'})
        try:
            bucket = int(time.time()) // 60
            token = os.environ.get('KV_REST_API_TOKEN') or os.environ.get('UPSTASH_REDIS_REST_TOKEN', '')
            if not token:
                raise ValueError('Counter storage is not configured')
            address = self.headers.get('X-Vercel-Forwarded-For') or self.headers.get('X-Forwarded-For') or self.client_address[0]
            address = address.split(',')[0].strip()
            digest = hmac.new(token.encode(), f'{bucket}:{address}'.encode(), hashlib.sha256).hexdigest()
            result = redis_command(['EVAL', VISIT_SCRIPT, 3, TOTAL_KEY,
                                    f'lf:{{visits}}:client:{bucket}:{digest}', f'lf:{{visits}}:rate:{bucket}'])
            if result == -1:
                return self.respond(429, {'error': 'Try again later'})
            self.respond(200, {'visits': counter_value(result)})
        except (OSError, ValueError, TypeError):
            self.respond(503, {'error': 'Counter temporarily unavailable'})
