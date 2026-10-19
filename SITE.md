# Lucas Flowers — site

The full website builds into `dist/`. The research, design plan (`build.html`), and interaction study (`design-demo.html`) remain separate and are not published by the build.

## Run locally

Requires Python 3.11 or newer. Install the build dependencies with `python -m pip install -r requirements.txt` (Markdown-it and PyYAML). The local server uses only the Python standard library.

```powershell
python scripts/build.py
python scripts/serve.py --port 49280
```

Open `http://127.0.0.1:49280/`. This serves the actual website and its SQLite visit counter. The database is `.local/visits.sqlite3`, outside the public directory and ignored by Git. Rebuilding the website does not reset it. Back it up with SQLite's backup API before moving hosts.

```powershell
python -m unittest discover -s tests -p test_site.py -v
python tests/site_browser.py
```

The browser check requires the existing Playwright Python package and Chromium. Set `BROWSER_EXECUTABLE` to a Chrome executable path to run it in Chrome; the test reports the executable and version. It never requests SoundCloud audio: it tests the player adapter against a controlled widget fixture. The owner confirmed audible playback in their regular browser. The isolated test browsers do not support the protected-track DRM, so automated player checks use a controlled widget fixture, separately from that owner confirmation. Edge-case checks also ran in official Chrome for Testing 155.0.8059.84. The player reports failure if playback stalls rather than advancing a fake timer.

## Publish notes and projects

