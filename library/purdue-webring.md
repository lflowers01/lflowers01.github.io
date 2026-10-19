# Purdue Hackers webring study

**Membership checked October 18, 2026:** the [live ring index](https://ring.purduehackers.com/) displayed **31 members**, and 31 unique member name/hostname pairs were extracted from its delivered HTML in carousel order. [Membership snapshot](../research_notes/Personal%20portfolio%20reference%20library/purdue-members.json) retains all names, hosts, chosen direct-check HTTPS URLs, ring redirect URLs and UTC check time.

We inspected direct public destinations rather than deliberately activating ring tracking links. An ordinary page visit can still generate that site's analytics. This study performs no posts, guestbook signatures, membership submissions or intentional shared-counter increments. It records the actual range of ring styles; several are contemporary portfolios, whose elements can still be adapted into your Web 1.0 world.

**Evidence labels:** **page fetched** = current public text/HTML; **source-inspected** = delivered CSS/JavaScript read; **REA interaction** = declared browser action and inspected resulting state; **pixels reviewed** = real screenshot inspected. A button in HTML does not prove working interaction. Reconstruction instructions below are original proposals, not copied source or claims about the example's exact implementation.

## Coverage: members 1–16

Order matches the current ring carousel. Sparse pages remain represented; “could not text-fetch” is not silently treated as “website offline.”

| # | Member and direct destination | Current page-level result | Interesting element and evidence boundary |
|---|---|---|---|
| 1 | anish — [eightlegman.neocities.org](https://eightlegman.neocities.org/) | Direct HTTP 200 after web-tool restriction; title “Anish's Website” | Delivered inline source contains an ASCII-grid canvas river, frogs/flies/koi and visit/total score panel. **Source-inspected**, not runtime-playtested. Total is saved in **this browser's localStorage**, not proven shared database data. |
| 2 | manitej — [www.manitej.com](https://www.manitej.com/) | Direct HTTP 200; title “Manitej Boorgu” | Current home/work/contact, personal intro, “this year's song,” and selected work. Web text-fetch returned an older “soon” version; current direct HTML supersedes that content. Music playback/contact behavior untested. |
| 3 | charlie kim — [imasepan.github.io](https://imasepan.github.io/) | Direct HTTP 200; REA loaded successfully | Rain/theme/cloud appearance controls, overlay navigation and featured Spotify region. **REA interaction + pixels reviewed:** Clouds changes root appearance state and reveals a blue sky/cloud world. |
| 4 | dbmaindex — [dbmaindex.org](https://dbmaindex.org/) | Public page and REA loaded; Blog navigation reaches /blog.html | Bitmap type, compact technical index, date/time and RSS; a readability button switches the font variable to serif. **REA interaction + pixels reviewed**. |
| 5 | kira — [kchynayev.com](https://kchynayev.com/) | Page fetched | Very sparse statement of identity/study and graphics/game/design focus. Text alone does not establish animation or visual composition; no mechanism invented from sparse result. |
| 6 | ethankawley — [ethankawley.com](https://ethankawley.com/) | Homepage and /projects/ fetched | Concise bio/interests, project links, a “Commits” region and ring footer. The projects page separates descriptions/years from external destinations. Live commit rendering unverified. |
| 7 | neel — [neels.page](https://neels.page/) | Page fetched | Hardware project archive with purpose, concrete features, year and repo links. Useful information structure for robots/builds; imagery/interactions not visually audited. |
| 8 | ishan — [quackduck.github.io](https://quackduck.github.io/) | Direct HTTP 200 after web-tool restriction | Conversational lists of interests, recent work, open questions and challenges; embedded video element. This is personality-through-content rather than a tested animation reference. |
| 9 | amber — [amberzeng.com](https://amberzeng.com/) | Page fetched | Welcome message, four named creative projects, repeated sheep image elements and ring hands. Repetition suggests a mascot motif; sheep movement is **not** verified. |
| 10 | artus — [artusmosquet.com](https://artusmosquet.com/) | REA resolved homepage to /en/ after root text fetch was empty | Current activity, featured work, article, reading, last-played music and hardware cards. **REA interaction + pixels reviewed:** theme light→dark. Music/status backend freshness unverified. |
| 11 | TheDarkLynx — [thedarklynx.com](https://thedarklynx.com/) | Page fetched | Personal welcome, posts and music; posts mix mathematical art, a recipe, music, cycling and technical work. A strong precedent for notes beyond employment/projects. |
| 12 | habiboi — [habiboi.neocities.org](https://habiboi.neocities.org/) | Page fetched | “Banana University” parody, academic-style categories, announcement band and exuberant repeated slogan. Borrow playful world-building; its menus/forms were not exercised. |
| 13 | angela — [angelazqian.github.io](https://angelazqian.github.io/) | Page fetched | Shell-like prompt, avatar, bio, About/Projects links and ring arrows. Static terminal framing can coexist with normal readable content; typed commands not verified. |
| 14 | alicia — [www.alicias.page](https://www.alicias.page/) | Page fetched and REA loaded | ASCII computer, timed character scramble, grainy background, project rows/tags and sound toggle. **REA interaction + pixels reviewed:** text settles over time; sound control changes pressed state. No audible playback claim. |
| 15 | jadden — [www.jaddens.page](https://www.jaddens.page/) | Page fetched and REA loaded | Selected-work gallery, /now link, labeled ring navigation and theme button. **REA interaction:** Dark Mode becomes Light Mode and root data-theme is dark; appearance not screenshot-reviewed in this capture. |
| 16 | aryan — [www.aboutsharma.com](https://www.aboutsharma.com/) | Page fetched | Personal engineering intro, portrait and explicit external live-server link. The external server was not opened or operationally audited. |

## Coverage: members 17–31

Member names follow the same live inventory. Final destinations retain observed redirects; none was recorded as unreachable through all available checks.

| Ring # / name / original hostname | Final fetched URL and retrieval status | Evidence / specific useful element |
|---|---|---|
| 17 kimjammer / `kimjammer.com` | [https://www.kimjammer.com/](https://www.kimjammer.com/): redirects from apex; text result empty, REA rendered meaningful DOM and project content | REA; clipped SVG monogram intro, rotating alias/role spans including Korean name, asymmetrical project cards, hexagonal social hub. Modern animated portfolio; mechanics can become a small Web1 badge/status sign. |
| 18 theshadoweevee / `shad.moe` | [https://shad.moe/](https://shad.moe/): successful page fetch, same final URL | Page; search, category/tag counts, word count/reading-time metadata, Friends, RSS and explicit blog-source link. Astro/Fuwari attribution. Use a discoverable technical notebook rather than random card effects. |
| 19 kian / `kasad.com` | [https://kasad.com/](https://kasad.com/): successful page fetch, same final URL | Page; projects combine screenshots, a short introduction, “Read more,” technical details and status; Notes and Reading list are separate destinations. Page exposes a commit total/date range. Do not infer whether that total updates live. |
| 20 grace / `grace.pink` | [https://grace.pink/](https://grace.pink/): successful page + REA, same final URL | Page + REA; seeded canvas tree scene, friends button shelf, art/blog separation, two feed URLs, ring collection. Modern rounded panels over a personal landscape; Web1 adaptation can replace tree canopy with dithered/pixel shapes. |
| 21 arhan / `arhan.sh` | [https://arhan.sh/](https://arhan.sh/): successful page + REA, same final URL | Page + REA; terminal prompt is an actual local page-erasing easter egg; blinking cursor, per-letter title spans, bright accent variables, compact side navigation and reading/cubing/CTF destinations. Egg observed, not merely inferred from strings. |
| 22 henry / `rovnyak.net` | [https://rovnyak.net/](https://rovnyak.net/): successful page fetch, same final URL | Page; spare personal entrance with Posts, Projects, Music and two ring controls. Minimal index can be a deliberate old-web front door; no interactive music behavior established. |
| 23 rayhanadev / `rayhanadev.com` | [https://rayhanadev.com/](https://rayhanadev.com/): successful page fetch, same final URL | Page; black-and-white portrait plus a connected prose introduction, inline project/organization links and essays/email footer. Useful counterexample: a personal voice can be carried by typography/prose with few decorative widgets. No dithering claim inferred from monochrome alt text. |
| 24 jack / `jackhogan.me` | [https://www.jackhogan.me/](https://www.jackhogan.me/): apex redirects; successful page fetch | Page; large split-line name, concise role line, first-person introduction and actual travel portrait with descriptive alt text; Me/Work/Blog navigation. No visual layout animation established. |
| 25 kartavya / `blog.vashishtha.in` | [https://blog.vashishtha.in/](https://blog.vashishtha.in/): successful page fetch, same final URL | Page; playful technical post subjects, date/excerpt/read-more rhythm, tags/categories and open-source-license page. Zola attribution. A useful model for presenting strange experiments as readable writing. |
| 26 Big John / `johnzeng.me` | [https://johnzeng.me/](https://johnzeng.me/): successful page fetch, same final URL | Page; distinct Personal Projects, Academic Projects and Research navigation, plus source link. Borrow meaningful catalog sections if the user develops these bodies of work; no need to add empty categories now. |
| 27 ericswpark / `ericswpark.com` | [https://ericswpark.com/](https://ericswpark.com/): successful page fetch, same final URL | Page; light-mode control label, language indicator, profile/backdrop, blog/pages/about and back-to-top. Presence of a mode label is not proof of persistence or correct theme behavior. |
| 28 julian / `trev3d.com` | [https://trev3d.com/](https://trev3d.com/): successful page + REA, same final URL | Page + REA; eight circular video-project portals, hover color treatment, iframe sidebar and separate mobile navigation. Actual CSS supplies circle packing; not evidence of a physics engine. |
| 29 trey / `trey.build` | [https://trey.build/](https://trey.build/): successful page fetch, same final URL | Page; skip-to-content link and concise selected projects, including a scavenger hunt, noise/form exploration and game jam project. Useful way to mix portfolio artifacts with playful side experiments. Linked projects were not individually launched. |
| 30 sriram / `ramaway.com` | [https://ramaway.com/](https://ramaway.com/): successful page fetch, same final URL | Page; a focused current-build callout, portrait, Projects/Blog navigation and Catppuccin attribution. Borrow a dated “on my bench” announcement; no need to copy its modern product subject. |
| 31 odker / `odker.dev` | [https://odker.dev/](https://odker.dev/): successful page fetch, same final URL | Page; the homepage itself is an essay about wanting/not wanting a site, privacy and maintenance. Two ring controls appear afterward. Unconventional “manifesto as homepage” supplies personality without simulated software. Treat the author's technical self-description as author-reported, not a complete source audit. |


## Fourteen detailed reconstruction recipes

The five recipes below and nine further recipes after the compact content conventions cover the strongest mechanisms. All are proposed adaptations; no site implementation was created.

### An ASCII river that keeps a local history

**Reference:** [Anish](https://eightlegman.neocities.org/), current delivered inline source. This is more specific than a generic rotating donut: a little ecosystem becomes a persistent side activity.

**Established technically:** source creates a 2D canvas in a river container, uses an 8×10 CSS-pixel character grid, stores character/color/background arrays and caps device-pixel ratio at 2. It contains water, frog, koi, lily-pad and fly logic. The scoreboard explicitly distinguishes this visit from totals loaded/saved with the localStorage key `riverScore`. This is **source evidence of local persistence**, not evidence of a shared counter. No simulation action was runtime-tested.

**Recreate your version:** start with one ASCII robot, a slow conveyor of parts and a tap target. Keep simulation coordinates in grid cells; map pointer coordinates from the canvas bounding rectangle to cells. Draw the scene from a bounded grid after updating elapsed time. Scale the backing canvas for device pixels but keep drawing units in CSS pixels. Limit particles/entities and avoid creating a DOM element per character.

Keep a small visit object and a separate saved object, validate parsed values and catch unavailable storage. Describe the result as “parts sorted on this browser.” Add a Reset local score button. To make a truly shared total, add a separate rate-limited server-side endpoint with atomic increments; localStorage cannot substitute for it.

**Why it fits:** an enjoyable environment rewards staying on the page, and the robot/conveyor can share your project world's palette. Start with two entity types rather than reproducing the entire river.

**Fallback:** display a still scene and the last local score; provide a visible pause control, reduced-motion mode and keyboard/button equivalent to any meaningful tap action. No essential portfolio information goes inside the game. Cost: medium–high for a polished simulation.

### Change the whole atmosphere with Clouds

**Reference:** [Charlie Kim](https://imasepan.github.io/). REA clicked the observed Clouds button. Root `data-appearance` changed `default`→`frutiger`; the button became pressed. The inspected screenshot showed a full blue sky/cloud scene, light ray, lower-left navigation, a compact Spotify region and ring footer.

**Established technically:** [delivered script](https://imasepan.github.io/script.js?v=20261007-1) models appearance choices separately from light/dark theme and weather, updates root data attributes, syncs button pressed states, and moves existing music/ring elements into different layout parents. It handles failed audio play attempts. The capture does not identify the full cloud-rendering algorithm. Reduced-motion handling for a palette transition is commented out in the inspected script; do not assume the effect automatically respects that preference.

**Recreate your version:** define an allowlisted state such as `workbench`, `night`, `rain`. Keep a single set of content links. A root data attribute selects palette, wallpaper and optional background layers; CSS Grid rearranges content without duplicating it. Persist only the chosen mode if useful, and validate saved values. A still illustrated cloud wallpaper is enough initially; a live cloud shader is a separate experiment.

**Why it fits:** a visitor can switch between cozy notebook, terminal night and a bright outdoor version of the same site while learning one navigation system.

**Fallback:** a solid background, readable content surface, unchanged focus order and immediate transitions with reduced motion. Keep ambient audio independently opt-in. Cost: medium; high only if original procedural skies are central.

### Let text decode into a name or ASCII mascot

**Reference:** [Alicia](https://www.alicias.page/). REA captured initial/500ms/later DOM states: the heading's character spans contained random-looking symbols and later resolved to the expected letters. The ASCII computer likewise resolved to its artwork. This establishes a **time-based reveal**, not verified pointer-responsive animation.

The screenshot shows a black, grain/dither-like field, lime accents, computer artwork, compact navigation and labeled project rows. DOM includes `data-shuffle-frames` on the preformatted artwork and a background canvas declaring `three.js r177`; that attribute alone does not establish the shader algorithm or every executed library.

**Recreate your version:** store final heading text and one ASCII frame. During a short, finite reveal, progressively lock characters to their final values and use a small glyph set for unlocked positions. Drive progress with elapsed time, not frame count. End by restoring the exact original string so nothing remains garbled. An optional second frame can change the robot's expression on an explicit button.

Keep the meaningful heading static in the accessibility tree and mark a separate animated visual duplicate decorative. With reduced motion, render the final state immediately. Do not scramble paragraphs or continuously mutate the screen-reader name.

**Why it fits:** a one-time “receiving signal” introduction gives your ASCII art identity without asking visitors to navigate a game. Cost: medium, no animation library necessary for this limited version.

### Offer readable type without abandoning bitmap headings

**Reference:** [dbmaindex Blog](https://dbmaindex.org/blog.html). REA clicked `#status-toggle-font`: the root inline variable changed from `--font-family: mainFont, serif` to `--font-family: serif`; the screenshot visibly changed from bitmap text to serif. This is a concrete quality-of-life feature in a retro page.

**Established technically:** [delivered scripts.js](https://dbmaindex.org/scripts.js) stores a boolean preference in sessionStorage and sets one custom property. It also updates a clock using the browser's Date object every second; that is **not** evidence of server time or a database. Its project code clones template content into a selected detail panel, a useful source-inspected lead but not exercised here.

**Recreate your version:** give body text a readable default and allow bitmap display type where it stays legible. If a toggle is desired, swap one root font variable; leave spacing sufficiently flexible for different metrics. Use a native button with an explicit name and current state. Storage errors should not stop the local toggle.

**Why it fits:** keeping the art direction while letting visitors choose more comfortable type costs much less than maintaining a second “accessible site.”

**Fallback:** system font when a custom font fails. Do not disable zoom. Cost: small.

### A homepage can be a personal status board

**Reference:** [Artus](https://artusmosquet.com/en/). REA found sections for current activity, featured project, recent article, reading, last-played music, homelab and everyday hardware. Its captured dark view is a restrained grey card grid. A theme click changed `data-theme=light` to `dark`. The displayed music/status data was not checked against its backend.

**Recreate your version:** author the first version as Markdown data: currently building, recently read, current favorite song and last project update. Give each status a date. One home template can show the newest entry from each collection. Style them as technical readouts, notebook labels or radio panels to fit Web 1.0.

Do not build private music-service or homelab APIs just to get a “live” appearance. If an API is added later, keep credentials server-side, cache results, expose freshness and retain a useful static fallback.

**Why it fits:** this gives people something to return for even before the project archive grows. Cost: small for authored data, medium for actual live integrations.

### Small content conventions with large personality

- [Manitej](https://www.manitej.com/): a “this year's song” is a more personal prompt than a generic favorite-music carousel. Give your selection a sentence explaining why; playback is optional. The current direct fetch supersedes the older “blog/projects soon” text result.
- [Ishan](https://quackduck.github.io/): public “considering” questions and specific favorite things turn an intro into a person. Use a dated open-questions note, not a database.
- [Neel](https://neels.page/): hardware entries explain purpose, concrete features and year. Your future projects can use the same honest anatomy with photos and lessons.
- [TheDarkLynx](https://thedarklynx.com/): recipes, rides, music and mathematical art can sit beside technical projects. A short-note stream need not be career-only.
- [Amber](https://amberzeng.com/): repeated sheep images suggest a consistent personal mascot. An original robot sticker can repeat in a footer, project stamp and 404 page without needing autonomous animation.
- [Angela](https://angelazqian.github.io/): a prompt and cursor-like glyph establish terminal atmosphere around conventional links. Do not make a command parser unless it adds something you want.
- [Habiboi](https://habiboi.neocities.org/): a fictional “Banana University” demonstrates a playful alternate world. Your easter egg could be a tiny Institute of Loose Screws page with clearly fictional content.
- [Jadden](https://www.jaddens.page/): the theme control describes the action it will take, changing Dark Mode→Light Mode after activation. That is clearer than an unexplained icon.

## More member-inspired recipes

### RB01 — A terminal prompt that performs a theatrical local easter egg

**Reference:** [Arhan](https://arhan.sh/), the initial and egg-interaction REA records in the ledger below. **S–M; browser-local, no database.**

Observed chain: prompt click prevents ordinary link navigation → a one-shot guard avoids reentry → cursor acquires blinking class → timed string output → visible text/elements in `main` disappear → a predefined template replaces the content. The final replacement was actually observed after the declared wait. The shipped source counts/deletes DOM recursively; cloning that implementation wholesale is unnecessary.

**Recreation:** use an explicit `idle → typing → glitch → finished` state and a fixed decorative content region. A “robot ate my homepage” effect could replace a clone/overlay of the introduction with ASCII crumbs, then offer a real Reset button that restores content/focus and cancels timers. Never route text through `eval`, shell execution or arbitrary command parsing; an allowlist of local fictional actions is enough. Keep ordinary Home navigation available, let Escape/Reset recover immediately, honor reduced motion with an instantaneous joke, and do not remove critical real project/contact content. Announce only start/end, not each removed character. Scope the effect to the current tab with no server writes. The reference's exact source effect continues even under our requested reduced-motion preference; our version should improve that. Unknown: no reset press, timer/background-tab or phone test on the original.

### RB02 — Project portholes with hover-revealed labels and duotone treatment

**Reference:** [trev3d](https://trev3d.com/) + [CSS](https://trev3d.com/resources/style.css). **S for static previews; M for video.**

Observed DOM uses actual anchor/video pairs. CSS makes 38%-width circles with percentage padding, floats and `nth-child` offsets; `object-fit: cover` crops previews. Hover combines grayscale/contrast and blend modes over colored backgrounds, revealing an overlaid title. This is CSS, not proof of a canvas layout engine. At 700px the frame navigation hides and a Menu link appears; below 500px circles become single-column. These are source rules, not a measured responsive audit.

**Recreation:** use CSS Grid with staggered rows and circular clipping, retaining real text captions outside or always visible over the image. For Web1, show dithered robot/photo thumbnails in round CRT windows; a hover/focus tint and two-frame local sprite can replace multiple video downloads. If video is chosen, use short compressed muted loops with posters and start only visible previews, stopping them when hidden or motion is reduced. Titles must be available to screen readers and touch users; add `:focus-visible`/`:focus-within` rather than hover-only access. Stack cards with their captions on small screens. Do not copy the original's unnamed-link accessibility result or require iframes just to share navigation. Unknown: original actual playback/performance and interactive-project internals.

### RB03 — A persistent-looking generated landscape without a shared database

**Reference:** [grace.pink](https://grace.pink/), REA source-observed tree. **M; browser session storage.**

The inline source reads palette custom properties, creates a deterministic PRNG from a seed retained in `sessionStorage`, generates trunk/branches/ellipse clusters once and draws a canvas hill/tree. The renderer uses `Path2D`, a size transform based on viewport height, sinusoidal wind and `requestAnimationFrame`. Device-pixel-ratio scaling is capped at 2. Reduced-motion path cancels animation and draws a still frame; resize redraws. These are inspected mechanisms; the stored seed value and cross-page continuity were not captured/tested.

**Recreation:** generate a small seeded pixel garden, antenna field or star constellation on entry, storing only its seed for this browsing session. The site can feel consistent across pages without claiming global persistence. Draw at low resolution and upscale nearest-neighbor for Web1/pixel character; change palette and shapes to your own. Keep decoration `aria-hidden` and pointer-transparent, with readable content on solid panels. Render once under reduced motion, cancel animation when hidden, debounce resize and keep a static fallback if canvas fails. A shared garden visitors actually water is a different API/database feature covered in C12, not implied by the scene. Unknown: original real-world frame time, cross-tab/session reload and device behavior.

### RB04 — Rotating aliases and roles in a tiny mechanical sign

**Reference:** [KimJammer](https://www.kimjammer.com/) + current [CSS](https://www.kimjammer.com/_app/immutable/assets/2.BrUA1B4o.css). **S–M; local animation.**

REA rendered multiple alias/role spans with only one transform/opacity state visually positioned as current. Shipped CSS overlays absolute-positioned animated words inside clipped lines and uses a widest relative word to reserve space. The actual transition algorithm/timing was not identified from a JS bundle and was not replayed across cycles. Source also positions six round social links around a hexagonal central mark.

**Recreation:** a single 2–3-line “operator label” says Lucas / student / robot builder, rotating one line at a time through a fixed list. Reserve enough size for the widest option to avoid layout shifts, with one accessible sentence describing the full identity. A pixel flip-board or simple fade fits the desired Web1 style better than copying the modern giant hero. Provide pause and a static reduced-motion label; use normal links below rather than a hover-only social puzzle. Avoid announcing each timer tick to screen readers. No database or full animation framework is needed. Unknown: original motion reduced preference coverage, cycle performance and intro completion.

### RB05 — A logo that assembles from clipped parts

**Reference:** KimJammer's SVG monogram DOM and CSS asset. **S–M, optional, no storage.**

The source uses SVG clip paths/masks for individual letter segments, with CSS translate/rotate animations and an overlay curtain; the observed capture proves those structures exist, not that the intro finished during the capture. **Recreation:** animate an original circuit/robot mark from 3–5 vector or pixel pieces once, then reveal the page. Keep the main content immediately available to assistive tools, skip the overlay under reduced motion, set a hard timeout so a missing event cannot trap visitors, and keep a Skip intro link. Web1 alternative: a tiny “boot complete” icon above the title instead of blocking the whole page. Do not lift the artist's monogram. Unknown: original screen-reader overlay interaction/load fallback.

### RB06 — An expanded project dossier instead of a grid of links

**Reference:** [Kian Kasad](https://kasad.com/). **S; authored content.**

The fetched page provides project screenshots, short introductions, technical detail, status and source/demo destinations. **Recreation:** a labeled “specimen drawer” lists a short problem, build photograph/ASCII diagram, one surprising result and a Read more details block; a permanent page carries mistakes, constraints and next step. Use native `<details>` or separate pages before a custom modal. Preserve captions/alt text, readable code overflow and direct URLs. A commit strip can be a static generated activity summary with an “as of” date; don't imply live GitHub activity from a cached number. Unknown: the original commit-data refresh mechanism and Read more runtime behavior were not inspected.

### RB07 — Personal prose that links outward instead of a product pitch

**Reference:** [Ray](https://rayhanadev.com/), [Odker](https://odker.dev/), [Henry](https://rovnyak.net/). **S; static text and original portrait.**

Ray uses inline links inside a narrative introduction; Odker makes an essay the homepage; Henry provides a spare entrance with Posts/Projects/Music. **Recreation:** an “about this station” message in your own voice, a real photograph or dithered self-portrait and a few descriptive inline links. A privacy/maintenance note can say what you choose to share without making the homepage an exhaustive résumé. Keep it compact enough to lead naturally to experiments. This is a deliberate Web1-compatible design language: authored text, clear links, plain file-like navigation. No invented hover, shader, monochrome-dithering or animation claim comes from these text fetches. Unknown: screenshot-level typography and responsive behavior were not audited.

### RB08 — Split subscriptions and friend neighborhoods

**Reference:** [Grace](https://grace.pink/) exposes Blog RSS and Art RSS and an 88×31 friends shelf; [Shad](https://shad.moe/) exposes Friends, source, tags and RSS. **S; generated static pages.**

**Recreation:** one tiny notes feed and, if genuinely useful later, a separate projects/art feed. Build both from the same source entries with stable IDs; clear feed labels let a visitor choose their interest. Put a handful of friends' own site buttons under the station footer, with alt names and attribution/permission. A source/about-build link can explain the homemade mechanics. Do not create categories/feeds for content that doesn't exist. Unknown: these pages' authoring workflow/feed generation and all downstream links were not inspected. C06/C15 contain the general technical recipes.

### RB09 — A current experiment and a playful project log

**Reference:** [Ramaway](https://ramaway.com/) names a current build; [Kart's blog](https://blog.vashishtha.in/) presents technical experiments in a dated excerpt/read-more stream; [Trey](https://trey.build/) mixes selected practical and playful project topics. **S; Markdown.**

**Recreation:** an “on the bench” notice with one current prototype and its real status, followed by a log of experiments: what I tried, what surprised me, photograph/code/schematic, what next. Dates and small tags make it browseable without hiding it behind filters. Render “new” indicators from actual publication dates with an explicit expiry, not a permanent blinking NEW on every post. Keep tags finite and links readable on small screens. These sources establish subject/structure, not the behavior of linked games or product demos; no game was launched or score submitted.


## REA ledger for all nine member targets

All runs used an owned temporary Chromium profile, 1280×900, reduced motion requested, service workers blocked and no private account state. Owned processes were terminated. Selected JSON receipts retain exact request/actions, observed DOM excerpts, screenshot identities where requested, coverage and unknowns; these are **not** full portable Evidence exports. No audio was listened to.

| Target | Exact Evidence ID | Proven action/result | Receipt |
|---|---|---|---|
| Alicia | `ev_0e66a4bd06d7aeea81ff53d31558b9290f46e6787a906102e9c474f065029246` | Waits show character reveal resolving; Sound effects aria-pressed true→false | [receipt](../research_notes/Personal%20portfolio%20reference%20library/evidence/ring-a-alicia.json) |
| Charlie | `ev_fc6d1fbfea616a8fa84b764b1467877471d0d746ad0d224ed709f617e07f5ccd` | Clouds changes appearance default→frutiger; screenshot inspected | [receipt](../research_notes/Personal%20portfolio%20reference%20library/evidence/ring-a-charlie.json) |
| dbmaindex | `ev_1abfb74de67eab000fd2659bd4d13918330db6e5bffefc6c57d906a3893bb3a4` | Font custom property changes to serif; screenshot inspected | [receipt](../research_notes/Personal%20portfolio%20reference%20library/evidence/ring-a-dbma.json) |
| Artus | `ev_4591357b7f6c229084f68e450788f2b9ad2753ea87d9d5a9503191c093c9dd7a` | Theme light→dark; screenshot inspected | [receipt](../research_notes/Personal%20portfolio%20reference%20library/evidence/ring-a-artus.json) |
| Jadden | `ev_8ac6fb5af7deaa4fabbce968888cbddf9c3033875682deaa11c659f8925c643d` | Dark Mode activation leaves root dark and button labeled Light Mode | [receipt](../research_notes/Personal%20portfolio%20reference%20library/evidence/ring-a-jadden.json) |

The additional five records cover four more member targets. The initial Arhan capture and its interaction capture are separate records of the same target. Only designated first-half captures included reviewed screenshots; the records below are DOM/source evidence.

| Evidence ID | Receipt | What was actually observed |
|---|---|---|
| `ev_b1d92062c04c35ca0473f2a7e97f0dd56327a339a0178e4bb1c529dec72e7deb` | [arhan initial](../research_notes/Personal%20portfolio%20reference%20library/evidence/ring-b-arhan.json) | Homepage DOM, inline prompt handler, template, title spans, navigation and ring links. Source text identifies a timed local text/DOM effect; that alone would not prove its execution. |
| `ev_4315ad553bb0886f393a609f124f0cb238afffc5e6074860d6daaf312c64a8e5` | [arhan egg interaction](../research_notes/Personal%20portfolio%20reference%20library/evidence/ring-b-arhan-egg.json) | Clicked `#ssh-text`, waited 5 seconds and then 16 seconds. Final `<main>` is replaced by a humorous unavailable/reload template; normal introductory content is absent from final accessibility tree while sidebar/footer remain. DOM hashes change across steps. This is the executed egg. No shell command was run; the inspected handler only types a theatrical string and mutates local DOM. The scenario did not press its reload control. |
| `ev_8756949b60975052481e0a8e4f3cdae8b793a9fcfbb6210b963196a42fd37c18` | [trev3d initial](../research_notes/Personal%20portfolio%20reference%20library/evidence/ring-b-trev3d.json) | Eight real linked projects containing video tags with `autoplay`, `muted`, `playsinline` and `loop`; sidebar iframe and mobile Menu link. Actual video playback, hover transition pixels and iframe keyboard behavior not tested. Captured accessibility tree exposes unnamed project links, a reason to improve labeling in a recreation. |
| `ev_44f9301d44180a7057234f3c43ddc7f5a49d9aaf7c4b5ee2cdf640128a697838` | [grace initial](../research_notes/Personal%20portfolio%20reference%20library/evidence/ring-b-grace.json) | `aria-hidden` canvas, inline source defining 2D paths/seed/motion controls, friends image links, separate art/blog RSS and ring links. Reduced-motion requested; no screenshot or frame-by-frame motion verification. Source mechanisms are source-observed, not a claim every code branch ran. |
| `ev_857448a849de376250dc69c332cc3085444411534fbf12d64e729a2b5b73762b` | [kimjammer initial](../research_notes/Personal%20portfolio%20reference%20library/evidence/ring-b-kimjammer.json) | Apex redirects to www; actual project text renders, SVG clip paths, aliases/roles and transform/opacity states are present; CSS asset contains corresponding clipping/animation structures. Rotator progression and logo intro completion were not separately timed. |



## How to use these discoveries without copying a modern portfolio

Use the river's **bounded simulation**, Charlie's **whole-skin state**, Alicia's **finite decode**, dbmaindex's **font preference**, Arhan's **local theatrical state machine**, Trev3D's **shaped previews**, Grace's **seeded landscape** and KimJammer's **reserved-space word rotator** as mechanisms. Render them with original pixel art, dithered photography, a small palette, underlined links and readable panels. Membership does not mean every source site is Web 1.0; the adaptations deliberately keep that focus.

For the requested database feature, distinguish Anish's browser-local score and Grace's session seed from a real shared count. The [community recipes](community-and-content.md#numbers-and-objects-visitors-can-change) explain server-owned atomic writes, failure states and abuse boundaries. For music, a pressed sound toggle or a video tag proves neither audible playback nor permission to reuse a recording. [Webamp and cassette recipes](community-and-content.md#reasons-to-come-back-and-listen) remain the direct implementation paths.

The [first-half notes](../research_notes/Personal%20portfolio%20reference%20library/ring-a.md), [second-half notes](../research_notes/Personal%20portfolio%20reference%20library/ring-b.md), [direct-fetch corrections](../research_notes/Personal%20portfolio%20reference%20library/evidence/ring-a-fetch-checks.json) and [membership inventory](../research_notes/Personal%20portfolio%20reference%20library/purdue-members.json) preserve provenance. All **31 destinations** received a current content check; **nine distinct member sites** received bounded REA study. This is not an exhaustive subpage or external-link check, and membership/order can change after the timestamp in the inventory.

No comprehensive mobile, performance, keyboard, accessibility, licensing or security audit was performed. No audio was listened to, no shared write deliberately submitted, no account action or membership request sent, and no website built or deployed. Ordinary page loads can still produce access logs and embedded requests. Borrow the principle and make original assets; reachable art, music and code do not automatically grant reuse permission.
