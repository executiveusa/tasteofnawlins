# Publishing the next Taste of Nawlins kitchen stop

**Single source of truth:** `public/next-stop.json`.

The homepage's burgundy announcement strip and **Follow the Kitchen → Next Kitchen Stop** widget read this same file. A published stop shows its venue, service date, hours, address, and navigation links. There is no map provider API key, website geolocation collection, or customer tracking.

## Before a date or address is confirmed

Keep the file at:

```json
{
  "status": "unannounced",
  "venue": "",
  "address": "",
  "date": "",
  "hours": "",
  "detail": "",
  "timeZone": "America/Los_Angeles"
}
```

The public site will show **Good food. Next stop soon.** and will **not** show directions.

## Announcing a confirmed kitchen stop

1. Confirm the venue's permission, full street address, and service hours with the organizer.
2. Open `public/next-stop.json` in GitHub and select **Edit** (pencil).
3. Change `status` to `scheduled` and fill all required fields:
   - `venue`: exact public venue name.
   - `address`: full mappable destination (street, city, state, ZIP). Double-check the correct entrance and parking location.
   - `date`: local calendar date, written `YYYY-MM-DD`.
   - `hours`: visitor-facing time span and time-zone if needed, such as `11:00 AM – 3:00 PM`.
   - `detail`: optional parking/entrance note; never include personal or private locations.
   - `timeZone`: IANA time zone for the stop, ordinarily `America/Los_Angeles` in the Pacific Northwest.
4. Commit the change and wait for the Netlify/Hostinger deployment to finish.
5. From a phone, confirm that the displayed address opens the **correct destination** in Apple Maps, Google Maps, and Waze. Verify actual driving entrance directions with the host.
6. After the pop-up, set `status` back to `unannounced` or publish a new confirmed stop. The widget also stops advertising a dated stop automatically after the stop's **local calendar day** has passed.

The file is ordinary JSON without an authenticated admin dashboard. Agents or collaborators with GitHub repository access can update it; public visitors cannot change it. **Do not publish real locations in a demonstration or test fixture.**

## Navigation behavior

- Primary **Get directions** action: Android uses an installed maps app through the `geo:` URI (subject to OS handling); iOS uses Apple Maps; other platforms use Google Maps.
- Alternative links are always shown for **Apple Maps**, **Google Maps**, and **Waze** when a confirmed stop is active. Users can choose their preferred navigation app directly.
- Where an app isn't installed, supported HTTPS links use the provider's web version.
- The website never reads the visitor's current GPS position. Directions apps independently handle user location according to the user's own permissions.
- No specific customer route, travel time, or business address is fabricated.

## Verification

`node --test qa/next-stop.test.mjs` validates dates, completeness, and navigation URL safety.

With Playwright installed, serve the site or set `TASTE_BASE_URL` to a deployed preview URL and run `node qa/next-stop-smoke.mjs`. The browser QA intercepts the JSON request with a **synthetic, never-public test stop** to exercise both scheduled and unannounced flows across mobile and desktop. A successful deployment check is not a substitute for inspecting the route behavior on a real phone.

## Existing email contact workflow

The existing form beneath the next-stop widget **opens a prepared email** addressed to the Taste of Nawlins mailbox; it is **not** an automatic subscriber database. That behavior is unchanged. Do not claim that subscribing happens automatically until a genuine backend is connected.
