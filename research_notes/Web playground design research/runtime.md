# Music and shipped browser experiments

Research date: 18 October 2026. Scope: inspiration and implementation planning only; no website built. Runtime studies below use actual REA `capture_browser_scenario`, launched in an owned temporary Chromium profile, with no existing signed-in session. Browser executable already installed at `C:/Users/fartpad/AppData/Local/ms-playwright/chromium-1248/chrome-win64/chrome.exe`; no installation/configuration changes. Public pages may themselves make analytics requests during ordinary navigation; no forms, guestbook messages, memberships, or submissions were sent.

## Which music and desktop references are useful?

### Takeaway

Webamp is the most direct answer to “music, maybe Winamp”: reuse the existing player instead of implementing it. Poolsuite is the strongest reference for making music part of a coherent place rather than attaching a generic streaming widget. Windows93 is a discovery reference with explicitly limited runtime validation.

### Cited Findings

**Webamp — [live demo](https://webamp.org/), [official project](https://github.com/captbaritone/webamp), [skin museum](https://skins.webamp.org/).** The project describes itself as a browser reimplementation of Winamp with skin support. Its code is MIT licensed; its README explicitly distinguishes the Winamp name/interface/sample audio from that code license. Do not assume the library license licenses every skin or track. [Project and license statement](https://github.com/captbaritone/webamp).

REA observed the demo at 1280×900 with reduced motion requested. Captured accessibility text exposed playlist/equalizer controls, track labels, play/pause/stop, volume/balance/seeking sliders, shuffle/repeat, and a menu of skins. Captured DOM contained canvas elements and embedded PNG data used in CSS skins. Network responses included the main JS, `butterchurn-jQmFj2sG.js`, `base-C9eGptWO.js`, and a range response for a demo MP3. That confirms resources and UI were present, not that every visualizer or skin works on every device. **Evidence `ev_98f798eb06cb7c017042aaa8faaff4f2322dc5d7ca653ae05f824d6a27d23052`**, receipt: [webamp-rea-summary.json](evidence/webamp-rea-summary.json). Source: [observed live target](https://webamp.org/).

A second REA run performed one explicit click on the observed `#play` control. The action completed and the player accessibility snapshot gained numeric audio readout text. This is evidence of successful interaction dispatch and UI update; audio output was not recorded or listened to, so it is **not** proof of audible playback. **Evidence `ev_06895eef3bc720f3d412d6d66e0e766e373e7985c899186c7c9512a1bb90bc14`**. Source: [observed live target](https://webamp.org/).

**Poolsuite — [live site](https://poolsuite.net/).** The current site combines a radio player, retro TV/video window, dock icons, mixtapes, guestbook, events and membership. Its own 2025 announcement describes a redesigned V3; avoid describing every historical screenshot as its current layout. [V3 announcement](https://palmreport.poolsuite.net/poolsuite-v3/).

REA observed “Stopped,” an explicit Play control, track/channel labels, a video filename, a retro clock, and dock entries including Player, Newsroom, Mixtapes and Guestbook. Captured DOM contained a `video` element with `autoplay` and `playsinline`; this does not establish that audible music autoplayed. Successful network responses included `view-DefaultPage-vue` JS/CSS, custom web fonts, icon assets, the Poolsuite playlists API, Contentful entries and Radio.co status. This establishes an asset-driven browser UI with fetched content/status. A Vue-related build filename is a framework clue, not a source-level architecture audit. **Evidence `ev_feade6f2444d3b4a66387650fac17b52eb1719a11c325fca673ecc7389a40499`**, receipt: [poolsuite-rea-summary.json](evidence/poolsuite-rea-summary.json). Source: [observed live target](https://poolsuite.net/).

**Windows93 — [main site](https://www.windows93.net/), [alternate computer page](https://mypage.windows93.net/computer/).** The alternate page's first-party description says it includes an ASCII desktop, a portal converting images into ASCII or dithered GIFs, and PHP utilities usable without JavaScript. This is a useful “everything can be rendered as text” reference, but the claim is its published description, not a successful runtime recreation here. [Project's alternate-page explanation](https://mypage.windows93.net/computer/).

REA main-site capture obtained HTTP 200 for the main page and numerous JS modules, but the final accessibility snapshot still showed only a Loading status. **Evidence `ev_00955b9f7adae248f58e03f1bdf8226757de25d04579a65d2f38c4d8a153e667`**, receipt: [windows93-rea-summary.json](evidence/windows93-rea-summary.json). Source: [observed main target](https://www.windows93.net/). An alternate-page REA attempt failed during navigation with `net::ERR_CERT_COMMON_NAME_INVALID`; it produced no successful page Evidence ID. No certificate bypass was attempted.

### Inferences

- **Suggested adaptation, not a claim about source code:** open a single Webamp window from a visible “radio” or “music.exe” button. Match the chosen skin to the site's limited palette. Keep notes/projects available while music plays.
- **Suggested adaptation:** borrow Poolsuite's continuity: one background, one icon style, consistent borders, one deliberate type system. The effect comes from repeated visual rules and playful content, not from needing its services or accounts.
- Make a personal three-to-six-track “currently on rotation” playlist or original ambient sounds rather than a radio platform. Difficulty: medium to embed and style Webamp; higher for a custom skin, visualizer and robust mobile layout.
- A compact custom `<audio controls>` player is the smaller alternative if the full Winamp experience competes with reading. Give the surrounding card retro styling rather than reskinning inaccessible custom controls.
- Easter egg: clicking a tiny antenna or opening “secret-mixtape.txt” reveals a bonus player/theme. The trigger should also be reachable with keyboard/touch; this is a proposed design, not an observed Poolsuite feature.
- Avoid a full operating system simulation for the first version. Projects, quick notes, player, one ASCII focal point, one persistent community toy and ring navigation already provide plenty to explore.

### Gaps

- No screenshots were retained or visually evaluated; these studies establish DOM, accessibility and network facts, not a pixel-perfect visual audit. The live sites remain visual references for the human/design phase.
- No audio output, touch devices, Safari, mobile viewport, skin switching, visualizer operation, drag behavior, player persistence or cross-page playback was validated.
- Poolsuite captured successfully but REA completeness is incomplete for events because some requests were unfinished at capture end. No backend, membership or guestbook implementation was inspected. Do not copy its service endpoints into the user's site.
- Windows93 loading does not prove the site is broken; observed time window, service-worker policy, headless mode or environment could matter. Browser environment requested reduced motion and blocked service workers. No conclusion on its final desktop was established.
- Compact JSON files are explicitly selected extracts, not complete portable Evidence bundles. They preserve original IDs, action inputs, browser cleanup, DOM digests, accessibility text, selected responses and limitations.

## How would a Winamp-style section work?

### Takeaway

Use official Webamp APIs, load it when requested, and supply a small playlist of audio the user can actually distribute. Keep playback a user action and give phones a simpler layout.

### Cited Findings

- Official initialization creates a `Webamp` instance and calls `renderWhenReady(container)`. That container locates the player; by default the player is appended to the document body. Current docs also provide `renderInto(domNode)` for a positioned parent since v2.3.0. This distinction matters if the player must stay inside one panel. [Initialization](https://docs.webamp.org/docs/initialization/).
- The constructor accepts `initialTracks`, `initialSkin`, `availableSkins`, `windowLayout` and optional media-session integration. Tracks and skin URLs need appropriate cross-origin serving; supplying track metadata and duration avoids probing audio for tags/duration. These existing options cover a playlist and themed player without a new player implementation. [Constructor API](https://docs.webamp.org/docs/api/webamp-constructor/).
- Browsers commonly restrict audible playback that begins before user interaction; handling rejected `play()` promises and showing a play control are supported patterns. Muted video behaves differently. [MDN autoplay guide](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay).
- The platform exposes the user's reduced-motion preference through `prefers-reduced-motion`; it is the appropriate hook for reducing animation. [MDN reduced-motion reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion).

### Inferences

**Proposed implementation recipe; illustrative pseudocode for later, not code added to the website:**

1. “Open radio” is a semantic button. On request, lazy-import Webamp and create one instance, checking compatibility and displaying a fallback when unavailable.
2. Provide `initialTracks` with same-origin files, titles, artists and durations; choose a default skin or licensed custom skin.
3. Use `renderInto` with a positioned music panel if that suits the layout, or `renderWhenReady` if the player should float over the page.
4. Let the actual play button start audio. Catch/report blocked playback and broken URLs without blocking the rest of the site.
5. On narrow screens, keep the player within the viewport or swap to native audio controls with matching track links. Do not shrink every control into unreadable pixel art.
6. Keep global hotkeys off while users type notes/guestbook input. Avoid visualizer activity while hidden; supply a motion toggle and honor reduced motion.
7. Prefer owned/original or clearly licensed tracks. Linking to a platform playlist or using its permitted embed is an alternative; a working remote MP3 URL is not evidence of distribution permission. This is a planning constraint, not a legal opinion.
8. Optional later feature: show the user's current album/track as a static note, not an API integration needing credentials or constant upkeep.

No database is needed for the player itself. A saved volume/theme preference can be localStorage but is only local to that browser; it is not the shared visitor/community state requested elsewhere. One page with panels makes playback continuity easier than separate full-page navigations; that is a design tradeoff to choose later.

### Gaps

- Final track/skin permissions and hosting headers must be checked against the assets selected later.
- Exact bundle size, current npm version, import paths and mobile player dimensions should be verified during implementation. No packages were added and no autoplay workaround was built.
- Audio licensing differs from code licensing. These notes do not give permission to rehost songs or third-party branded skins.
