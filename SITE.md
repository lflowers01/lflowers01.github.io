# Lucas Flowers — site

The full website builds into `dist/`. The research, design plan (`build.html`), and interaction study (`design-demo.html`) remain separate and are not published by the build.

## Run locally

Requires Python 3.11 or newer. There are no runtime or build package dependencies.

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

## Publish a note

1. Add `content/notes/your-note.md`.
2. Add an entry to `notes` in `content/site.json`: `id`, `title`, `date` (`YYYY-MM-DD`), `excerpt`, `x`, `y`, `color`.
3. Use the filename without `.md` for the ID. Positions are between 0 and 1. The legacy `color` field accepts 0–2; all notes now use the agreed light-yellow lined paper.
4. Build and review. The homepage, notebook index, reading page, RSS, and sitemap update together.

Markdown supports paragraphs, `##` headings and `- ` lists. HTML is escaped. Links belong in the templates or page builder until richer Markdown is needed. Published note text is owner-authored source; visitors can rearrange the notes, with positions saved only in their own browser.

Keep an existing note's `id` when editing it: its reading-page URL and saved board position use that ID. Edit `title` and `excerpt` for the board, and the Markdown file for the full reading page. Clearing ink does not remove notes or reset positions.

`feed.xml` is the notebook RSS feed: people can subscribe with a feed reader to receive new published entries. It contains only the source-authored notes, never drawings. The visible RSS link was removed as requested; feed-reader discovery remains in the page metadata.

## Add a project

Add `content/projects/project-slug.md` and a `projects` entry with `id`, `title`, `date`, `status`, `summary`, and `role`. Follow the existing site's report: context, design, how it works, process/results, and remaining work. Don't present a draft as a completed build. Cards and report pages are generated from the same entry. Projects also take `repo` (GitHub URL) and `image`/`imageAlt`; the image is the card picture and the report's lead screenshot.

High-school work lives in `content/archive.json` and builds into one page, `/projects/archive.html`, listed at the bottom of `/projects/` and never on the homepage. An entry's screenshot is `assets/archive/<id>.jpg` when that file exists. The Squirrel Simulator build from the old site is served at `/assets/archive/squirrel-simulator.html` (33 MB, playable).

## Update personal information and photographs

The homepage introduction and photographs are in `templates/home.html`. The full About page is generated in `scripts/build.py`; shared contact links are in `templates/footer.html`. Keep these contact links and the homepage/full About page consistent when changing the introduction. Replace `assets/plan/Resume.pdf` to update the downloadable résumé; the build copies it to `/Resume.pdf`.

Homepage photographs are the existing processed images in `assets/photos/`. To replace one, update its image path, actual width/height, alt text and caption together in the homepage template. The original versions remain in Git history. Add current project material when it is ready; old dates and historical “Present” labels are not current experience claims.

## Music

The player follows the fourth-generation A1059 reference: a 24:41 body and 5:4 LCD, with site colors. Play/Pause is the bottom wheel button; the center selects menu items or switches the wheel between volume and seeking. Menu goes back, the wheel browses Music/Extras, Settings holds volume and shuffle, and Backlight toggles LCD brightness. [Apple sources and measured layout](research_notes/ipod-gen4-reference.md). Current-track cover art comes from the official widget metadata, is drawn into a 40×40 canvas, and is enlarged with nearest-neighbor pixels. Missing or failed covers stay hidden; track changes clear the previous cover. Shuffle uses every track before repeating, avoids immediate repeats, and lets Previous retrace playback history; turning it off restores station order. The twelve bars follow the actual SoundCloud waveform at the playback position, with no random CSS animation. They represent amplitude, not a live frequency spectrum. [REA evidence and limits](research_notes/soundcloud-waveform.md). A visually hidden official SoundCloud widget handles audio only after someone presses a player control; SoundCloud's standard interface is not shown. No tracks are downloaded or rehosted. Permission delegation includes `autoplay` and `encrypted-media`; playback availability, previews and ads remain platform-controlled.

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
| Browns Peak, Himeji and Kyoto photos | Byte-identical to `9f715fd:assets/carousel/browns-peak.png`, `himeji-castle.jpg`, and `kyoto.JPG`; captions checked against images and the old exchange description |
| Initial notebook entries | Drafted from this site's design discussion, not invented outside experiences |
| Current project | This website, accurately labeled in progress |
| Flower | Byte-identical to `main:favicon.png` at `8b8de30`, restored for the approved design study |

High-school project cards, old awards and historical “Present” roles have not been republished as current work. The older archive remains in Git history. The site’s review copy and personal-interest wording can be edited before release.

## Notes and music visuals

The homepage order is About, Projects, Music, Notes. Published notes are edited in `content/site.json` and `content/notes/`. Arrangements and pixel drawings are private to their browser in localStorage; nothing is uploaded. Visitors cannot add notes. The clear drawing icon erases only ink. Ink is limited to 200 strokes / 6,000 points. Notes use locally hosted Kalam (Indian Type Foundry, SIL OFL) on a 28px ruled grid, snapped to 2px pixels by the `#note-pixels` SVG filter and left unrotated so the pixels stay square. Their drawing/dragging area is a board with a subtle 16px dot grid (a multiple of the 4px ink grid), near-black in OLED and deep green in forest. The Projects section uses the cutting-mat treatment instead: square ruling, edge ticks and decorative angle guides. These are not calibrated physical measurements. Both surfaces keep their decorative layers separate from interactive content.

The music player draws a mirrored horizontal ASCII waveform behind its body, using the same captured track samples as the meter. A moving window follows playback, and brightness follows the current amplitude. Hovering changes a local circle to X dithering; clicking sends an outward brightness ripple through fixed cells, like the hero. These pointer effects do not replace the waveform with a water simulation. The field dims when paused. The rest of the site's audio response is much subtler. This is waveform amplitude, not live frequency analysis. Flower growth uses the existing pixel frames with eased timing; no pixels were redrawn.

Seeking commits after the range interaction finishes. A finish event near a middle-of-track seek cannot trigger Next; natural auto-advance requires a position near the verified track end. SoundCloud controls which positions are playable. Chrome regression checks cover false-finish protection and real-end advancement.
