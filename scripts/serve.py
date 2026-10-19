"""Serve dist/ and a durable, aggregate SQLite counter. Bind locally by default."""
import argparse
from contextlib import contextmanager
import hashlib
import hmac
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import json
import os
from pathlib import Path
import secrets
import sqlite3
import time
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]


class Counter:
    def __init__(self, path):
        self.path = Path(path)
        self.path.parent.mkdir(parents=True, exist_ok=True)
        with self.connect() as db:
            db.execute("PRAGMA journal_mode=WAL")
            db.execute("CREATE TABLE IF NOT EXISTS counter (id INTEGER PRIMARY KEY CHECK(id=1), visits INTEGER NOT NULL CHECK(visits>=0))")
            db.execute("INSERT OR IGNORE INTO counter VALUES (1, 0)")
            db.execute("CREATE TABLE IF NOT EXISTS limits (client TEXT NOT NULL, bucket INTEGER NOT NULL, hits INTEGER NOT NULL, PRIMARY KEY(client,bucket))")
            db.execute("CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)")
            db.execute("INSERT OR IGNORE INTO settings VALUES ('salt', ?)", (secrets.token_hex(32),))
            self.salt = db.execute("SELECT value FROM settings WHERE key='salt'").fetchone()[0].encode()

    @contextmanager
    def connect(self):
        db = sqlite3.connect(self.path, timeout=15)
        try:
            with db:
                yield db
        finally:
            db.close()

    def value(self):
        with self.connect() as db:
            return db.execute("SELECT visits FROM counter WHERE id=1").fetchone()[0]

    def visit(self, address):
        bucket = int(time.time()) // 60
        digest = hmac.new(self.salt, f"{bucket}:{address}".encode(), hashlib.sha256).hexdigest()
        with self.connect() as db:
            db.execute("BEGIN IMMEDIATE")
            db.execute("DELETE FROM limits WHERE bucket < ?", (bucket - 2,))
            hits = db.execute("SELECT hits FROM limits WHERE client=? AND bucket=?", (digest, bucket)).fetchone()
            global_hits = db.execute("SELECT SUM(hits) FROM limits WHERE bucket=?", (bucket,)).fetchone()[0] or 0
            if (hits and hits[0] >= 30) or global_hits >= 300:
                return None
            db.execute("INSERT INTO limits VALUES (?, ?, 1) ON CONFLICT(client,bucket) DO UPDATE SET hits=hits+1", (digest, bucket))
            db.execute("UPDATE counter SET visits=visits+1 WHERE id=1")
            return db.execute("SELECT visits FROM counter WHERE id=1").fetchone()[0]


def handler(counter, origin=None):
    class Handler(SimpleHTTPRequestHandler):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, directory=str(ROOT / "dist"), **kwargs)

        def log_message(self, *_):
            pass  # No visitor address or request history is retained by this server.

        def json(self, status, data):
            body = json.dumps(data).encode()
            self.send_response(status)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Cache-Control", "no-store")
            self.send_header("Content-Length", str(len(body)))
            self.send_header("X-Content-Type-Options", "nosniff")
            if status == 429:
                self.send_header("Retry-After", "60")
            self.end_headers()
            self.wfile.write(body)

        def do_GET(self):
            if urlsplit(self.path).path == "/api/visits":
                try:
                    self.json(200, {"visits": counter.value()})
                except sqlite3.Error:
                    self.json(503, {"error": "Counter temporarily unavailable"})
            elif urlsplit(self.path).path.startswith("/api/"):
                self.json(404, {"error": "Not found"})
            else:
                super().do_GET()

        def do_POST(self):
            if self.path != "/api/visits":
                return self.json(404, {"error": "Not found"})
            expected_origin = origin or f"http://{self.headers.get('Host', '')}"
            if self.headers.get("Origin") not in (None, expected_origin) or self.headers.get("Sec-Fetch-Site") == "cross-site":
                return self.json(403, {"error": "Origin not allowed"})
            try:
                length = int(self.headers.get("Content-Length", "0"))
                if not 0 < length <= 64 or self.headers.get("Content-Type", "").split(";")[0] != "application/json":
                    return self.json(400, {"error": "Expected an empty JSON object"})
                if json.loads(self.rfile.read(length)) != {}:
                    return self.json(400, {"error": "Expected an empty JSON object"})
            except (ValueError, UnicodeDecodeError):
                return self.json(400, {"error": "Invalid request"})
            try:
                value = counter.visit(self.client_address[0])
                self.json(429 if value is None else 200, {"error": "Try again later"} if value is None else {"visits": value})
            except sqlite3.Error:
                self.json(503, {"error": "Counter temporarily unavailable"})

        def send_error(self, code, message=None, explain=None):
            if code == 404 and (ROOT / "dist/404.html").exists():
                body = (ROOT / "dist/404.html").read_bytes()
                self.send_response(404)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Content-Length", str(len(body)))
                self.end_headers()
                if self.command != "HEAD":
                    self.wfile.write(body)
            else:
                super().send_error(code, message, explain)
    return Handler


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, default=49280)
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--database", type=Path, default=ROOT / ".local/visits.sqlite3")
    args = parser.parse_args()
    if not (ROOT / "dist/index.html").exists():
        parser.error("Run python scripts/build.py first")
    server = ThreadingHTTPServer((args.host, args.port), handler(Counter(args.database), os.environ.get("SITE_ORIGIN")))
    print(f"Site: http://{args.host}:{server.server_port}/", flush=True)
    print(f"Counter database: {args.database}", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
