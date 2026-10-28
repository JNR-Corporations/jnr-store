# Version 2 verification — 28 October 2026

## Automated checks actually performed

`npm test` passes four suites: catalog/search/sorting/assets/storage; service-worker lifecycle; download URL/filename validation; release generation. Syntax checks passed for application modules and boot.js.

- Relative APK paths at a root or subdirectory resolve correctly; HTTPS signed query strings stay intact; unsafe URLs rejected.
- Server filenames, UTF-8 filenames, APK extensions and HTML response detection covered.
- Mocked worker requests always use no-store; old JNR caches are removed without touching other caches; new workers activate; offline shell/module fallback works with version query strings. APK/unknown-page navigation is not intercepted. Real HTTP 404 responses are preserved.
- Release integration test copies the project into a temporary directory, runs two unchanged releases (same hash), edits an app name, rebuilds and confirms the entry, import graph, HTML URLs and SW version all change together.

## Browser checks actually performed

- White-and-pink desktop design inspected. Android-width iframe layouts inspected at 320px and 390px. Main content scrollWidth matched visible width at both sizes.
- New list/grid toggle, PDF search and download-link availability filter exercised.
- Internal QA used a clearly labeled text fixture (not a fake APK). Relative-file transfer reached File received / Save request sent and produced a browser download event.
- Missing file displayed a specific HTTP 404 message within the download sheet without routing to a catalog not-found page.
- HTML source link was recognized as a webpage and offered the unchanged source address.
- Application-origin browser error logs were empty in the inspected sample; the intentional missing-file HTTP request is expected.
- Version 1 library storage remains unchanged; existing catalog/storage tests passed again.

## Remaining limits

Real Android hardware performance, native APK installation, CORS behavior of the user's actual provider and secure-origin worker migration were not verified in the HTTP preview. The user's failing publisher URL was not present in this checkout, so its host-side 404 is not diagnosed. Sample records still have no production download URLs. No Kotlin/native performance claim is made. Download animation uses actual transfer state; final filesystem save/installation is not observable by this app.

Internal QA pages and fixtures were removed from the deliverable.
