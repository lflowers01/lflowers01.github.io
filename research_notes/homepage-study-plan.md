# Homepage study — design decision before implementation

2026-10-19. A separate `/home-study.html`, reviewed before any replacement of `/`.

## What needs improvement

The current homepage has good individual objects but reads as a procession of demonstrations. The full-height name/torus, separate portrait, wide photo row, large section headings, cutting mat and desk all ask for their own stage. Personal information arrives slowly. The desk is now an excellent central interaction, so adding a second toy or simulated desktop shell would dilute it.

## Chosen direction

A personal engineering workbench: readable professional introduction, current work in the margin, actual project documentation on a cutting mat, photographs tucked beside the biography, and the existing music/drawing desk as the main place to linger. Deliberate whitespace remains. The design should make the existing objects feel collected by one person rather than stacked by a template.

Tokens: OLED `#000000`, graphite `#11160f`, sage `#b7c6a3`, warm white `#edece4`, paper `#f7edba`, copper `#b08e70`. Preserve the existing forest alternatives. Departure Mono for modest headings, technical labels and artwork; Arial for the large name; Verdana for reading. No new font dependency.

Desktop composition:

```
flower                      section links       theme
name / discipline                    interactive ASCII
short statement                      interactive ASCII
professional links / ring            interactive ASCII
current work                         interactive ASCII

about        prose                       three photo prints
             portrait / about link       spatial arrangement

             Projects                    selected screenshot
cut mat      report title + summary       selected screenshot
             second report               selected screenshot
             archive link

desk         title / notes link           drawing controls
             iPod                 pinned note
             ASCII waveform / drawing / sand / Life

             compact contact footer / hidden WALL-E
```

## Research translated into choices

- **Alicia:** shared alignment, small headings, restrained reading type, project previews. Adapt hover previews into a fixed preview area on the mat so images do not chase the cursor or obscure text.
- **Neustadt/Cyber Vanguard/dbmaindex:** keep a legible technical index and direct links; decoration is optional to understanding content.
- **Kasad/neels.page and the project-dossier recipe:** show purpose, real status and access to the full report. No invented projects or metrics.
- **Charlie/Grace:** atmosphere should belong to the whole composition. Keep the existing OLED/forest switch and unified renderer rather than introducing another skin.
- **Anish/ASCII Play and the simulation recipes:** one bounded environment is enough. Preserve the desk’s real interaction and existing hero, rather than adding a pet, game, starfield and boot screen.
- **Scrapbook/zine and repository history:** keep tangible photographs, the flower and music as personal evidence. Photos sit beside the about text rather than demanding another long section.
- **Community/content library:** expose genuine current activity without pretending to have a live status feed; keep ring controls prominent, published notes honest, and the high-school archive off the homepage.

## Critique before building

Rejected: copying Alicia’s smoke shader, adding a fake terminal/status dashboard, adding stickers without a personal reason, and making every section another card. Those would decorate the same layout without improving it. The more specific choice is the shared project-preview area on a real cutting-mat surface and one integrated desk. The page is still Lucas’s site, with a tighter composition and earlier context for a hiring/research visitor.

## Scope and verification

New template, scoped stylesheet and a small project-preview controller; reuse the real builder/content and shared interactive components. A noindex comparison link leads back to the current homepage. Separate storage keys for desk, notes, drawings and photo arrangement; theme remains shared. Do not overwrite current content or make this the domain homepage. Verify 360/390/768/1440px, both themes, keyboard previews, photo dialog, desk interaction, reduced motion, no overflow, and unchanged current homepage output.

## Review revision

The owner preferred the photos beside About but wanted the full-size portrait back. The follow-up removes the current-activity block and scroll cue, labels the mat simply “Projects,” and restores a 260px desktop / 210px phone portrait. The desk is shorter, with a closer default arrangement, keeping blank space for drawing rather than adding unrelated objects. Footer height accommodates the complete hidden WALL-E, still revealed only inside the mouse circle. The 88×31 badge now embeds lettering rendered in the actual Departure Mono pixel font. A later request restores a perspective 3D flip: each face turns only to the edge before the readable face swaps, avoiding a persistent reversed face or dependence on backface compositing. Reduced motion still swaps immediately. The production counter was separately authorized and connected to free durable Redis; this does not promote the experimental homepage.

The next requested experiment adds four original inner/outer 3D forms. A center click changes the form through a finite fixed-grid scramble; refresh randomizes the starting form. Outer clicks retain the water ripple and dragging retains separate inner/outer rotation. The transition cannot be restarted by rapid clicks, does not scramble the text/navigation, and resolves immediately if reduced motion is enabled. The existing canvas projection, lighting buffer and hover lens are reused; no 3D library or external artwork is added.
