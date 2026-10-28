# JNR Store

A buildless, Android-first app discovery web app by JNR Corporations. HTML, CSS and vanilla ES modules; no runtime dependencies, account or backend.

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

Set `downloadUrl` to a real HTTPS URL for your APK, release page or distribution endpoint. Unsupported schemes and missing links display an unavailable dialog. `alternateDownloads: [{label:'Mirror',url:'https://…'}]` supplies alternatives. The confirmation names the destination; links open explicitly in a new tab with noopener/noreferrer. The app remembers link clicks, never claims download completion or APK installation. Serve APKs from your own correctly configured host; no hosting for APKs is included.

## Branding

`js/config.js` controls store/brand names, logo, accent, default category, featured collection, footer, socialLinks (`label`, `url`), supportEmail and description. Navigation labels use the same config. Update static index metadata, manifest and generated icons when rebranding; these must exist before JavaScript runs. Footer and logo are generated from config.

## Deploy

Upload this entire directory to Cloudflare Pages, GitHub Pages or another static host. No build command. For Vercel use the Other preset and serve this directory. Preserve relative file paths. Hash routing supports static hosting and subdirectories without rewrite rules. If deploying within a subdirectory, use that directory as the document root path; relative assets, manifest and service worker adapt automatically.

Set the production origin in config, replace `example.invalid` in sitemap.xml, add a Sitemap directive in robots.txt and add canonical and og:url tags with your actual URL in index.html. No production domain, email or social account is invented. Hash app routes are not independently indexed; server-rendered route pages would be needed for per-app SEO.

## PWA and updates

Manifest includes 192/512 PNG icons and standalone mode. Test on HTTPS or localhost: DevTools → Application → Manifest/Service Workers. In Android Chrome, use Install app/Add to home screen when offered; browser eligibility varies. After a first online visit and cache install, switch offline and reload to test the shell and local catalog. External downloads cannot work offline.

`sw.js` precaches a finite allowlist of the shell and bundled lightweight SVG art. Navigation and shell assets use network first with cached fallback. It never caches APKs, arbitrary downloads or external images. Change CACHE (`jnr-shell-v1` → v2) on each release and update SHELL if adding modules/assets. Old caches are removed on activation. A waiting worker prompts Update now; user action activates it and reloads. Network first avoids indefinitely stale data on online visits. Browser storage may be evicted.

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
