# Content, community, music and shared toys

Research checked October 18, 2026. This is a menu of Web 1.0 and web-revival elements for a personal portfolio, not a specification to install everything. The strongest old-web feeling comes from authored pages, neighbors and small visitor rituals. A new animation framework is optional.

**Evidence labels:** **Page** means primary public HTML/text was fetched; it does not prove visual quality or working controls. **REA** means the declared browser scenario captured the behavior described. **Docs** means the maintainer describes an interface. **Recipe** means an original implementation proposal; it is not a claim about an example's backend. Effort is relative: **S** = static content/small script; **M** = integration or API; **L** = public writes with ongoing operations. No hosted service was configured and no visitor message, vote, pet click or counter increment was deliberately submitted.

## Reference shelf

These add new destinations to the [earlier report](../reports/Web%20playground%20design%20research.md), while retaining its Webamp, Status Cafe, Sadgrl, 32-Bit Cafe, Wiby and Purdue ring references.

| Reference | Specific observed idea | Evidence boundary |
|---|---|---|
| [Jubilife Vibes](https://jubilifevibes.neocities.org/) | Pokémon-themed site with dated updates, a public to-do list, rings, a button snippet and an embedded Cbox frame | Page; the update log describes RSS and music, not a playback test. |
| [Nerucom](https://nerucom.neocities.org/home) | Mascot-led hideout; diary, shrine index, gallery, newsletter and latest piclog; links an older layout | Page; its 123guestbook destination is a historical link, not a recommended working service. |
| [Kerka](https://kerka.neocities.org/log/) | Long chronological log, separate animated/still button collections, music, theme switch, rings | Page + REA; theme click tested; no audio played. |
| [Grlrot](https://grlrot.neocities.org/) | Microblog, shows, media log, current reading/playing/listening, neighbors and a Random control | Page; presence of controls does not establish their runtime implementation. |
| [purgamentum exit](https://notprincehamlet.neocities.org/) | Postcards, hobby corner, toybox, reading challenge, shrines and neighbors | Page; owns a distinct “please don't hotlink” button policy. |
| [Loominggrey](https://loominggrey.neocities.org/) | Dream/media logs, personal updates, collections and a copyable button | Page; a personal archive rather than a commercial portfolio template. |
| [PIXELDEW](https://pixeldew.nekoweb.org/pages/home.html) | Garden journal, recipes, herbarium, toyboxes, adoptables and tiny creative clubs | Primary page retrieved through Jina after direct fetch failed; no toy was activated. |
| [Cedrus's adoptables](https://cedrus.nekoweb.org/pixels/adoptables) | Mini cats, robots, planets and other pixel collections with a requested link back | Primary page through Jina; permission applies to that page's stated offer, not all site assets. |
| [Cloudy Retreat](https://syllphana.nekoweb.org/home.html) | Personal sky-themed retreat, short dated updates and links crediting layout sources | Primary page through Jina; search snapshot also mentions a pet, but the retrieved body did not establish its behavior. |
| [NekoDirectory](https://nekodir.nekoweb.org/) | Browseable clique collection with tag/search UI and Shuffle | Page + REA; Shuffle reordered the first card in a controlled session. |
| [tamaNOTchi](https://tamanotchi.world/) | Shareable customizable growing pets and a click leaderboard | Docs/page; no pet click, growth transition or backend inspected. |
| [piclog](https://piclog.blue/) | Small photo posts as an alternative to polished long articles | Page; useful format reference, not an audited integration. |
| [Atabook](https://atabook.org/features) | Hosted guestbooks with review-before-publication and replies | Docs; not a personal-site design reference or an export/retention audit. |
| [Winamp Skin Museum](https://skins.webamp.org/) | A whole aesthetic built from compact, independently skinned media windows | Page exposes skin search; actual integration is documented by Webamp, below. |

## Author-controlled pages

### C01 — Brain buffer or micro-notebook

**Borrow:** Grlrot's short-post category and [Status Cafe's](https://status.cafe/) timestamped mood format. These establish that small thoughts can be their own content type. **S; static, no database.**

**Recipe:** keep `notes/2026-10-18-small-thought.md` with a stable ID, publication date, optional mood and a few sentences. Build the latest three into a bordered homepage “buffer,” with a permanent archive and individual anchors. The surrounding page can look like terminal output, graph paper or a diary without changing this data model. Edit a Markdown file, preview, then publish; no login screen or public posting endpoint is needed. Allow titleless entries by generating a date label for navigation. Keep private drafts outside the public repository. Long text must wrap, dates should be real `<time>` values, and a failed script must not hide the notes. The proposed storage/workflow is ours; neither example's authoring backend was inferred.

### C02 — Current status panel and a dated /now page

**Borrow:** Grlrot's reading/playing/listening panel; [the /now convention](https://nownownow.com/about) from the earlier report. **S; static.**

**Recipe:** one small data file with `updated`, `making`, `learning`, `reading` and `listening`. Render a compact status panel plus a fuller `/now/` page from the same content. Add a character face or imood-like icon, but include the mood in text. Change the file when life changes. Show “updated October 18” rather than manufacturing a new date on every visit. If using Status Cafe, a plain profile link is sufficient; its general embedding/API contract was not established in this research. Avoid promising “currently online” from a timestamp or a browser-local clock.

### C03 — Workbench project shelf with honest empty slots

**Borrow:** Cedrus's distinct development section and Nerucom's gallery/update structure. **S; static.**

**Recipe:** a shelf of project labels and thumbnail/ASCII previews. Each real entry needs `title`, `status`, one-sentence question, image/description and a working link. Use statuses such as sketch, prototype and finished; a detail page can show a dated build log, failures, photographs and next experiment. Reserve space with one labeled “future experiments” note rather than fabricated projects or many dead links. Add a Markdown file and preview image to publish a project. Start with normal links and headings; filters become useful once there are enough entries. A decorative file icon still needs a readable project name. This is a portfolio adaptation, not a reverse-engineered CMS.

### C04 — Changelog, to-do board and old-layout museum

**Borrow:** Jubilife Vibes' public checklist, Kerka's dated log and Nerucom's previous-version link. **S; static.**

**Recipe:** keep short dated change entries separate from personal notes. Latest updates appear on the homepage; an archive preserves the rest. A small “under construction” sign can link to a real list of planned pages, while completed checkboxes link to what changed. For a layout museum, save screenshots and explanatory notes; an old live HTML copy must have scoped styles/assets so it cannot break the main site. Use actual editorial dates. A build timestamp is not evidence the writing changed. Long checklists should expand in normal flow, avoiding a tiny nested scrollbox on phones.

### C05 — A topic shrine, media shelf or field journal

**Borrow:** PIXELDEW's herbarium and recipes, purgamentum exit's postcards and cross-stitch, Loominggrey's dream/media logs. **S–M; static.**

**Recipe:** dedicate one page to something you care about: robot mechanisms, a game, an album, strange lab equipment, favorite campus corners. Use an intro explaining the attachment, original photos/drawings, a few annotated links and dated discoveries. A robotics “parts cabinet” could arrange mechanisms as thumbnail drawers leading to short explanations. Keep image captions and a plain index so it remains understandable without the decorative arrangement. Add entries to a folder or one Markdown page; generate thumbnails rather than loading originals at full size. Link to music or art you cannot redistribute. This page should reveal your taste, not become an obligation to document everything you consume.

## A neighborhood rather than a social feed

### C06 — Friends shelf, 88×31 button and link-back code

**Borrow:** [32-Bit Cafe's buttons](https://32bit.cafe/linktous/), Kerka's still/animated alternatives and the contrasting button rules on purgamentum exit. **S; static.**

**Recipe:** store a small list of destination URL, name, image, credit and permission note. Render linked 88×31 images at their intrinsic size with meaningful alt text and a larger tap/focus area. Include one sentence about why a neighbor is interesting; a wall with context is more useful than hundreds of unexplained thumbnails. Make your own original button with a copyable escaped HTML snippet. Save images locally only when permitted; hotlink only when invited. Kerka explicitly permits some button hotlinks, while purgamentum exit explicitly discourages them—there is no universal community license. Add a static alternative or opt-in animated collection; check broken destinations occasionally.

### C07 — Toybox, adoptables, stamps and tiny clubs

**Borrow:** Cedrus's pixel adoptables, PIXELDEW's toyboxes and [NekoDirectory's](https://nekodir.nekoweb.org/) clique catalog. **S; static, optional browser-local discoveries.**

**Recipe:** separate a few meaningful collections: adopted robots, “tools I actually use” badges, gifts from friends, membership stamps and original discoverable stickers. Every adopted item links to its creator and follows its stated rules. A local collection can record discovered stamp IDs in `localStorage`, but label it “on this browser”; it is not a server trophy account. Treat malformed/cleared storage as an empty collection and tolerate storage exceptions. Native details/summary can hide an animated shelf until requested; still alternatives give more control than hiding GIFs only offscreen. Do not imply club membership from merely displaying a badge; follow that club's join process. Do not copy a site's entire pixel collection as your identity.

### C08 — Ring station, web clique and next-door navigation

**Borrow:** [Purdue Hackers' joining instructions](https://github.com/purduehackers/webring#want-to-join), plus Kerka's different ring widgets. **S for links; membership is external.**

**Recipe:** style a small transit sign or “neighbors” footer around three actual homepage anchors: Previous, Purdue Hackers webring, Next. Preserve the published destination URLs and current joining rules. The previous report documents the host/referrer caveats and source-derived path behavior; reuse that rather than inventing a client-side substitute. Make ring navigation visible in initial HTML and leave next/previous without `target` as instructed. A decorative center image needs a text equivalent. Publish and test only when a real site exists, then contact the ring via its stated process. No membership, eligibility or successful production redirects are established here. A clique badge and a ring's previous/next topology are related but different mechanisms.

### C09 — Guestbook as a visitor postcard rack

**Borrow:** [Sadgrl's guestbook](https://sadgrl.atabook.org/) from the original sources; Atabook documents optional pre-publication review, replies and deletion. **M hosted / L custom; ongoing moderation.**

**Recipe:** begin with a clear “Leave a postcard” link to a separately hosted guestbook. Give a prompt such as “What are you making?” without requesting sensitive information. Configure review before display and a way to remove entries. A custom version needs an API that validates bounded text/name, stores `pending` entries and returns only approved entries; render visitor text as text, not HTML. Keep moderation/admin authentication server-side. Links need allowed schemes; never expose submitted emails or IPs. Check the provider's current privacy, export and retention arrangements before relying on it—those were not audited. Atabook lists full custom CSS among supporter features, so do not promise unrestricted theming on the basic service. Nerucom's old 123guestbook link is evidence of service fragility, not a current recommendation.

### C10 — Shoutbox or message terminal

**Borrow:** Jubilife Vibes exposes a Cbox iframe. This proves an embedded destination, not its current moderation behavior. **M–L; remote service and moderation.**

**Recipe:** if fast conversation matters, use a titled, lazy-loaded embed with an “open message board” fallback link. Otherwise a guestbook better fits occasional asynchronous visitors. Custom messages need the same escaping, length bounds, rate limits and moderation as C09; “small text” is not a simpler security problem. An external frame has its own scrolling, privacy, cookies and availability, and cannot generally be restyled from parent CSS. Keep its height usable on touchscreens and avoid auto-refreshing a screen reader's whole transcript. Authoring workflow is moderation and deletion, not editing a Markdown note. A disabled service should leave the rest of the page working.

## Numbers and objects visitors can change

### C11 — Odometer visitor counter or coarse visitor map

**Borrow:** [GoatCounter's visitor-counter documentation](https://www.goatcounter.com/help/visitor-counter). **M; analytics service.**

**Recipe:** wrap a documented counter output in a digit-style visual shell, while retaining a readable whole-number label. GoatCounter documents enabled counters in several formats and caching that can delay visible values. Call the result recorded pageviews or visits according to the actual configured metric, not unique humans. Bots, reloads, blocking and cache behavior affect meaning. Keep a textual “counter unavailable” state instead of zero. An optional map should show only coarse aggregate regions from a provider that supports that output; no map service or geographic accuracy was verified here. Never plot precise visitor coordinates or claim users consented because they loaded a page. A fake JavaScript random number and a `localStorage` tally are not a shared counter.

### C12 — Shared robot boops, watering can or community pet

**Borrow:** [Applause Button's](https://applause-button.com/) aggregate interaction and [tamaNOTchi's](https://tamanotchi.world/) shared growing-pet concept. **M; static frontend plus small backend.**

**Recipe:** one fixed counter row and two API operations: GET aggregate, POST one accepted interaction. Use one atomic `UPDATE ... SET value = value + 1 ... RETURNING value` with a server-bound counter ID, not browser read/modify/write. Map confirmed total to an original robot sprite, flower stage or ASCII mood. Store stage as a deterministic consequence of total unless independent state is needed. Display pending feedback, then the server value; uncertain network failure must not trigger unbounded POST retries. Rate-limit bursts and bound requests server-side; CORS and a browser cooldown do not authenticate users. [D1 prepared statements](https://developers.cloudflare.com/d1/worker-api/prepared-statements/) support the database boundary; [Workers rate limits](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/) are approximate and location-local, so they do not establish one human/one action. Keep reset controls private. Pet-service source/storage was not inspected; the custom schema is a proposal.

### C13 — Fixed-choice poll in a bevelled dialog

**Borrow:** the low-friction shared-action model above; the poll treatment is an original extension, not an observed feature of those sites. **M; backend.**

**Recipe:** ask a playful bounded question, e.g. “Which robot should live here?” Render three labeled radio choices and a submit button. The backend accepts an allowlisted `pollId` and `choiceId`, increments one row atomically and returns counts. Show a normal list/bar chart with counts in text. Decide whether repeat votes are allowed; label an open toy poll informal rather than inventing uniqueness. A local voted flag is UI convenience and can be cleared. Stronger voting rules need real identity/deduplication and more work. Author updates create a new poll ID, preserving old results. Reject unknown choices, huge bodies and unsupported methods; disable only the pending button, preserve focus, and handle server throttling/outage visibly.

### C14 — Community pixel quilt or one-tile guest wall

**Borrow:** pixel exchange/collection culture documented by NekoDirectory and PIXELDEW. The shared mural is our adaptation. **L; database plus abuse handling.**

**Recipe:** start with a tiny grid and a small fixed palette, not arbitrary uploaded images. GET returns tile colors/revision. A POST validates integer row/column bounds, a palette ID and a revision rule; the server owns timestamps. Each accepted write replaces or claims one tile atomically. Choose and disclose overwrite versus permanent-claim semantics. A database unique coordinate key prevents duplicate cells; optimistic concurrency can reject an outdated edit. Provide keyboard row/column/color controls beside any canvas. Throttle bursts and provide admin restore/reset; pixel-only writes can still create abusive imagery. Keep a cached read-only wall during outages. No live mural reference backend was observed, so this is a later project with clearly higher operating work than a boop total.

## Reasons to come back and listen

### C15 — RSS or Atom from the same notes

**Borrow:** Status Cafe's exposed Atom feed and Jubilife Vibes' RSS update. **S–M; generated static XML.**

**Recipe:** render an Atom file during the same build that renders notes/projects. Every entry has a stable absolute ID/URL, real updated timestamp, title/date label and escaped summary/content; the feed has its own identity and updated date. Do not change IDs during redesign or update every entry on every build. Link it visibly with a small orange feed button and expose feed discovery metadata in HTML. [Atom's specification](https://www.rfc-editor.org/info/rfc4287/) defines the format; use an existing generator rather than manual string concatenation when available. Add one entry and check it in a feed reader, including text containing `<` and `&`. No subscriber database, newsletter platform or email delivery is required.

### C16 — Webamp window and a tiny skin shelf

**Borrow:** [Webamp](https://webamp.org/) and the previous REA capture; [Winamp Skin Museum](https://skins.webamp.org/) offers a place to explore compact skin aesthetics. **M; existing library, no backend unless you add one.**

**Recipe:** an explicit Open radio button loads one player instance. Set initial track URLs/metadata/durations and a permitted skin; the [constructor documentation](https://docs.webamp.org/docs/api/webamp-constructor/) describes these options, layout and hotkey controls. Keep one page shell if uninterrupted listening matters. For containment, [initialization docs](https://docs.webamp.org/docs/initialization/) distinguish the body's floating player from `renderInto` on a positioned parent. Use a compact native audio fallback when windows cannot fit on phones. Store volume/selected skin locally only if needed; do not mistake it for cloud sync. Audio and cross-origin skin files need appropriate serving/CORS. Let visitors start playback and handle failure; do not enable global hotkeys over typing fields. The code license does not grant permission to redistribute songs, skins or branding. Keep a credits/playlist page and use owned or permitted tracks. No song was listened to in this research.

### C17 — Cassette deck, CD shelf or personal radio

**Borrow:** Kerka's small playlist player, Grlrot's CD/media interest and the coherent radio setting of [Poolsuite](https://poolsuite.net/) from prior REA evidence. **S–M; native audio or library.**

**Recipe:** three to six permitted tracks with title, artist, duration and source/credit links; a cassette or jewel-case visual surrounds semantic play/pause, previous/next, seek and volume controls. One `<audio>` element owns playback. Track selection changes `src`, resets time and updates metadata; next/previous use wraparound in both directions. Listen to actual media events instead of setting “playing” merely on click, and await/catch the [play promise](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play). A stream is genuinely live only if the source is live; shuffling MP3s is a playlist. [Autoplay rules](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay) require deliberate playback handling. Start without waveform shaders. A music-diary entry can link to an authorized platform when hosting the recording is inappropriate. Author workflow is editing the track list/liner notes, not running a radio scheduler.

### C18 — Little library search and shuffle

**Borrow:** NekoDirectory's search/tag UI and REA-tested Shuffle. **S; static content and browser state.**

**Recipe:** a build-generated small index of your notes, projects and links, with title, tags, summary and URL. Native form/input controls filter this allowlisted local collection; preserve a normal category index without JavaScript. For “surprise me,” choose one existing entry from a fixed list and navigate on user click; never accept arbitrary redirect targets from a query string. Shuffle can reorder cards without changing saved content. Announce the result count politely, keep focused controls stable and handle an empty collection. Authoring a new page should update the index during the normal build, not require a second manual catalog. This recreates discovery behavior, not NekoDirectory's unseen script internals.

### C19 — Mailbox, postcards and a human contact route

**Borrow:** purgamentum exit's mail/Postcrossing interest and explicit site-contact update. **S; link, no database.**

**Recipe:** draw an original pixel mailbox linking to a readable contact page with a public-purpose address and a `mailto:` link. Explain whether project questions, site swaps or corrections are welcome. Offer copyable text because mail-handler setup varies. Do not put a private address in source merely to hide it with an animation. A contact form adds a server, spam protection, private retention and delivery failure states; use it only if email links are insufficient. A “send me a postcard” guestbook is public, while email is a different channel. This contact pattern stays visible even if decorative discovery features fail.

## What REA established technically

| Study and retained receipt | Observation | What the recreation learns; what remains unknown |
|---|---|---|
| [Kerka initial capture](../research_notes/Personal%20portfolio%20reference%20library/evidence/community-kerka.json), `ev_92721b446d86f925df725970a303ada2a229885c6b2107e0feaded6118a6c946` | DOM contains a native audio element, playlist array, control handlers, native details collections and a theme script. | These mechanics can fit in one static page. DOM/script presence does not establish audible playback, every handler's correctness or accessibility. |
| [Kerka theme click](../research_notes/Personal%20portfolio%20reference%20library/evidence/community-kerka-toggle.json), `ev_213cfbf1c21b6ad91283854d10142ff911422d63bc0acfc7a99b104f76100448` | REA clicked `#themeToggle`: the HTML root acquired `class="dark"`; a hashed local-storage `theme` key appeared. No page errors captured. | State moves from a button to a root CSS class plus browser-local preference. Script text names the stored value; captured storage reveals only its digest. A later independent browser visit was not tested. Wrap storage access in error handling for our version. |
| [NekoDirectory initial capture](../research_notes/Personal%20portfolio%20reference%20library/evidence/community-nekodir.json), `ev_76cb1d2e1b0d8c600cc9a624d0770cf6fa7db204f5b40fb6f63a25ccee4cce67` | DOM exposes a local query input, tagged article cards, shuffle control, link collections and a statement that entries are maintained manually. | A richly social directory need not have a live database. Search execution and its exact matching algorithm were not tested. |
| [NekoDirectory Shuffle](../research_notes/Personal%20portfolio%20reference%20library/evidence/community-nekodir-shuffle.json), `ev_5cd82c222d852e4706d44fa51a152e2dcdc4b24a749041abe41bd4ba0fdeeca1` | REA clicked `#shuffleBtn`; first article changed from Love Dove to Menhera Text Clique; DOM digest changed and remained stable at the next step. No page errors captured. | Shuffle visibly reorders a read-only catalog. This does not identify its algorithm, prove randomness quality or establish backend persistence. |

All four captures launched the existing Chromium executable in owned temporary profiles; cleanup reported `terminated-owned-process`. No screenshots were requested. Page loads can cause ordinary service access logs and embedded requests. Read-only DOM/metadata was captured, not credential/header/body collections. Receipt files are explicitly selected extracts, not full canonical Evidence. Earlier Webamp/Poolsuite receipts remain in the [original evidence directory](../research_notes/Web%20playground%20design%20research/evidence/); those were not rerun or relabeled as new studies.

## Choose storage by the meaning of the feature

| Data | Smallest suitable home | Who can change it |
|---|---|---|
| Notes, projects, links, shrine, playlist, changelog | Markdown/JSON and static output | You via normal publishing workflow |
| Theme, volume, discovered stamps | Browser storage with graceful failure | This browser; clearable, not a trusted identity |
| Boops, pet stage, poll counts, mural | External API/database; server validation | Visitors within bounded public operations |
| Guestbook messages | Moderated service/database | Visitors submit; owner approves/removes |
| Visitor count or coarse map | Chosen analytics provider | Defined by the provider's actual metric |

[GitHub Pages serves static content](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages), so browser JavaScript alone cannot safely become a shared database. Never embed privileged server keys. Public writes need bounded inputs, rate limits, atomic mutations, error states and an owner reset/moderation route. Browser cooldowns are courtesy controls, and shared school IPs are not unique people. Service terms, permissions and current quotas need checking when an actual provider is chosen; no cost/free-tier promise is made here.

**Useful combinations:** a notebook + a tiny current-status panel + RSS makes a readable terminal journal; a shrine + toybox + friends shelf makes a pixel scrapbook; projects + a shared robot + a small cassette player makes a robotics workbench. Choose enough to make a place feel inhabited, leaving room for future additions. No website implementation, deployment, service signup, external message, public submission or full accessibility/device audit was performed.
