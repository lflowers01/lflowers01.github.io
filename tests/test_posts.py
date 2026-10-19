"""Folder publishing, draft exclusion and safe Markdown rendering."""
import json
from pathlib import Path
import shutil
import sys
import tempfile
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT/'scripts'))
import build as builder
from posts import load_posts


class PostTests(unittest.TestCase):
    def test_plain_markdown_defaults_and_front_matter(self):
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder)
            (path/'2026-10-19-first.md').write_text('# First post\n\nA short **thought**.', encoding='utf-8')
            (path/'second.md').write_text('---\ntitle: Second\ndate: 2026-10-20\nsummary: Another thought\n---\n\nHello.', encoding='utf-8')
            (path/'draft.md').write_text('---\ndraft: true\n---', encoding='utf-8')
            (path/'_template.md').write_text('Not published.', encoding='utf-8')
            entries = load_posts(path, 'notes')
            self.assertEqual([e['title'] for e in entries], ['Second', 'First post'])
            self.assertEqual(entries[1]['summary'], 'A short thought.')
            self.assertEqual(entries[1]['date'], '2026-10-19')
            self.assertNotEqual(entries[0]['x'], entries[1]['x'])
            (path/'invalid.md').write_text('---\ndate: definitely-not-a-date\n---\n\nText', encoding='utf-8')
            with self.assertRaisesRegex(ValueError, 'invalid.md'):
                load_posts(path, 'notes')

    def test_validation_and_markdown(self):
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder)/'project.md'
            for field in ['repo: javascript:alert(1)', 'image: /assets/../private.png', 'title: 42', 'draft: maybe', 'surprise: value']:
                path.write_text(f'---\n{field}\n---\n\nSome work.', encoding='utf-8')
                with self.assertRaisesRegex(ValueError, 'project.md'):
                    load_posts(path.parent, 'projects')
        rendered = builder.markdown('**Bold** and [link](https://example.com)\n\n```python\nprint(1)\n```\n\n<script>alert(1)</script>')
        self.assertIn('<strong>Bold</strong>', rendered)
        self.assertIn('language-python', rendered)
        self.assertNotIn('<script>', rendered)
        self.assertNotIn('href="javascript:', builder.markdown('[bad](javascript:alert(1))'))

    def test_drop_add_remove_draft_and_failed_build(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            for name in ('content', 'templates', 'assets'):
                shutil.copytree(ROOT/name, root/name)
            note = root/'content/notes/drop-test.md'
            note.write_text('---\ntitle: Drop test\ndate: 2026-10-21\n---\n\nA note from a dropped file.', encoding='utf-8')
            project = root/'content/projects/drop-project.md'
            project.write_text('# New build\n\nA project without a screenshot or repository.', encoding='utf-8')
            (root/'content/notes/secret-draft.md').write_text('---\ndraft: true\n---\n\nNot public.', encoding='utf-8')
            with patch.object(builder, 'ROOT', root), patch.object(builder, 'OUT', root/'dist'):
                builder.build()
                home = (root/'dist/index.html').read_text(encoding='utf-8')
                self.assertIn('/notes/drop-test.html', home)
                self.assertIn('/projects/drop-project.html', home)
                self.assertIn('Drop test', (root/'dist/feed.xml').read_text(encoding='utf-8'))
                self.assertFalse((root/'dist/notes/secret-draft.html').exists())
                self.assertNotIn('secret-draft', (root/'dist/sitemap.xml').read_text(encoding='utf-8'))
                note.write_text('---\ndate: wrong\n---\n\nText', encoding='utf-8')
                with self.assertRaisesRegex(ValueError, 'drop-test.md'):
                    builder.build()
                self.assertEqual(home, (root/'dist/index.html').read_text(encoding='utf-8'))
                note.unlink(); project.unlink(); builder.build()
                self.assertFalse((root/'dist/notes/drop-test.html').exists())
                self.assertFalse((root/'dist/projects/drop-project.html').exists())
                self.assertNotIn('drop-test', (root/'dist/feed.xml').read_text(encoding='utf-8'))


if __name__ == '__main__':
    unittest.main()
