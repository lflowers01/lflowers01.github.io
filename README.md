# Lucas Flowers — personal website

The full site is now implemented alongside this research library. [Build, run, edit content, and hosting notes](SITE.md). Source content is in `content/`; `python scripts/build.py` generates `dist/`. The design-review pages remain available separately.

## Edit the website

These are the folders you edit; `dist/` is generated output.

| Content | Folder | How it appears |
| --- | --- | --- |
| Photos | [`assets/photos/`](assets/photos/) | Add/remove JPG, JPEG, PNG or WebP files. Three distinct photos are randomly chosen on refresh, shown as draggable portrait prints. Saved positions persist independently of the images. Click focuses the original; Escape or X closes it. |
| Notes / blog posts | [`content/notes/`](content/notes/) | Drop in a Markdown file. The newest three become pinned notes; every published post gets a reading page and appears in the notebook index, RSS and sitemap. |
| Projects | [`content/projects/`](content/projects/) | Drop in a Markdown report. The newest three appear on the homepage; all published projects get cards and report pages in `/projects/`. |

The full photo-folder path is `C:\Users\fartpad\Documents\GitHub\lflowers01.github.io\assets\photos`. Optional photo captions and alt text are keyed by filename in [`content/photos.json`](content/photos.json); otherwise the caption comes from the filename. The original files are kept unchanged; portrait cropping happens in CSS.

Put optional YAML front matter at the top of a note:

```markdown
---
title: A new experiment
date: 2026-10-19
summary: A short description for the pinned note.
---

Write your post here. **Bold**, lists, links, images, quotes and fenced code blocks work.
```

Projects use the same format, with optional extra fields:

```markdown
---
title: My project
date: 2026-10-19
summary: What I built and why.
status: In progress
role: Design and development
repo: https://github.com/lflowers01/my-project
image: /assets/projects/my-project.png
image_alt: A useful description of the screenshot
---

## The problem

Write the project report here.
```

`repo`, `image` and `image_alt` are optional. You can also drop in plain Markdown: a leading `# Heading` supplies the title, the first paragraph supplies the summary, and the date comes from a `YYYY-MM-DD` filename prefix or the file's modified date. Explicit dates are recommended so Git checkouts do not change publication dates. Filenames determine URLs; keep them stable after publishing.

Set `draft: true` to exclude a file from every page, RSS and sitemap. Files starting with `_` are ignored. Copy-ready templates live in [`content/_templates/`](content/_templates/); move a copy into the appropriate folder, rename it, and remove `draft: true` when ready. Deleting a Markdown file removes its generated page on the next build. No notes/projects registry in `site.json` is needed. High-school projects remain separate in [`content/archive.json`](content/archive.json), off the homepage.

After changing files:

```powershell
python -m pip install -r requirements.txt  # first setup only
python scripts/build.py
python scripts/serve.py --port 49280      # if the preview server isn't running
```

