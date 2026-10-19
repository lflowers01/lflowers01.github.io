"""Read notes and projects directly from Markdown files with optional YAML front matter."""
from datetime import date, datetime
from pathlib import Path
import re
from urllib.parse import urlsplit

import yaml


def load_posts(directory, kind):
    entries, ids = [], set()
    for path in sorted(Path(directory).iterdir()):
        if not path.is_file() or path.suffix.lower() != '.md' or path.name.startswith('_'):
            continue
        try:
            text, meta = path.read_text(encoding='utf-8-sig').strip(), {}
            if text.startswith('---\n'):
                match = re.match(r'^---\n(.*?)\n---(?:\n|$)', text, re.S)
                if not match:
                    raise ValueError('Front matter needs a closing --- line')
                meta = yaml.safe_load(match[1]) or {}
                text = text[match.end():].strip()
            if not isinstance(meta, dict):
                raise ValueError('Front matter must contain field: value pairs')
            allowed = {'title', 'date', 'summary', 'draft'} | ({'x', 'y'} if kind == 'notes' else {'status', 'role', 'repo', 'image', 'image_alt'})
            if set(meta) - allowed:
                raise ValueError('Unknown fields: ' + ', '.join(map(str, set(meta) - allowed)))
            if type(meta.get('draft', False)) is not bool:
                raise ValueError('draft must be true or false')
            if meta.get('draft'):
                continue
            slug = re.sub(r'[^a-z0-9]+', '-', path.stem.lower()).strip('-')
            if not slug or slug in {'index', 'archive'} or slug in ids:
                raise ValueError('Use a unique filename other than index.md or archive.md')
            ids.add(slug)
            heading = re.match(r'^# (.+)(?:\n|$)', text)
            title = meta.get('title', heading[1] if heading else path.stem.replace('-', ' ').replace('_', ' ').capitalize())
            if heading:
                text = text[heading.end():].strip()
            if not text:
                raise ValueError('Add some post text, or set draft: true')
            fallback_date = re.match(r'^\d{4}-\d{2}-\d{2}', path.stem)
            published = str(meta.get('date', fallback_date[0] if fallback_date else datetime.fromtimestamp(path.stat().st_mtime).date()))
            date.fromisoformat(published)
            if not isinstance(title, str) or not title.strip():
                raise ValueError('title must be nonempty text')
            paragraph = next((b for b in text.split('\n\n') if not b.startswith(('#', '```', '- ', '!['))), title)
            summary = re.sub(r'\s+', ' ', re.sub(r'[*`_]', '', paragraph)).strip()
            summary = summary if len(summary) <= 180 else summary[:177].rsplit(' ', 1)[0] + '…'
            summary = meta.get('summary', summary)
            if not all(isinstance(value, str) and value.strip() for value in (title, summary)):
                raise ValueError('title and summary must be nonempty text')
            entry = {'id': slug, 'title': title, 'date': published, 'summary': summary, 'body': text}
            if kind == 'notes':
                entry.update(excerpt=summary, x=meta.get('x'), y=meta.get('y'), color=0)
                for axis in ('x', 'y'):
                    if entry[axis] is not None and (type(entry[axis]) not in (int, float) or not 0 <= entry[axis] <= 1):
                        raise ValueError(f'{axis} must be a number between 0 and 1')
            else:
                entry.update(status=meta.get('status', 'In progress'), role=meta.get('role', 'Design and development'), repo=meta.get('repo', ''), image=meta.get('image', ''), imageAlt=meta.get('image_alt', title))
                if not all(isinstance(entry[k], str) for k in ('status', 'role', 'repo', 'image', 'imageAlt')):
                    raise ValueError('Project fields must be text')
                for key in ('repo', 'image'):
                    value = entry[key]
                    if value and not (urlsplit(value).scheme == 'https' and urlsplit(value).netloc) and not (key == 'image' and value.startswith('/assets/') and '..' not in value.split('/')):
                        raise ValueError(f'{key} must be an HTTPS URL' + (' or an /assets/ path' if key == 'image' else ''))
            entries.append(entry)
        except (ValueError, yaml.YAMLError) as error:
            raise ValueError(f'{path}: {error}') from error
    entries.sort(key=lambda entry: (-date.fromisoformat(entry['date']).toordinal(), entry['id']))
    if kind == 'notes':
        for i, entry in enumerate(entries):
            for axis, default in zip(('x', 'y'), ((.08, .85, .42)[i % 3], (.08, .16, .83)[i % 3])):
                if entry[axis] is None:
                    entry[axis] = default
    return entries
