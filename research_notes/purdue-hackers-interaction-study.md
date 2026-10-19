# Purdue Hackers interaction study

Inspected October 18, 2026, for the fifth personal-site design-plan draft. Reference: <https://www.purduehackers.com/>. The implementation proposed in `design-demo.html` is original; no reference-site images, branding, shaders, or libraries were copied into it.

## Questions and findings

| Question | Evidence and conclusion | Adaptation |
| --- | --- | --- |
| What is the drawable grid? | Runtime screenshot shows a grid, moving cellular patterns, and a lower dither band. Delivered `GliderShader` source implements WebGL2 Game of Life, pending mouse-drawn cells committed after 300 ms of idle time, 10 px cells and 100 ms simulation steps. The REA scenario clicked the hero; a sustained drag was not tested. | A pointer drawing field in the hero; the review demo uses temporary strokes instead of Life. |
| How does the band work? | Source generates a recursive 16×16 ordered threshold matrix, combines it with a shaped vertical density ramp, and stores the band separately from simulated cells. Additional energy data clears and restores cells around impacts. | A single brightness field rendered as ordered pixels or ASCII density. Pointer proximity reveals the glyph renderer; click waves alter the same field. |
| What happens behind the header? | Captured DOM includes a Three.js canvas. Delivered configuration uses small diamond pixels, translucent noise and edge fades, with ripples disabled. Another module changes header contrast based on the collage’s location. | A light CSS stipple edge behind ordinary navigation; prototype header is not sticky. |
| What happens in the footer? | REA clicked the footer canvas and captured screenshots immediately and after 300 ms. Delivered source identifies Bayer-thresholded noise, click-ring uniforms, square pixels, and a background photograph. Screenshots show changing patterns; they do not isolate animation from the single click without the supporting source. | A quieter original procedural field under real links, using the same visual material as the hero. |
| What small details are relevant? | Source contains a short-lived pixel cursor trail enabled for desktop without reduced motion; varied scroll offsets for collage pieces; changing footer words; and a link revealed by nearby pointer position or keyboard focus. These specific small interactions were source-inspected, not all runtime-tested. | Local portrait reveal, click responses, an 88×31 stamp, brief text decoding, and a small hidden sketch. Keep selected effects local and readable. |

## REA receipts

- Initial runtime capture: `ev_2aaf57c38550c4f5ebd5d1a4c4c888d9d74185d7cdfe08fd15af3882fbd5f63c`. Chromium 156, 1440×1000, clean temporary profile, reduced-motion preference. Captured DOM, accessibility, screenshot, and page errors after 2 seconds. Captured DOM SHA-256 `95cc671a78b3b797a4cb1736d3932386f4ba347791e3d23e35e7b49a4d26dd4a`; screenshot SHA-256 `e2f249e9838054a7bc6681e5882d9c08b56d8e2c23b4442c98e2ad5ef398a5a8`.
- Controlled click scenario: `ev_4e9b22afc06cbf649720ae93ee3b3de3c2fa1eed8595ed1d67a8dcedb2f56c93`. Same browser dimensions, normal-motion preference. Waited 500 ms, clicked the hero section, waited 300 ms, clicked the footer canvas, waited 300 ms. All declared steps completed. The tool clicked; it did not drag or hover.
- Hero/cursor/header source analysis parent: `ev_77fa4ea80c0350dc57519337fba7e7eabdae9afc6ab2536a10c1e244aaf188f4`; summary view `ev_db78eae129f48b5e424ad78e01eacf56997d8e030eb58de16ada6c8f46491bff`. Four selected delivered modules; other inventoried modules and unresolved imports remain outside that graph’s scope. Static parsing does not prove execution.
- Main/footer bundle analysis parent: `ev_e7bbd0ef5e5a7126afb550efb818ff8a427e3b646f1068a7bd3fa4686df6329d`; summary view `ev_44160e2dd63e66df61542d71929950080794abe8567a3cbbeddbbc0de6158643`. 538,993 bytes; parsed without syntax failures. The semantic graph reached its 20,000-node per-file ceiling. Relevant GLSL and initialization/listener sections were read directly; full-bundle graph coverage is partial.
- Both static captures identify source inventory root SHA-256 `adc5b62df51cdafb4ade2e3744442e4b3d0e0bc1f69c293af3a4e862689c24f4`.

### Delivered module URLs

These were fetched from the page, not guessed repository paths. Names are deployment-specific and can change.

- [GliderShader](https://www.purduehackers.com/_astro/GliderShader.astro_astro_type_script_index_0_lang.Cfq5bzh8.js)
- [Main/footer bundle](https://www.purduehackers.com/_astro/index.astro_astro_type_script_index_0_lang.Dhgp4Pnp.js)
- [Pixel trail](https://www.purduehackers.com/_astro/index.astro_astro_type_script_index_2_lang.B3Arb_Gn.js)
- [Collage parallax](https://www.purduehackers.com/_astro/index.astro_astro_type_script_index_4_lang.D5PwqzIA.js)
- [Header and menu](https://www.purduehackers.com/_astro/BaseLayout.astro_astro_type_script_index_0_lang.DCHBp4MT.js)

## Limits and decisions

This was a focused visual/interaction study, not a full performance, accessibility, mobile, backend or browser-compatibility audit of Purdue Hackers. Raw network bodies and storage were not captured. Earlier attempts with an incomplete scenario action schema failed validation without actions; a separate passive CDP bundle attempt failed because the temporary target had not loaded. The completed scenario and explicit local delivered-source analysis supply the usable evidence above.

The demo is a bounded Canvas 2D implementation with no new runtime dependencies. In the sixth revision the hero rotates while visible at a capped 24fps; other fields render for interaction and resize. The loop stops when the hero is offscreen and effects have settled, pauses when the page is hidden, bounds recent click events and brush marks, and keeps the gyroscope still for reduced motion. This demonstrates the direction without committing to a GPU shader or copying the reference’s Life system.

The bulletin board has owner-authored canonical content and starting positions in the final plan. Visitor rearrangement is local. The prototype’s add-note editor is local-only, and neither a shared database nor public writing is enabled. Stored data is bounded and validated before rendering; note text uses DOM text nodes.

## Prototype verification

Local Chromium checks passed for theme comparison, all three renderers, drawing and clearing, pointer dragging, keyboard movement, reading and closing notes, save/reload, local add/reset, literal rendering of HTML-like note text, invalid-storage fallback, portrait reveal, the three click responses, stamp and sketch details, automatic reduced motion, and an idle animation loop that stops. Layouts were checked at widths 320, 390, 768, 1024, and 1440 px, including the embedded plan; no horizontal document overflow or JavaScript errors were found. Screenshots were visually reviewed.

The owner approved OLED colors and selected the original flower favicon as the main icon during this review. A one-shot GIF grows its stem, leaves and bloom on hover or focus and resets to the original on exit. Its last frame is byte-for-byte equal to the original after RGB decoding. After the owner reported no visible animation, the sixth revision gives each hover a new Blob URL and decoder; screenshots confirmed that the actual early and final frames differ. Explicit hover playback is available even with ambient motion reduced.

Sixth-revision checks passed for continuous visible rotation and reduced-motion stillness; full X dithering at rest and an ASCII pointer lens; header and subtle page-pointer fields; theme-icon transitions; the outward water ripple; inline note reading and editing without dialogs; local persistence and safe text; pixelated portrait reveal and delayed hide; original profile links and the copied résumé; the project-card/report template; white WALL-E text; five viewport widths; and the embedded plan. No page JavaScript errors were observed. This does not constitute testing in Safari, Firefox, or on a physical OLED/touch device.