Follow the folder workflow and front matter examples in [README.md](README.md#edit-the-website). Notes are discovered from `content/notes/*.md`, and project reports from `content/projects/*.md`; `site.json` contains site/music configuration only. No registry entry is needed. Copy-ready draft templates are in `content/_templates/`.

Notes and projects sort newest first. The homepage shows the latest three of each; their indexes and reading pages include every published file. Set `draft: true` or start a filename with `_` to keep work out of published HTML, RSS and the sitemap. The filename determines the stable URL. Rename an existing file only if its URL should change. Deleting a file removes its generated page on rebuild. All files are validated before the previous output is removed.

Markdown supports CommonMark paragraphs, headings, links, images, emphasis, lists, block quotes and fenced code. Raw HTML is escaped. Front matter uses YAML; quote titles with colons. Optional `x` and `y` fields (0–1) set a note's initial position in the classic layout; the main desk calculates non-overlapping defaults automatically. Browser-saved arrangements take precedence, and clearing ink leaves notes and positions intact. The default positions are spread across the board.

The `feed.xml` RSS feed contains all published source-authored notes and no private drawings. Feed-reader discovery is present in page metadata. Project `repo`, `image` and `image_alt` are optional; local images go in `/assets/`. Unknown metadata fields, invalid dates and unsafe URLs fail with a filename-specific error. A plain Markdown file gets its title from its first H1 or filename, its summary from its first paragraph, and its date from the filename prefix or file modification date; explicit dates are best for stable publishing.

High-school work lives in `content/archive.json` and builds into one page, `/projects/archive.html`, listed at the bottom of `/projects/` and never on the homepage. An entry's screenshot is `assets/archive/<id>.jpg` when that file exists. The Squirrel Simulator build from the old site is served at `/assets/archive/squirrel-simulator.html` (33 MB, playable).

## Update personal information and photographs

The homepage introduction and photographs are in `templates/home.html`. The full About page is generated in `scripts/build.py`; shared contact links are in `templates/footer.html`. Keep these contact links and the homepage/full About page consistent when changing the introduction. Replace `assets/plan/Resume.pdf` to update the downloadable résumé; the build copies it to `/Resume.pdf`.

Homepage photographs live in **`C:\Users\fartpad\Documents\GitHub\lflowers01.github.io\assets\photos`**. Add or remove `.jpg`, `.jpeg`, `.png` or `.webp` files there, then run `python scripts/build.py`. Each refresh chooses three distinct photos from the folder (or all remaining photos if fewer than three). `content/photos.json` supplies optional captions and alt text keyed by filename; files without an override get a caption from their filename, so `my-new-photo.jpg` becomes “My new photo.” Metadata for a deleted file is ignored. Images are shown through a centered 3:4 portrait crop; clicking focuses the unchanged original in a dialog without changing the URL. Escape, the X button or the X key closes it. Drag or focus a print and use arrow keys to arrange it. The three positions are saved in localStorage, independently of which random photos fill them, and kept within the photo area when resizing. With no saved position for a slot, it returns to the evenly spaced default row. The historical carousel's 22 processed images were restored from `9f715fd:assets/carousel/` without original-file duplicates; the new Purdue image makes 23.

## Music

The player follows the fourth-generation A1059 reference: a 24:41 body and 5:4 LCD, with site colors. Play/Pause is the bottom wheel button; the center selects menu items or switches the wheel between volume and seeking. Menu goes back, the wheel browses Music/Extras, Settings holds volume and shuffle, and Backlight toggles LCD brightness. [Apple sources and measured layout](research_notes/ipod-gen4-reference.md). Current-track cover art comes from the official widget metadata, is drawn into a 40×40 canvas, and is enlarged with nearest-neighbor pixels. Missing or failed covers stay hidden; track changes clear the previous cover. Shuffle starts enabled on each page load with a random initial track, uses every track before repeating, avoids immediate repeats, and lets Previous retrace playback history; turning it off restores station order. The twelve bars follow the actual SoundCloud waveform at the playback position, with no random CSS animation. They represent amplitude, not a live frequency spectrum. [REA evidence and limits](research_notes/soundcloud-waveform.md). A visually hidden official SoundCloud widget handles audio only after someone presses a player control; SoundCloud's standard interface is not shown. No tracks are downloaded or rehosted. Permission delegation includes `autoplay` and `encrypted-media`; playback availability, previews and ads remain platform-controlled.

The default discovery-station URL is in `content/site.json`. SoundCloud's oEmbed endpoint returned 404 for this system station, so the player uses 49 track IDs from its public station data at inspection, with artist/title metadata from official oEmbed responses. This is a snapshot of the station, not its changing live recommendation queue. Change the `tracks` list to swap the default selection. Each entry requires `id`, `title`, `artist`, and artist `url`; leave attribution intact. The source link opens the station initially and follows an imported selection. No account key or scraped client credential is embedded.

The fourth main-menu row is **SoundCloud Link**, replacing the reference device's redundant Shuffle Songs row; shuffle remains in Settings. This accepts a public `soundcloud.com` track or playlist link and normalizes HTTP links to HTTPS. The official widget supplies its track list through `getSounds`, with `getCurrentSound` as a single-track fallback; the site accepts up to 500 validated tracks. See the [official Widget API](https://developers.soundcloud.com/docs/api/html5-widget). The selection affects this page only and is not saved to shared configuration or browser storage. **Default station** restores the original 49 tracks. Discovery-station URLs are not supported by this importer; the default station uses the snapshot described above. Availability of other public links still depends on SoundCloud.

Some full songs expose a 30,000ms preview in metadata `duration`, even while the widget plays the full song. Live inspection found one track with `duration:30000`, `full_duration:207000`, and widget duration 207000. Matching the wrong field made both visualizers stay flat while audio and the timer continued. The visualizer now compares `full_duration || duration` with the widget duration. Transient waveform fetch failures or stale current-sound metadata receive at most two retries; missing, invalid, or mismatched data stays quiet without interrupting playback.

## Counter and hosting

The included server supplies `GET /api/visits` and `POST /api/visits` with `{}`. GET never increments. The homepage POSTs once per tab session; reloads and other pages read the current total. The server atomically increments SQLite and caps requests at 30 per source/minute and 300 globally/minute. Rate-limit keys are short-lived HMACs, not raw visitor addresses. Old keys are removed on the next write. A missing service shows “Unavailable,” never a made-up number.

This server binds to loopback by default. For a public self-hosted release, run it behind an HTTPS reverse proxy, set `SITE_ORIGIN=https://lucasflowers.net`, and keep `.local/` on persistent storage outside `dist/`. The current server uses the connecting address and intentionally doesn't trust arbitrary forwarded-address headers. Configure a trusted proxy-aware limiter before relying on per-visitor throttling behind a proxy; the global cap still applies. Use one counter database, not independent copies across processes/hosts.

`dist/` is also static-host compatible, including GitHub Pages. **GitHub Pages cannot run the Python counter.** It needs a separately deployed API at the configured `counterEndpoint` (and that service must allow the website origin); otherwise the counter explicitly reports unavailable. No remote service, hosting setting, DNS record, main/deployment branch, or production counter has been changed. A public release destination remains to be selected/approved.

## Webring

The visible link opens the Purdue Hackers directory. `ringNavigation` stays false during local review, so the site does not offer next/previous links that cannot recognize an unpublished page. When preparing the public release, set `ringNavigation` to true and rebuild before requesting enrollment, so maintainers can check the required homepage links. Follow the ring's current joining instructions. This adds the three required links, with same-tab previous/next and the canonical domain as host. Enrollment requires the owner's message in the Purdue Hackers Discord; no message was sent on their behalf.

## Content provenance

| Content | Source |
| --- | --- |
| Purdue, Robotics Engineering Technology, Honors College | `main:index.html` at `8b8de30` |
| LinkedIn, email, GitHub, résumé | Same latest main; résumé copied byte-for-byte from `public/Resume.pdf` |
| Hiking, music, digital/physical art interests | `4003915:src/index.html`; retained as broad interests, without old current-role claims |
| Browns Peak and Himeji photos | Byte-identical to `9f715fd:assets/carousel/browns-peak.png` and `himeji-castle.jpg`; the original Kyoto image remains in source |
| Boiler up photo | Owner-supplied Purdue photograph, replacing Kyoto on the homepage; copied unchanged into `assets/photos/boiler-up.png` |
| Initial notebook entries | Drafted from this site's design discussion, not invented outside experiences |
| Current project | This website, accurately labeled in progress |
| Flower | Byte-identical to `main:favicon.png` at `8b8de30`, restored for the approved design study |

Current homepage projects are Academic Dashboard and PaintedDesktop, as supplied in the latest owner edits. Ten high-school projects are preserved separately in `content/archive.json` and `/projects/archive.html`, accessible through the projects index. Historical projects stay off the homepage. The site’s review copy and personal-interest wording can be edited before release.

## Notes and music visuals

The homepage order is About, Projects, then the combined music/notes desk. Published notes are edited directly in `content/notes/`; project reports are in `content/projects/`. Arrangements and pixel drawings are private to their browser in localStorage; nothing is uploaded. Visitors cannot add notes. The clear drawing icon erases only ink. Ink is limited to 200 strokes / 6,000 points. Notes use locally hosted Kalam (Indian Type Foundry, SIL OFL) on a 28px ruled grid, snapped to 2px pixels by the `#note-pixels` SVG filter and left unrotated so the pixels stay square. Their drawing/dragging area is a board with a subtle 16px dot grid (a multiple of the 4px ink grid), near-black in OLED and deep green in forest. The Projects section uses the cutting-mat treatment instead: square ruling, edge ticks and decorative angle guides. These are not calibrated physical measurements. Both surfaces keep their decorative layers separate from interactive content.

The music player draws a mirrored horizontal ASCII waveform behind its body, using the same captured track samples as the meter. A moving window follows playback, and brightness follows the current amplitude. Hovering changes a local circle to X dithering; clicking sends an outward brightness ripple through fixed cells, like the hero. These pointer effects do not replace the waveform with a water simulation. The field dims when paused. The rest of the site's audio response is much subtler. This is waveform amplitude, not live frequency analysis. Flower growth uses the existing pixel frames with eased timing; no pixels were redrawn.

Seeking commits after the range interaction finishes. A finish event near a middle-of-track seek cannot trigger Next; natural auto-advance requires a position near the verified track end. SoundCloud controls which positions are playable. Chrome regression checks cover false-finish protection and real-end advancement.

## Main desk, falling sand and Game of Life

The approved desk is on `/`; `/desk-demo.html` redirects to it. `/classic.html` retains the previous layout, is marked noindex and excluded from the sitemap. Main desk arrangement uses `desk.items.v1`; its ink, sand and note positions use `desk.lf.notes.ink.v1`, `desk.lf.notes.sand.v1` and `desk.lf.board.positions.v1`. Previous preview and classic keys are left intact. Dragging suppresses pointer focus outlines while keyboard navigation keeps them.

Three separate pixel buttons immediately left of Clear select Draw, Sand and Game of Life. Life reuses the current pixels, runs Conway B3/S23 on the same 4px grid every 150ms, and uses dead boundaries. Drawing adds live cells. Life to Draw freezes the current cells; Life to Sand makes them fall. Life cells and selection persist, and stable patterns stop scheduling frames until edited. Ink converts to 4px sand grains; holding the drawing surface pours more. Grains collide and settle, and selecting Draw removes the floor to drain them. Mode/piles persist; snapshots are validated before restore. Fixed 120 Hz physics ticks normalize 30/60/144 Hz display rates. Gravity update order and independent grain movement prevent rigid row sheets. Surface vibration follows actual SoundCloud amplitude with a slow-envelope preference, not real bass/treble analysis, since the iframe does not supply PCM. Sand, ink and the icon all use the shared accent color. Clear empties ink/sand/Life without changing arrangements.
