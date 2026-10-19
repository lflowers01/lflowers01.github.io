# Interactive elements for a Web 1.0 portfolio

Research checked October 18, 2026. This is a menu of reusable ideas, not a proposal to put every effect on one homepage. The emphasis is on personal homepages, small toys, pixel graphics, desktop metaphors and surprising hyperlinks. Modern browser APIs can reproduce that feeling without reproducing obsolete browser restrictions.

**Evidence labels:** **REA observed** = controlled temporary browser capture; **author documented** = public creator documentation/source; **text fetched** = page retrieved, without claiming visual or interactive verification; **proposed recipe** = our original reconstruction plan, not a claim about how the reference actually works. No screenshots were retained for this chapter. “Pixel,” “dense” and similar visual descriptions below are creative directions unless supported by explicit creator text. New means new relative to the earlier [research report](../reports/Web%20playground%20design%20research.md).

## Browse the references

| Reference | Status | Useful element | Evidence boundary |
|---|---|---|---|
| [Tholman's 90s cursor effects](https://tholman.com/cursor-effects/) — new | REA observed + public source | Dust, ghost arrows, rainbow trails, ants, clock | Captured canvases and loaded effect scripts; no pointer trajectory or screenshot recorded. |
| [Ari / adryd](https://adryd.com/) — new | REA observed + author source | A tiny cat companion and 88×31 friends wall | Captured `#oneko`, sprite resource and script response; did not watch the cat chase a pointer. |
| [GifyPet](https://gify.pet/) — new | REA observed, including a click | An adoptable pet, customizable habitat, retro builder | Refresh click populated preview background. Pet persistence, feeding and backend were not tested. |
| [TextureTown](https://textures.neocities.org/) and [Playroom](https://textures.neocities.org/playroom/) — new | Text fetched | Repeatable textures and an experimentation destination | Categories and playroom route verified; the playroom's rendered interaction was not tested. |
| [A.N. Lucas's Web Lounge](https://anlucas.neocities.org/) — new | Text fetched | Personal lounge and old-web decoration reference | Useful destination, not a runtime or asset-license audit. |
| [Dither Me This](https://doodad.dev/dither-me-this/) — new | Reachable page, text empty | Asset preparation lead for a dithered portrait | The editor did not produce text in fetch; no algorithms/export capabilities verified here. |
| [TAAG](https://patorjk.com/software/taag/) — new | Text fetched | A large ASCII nameplate rather than a conventional logo | Tool page retrieved; output/font permissions need checking when choosing an actual asset. |
| [a1k0n's donut explanation](https://www.a1k0n.net/2011/07/20/donut-math.html) — new | Author documented | An actual explained rotating ASCII object | Math and in-page demo documented; this research did not click its animation controls. |
| [Nicky Case's a(door)able](https://ncase.me/door/) — new | Text fetched | A small standalone toy as a secret destination | Page existence verified; no gameplay or rendering claims made. |
| [Melonking](https://melonking.net/) — new | Text fetched | Site opening hours / a playful “closed” sign | Fetched response said closed on Mondays. This is response content, not proof of correct timezone/scheduling. |
| [ASCII Play](https://play.ertdfgcvb.xyz/) | Reused, manual freshly fetched | Text-grid cursor, cube, flame, plasma, sand and life studies | Manual describes cell functions and text/canvas renderers. No new runtime study of those demos. |
| [apvl portfolio write-up](https://apvl.dev/stuff/personal-portfolio/) | Reused author documentation | A dithered, music-connected visual world | Carried forward from earlier report; not a new capture. |
| [Xiokka's Notepad](https://xiokka.neocities.org/notepad) | Reused author documentation | Selective pixel/dither treatment alongside personal writing | Earlier research documents the policy; no new visual audit. |
| [Aster's Archive](https://astersarchive.neocities.org/Home) | Reused text-fetched reference | Room/minimap exploration with a sitemap | Earlier evidence only; do not assume image-map implementation. |
| [Cameron's World](https://www.cameronsworld.net/) | Reused and freshly text-fetched | Themed collage regions, small details, surprising links | Creator identifies a GeoCities collage and credits contributors. Assets are not automatically free to reuse. |
| [Webamp](https://webamp.org/) / [Poolsuite](https://poolsuite.net/) | Reused REA studies | Windows, music controls and coherent panel styling | Earlier report retains evidence and explicit audio/mobile limitations. |

**Fast selection:** for a quiet page choose a tile, ASCII title and one pet; for a lab choose a dithered portrait, a reactive ASCII robot and a hidden test bench; for a busy GeoCities room choose illustrated hotspots, stamps and a sound-off-by-default toy. These combinations are proposed design directions, not descriptions of the reference sites.

## E01 — Dithered portraits and project photographs

**Why it belongs:** two- or four-color photos can join a face, hardware and interface into one world. Xiokka and apvl remain the relevant personal-site references; GIMP's [indexed-color documentation](https://docs.gimp.org/2.10/en/gimp-image-convert-indexed.html) confirms palette reduction and dithering options.

**Proposed recipe:** crop an original, downsample deliberately, then quantize against the chosen palette. Compare Floyd–Steinberg (diffuse the quantization error forward) with Bayer (compare brightness with a repeated threshold matrix). Preserve both original and processed assets. Export a few actual candidate PNGs; noisy dithering is not inherently a smaller download.

Use ordinary `<img>` markup with useful alt text. Scale pixel art at deliberate sizes with [pixelated rendering](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/image-rendering); that property alone does not dither. A real screenshot of wiring or text should have an undithered detail link. **Difficulty:** small. **Dependency:** offline editor only; no database or runtime loop. **Fallback:** the image itself. Touch/keyboard require no special interaction. Test narrow screens and zoom rather than shrinking the entire page.

## E02 — A portrait that resolves under the pointer

**Why it belongs:** a visitor can “tune in” a transmitted image. This is a proposed combination of the prior apvl direction and normal canvas image processing, not an observed feature of that site.

**Proposed recipe:** precompute the original and dithered versions at equal dimensions; composite the dithered image, then reveal the original inside a soft circle centered on local pointer coordinates. For a truly live dither, sample pixels once per source change using [getImageData](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/getImageData), transform luminance and apply a fixed ordered threshold pattern. Do not read and quantize a full-resolution portrait on every pointer event.

Keep source pixels separate from rendered pixels. State is just pointer position, reveal radius and enabled flag; update at most once per animation frame. **Difficulty:** medium. **Rendering:** one canvas plus a semantic image/description fallback. **Input:** tap toggles a complete before/after state; a labeled button does the same for keyboard users. **Motion/performance:** reduced motion uses that static toggle; pause when hidden. Same-origin/permitted cross-origin image loading matters because canvas readback can be restricted.

## E03 — A living ASCII nameplate or signal field

**Why it belongs:** lettering becomes the artwork, with a terminal/BBS connection. Use [TAAG](https://patorjk.com/software/taag/) for a still title, or [ASCII Play](https://play.ertdfgcvb.xyz/) for the moving-grid idea.

**Documented foundation:** the [ASCII Play manual](https://play.ertdfgcvb.xyz/abc.html) describes a cell function, timing, cursor data, character aspect correction, and text versus canvas rendering. It also warns that repeated inline style changes increase DOM work.

**Proposed recipe:** for each cell `(x,y)`, evaluate a field such as a wave plus a decaying radial pointer disturbance. Normalize and clamp the value, then index a density ramp from sparse to solid. Assemble one newline-separated string and replace one `pre.textContent`; do not create one DOM node per monochrome character. Correct distances for cell width/height so circles stay round.

**Difficulty:** medium. **State:** grid size, elapsed time, local pointer and pause flag. **Input:** arrows can move a virtual disturbance; tap drops a ripple. **Fallback:** frozen ASCII plus a normal heading. Hide decorative frames from assistive technology, not the page title. Start with a modest grid, avoid high-frequency flashing and offer pause.

## E04 — An ASCII robot, cube or spinning gear

**Why it belongs:** one object can express engineering interests. The [donut author's explanation](https://www.a1k0n.net/2011/07/20/donut-math.html) supplies a genuine technical reference: projected surface points, reciprocal-depth buffering and illumination-to-character mapping, rather than a mysterious CSS trick.

**Proposed recipe:** sample an original model's points/normals, rotate around two axes, translate in front of the camera, project `x'=f*x/z`, `y'=f*y/z`, and retain the nearest sample in each character cell. Map the normal/light dot product to a clamped character index. Reset depth and character buffers each frame. For an outlined cube, rasterized line segments are simpler than filled surfaces.

**Difficulty:** medium for a cube; larger for a model/robot. **Rendering:** monochrome `pre` at low resolution; canvas if colored cells become numerous. **Input:** pointer position changes angles, arrow buttons do the same, tap changes expression. **Lifecycle:** time-based rotation with capped elapsed time after tab restore; no “degrees per frame” dependence. **Fallback/reduced motion:** a still angle plus explicit rotate controls. Do not require dragging to reach projects.

## E05 — A cat or robot that follows visitors

**Why it belongs:** a small recurring character feels inhabited. [Ari's site](https://adryd.com/) links its [oneko implementation](https://github.com/adryd325/oneko.js). REA captured a 32×32 `#oneko`, aria-hidden state, and cat script/sprite resources. The live DOM used absolute positioning; the repository's current code uses fixed positioning, so they are not assumed identical builds.

**Documented mechanism:** [oneko source](https://github.com/adryd325/oneko.js/blob/main/oneko.js) has direction/idle sprite sets and a frame loop paced at roughly 100 ms, with an early reduced-motion check.

**Proposed adaptation:** replace the cat with original robot art in the same sprite-grid arrangement. Keep position, target, direction, state and state-age. If target distance exceeds a dead zone, move toward it; otherwise enter idle/sleep states. Choose two walking frames by elapsed time. **Difficulty:** small using a reviewed existing script, medium for original art/state behavior. **Fallback/input:** a stationary mascot with an optional “wake” button on coarse pointers or reduced motion. Set decoration `pointer-events:none`; avoid covering controls. Position persistence is optional, local only and tolerant of unavailable/malformed storage.

## E06 — An adoptable pet in a little habitat

**Why it belongs:** a visitor can care for a tiny creature in a bounded panel instead of having it chase the pointer. [GifyPet](https://gify.pet/) documents pet/map choices and iframe embedding.

**REA observed:** clicking Refresh on its builder changed the preview's pet background to `pet/pets/cactus.gif`. This proves client preview update, not feeding persistence, server storage or performance. No creation/submission button was used.

**Proposed recipe:** a fixed-aspect habitat with background image, sprite, mood label and Feed/Play buttons. Keep numeric hunger/mood and last-update timestamp; derive elapsed-time changes only when reopening rather than running an endless background timer. Decide explicitly whether the pet belongs to this browser or is shared by all visitors. A shared pet needs a server rule and database; localStorage does not create shared state.

**Difficulty:** small for embedding; medium for a local pet; larger for shared persistence. **Input:** ordinary buttons work by pointer, touch and keyboard. **Fallback:** mascot image and status text. **Motion:** a still pose when reduced motion is set. Third-party iframes introduce service availability and data-flow dependencies; give the frame a title and keep navigation outside it.

## E07 — Fairy dust, snow or pixel sparks

**Why it belongs:** this is a direct old-homepage flourish. [Tholman's demo](https://tholman.com/cursor-effects/) is a good bounded specimen wall, not a reason to run thirteen effects together. REA observed separate canvases under named demo containers.

**Documented mechanism:** its [fairy-dust source](https://raw.githubusercontent.com/tholman/cursor-effects/master/src/fairyDustCursor.js) renders cached glyph images as particles with position, velocity and lifespan, and listens to reduced-motion changes.

**Proposed recipe:** emit only after pointer travel exceeds a spacing threshold; store a bounded particle pool; advance with elapsed time, add a small gravity term and fade/shrink toward expiration. One transparent canvas with `pointer-events:none` is enough. A tiny robot can emit sparks only when tapped rather than constantly.

**Difficulty:** small using a reviewed library. **Touch:** allow a single tap burst; do not intercept scrolling for decoration. **Keyboard:** optional Spark button, never a replacement for native focus. **Fallback:** no dust. **Lifecycle:** remove listeners and canvas on teardown. The fetched upstream source's destroy function registers a resize listener instead of removing it; review/fix that integration detail rather than assuming the exposed destroy API proves cleanup.

## E08 — Ghost cursors, elastic trails and a cursor clock

**Why it belongs:** an arrow echo or orbiting time display reads as a specific early-web memory. [Tholman's documented collection](https://github.com/tholman/cursor-effects) supplies these variants; its [trailing source](https://raw.githubusercontent.com/tholman/cursor-effects/master/src/trailingCursor.js) uses a canvas and a chain of positions.

**Proposed recipe:** keep a short fixed array of trail points. The leader targets the pointer; each follower approaches the preceding point. For frame-independent damping, use `a=1-exp(-k*dt)` and `p += (target-p)*a`. The rendered echoes should trail the real system pointer, never replace its affordance. A clock version draws glyphs around a circle; update the time text once per second and animate only location.

**Difficulty:** small/medium. **Input/fallback:** pointer-only ornament that disappears on touch, reduced motion or a “quiet page” preference. Keep the ordinary visible clock text if the time is content. **Performance:** ten modest sprites are a starting design budget, not a benchmark. Cancel when hidden/unmounted; confirm no stale listener after route changes. Prefer a section-scoped effect over a huge page overlay.

## E09 — Starfields, falling snow and old demo plasma

**Why it belongs:** cosmic backgrounds and low-resolution procedural demos suit a transmission-room page. [ASCII Play's catalog](https://play.ertdfgcvb.xyz/) lists plasma and flame studies; [Cameron's World](https://www.cameronsworld.net/) is a collage reference for themed regions, not evidence of any one starfield algorithm.

**Proposed recipe:** first consider a static seamless star tile. For movement, use a single low-resolution canvas with a fixed array of stars containing normalized position, depth and speed. Advance depth with time; project around a center; respawn only behind the near plane. A plasma alternative combines a few sine fields and indexes a small palette.

**Difficulty:** small for still tile; medium for motion. **Input:** optional arrow/tap “warp” button changes speed briefly, with a static equivalent for reduced motion. **Fallback:** tile or solid color. **Performance:** cap particle count and effective pixel density; stop when the page is hidden. Leave text on opaque panels and never place constantly bright stars through body copy. Avoid flashes and full-page shaking. These are proposed algorithms, not reverse-engineered descriptions of the reference sites.

## E10 — Tiled wallpapers, image borders and graphic dividers

**Why it belongs:** material and ornament can supply personality even with JavaScript disabled. [TextureTown](https://textures.neocities.org/) provides texture categories; [A.N. Lucas's lounge](https://anlucas.neocities.org/) is another browsing destination.

**Proposed recipe:** choose one small original or properly licensed seamless tile. Use CSS [background-repeat](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/background-repeat) at a deliberate native/integer size; check all four edges for seams. Give each reading panel an opaque surface. For a frame, prepare a nine-slice border image: four corners remain fixed, edges repeat or stretch and the center remains content. [border-image](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/border-image) supports this and should have a normal border fallback.

**Difficulty:** small. **State/input/database:** none. **Fallback:** background color and ordinary border. Decorative dividers should have empty alt text; meaningful labels remain HTML. Use multiple textures only for different rooms or page families. Animated GIF backgrounds need a still/quiet choice; inspect actual asset dimensions, bytes and reuse permission instead of hotlinking a gallery indiscriminately.

## E11 — CRT glass and terminal phosphor

**Why it belongs:** a small diagnostics window can feel like equipment. This is a proposed treatment, not a claim that Web 1.0 pages were universally CRT simulations.

**Proposed recipe:** use a restrained repeating gradient overlay for scanlines, a mild vignette and a small text shadow for phosphor glow. Scope the overlay to an artwork/window, set it to ignore pointer events and keep it out of accessibility content. Amber, green and monochrome are separate skins; more blur does not equal better authenticity. CSS [filter](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/filter) supplies effects, but does not provide a complete CRT simulation.

**Difficulty:** small for CSS; large for a curved screen shader. **Input:** a labeled “CRT glass” checkbox or quiet-mode preference. **Fallback:** sharp normal text. **Motion:** no simulated flicker by default; never make visitors endure flashing to read. **Performance:** avoid full-viewport animated filters; composite a static overlay. Check contrast and 200% zoom with effects on and off. Fonts, body line-height and controls must remain readable; use scanlines on the art if body text loses clarity.

## E12 — A room, workbench or image-map homepage

**Why it belongs:** a site becomes a place. Reuse [Aster's room/minimap reference](https://astersarchive.neocities.org/Home) and Cameron's themed exploration without assuming their exact implementation.

**Proposed recipe:** draw one scene with clear objects: notebook → notes, robot → projects, radio → music, door → friends. Store hotspots as normalized rectangles plus URL/label. Use actual positioned anchors over a responsive image, or an SVG with a viewBox and meaningful links. Native [image-map areas](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/area) are possible, but pixel coordinates must track image scaling and every destination needs useful alt text.

**Difficulty:** medium, mainly illustration and responsive hit regions. **Input:** visible labels on focus and tap; sufficiently large targets; ordinary link list below for keyboard/touch/readers. **State:** at most selected/hotspot state; no database. **Fallback:** the same link list and image alt description. **Motion:** optional small object animation, still under reduced motion. Test that no hotspot drifts when the container changes; never put the only project link behind a puzzle.

## E13 — Desktop windows that open, move and close

**Why it belongs:** notes, projects and music can feel like tools on a personal machine. Earlier Webamp/Poolsuite evidence remains relevant. [98.css](https://jdan.github.io/98.css/) is explicitly styling only, not a JavaScript window manager.

**Proposed recipe:** start with semantic panels in document flow. If movement earns its cost, keep window state `{open,x,y,z}`; pointer-down on the title bar records offset and takes [pointer capture](https://developer.mozilla.org/en-US/docs/Web/API/Element/setPointerCapture), pointer-move updates clamped coordinates, and pointer-up/cancel releases drag state. Bring a window forward on interaction. Preserve a reachable title bar after resize.

**Difficulty:** medium/large for robust dragging/focus, small for static window styling. **Input:** real Close/Minimize buttons, visible keyboard focus and a reset-layout button; allow opening without double-click. On narrow screens use normal stacked panels. Nonmodal panels are not automatically modal dialogs. **Fallback/reduced motion:** normal panels with instant state changes. Persist layout only if necessary; validate restored coordinates against current viewport. Teardown listeners on route changes. A web-OS can become a project itself; choose only the interactions your content needs.

## E14 — Skin switching and a “quiet page” control

**Why it belongs:** old desktop themes, seasonal layouts and personal skins make repeat visits interesting.

**Proposed recipe:** keep one small allowlisted skin identifier and apply CSS variables for ink, paper, accent, border image, tile and optional art palette. Use [CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties); avoid duplicating page markup for every skin. Keep motion and audio preferences separate from color theme so selecting “forest” does not unexpectedly enable sound.

**Difficulty:** small for two palettes, medium if assets/layout vary. **State:** current skin, motion preference, sound preference; persistence is local browser preference, never a global database requirement. **Input:** labeled select or buttons with a current selection state; keyboard and touch work naturally. **Fallback:** default stylesheet with readable system fonts. Storage reads/writes should tolerate failure and reject unknown theme names. **Motion/performance:** switch immediately when reduced motion is set; load alternate heavy artwork only when selected. The design-language chapter covers broader reference sites; this recipe specifies the mechanism rather than choosing your eventual skin.

## E15 — Secret doors, discovery stamps and small puzzles

**Why it belongs:** early personal sites reward wandering. [Nicky Case's door toy](https://ncase.me/door/) is a verified standalone destination; earlier Cameron/Aster references demonstrate exploration. Those are inspiration, not evidence of a stamp-system backend.

**Proposed recipe:** make a few optional hidden routes, each with a clue and a clear way home. A stamp collection is a local set of known IDs; discovering a page adds its ID and updates a small “2/5 found” shelf. An accessible hint list prevents hover-only clues. Use a sequence buffer for a keyboard egg if desired, but ignore typing in editable fields and keep a pointer/touch alternative.

**Difficulty:** small for routes/stamps; medium for puzzles. **Data:** static discovery content, localStorage only for per-browser progress; clearly label it “this browser.” A public global unlock number needs a server and is covered separately. **Fallback:** all pages remain ordinary URLs. Do not put private information on an “unlisted” route and treat it as secret. **Motion:** reward with a static badge when reduced motion is set; no surprise sound or navigation takeover.

## E16 — A tiny sandbox, cellular automaton or repair game

**Why it belongs:** unfinished experiments can be interesting portfolio content. [ASCII Play's catalog](https://play.ertdfgcvb.xyz/) explicitly includes sand, Game of Life and pathfinder examples.

**Proposed recipe:** a 64×40 grid can become a robot test chamber. In falling sand, scan bottom-up and move a grain downward or diagonally into an empty cell; alternate lateral order to reduce visible bias. For Life, count the eight neighbors from an old buffer and write the next generation into a separate buffer; do not mutate in-place. These are original reconstruction outlines, not source audits of those particular demos.

**Difficulty:** medium. **Rendering:** low-resolution canvas or monochrome text grid. **State:** two buffers, tick accumulator, tool and paused flag. **Input:** tap/click to seed, Step/Pause/Clear buttons, optional keyboard cursor. **Fallback:** a saved frame and explanation of the rule. **Performance:** fixed update ticks and a bounded grid, pause when hidden; avoid unconstrained particles. **Reduced motion:** start paused and permit single stepping. Explain the connection to a project so the toy is also a conversation starter.

## E17 — Sound buttons, a listening booth and a boot chirp

**Why it belongs:** small deliberate sounds give objects physicality; music can be a separate destination. Use the earlier [Webamp study](../reports/Web%20playground%20design%20research.md) for actual Winamp behavior; a soundboard does not need the full player.

**Proposed recipe:** a few real buttons trigger original or permitted short samples. One AudioContext, created/resumed on user action, can play decoded reusable buffers through a gain node; a few ordinary audio elements may be simpler for a tiny set. [Web Audio best practices](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices) explains user activation and usable controls.

**Difficulty:** small/medium. **State:** enabled, volume, loading/error and current source(s). Limit overlap or stop an old sound before a new one. **Input:** click/tap/keyboard activate the same labeled button; use text feedback as well. **Fallback:** textual object response if audio is blocked or broken. **Lifecycle:** stop/disconnect sources and suspend work when appropriate. No ambient autoplay, hidden audio consent or surprise boot sound. Reduced motion does not mean muted audio, so give independent controls. Verify music/sample rights; browser audibility was not tested here.

## E18 — Boot screens, command prompts and scheduled oddities

**Why it belongs:** a page can greet visitors with personality. [Melonking's fetched closed sign](https://melonking.net/) suggests time-based fiction; ASCII tooling suggests a terminal surface. The response said Monday despite this research date being Sunday locally, so do not infer server correctness or a visitor-local clock.

**Proposed recipe:** show an optional, skippable sequence of short lines (“robot awake,” “notes mounted”) while real links are already present. Keep a typed-command interface as an alternative entrance, not the only navigation: `help`, `projects`, `notes`, `radio`, and one egg. Use an allowlisted command table; never evaluate entered JavaScript or interpolate it as HTML. Show an ordinary unknown-command message. Output through text nodes.

**Difficulty:** small/medium. **State:** transcript, current command, boot seen and optional theme; no backend. **Input:** labeled text form, Enter submits, explicit command buttons on touch. Avoid hijacking browser shortcuts. **Fallback:** normal navigation; no simulated loading delay imposed on every visit. **Reduced motion:** reveal all lines immediately. If opening hours become a joke, always offer an accessible “enter anyway” link and state the chosen timezone.

## Shared implementation rules

The recipes are deliberately not runnable site code. At implementation time, every moving toy needs one narrow behavior check: coordinates stay within bounds, a Life step uses the old generation, a keyboard action matches the button, a stored setting survives malformed data, or drag cancellation leaves the window usable. Test the behavior that could break; a screenshot alone does not prove it.

Use [requestAnimationFrame timestamps](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame) for time-based updates and cancel the loop during teardown. [Visibility changes](https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event) offer a point to pause decorative work. Respect [reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) both initially and when the preference changes. Avoid continuous screen-reader announcements from animation; keep essential text outside decorative grids.

Keep pointer coordinates in one space: subtract the element's bounding rectangle for local canvas coordinates, then account for backing-store scale. For dragging, [Pointer Events](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events) provide a common mouse/pen/touch model, but touch scrolling still needs deliberate handling. Only the actual drag handle should suppress a conflicting gesture.

These are proposed engineering practices, not measured guarantees for the reference sites. No package versions, frame-rate claims, phone layouts or assistive-technology behavior were certified.

## REA receipts and precise limits

| Study | Evidence | Established |
|---|---|---|
| adryd | `ev_5cc34780d0fda31bbf18d21fafb417a1c25e450ec0a221d9840ee14a0f3656fe` | Cat DOM decoration and successful sprite/script responses. |
| Cursor effects | `ev_f4bbc081f027493a7f497089ec96c141bce68b64d2f4397090f648499e3b1ea2` | Named effect containers, separate canvases and script resources. |
| GifyPet initial | `ev_809d290621c5f814bcd7ded1e8c8cf0453ee0748eedaaf4808274c265f8a1882` | Builder controls, embeds and preview markup. |
| GifyPet Refresh click | `ev_98b773b58495ebcb1c54df5a0801903d3aa51438df2b16b370ca794953ab3a27` | Declared click completed; DOM hash and preview pet background changed. |

Receipts: [oneko](../research_notes/Personal%20portfolio%20reference%20library/evidence/elements-oneko.json), [cursors](../research_notes/Personal%20portfolio%20reference%20library/evidence/elements-cursors.json), [pet](../research_notes/Personal%20portfolio%20reference%20library/evidence/elements-gifypet.json), [Refresh](../research_notes/Personal%20portfolio%20reference%20library/evidence/elements-gifypet-refresh.json).

All used owned temporary headless Chromium at 1280×900 with service workers blocked; cleanup reported termination of owned processes. Captures are DOM/resource evidence, not recorded videos. Selected extracts are not portable complete REA bundles. No requests were made to submit visitor content, create pets, change accounts or download assets. Reference pages execute their own public scripts as part of normal navigation; no private browser profile was attached.

No site implementation was built. Before reuse, check actual asset licensing, version-specific library behavior and selected effects on mobile, keyboard, reduced motion and slow devices.
