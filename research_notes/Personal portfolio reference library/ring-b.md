# Purdue ring members 17 through 31

Checked October 18, 2026. Scope: the second half of the live ring inventory assigned by the coordinator. Membership/order comes from the separate live ring inventory; the destination observations below come from actually fetching each site's direct HTTPS address. No ring `/visit` redirect, public submission, vote, message, pet click or deliberate counter write was performed. A page GET can still cause ordinary analytics/access logging.

## Coverage of all 15 assigned members

**Page** = primary text/HTML fetched; **REA** = controlled headless-browser capture. No screenshot review was performed, so visual descriptions below are grounded in DOM/CSS and are explicitly not a visual-quality audit. Ring membership does not make every design Web 1.0: several are modern portfolios or blogs. Adaptation ideas preserve the user's Web 1.0 focus.

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

All 15 direct destinations returned primary page content or meaningful rendered REA DOM. No destination is recorded as unreachable. This says nothing about every subpage or external link working.

## New REA evidence and actual controlled behavior

All captures use the already-installed Chromium executable `C:/Users/fartpad/AppData/Local/ms-playwright/chromium-1248/chrome-win64/chrome.exe`, viewport 1280×900, reduced-motion preference requested, service workers blocked and owned temporary profiles. Every completed capture reports `terminated-owned-process`; none records a page error during its bounded window. No screenshot, network response bodies, credential collections or server implementation was captured. These local JSON files are selected extracts, not full canonical Evidence records.

| Evidence ID | Receipt | What was actually observed |
|---|---|---|
| `ev_b1d92062c04c35ca0473f2a7e97f0dd56327a339a0178e4bb1c529dec72e7deb` | [arhan initial](evidence/ring-b-arhan.json) | Homepage DOM, inline prompt handler, template, title spans, navigation and ring links. Source text identifies a timed local text/DOM effect; that alone would not prove its execution. |
| `ev_4315ad553bb0886f393a609f124f0cb238afffc5e6074860d6daaf312c64a8e5` | [arhan egg interaction](evidence/ring-b-arhan-egg.json) | Clicked `#ssh-text`, waited 5 seconds and then 16 seconds. Final `<main>` is replaced by a humorous unavailable/reload template; normal introductory content is absent from final accessibility tree while sidebar/footer remain. DOM hashes change across steps. This is the executed egg. No shell command was run; the inspected handler only types a theatrical string and mutates local DOM. The scenario did not press its reload control. |
| `ev_8756949b60975052481e0a8e4f3cdae8b793a9fcfbb6210b963196a42fd37c18` | [trev3d initial](evidence/ring-b-trev3d.json) | Eight real linked projects containing video tags with `autoplay`, `muted`, `playsinline` and `loop`; sidebar iframe and mobile Menu link. Actual video playback, hover transition pixels and iframe keyboard behavior not tested. Captured accessibility tree exposes unnamed project links, a reason to improve labeling in a recreation. |
| `ev_44f9301d44180a7057234f3c43ddc7f5a49d9aaf7c4b5ee2cdf640128a697838` | [grace initial](evidence/ring-b-grace.json) | `aria-hidden` canvas, inline source defining 2D paths/seed/motion controls, friends image links, separate art/blog RSS and ring links. Reduced-motion requested; no screenshot or frame-by-frame motion verification. Source mechanisms are source-observed, not a claim every code branch ran. |
| `ev_857448a849de376250dc69c332cc3085444411534fbf12d64e729a2b5b73762b` | [kimjammer initial](evidence/ring-b-kimjammer.json) | Apex redirects to www; actual project text renders, SVG clip paths, aliases/roles and transform/opacity states are present; CSS asset contains corresponding clipping/animation structures. Rotator progression and logo intro completion were not separately timed. |

Additional shipped styles fetched as primary assets with Invoke-WebRequest after web reader did not accept CSS: [trev3d style.css](https://trev3d.com/resources/style.css), [Arhan layout CSS](https://arhan.sh/_astro/Layout.BDF9d86Y.css), [KimJammer current page CSS](https://www.kimjammer.com/_app/immutable/assets/2.BrUA1B4o.css). Hashed asset URLs are discovery-time identities and can change; homepage links are the durable reference. Trev3d's [navigation page](https://trev3d.com/nav.html) was separately text fetched. No need to copy these authors' assets or code to recreate the abstract mechanisms.

## Borrowable element recipes

Every recipe below is a proposed recreation for Lucas's site, not an assertion that the reference uses our backend, storage model or accessibility approach. Relative effort S = small static/CSS/JS; M = integration/animation with careful fallback.

### RB01 — A terminal prompt that performs a theatrical local easter egg

**Reference:** [Arhan](https://arhan.sh/), both REA records above. **S–M; browser-local, no database.**

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

## Limits and completion of this half

- All 15 assigned destinations were retrieved, including one browser-rendered fallback for an empty text result. Four distinct new REA targets and five valid Evidence records are retained.
- One actual local interaction was exercised to completion: Arhan's prompt-to-page-erasure sequence. No external actions or shell commands were run by that interaction; only the declared browser click/waits and local page handler executed.
- CSS and inline JavaScript reveal mechanisms but do not prove every runtime branch executes, every animation looks good or every site meets accessibility/performance requirements. Where evidence is only a page category/control, it is labeled as such.
- No website code, build, service configuration, account action, commit, membership request or deployment. No screenshots, audio listening or exhaustive link/mobile/keyboard audit.
