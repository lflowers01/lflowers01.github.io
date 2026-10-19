"""Build the static site with Python 3.11+. No third-party dependencies."""
from datetime import date, datetime, timezone
from email.utils import format_datetime
from html import escape
import json
from pathlib import Path
import re
import shutil
from urllib.parse import urlsplit
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "dist"


def read(path):
    return (ROOT / path).read_text(encoding="utf-8")


def markdown(text):
    """Our entries use paragraphs, ## headings and unordered lists; raw HTML is text."""
    blocks = []
    for block in text.strip().split("\n\n"):
        lines = block.splitlines()
        if block.startswith("## ") and len(lines) == 1:
            blocks.append(f"<h2>{escape(block[3:])}</h2>")
        elif all(line.startswith("- ") for line in lines):
            blocks.append("<ul>" + "".join(f"<li>{escape(line[2:])}</li>" for line in lines) + "</ul>")
        else:
            blocks.append(f"<p>{escape(' '.join(lines))}</p>")
    return "\n".join(blocks)


def fill(template, values):
    for key, value in values.items():
        template = template.replace("{{" + key + "}}", str(value))
    if re.search(r"{{[\w-]+}}", template):
        raise ValueError("Unfilled template value")
    return template


def data_json(data):
    return json.dumps(data, ensure_ascii=False).replace("<", "\\u003c")


def external_links(html, host):
    """Off-site links and PDFs (the résumé) open in a new tab; site pages and mailto stay put."""
    def tag(match):
        a = match.group(0)
        href = re.search(r'href="([^"]*)"', a)
        url = urlsplit(href.group(1)) if href else None
        pdf = url is not None and url.path.lower().endswith(".pdf")
        if not href or "target=" in a or not (pdf or (url.scheme in ("http", "https") and url.hostname != host)):
            return a
        return a[:-1] + ' target="_blank" rel="noopener">'
    return re.sub(r"<a\s[^>]*>", tag, html)


