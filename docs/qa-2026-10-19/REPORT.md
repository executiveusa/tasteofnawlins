# Taste of Nawlins: kitchen-stop release evidence

Date: October 19, 2026. Mode: brownfield. Classification: SELL.
Outcome: visitors can find the next confirmed venue; the owner can prepare an announcement without editing JSON. Commercial value: fewer missed visits and less publishing effort.

## Baseline and boundaries

GitHub main and published Netlify deployment both verified at `b3978bc2c3070ca2e742c40af3268370fb0f498a`. Netlify deploy `6ad542c2cc5940d6990cce1c`, ready, published October 18 at 22:06:06 UTC. Public location remains unannounced. Source wordmark and `public/next-stop.json` are unchanged. No real or fictional stop has been published. Forms remain mailto drafts to glen@tasteofnawlins.food. No DNS, email, hosting, database or Future Champs settings changed.

## Specification and changes

- Revalidate open tabs every minute and on focus/visibility so yesterday's stop disappears even offline. Refresh announced/cancelled stops from the same public JSON source. Calendar-day expiry remains the contract; closing hours are display text.
- Add `/prepare-stop`, a browser-only preparation form with the existing card preview, required details, explicit confirmation and JSON download. Editing resets confirmation. Removal produces an unannounced file with no address. No save, upload, authentication or publishing capability is granted to visitors. Only an authorized publisher can release the file through the existing reviewed workflow.
- Extend location browser tests to six widths, add owner workflow/expiry regression checks and enable PR CI.
- Correct historical Hostinger handoff references without initiating a migration.

## Executed proof

- `node --test qa/next-stop.test.mjs`: 4/4 passed.
- `npm run build`: passed, Vite 6.4.4.
- `node qa/next-stop-smoke.mjs`: passed at 320, 375, 390, 430, 768 and 1280 pixels. Synthetic data is injected only into browser requests; the public JSON stays unannounced. Checks include strip/card synchronization, iPhone/Android/desktop URL selection, three explicit provider links, encoded destination, >=44px links, no horizontal overflow and visible reveal.
- `node qa/owner-stop-smoke.mjs`: passed. Open-tab midnight expiry while offline, expired/incomplete/pending fallback, cancellation refresh, six-width preparation/download/removal, confirmation reset, >=44px controls and no overflow.
- `qa/mobile-smoke.mjs`: executed at seven widths through 1920 retina. Layout, route, six-item menu, full-screen menu, scrapbook keyboard, hero resolution and reduced-motion checks produced no assertion failures. The overall suite FAILED on external-resource `ERR_EMPTY_RESPONSE` errors from this sandbox. This is not a full mobile acceptance pass; run remote CI and review external media separately.
- Screenshots in this directory: scheduled 320px and desktop, pending 390px, owner preparation 390px. These are local Chromium renders using fallback fonts where external fonts could not load, not physical-device captures.

## Review findings and limits

- Live page observed through the shared browser: pending copy and no directions. Actual map app launch, correct driving entrance, iOS Safari and Android Chrome physical-device behavior remain unverified. User-agent simulation checks link selection only.
- No customer geolocation API, customer account or mandatory app download was added. The destination providers may independently request user location.
- Gallery has separate pre-existing defects: Google Drive embed is incorrectly sent to a video element, several clips have no posters, external URLs may expire. Do not claim gallery playback or consent records verified.
- Approved Instagram PNG and vintage source PNG were not present in this repo or found by filename searches. Pixel comparison/circular crop acceptance for that specific PNG remains blocked. No new logo was generated. The public Instagram page was observed in the shared browser at https://www.instagram.com/tasteofnawlins.food/: handle tasteofnawlins.food, display name Glen Singleton, website www.tasteofnawlins.food. These details match the business handoff; account control was not tested.
- PR #9 removes the rejected AI tabletop image. It was rebased onto current main without conflict and its QA now rejects the old image instead of requiring it. Build and focused menu acceptance pass at six widths: six dishes, no image/video/background image, working reading control, no overflow. It remains separate/unmerged pending hosted visual acceptance.
- No independent reviewer approval or physical-phone acceptance is implied by these author-run tests.

## Release and rollback

Keep this branch unmerged until the PR's exact-head checks and preview acceptance pass. A build or deploy-ready response alone is insufficient. If approved and released, rollback by restoring the previously verified Netlify deploy `6ad542c2cc5940d6990cce1c` or reverting this bounded PR. For a bad announcement, publish an unannounced JSON through the same approved workflow. No database migration to reverse.

## Hosted preview and brand checks

Location PR #13: https://github.com/executiveusa/tasteofnawlins/pull/13 . Initial source `39200495942bf0b5c3a3577f8a1e42015b9564ee`; Netlify preview deploy `6ad646cdd385bfaa911dabd6`, ready at the same commit. URL: https://deploy-preview-13--tasteofnawlins.netlify.app/prepare-stop . Shared-browser inspection confirms the page, intact logo, initial pending card, labeled owner controls and permission boundary render. The primary release remains DRAFT; hosted QA is queued, not passed.

Approved SVG SHA-256 is unchanged from main: `7b7068782de354276cf31ea09b48671edd46a714d95c7c3c253fab0427028641`. Browser canvas check at 1024×768: all four corners alpha=0; 493637 fully transparent pixels and 292795 painted/partially painted pixels. Size/circle comparison at 32/64/110/320px is included as `wordmark-size-check.webp`. The subtitle is too small at 32px, and circular clipping cuts the outer flourish. This is a QA render of the WEBSITE SVG only, not acceptance of the missing Instagram PNG. No padding or lettering was changed.
