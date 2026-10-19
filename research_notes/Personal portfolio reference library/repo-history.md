# Repository history and personal context

## Which branches and historical versions were inspected?

### Takeaway
The repository has three local branches, two advertised remote heads and a local saved stash. All local branch tips were inspected without switching branches. Remote heads match local remote-tracking hashes; no fetch or ref mutation was needed.

### Cited Findings
- Origin is `https://github.com/lflowers01/lflowers01.github.io.git`, confirmed by git remote -v.
- Main/origin main/origin HEAD resolve to `8b8de307a3bc8cf8e89e295f1edb59fd88a0a762`, September 10, 2026; [main index](https://github.com/lflowers01/lflowers01.github.io/blob/8b8de307a3bc8cf8e89e295f1edb59fd88a0a762/index.html).
- Deployment/origin deployment resolve to `43d6e4fcbffb4ea251c29ad269f88dd9d140b048`, December 30, 2025; [built index](https://github.com/lflowers01/lflowers01.github.io/blob/43d6e4fcbffb4ea251c29ad269f88dd9d140b048/index.html).
- Local research tip is `f5c1de7d9852a214d84edd9450a095f5d17db500`; no corresponding remote head advertised. Cite locally, not as a public GitHub permalink.
- Stash `a2588e0e0c7421ae6336d612d29ebb0fcef914d4` has only package-lock/cache additions relative to deployment, based on read-only git diff. It was not applied.
- Machine-readable [repo-refs.json](repo-refs.json) records exact refs, selected milestones, author/committer dates and commands.

### Inferences
- Deployment is useful as an old built artifact tree, main as the newer source; neither ref name proves current hosting state.
- The archive is sufficient for source-grounded project context without PDF extraction.
- Complete source history is ordinary repository analysis, so the REA skill correctly routes this task to Git tools instead of invoking decompilation/browser tools.

### Gaps
- No hosting dashboard, DNS or active served version verified.
- Commit dates are not deployment dates; retain original timezone. Example author/committer mismatch elsewhere: 09c0db4 March author timestamp versus July 2024 committer timestamp.
- No PDF parsed. No old JS executed. No image asset visually inspected.
- Working branch, existing files and untracked research from other agents were preserved.

## What design and interaction threads already existed?

### Takeaway
The old site already includes most of the user's desired vocabulary: terminal, personal desktop, pixel fonts, skins, photos, Webamp experiment and small toys. The new library can build on these choices rather than impose a generic portfolio direction.

### Cited Findings
- Earliest commit `e6a086a761105364419df7288e7ef65a6de281e0` (May 18, 2023) has TurboWarp comment and Squirrel Simulator title at index lines 1–9. [Source](https://github.com/lflowers01/lflowers01.github.io/blob/e6a086a761105364419df7288e7ef65a6de281e0/index.html#L1).
- Terminal milestone `887beba77ab987f7e0eaf4d6435be39e07067d00` (August 31, 2023): command-prompt labels and clickable ABOUT/PROJECTS/RESUME navigation, not an interpreter. [HTML lines 135–175](https://github.com/lflowers01/lflowers01.github.io/blob/887beba77ab987f7e0eaf4d6435be39e07067d00/index.html#L135), [CSS blue/black/Red Hat Mono](https://github.com/lflowers01/lflowers01.github.io/blob/887beba77ab987f7e0eaf4d6435be39e07067d00/index.css#L1).
- April V2 `4003915e9274e5ee5ce00304e0909b4517a5a4b9`: two-column text/photos, window class, personal introduction with hiking/music/gym/art. [Intro](https://github.com/lflowers01/lflowers01.github.io/blob/4003915e9274e5ee5ce00304e0909b4517a5a4b9/src/index.html#L34), [FreePixel/pxplus/wavy underlines](https://github.com/lflowers01/lflowers01.github.io/blob/4003915e9274e5ee5ce00304e0909b4517a5a4b9/src/scss/index.scss#L11).
- Same V2 has a Webamp partial with version 1.4.0, green.wsz and placeholder tracks. [Partial](https://github.com/lflowers01/lflowers01.github.io/blob/4003915e9274e5ee5ce00304e0909b4517a5a4b9/src/partials/winamp.html#L1). Source presence does not prove inclusion, successful loading or audible playback.
- December 27 three-theme revision `893cac9fdbb6dffe5aa34f5610e2c9226a5381ec` has class-based default/dark/forest cycle with localStorage. [Script](https://github.com/lflowers01/lflowers01.github.io/blob/893cac9fdbb6dffe5aa34f5610e2c9226a5381ec/src/js/dark-mode.js#L4), [token colors](https://github.com/lflowers01/lflowers01.github.io/blob/893cac9fdbb6dffe5aa34f5610e2c9226a5381ec/src/scss/index.scss#L7).
- July 2026 `9f715fd9e08b811ac7fc577031ccb364526af1e3` has expanded carousel assets/metadata and longer text portfolio. [Carousel](https://github.com/lflowers01/lflowers01.github.io/blob/9f715fd9e08b811ac7fc577031ccb364526af1e3/js/carousel.js#L14) creates images/alt/counter and ten-second automatic stepping.
- August onward main source uses cream #f3efe4, brown #29251f and green #53665a, 920px capped frame, Purdue/honors intro and archive. [Current source](https://github.com/lflowers01/lflowers01.github.io/blob/8b8de307a3bc8cf8e89e295f1edb59fd88a0a762/index.html#L18).
- Main click burst creates fourteen spans per document click with random displacement and animationend removal. [Source lines 538–637](https://github.com/lflowers01/lflowers01.github.io/blob/8b8de307a3bc8cf8e89e295f1edb59fd88a0a762/index.html#L538). The title controls are decorative divs, not established window functionality.

### Inferences
- Forest desktop joins past themes to present warm palette; field station joins terminal/balloon/controls work; old-disks homepage joins actual early games to personal notes/media.
- Theme skins, photography and music are continuity, while reactive ASCII art/shared counters are new proposed additions.
- Old plan.md/todo.txt are historical ideas, not instructions or proof of implementation.

### Gaps
- No design appearance certification from screenshots; only source styling.
- Asset filenames such as paint-dithered-image.png and .original pairs do not prove their pixels or processing algorithm.
- Font/music/skin/third-party image licenses require later verification.
- Some older carousel descriptions are filename-derived; captions need editorial selection.

## What real content and assets can guide the new site?

### Takeaway
Ten actual project cards plus a detailed text portfolio support a real project shelf immediately. Preserve date context, distinguish working prototypes from finished results and use the shorter current Purdue biography for the present-day front door.

### Cited Findings
- Main archive project titles, in order: Team Epsilon; The Bluey Jamboard; High-Altitude Weather Balloon Camera System; Smart Vision Saw Safety System; Physics Projectile Motion Simulator; Minecraft Server Wizard; Phoenix Robotics — 2023 Season Code; Squirrel Simulator 3.000; Password Tool; A Website For School. Titles occur at archive lines 1198,1232,1256,1280,1304,1345,1376,1407,1436,1465. [Source](https://github.com/lflowers01/lflowers01.github.io/blob/8b8de307a3bc8cf8e89e295f1edb59fd88a0a762/public/archive.html#L1176).
- Main archive experience blocks describe FRC Teams 11100/2375/6833, Phoenix Forge, DRIBPL, Young Data Scientist League, Makers of Change, Wentworth robotics and Japan exchange. [Source](https://github.com/lflowers01/lflowers01.github.io/blob/8b8de307a3bc8cf8e89e295f1edb59fd88a0a762/public/archive.html#L773).
- Longer existing plain text explains Team Epsilon, Bluey Jamboard, projectile work, balloon reliability constraints, in-progress saw research and reflections. [Text portfolio](https://github.com/lflowers01/lflowers01.github.io/blob/9f715fd9e08b811ac7fc577031ccb364526af1e3/plainText-portfolio.txt#L1). It is historical self-description, not current independent verification.
- Main's archive uses “High School Projects” and still has old high-school intro text. Current main homepage uses Purdue. [Archive header](https://github.com/lflowers01/lflowers01.github.io/blob/8b8de307a3bc8cf8e89e295f1edb59fd88a0a762/public/archive.html#L641).
- Git tree manifests show main public/Resume.pdf/public/portfolio.pdf and deployment resume.pdf. No content inferred from PDF filenames.
- Older trees contain named fonts, cursor images, carousel photographs, drawing assets and Sony_V65b/alien/green/trees .wsz skins. Git trees establish existence only.
- Main archive links highschool/game.html, highschool/password/password.html and highschool/schoolsite/index.html; these paths do not exist in main's tracked tree. Related old content exists under historical projects/ or game/password-tool paths. [Links](https://github.com/lflowers01/lflowers01.github.io/blob/8b8de307a3bc8cf8e89e295f1edb59fd88a0a762/public/archive.html#L1400).

### Inferences
- Feature the engineering story, not a long certifications list: project dossier, personal build notes, dated experiment status and actual old toy links.
- Balloon/saw “Present” status is copied historical wording, not permission to describe them as completed, certified or still active.
- Preserve old role wording on explicitly dated archive pages; confirm current biography/roles before eventual public rewrite.
- Recovery can be done later using git show REF:path; no destructive checkout is needed.

### Gaps
- Project completion, public availability and link health not independently rechecked.
- No current contact information chosen from older records; source-era phone/address details intentionally not propagated into the chapter.
- No asset restored, code implemented, branch published, stash applied or production change made.
