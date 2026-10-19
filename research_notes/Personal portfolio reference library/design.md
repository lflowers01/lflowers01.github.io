# Web 1.0 design languages and layouts

Research date: 2026-10-18. Deliverable chapter: [design-languages.md](../../library/design-languages.md). Earlier report and all its notes remain unchanged. No portfolio implementation, package installation, service write or submission.

## Which new and previous references provide useful variety?

### Takeaway

The library should offer variety within handmade personal web traditions. Ten newly inspected main reference sites and five reused sites support twelve proposed design languages, rather than importing a modern agency/SaaS aesthetic. Cinni's shrine subpage counts within cinni, not as an additional site.

### Cited Findings

- [OMFG](https://omfg.neocities.org/) has dated informal updates, links to graphics and interest pages, badges and webring/clique links. Text fetched. Useful for personal density and modular collections.
- [Neustadt](https://neustadt.fr/) explicitly describes its website as a creative-1990s-web tribute and its pages as hand-coded. It combines writing, original music, a guestbook, retro resources, RSS and ring links. Text/author evidence.
- [Cyber Vanguard](https://cyber.dabamos.de/) groups technical material under programming, Unix and WWW, with a diary, hot links, graphics and construction status. Text fetched. Useful for a technical portfolio index.
- [tilde.town](https://tilde.town/) combines ASCII art, system status, user links and a dot field described as activity. Public copy establishes the semantic intent; browser evidence establishes actual DOM behavior.
- [98.js](https://98.js.org/) is a functioning browser desktop shell in our bounded capture; do not generalize this to every bundled program.
- [cinni](https://cinni.net/) exposes a theme button, named-frame navigation and many personal interest destinations. Actual browser state/pixels studied below.
- [Space Jam 1996](https://www.spacejam.com/1996/) is an image-centered historical landing page. Text fetch is sparse; hotspot interaction was not verified.
- [Yesterweb Zine](https://yesterweb.org/zine/) is a historical collaborative magazine archive, documented as running August 2021–January 2023. Do not frame it as currently soliciting work.
- [fauux](https://fauux.neocities.org/) contains a creator anniversary explanation that its dither style emerged from an early 10 MB Neocities limit. It demonstrates fan identity, imagery, music references, updates and puzzles in the same site. No login or puzzle was attempted.
- [GeoCities Gallery](https://geocities.restorativland.org/) groups restored sites by historical neighborhood. It identifies archive restoration limitations and possible objectionable content; browse with context rather than implying all examples are suitable portfolio patterns.
- Reused references: [Cameron’s World](https://www.cameronsworld.net/) (collage and archive credits), [Aster’s Archive](https://astersarchive.neocities.org/Home) (room/minimap and plaintext navigation, earlier fetch), [apvl](https://apvl.dev/stuff/personal-portfolio/) (author’s dither/music/write-up), [Webamp](https://webamp.org/) and [Poolsuite](https://poolsuite.net/) (earlier REA), plus the prior Sadgrl/Xiokka references retained in the original report, not re-investigated in this chapter.

### Inferences

- Twelve proposed languages can be distinguished: maximalist collage, handcrafted HTML, terminal/BBS, Windows desktop, ornate pixel home, illustrated room, scrapbook/zine, shrine, cyber transmission, portal/directory, player skin and living activity instrument.
- These are analyst labels, not claims that site creators adopt those terms.
- Proposed portfolio concepts: robot workshop; dorm computer; personal radio outpost. They keep projects, notes, music and one shared interaction coherent.

### Gaps

- [Melonking](https://melonking.net/) returned a Monday closure splash. Do not claim its normal homepage was explored, or infer its server timezone from that result.
- Dokodemo, Ribo, Koinuko, Solaria and Hillhouse were unavailable through the selected text-fetch route. Moth.monster returned too little text to substantiate a visual-language analysis.
- Modern candidates fetched before steering (Comeau, Linus Lee, Steph Ango, Frank Chimero, Lynn Fisher) were excluded from the chapter’s main references to honor the Web1 focus.

## What did REA actually establish?

### Takeaway

Three new targets were exercised with declared UI actions, not merely loaded. Before/after DOM changes and three reviewed screenshots establish bounded visual and behavior facts, while delivered CSS answers several implementation questions directly.

### Cited Findings

- 98.js DOM action Evidence `ev_a74dab61c1441ccbcdca996a770e652fe331dcbec31f498d2794425887551722`: click `.start-button` toggled selected class; menu lost hidden/display-none state. The revealed headings describe a strawberry tart. This is a novelty menu, not evidence of a normal Start menu. [Receipt](evidence/design-98js.json).
- 98.js visual Evidence `ev_1d5526f19df05f35389f3ceee1bd7a7906f5d1d22cb8f8beb15dfa3771a8b3cd`: actual screenshot after click and 300ms settle shows cloud wallpaper, icons at left, bottom taskbar and tart panel. Screenshot hash/bytes retained, no bitmap file persisted. [Receipt](evidence/design-98js-visual.json).
- The delivered [98.js theme CSS](https://98.js.org/lib/os-gui/windows-98.css), fetched directly via Invoke-WebRequest after web tool rejected text/css, declares system color variables, border-image resources and inset/outset rules. DOM script names suggest modular shell organization, not audited behavior.
- cinni Evidence `ev_cb00a8f2375402d8509b761416d0ab4d5e32b70397d06efb1065768fbe86128c`: click `button.toggle` and 500ms settle changed `html[data-theme]` from `null` to `dark`; the declared inline handler calls theme toggle and reload. Screenshot shows a pale ornate frame, textured background, pixel icons and center art. Theme name does not describe its actual brightness. [Receipt](evidence/design-cinni.json).
- cinni delivered [style.css](https://cinni.net/style.css) uses root/theme custom properties for layout image, wallpaper, text, link color, icon sources and filters, plus named local fonts. It was retrieved directly. Named iframe and target links were in REA DOM.
- tilde Evidence `ev_3e397fa5b864df8d4edc367703b272d7ad4e2484b53f8ff4763e4f57ef4490f2`: clicked button with accessible name “hide all this text”; `main` became `main.dotted`. Screenshot confirms exposed purple dot field with separate side columns still visible. [Receipt](evidence/design-tilde.json).
- The delivered [tilde CSS](https://tilde.town/index.css) specifies monospace typography, 80ch main width, flex columns, media queries, inline-block circular links, and `main.dotted > *:not(#heatmap)` hiding. Toggle code is inline in captured DOM. No canvas assumption needed.

### Inferences

- The small ingredients are recreateable with semantic HTML, custom properties, standard CSS layout and a few explicit state changes.
- Full desktop emulation is a separate, much larger problem than styling in-flow article panels as windows.
- A shared numerical interaction can be made visually interesting without a large visualization library; that is a proposed adaptation, not tilde backend analysis.

### Gaps

- No mobile, touch, Safari, keyboard-complete, assistive-technology or performance audit.
- cinni capture contained “Weather is not defined” and music-widget fetch errors. Other decorations still rendered; backend health is unknown.
- Temporary owned Chromium 156 profiles were used, viewport 1280×900, reduced-motion reduce, service workers blocked, and owned processes terminated. No signed-in user browser or private storage was accessed.
- No audio was listened to, no guestbook content posted, no membership attempted.
- Receipts are selected extracts, not complete portable Evidence bundles; screenshots were reviewed inline and their identities recorded.

## How can these become reusable elements?

### Takeaway

Make a small visual kit and keep content in ordinary pages. A tiled outer world, readable inner panels, icon labels, real dates, one toy and deliberate music are enough to make a personal place.

### Cited Findings

- [98.css](https://jdan.github.io/98.css/) explicitly documents CSS-only Windows 98 styling, semantic buttons, labels, window parts and tree/details patterns. It is a separate optional implementation resource, not a dependency observed on 98.js.
- [MDN border-image](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/border-image) documents image-based borders and fallback borders, useful for proposed nine-slice frames.
- [MDN image-rendering](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/image-rendering) describes scaling behavior; it does not dither a full-color photo.
- [MDN details](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details) documents native disclosure widgets.
- [MDN reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) supplies a standard opt-out input for optional motion.

### Inferences

- Chapter contains 16 element recipes: tiled wallpaper, nine-slice frame, bevel, icon+label, whole-skin theme, directory tree, construction status, new stamp, short log, ASCII masthead, pixel gallery, room hotspot, tape/sticker, activity constellation, welcome ticker and colophon.
- Every style card names a smallest reconstruction, portfolio adaptation, responsive alternative and relative complexity.
- Use an original palette, photos, sketches and robot imagery rather than copying another person’s composition or assets. Keep essential links visible; easter eggs reward wandering.
- Any snippets in the report are illustrative patterns, not installed code, compatibility-tested components or exact copies of target code.

### Gaps

- No final aesthetic selected; user should choose a coherent organizing world before implementation.
- Licensing of individual graphics/fonts/music has not been audited. Existing sites can show a convention without granting reuse permission.