Refresh [the local preview](http://127.0.0.1:49280/). If the server is already running, rebuild and refresh; there is no file watcher or automatic deployment. Build errors name the Markdown file to fix and leave the last successful output intact. See [SITE.md](SITE.md) for hosting, saved browser data, music and the research provenance.

## Interactive desk

[The homepage](http://127.0.0.1:49280/) now combines music, notes and drawing on one desk. The old `/desk-demo.html` address redirects there. Use the grip above the iPod to move it; its playback controls keep their normal behavior. Notes start in a non-overlapping layout that adapts to their size and the screen. Saved arrangements take precedence. The waveform is part of the desktop beneath the iPod, paper and ink.

The dot button to the left of Clear switches ink to falling sand. Drag to pour; the floor catches grains and builds piles. Switch back to drawing to let the sand drain through the bottom. Sand and ink share the same palette color. Sand mode/piles are saved separately from ink, and Clear empties either without moving notes or the iPod. Physics runs at a fixed time step, independently of display refresh rate. SoundCloud's actual waveform amplitude drives gentle surface motion; sustained envelope energy is weighted more than sharp transients. This is a bass-like approximation, **not a measurement of bass/treble frequencies**: the widget does not expose PCM or frequency bands.

The previous separate layout remains at [classic.html](http://127.0.0.1:49280/classic.html), with its original browser data intact. The desk has separate storage keys. Source: `templates/desk.html`, `assets/desk.css`, `assets/desk.js`, `assets/notebook.js`, `assets/sand.js`. Pencils and ruler were removed after review.

Current design review: [build.html](build.html). Try the [OLED / ASCII / sticky-note interaction study](design-demo.html), with [Purdue Hackers REA findings](research_notes/purdue-hackers-interaction-study.md). The new-site plan focuses on college/current content; historical project research below is archival context.

A Markdown idea library for a **Web 1.0 personal portfolio**: many possible worlds, small interactive toys, personal writing, music and connections to other people. This preserves the research that informed the website.

Checked October 18, 2026. Start with a visual language, choose content you want to maintain, then add one signature toy. The chapters distinguish public-page observations, author documentation, REA browser evidence and our proposed reconstruction recipes.

## Start here

| Read | What you can find |
|---|---|
| [Your site's own history](library/site-history.md) | **Six historical phases and ten existing project cards**, plus terminal/desktop/theme/music experiments and continuity options grounded in your own source |
| [Design languages](library/design-languages.md) | **12 style cards** with references, visual grammar, portfolio adaptations and mobile alternatives; **16 short visual patterns** |
| [Interactive elements](library/interactive-elements.md) | **18 detailed recipes**: dithering, ASCII, pets, trails, windows, skins, easter eggs and little games |
| [Content and community](library/community-and-content.md) | **19 detailed recipes**: projects, quick notes, friends, rings, guestbooks, shared numbers, music and feeds |
| [Purdue Hackers member sites](library/purdue-webring.md) | **All 31 current member destinations checked**, nine new REA targets, and practical adaptations for your own Web 1.0 site |
| [Research synthesis](reports/Personal%20portfolio%20reference%20library.md) | How the references fit together, four mixable directions, implementation order and evidence limits |
| [Original research](reports/Web%20playground%20design%20research.md) | The earlier shortlist, Webamp/Poolsuite studies and detailed Purdue ring guidance |

These five chapters preserve both outside references and your existing work. The counts describe chapter entries, not unique features or distinct websites; some ideas deliberately recur in different contexts.

Start with [the history chapter](library/site-history.md#content-you-already-have-for-a-future-project-shelf) before treating the project shelf as empty. Your archive already includes Team Epsilon, the Bluey Jamboard, a balloon-camera system, vision-saw research, a projectile simulator, a Minecraft tool and earlier games/tools. Their saved descriptions and “Present” dates are historical claims to refresh, not verified October 2026 status. [Forest desktop, engineering field station and old-disks shelf](library/site-history.md#three-continuity-options) connect the outside inspiration to your own terminal, desktop, themes, photos and Webamp experiment.

## Find an idea quickly

| I want… | Design/reference path | Technical recipe |
|---|---|---|
| A busy GeoCities home | [Collage language](library/design-languages.md#1-geocities-maximalism) | [Wallpaper and borders](library/interactive-elements.md#e10--tiled-wallpapers-image-borders-and-graphic-dividers) |
| A readable old-web technical page | [Handcrafted HTML](library/design-languages.md#2-handcrafted-html-home) | [Project shelf](library/community-and-content.md#c03--workbench-project-shelf-with-honest-empty-slots) |
| A BBS or transmission terminal | [Terminal language](library/design-languages.md#3-terminal-and-bbs) | [ASCII field](library/interactive-elements.md#e03--a-living-ascii-nameplate-or-signal-field) |
| A personal computer desktop | [Windows language](library/design-languages.md#4-windows-desktop) | [Window behavior](library/interactive-elements.md#e13--desktop-windows-that-open-move-and-close) |
| A pixel dollhouse or shrine | [Ornate home](library/design-languages.md#5-ornate-pixel-dollhouse) | [Shrines and collections](library/community-and-content.md#c05--a-topic-shrine-media-shelf-or-field-journal) |
| A room or robotics workbench | [Room language](library/design-languages.md#6-illustrated-room-or-map) | [Hotspots with direct links](library/interactive-elements.md#e12--a-room-workbench-or-image-map-homepage) |
| Dithering beyond a filter | [Cyber transmission](library/design-languages.md#9-dithered-cyber-transmission) | [Still image pipeline](library/interactive-elements.md#e01--dithered-portraits-and-project-photographs), [pointer reveal](library/interactive-elements.md#e02--a-portrait-that-resolves-under-the-pointer) |
| Moving ASCII art | [Terminal language](library/design-languages.md#3-terminal-and-bbs) | [Projected object](library/interactive-elements.md#e04--an-ascii-robot-cube-or-spinning-gear) |
| A tiny pet or cursor flourish | [Toybox culture](library/community-and-content.md#c07--toybox-adoptables-stamps-and-tiny-clubs) | [Follower](library/interactive-elements.md#e05--a-cat-or-robot-that-follows-visitors), [dust](library/interactive-elements.md#e07--fairy-dust-snow-or-pixel-sparks) |
| Quick thoughts people can follow | [Zine language](library/design-languages.md#7-scrapbook-and-zine) | [Brain buffer](library/community-and-content.md#c01--brain-buffer-or-micro-notebook), [Atom](library/community-and-content.md#c15--rss-or-atom-from-the-same-notes) |
| One number saved for everyone | [Community instrument](library/design-languages.md#12-living-community-instrument) | [Boops/shared pet](library/community-and-content.md#c12--shared-robot-boops-watering-can-or-community-pet), [visitor count](library/community-and-content.md#c11--odometer-visitor-counter-or-coarse-visitor-map) |
| Winamp or a personal radio | [Player language](library/design-languages.md#11-media-player-skin) | [Webamp](library/community-and-content.md#c16--webamp-window-and-a-tiny-skin-shelf), [cassette deck](library/community-and-content.md#c17--cassette-deck-cd-shelf-or-personal-radio) |
| Neighbors and a visible ring station | [Portal language](library/design-languages.md#10-early-portal-or-neighborhood) | [88×31 shelf](library/community-and-content.md#a-neighborhood-rather-than-a-social-feed), [Purdue ring](library/community-and-content.md#c08--ring-station-web-clique-and-next-door-navigation) |
| An easter egg with a reason to exist | [Exploration language](library/design-languages.md#6-illustrated-room-or-map) | [Secret doors/stamps](library/interactive-elements.md#e15--secret-doors-discovery-stamps-and-small-puzzles) |

## Reference shelf by role

These are selected entry points, not a second copy of every chapter's catalog. A fetched page is an invitation to browse; it is not a certificate of visual quality or working interactions.

| Role | Open examples | Learn more |
|---|---|---|
| Handmade, dense and personal | [OMFG](https://omfg.neocities.org/), [Neustadt](https://neustadt.fr/), [Cyber Vanguard](https://cyber.dabamos.de/) | [Style cards](library/design-languages.md#browse-by-mood) |
| Pixel home, fan shrine, collage | [cinni](https://cinni.net/), [fauux](https://fauux.neocities.org/), [Cameron's World](https://www.cameronsworld.net/) | [Design languages](library/design-languages.md) |
| Terminals and desktop worlds | [tilde.town](https://tilde.town/), [98.js](https://98.js.org/), [Poolsuite](https://poolsuite.net/) | [Design REA ledger](library/design-languages.md#rea-evidence-ledger-and-boundaries) |
| Dithering and ASCII | [apvl write-up](https://apvl.dev/stuff/personal-portfolio/), [Xiokka's Notepad](https://xiokka.neocities.org/notepad), [ASCII Play](https://play.ertdfgcvb.xyz/), [donut math](https://www.a1k0n.net/2011/07/20/donut-math.html) | [Element recipes](library/interactive-elements.md) |
| Pets and pointer play | [Ari/adryd](https://adryd.com/), [GifyPet](https://gify.pet/), [cursor effects](https://tholman.com/cursor-effects/) | [Element REA ledger](library/interactive-elements.md#rea-receipts-and-precise-limits) |
| Living logs and media shelves | [Kerka](https://kerka.neocities.org/log/), [Grlrot](https://grlrot.neocities.org/), [Jubilife Vibes](https://jubilifevibes.neocities.org/) | [Community reference shelf](library/community-and-content.md#reference-shelf) |
| Hobbies, collections and neighborhood | [PIXELDEW](https://pixeldew.nekoweb.org/pages/home.html), [purgamentum exit](https://notprincehamlet.neocities.org/), [NekoDirectory](https://nekodir.nekoweb.org/) | [Community recipes](library/community-and-content.md) |
| Music as an object | [Webamp](https://webamp.org/), [Winamp Skin Museum](https://skins.webamp.org/) | [Player recipes](library/community-and-content.md#c16--webamp-window-and-a-tiny-skin-shelf) |

For another browsing route: **quiet HTML home → terminal journal → robot workshop → dorm computer → radio outpost → pixel scrapbook**. These are mixable directions, not an instruction to combine all the effects.

## Explore the actual Purdue neighborhood

The [member-site study](library/purdue-webring.md) checks every destination in the [31-member snapshot](research_notes/Personal%20portfolio%20reference%20library/purdue-members.json), with honest retrieval and interaction limits. Not every member uses Web 1.0 styling; the recipes show how to adapt interesting mechanisms into that language.

| Discovery | Jump to a reconstruction |
|---|---|
| Anish's ASCII river with browser-local totals | [ASCII ecosystem](library/purdue-webring.md#an-ascii-river-that-keeps-a-local-history) |
| Charlie's Clouds appearance switch | [Whole-atmosphere skins](library/purdue-webring.md#change-the-whole-atmosphere-with-clouds) |
| Alicia's resolving text/computer artwork | [Finite character decode](library/purdue-webring.md#let-text-decode-into-a-name-or-ascii-mascot) |
| dbmaindex's font choice; Artus/Jadden themes | [Readable bitmap alternative](library/purdue-webring.md#offer-readable-type-without-abandoning-bitmap-headings), [status-board/theme ideas](library/purdue-webring.md#a-homepage-can-be-a-personal-status-board) |
| Arhan's executed local page-erasure joke | [Recoverable theatrical egg](library/purdue-webring.md#rb01--a-terminal-prompt-that-performs-a-theatrical-local-easter-egg) |
| Trev3D's circular project previews | [Dithered project portholes](library/purdue-webring.md#rb02--project-portholes-with-hover-revealed-labels-and-duotone-treatment) |
| Grace's seeded tree; KimJammer's rotating identities | [Generated landscape](library/purdue-webring.md#rb03--a-persistent-looking-generated-landscape-without-a-shared-database), [mechanical name sign](library/purdue-webring.md#rb04--rotating-aliases-and-roles-in-a-tiny-mechanical-sign) |

## Evidence and reconstruction

[Current research notes](research_notes/Personal%20portfolio%20reference%20library/) and [compact REA receipts](research_notes/Personal%20portfolio%20reference%20library/evidence/) sit beside the library. [Original notes](research_notes/Web%20playground%20design%20research/) and [original REA receipts](research_notes/Web%20playground%20design%20research/evidence/) remain available.

Each chapter links direct sources and gives narrower evidence boundaries. REA receipts are selected extracts, not complete portable Evidence bundles. A DOM change proves that captured change; it does not prove audible music, smooth animation, phone usability, every backend behavior or licensing. The design and Purdue chapters include reviewed screenshot observations for specifically identified captures. The expansion studies **17 new REA targets** across the four outside-reference chapters; the earlier Webamp/Poolsuite studies remain separate. The fifth chapter uses read-only Git/source history, not historical runtime captures; its [ref snapshot](research_notes/Personal%20portfolio%20reference%20library/repo-refs.json) and [history notes](research_notes/Personal%20portfolio%20reference%20library/repo-history.md) preserve the inspection boundary. A branch named deployment does not establish what is currently served.

No website, database, service account, deployment or ring submission was created for this library. Before implementation, choose original/permitted assets and test the specific interactions you select on keyboard, touch, reduced motion and small screens. Keep ordinary project, notes, contact and ring links outside optional toys.
