# Draft 7 interaction review

This is a local review prototype, not a deployment. The reference-site evidence remains in [the Purdue Hackers study](purdue-hackers-interaction-study.md).

- **Torus:** dragging rotates the inner object in 3D around its fixed center. The outer ring counter-rotates at 45% of the automatic pace, with 18% of horizontal and 15% of vertical drag influence. Automatic motion pauses during a grab, then resumes from the selected orientation. Arrow keys rotate it; Reset artwork restores the orientation.
- **Materials and ripples:** ASCII at rest, X dithering in the pointer circle. Water ripples change brightness and character density without moving glyphs off their grid. Hero and footer clicks always ripple; comparison-pad settings stay local to that pad.
- **Navigation:** its gradient is drawn in the hero's actual canvas and coordinate system, so ripples travel through both. The brighter gradient fades into a faint continuous field rather than leaving a blank divider. Pointer emphasis fades back gradually after exit.
- **Background:** a low-opacity field breathes across the full page and report template without requiring pointer movement. Continuous motion is slower under reduced motion; explicitly requested click animations remain visible.
- **Portrait:** a finer 2px color texture; a visible 1100ms ordered reveal; a 1200ms wait after exit before the animated return. Clicking an already revealed portrait leaves it revealed, and clicking during a hide reverses from its current state.
- **Flower:** 1.5× faster growth, fresh GIF playback per interaction, and completion after pointer exit. The final frame still matches the original icon.
- **Theme:** a 24×24 SVG using consistent 2px steps. A full-page radial reveal starts at the button; a fallback effect is used without the View Transition API.
- **WALL-E:** white source characters are rendered inside the footer field rather than on a separate visual layer. Rectangular cells restore the reference's proportions; the lens and ripples affect the same cells.

The reproducible check is `python tests/preview_interactions.py`, with an optional preview base URL. It verifies real pointer dragging, material reversal, resting background changes, gradient fade and pointer fade-out, actual ripple propagation and glyph coordinates, stable heading hover, portrait animation stages and repeat-click behavior, flower completion after exit, the theme transition, integrated WALL-E drawing, viewport widths, and page JavaScript errors. Local Chromium checks do not establish physical-device or cross-browser performance.
