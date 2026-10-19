import { chromium } from 'playwright'
import fs from 'node:fs/promises'

const base = (process.env.TASTE_BASE_URL || 'http://127.0.0.1:4173').replace(/\/$/, '')
const example = {
  status: 'scheduled',
  venue: 'TEST VENUE — NOT A PUBLIC EVENT',
  address: '123 Example Street, Seattle, WA 98101',
  date: '2099-08-20',
  hours: '11:00 AM – 3:00 PM',
  detail: 'Synthetic QA location only',
  timeZone: 'America/Los_Angeles',
}
const viewports = [
  { name: '320-android', width: 320, height: 800, userAgent: 'Mozilla/5.0 (Linux; Android 14; Mobile)' },
  { name: '390-ios', width: 390, height: 844, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)' },
  { name: '768', width: 768, height: 1024, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X)' },
  { name: '1280', width: 1280, height: 800, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X)' },
]
const browser = await chromium.launch({ headless: true })
const errors = []
await fs.mkdir('qa-artifacts', { recursive: true })

for (const viewport of viewports) {
  const page = await browser.newPage({
    viewport: { width: viewport.width, height: viewport.height },
    userAgent: viewport.userAgent,
    reducedMotion: 'reduce',
  })
  page.on('pageerror', (error) => errors.push(`${viewport.name}: ${error.message}`))
  await page.route('**/next-stop.json', (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(example),
  }))
  await page.goto(base, { waitUntil: 'networkidle' })
  await page.locator('.next-stop-card-scheduled').waitFor({ timeout: 20000 })
  if (!(await page.locator('#next-stop-title').innerText()).includes('TEST VENUE')) errors.push(`${viewport.name}: venue missing`)
  if (!(await page.locator('.next-stop-address').innerText()).includes(example.address)) errors.push(`${viewport.name}: address missing`)
  if (!(await page.locator('.next-drop').innerText()).includes('TEST VENUE')) errors.push(`${viewport.name}: hero strip did not sync`)
  const apps = await page.locator('.next-stop-alternatives a').all()
  if (apps.length !== 3) errors.push(`${viewport.name}: expected 3 mapping provider links`)
  const apple = await page.locator('.next-stop-alternatives a').nth(0).getAttribute('href')
  const google = await page.locator('.next-stop-alternatives a').nth(1).getAttribute('href')
  const waze = await page.locator('.next-stop-alternatives a').nth(2).getAttribute('href')
  if (!apple.startsWith('https://maps.apple.com/?daddr=')) errors.push(`${viewport.name}: Apple URL malformed`)
  if (!google.startsWith('https://www.google.com/maps/dir/?api=1&destination=')) errors.push(`${viewport.name}: Google URL malformed`)
  if (!waze.startsWith('https://waze.com/ul?q=') || !waze.includes('navigate=yes')) errors.push(`${viewport.name}: Waze URL malformed`)
  const primary = await page.locator('.next-stop-primary').getAttribute('href')
  if (viewport.name.includes('android') && !primary.startsWith('geo:')) errors.push(`${viewport.name}: Android native map intent missing`)
  if (viewport.name.includes('ios') && primary !== apple) errors.push(`${viewport.name}: iOS map intent missing`)
  const metrics = await page.evaluate(() => ({
    width: innerWidth,
    docWidth: document.documentElement.scrollWidth,
    bodyWidth: document.body.scrollWidth,
  }))
  if (metrics.docWidth > metrics.width || metrics.bodyWidth > metrics.width) errors.push(`${viewport.name}: horizontal overflow`)
  for (const link of await page.locator('.next-stop-actions a').all()) {
    const box = await link.boundingBox()
    if (box && (box.height < 44 || box.width < 44)) errors.push(`${viewport.name}: directions link below 44px (${Math.round(box.width)}x${Math.round(box.height)})`)
  }
  await page.locator('.follow-heading').scrollIntoViewIfNeeded()
  await page.locator('.follow-heading.is-visible').waitFor({ timeout: 20000 })
  await page.locator('.follow-content').scrollIntoViewIfNeeded()
  await page.locator('.follow-content.is-visible').waitFor({ timeout: 20000 })
  await page.waitForTimeout(700)
  const visibleOpacity = await page.locator('.follow-content').evaluate(
    (element) => Number(getComputedStyle(element).opacity),
  )
  if (visibleOpacity < .99) errors.push(`${viewport.name}: follow widget did not visually reveal`)
  await page.screenshot({ path: `qa-artifacts/next-stop-${viewport.name}.png`, fullPage: viewport.width <= 768 })
  await page.close()
}

const pending = await browser.newPage({ viewport: { width: 390, height: 844 } })
await pending.route('**/next-stop.json', (route) => route.fulfill({
  status: 200,
  contentType: 'application/json',
  body: JSON.stringify({ status: 'unannounced' }),
}))
await pending.goto(base, { waitUntil: 'networkidle' })
if (!(await pending.locator('.next-stop-card-pending').count())) errors.push('Unannounced state did not render')
if (await pending.locator('.next-stop-actions a[href*="maps"], .next-stop-actions a[href*="waze"], .next-stop-actions a[href^="geo:"]').count()) errors.push('Unannounced state exposed a navigation link')
await pending.close()
await browser.close()
if (errors.length) {
  console.error('NEXT-STOP QA FAILED:\n' + errors.join('\n'))
  process.exit(1)
}
console.log('Next-stop QA passed: upcoming stop, Android/iOS/desktop links, 44px targets, responsive overflow, expired/unannounced fallback.')
