# Content community music and persistence

Research date: October 18, 2026. Scope: Web 1.0/web revival portfolios; primary examples and implementation proposals, not website construction. Final reader-facing chapter: [community-and-content.md](../../library/community-and-content.md).

## Which additional personal sites supply reusable content and community ideas

### Takeaway
New primary references broaden the original report from desktop/music/ASCII into personal publishing, neighbors, collections and tiny clubs. Their simple page structures are useful regardless of whether the portfolio ultimately looks like a terminal, scrapbook, workshop or personal portal.

### Cited Findings
- [Jubilife Vibes](https://jubilifevibes.neocities.org/) exposes dated changes and a to-do list, embeds a Cbox frame, and offers a button snippet. Its log describes RSS/music, which was not tested as playback.
- [Nerucom](https://nerucom.neocities.org/home) links a mascot, art gallery, shrine index, diary, newsletter, piclog and previous layout. Its guestbook link points to 123guestbook; do not recommend the historical destination as a current working service.
- [Kerka's log](https://kerka.neocities.org/log/) offers both animated and still button collections, a native audio player, theme toggle and long dated log. It explicitly allows some button hotlinks. REA verified only the specific behavior recorded below.
- [Grlrot](https://grlrot.neocities.org/) exposes current reading/playing/listening, shows, a microblog update, neighbors, collections and a Random control. These are page observations; not all control behavior was exercised.
- [purgamentum exit](https://notprincehamlet.neocities.org/) has postcards, hobby collections, a toybox, reading challenges and shrines, and explicitly asks people not to hotlink its buttons. This differs from Kerka's stated policy.
- [Loominggrey](https://loominggrey.neocities.org/) has dream/media-log updates, personal archives and a button snippet.
- [PIXELDEW](https://pixeldew.nekoweb.org/pages/home.html) documents a garden journal, recipes, herbarium, adoptables, toyboxes and miniature creative clubs. Direct web-open failed; primary content was retrieved with Jina. No interaction activated.
- [Cedrus's adoptables](https://cedrus.nekoweb.org/pixels/adoptables) offers small original pixel collections and asks for a link back. Navigation includes development/projects, snippets, build process, collections and sitemap. Direct open failed, Jina returned primary text.
- [Cloudy Retreat](https://syllphana.nekoweb.org/home.html) is an additional personal sky-themed site with concise dated updates and source credits, retrieved through Jina. Search snapshot mentions a pet, but fetched content did not establish its behavior; the final chapter does not claim runtime pet behavior.
- [NekoDirectory](https://nekodir.nekoweb.org/) catalogs pixel/text cliques and exposes query, tags, shuffle and status labels including obsolete. It states it is static and maintained manually. This catalog is a community reference, distinct from a personal portfolio.
- [tamaNOTchi](https://tamanotchi.world/) describes customizable growing shareable pets and exposes a click leaderboard. No click, pet-state transition or database was inspected.
- [piclog](https://piclog.blue/) exposes a photo-centered short-post stream, useful as a publishing-format reference.
- [Atabook's features](https://atabook.org/features) describe review-before-publication, replies, message deletion and layout controls. Full custom CSS is listed under its supporter plan. Export, retention and privacy behavior were not audited.
- [Winamp Skin Museum](https://skins.webamp.org/) exposes skin search. The integration contract comes from [Webamp's own docs](https://docs.webamp.org/docs/api/webamp-constructor/), not an assumed museum API.

### Inferences
- A portfolio can preserve an old-web feel through clear personal categories and linked neighbors even when generated with a modern static-site tool.
- A few selected collections reveal more personal taste than an uncurated enormous badge wall. A real empty project destination is preferable to fake portfolio entries.
- Guestbooks, message boards, owner notes and contact email have different publication/privacy expectations; grouping all into one live database is unnecessary.
- New final chapter contains 19 recipes C01–C19, including owner-authored content, social neighborhood, shared data, music and discovery. Poll/mural recipes are original adaptations and explicitly not claims of features/backend observed at the references.

### Gaps
- No complete mobile, screen-reader, keyboard, motion or visual quality audit of any reference. No screenshot evidence retained by the community studies.
- No service accounts, message posting, poll voting, pet feeding/clicking or intentional shared counter increments. Ordinary GET page loads can cause access logs and automatic embed requests.
- Some reference pages contain old or broken links; inclusion is for the described observed concept rather than a blanket recommendation of their integrations.

## What runtime evidence explains how to recreate the elements

### Takeaway
Two new targets produced four REA evidence records, including two controlled interactions. They show how static HTML plus browser-local state can create a social-feeling old-web site without proving a server-side database exists.

### Cited Findings
- Kerka initial capture, Evidence `ev_92721b446d86f925df725970a303ada2a229885c6b2107e0feaded6118a6c946`, records a native audio element, playlist array, control functions, native details collections, theme script and ring links. [Selected receipt](evidence/community-kerka.json); [target](https://kerka.neocities.org/log/).
- Kerka theme scenario, Evidence `ev_213cfbf1c21b6ad91283854d10142ff911422d63bc0acfc7a99b104f76100448`, clicks `#themeToggle`. Before root lacks the dark class; after root has it. A `theme` local-storage key with hashed value was captured; no page errors. The script text documents its class/localStorage logic. [Selected receipt](evidence/community-kerka-toggle.json).
- NekoDirectory initial capture, Evidence `ev_76cb1d2e1b0d8c600cc9a624d0770cf6fa7db204f5b40fb6f63a25ccee4cce67`, captures tagged article cards and local search/shuffle UI. [Selected receipt](evidence/community-nekodir.json); [target](https://nekodir.nekoweb.org/).
- NekoDirectory Shuffle scenario, Evidence `ev_5cd82c222d852e4706d44fa51a152e2dcdc4b24a749041abe41bd4ba0fdeeca1`, clicks `#shuffleBtn`, after which the first card changes from Love Dove to Menhera Text Clique and DOM digest changes. Next settle capture retains the new digest; no page errors. [Selected receipt](evidence/community-nekodir-shuffle.json).
- All four launched existing Chromium at `C:/Users/fartpad/AppData/Local/ms-playwright/chromium-1248/chrome-win64/chrome.exe` in owned temporary profiles, reduced-motion requested and service workers blocked; each reports process cleanup. Receipts include exact parameters, evidence IDs, completeness, DOM hashes, extracts, error summaries and limitations. They are selected extracts rather than complete canonical Evidence.
- Earlier Webamp/Poolsuite records are retained under `research_notes/Web playground design research/evidence/` and reused as earlier evidence rather than rerun or falsely labeled new. [Original runtime notes](../Web%20playground%20design%20research/runtime.md).

### Inferences
- Implement the theme with one root class/data attribute and optional localStorage preference, handling storage exceptions. The captured script's lack of a storage try/catch is not a requirement to reproduce.
- A small own-site catalog can implement shuffle/filtering entirely client-side over build-generated metadata; captured behavior does not identify NekoDirectory's exact algorithm.
- Native audio can supply a cassette-themed playlist without a custom audio engine. Recreate correct wraparound at both ends and derive playing state from media results/events, rather than assuming the observed script is bug-free.

### Gaps
- Cross-reload theme persistence was not exercised; storage key presence is evidence of a current-browser write, not proof of a later visit.
- Search input was observed, but its runtime query algorithm was not exercised. A draft fill action was rejected by the tool schema before execution; the completed interaction tested Shuffle instead. One earlier click action with an incorrect selector-field schema was also rejected before execution; corrected locator-based theme click succeeded.
- No screenshots, network bodies, song listening, backing service/source repository or server database inspected. Browser/page errors absent during this window do not imply whole-site correctness.

## Which storage and integration designs are sufficient for recreation

### Takeaway
Most requested content belongs in Markdown/JSON; preferences and discoveries can be browser-local. Only actual shared visitor actions need an API/database, and public text writes add moderation work.

### Cited Findings
- [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages) hosts static files. Shared writes require an external service/API.
- [MDN localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) documents origin-scoped browser storage and access exceptions. It is not a shared database or trusted voter identity.
- [D1 prepared statements](https://developers.cloudflare.com/d1/worker-api/prepared-statements/) document bound database operations. [Workers rate limiting](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/) documents approximate, location-local limits. Do not infer unique people from IPs or rate limits.
- [GoatCounter counter docs](https://www.goatcounter.com/help/visitor-counter) document counter enablement, output formats and caching. Count semantics depend on configured analytics; displayed counts can lag.
- [Applause Button](https://applause-button.com/) documents aggregate claps and an API-backed component pattern. No write or chosen-provider policy review performed.
- [Webamp constructor](https://docs.webamp.org/docs/api/webamp-constructor/) documents initial tracks, metadata/duration advice, skins, layout, CORS and hotkeys. [Initialization](https://docs.webamp.org/docs/initialization/) distinguishes floating body mounting from `renderInto` with a positioned parent.
- [MDN autoplay](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay) and [play promise](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) explain why a player must handle rejected playback rather than assuming music started.
- [Atom RFC 4287](https://www.rfc-editor.org/info/rfc4287/) supplies the feed data model and escaping/ID/date requirements. A static feed does not need a subscriber database.
- [Purdue ring joining](https://github.com/purduehackers/webring#want-to-join) remains the relevant membership/link contract, reused from the earlier report; no submission or eligibility claim made.

### Inferences
- Proposed boops API uses a fixed server-known counter and atomic increment/return; the browser cannot send arbitrary deltas. Render server-confirmed value, allow intentional repeated boops if desired, handle uncertain failures without blind retries, and keep resets private.
- Proposed poll accepts allowlisted choice IDs, with repeat-vote policy stated honestly. Proposed mural bounds grid coordinates/palette and decides overwrite/claim/revision semantics in advance. These are conceptual recipes, not tested executable code or reverse-engineered backends.
- Guestbook can begin as a hosted link. A custom version needs pending/approved status, bounded plain text, safe links, authenticated admin moderation and protected private fields.
- Original/site-owned or otherwise permitted music and artwork must be selected; an available URL or code license does not license every track/skin/graphic. No prices, free-tier quotas or legal determination promised.

### Gaps
- No code implementation/tests, deployments, service setup, account access, backend writes or complete device audits. The final recipes identify future verification appropriate to each choice.
- Current service quotas, export/backup policies, chosen songs/skins permissions, host-specific CORS and live membership behavior remain implementation-time checks.