def build():
    site = json.loads(read("content/site.json"))
    base = site["url"].rstrip("/")
    assert urlsplit(base).scheme == "https" and urlsplit(base).netloc
    assert urlsplit(site["soundcloud"]).hostname == "soundcloud.com"
    assert site["counterEndpoint"].startswith(("/api/", "https://"))
    assert all(urlsplit(p["repo"]).hostname == "github.com" for p in site["projects"])
    for collection in ("notes", "projects"):
        ids = set()
        for entry in site[collection]:
            assert re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", entry["id"])
            assert entry["id"] not in ids
            ids.add(entry["id"])
            date.fromisoformat(entry["date"])
            entry["body"] = read(f"content/{collection}/{entry['id']}.md")
    for note in site["notes"]:
        assert all(isinstance(note[axis], (int, float)) and 0 <= note[axis] <= 1 for axis in ("x", "y"))
        assert note["color"] in (0, 1, 2)
    assert site["tracks"] and all(isinstance(t["id"], int) and t["id"] > 0 for t in site["tracks"])
    assert all(urlsplit(t["url"]).scheme == "https" and urlsplit(t["url"]).hostname == "soundcloud.com" for t in site["tracks"])

    header = read("templates/header.html").replace('src="assets/', 'src="/assets/')
    ring = '<a href="https://ring.purduehackers.com/" target="_blank" rel="noopener">Explore the Purdue Hackers webring ↗</a>'
    if site["ringNavigation"]:
        host = escape(urlsplit(base).hostname)
        ring = f'<a href="https://ring.purduehackers.com/previous?host={host}">← Previous</a><a href="https://ring.purduehackers.com/">Purdue Hackers webring</a><a href="https://ring.purduehackers.com/next?host={host}">Next →</a>'
    footer = fill(read("templates/footer.html"), {"ring": ring})
    pages = {}

    def page(path, title, description, body, home=False):
        nav = next((f'href="/{p}"' for p in ('about.html', 'projects/', 'notes/') if path.startswith(p)), None)
        canonical = base + ("/" if path == "index.html" else "/" + path.replace("index.html", ""))
        pages[path] = external_links(f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="{escape(description, quote=True)}"><meta name="theme-color" content="#000000"><title>{escape(title)}</title><link rel="canonical" href="{escape(canonical)}"><link rel="icon" href="/assets/plan/flower-original.png"><link rel="alternate" type="application/rss+xml" title="Lucas Flowers — notebook" href="/feed.xml"><link rel="stylesheet" href="/assets/site.css"><script src="/assets/plan/demo-art.js" defer></script><script src="/assets/site.js" defer></script><script src="/assets/notebook.js" defer></script><script src="/assets/flower.js" defer></script>{'<script src="/assets/plan/demo-photo.js" defer></script><script src="/assets/music.js" defer></script>' if home else ''}</head>
<body data-theme="oled" id="top" data-home="{str(home).lower()}" data-counter="{escape(site['counterEndpoint'],quote=True)}"><a class="skip" href="#main">Skip to content</a><canvas id="ambient-art" class="art-field ambient-art" aria-hidden="true"></canvas>{header.replace(nav, nav + ' aria-current="page"') if nav else header}{body}{footer}</body></html>''', urlsplit(base).hostname)

    def project_card(project):
        return f'''<a class="project-card" href="/projects/{project['id']}.html"><div class="project-visual"><img src="{project['image']}" alt="" loading="lazy"></div><div class="project-card-copy"><span class="small-note">{escape(project['status'])} / {project['date'][:4]}</span><h3>{escape(project['title'])}</h3><p>{escape(project['summary'])}</p><span class="report-link">Read the build notes</span></div><span class="row-arrow" aria-hidden="true">→</span></a>'''

    notes_html = ""
    for i, note in enumerate(site["notes"]):
        colors = ["#f7edba", "#f7edba", "#f7edba"]
        notes_html += f'''<article class="sticky" data-id="{note['id']}" data-x="{note['x']}" data-y="{note['y']}" style="--angle:{[-4,3,-2][i%3]}deg;--note-color:{colors[note['color']]}"><button class="note-handle" type="button" aria-label="Move {escape(note['title'],quote=True)}. Use arrow keys." hidden>{note['date']}</button><a class="note-open" href="/notes/{note['id']}.html"><strong>{escape(note['title'])}</strong><span>{escape(note['excerpt'])}</span><time datetime="{note['date']}">{note['date']}</time></a></article>'''
    index = "".join(f'<li><a href="/notes/{n["id"]}.html"><time datetime="{n["date"]}">{n["date"]}</time><h2>{escape(n["title"])}</h2><p>{escape(n["excerpt"])}</p><span class="row-arrow" aria-hidden="true">→</span></a></li>' for n in site["notes"])
    music = fill(read("templates/music.html"), {
        "track-count": f"{len(site['tracks']):02}", "track-title": escape(site["tracks"][0]["title"]),
        "track-artist": escape(site["tracks"][0]["artist"]), "music-title": escape(site["musicTitle"]),
        "artist-url": escape(site["tracks"][0]["url"], quote=True),
        "soundcloud": escape(site["soundcloud"], quote=True), "tracks-json": data_json(site["tracks"]),
    })
    page("index.html", "Lucas Flowers", "Robotics Engineering Technology at Purdue. Current projects, a notebook, photographs, music, and an interactive ASCII playground.", fill(read("templates/home.html"), {"notes": notes_html, "note-list": index.replace("h2>", "h3>"), "projects": "".join(map(project_card, site["projects"])), "music": music}), True)

    def reading(title, intro, content, back="/", back_label="Home"):
        return f'<main id="main" class="project-report reading-page"><a class="back-link" href="{back}">← {back_label}</a><h1>{escape(title)}</h1><p class="report-summary">{intro}</p><div class="prose">{content}</div></main>'

    page("notes/index.html", "Notebook — Lucas Flowers", "Notes on projects, design, and engineering.", reading("Notebook", "Notes on projects, design, and engineering.", f'<ol class="entry-list">{index}</ol>'))
    for note in site["notes"]:
        body = reading(note["title"], f'<time datetime="{note["date"]}">{note["date"]}</time>', markdown(note["body"]), "/notes/", "All notes")
        page(f"notes/{note['id']}.html", note["title"] + " — Lucas Flowers", note["excerpt"], body)
    # High-school work: one archive page, listed at the bottom of the projects index, never on the homepage.
    archive = json.loads(read("content/archive.json"))
    for entry in archive:
        assert re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", entry["id"])
        assert all(link["url"].startswith(("https://", "/assets/archive/")) for link in entry["links"])
    def archive_entry(entry):
        shot = f'<figure class="project-shot"><img src="/assets/archive/{entry["id"]}.jpg" alt="Screenshot of {escape(entry["title"], quote=True)}" loading="lazy"></figure>' if (ROOT / f"assets/archive/{entry['id']}.jpg").exists() else ""
        links = " · ".join(f'<a href="{escape(l["url"], quote=True)}"{" target=\"_blank\" rel=\"noopener\"" if l["url"].startswith("https://") else ""}>{escape(l["label"])} ↗</a>' for l in entry["links"])
        return f'<section class="archive-entry" id="{entry["id"]}"><h2>{escape(entry["title"])}</h2><p class="archive-period">{escape(entry["period"])}</p>{shot}' + "".join(f"<p>{escape(t)}</p>" for t in entry["paragraphs"]) + (f"<p>{links}</p>" if links else "") + "</section>"
    page("projects/archive.html", "High school archive — Lucas Flowers", "Earlier projects from high school.", reading("High school archive", "Earlier projects from high school, kept for the record.", "".join(map(archive_entry, archive)), "/projects/", "All projects"))
    archive_list = f'<details class="archive-list"><summary><h2>High school archive</h2><span class="archive-count">{len(archive)} projects</span></summary><p>Earlier work, kept for the record. Select a project to read about it.</p><ol class="entry-list">' + "".join(f'<li><a href="/projects/archive.html#{e["id"]}"><time>{escape(e["period"])}</time><h3>{escape(e["title"])}</h3><p>{escape(e["summary"])}</p><span class="row-arrow" aria-hidden="true">→</span></a></li>' for e in archive) + "</ol></details>"
    page("projects/index.html", "Projects — Lucas Flowers", "Current projects and independent builds by Lucas Flowers.", reading("Projects", "Current work, with room for what comes next.", "".join(map(project_card, site["projects"])) + archive_list))
    for project in site["projects"]:
        meta = f'<dl class="report-meta"><div><dt>Status</dt><dd>{escape(project["status"])}</dd></div><div><dt>Updated</dt><dd>{project["date"]}</dd></div><div><dt>Role</dt><dd>{escape(project["role"])}</dd></div></dl>'
        shot = f'<figure class="project-shot"><img src="{project["image"]}" alt="{escape(project["imageAlt"], quote=True)}" loading="lazy"></figure>' if project.get("image") else ""
        content = meta + shot + markdown(project["body"]) + f'<p><a href="{escape(project["repo"], quote=True)}" target="_blank" rel="noopener">Source on GitHub ↗</a></p>'
        page(f"projects/{project['id']}.html", project["title"] + " — Lucas Flowers", project["summary"], reading(project["title"], escape(project["summary"]), content, "/projects/", "All projects"))

    page("about.html", "About — Lucas Flowers", "Lucas Flowers, Robotics Engineering Technology student at Purdue University, minoring in AI and machine learning.", reading("Hi, I'm Lucas.", "Robotics Engineering Technology at Purdue University, minoring in AI and machine learning.", '''<figure class="about-portrait"><img src="/assets/plan/portrait-original.png" width="260" height="300" alt="Lucas Flowers"></figure><p>I'm a first-year Robotics Engineering Technology student at Purdue University, minoring in AI and machine learning, and a member of the John Martinson Honors College. I'm originally from Phoenix, Arizona.</p><p>My goal is to build intelligent physical systems: machines that bring robotics, embedded hardware, and AI together to solve practical problems. I learn best by building things, usually with a team.</p><h2>At Purdue</h2><p>I'm on Purdue Electric Racing's low-voltage systems team, learning PCB design in Altium. It's been my favorite thing to work on so far, and the team has been patient about teaching it. I'm also doing avionics PCB work in KiCad with Purdue Orbital, and I'm a Purdue Professional Ambassador.</p><p>Outside the teams, I'm training in TIG and MIG welding at the Bechtel Innovation Design Center, with jewelry casting and design next.</p><h2>Before Purdue</h2><p>I founded <a href="/projects/archive.html#team-epsilon">Team Epsilon</a>, a community FIRST Robotics Competition team with students from Maryvale to Scottsdale, and led it as president and lead programmer. I wrote the robot's vision-based auto-alignment, using AprilTag pose estimation to line it up on its own. We competed at the Arizona North and Utah Regionals and earned the Rookie All-Star Award in Utah in 2026. I'm staying on as a mentor.</p><p>In high school, I was also lead programmer on two other FRC teams, finished Harvard's CS50, and interned at Phoenix Forge doing woodworking, welding, laser cutting, and fabrication. Most of my code is Java and Python, from autonomous robot code to Raspberry Pi projects.</p><p>Outside engineering, I like backpacking, fitness, music, and making digital and physical art. I spent time in Japan on an exchange in 2025; a few photographs from that trip are on the homepage.</p><h2>Get in touch</h2><p>I'm looking for Purdue research opportunities and summer 2027 internships in robotics, embedded systems, manufacturing, or applied AI/ML, especially in Phoenix or San Diego. I'm always glad to hear from engineers, researchers, and students working on robotics and physical AI.</p><p><a href="mailto:lucas@lucasflowers.net">lucas@lucasflowers.net</a><br><a href="https://linkedin.com/in/lucas-flowers-phx" target="_blank" rel="noopener">LinkedIn</a> · <a href="https://github.com/lflowers01" target="_blank" rel="noopener">GitHub</a> · <a href="/Resume.pdf">Résumé (PDF)</a></p><p>My résumé has the full details.</p>'''))
    page("colophon.html", "About this site — Lucas Flowers", "How this personal site works, its sources, credits, and local storage.", reading("About this site.", "A small personal website with a few moving parts.", '''<h2>The materials</h2><p>OLED black, muted green, warm white, and brown. The pixel typeface is <a href="https://departuremono.com/">Departure Mono</a> by Helena Zhang, under the <a href="/assets/plan/DepartureMono-LICENSE.txt">SIL Open Font License</a>. Large headings use Arial; reading text uses Verdana with system fallbacks. Notes use <a href="https://fonts.google.com/specimen/Kalam">Kalam</a> by Indian Type Foundry, under the <a href="/assets/fonts/Kalam-LICENSE.txt">SIL Open Font License</a>, snapped to pixels. The flower comes from the previous site.</p><h2>The moving parts</h2><p>The ASCII rings are projected into a fixed canvas grid. Pointer movement changes the material; clicks change the light. The footer has a small discovery inspired by WALL-E, using the ASCII reference supplied during the design process. WALL-E belongs to Pixar/Disney.</p><p>The <a href="https://www.purduehackers.com/">Purdue Hackers</a> site's dither interactions and the sites in its <a href="https://ring.purduehackers.com/">webring</a> helped shape this direction. The rendering and artwork here are separate implementations.</p><h2>Your browser</h2><p>Your theme, drawings, and note positions are saved in this browser. Drawings are never published or sent to the server. The clear icon erases drawings only. The default notes are authored by Lucas and published with the site.</p><p>The visits number counts accepted homepage visits, not unique people. It uses an aggregate database counter. The counter service uses a short-lived hash to limit repeated requests; it doesn't retain raw IP addresses. If the service is unavailable, the site says so.</p><p>The music player connects to SoundCloud only when you use it. Playback availability, previews, and ads are controlled by SoundCloud and the artists. The pixel bars show the track’s waveform amplitude at the playhead. Shuffle visits each track before repeating. Tracks come from a snapshot of the linked station; its live recommendations can change.</p><h2 id="site-button">An 88 × 31 button</h2><p><img src="/assets/site-button.svg" width="88" height="31" alt="Lucas Flowers site button"></p><p>You're welcome to link to this site. Copy this snippet and host the button locally if you prefer.</p><pre class="copy-code"><code>&lt;a href="https://lucasflowers.net"&gt;&lt;img src="https://lucasflowers.net/assets/site-button.svg" width="88" height="31" alt="Lucas Flowers"&gt;&lt;/a&gt;</code></pre><h2>Source</h2><p>Built with HTML, CSS, JavaScript, and a small Python build step. <a href="https://github.com/lflowers01/lflowers01.github.io">Source and older versions on GitHub</a>. The old school-project archive is preserved in repository history.</p>'''))
    page("404.html", "Page not found — Lucas Flowers", "This page isn't here.", reading("Nothing here, yet.", "This link may have moved. The notebook and projects are good places to start.", '<p><a href="/">Home</a> · <a href="/notes/">Notebook</a> · <a href="/projects/">Projects</a></p>'))

    # Only replace this builder's dedicated output directory.
    assert OUT.resolve() == ROOT.resolve() / "dist"
    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir()
    for path, html in pages.items():
        dest = OUT / path
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(html, encoding="utf-8")
    for asset in (ROOT / "assets").rglob("*"):
        if asset.is_file() and (asset.suffix.lower() in {".png", ".jpg", ".gif", ".svg", ".woff2", ".ttf", ".css", ".js", ".txt"} or asset.parent.name == "archive"):
            dest = OUT / asset.relative_to(ROOT)
            dest.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(asset, dest)
    shutil.copyfile(ROOT / "assets/plan/Resume.pdf", OUT / "Resume.pdf")
    (OUT / "CNAME").write_text(urlsplit(base).hostname + "\n", encoding="utf-8")
    (OUT / ".nojekyll").touch()
    feed = ET.Element("rss", version="2.0")
    channel = ET.SubElement(feed, "channel")
    for tag, value in {"title":"Lucas Flowers — notebook", "link":base + "/notes/", "description":"Notes on projects, design, and engineering."}.items():
        ET.SubElement(channel, tag).text = value
    for note in site["notes"]:
        item = ET.SubElement(channel, "item")
        for tag, value in {"title":note["title"], "link":base+f"/notes/{note['id']}.html", "guid":base+f"/notes/{note['id']}.html", "description":markdown(note["body"]), "pubDate":format_datetime(datetime.fromisoformat(note["date"]).replace(tzinfo=timezone.utc))}.items():
            ET.SubElement(item, tag).text = value
    ET.ElementTree(feed).write(OUT / "feed.xml", encoding="utf-8", xml_declaration=True)
    sitemap = ET.Element("urlset", xmlns="http://www.sitemaps.org/schemas/sitemap/0.9")
    for path in pages:
        if path != "404.html":
            ET.SubElement(ET.SubElement(sitemap, "url"), "loc").text = base + ("/" if path == "index.html" else "/" + path.replace("index.html", ""))
    ET.ElementTree(sitemap).write(OUT / "sitemap.xml", encoding="utf-8", xml_declaration=True)
    (OUT / "robots.txt").write_text(f"User-agent: *\nAllow: /\nSitemap: {base}/sitemap.xml\n", encoding="utf-8")
    print(f"Built {len(pages)} pages, {len(site['notes'])} notes, RSS, sitemap and assets in {OUT}")


if __name__ == "__main__":
    build()
