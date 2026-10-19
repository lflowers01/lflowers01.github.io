# Your site's own design history

Checked October 18, 2026, using read-only Git inspection of this repository and its branch history. Your new Web 1.0 direction already has substantial roots in your own work: a terminal site, a Windows-style portfolio, pixel fonts, themes, a photo carousel, a Webamp experiment and a growing engineering archive. The useful design question is which of those threads to develop, rather than treating the next site as a completely unrelated identity.

This chapter distinguishes source-described behavior from observed runtime behavior. Historical pages were not executed or rendered. Colors, layout and interaction descriptions below come from HTML/CSS/JavaScript, not screenshots. Old biographies and “Present” dates are dated self-descriptions, not confirmation of current roles or project status.

## Branches and repository identity

The configured origin is [lflowers01/lflowers01.github.io](https://github.com/lflowers01/lflowers01.github.io). `git ls-remote --heads origin` returned only main and deployment, both matching cached remote-tracking refs, so no fetch was needed. The active local research branch is not a remote head in that snapshot.

| Ref | Snapshot tip at inspection | Date recorded in commit | What it contains |
|---|---|---|---|
| `main`, `origin/main`, `origin/HEAD` | `8b8de307a3bc8cf8e89e295f1edb59fd88a0a762` | September 10, 2026, 13:21 −04:00 | Earth/cream homepage; high-school archive; headshot/favicon; Resume and portfolio PDFs; small Vite setup. |
| `deployment`, `origin/deployment` | `43d6e4fcbffb4ea251c29ad269f88dd9d140b048` | December 30, 2025, 13:11 −07:00 | Built HTML/CSS/hashed JavaScript, old projects, photo assets, fonts and Winamp skins. |
| `codex/webring-research` | `f5c1de7d9852a214d84edd9450a095f5d17db500` | October 18, 2026, 18:22 −04:00 | Clean research base descended from main; current library/report files are being added on this branch. |
| `refs/stash` (not a branch) | `a2588e0e0c7421ae6336d612d29ebb0fcef914d4` | July 17, 2026, 01:18 −04:00 | A saved deployment working state differing in dependency-lock/cache files, not a separate homepage design. It was inspected but never applied. |

The word “deployment” is a branch name, not proof that those files are currently served. Both old and newer trees contain a CNAME naming `lucasflowers.net`; this is repository configuration, not a DNS/production check. The [main Vite config](https://github.com/lflowers01/lflowers01.github.io/blob/8b8de307a3bc8cf8e89e295f1edb59fd88a0a762/vite.config.js#L1) declares the root index entry; main's public directory contains the archive and PDFs. No hosting settings, branch pointers or production files were changed during this history inspection.

## Six meaningful phases

Commit dates below retain their recorded timezone. For these selected milestones author and committer timestamps match. Some other commits do not: `09c0db4` has a March 24, 2024 author timestamp and a July 17, 2024 committer timestamp. A commit timestamp documents repository history, not the day a design became public.

### 1. May 2023 — a playable thing came first

The first commit, `e6a086a761105364419df7288e7ef65a6de281e0`, is a TurboWarp-packaged **Squirrel Simulator 3.000** page, not a conventional portfolio. Its title and generated-packager comment are visible at [index.html lines 1–9](https://github.com/lflowers01/lflowers01.github.io/blob/e6a086a761105364419df7288e7ef65a6de281e0/index.html#L1). Subsequent May revisions still carried the game. That is a useful origin: your web presence started with something a visitor could play.

**Continuity:** an “old disks” or toy shelf would be more personal than adding an unrelated generic minigame. Preserve its original era and title; do not label it a new project.

### 2. August 2023 — a terminal as navigation

Commit `887beba77ab987f7e0eaf4d6435be39e07067d00`, authored August 31, 2023, is named “new terminal look.” It introduces a command-window vocabulary: `C:\WINDOWS\system32\cmd.exe`, `./lucasflowers.bat`, `./help`, and ABOUT/PROJECTS/RESUME links. The instructions tell visitors to click the tags. This is terminal-styled linked navigation, not evidence of a functioning typed-command interpreter. [HTML lines 135–175](https://github.com/lflowers01/lflowers01.github.io/blob/887beba77ab987f7e0eaf4d6435be39e07067d00/index.html#L135).

CSS specifies white monospace text, **Red Hat Mono**, a blue `#277ef5` title region and black panels. The wider site includes about/projects pages, the game, password-tool files and a multipage school site. [CSS](https://github.com/lflowers01/lflowers01.github.io/blob/887beba77ab987f7e0eaf4d6435be39e07067d00/index.css#L1).

**Continuity:** keep the prompt-like labels or a tiny help panel if the new direction is a transmission station. A real command interface would be a new optional feature, not something to claim you already had.

### 3. April 2025 — the portfolio becomes a personal desktop

The April 1, 2025 “V2” commit `4003915e9274e5ee5ce00304e0909b4517a5a4b9` adds a structured source/build setup, a window layout, photos and a richer introduction. The source explicitly mentions programming, design, leadership, hiking, music, the gym, and digital/physical art, alongside robotics. [Introduction lines 34–42](https://github.com/lflowers01/lflowers01.github.io/blob/4003915e9274e5ee5ce00304e0909b4517a5a4b9/src/index.html#L34).

Styling uses FreePixel headings, pxplus assets, wavy underlines, navy links and a two-column text/photo arrangement. Those are concrete precedents for a less formal personal site. [Styles lines 11–60](https://github.com/lflowers01/lflowers01.github.io/blob/4003915e9274e5ee5ce00304e0909b4517a5a4b9/src/scss/index.scss#L11).

A Winamp partial includes Webamp 1.4.0, a green skin and placeholder song URLs. That proves an integration experiment existed in source; it does **not** establish a working playlist or that the partial appeared in the served homepage. [Winamp partial](https://github.com/lflowers01/lflowers01.github.io/blob/4003915e9274e5ee5ce00304e0909b4517a5a4b9/src/partials/winamp.html#L1).

**Continuity:** a listening booth and photo scrapbook fit documented interests. Revisit the idea with actual permitted tracks and a deliberate player choice rather than treating placeholder configuration as a finished feature.

### 4. December 2025 — skins and a denser archive

Commit `893cac9fdbb6dffe5aa34f5610e2c9226a5381ec`, December 27, 2025, is titled “three themes! and more.” It cycles **default → dark-mode → forest-mode**, saves the choice under localStorage key `theme`, and applies body classes. [Theme script lines 4–57](https://github.com/lflowers01/lflowers01.github.io/blob/893cac9fdbb6dffe5aa34f5610e2c9226a5381ec/src/js/dark-mode.js#L4).

The default tokens include teal `#108483`, gray `#c0c0c0` and navy `#000080`; dark mode uses black/white/magenta with a tiled GIF; forest uses greens including `#1a4a31` and a background-image asset. [Theme styles lines 7–56](https://github.com/lflowers01/lflowers01.github.io/blob/893cac9fdbb6dffe5aa34f5610e2c9226a5381ec/src/scss/index.scss#L7). The names describe configured themes; their actual rendered quality was not assessed.

The December 30 deployment tip preserves the built desktop version: 98.css, named window panels, a carousel with Prev/Next and a count, projects, education, experience and certifications. [Built homepage](https://github.com/lflowers01/lflowers01.github.io/blob/43d6e4fcbffb4ea251c29ad269f88dd9d140b048/index.html#L1). It is a recoverable snapshot, not necessarily the current live site.

**Continuity:** theme choice already belongs to your site's vocabulary. New skins could vary mood within one site instead of multiplying separate design systems.

### 5. July 2026 — more media and deeper project stories

The July 16 “updated v2” commit `9f715fd9e08b811ac7fc577031ccb364526af1e3` preserves a larger asset collection with original/processed image pairs, photo metadata, a plain-text engineering portfolio and the older games/tools. This is much richer context than the present landing page alone. [July homepage](https://github.com/lflowers01/lflowers01.github.io/blob/9f715fd9e08b811ac7fc577031ccb364526af1e3/index.html#L1), [plain-text portfolio](https://github.com/lflowers01/lflowers01.github.io/blob/9f715fd9e08b811ac7fc577031ccb364526af1e3/plainText-portfolio.txt#L1).

The carousel source reads metadata, creates image elements with descriptions, displays an index and advances every ten seconds. It has explicit Prev/Next handlers; this is source-described behavior, not a new runtime test. [Carousel lines 14–110](https://github.com/lflowers01/lflowers01.github.io/blob/9f715fd9e08b811ac7fc577031ccb364526af1e3/js/carousel.js#L14). Some generated descriptions are filenames rather than meaningful captions.

**Continuity:** a photo drawer could tell the hiking/Japan/robotics side of the story. Rewrite captions around the actual photos before reuse. File names alone are not visual verification of location or subject.

### 6. August–September 2026 — a quieter front door, history behind it

The August 10 “site in progress page” commit `63ef821ab0937d02ffe5af5fd9fe255364bd63fe` replaces the larger site with a small introduction. Later August edits settle the earth/cream window direction and add the archive; September's main tip updates Resume.pdf.

At main, the palette is cream `#f3efe4`, brown `#29251f`, green `#53665a`, with parchment and clay accents. A centered frame is capped at 920px. The main text says you study Robotics Engineering Technology at Purdue and identifies the John Martinson Honors College. [Palette/layout](https://github.com/lflowers01/lflowers01.github.io/blob/8b8de307a3bc8cf8e89e295f1edb59fd88a0a762/index.html#L18), [intro](https://github.com/lflowers01/lflowers01.github.io/blob/8b8de307a3bc8cf8e89e295f1edb59fd88a0a762/index.html#L732).

The page also already has a playful click effect: a document click creates fourteen character spans, gives them random displacement/rotation and removes them on animationend. This is a character burst, not the continuous reactive ASCII artwork now being considered. [Click effect lines 538–637](https://github.com/lflowers01/lflowers01.github.io/blob/8b8de307a3bc8cf8e89e295f1edb59fd88a0a762/index.html#L538). The title-bar symbols are divs; their appearance is not evidence of real minimize/maximize/close behavior. [Controls](https://github.com/lflowers01/lflowers01.github.io/blob/8b8de307a3bc8cf8e89e295f1edb59fd88a0a762/index.html#L661).

**Continuity:** retain the calm warm reading surface and add a more expressive surrounding world. The current site's quietness does not erase your earlier interest in games, music, pixel fonts and experimentation.

## Content you already have for a future project shelf

The current archive contains ten named project cards. Treat their dates and descriptions as **archived claims**. “Present” in this table means the saved page says Present; no project owner or external source was contacted to establish October 2026 status. [Archive project section](https://github.com/lflowers01/lflowers01.github.io/blob/8b8de307a3bc8cf8e89e295f1edb59fd88a0a762/public/archive.html#L1176).

| Existing project | Saved context | Useful presentation direction |
|---|---|---|
| **Team Epsilon** | FRC Team 11100; founded May 2025–Present; co-founding/leadership, fundraising, control systems and vision alignment | A featured robot dossier plus organization/build log. |
| **The Bluey Jamboard** | October 2025; Makers of Change assistive technology; Raspberry Pi game system, GPIO controls and accessible multiplayer | A small interface/controller diagram and human-centered design story. |
| **High-Altitude Weather Balloon Camera System** | October 2025–Present; Raspberry Pi near-space payload, monitoring, reliable autonomous recording | Mission-control window with dated testing notes; do not imply a completed flight. |
| **Smart Vision Saw Safety System** | 2025–Present; AZSEF/ISEF research direction involving vision, danger zones and relay control | An explicitly experimental research notebook; do not imply certified injury prevention or completed validation. |
| **Physics Projectile Motion Simulator** | May 2025 physics final; aiming, vectors and trajectories | A playable demonstration beside a concise explanation and source link. |
| **Minecraft Server Wizard** | December 2023 CS50 final; Python installation/configuration/update/backup automation | An installer-style project card and screenshots, with its original date. |
| **Phoenix Robotics — 2023 Season Code** | Team 6833 lead-programmer work; saved description says regional win | A season archive, code links and a specific controls lesson. |
| **Squirrel Simulator 3.000** | School project, date not listed on card; Scratch/TurboWarp | “First web toy” on an old-disks shelf; Git history establishes May 2023 presence. |
| **Password Tool** | Self-taught JavaScript; generator/strength checker; card undated | An early software experiment with honest limits and original-era context. |
| **A Website For School** | Math/English/science/art/Spanish class site; card undated | An archived miniature site or source exhibit, preserving the jokes and era. |

Project titles are at archive lines **1198, 1232, 1256, 1280, 1304, 1345, 1376, 1407, 1436 and 1465**. Project descriptions and links immediately follow. These ten cards are actual available content, not placeholders invented for the new design.

The archive also records FRC roles at **Team Epsilon, Dragon Robotics 2375 and Phoenix Robotics 6833**; Phoenix Forge and DRIBPL internships; Young Data Scientist League research; Makers of Change; Wentworth Impact Lab; and a January 2025 Japan exchange. [Experience blocks](https://github.com/lflowers01/lflowers01.github.io/blob/8b8de307a3bc8cf8e89e295f1edb59fd88a0a762/public/archive.html#L773). The older portfolio supplies longer process/reflection narratives, useful for expanding selected cards without turning the homepage into a CV. Do not republish old “high-school student” wording as the current Purdue introduction. The archive's own heading makes its historical context explicit. [Archive introduction](https://github.com/lflowers01/lflowers01.github.io/blob/8b8de307a3bc8cf8e89e295f1edb59fd88a0a762/public/archive.html#L641).

## Existing assets and destinations worth revisiting

The historical trees contain `FreePixel.ttf`, `pxplus.ttf`, `GAU_pop_magic.TTF`; custom cursor images; photo sets; original/processed image pairs; `paint-dithered-image.png`; portfolio drawing/portrait assets; and **Sony_V65b, alien, green and trees** Winamp skin files. File existence is verified; image appearance, authorship, font licensing and skin permissions are not. Use these as a recovery inventory, not automatic approval to publish everything. [July asset tree](https://github.com/lflowers01/lflowers01.github.io/tree/9f715fd9e08b811ac7fc577031ccb364526af1e3/assets).

The old `plan.md` already proposes project pages, brief updates, favorite media, a gallery and a learning wishlist. `todo.txt` asks about a music player and easter eggs. Those documents are past ideas, not new requirements or evidence the features were implemented. [Plan](https://github.com/lflowers01/lflowers01.github.io/blob/9f715fd9e08b811ac7fc577031ccb364526af1e3/plan.md#L1), [todo](https://github.com/lflowers01/lflowers01.github.io/blob/9f715fd9e08b811ac7fc577031ccb364526af1e3/todo.txt#L1).

Main contains **public/Resume.pdf** and **public/portfolio.pdf**; deployment contains **resume.pdf**; July contains **resume.pdf** and **portfolio.pdf** plus **plainText-portfolio.txt**. PDFs were inventoried only. No PDF contents were parsed; the detailed portfolio context above comes from the independently present text file and HTML.

Some archive links point to `highschool/game.html`, `highschool/password/password.html` and `highschool/schoolsite/index.html`, but those paths are absent from main's tracked tree. Earlier history contains related files at different paths. This is a migration fact, not a production link-check result: choose a destination deliberately when eventually rebuilding. [Archive links](https://github.com/lflowers01/lflowers01.github.io/blob/8b8de307a3bc8cf8e89e295f1edb59fd88a0a762/public/archive.html#L1400). Avoid automatically copying old addresses/contacts from every era; the current source uses the lucasflowers.net identity and current profile links.

## Three continuity options

These are original design interpretations informed by the source, not a decision already made.

1. **Forest desktop / personal machine.** Keep the warm cream and green palette, reuse the idea of skins, and add a photo drawer, notepad and one music window. Use a reactive ASCII robot as the signature new artwork. This joins the latest landing page to the 2025 desktop without requiring a whole operating-system simulation.
2. **Engineering field station.** Use the balloon-camera and robot-control work as the setting: diagnostics, experiment cards, dated logs, a dithered portrait and a shared “power up” control. Hiking/Japan photographs can be a field journal. The terminal vocabulary becomes labels and optional commands, while normal links remain obvious.
3. **Personal homepage with an old-disks shelf.** A denser Web 1.0 page can mix small windows, stamps, favorite music, a pet and casual notes, with a separate readable engineering portfolio. Preserve the early game and class site as dated artifacts. This makes room for humor and nonprofessional interests already described in your earlier introduction.

For any of them, carry forward **real content, one coherent palette, a clear resume/contact route and honest project status**. Add the library's wider elements selectively. The biggest opportunity is not another novel border: it is giving visitors a way to move between engineering work, play, thoughts, photographs and music that already have a basis in your history.

## Revisit history without changing the working branch

Read-only examples; these commands display files and do not restore or execute them:

```powershell
git show main:index.html
git show main:public/archive.html
git show 893cac9:src/js/dark-mode.js
git show 4003915:src/partials/winamp.html
git show 9f715fd:plainText-portfolio.txt
git ls-tree -r --name-only deployment
```

No checkout, stash application, reset, source execution, PDF extraction or deployment was performed. The [history notes](../research_notes/Personal%20portfolio%20reference%20library/repo-history.md) and [ref snapshot](../research_notes/Personal%20portfolio%20reference%20library/repo-refs.json) retain the inspected boundaries. Future content editing should confirm what is current and which old assets you still want to share.
