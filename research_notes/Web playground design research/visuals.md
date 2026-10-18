# Visual effects and personal web references

Research date: October 18, 2026. Scope: real sites, dithering, interactive ASCII, future projects, quick public notes, Web 1.0 exploration and easter eggs. No website built. Evidence below is fetched public page text and author documentation, not visual screenshots or executed interactions. Proposed implementations are original recommendations, not claims about how another site was built. REA runtime evidence, if obtained by the coordinator, must be cited separately.

## Which real websites offer useful reference points?

### Takeaway
The best references combine a coherent visual rule with something personal to explore. Eight useful sites/directories below cover actual implementations or author-documented approaches; they should be opened by Lucas as a visual shortlist before selecting a style.

### Cited Findings

| Reference | Verified evidence and why it matters | Implementation lesson to consider |
|---|---|---|
| [ASCII Play by ertdfgcvb](https://play.ertdfgcvb.xyz/) | The fetched page lists a wireframe cube, donut, cursor, flame, camera and other ASCII experiments. Its [author manual](https://play.ertdfgcvb.xyz/abc.html) explains text-based, per-cell rendering and pointer input. | A small ASCII robot, orbiting gear or kinematic linkage could be the site's one signature toy. The actual demos still need visual/runtime evaluation. |
| [apvl.dev project write-up](https://apvl.dev/stuff/personal-portfolio/) | The author describes a music-reactive dithered noise background, keyboard music/theme/navigation commands, Markdown/MDX thoughts, and Astro routing that preserves playback. The [source repository](https://github.com/alexapvl/apvl.dev) documents Astro, TypeScript, Three.js and MDX. | Particularly close to Lucas's requested combination. Learn from the integration, without assuming this stack is necessary. |
| [Xiokka's Notepad](https://xiokka.neocities.org/notepad) | The author documents a pixel-icon recipe, dithered complex images and an exception for project screenshots. The page states that essential navigation/content should survive without JavaScript. | A deliberate image policy is stronger than adding a dither filter indiscriminately. A short, informal notepad can itself be useful public content. |
| [Bill Wurtz](https://billwurtz.com/) and [notebook](https://billwurtz.com/notebook.html) | The fetched home page links music, videos, notebook, other categories and an expert mode; a separate notebook page is accessible. | Let the site have personality through labels, small surprises and separate content collections. Its exact visual layout and expert-mode behavior were not inspected. |
| [Sadgrl](https://sadgrl.online/) | The current fetched site has writing, links, guides, resources and an external guestbook. The homepage explicitly discusses returning to evolve the site. | A living personal site can mix making, writing and community rather than functioning only as a résumé. Do not describe Sadgrl's older layouts as its current design. |
| [Aster's Archive: Front Hall](https://astersarchive.neocities.org/Home) | The page explicitly explains room/minimap navigation, offers a plaintext sitemap, and links a library, museum, collection, den, mailroom and tower. Webring navigation is present. | An exploratory setting can remain navigable. A robotics lab with shelves and doors could have a direct list of exactly the same destinations. |
| [Ditherring](https://ditherring.site/) | A live directory of dither-focused sites with linked members and a visible-widget requirement. It includes Aster's Archive and describes its maze concept. | A curated discovery resource beyond generic portfolio galleries. It is a separate ring from Purdue Hackers and does not establish Purdue's rules. |
| [Maggie Appleton's garden](https://maggieappleton.com/garden) and [garden essay](https://maggieappleton.com/garden-history) | The garden includes notes and essays. The author's essay describes evolving, linked, unfinished ideas rather than only a reverse chronological publication feed. | A good model for public thoughts that can be revised. The low-friction version is a dated notes feed with optional links, not a complex graph application. |

One extra lead: [Melonking](https://melonking.net/) returned a playful message saying the site was closed on Mondays and would return tomorrow. That is an observed fetched response, not proof of a correct current schedule; retrieval may be cached. The concept suggests a harmless rotating joke or lab status sign rather than actually making Lucas's site unavailable.

### Inferences

- Select two or three references by role: one for visual vocabulary, one for public writing, one for interaction. Mixing every reference at once is likely to feel less intentional.
- Aster's plain sitemap is especially useful inspiration: discovery can be optional while projects and contact information stay easy to reach.
- Project photographs can be dithered for browsing but retain an original detailed view. This applies Xiokka's explicit exception for screenshots to robotics evidence, where fine wiring labels or diagrams may be important.

### Gaps

- These are text-fetched/author-documented references. No claim that animation smoothness, accessibility, mobile support or a specific hidden interaction was tested.
- Nathalie Lawhead's supplied domain could not be fetched; lycentropy.com returned 403. Neither is used as verified implementation evidence.
- Patorjk and Max Bittker returned insufficient text to support feature claims in this pass.

## How can Lucas implement dithering and interactive ASCII deliberately?

### Takeaway
Preprocess a few images into one shared palette, then make one compact ASCII panel interactive. This gets most of the distinctive look without requiring a heavy full-screen shader or a simulated operating system.

### Cited Findings

- GIMP's indexed-color workflow supports a custom palette, generated palettes and Floyd–Steinberg dithering choices: [GIMP indexed mode manual](https://docs.gimp.org/2.10/en/gimp-image-convert-indexed.html). This is a documented older-version workflow; UI wording in an installed version may differ.
- ImageMagick documents color reduction, remapping, Floyd–Steinberg dithering and ordered threshold patterns: [command-line options](https://imagemagick.org/command-line-options/). Its [video example](https://usage.imagemagick.org/video/) explains that a consistent ordered pattern can reduce changing dither noise and improve animation compression.
- CSS `image-rendering` controls scaling, not palette conversion or the creation of dithering. MDN explains the pixelated scaling behavior and its limits: [image-rendering](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/image-rendering). Its [pixel-art guide](https://developer.mozilla.org/en-US/docs/Games/Techniques/Crisp_pixel_art_look) warns that fractional device/CSS pixel mapping can produce uneven pixels and notes that canvas needs accessible descriptive content.
- ASCII Play's [manual](https://play.ertdfgcvb.xyz/abc.html) documents per-cell output, character aspect correction, cursor coordinates/pressed state, a configurable frame cap, and text or canvas renderers. It describes its text renderer's performance tradeoff. This supports reconstructing the method, not claiming measured performance on Lucas's visitors' hardware.
- `requestAnimationFrame()` provides an animation callback synchronized with browser rendering and generally pauses in background tabs: [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame). Pointer Events cover mouse, pen and touch through one input model: [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events).
- The operating system reduced-motion preference can be detected with `prefers-reduced-motion`: [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion). Ongoing nonessential movement shown alongside content can require a pause/stop/hide mechanism under the conditions of [WCAG 2.2.2](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html). Drag-based controls need an appropriate non-drag pointer alternative unless an exception applies: [WCAG 2.5.7](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html).

### Inferences

#### Proposed image-production recipe — easy

1. Choose the real source photographs first: portrait, robot detail, bench or soldering close-up. Keep originals separately.
2. Pick a single two- or four-color palette. Possible directions: charcoal/cream/amber, ink/cream/acid green, or existing earthy colors tightened into four tones. These are alternatives, not a settled recommendation.
3. Crop to the eventual display composition, reduce to a deliberately small pixel size, then remap/dither to the chosen palette. Test Bayer for regular technical texture and Floyd–Steinberg for photographic detail. Export lossless PNG; compare output bytes rather than assuming dithering always makes images smaller.
4. Render at a consistent scale using pixelated scaling where suitable. Dither the image pixels, not headings, paragraph text, form labels or every surface.
5. Reuse the same foreground/background/accent variables for ASCII and UI. A palette should connect media and interface even when their rendering methods differ.
6. Review at phone size and common browser zoom levels. Preserve descriptive alt text and use normal originals where technical legibility matters.

No runtime image-processing library is required for preprocessed media. Live shader dithering is an optional later experiment with more rendering, battery and fallback work.

#### Proposed ASCII interaction — medium

Make an ASCII robot head in a small panel. Eyes track pointer position; tapping cycles expressions; arrow buttons or focused arrow keys select the same poses. A visible Play/Pause button controls idle animation. Alternative subjects: a two-link robot arm following a target, a rotating wireframe gear, or a signal field disturbed by the cursor.

The minimal architecture is a pure `frame(time, pointer, width, height)` function producing a character grid, with one display update per frame. Account for characters being taller than wide. Start at about 64 by 24 cells and 15–24 updates per second as a design budget, not a guaranteed performance threshold. One text block is sufficient for a monochrome version; avoid thousands of independent DOM nodes unless per-cell color is worth the cost. A canvas/glyph-atlas version is a later option if measured performance requires it.

Use elapsed time, cap updates, stop when offscreen/hidden, and show a still frame by default for reduced motion. Don't mark a constantly changing ASCII block as a live region. Treat purely decorative art as hidden from assistive technology and provide meaningful nearby text; if the toy conveys state, provide an equivalent concise status and ordinary controls. Keep navigation outside the art.

On mobile, shrink the cell grid to the panel width rather than shrinking text into illegibility. Pointer interaction should stay inside the panel, not intercept page scrolling. Provide tap targets for expressions/reset so a hover gesture is never required. Keyboard commands should act only in an appropriate focused area and not hijack typing into notes/search/guestbook fields.

#### Proposed easter eggs — easy to medium

- A conspicuous but unlabeled loose screw is actually an accessible button titled “Inspect loose screw”; it reveals an ASCII robot pet or a short build blooper. Keep its content cosmetic, never required for finding projects.
- Clicking a small “diagnostics” badge opens a pretend robotics log with real site facts such as build date and a joke sensor reading. Label invented readings as fiction.
- A harmless secret keyboard sequence toggles a blueprint palette, with a touch equivalent somewhere discoverable. Let Escape/reset restore the normal view; don't make the page flash or play surprise audio.
- A 404 page is the lab's lost-parts drawer, with a real home link and one toy. This is more useful than a secret that disrupts ordinary browsing.

These are original proposals inspired by exploratory personal sites, not reverse-engineered claims about their hidden features.

### Gaps

- No performance benchmark, keyboard audit, touchscreen test or actual algorithm comparison was performed. These are acceptance checks for eventual implementation.
- The specific ASCII Play source license must be checked before copying its runner or demo code. Learning the per-cell method does not establish permission to copy an artwork.
- The exact image-processing command should be confirmed against the installed tool version when creating final assets; no dependency installation is justified during research.

## How should projects, quick thoughts and the overall visual world fit together?

### Takeaway
Choose a setting that makes the requested features feel related. A desktop, workbench or signal terminal can all support projects, notes, ASCII and a music panel; Lucas should choose the place he wants to maintain.

### Cited Findings

- The author of apvl.dev documents both projects and Markdown-powered thoughts within one site: [project write-up](https://apvl.dev/stuff/personal-portfolio/). This is evidence of a content/effects combination, not proof that MDX is needed here.
- Maggie Appleton describes evolving, contextually linked notes: [garden essay](https://maggieappleton.com/garden-history). Her [nontechnical gardening essay](https://maggieappleton.com/nontechnical-gardening) explicitly cautions against confusing technical features such as graphs or backlinks with the underlying practice.
- Aster's Archive documents room exploration and a plaintext alternative on the same page: [Front Hall](https://astersarchive.neocities.org/Home). Bill Wurtz's home links a distinct notebook collection: [home](https://billwurtz.com/).

### Inferences

#### Three original direction alternatives

| Direction | Dithering/ASCII role | Content layout | Main tradeoff |
|---|---|---|---|
| Personal lab desktop | Dithered wallpaper/portrait, ASCII robot in a diagnostics window, compact music widget | Projects folder, notepad window, links drawer | Closest to the retro-window direction described in the conversation. A fully draggable OS recreation would add substantial focus, overlap and mobile complexity. Start with ordinary flowing panels styled like windows. |
| Robotics workbench | Dithered bench collage, ASCII arm or scanner panel, labels and a limited instrument palette | Project specimen shelf, paper lab notes, community “power” control | Strong personal connection. Illustrated navigation should have a conventional list beneath it; don't require manipulating objects. |
| Signals from Lucas | Dark/light terminal palette, ASCII signal field, dithered portrait like a transmitted image | Current transmission, projects archive, short thought log, listening station | Most compact and easiest to make readable. Can become generic terminal styling unless personal photographs, writing and custom art carry it. |

No direction is chosen. A useful next design decision is which setting feels personal enough to revisit every week.

#### Future projects without fabricated portfolio content — easy

Create a real Projects destination now. If empty, say “The shelf is empty for now. I'm making room for things I build.” Do not invent case studies, success metrics, clients or placeholder robotics projects. If Lucas has unfinished work he wants public, label actual entries as experiments or in progress and describe what currently works.

Reserve a consistent future entry shape: title, one image, one-sentence purpose, honest status, link to a write-up/repository when it exists. Project pages can later include the question, build, mistakes, photographs and next step. No filtering/search/CMS is needed for an initially empty shelf.

#### Public quick-notes workflow — easy with a deliberate publishing step

Start with a single Markdown notes file or a folder of small Markdown entries in Git. Each entry gets a date and text; a title is optional. Show the latest few notes on the homepage and link to an archive. Author flow: edit in the GitHub web UI or local editor, preview, commit to the publishing branch. This is a proposed workflow, not something currently configured.

A notes database/admin screen is a separate product decision. It is unnecessary just because the site also has a shared visitor interaction; public read-mostly writing and visitor writes have different needs. Keep private thoughts out of the public repository until Lucas deliberately publishes them. If updating through Git feels too slow, then evaluate a small authenticated author interface; don't add it before trying the simpler workflow.

Possible recurring note labels: “bench scrap,” “today I learned,” “open question,” “currently obsessed with.” A short recent-changes list makes quiet maintenance visible. A now/currently panel is useful if Lucas wants to update it; show its real last-updated date so an old note doesn't pretend to be current.

#### Extra Web 1.0 features worth considering

- An original 88×31 site button with a small copyable link snippet, plus a limited friends/sites shelf. Credit others' art and self-host only with permission.
- A manually curated favorite-links page, a few topic shrines, and a tools-I-use page. These create places to explore before there are many projects.
- A visible changelog or “last soldered on” date derived from actual publishing activity, not an automatic clock falsely implying fresh content.
- RSS for notes/projects once an authoring format exists. A useful subscription path is more durable than a decorative fake notification count.
- A modest “under construction” sign attached to truly unfinished sections, with readable explanations rather than dead navigation.
- A compact theme/palette control is more coherent than loading every nostalgic visual trope. Use clear underlined links, deliberate borders and a few handmade textures; avoid tiny body text, perpetual marquees and cursor trails everywhere.

#### Mobile and maintenance decisions

Use a normal reading order with all primary destinations available in text. Stack windows/panels on phones, ensure headings explain destinations, keep visible focus and adequate tap targets, and allow content to work before toys initialize. A ring visitor often has no existing knowledge of Lucas: name, interests and an obvious route to projects/notes should appear before deep exploration. Keep one attention-grabbing animation per view and let the rest support it.

Priority proposal: palette and typography → actual introduction/project destination → quick notes → one ASCII interaction → one hidden detail → music and persistent community widget when their separate requirements are resolved. This is sequencing advice, not a commitment to build.

### Gaps

- The existing repo/site was not inspected by this researcher; continuity with its retro window and earthy colors comes from conversation context. The coordinator's repository evidence should determine exact reuse choices.
- Lucas's preferred maintenance frequency, acceptable visual density and desired balance of professional versus personal content remain open design preferences, not research blockers.
- Database-backed community controls, Winamp/music and Purdue Hackers membership are assigned to other research tracks.
