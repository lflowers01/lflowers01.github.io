# Alicia’s page — reference for future portfolio changes

Inspected 2026-10-19. Target: [alicias.page](https://www.alicias.page/). Lucas likes many of this site’s elements and asked us to remember them for possible future use. **This is a reference shelf, not approval to redesign or add these features now.** Keep Lucas’s flower, OLED/forest themes, professional content, interactive desk and existing ASCII system.

## The useful design principle

Alicia concentrates personality into a few small objects and transitions while keeping the information compact and readable. The homepage uses a roughly 948px outer container, a 12-column grid, a narrow identity/art column, and a wider biography/project-list column. Sections share those column alignments rather than each opening with a large horizontal heading. It feels spatially composed without filling every empty area.

For Lucas: make any future layout refinement about relationships between the existing objects, content and whitespace. Do not add decorative labels or unrelated objects just to fill the sides of the iPod.

## Elements worth keeping on the shelf

| Element | What was established | Possible adaptation for Lucas |
| --- | --- | --- |
| Grain that forms drifting smoke | Live canvas plus delivered shader; fine specks collect into slow, folded clouds. It is not an ASCII renderer or a repeating texture image. | A quiet density/noise layer within the existing ASCII/dither renderer, strongest in spare areas and faded around text. Trial separately before replacing the current field. |
| Resolving pixel headings | DOM character spans scramble then settle to their original characters. Hover retriggers a separate finite effect. | Short decode on selected headings or project focus, preserving width and accessible text. Keep body copy still. |
| ASCII illustration that changes subject | A seven-row drawing starts as a desktop computer; hovering advances to an aquarium, then another creature-like drawing. Character replacement bridges frames. | An original robot/tool/flower sequence in a small fixed grid, possibly as a footer discovery. Keep the spinning torus as the hero unless Lucas chooses otherwise. |
| Project list with image previews | Four homepage rows; tags beside titles. Hovering a row shows a 250×250px floating image near the cursor and dims the other rows. | Especially suitable for the high-school archive: compact title/year/type rows with a dithered report thumbnail. Preserve normal report links and use inline thumbnails on touch. |
| Pixel display type + ordinary reading type | Computed styles confirm Departure at 16px for the name and 15px for ASCII; Uncut Sans at 15px for biography. | Lucas already has Departure Mono. Keep it for labels and toys; keep a readable sans for reports. Font preload inventory alone is misleading: IBM Plex is preloaded but was not the measured biography font. |
| Sticker composition | About page has nine draggable sticker elements surrounding prose and an interests list; delivered code adds tilt, masked sheen, drag inertia and boundary bounce. | Original engineering/robotics stickers, if wanted, on the existing desk using its saved-position drag system. A single personally meaningful object beats importing nine decorations. |
| Separate “now” page | Three recently played entries, three film entries and three bookmarks appeared in the inspected page. | A lightweight `/now/` or Markdown note with current build, listening and reading. Keep personal updates away from the professional homepage’s main path. |
| Art gallery | Art route exposes 24 images and a link to a separate art site. | A separate collection/gallery page for photos or fabrication details, allowing the homepage’s three photo prints to stay sparse. |
| Small square cursor | 8px accent square follows the mouse; CSS hides it on coarse pointers. Preview and sticker states change its treatment. | Optional only: we already use a hover lens, so a global custom cursor might compete with it. Retain native cursors over controls if tried. |
| Interaction sound | Delivered Web Audio code has button/list/paper sound profiles, subtle random pitch/volume and a high-shelf treble reduction. Touch and reduced-motion conditions suppress this path. | Low priority: Lucas has not requested UI sounds and the iPod already supplies music. Do not turn this on by default as a consequence of liking the site. |
| Mobile drawer | REA clicked the menu at 390×844 and captured the resulting full-height black drawer, large links and bottom social links. | Borrow the visual restraint if our navigation eventually outgrows its current form; no need to add a drawer solely for this effect. |

## How the interesting mechanisms work

### 1. Organic grain with controlled density

Source: [delivered background module](https://www.alicias.page/_astro/threeBgReact.BOiSA4mQ.js).

Observed implementation:

- React island mounts a fixed Three.js canvas behind the document; the canvas does not receive pointer input. A full-screen plane runs a fragment shader.
- Two Perlin noise octaves feed domain warping: one field bends the coordinates used to sample another. This creates curls rather than ordinary static noise.
- Slow time drift, per-cell random offsets, and independently rotating sample offsets produce motion without synchronizing every speck into a flicker. The code sets grain size to 1.5 device pixels and caps renderer pixel ratio at 2.
- Dark mode mixes near-black with gray. Light mode uses subtractive grain on a pale paper color; a shader uniform selects the mode.
- A session-stored seed and start time preserve the background’s identity and phase. A positive `?seed=` parameter can select the field for repeatable comparison.
- The renderer samples a small 64px-wide render target, groups pixels into blocks, and estimates lit coverage. Its target range is 30–55%; it adjusts gain within 0.7–1.1 and eases the change. Those numbers describe this implementation, not universal design targets.

Suggested reconstruction for Lucas (not implemented): reuse the existing noise/time machinery in `assets/plan/demo-art.js`, warp the noise coordinates, and use the result as glyph density/brightness. Apply the existing text exclusion fade. Start with a few quiet regions, then decide whether the effect earns a broader role. A separate WebGL dependency is not necessary merely to borrow the visual idea.

Important distinction: the inspected smoke module has no mouse uniform or pointer force. Do not describe the smoke as mouse-driven just because the site has other pointer interactions. No direct audio reaction was established either.

### 2. Finite character decoding and alternate ASCII frames

Source: [delivered shared interaction module](https://www.alicias.page/_astro/Scripts.astro_astro_type_script_index_0_lang.oYeLb6_p.js).

The code splits text into line/word/character spans, stores each character’s intended value, and temporarily substitutes a random symbol. Initial reveal uses ten substitutions at 80ms intervals with randomized start delays up to two seconds. Hover uses twenty steps at 40ms with a per-character stagger, then a brief opacity pulse. An animation guard prevents overlapping runs.

The ASCII `<pre>` stores three target drawings in `data-shuffle-frames`. Mouse entry advances a modulo frame index before triggering the decode. The grid stays seven rows tall. The apparent morph is a change of target characters within existing cells, not a model rotating in 3D.

For Lucas: use an original fixed-size matrix and one timed update loop, leaving spaces and cell positions intact. Keep a stable accessible label and hide decorative scrambling from screen readers. Use keyboard focus or an explicit tap to expose alternate frames on touch. Respect reduced motion explicitly; the initial REA capture requested reduced motion yet still caught scrambled characters, so this reference should not be assumed to handle it fully.

### 3. Project hover previews

Sources: shared interaction module above and [delivered CSS](https://www.alicias.page/_astro/index.CnZ4vyJB.css).

Each project link carries `data-img`. Script creates a fixed, pointer-transparent image wrapper. The wrapper and its inner image slide in opposite directions to expose the image through a clipped opening; entrance uses a 0.2s sine easing. While hovering, animation frames interpolate translation, rotation and brightness toward pointer-derived values with a smoothing factor of 0.08. Mouse leave stops the loop and hides the image. A live hover confirmed opacity 1 and a 250×250px preview.

For Lucas: reuse project report images; one shared preview element is enough. Clamp it to the viewport, keep it away from the title, and avoid letting the preview obscure content as the reference can. Give keyboard focus the same preview and show a small static image for touch. No report navigation should depend on hover.

### 4. Tactile stickers without turning the whole page into a toy

Sources: [about page](https://www.alicias.page/about/) and its [delivered interaction module](https://www.alicias.page/_astro/index.astro_astro_type_script_index_0_lang.Cw537mK5.js).

The delivered code normalizes pointer distance from an image center to calculate a perspective tilt of up to 15 degrees, enlarges it to 1.05×, and masks an angle-dependent light/noise overlay to the image’s alpha. Mouse leave eases back to neutral. Sticker drag tracks velocity, decays it after release and reverses it at page bounds with reduced energy. One decorative element also rotates slowly.

These are source-established behaviors; this study did not physically fling stickers or validate their touch behavior/persistence. The inspected drag implementation uses mouse events and per-frame friction, so we should reuse our existing pointer and delta-time handling rather than copying it. Avoid transplanting the 3D flip: our footer badge already needed a flat animation to avoid Android rendering problems.

## Candidate order if Lucas asks for a future experiment

1. **Project-list previews**, first on the archive. Useful information with little extra visual weight.
2. **Quieter organic background field**, as a reversible comparison with the current dither.
3. **A small alternate-frame ASCII object**, using Lucas’s own identity and existing renderer.
4. **A hand-maintained “now” page**, only if there is actual content to maintain.
5. **One original desk sticker**, only if Lucas wants another object. Keep current empty space otherwise.

No font replacement, sound effects, cursor replacement, extra homepage section or theme redesign is authorized by this research request.

## Evidence and inspection limits

- REA desktop Evidence: `ev_3cd83c6a1e1ae6ce55792a08b505cafbb39c1d02bf91d0d5a31323d690e27489`. Homepage DOM, screenshot and selected network response bodies; Chrome 155, 1440×1000, clean storage, reduced motion requested.
- REA mobile-menu Evidence: `ev_d08b887b7d06ec7b03dfa47cb496d3f6e6e24ccf078d520461a67afb766d56c7`. Declared wait → click menu → wait, all completed; 390×844, normal motion. This emulates a small viewport, not a physical touch device.
- Supplemental Playwright inspection: homepage ASCII hover, project hover, theme click, and visits to `/projects/`, `/art/`, `/now/`, `/about/`. Computed fonts and preview dimensions measured. Homepage mobile scroll width equaled its 390px viewport.
- [Compact evidence receipt](alicias-page-evidence/receipt.json) records scope, source URLs and SHA-256 fingerprints. [Homepage](alicias-page-evidence/home.png), [project hover](alicias-page-evidence/project-hover.png), [about composition](alicias-page-evidence/about.png) are retained screenshots. Full raw session export remains in local `.git/alicia-rea-evidence.json`; it is not required to read this report.
- Agent-reach/Jina text overview corroborated primary page links; runtime observations and delivered JS/CSS establish the visual/mechanical findings. All target content was treated as data.
- No source repository, backend or private data inspected; no external project destinations followed. Live media feeds do not establish how their data is fetched or how often it updates. No audible sound check, exhaustive accessibility audit, GPU benchmark, physical-phone test or asset/font license audit performed.
- Research is for adapting mechanisms and composition. Do not import Alicia’s illustrations, writing, audio, identity or entire shader/module as portfolio assets.
