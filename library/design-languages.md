# Web 1.0 design languages

Research checked **October 18, 2026**. This is a reference library and a set of proposed reconstruction recipes, not an implemented site. The variety here stays inside personal-web traditions: your page can be a workshop, fan shrine, toy box, notebook, radio station, directory or computer without adopting a modern agency portfolio.

**Evidence key:** **REA observed** = controlled browser interaction; **pixels reviewed** = actual screenshot inspected; **public page** = text fetched; **author-documented** = creator explicitly describes it. All “make your version” guidance is a proposal, not a claim about an example’s exact implementation. Browse the original links before choosing graphics; visible assets are not automatically licensed for reuse.

## Browse by mood

| Language | References (new/reused from original research) | What it gives your portfolio | Cost |
|---|---|---|---|
| GeoCities maximalism | [Cameron’s World](https://www.cameronsworld.net/) reused; [OMFG](https://omfg.neocities.org/) new | Welcoming chaos, discoveries, personality | Medium: asset curation |
| Handcrafted HTML home | [Neustadt](https://neustadt.fr/), [Cyber Vanguard](https://cyber.dabamos.de/) new | Readability, hobbies and technical depth together | Small |
| Terminal and BBS | [tilde.town](https://tilde.town/) new | ASCII, logs, compact commands and system atmosphere | Small–medium |
| Windows desktop | [98.js](https://98.js.org/) new; [Poolsuite](https://poolsuite.net/) reused | File/folder metaphors for projects and notes | Medium; high with real window management |
| Ornate pixel dollhouse | [cinni](https://cinni.net/) new | A detailed personal frame and many tiny rooms | Medium–high artwork |
| Illustrated room or map | [Aster’s Archive](https://astersarchive.neocities.org/Home) reused; [Space Jam 1996](https://www.spacejam.com/1996/) new | Explore objects rather than a generic menu | Medium artwork |
| Scrapbook and zine | [Yesterweb Zine](https://yesterweb.org/zine/), [OMFG](https://omfg.neocities.org/) new | Mixed notes, scans and project ephemera | Medium |
| Shrine or fanpage | [fauux](https://fauux.neocities.org/), [cinni’s shrines](https://cinni.net/shrine) new | Deep affection for one topic | Small–medium |
| Dithered cyber transmission | [fauux](https://fauux.neocities.org/) new; [apvl](https://apvl.dev/stuff/personal-portfolio/) reused | A coherent low-color visual signature | Medium |
| Early portal or neighborhood | [GeoCities Gallery](https://geocities.restorativland.org/), [Cyber Vanguard](https://cyber.dabamos.de/) new | A browsable index of interests and projects | Small |
| Media-player skin | [Webamp](https://webamp.org/), [Poolsuite](https://poolsuite.net/) reused; [Neustadt](https://neustadt.fr/) new | Music as a personal artifact | Medium |
| Living community instrument | [tilde.town](https://tilde.town/) new | A shared number can become a visual world | Medium plus API if shared |

Costs mean relative implementation effort, not estimates from measured builds. The same site may exemplify several languages. Choose one organizing language and a few elements from others.

## 1. GeoCities maximalism

**References:** [Cameron’s World](https://www.cameronsworld.net/) describes itself as a collage assembled from archived GeoCities material. [OMFG](https://omfg.neocities.org/) has informal updates, graphics, cliques, webring controls and collections. These are public-page evidence; motion, page weight and keyboard quality were not audited.

**Grammar to explore:** tiled wallpaper; a compact readable center; small decorative GIFs around it; image dividers; badges; repeated but deliberately uneven sections; a welcome message that sounds like a person. A noisy outer edge with quieter reading panels is easier to use than noise everywhere.

**Make your version:** use a normal header, navigation, main and aside in CSS Grid. Put a small repeating original PNG on the body and a solid surface under text. Build a local “graphics kit” of perhaps one robot mascot, three dividers, two buttons and a handful of stamps. Keep decorative art out of the accessible name of links. Reuse those pieces across projects and notes; do not keep adding unrelated art to fill space.

**Portfolio adaptation:** each project gets a tiny sign, an honest status stamp and a link into its own themed page. A “new arrivals” strip points to recent notes.

**Mobile/fallback:** stack sidebars, retain full-size reading text and let badges wrap. A static GIF alternative should be available for ongoing decorative motion. Complexity is primarily curation and restraint, not a framework.

## 2. Handcrafted HTML home

**References:** [Neustadt](https://neustadt.fr/) explicitly calls itself a tribute to the creative 1990s web and labels its pages hand-coded; writing, music, guestbook and retro resources coexist. [Cyber Vanguard](https://cyber.dabamos.de/) exposes technical categories, a diary, hot links and construction/update imagery. Public-page evidence.

**Grammar to explore:** ordinary headings and lists, readable paragraphs, small icons as accents, horizontal rules, visible dates and an index that fits in your head. This is early-web personality without visual overload.

**Make your version:** one static HTML template and one stylesheet; Markdown can supply project articles and dated notes at build time. Use a comfortable measure around 65–75 characters, ordinary links and a small persistent home/navigation area. A build-generated “last edited” date must mean an actual content edit, not today’s clock.

**Portfolio adaptation:** a projects list can start empty with a candid note. Keep an “experiments” subsection for real unfinished work rather than inventing case studies.

**Mobile/fallback:** this approach naturally reflows; check long code/URLs and images. It is the smallest way to keep the site maintainable while adding an ASCII toy elsewhere.

## 3. Terminal and BBS

**Reference:** [tilde.town](https://tilde.town/) exposes ASCII headings/scene art, user links, a server-status line and a dot field explained as user activity. REA clicked “hide all this text”: the DOM changed from an ordinary `main` to `main.dotted`. A screenshot confirmed black background, monospace text, a purple dot grid, side links, ASCII art and small badges. It is a community site, not a personal portfolio, so borrow its language rather than its social infrastructure.

**Technical evidence:** the [served CSS](https://tilde.town/index.css) uses character-based column widths, flex layout and breakpoint rules; dot links are inline-block circles. `main.dotted > *:not(#heatmap)` hides other main content. This is ordinary DOM/CSS, not evidence of a canvas engine.

**Make your version:** use a `pre` for an ASCII logo, a normal list for sections and code-like labels such as `projects/`, `log/` and `contact.txt`. Use one real command input only if you want command behavior; dispatch a small allowlist of commands to links, never evaluate input as JavaScript.

**Portfolio adaptation:** “boot log” lines can show project milestones and a small robotic diagnostic; label fictional readings as playful fiction.

**Mobile/fallback:** give wide ASCII its own horizontal scroll area or a separate compact artwork. Plain navigation must work without typing. Avoid a compulsory fake boot delay. Small for styling, medium for a command interface.

## 4. Windows desktop

**Reference:** [98.js](https://98.js.org/), REA observed and pixels reviewed. Its desktop has icon columns, cloud wallpaper and a bottom taskbar. Clicking Start exposed a novelty strawberry-tart panel; it did **not** establish a faithful Windows Start menu. See the evidence ledger below.

**Technical evidence:** captured DOM loads separate desktop, folder, taskbar and window scripts. Its [served theme stylesheet](https://98.js.org/lib/os-gui/windows-98.css) defines named system-color variables and image-backed border treatments. Script filenames describe organization, not proof that every program worked. [98.css](https://jdan.github.io/98.css/) is a separate documented CSS-only option using semantic controls; it is not the implementation observed inside 98.js.

**Make your version:** first use in-flow sections styled as windows. A project list becomes a folder; a short-notes page becomes Notepad; a local audio player becomes a stereo. Title bars and beveled borders establish the metaphor without moving windows.

If movable windows become essential, explicitly model open/closed state, focus order, stacking, bounds and reset positions. Native links still need distinct URLs. A window must not get trapped offscreen after resize.

**Mobile/fallback:** switch to stacked windows with large controls; single-tap links should open content. Keep zoom enabled. Medium for appearance; high for a polished desktop manager.

## 5. Ornate pixel dollhouse

**Reference:** [cinni’s dream home](https://cinni.net/), REA observed and pixels reviewed. The captured frame has an ornate header, side panels, a central content region, tiny icon navigation and textured surroundings. Public navigation includes dollz, shrines, adoption center, toy box and ASCII art. This is a strong example of organizing many interests within one visual home.

**Technical evidence:** the top-level DOM contains a named iframe and links targeting that frame. Clicking the theme button reloads the page; `html[data-theme]` changed from `null` to `dark`. [Served CSS](https://cinni.net/style.css) assigns theme variables for background, layout image, colors and icons. The observed “dark” theme is visually pale: attribute names are not reliable color descriptions. Weather and music-related errors also occurred, so the widgets were not all working in the test.

**Make your version:** draw an original small pixel frame as pieces or a nine-slice border, put real text inside, and give every content destination its own page. A theme can change the frame, accent and icon set together using a root data attribute. This recreates the coherence without adopting the iframe architecture.

**Mobile/fallback:** remove or simplify outer ornament; make central content fluid and put navigation above it. Use readable body text even if headings use bitmap lettering. Medium–high because custom art and responsive framing take time.

## 6. Illustrated room or map

**References:** the earlier [Aster’s Archive](https://astersarchive.neocities.org/Home) research found room/minimap exploration and a plaintext sitemap. The fetched [Space Jam 1996](https://www.spacejam.com/1996/) landing page demonstrates an image-centered entrance, but the text fetch does not prove its hotspots or mobile behavior. Treat it as historical visual browsing, not a tested navigation model.

**Grammar to explore:** one scene, object-based destinations, a little spatial logic and enough visible labels that a visitor understands what is clickable. A robot bench, dorm desk or radio hut would fit your interests better than a generic fantasy environment.

**Make your version:** a positioned illustration container with ordinary labeled anchors over it. Store hotspot positions as percentages relative to the artwork. Each opens a real URL; a visible list repeats the destinations. An SVG with a viewBox can scale a vector scene; a raster scene may be simpler if you want pixel art.

**Portfolio adaptation:** notebook → thoughts; toolbox → projects; receiver → music; door → webring. Add one nonessential drawer for the easter egg.

**Mobile/fallback:** replace the scene with a portrait crop and a list when targets would become too small. A full game engine is unnecessary for a static room. Medium artwork; higher if objects animate or require puzzle state.

## 7. Scrapbook and zine

**References:** [Yesterweb Zine](https://yesterweb.org/zine/) documents an archived collaborative digital magazine that ran August 2021–January 2023. It is an archive, not an active call for submissions. OMFG’s informal dated homepage is a complementary example of allowing updates and graphics to feel unfinished and personal. Page evidence establishes content organization; it does not establish a specific paper texture.

**Grammar proposed:** clipped photographs, hand-drawn arrows, scanned notebook scraps, stamps, loosely aligned headings and small marginal notes. Pick a limited family of paper colors and use art selectively.

**Make your version:** semantic article blocks in a Grid layout; decorative tape and corner folds as pseudo-elements; scan thumbnails linked to full-resolution originals with a text transcription. Small fixed rotations can make cards feel placed, but do not rotate long reading text or use absolute positioning for entire articles.

**Portfolio adaptation:** show build photos, failed sketches and “what I learned” snippets between finished pieces. A “bench scraps” stream suits your quick notes.

**Mobile/fallback:** straighten cards, reduce overlap and read in DOM order. A scanned page alone is not accessible content. Medium design work, little JavaScript required.

## 8. Shrine or fanpage

**References:** [fauux](https://fauux.neocities.org/) ties writing, imagery and music to Serial Experiments Lain and related cyber culture. [cinni’s shrines index](https://cinni.net/shrine) lists separate interest pages. Public-page/author evidence; no puzzle solution, login or guestbook interaction was attempted.

**Grammar proposed:** a deep page about something you care about, with its own header, small gallery, annotated links and a personal explanation. A shrine is permission to devote space to enthusiasm rather than career credentials.

**Make your version:** a route such as `/shrines/robots/` with the usual home/footer links, its own accent variables and a list of credited references. Use your own photos or licensed illustrations. Keep external music as a deliberate link or opt-in player.

**Portfolio adaptation:** an old robot, a favorite instrument, a meaningful campus place or a hobby could connect to projects without becoming a résumé section.

**Mobile/fallback:** wrap galleries, caption images and provide a conventional top-level way out. Do not hide essential navigation in an intentional maze. Small–medium; content curation is the main effort.

## 9. Dithered cyber transmission

**References:** fauux’s anniversary entry directly attributes its dithered visual style to an early 10 MB Neocities limit. The earlier [apvl portfolio write-up](https://apvl.dev/stuff/personal-portfolio/) documents music-reactive dithered noise alongside thoughts and projects. These are author explanations, not proof of the exact algorithm running on every page.

**Grammar proposed:** a restricted palette, compressed-looking portraits, signal labels, fine rules, little bitmap symbols and occasional strong accent color. Keep the dither in images and artwork; ordinary text should stay sharp.

**Make your version:** crop your original photo, downsample deliberately, then export a two/four-color dithered PNG at build time. Compare ordered patterns with error diffusion. Keep the undithered source for future edits. Scale pixel images deliberately with [image-rendering](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/image-rendering); that property scales images and does not perform dithering.

**Portfolio adaptation:** portrait as a received transmission; a project gets a low-color preview and normal detail images inside its article.

**Mobile/fallback:** swap to a tighter crop; never make wiring labels unreadable. A live shader is optional and substantially more work than a static conversion. Small for static assets; medium/high for live processing.

## 10. Early portal or neighborhood

**References:** [GeoCities Gallery](https://geocities.restorativland.org/) organizes an archive by named neighborhoods including hardware/software and science categories. It warns that restored pages can contain objectionable material and that some have sound. Cyber Vanguard provides a smaller personal example of thematic technical categories and hot links. Both were text-fetched, not exhaustively browsed.

**Grammar proposed:** compact category headings, real descriptions, subdirectories, “new” labels, badges and direct routes to many destinations. The page acts like a front desk.

**Make your version:** an HTML list grouped by topic; a small Markdown data file can hold title, URL and your one-sentence reason for each external link. Project folders can be styled similarly. Start with manual curation; no search engine is needed for ten links.

**Portfolio adaptation:** “Lab” → projects; “Notebook” → notes; “Neighborhood” → people; “Library” → resources. A clearly labeled random-link button may pick only from your curated list.

**Mobile/fallback:** a single column of groups. Keep link labels descriptive rather than making every link “here.” Small; ongoing broken-link maintenance is the real cost.

## 11. Media-player skin

**References reused:** the earlier [Webamp](https://webamp.org/) and [Poolsuite](https://poolsuite.net/) REA studies establish real player controls and desktop-oriented components. [Neustadt](https://neustadt.fr/) links a retro collection including Winamp skins. Its mention is not proof that it embeds a working player on the homepage.

**Grammar proposed:** compact title bar, tiny transport controls, a readable track label, progress display, a playlist drawer and a few consistent skin colors. The rest of the site can echo the player’s bevels and labels.

**Make your version:** reuse Webamp if actual Winamp behavior is central; otherwise style an HTML audio player with a small custom control panel and an ordinary native-control fallback. Controls must reflect real play/pause/error state. Only publish tracks you may distribute.

**Portfolio adaptation:** a little “listening desk” can hold a short creator-approved playlist, liner notes and links to artists. Do not require sound to understand projects.

**Mobile/fallback:** player fits the viewport and starts only after user input. Pause/volume must remain reachable. Medium; continuous music across page navigation changes routing and requires a separate design decision.

## 12. Living community instrument

**Reference reused within this chapter:** tilde.town gives a concrete precedent for mapping community state to a visual field. Its public copy explains the activity meaning, while REA and the delivered CSS establish actual linked dots and a content-hide toggle. This does not reveal its server implementation or exact update schedule.

**Grammar proposed:** one tiny object changes with a shared number: a robot’s battery, a garden row, a panel of bulbs, or a constellation. Include a plain caption such as “Collective boops: 2,314.”

**Make your version:** fetch the total from a small server-side endpoint and map it deterministically to a bounded number of decorative shapes. Keep the numeric label authoritative and make the visual a summary. A locally saved theme or discovery stamp is different from shared data. Never present a localStorage value as all visitors’ activity.

**Portfolio adaptation:** “Help power the robot” is one memorable interaction; it fits the workbench better than a random analytics dashboard.

**Mobile/fallback:** show the caption and a still image when fetch fails; writes should not be required to navigate. Medium plus rate limiting, storage and operational work covered in the community chapter.

## Reusable element recipes

These are small reconstruction patterns, not extracted original implementations.

| Element | Shape and implementation | Fallback or failure case |
|---|---|---|
| Tiled wallpaper | Small original seamless PNG via `background-image` and repeat; solid reading panels | Plain color if asset fails; do not tile over text |
| Nine-slice ornamental frame | Draw corners/edges once; use [border-image](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/border-image) around a resizable content box | Solid border fallback; information stays in HTML |
| Raised/sunken bevel | Light top/left, dark bottom/right border; reverse on pressed buttons | Keep native semantics and visible focus; study [98.css](https://jdan.github.io/98.css/) |
| Bitmap icon + label | Small image plus real anchor text in one hit area; consistent 16/32px art | Text label works if image/font fails |
| Theme as whole skin | Root data attribute selects variables for color, wallpaper, frames and icons | Default always readable; storage access can fail |
| Directory tree | Nested lists; [details/summary](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details) for optional folders | Essential destinations stay discoverable; avoid fake tab semantics |
| Under-construction status | Original badge plus text explaining what actually exists | Never use a fake link or disabled-looking link as only route |
| “New” project stamp | Display based on actual published date or manual flag | Expire it or it becomes meaningless |
| Sidecar short log | Dated list of one-paragraph thoughts, newest first, archive link | Markdown source can work without a visitor database |
| ASCII masthead | One preformatted block, fixed-width font, separate compact version | Decorative art hidden from screen readers; nearby actual heading |
| Pixel gallery | Thumbnail grid; larger original and caption on a real page | Do not dither diagrams where small details matter |
| Room hotspot | Real anchor over normalized percentage coordinates in scene | Visible equivalent link list and generous focus outline |
| Tape/sticker margin | Decorative pseudo-element or empty-alt original artwork | No overlap with text or controls at zoom |
| Activity constellation | Bounded links/shapes derived from known data | Plain numeric/list equivalent; label data freshness |
| Welcome ticker | Static first message; optional CSS movement with pause | Reduced motion starts still; no deprecated marquee needed |
| Site colophon | Build/content date, typeface/asset credits, “made by me,” feed and source link | Do not expose private paths or invent “live server” statistics |

For optional animation, explicitly design the still state using [prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion). Reduced-motion preference alone is not a complete accessibility audit.

## Three coherent combinations to consider

**Robot workshop:** handcrafted index + dithered photos + a compact ASCII robot + stamped project folders + bench-scrap notes. One visible “power the robot” total supplies the shared interaction. This gives the strongest link to your actual interests while leaving room for later projects.

**Dorm computer:** in-flow Windows panels + project folder + Notepad thoughts + opt-in Webamp + neighborhood buttons. Add window dragging only if you decide it matters enough to maintain; the frame alone already communicates the era.

**Personal radio outpost:** cyber palette + transmission portrait + station log + listening desk + illustrated antenna/map. Put the easter egg in the radio’s tuning panel; ordinary contact/project routes remain visible.

These combinations are proposals, not decisions made for you. Keep the homepage’s central purpose readable in the first screen: who you are, what you make, where to explore.

## REA evidence ledger and boundaries

| Target and capture | Demonstrated | Remaining limits |
|---|---|---|
| 98.js: `ev_a74dab61c1441ccbcdca996a770e652fe331dcbec31f498d2794425887551722` | Start click changes selected state and exposes novelty panel; desktop DOM and script references | Programs, dragging and keyboard behavior not exercised |
| 98.js visual: `ev_1d5526f19df05f35389f3ceee1bd7a7906f5d1d22cb8f8beb15dfa3771a8b3cd` | Actual screenshot inspected after click and settle | One 1280×900 frame |
| cinni: `ev_cb00a8f2375402d8509b761416d0ab4d5e32b70397d06efb1065768fbe86128c` | Theme click/reload changes root attribute; named iframe; actual screenshot inspected | Weather/music errors; no cross-session persistence audit |
| tilde.town: `ev_3e397fa5b864df8d4edc367703b272d7ad4e2484b53f8ff4763e4f57ef4490f2` | Hide-text click toggles main class; dot links and screenshot inspected | No activity/backend audit; some other columns remain visible |

Compact receipts: [98.js DOM](../research_notes/Personal%20portfolio%20reference%20library/evidence/design-98js.json), [98.js pixels](../research_notes/Personal%20portfolio%20reference%20library/evidence/design-98js-visual.json), [cinni](../research_notes/Personal%20portfolio%20reference%20library/evidence/design-cinni.json), [tilde.town](../research_notes/Personal%20portfolio%20reference%20library/evidence/design-tilde.json). These are selected extracts, not full portable Evidence bundles or stored screenshot files. Every controlled run used an owned temporary Chromium profile, 1280×900, reduced motion and blocked service workers; owned processes were terminated. No forms, messages, memberships or submissions were sent.

[Melonking](https://melonking.net/) currently returned a “closed on Mondays” page. That is an interesting personal-site convention but did not establish the rest of its live design, even though the user-facing research date is Sunday in Indianapolis; do not turn it into an uptime or timezone conclusion. Dokodemo, Ribo, Koinuko, Solaria and Hillhouse were not usable through the chosen text-fetch route. They are leads, not verified examples in this chapter. Moth.monster was retrieved but its short text response did not supply enough visual evidence to make it a main style reference.

No mobile, Safari, assistive-technology, full licensing, performance or backend audit was performed. Reference pages can change after this check.
