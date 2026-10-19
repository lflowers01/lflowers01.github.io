# Build plan visual assets

Departure Mono 1.500 by Helena Zhang, bundled to render the font samples in `build.html` and the local interaction study in `design-demo.html`.

- [Official project](https://github.com/rektdeckard/departure-mono)
- Pinned upstream commit: `75152a3f1e6dacdd248a6c397c97dbf27e33eea0`
- [Font source](https://raw.githubusercontent.com/rektdeckard/departure-mono/75152a3f1e6dacdd248a6c397c97dbf27e33eea0/public/assets/DepartureMono-1.500.woff2)
- License: SIL Open Font License; original text in `DepartureMono-LICENSE.txt`.
- Font SHA-256: `5b4fed1daa90708aa9c6ee1190abca9dc22164a1c1def0020386e46b61038cfb`

Verdana is requested as a system font with Tahoma and Arial fallbacks; it is not redistributed.

## Portrait reference

`portrait-original.png` is an unmodified copy of `main:headshot.png` at commit `8b8de307a3bc8cf8e89e295f1edb59fd88a0a762`, used only as an existing-image reference in the plan. Final photo selection remains open. Record and line-art studies are original inline SVG in `build.html`.

## Interactive study

`demo.css` and `demo.js` support `design-demo.html`. The orbital field, ordered-pixel and ASCII rendering, drawings, and small graphics are original code-native studies. The portrait's dither/reveal is generated at runtime from the unmodified source above; no edited raster asset is stored.

The board uses the localStorage key `lf.plan.notes.v1` for demo notes and their positions. Reset board restores the three sample notes. Palette and effect choices last only for the current page session. Nothing is published or synchronized to a backend. A maximum of 12 notes and bounded text/coordinates keep local saved state small.

The Purdue Hackers source study is documented in [the research note](../../research_notes/purdue-hackers-interaction-study.md). No reference-site code or media is included in the demo.

## Original flower

`flower-original.png` is an unmodified copy of `main:favicon.png` at `8b8de307a3bc8cf8e89e295f1edb59fd88a0a762` (37×47 px; SHA-256 `5f10c63ca8a7facd752e64b8a7c12beb248a63e1882c64e14bc916d7ebcb4d43`). It is the favicon and main icon for the new direction.

`flower-grow.gif` is a one-shot growth animation made from that icon's own pixels. The stem grows up from the bottom, leaves extend, then the bloom opens. It has no loop extension, and its final frame matches the original. Hover or keyboard focus starts a fresh playback; leaving restores the still icon. Reduced motion uses the still. Rebuild with `python assets/plan/make-flower-gif.py` (Pillow); no runtime image dependency is needed.
