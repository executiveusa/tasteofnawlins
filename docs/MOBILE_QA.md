# Taste of Nawlins — release QA
This is a **read-only browser test** of the existing public site. It does not submit forms, create leads, edit copy, change navigation, or deploy production.

## Running locally
```sh
npm ci
npm install --no-save playwright
npx playwright install chromium
TASTE_BASE_URL=https://tasteofnawlins.netlify.app node qa/mobile-release.mjs
```
GitHub Actions runs the same test on pull requests, manual dispatch, and Mondays. Screenshots and report.json are retained as workflow artifacts even if the test fails. A passing emulated browser test is **not** proof of real physical mobile device behavior.

## Real Android Appium follow-up (not yet connected)
Prerequisites: owner-authorized Android phone or authorized Android cloud device, ADB connectivity, Appium 2 and UiAutomator2 driver. Connect only after explicit device approval. Use Chrome at the published preview URL; swipe through hero/menu/gallery, tap menu and gallery controls, rotate, show keyboard in contact form, inspect failures, and preserve screen recordings. Never send real forms without approval.

## Release gate
Do not merge polish changes automatically. Evaluate browser console, images, external destinations, overflow, reduced-motion content, tap targets, gallery dialog, and real device evidence where available. Separate observed test failures from items needing verification. Preserve all approved brand copy and social links.
