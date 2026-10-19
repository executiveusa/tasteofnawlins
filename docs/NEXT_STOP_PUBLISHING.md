# Publishing the next Taste of Nawlins kitchen stop

**Single source of truth:** `public/next-stop.json`.

The homepage's burgundy announcement strip and **Find the Kitchen → Pop-up location & directions** widget read this same file. A published stop shows its venue, service date, hours, address, and navigation links. There is no map provider API key, website geolocation collection, or customer tracking.

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

The public site will show **Next location not announced** and will **not** show directions.

## Prepare without editing code

Open `/prepare-stop` on your website (available after this release).

1. Enter the confirmed venue, full public address, service date and hours.
2. Check the existing card preview and each map destination.
3. Confirm the details and download the announcement file.
4. Give that file to your authorized website publisher or agent. Ask for a preview before publishing.
5. Approve only the reviewed announcement, then check the live website.

To remove an announcement, choose **No confirmed stop / remove announcement** and prepare that file instead.

This is a preparation page, not an admin login or publishing backend. Entries stay in the current browser page until downloaded; reloading discards them. Anyone can prepare a file, but only authorized repository/hosting collaborators can publish it. No credentials are requested or stored. The public website remains unchanged until a publisher releases the approved update.

## Publisher instructions for a confirmed kitchen stop

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

## Open-tab expiry and changes

The homepage checks the announcement every minute and when a tab is focused or made visible. A stop expires after its local calendar day, including pages left open overnight. Hours are display text: this does not promise expiry exactly at closing time. A failed refresh falls back to the pending state. Browser background throttling can delay timers; returning to the tab triggers an immediate recheck.

Before releasing, run `node qa/owner-stop-smoke.mjs` as well as the existing next-stop checks. It covers offline expiry across midnight, cancellation refresh, preparation/download, removal, renewed confirmation after edits, six widths and 44px controls.
