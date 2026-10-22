"""Build/content checks and real SQLite/HTTP counter tests; no external services."""
from concurrent.futures import ThreadPoolExecutor
from html.parser import HTMLParser
import json
from pathlib import Path
import sys
import tempfile
import threading
import unittest
from urllib.error import HTTPError
from urllib.parse import unquote, urlsplit
from urllib.request import Request, urlopen
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from build import build, markdown
from posts import load_posts
from serve import Counter, handler, ThreadingHTTPServer


class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links, self.ids, self.images, self.duplicate_ids = [], set(), [], []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get("id"):
            if attrs["id"] in self.ids:
                self.duplicate_ids.append(attrs["id"])
            self.ids.add(attrs["id"])
        if tag == "img":
            self.images.append(attrs)
        for key in ("href", "src"):
            if attrs.get(key):
                self.links.append(attrs[key])


class SiteTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        build()

    def test_every_local_destination_and_fragment(self):
        pages = {}
        for path in (ROOT / "dist").rglob("*.html"):
            parser = Links()
            parser.feed(path.read_text(encoding="utf-8"))
            self.assertFalse(parser.duplicate_ids, str(path))
            pages[path] = parser
            for image in parser.images:
                self.assertIn("alt", image, str(path))
        for source, parser in pages.items():
            for link in parser.links:
                parts = urlsplit(link)
                if parts.scheme or parts.netloc:
                    continue
                dest = ROOT / "dist" / unquote(parts.path).lstrip("/") if parts.path.startswith("/") else source.parent / unquote(parts.path)
                if not parts.path:
                    dest = source
                if dest.is_dir():
                    dest /= "index.html"
                self.assertTrue(dest.is_file(), f"{source.name}: {link}")
                if parts.fragment and dest.suffix == ".html":
                    self.assertIn(unquote(parts.fragment), pages[dest].ids, f"{source.name}: {link}")

    def test_off_site_links_open_in_new_tab(self):
        import re
        for path in (ROOT / "dist").glob("**/*.html"):
            if "archive" in path.parts and path.parent.name == "archive":
                continue  # the packaged game is a historical build, not site markup
            for a in re.findall(r"<a\s[^>]*>", path.read_text(encoding="utf-8")):
                href = re.search(r'href="(https?://[^"]+)"', a)
                if href and urlsplit(href.group(1)).hostname == "ring.purduehackers.com" and urlsplit(href.group(1)).path in ("/previous", "/next"):
                    self.assertNotIn('target=', a)
                    self.assertNotIn('noreferrer', a)
                elif href and urlsplit(href.group(1)).hostname != "lucasflowers.net":
                    self.assertIn('target="_blank"', a, f"{path.name}: {a}")
                    self.assertIn('rel="noopener"', a, f"{path.name}: {a}")
                if 'href="/Resume.pdf"' in a:
                    self.assertIn('target="_blank"', a, f"{path.name}: {a}")

    def test_webring_links_follow_profile_links(self):
        home = (ROOT / "dist/index.html").read_text(encoding="utf-8")
        self.assertLess(home.index('class="profile-links"'), home.index('class="hero-webring"'))
        self.assertLess(home.index('class="hero-webring"'), home.index('</section>'))
        for direction in ('previous','next'):
            self.assertIn(f'href="https://ring.purduehackers.com/{direction}"',home)

    def test_promoted_layout_keeps_single_hero_and_main_storage(self):
        home = (ROOT / 'dist/index.html').read_text(encoding='utf-8')
        for value in ('data-home-study', 'class="study-about"', 'class="study-project-list"', '/assets/home-study.css', '/assets/home-study.js', 'data-home="true"'):
            self.assertIn(value, home)
        for value in ('data-object-forms', '/assets/home-study-objects.js', 'study.desk.', 'study.lf.photos.', 'class="study-banner"', 'name="robots" content="noindex"'):
            self.assertNotIn(value, home)
        self.assertIn('Rotating ASCII torus', home)
        self.assertIn('data-storage-prefix="desk."', home)

    def test_published_content_and_feed(self):
        home = (ROOT / "dist/index.html").read_text(encoding="utf-8")
        self.assertIn("John Martinson Honors College", home)
        self.assertNotIn("Pin a demo note", home)
        self.assertNotIn("project-template.html", home)
        self.assertIn('href="/projects/archive.html"', home)
        self.assertNotIn("<iframe", home)  # Remote audio connects only after explicit play.
        feed = ET.parse(ROOT / "dist/feed.xml")
        self.assertEqual(len(feed.findall("./channel/item")), len(load_posts(ROOT / "content/notes", "notes")))
        self.assertIn("More ideas soon", home)
        self.assertNotIn("/notes/a-place-to-leave-things.html", home)
        ET.parse(ROOT / "dist/sitemap.xml")
        self.assertEqual(markdown('<script>alert(1)</script>'), '<p>&lt;script&gt;alert(1)&lt;/script&gt;</p>')


class CounterTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.path = Path(self.temp.name) / "counter.sqlite3"
        self.counter = Counter(self.path)

    def tearDown(self):
        self.temp.cleanup()

    def test_atomic_concurrent_increments_and_restart(self):
        with ThreadPoolExecutor(max_workers=12) as pool:
            values = list(pool.map(lambda i: self.counter.visit(str(i)), range(40)))
        self.assertEqual(sorted(values), list(range(1, 41)))
        self.assertEqual(Counter(self.path).value(), 40)

    def test_rate_limit_does_not_mutate_total(self):
        for _ in range(30):
            self.assertIsNotNone(self.counter.visit("127.0.0.1"))
        self.assertIsNone(self.counter.visit("127.0.0.1"))
        self.assertEqual(self.counter.value(), 30)
        with self.counter.connect() as db:
            self.assertNotIn("127.0.0.1", str(db.execute("SELECT * FROM limits").fetchall()))

    def test_http_validation_and_read_only_get(self):
        server = ThreadingHTTPServer(("127.0.0.1", 0), handler(self.counter))
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        base = f"http://127.0.0.1:{server.server_port}"
        try:
            request = Request(base + "/api/visits", data=b"{}", headers={"Content-Type":"application/json", "Origin":base})
            with urlopen(request) as response:
                self.assertEqual(json.load(response)["visits"], 1)
            with urlopen(base + "/api/visits") as response:
                self.assertEqual(json.load(response)["visits"], 1)
            for payload, origin, expected in [(b'{"visits":999}', base, 400), (b"{}", "https://other.example", 403), (b"x"*65, base, 400)]:
                with self.assertRaises(HTTPError) as raised:
                    urlopen(Request(base + "/api/visits", data=payload, headers={"Content-Type":"application/json", "Origin":origin}))
                self.assertEqual(raised.exception.code, expected)
                raised.exception.close()
            self.assertEqual(self.counter.value(), 1)
        finally:
            server.shutdown(); server.server_close(); thread.join()


if __name__ == "__main__":
    unittest.main()
