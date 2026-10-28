# Verification — 28 October 2026

## Passed automated checks

Run `npm test` (no install required; Node.js 20+). Catalog tests cover 18 unique records, case-insensitive names/developers/tags, multiword queries, category/type filters, name/added/updated sorting, curated and empty rating collections, invalid/missing IDs, minimal data, duplicate rejection, rating bounds, HTTPS URL validation, local asset existence, module imports, manifest icons, SW allowlist, persistent storage reload and blocked-storage fallback. All JS files also passed Node syntax checks.

Service-worker lifecycle tests use a mock environment: shell precache, version cleanup, user-triggered activation, offline navigation fallback and exclusion of external URLs/APKs passed. These are logic checks, not a browser installability certification.

## Passed browser checks

- Desktop catalog visually inspected; hero, icons, featured carousel and navigation render.
- Details opened for Bloom Focus with correct app information.
- Saving Bloom Focus persisted across a page reload and appeared in Library.
- Missing-download dialog clearly states sample app with no real download.
- Search `pDf` returned JNR PDFs; Photography filter returned Frame Studio and Prism Camera.
- Games returned four games. Browser Back restored the filtered search.
- Mobile layouts visually inspected in 320px, 390px and 600px iframe viewports; main content scrollWidth matched rendered width at 320/390px, with no horizontal content overflow.
- Mobile Games navigation and zero-result search were exercised.
- Invalid app route showed a friendly not-found state.
- Browser logs inspected: observed errors were from the browser extension, not JNR Store application source.

## Not verified

Real Android hardware, standalone PWA installation, real browser offline/service-worker update lifecycle, actual APK downloads, external publisher hosting, screen-reader audit and low-end-device performance. Preview used an HTTP test origin; secure-context installation must be tested on HTTPS or localhost. Shipped records have no real download URLs or ratings.
