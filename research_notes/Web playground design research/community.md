# Community features and persistent interactions

Research checked October 18, 2026. Scope: ideas and future implementation recipes only; no live services were configured, messages posted, counters incremented, or webring enrollment attempted. “Observed” below means retrieved page/source contents, not a browser interaction test. “Documented” means a creator's or platform's description. “Proposed” means our own design recommendation, not a claim about another site's implementation.

## Which real sites offer useful community and Web 1.0 patterns?

### Takeaway

The most useful references combine small personal publishing with visible connections to other websites. Start with a notes stream, a button shelf and one deliberately playful shared interaction; a full social system is unnecessary.

### Cited Findings

1. **[Sadgrl's guestbook](https://sadgrl.atabook.org/)** — Observed: name, optional website and private-to-owner email fields, message editor, paginated public entries, and a backlink. The [current homepage](https://sadgrl.online/) explicitly invites visitors to sign it. Good reference for a separate guestbook page rather than a large homepage comment feed. Proposed adaptation: “Sign the lab notebook”; use a hosted guestbook link initially, or moderate custom messages before publication. No message was submitted.

2. **[Status Cafe](https://status.cafe/)** — Observed: short timestamped posts paired with a mood emoji, a shared status stream and Atom subscription link. The [example member profile](https://status.cafe/users/cutsnwires) has a personal feed and older-post navigation. Proposed adaptation: Lucas's “brain buffer”: one sentence, optional emoji and timestamp, with a permanent archive. Store owner-authored entries in Markdown or JSON; no database or public posting form needed. The service's embedding/API route was not verified, so do not depend on an assumed endpoint.

3. **[32-Bit Cafe's link page](https://32bit.cafe/linktous/)** — Observed: a dedicated 88×31 button collection with creator attribution. Proposed adaptation: an original Lucas/Purdue-robotics button plus a small shelf of friends' sites. Use ordinary linked images with meaningful alt text, explicit dimensions, and permission/attribution as appropriate. A copyable HTML snippet is enough; no widget service is required.

4. **[Derek Sivers's /now page](https://sive.rs/now)** — Observed: dated “what I am doing now” sections and a link to `/uses`. The [Now Now Now explanation](https://nownownow.com/about) distinguishes current-life priorities from a chronological blog and notes `/now` is a convention rather than a requirement. Proposed adaptation: “Currently in the lab”: studying, building, listening, reading, and a last-updated date. Keep this separate from the notes archive so a visitor can understand Lucas quickly.

5. **[Applause Button](https://applause-button.com/)** — Documented working demo: a custom element persists claps through a cloud endpoint, supports one or multiple claps and custom colors, and exposes its initial count and a clapped event. Frontend/backend source links are supplied. Proposed adaptation: “Boop the robot” with a shared boop total. Its existing service availability and privacy terms require checking before adoption; reading the page did not test writes. A useful example of the architecture, not a blanket recommendation to add its dependency.

6. **[GoatCounter's counter demo/documentation](https://www.goatcounter.com/help/visitor-counter)** — Documented: public HTML/SVG/PNG/JSON counts, customization, per-path or `TOTAL` totals, and an explicit setting to enable public counts. Responses may be cached up to four hours. Proposed adaptation: a pixel-odometer showing recorded pageviews. This is suitable for a slowly updated retro counter, not instant feedback on an intentional click. Its JSON count is a formatted string, so do not assume a numeric JSON field or use the legacy `count_unique` as a distinct metric.

7. **[Purdue Hackers Webring](https://ring.purduehackers.com/)** — Observed: a live ring directory and member preview links. This is the target community, so reserve visible homepage space for its links rather than hiding membership in an easter egg. Exact instructions and source findings are below.

8. **[Wiby](https://wiby.me/)** — Observed: a compact classic-web search page with a “surprise me” link. Proposed adaptation: a “take me somewhere interesting” button choosing from a curated local array of Lucas's favorite websites or project notes. It can be completely static and keyboard accessible. Do not mistake this proposal for a claim about Wiby's random-selection algorithm.

Additional visual inspiration: [Cameron's World](https://www.cameronsworld.net/) describes itself as a collage drawn from archived GeoCities pages, with attributed music and archived outbound links. Its page includes little themed regions and imagined browser furniture. Borrow the principle of discoverable rooms and hand-made detail; make original assets rather than collecting its graphics wholesale.

### Inferences

Suggested additions, ranked by payoff relative to work (subjective estimates, not measured implementation times):

| Rank | Idea for Lucas | Minimum implementation | Persistence / effort | Why it belongs |
|---|---|---|---|---|
| 1 | Brain buffer / field notes | Dated Markdown entries; homepage shows latest 3–5; archive shows all | Git files / small | Directly supports the requested quick thoughts |
| 2 | Link shelf + own 88×31 button | Ordinary anchors and original image assets; credit creators | Static / small | Makes the website a place in a network |
| 3 | Shared robot boop counter | One button, GET count, POST one increment, server-side DB | Database / medium | More honest and playful than claiming unique visitor totals |
| 4 | `/now` and `/uses` | Small dated pages; tools, current projects, music list | Static / small | Adds personal detail without requiring finished projects |
| 5 | Changelog / “last soldered” log | Reverse chronological list of site changes | Git files / small | Gives visitors a reason to revisit an evolving site |
| 6 | Collectible discovery stamps | Find 3–4 hidden objects; a stamp sheet records them | localStorage / medium | Turns the easter egg into an optional personal scavenger hunt |
| 7 | RSS/Atom for notes | Generate feed from the same entries as the archive; validate XML and stable IDs | Generated static XML / small–medium | Lets people follow without social accounts; Status Cafe provides an actual Atom example |
| 8 | Guestbook | Link to hosted book first; custom alternative has review queue | Hosted service or DB / medium–large | Strong old-web feeling, but text requires ongoing moderation |
| 9 | Tiny opinion poll | Three fixed choices, server validates choice and records votes | Database / medium | “Which robot should I build?”; label as informal and non-unique |
| 10 | Random drawer | Button opens one curated note, link or drawing | Static JS / small | More exploration without another backend |

For project space: begin with one explicit “workbench currently empty / experiments arriving” panel and a real template for later entries: title, photo/ASCII preview, one-line purpose, status, links. Avoid invented projects and a grid of many identical “coming soon” cards. This is an original proposal, inspired by the personal-publishing examples above.

For discovery stamps, localStorage stores only that browser's finds; a shared counter can separately record total discoveries but cannot establish unique people. Never make an easter egg the only route to about/projects or ring navigation.

### Gaps

- No authenticated admin dashboards were inspected; hosted guestbook retention/export/moderation tools need checking before choosing a provider.
- No persistent service writes were performed. Demo documentation establishes intended behavior, not an end-to-end service availability guarantee.
- No live poll service was adopted or verified; poll is an additional proposal using the same API pattern below.
- RSS is a current personal-web practice rather than a requirement for historical Web 1.0 authenticity. Mood widgets and `/now` conventions likewise span eras.

## How can a static site save one shared number safely and simply?

### Takeaway

Keep public content static and add one narrow serverless API only for the shared interaction. Local browser storage is useful for preferences and discoveries, but it is not the global database requested by Lucas.

### Cited Findings

- **GitHub Pages is static hosting** for HTML/CSS/JS, optionally after a build step. Account sites and project sites have different URL conventions. Therefore a public database-writing endpoint must live elsewhere; adding a branch does not itself deploy a second site. [GitHub Pages documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).
- **localStorage is scoped to an origin and survives ordinary browser sessions**; incognito data is cleared at the end of private browsing, and browser policies can deny storage. Proposed uses: theme, volume, visited stamps, and “already booped recently” UI hints. It is user-controlled storage and cannot enforce a trustworthy per-person limit. Use namespaced keys so another version on the same origin does not collide, and tolerate storage exceptions. [MDN localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).
- **Cloudflare D1 supports prepared statements and parameter binding** through its Workers binding API. Bound parameters prevent SQL injection and `.first()` returns a row or null. [D1 prepared statement methods](https://developers.cloudflare.com/d1/worker-api/prepared-statements/). SQLite supports returning values from INSERT/UPDATE/DELETE with `RETURNING`. [SQLite RETURNING](https://www.sqlite.org/lang_returning.html).
- **Worker bindings supply capabilities for D1 and other resources** without embedding account API tokens in the frontend. [Worker bindings](https://developers.cloudflare.com/workers/runtime-apis/bindings/).
- **Cloudflare's rate limiter is approximate and local to a Cloudflare location**, not a strict global accounting system. It supports 10- or 60-second windows. Its docs caution that IPs can group legitimate people behind the same network. [Workers rate limiting](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/).
- **Supabase separates publishable client keys from privileged server-only secret keys**, including legacy anon/service_role equivalents. Privileged keys bypass RLS and must not be shipped or committed. Browser keys identify the app, not a trustworthy individual. [Supabase API keys](https://supabase.com/docs/guides/getting-started/api-keys).
- **Supabase Data API requires grants plus RLS**; policies alone do not cover every requirement such as rate limits. Its Edge Functions provide server-side TypeScript endpoints and can centralize checks before database access. [Securing the Data API](https://supabase.com/docs/guides/api/securing-your-api); [Edge Functions](https://supabase.com/docs/guides/functions).

### Inferences

#### Proposed smallest implementation recipe

1. Give the interaction an honest meaning: “Robot boops since launch,” not “unique visitors.” The number counts accepted writes; automated traffic can inflate it. Pageviews are a different metric; one person can reload, bots can load, and tracking may be blocked.
2. Database table `counters` has primary key `name` and nonnegative integer `value`. Seed one known row, `robot-boops`, at zero.
3. `GET /boops` returns `{count: n}`. `POST /boops` accepts no arbitrary delta and increments the fixed row by exactly one. Reject unsupported methods, excess body sizes, and unexpected parameters. A poll instead accepts an allowlisted choice ID; do not allow client-supplied SQL, table names, URLs or unrestricted counter names.
4. Use a single database mutation such as `UPDATE counters SET value = value + 1 WHERE name = ?1 RETURNING value`, with a bound fixed name. This is a recipe, not tested code. Do not read the value into browser JS and write `old + 1`: concurrent visitors lose increments that way. Return the committed result; handle a missing seed row as a server error.
5. Throttle bursts on the server. A browser cooldown improves UX but can be bypassed. A modest route/global limit plus a per-session hint may suffice for a toy; add stronger challenge/identity checks only if abuse appears. Shared Purdue networks make strict one-vote-per-IP rules unfair. CORS allowlisting is browser hygiene, not authorization against scripts making direct HTTP requests.
6. Show pending state, then the server-confirmed total. On failure retain the last known value with “counter temporarily offline,” or show “unavailable”; never quietly fabricate a zero. An uncertain timeout after commit can cause a duplicate if blindly retried. For a playful approximate boop counter, avoid automatic POST retry; for exactly-once intended votes, add request IDs with a unique DB constraint and transactional deduplication.
7. Keep administrative reset/review endpoints out of public routes. Keep credentials in provider secrets and never in a static JS bundle, public Markdown, or repository history. A public counter should expose only its aggregate count, not request logs.
8. Use an actual button with keyboard activation and visible focus, readable count text, and a polite status announcement. Animations and sound can embellish acceptance but are not the only feedback. Test simultaneous increments, malformed requests, rejected limits, and offline behavior before launching.

#### Storage and backend choices

| Choice | Smallest useful role | Tradeoff and recommendation |
|---|---|---|
| Markdown/JSON tracked in Git | Owner's notes, projects, curated links, changelog | No database needed. Future editing workflow may use the GitHub web editor. A content change triggers publishing when configured. |
| localStorage | Personal UI state and discovered stamps | No account/service setup. Not cross-device or global; clearable and sometimes unavailable. |
| Existing analytics counter | Recorded pageview display | GoatCounter's documented public counter is simplest if analytics is already wanted; count updates can lag. Not a substitute for interactive click writes. |
| GitHub Pages + Worker + D1 | One custom shared count, later fixed-choice poll | Recommended architecture for one toy: static frontend plus two tiny API handlers and one SQL table. Binding avoids frontend DB credentials; own validation and failure handling remain necessary. |
| GitHub Pages + Supabase Edge Function + Postgres | Multiple tables, future moderated guestbook/admin workflow | Sensible if Supabase is already familiar or those features are wanted. More concepts: function permissions, grants, RLS, auth and secrets. Avoid arbitrary anonymous UPDATE grants to the table. |

No price/free-tier claims are made: deployment allowances and account status must be checked at implementation time. A provider outage should affect only the widget, not navigation or notes.

**Moderation choice:** a numeric boop or allowlisted reaction avoids arbitrary public text. A public guestbook permits spam, slurs, phishing and injected markup if implemented badly. For custom text, enforce length and URL rules on the server, store as plain text, escape output, publish only approved entries, provide deletion controls and a retention plan. Avoid collecting email unless there is a concrete purpose. These are proposed implementation requirements; the external guestbook's security was not audited.

### Gaps

- No backend was built, provisioned, load tested or cost estimated. The SQL/API sketches require implementation-time tests against the chosen platform.
- True unique-person counting cannot be claimed from anonymous clicks, localStorage or approximate IP limits. If uniqueness becomes important, define the identity and privacy model first.
- Provider request logs may still contain IP/metadata even when the application stores only a count. Verify account logging defaults and write a short truthful privacy note.

## What exactly does joining the Purdue Hackers ring require?

### Takeaway

The published process is to add visible homepage links, test recognition, then message the Discord webring channel. Enrollment is a later action after a public website exists; this research does not submit anything.

### Cited Findings

- The [README's joining section](https://github.com/purduehackers/webring#want-to-join) requires Purdue Hackers membership. It specifies three homepage-visible links; styling/text may vary, and next/previous must omit `target`. Test next/previous: a not-yet-member error is expected. Missing-origin troubleshooting removes `noreferrer`, then tries `referrerpolicy="origin"`, then `?host=<your-domain>`. Finally message [#webring](https://discord.com/channels/772576325897945119/1319140464812753009) with desired display name and site URL. Lucas attending Purdue does not independently establish club membership; confirm it when actually joining.

```html
<a href="https://ring.purduehackers.com/previous">Previous</a>
<a href="https://ring.purduehackers.com/">Purdue Hackers webring</a>
<a href="https://ring.purduehackers.com/next">Next</a>
```

- The [configuration documentation](https://github.com/purduehackers/webring/blob/master/docs/Configuration.md) permits a full member URL and describes automated HTML link checks. Therefore emit real links in the initial HTML; do not depend on a client-side window-opening script for the required navigation.
- Source observation: [`MemberSpec` keeps a URI](https://github.com/purduehackers/webring/blob/master/src/config.rs); [`member_map_from_config_table`, `get_authority`, and `next_page`/`prev_page`](https://github.com/purduehackers/webring/blob/master/src/webring.rs) identify members by authority/host but redirect to the stored full URI. [`get_origin_from_request`](https://github.com/purduehackers/webring/blob/master/src/routes.rs) gives `?host=` priority over Referer. This is ordinary public source inspection, not evidence of runtime behavior or a REA execution.

### Inferences

- A later version at `https://lflowers01.github.io/playground/` can be submitted as that exact full URL so incoming visits land there, while the identity used in fallback links remains `lflowers01.github.io`. Based on current source, two paths on the same host are not independent ring identities. Coordinate with maintainers if the host is already enrolled.
- Only if needed, fallback navigation URLs would be `https://ring.purduehackers.com/next?host=lflowers01.github.io` and the corresponding `/previous?host=lflowers01.github.io`. Do not put the `/playground/` path into a bare host value.
- A Git branch has no automatic alternate public URL. Decide later between a path-based version deployed alongside the original, separate hosting/domain, or replacing the primary deployment. Do not change Pages' publishing branch merely to research.
- Design the ring navigation as a conspicuous little transit sign or robot control panel; keep descriptive accessible labels even if visible text uses arrows. A hidden easter egg does not meet homepage visibility.

### Gaps

- The published homepage describes members/alumni; README wording includes members/friends at the introduction but membership in joining steps. Treat the stricter joining instructions as operational guidance; maintainers decide eligibility.
- The source was read from current `master`; production deployment parity was not proved. Actual path-host behavior must be tested after deployment and enrollment, without assuming the static analysis is an end-to-end test.
- No Discord access, membership check, maintainer contact or submission was performed. No membership PR is called for by the published joining instructions.
