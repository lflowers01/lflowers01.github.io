# Web 1.0 visual and interactive elements

## Which verified references expand the earlier collection?

### Takeaway
Keep effects rooted in homepages, pixel toys and retro software. Ten references are new relative to the earlier report; six existing references are deliberately reused in the chapter. The chapter is research and proposed reconstruction guidance, not implemented portfolio code.

### Cited Findings
- [Tholman's cursor demo](https://tholman.com/cursor-effects/) describes a collection of old-school mouse effects; live DOM was also captured. [Project documentation](https://github.com/tholman/cursor-effects) is the integration source.
- [Ari's site](https://adryd.com/) links [oneko](https://github.com/adryd325/oneko.js), shows personal interest links and a friends button wall. Live DOM and cat resources were captured.
- [GifyPet](https://gify.pet/) provides a builder for pet/map/styling choices and advertises iframe embedding. Runtime confirmation is limited to builder markup and a Refresh preview update.
- [TextureTown](https://textures.neocities.org/) has categorized texture links and a [Playroom](https://textures.neocities.org/playroom/). The playroom fetch provided little text; its visual function was not tested.
- [A.N. Lucas's Web Lounge](https://anlucas.neocities.org/) was retrieved as another personal-web destination; no runtime behavior or asset license was audited.
- [Dither Me This](https://doodad.dev/dither-me-this/) returned a reachable page without text. Retain as an explicitly unverified editor lead, not a tested production recommendation.
- [TAAG](https://patorjk.com/software/taag/) was fetched as an ASCII-title tool. No actual font/output was exported or licensed.
- [a1k0n's donut math](https://www.a1k0n.net/2011/07/20/donut-math.html) documents projection/depth/lighting math and its animated demos. An appropriate source for understanding rather than copying an opaque effect.
- [Nicky Case's a(door)able](https://ncase.me/door/) was text-fetched as a small independent toy destination; gameplay was not exercised.
- [Melonking](https://melonking.net/) returned a closure message naming Mondays. The response alone does not establish its timezone or schedule correctness.
- Reused earlier sources: [ASCII Play](https://play.ertdfgcvb.xyz/), [apvl](https://apvl.dev/stuff/personal-portfolio/), [Xiokka](https://xiokka.neocities.org/notepad), [Aster](https://astersarchive.neocities.org/Home), [Cameron's World](https://www.cameronsworld.net/), and [Webamp](https://webamp.org/)/[Poolsuite](https://poolsuite.net/). The last two share one chapter row, producing 16 reference rows and 17 individual primary destinations excluding auxiliary links.

### Inferences
- An original robot pet and diagnostics toy would distinguish Lucas's engineering interests while retaining Web 1.0 vocabulary.
- A static texture/border/ASCII title is a complete useful option; motion need not be everywhere.
- A room with proper link alternatives can connect writing, future projects and music in one navigable fictional place.
- Plain modern DOM/canvas methods are proposed recreations. A reference's visible effect does not prove its internal architecture.

### Gaps
- dokodemo.neocities.org, soulmaze.neocities.org and mf2fm.com were inaccessible through fetch and were omitted from the verified shortlist.
- No visual screenshot review, auditory playback, mobile or assistive-technology test was conducted.
- Doodad is a lead with empty fetched text; the chapter explicitly distinguishes it from a verified editor.
- No artwork or music license automatically follows from a page being public.

## What did REA actually establish?

### Takeaway
Three new targets were observed in four successful captures. One declared user action produced a concrete before/after preview change. These are bounded runtime observations, not static-source inferences masquerading as observed animation.

### Cited Findings
- [adryd](https://adryd.com/) capture Evidence `ev_5cc34780d0fda31bbf18d21fafb417a1c25e450ec0a221d9840ee14a0f3656fe` showed `#oneko`, its 32px DOM box and successful sprite/script responses. Receipt: [elements-oneko.json](evidence/elements-oneko.json).
- [Cursor effects](https://tholman.com/cursor-effects/) capture Evidence `ev_f4bbc081f027493a7f497089ec96c141bce68b64d2f4397090f648499e3b1ea2` showed one canvas per named sample, including pointer-ignoring positioning. Receipt: [elements-cursors.json](evidence/elements-cursors.json).
- [GifyPet](https://gify.pet/) initial capture Evidence `ev_809d290621c5f814bcd7ded1e8c8cf0453ee0748eedaaf4808274c265f8a1882` established form selectors and preview/iframe markup. Receipt: [elements-gifypet.json](evidence/elements-gifypet.json).
- GifyPet action capture Evidence `ev_98b773b58495ebcb1c54df5a0801903d3aa51438df2b16b370ca794953ab3a27` performed CSS-located `input[value='Refresh']` click. Before DOM SHA-256 `d80cff0deb4f50f69eff48e48dd4ecff52e60be8c05c4f4db725d0d6e3d972d4`; after `63c96765ef363b232fb8e1e97a4d34192bf004291deead377eda8e2a9a842ad2`. Preview pet acquired `background-image:url("pet/pets/cactus.gif")`. Receipt: [elements-gifypet-refresh.json](evidence/elements-gifypet-refresh.json).
- Chromium executable reused from the earlier study: `C:/Users/fartpad/AppData/Local/ms-playwright/chromium-1248/chrome-win64/chrome.exe`. All successful studies returned provider-owned process cleanup as terminated. Receipts retain exact URL, action list, scenario SHA-256 and observed DOM hashes.

### Inferences
- The Refresh preview behavior can be recreated as local state → asset selection → DOM style update. The observed update does not require assuming any database.
- Sprite/resource loading plus a DOM element supports the companion architecture, but does not prove a chase occurred in that capture.
- Current repository oneko source and Ari's deployed code are not assumed byte-identical: observed position is absolute, repository source says fixed.
- Tholman source is normal public source evidence, not a REA decompilation claim. Runtime capture proves canvas presence; source explains candidate mechanics.

### Gaps
- First attempted click shape used unsupported selector key and was rejected before execution; corrected locator shape produced the successful capture. No result from that rejected call is treated as browser evidence.
- No screenshots retained, no pointer move trajectory, no frames-per-second measurement, no audio recording, no backend/state persistence audit.
- No pet created or visitor text submitted. Scripts execute during ordinary public page navigation, but no private browser attached.
- Selected JSON receipts are compact extracts rather than complete portable REA bundles.
- A browser response and form label do not verify service uptime, security, cross-browser support or operator policy.

## How can these ideas be recreated responsibly and precisely?

### Takeaway
The finished chapter has 18 reusable recipes (E01–E18), each with purpose, technical mechanism, state/input, rendering choice, difficulty, fallback and motion/performance considerations. It deliberately covers texture, typography, procedural art, pets, interaction, navigation, audio and small games rather than repeating one desktop design.

### Cited Findings
- Dither asset foundation: [GIMP indexed mode](https://docs.gimp.org/2.10/en/gimp-image-convert-indexed.html); [pixelated image rendering](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/image-rendering); [canvas pixel readback](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/getImageData).
- ASCII foundation: [Play manual](https://play.ertdfgcvb.xyz/abc.html) documents cells, timing, cursor, text/canvas choices, aspect metrics and DOM style overhead. Keep its source claims narrow; the chapter's equations and robot design are proposed adaptations.
- Pet foundation: [oneko source](https://github.com/adryd325/oneko.js/blob/main/oneko.js) contains direction/idle sprite sets, an early reduced-motion guard and a paced animation loop.
- Cursor foundation: [fairy dust source](https://raw.githubusercontent.com/tholman/cursor-effects/master/src/fairyDustCursor.js) uses cached glyph images and particles; [trail source](https://raw.githubusercontent.com/tholman/cursor-effects/master/src/trailingCursor.js) uses a position chain. Both expose destroy hooks; the fetched source adds a resize handler inside teardown rather than removing it, so dependency integration requires review.
- Static ornament foundation: [CSS repeating backgrounds](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/background-repeat), [border images](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/border-image), [filters](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/filter).
- Room/window foundation: [image map area](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/area), [98.css](https://jdan.github.io/98.css/), [pointer capture](https://developer.mozilla.org/en-US/docs/Web/API/Element/setPointerCapture), [Pointer Events](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events).
- Skin foundation: [CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties).
- Animation/lifecycle foundation: [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame), [visibilitychange](https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event), [prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion).
- Audio foundation: [Web Audio best practices](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices). Webamp integration is retained in the earlier report rather than reinvented in this chapter.

### Inferences
- Recipe map: E01 offline dithering; E02 pointer reveal; E03 ASCII fields/nameplates; E04 ASCII 3D object; E05 follower sprite; E06 habitat pet; E07 particle dust; E08 cursor chain/clock; E09 starfield/plasma; E10 tiles/borders; E11 CRT; E12 illustrated room; E13 windows; E14 skins; E15 secrets/stamps; E16 sandbox/Life; E17 sounds; E18 boot/terminal/schedule.
- Most need no shared database. Only shared pet/stamp totals need service-side state; preferences and personal discovery progress are per browser.
- Every formula and data structure marked proposed is a plausible reconstruction plan, not observed code. No implementation or tests were generated.
- Start small: ordinary HTML content and links remain usable if the toy, player, canvas or third-party service fails.

### Gaps
- Package version/asset rights and actual chosen devices remain implementation-time verification.
- The goal here is a technical idea library, not a complete build spec for a selected aesthetic.
- No accounts, service configuration, deployment, source-site cloning or dependency installation performed.
