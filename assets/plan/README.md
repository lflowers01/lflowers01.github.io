# Build plan visual assets

Departure Mono 1.500 by Helena Zhang, bundled to render the font samples in `build.html` and the local interaction study in `design-demo.html`.

- [Official project](https://github.com/rektdeckard/departure-mono)
- Pinned upstream commit: `75152a3f1e6dacdd248a6c397c97dbf27e33eea0`
- [Font source](https://raw.githubusercontent.com/rektdeckard/departure-mono/75152a3f1e6dacdd248a6c397c97dbf27e33eea0/public/assets/DepartureMono-1.500.woff2)
- License: SIL Open Font License; original text in `DepartureMono-LICENSE.txt`.
- Font SHA-256: `5b4fed1daa90708aa9c6ee1190abca9dc22164a1c1def0020386e46b61038cfb`

Arial is the smooth hero display face; Verdana is requested for reading text, with Tahoma and Arial fallbacks. System fonts are not redistributed.

## Portrait reference

`portrait-original.png` is an unmodified copy of `main:headshot.png` at commit `8b8de307a3bc8cf8e89e295f1edb59fd88a0a762`, used only as an existing-image reference in the plan. Final photo selection remains open. Record and line-art studies are original inline SVG in `build.html`.

## Interactive study

`demo.css`, `demo-art.js`, `demo.js`, and `demo-photo.js` support `design-demo.html`. The spinning torus can be rotated in 3D by dragging, or with arrow keys. Its center stays fixed. The inner torus follows the drag directly; the outer ring counter-rotates more slowly and receives 18% of horizontal and 15% of vertical drag. Automatic rotation pauses during the drag and resumes from the chosen orientation. ASCII is the resting material; the pointer lens reveals X dithering. Ripples alter cell values without moving the glyph lattice. The faint background breathes across both the demo and report template. The navigation shares the hero canvas and grid; its brighter pointer response fades gradually into that shared field, with no blank divider.

The portrait's dither/reveal is generated at runtime from the unmodified source above; no edited raster asset is stored. Revealed color is sampled to 130×150 and enlarged without smoothing, retaining a fine 2px texture. Click reveal takes 1100ms; leaving waits 1200ms before a 1200ms return to dithering. A second click while revealed leaves it alone; clicking during hide reverses from the current state. Touch gets a timed return; keyboard focus keeps the image revealed until focus leaves. Requested click effects remain visibly animated with reduced motion; continuous effects use a slower cadence.

The board uses the localStorage key `lf.plan.notes.v1` for demo notes and their positions. Reset board restores the three sample notes. Palette and effect choices last only for the current page session. Nothing is published or synchronized to a backend. A maximum of 12 notes and bounded text/coordinates keep local saved state small.

The Purdue Hackers source study is documented in [the research note](../../research_notes/purdue-hackers-interaction-study.md). No reference-site code or media is included in the demo.

## Original flower

`flower-original.png` is an unmodified copy of `main:favicon.png` at `8b8de307a3bc8cf8e89e295f1edb59fd88a0a762` (37×47 px; SHA-256 `5f10c63ca8a7facd752e64b8a7c12beb248a63e1882c64e14bc916d7ebcb4d43`). It is the favicon and main icon for the new direction.

`flower-grow.gif` is a one-shot growth animation made from that icon's own pixels. The stem grows up from the bottom, leaves extend, then the bloom opens. Growth frames use 40ms rather than 60ms (1.5× faster); GIF timing is quantized to 10ms. It has no loop extension, and its final frame matches the original. Hover or keyboard focus starts a fresh playback through a new Blob URL, so an already-decoded cached GIF cannot stay on its final frame. Leaving lets growth finish before restoring the still and revoking the URL. Rebuild with `python assets/plan/make-flower-gif.py` (Pillow); no runtime image dependency is needed.

## Content references

The footer WALL-E is manually transcribed from the image supplied by the user during the sixth review. White characters render inside the footer canvas only within the 105px pointer circle, with a soft edge; the rest stays hidden. Keyboard focus supplies a bounded discovery circle. The preformatted source is hidden from rendering and accessibility; the canvas has a discovery label. No separate visual layer or yellow styling is used.

`Resume.pdf` is an unmodified copy of `main:public/Resume.pdf` at `8b8de307a3bc8cf8e89e295f1edb59fd88a0a762`. LinkedIn, GitHub, and the email address are copied from that commit's `index.html`. The résumé is historical existing content, not a newly verified résumé. `project-template.html` is a report layout example, not a claim that a project exists.

## Regression check

With the local preview running and Python Playwright available, run `python tests/preview_interactions.py`. An optional base URL can be supplied. The check covers actual click feedback, grid alignment and ripple propagation, navigation fade, stable heading hover, progressive pixelated portrait reveal/hide, and responsive layout.
