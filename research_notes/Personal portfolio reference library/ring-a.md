# Purdue Hackers ring first half

Research date: 2026-10-18. Scope: current ring inventory and members 1–16. [Polished first-half draft](../../library/purdue-webring.md). [Authoritative ordered membership](purdue-members.json). Second-half research belongs to ring-b.md. No website implementation or external submissions.

## What is the current membership and what was checked?

### Takeaway

The live index displays 31 members; 31 unique ordered name/host pairs were extracted from current HTML. First-half coverage includes a page-level check of every member 1–16, with direct fetch recovery when web text tools failed or returned stale content.

### Cited Findings

- [Live ring](https://ring.purduehackers.com/) supplies current names/hosts, member count and order. Local snapshot records source, exact UTC access time, chosen direct HTTPS checks and ring visit URLs. Direct URLs avoid deliberate activation of ring tracking redirects.
- 1 [Anish](https://eightlegman.neocities.org/) direct HTTP200 after web-tool restriction. Source shows river simulation and locally persistent scoreboard.
- 2 [Manitej](https://www.manitej.com/) direct HTTP200, current title Manitej Boorgu, home/work/contact, personal intro, yearly song and selected work. Initial web extraction returned older “soon” content; do not use it as current evidence.
- 3 [Charlie](https://imasepan.github.io/) direct HTTP200 and successful REA; appearance and overlay controls.
- 4 [dbmaindex](https://dbmaindex.org/) public text and REA successful; font readability control, blog/RSS, technical portfolio.
- 5 [Kira](https://kchynayev.com/) sparse text fetched, identity and study/design focus. Do not infer visual behavior.
- 6 [Ethan](https://ethankawley.com/) text fetched, personal interests/links, Commits region; [projects](https://ethankawley.com/projects/) contains real project descriptions/years.
- 7 [Neel](https://neels.page/) hardware archive text fetched, feature lists/year/repository links.
- 8 [Ishan](https://quackduck.github.io/) direct HTTP200 after web-tool restriction, personal lists, recent work, open questions, video tag.
- 9 [Amber](https://amberzeng.com/) text fetched, project list and repeated sheep images; motion unknown.
- 10 [Artus](https://artusmosquet.com/) root text extraction empty; REA resolves to /en/ with substantive homepage, activity/reading/music/hardware.
- 11 [TheDarkLynx](https://thedarklynx.com/) text fetched, mixed personal/technical posts and music.
- 12 [Habiboi](https://habiboi.neocities.org/) text fetched, fictional Banana University.
- 13 [Angela](https://angelazqian.github.io/) text fetched, terminal-like prompt with normal bio/navigation.
- 14 [Alicia](https://www.alicias.page/) text fetched and REA interaction/visuals, ASCII/text reveal, sound preference.
- 15 [Jadden](https://www.jaddens.page/) text fetched and REA theme action, work gallery and Now link.
- 16 [Aryan](https://www.aboutsharma.com/) text fetched, engineering intro and external live-server link; that server was not visited.
- [Direct recovery receipt](evidence/ring-a-fetch-checks.json) retains current statuses/titles/snippets for Anish, Charlie, Ishan and Manitej.

### Inferences

- Diversity is broader than early-web styling, but elements can be translated into a Web1 personal world without copying contemporary compositions.
- Best distinctive ideas: small ecosystem, whole-atmosphere mode, text decoding, readability font and authored personal-status modules.

### Gaps

- Text-fetch access is not exhaustive visual inspection. Every row has precise evidence boundaries in the chapter.
- No second-half claims made here; writer integrates ring-b.
- No intentional shared visitor-counter increments or external account/service writes.

## What do REA and delivered source prove technically?

### Takeaway

Five new distinct ring targets received actual declared REA interaction; all selected results have compact receipts. Anish’s technically rich simulation is source-inspected, not runtime-playtested.

### Cited Findings

- [Alicia receipt](evidence/ring-a-alicia.json), Evidence `ev_0e66a4bd06d7aeea81ff53d31558b9290f46e6787a906102e9c474f065029246`: initial/500ms/later DOM snapshots show scrambled heading character spans resolving to final letters; preformatted computer art resolves too. Clicking Sound effects changes aria-pressed true to false. Actual screenshot reviewed. No audible playback tested.
- Alicia DOM includes data-shuffle-frames and a background canvas whose data-engine declares three.js r177. This is a bounded DOM fact, not an audit of rendering code. A shipped script was briefly inspected; no exact shader algorithm asserted.
- [Charlie receipt](evidence/ring-a-charlie.json), Evidence `ev_fc6d1fbfea616a8fa84b764b1467877471d0d746ad0d224ed709f617e07f5ccd`: Clouds click changes root data-appearance default→frutiger and selected state. Screenshot is sky/cloud scene, lower-left content/menu, music embed and ring.
- [Charlie served script](https://imasepan.github.io/script.js?v=20261007-1) exposes allowlisted appearance choices, separate theme/weather state, pressed-state sync, reparenting of existing music/ring elements, local storage access guards and handled audio-play rejection. Reduced-motion special handling for palette transition is commented out. Full cloud-renderer algorithm not audited.
- [dbma receipt](evidence/ring-a-dbma.json), Evidence `ev_1abfb74de67eab000fd2659bd4d13918330db6e5bffefc6c57d906a3893bb3a4`: root --font-family changes mainFont,serif→serif on readability click. Actual screenshot reviewed.
- [dbma served source](https://dbmaindex.org/scripts.js) sets font from a sessionStorage preference and updates Date-based clock every second. Clock is browser local time, not proof of backend status. Project template-cloning function present but not exercised.
- [Artus receipt](evidence/ring-a-artus.json), Evidence `ev_4591357b7f6c229084f68e450788f2b9ad2753ea87d9d5a9503191c093c9dd7a`: theme light→dark, screenshot reviewed. Homepage has reading/last-played music/hardware/activity cards; backend freshness unknown.
- [Jadden receipt](evidence/ring-a-jadden.json), Evidence `ev_8ac6fb5af7deaa4fabbce968888cbddf9c3033875682deaa11c659f8925c643d`: Dark Mode click leads root dark and button Light Mode. No screenshot requested, so no visual appearance claim.
- [Anish served inline source](https://eightlegman.neocities.org/) creates 2D canvas, 8x10 CSS-pixel character grid, character/color/background arrays and DPR capped at2. River entities include water, pads, frogs, koi and flies. Score totals are saved in localStorage key riverScore; label and source explicitly bound totals to this browser. This is not evidence of shared persistent database data.

### Inferences

- Whole-atmosphere states can use one root attribute and CSS; recreating cloud shader not necessary to recreate navigational concept.
- Bitmap heading language can coexist with a readable system font preference.
- A finite text reveal needs no large library in an original implementation.
- Browser-local play history and globally shared activity should be modeled and labeled separately.

### Gaps

- Five REA targets, not all16. Controlled temporary Chromium, 1280x900, reduced motion requested, service workers blocked; processes terminated.
- No mobile/Safari/keyboard-complete/assistive-technology/performance/full source or backend audit.
- Receipts are selected extracts, not complete portable bundles. Screenshot hashes retained, bitmap files not persisted.
- No runtime confirmation of Anish simulation, scoreboard increments, readout updates or all accessibility behavior.

## What should be recreated and how?

### Takeaway

Chapter gives six deep ideas and eight smaller content conventions, each grounded in actual page/source evidence and separated from proposed original implementation.

### Cited Findings

- [Anish](https://eightlegman.neocities.org/) provides concrete grid/ecosystem/local-score precedent; proposed original adaptation is robot/conveyor with parts.
- [Charlie](https://imasepan.github.io/) provides concrete multi-atmosphere state; proposed adaptation is workbench/night/rain using original artwork.
- [Alicia](https://www.alicias.page/) provides finite decoding/text reveal and controllable sound-state precedent; proposed adaptation is a robot introducing itself.
- [dbmaindex](https://dbmaindex.org/blog.html) provides font readability toggle.
- [Artus](https://artusmosquet.com/en/) provides personal activity/reading/music/gear dashboard.
- Current [Manitej](https://www.manitej.com/), [Ishan](https://quackduck.github.io/), [Neel](https://neels.page/), [TheDarkLynx](https://thedarklynx.com/), [Amber](https://amberzeng.com/), [Angela](https://angelazqian.github.io/), [Habiboi](https://habiboi.neocities.org/) and [Jadden](https://www.jaddens.page/) support smaller song/open-question/project/notes/mascot/terminal/parody/theme-label conventions.

### Inferences

- State/drawing pipeline: CSS-sized stage→bounded grid→elapsed-time updates→canvas draw→visible text state; optional local history, separate API for global data.
- Text reveal pipeline: stable final string→finite changing decorative duplicate→exact final restoration; reduced motion final state immediately.
- Font pipeline: one CSS variable, flexible layout and storage guard; leave content and navigation ordinary.
- A personal-status board can begin as dated Markdown data, avoiding APIs until actual live integration matters.

### Gaps

- No implementation, selected final style or cost benchmark.
- Licensing and copying rights for all reference assets unknown. Use original artwork and authorized audio.
