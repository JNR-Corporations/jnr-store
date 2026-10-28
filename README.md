# JNR Store

Version 2: a white-and-rose, Android-first app discovery web app by JNR Corporations. HTML, CSS and vanilla ES modules; no runtime dependencies, account or backend.

## Run locally

Use Python 3 from this folder:

```sh
python3 -m http.server 8080
```

Open http://localhost:8080. ES modules need HTTP; do not double-click index.html. PWA requires HTTPS or localhost.

## Content editing

Edit `js/data/apps.js`. Add one record to the exported array. Required fields are unique lowercase `id` (letters, digits and hyphens), `name`, `category`, and `type` (`app` or `game`). Optional fields are documented in the shipped complete records. Missing values are hidden. Invalid and duplicate records are skipped with a console warning.

Change `order` to reorder cards; use `editorPick`, `featured`, `trending` and `isNew` to curate. Collections in `js/data/collections.js` accept a `filter` or an ordered `appIds` array and a `layout`: compact, featured or list. The initial featured collection comes from config. All home sections are data driven. Recommended is an editorial collection, not behavioral profiling. Popular and trending are sample editorial placements, not measured rankings.

`icon` and `screenshots` accept local paths or HTTPS image URLs. Place assets under `assets/apps/your-id/`. `banner` accepts `title`, `subtitle`, `image`, `accent`; `featured: true` selects the home hero. Screenshots are illustrative local SVGs. No network fonts, scripts or tracking.

Add categories in `js/data/categories.js`; category name matches app `category` or `categories`. Additional tags participate in search. Empty categories remain browsable. Rating must be a number between 0 and 5. Only use ratings, reviewCount and downloadsLabel you can substantiate. All included records are fictional samples with no ratings or real downloads. Replace sample data and set `sample: false` for your own releases. Badges can be provided per record.

## Downloads

`downloadUrl` now accepts HTTPS publisher links or local paths such as `downloads/my-app.apk`. Local paths resolve from the store directory, never the hash route. Put the actual APK at that location; matching filename case matters on Linux hosts. Root-relative paths (`/downloads/my-app.apk`) resolve at the domain root, so prefer `downloads/my-app.apk` for subdirectory hosting. `downloadFileName` overrides the saved filename; server Content-Disposition and APK content types are also handled. HTTPS signed query strings are preserved. Unsupported schemes, credentials in URLs and app hash routes are rejected.

The Get button opens a pink download sheet with actual byte progress, an animated orbit, cancel, HTTP error diagnostics and a browser Save request after transfer. No simulated percentage or installation claims. Direct transfer requires same-origin access or publisher CORS permission; for external hosts that block CORS, use Open original source. HTML landing pages are identified and opened as pages rather than saved as APKs. The app does not rewrite Google Drive, GitHub or other publisher URLs. Expired/deleted/private files and incorrect server paths must be corrected at the source. A frontend cannot repair a remote 404.

To protect mobile memory, files over 96 MiB use the original URL and browser download manager. APKs are never cached by the service worker. `alternateDownloads: [{label:'Mirror',url:'https://…'}]` adds source choices. Recent download history records save requests/source link clicks, not verified disk saves or installs. The shipped sample records still have no real APKs attached.

## Branding

`js/config.js` controls store/brand names, logo, accent, default category, featured collection, footer, socialLinks (`label`, `url`), supportEmail and description. Navigation labels use the same config. Update static index metadata, manifest and generated icons when rebranding; these must exist before JavaScript runs. Footer and logo are generated from config.

## Deploy

Upload this entire directory to Cloudflare Pages, GitHub Pages or another static host. For versioned updates, run the lightweight release command documented below. For Vercel use the Other preset and serve this directory. Preserve relative file paths. Hash routing supports static hosting and subdirectories without rewrite rules. If deploying within a subdirectory, use that directory as the document root path; relative assets, manifest and service worker adapt automatically.

Set the production origin in config, replace `example.invalid` in sitemap.xml, add a Sitemap directive in robots.txt and add canonical and og:url tags with your actual URL in index.html. No production domain, email or social account is invented. Hash app routes are not independently indexed; server-rendered route pages would be needed for per-app SEO.

## PWA and updates — version 2

Before deploying a new revision run:

```sh
python3 tools/release.py
# or: npm run release
```

This uses Python's standard library, with no package installation. It computes a content hash, updates every ES-module import URL, CSS/boot URLs, release.json and the service-worker cache version automatically. You never need to manually edit a cache version. The script is idempotent for unchanged content. Run it after adding/editing apps or replacing assets, then deploy the whole folder together. In Cloudflare Pages set the build command to `python3 tools/release.py`; for a ZIP/manual deployment run it locally before upload. GitHub Pages supports the generated files directly. Vercel headers and a Cloudflare `_headers` file request browser revalidation; other hosts should send `Cache-Control: no-cache` for HTML, JS, CSS and `no-store` for sw.js/release.json.

Online shell fetches use `cache: no-store`, bypassing browser HTTP caches; offline shell copies remain available. A new worker activates automatically and removes only old JNR shell caches, preserving bookmarks/history. Startup, online and tab-resume checks fetch release.json fresh; an open, visible page also checks every 60 seconds. A changed release reloads automatically, deferred while a dialog/download is open. Service-worker updates bypass HTTP cache and are explicitly checked on startup and resume. First migration from version 1 happens on the next online opening/reload. Users should not need to clear site storage. An upstream CDN forcibly serving old responses must be fixed in that host's caching configuration.

Manifest includes 192/512 PNG icons and standalone mode. Installability requires HTTPS or localhost. Test in Android Chrome with Install app/Add to home screen and DevTools Application panel. Test offline after a successful online cache install. Only a finite app-shell allowlist is cached. External URLs, arbitrary files and APK navigation are never intercepted; missing APKs retain real 404 responses, not the app HTML. PWA installation, actual Android save dialogs and live worker migration still need secure-origin/device validation; automated lifecycle tests use mocks.

## Architecture

- `js/data`: records, navigation, categories, curated collections
- `js/utils`: safe DOM construction, validation and versioned local storage fallback
- `js/components`: reusable cards, icons, search, header/navigation, dialogs
- `js/pages`: home, details and library; Apps/Games/Category reuse the search browser
- `js/services`: validated catalog/search and explicit download handling
- `js/router.js`: hash routes with browser history
- `css`: design tokens plus mobile-first component and responsive styles

All app text uses text nodes; descriptions never enter innerHTML. The source catalog is a trusted editorial file. Do not permit unreviewed JavaScript uploads as catalog updates.

## Accessibility and local privacy

Semantic headings, native dialogs with Escape/focus behavior, labeled search/filters, visible focus, reduced motion, safe-area navigation and keyboard access are included. Search supports Enter to remember a query, Arrow Down to a suggestion and Escape to dismiss. Library preferences stay on this device with a versioned key and in-memory fallback when storage is blocked. Clear local data in Library removes bookmarks and history.

## Validation and limits

Run `npm test` with Node.js 20+ for automated checks (no packages to install). See `TEST-REPORT.md` for checks performed. Browser installability, actual APK downloads, slow-device performance and platform-specific hosting require deployment testing. No account sync, backend reviews, malware verification, real download statistics or automatic installation. No verified publisher badges. Catalog content is sample data and all downloads start unavailable.
