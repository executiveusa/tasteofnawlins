import { chromium } from 'playwright'
import fs from 'node:fs/promises'

const base = process.env.TASTE_BASE_URL || 'http://127.0.0.1:4173'
const viewports = [
  { name: '320', width: 320, height: 800, dpr: 2 },
  { name: '375', width: 375, height: 812, dpr: 2 },
  { name: '390', width: 390, height: 844, dpr: 2 },
  { name: '430', width: 430, height: 932, dpr: 2 },
  { name: '768', width: 768, height: 1024, dpr: 1 },
  { name: '1280', width: 1280, height: 800, dpr: 1 },
  { name: '1920-retina', width: 1920, height: 1080, dpr: 2 },
]

const browser = await chromium.launch({ headless: true })
const failures = []
await fs.mkdir('qa-artifacts', { recursive: true })

for (const vp of viewports) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: vp.dpr, reducedMotion: 'no-preference' })
  const errors = []
  page.on('console', msg => { if (msg.type() === 'error') errors.push(`console: ${msg.text()}`) })
  page.on('pageerror', err => errors.push(`pageerror: ${err.message}`))
  page.on('requestfailed', request => { if (request.url().includes('/images/')) errors.push(`image request: ${request.url()} ${request.failure()?.errorText}`) })
  await page.goto(base, { waitUntil: 'networkidle' })

  const required = ['#top', '#menu', '.field-notes', '#boxing', '#catering', '#follow', '.editorial-footer']
  for (const selector of required) {
    if (!(await page.locator(selector).count())) failures.push(`${vp.name}: missing ${selector}`)
  }
  if (await page.locator('.menu-row').count() !== 6) failures.push(`${vp.name}: expected 6 menu rows`)
  if (await page.locator('.menu-index').count() !== 0) failures.push(`${vp.name}: unwanted numbered menu labels`)
  if (await page.locator('.guest-gallery .guest-media').count() !== 4) failures.push(`${vp.name}: expected 4 gallery entries`)
  if (!(await page.locator('a[download][href="/taste-of-nawlins-menu.html"]').count())) failures.push(`${vp.name}: download menu link missing`)
  const savedMenu = await page.request.get((base.endsWith('/') ? base.slice(0,-1) : base) + '/taste-of-nawlins-menu.html')
  const savedMenuHtml = await savedMenu.text()
  if (!savedMenu.ok() || !savedMenuHtml.includes('Café du Monde’s Original Chicory Coffee')) failures.push(`${vp.name}: offline HTML menu inaccessible or missing coffee`)
  if (!savedMenuHtml.includes('Chicory Coffee &amp; Beignets')) failures.push(`${vp.name}: signature pairing name missing from HTML menu`)
  if (['<img', '<video'].some(token => savedMenuHtml.toLowerCase().includes(token))) failures.push(`${vp.name}: menu content unexpectedly contains food imagery`)
  if (!savedMenuHtml.includes('data:image/webp;base64,')) failures.push(`${vp.name}: missing self-contained café edge image`)
  if (!savedMenuHtml.includes('background-image: none')) failures.push(`${vp.name}: mobile edge atmosphere not disabled`)
  if (!savedMenuHtml.includes('id="toggle-reading"')) failures.push(`${vp.name}: missing full-screen reading control`)
  if (!savedMenuHtml.includes('href="/taste-of-nawlins-menu.html" download=')) failures.push(`${vp.name}: missing HTML download action`)
  if (!savedMenuHtml.includes('prefers-reduced-motion')) failures.push(`${vp.name}: text menu missing reduced-motion treatment`)
  await page.goto((base.endsWith('/') ? base.slice(0, -1) : base) + '/taste-of-nawlins-menu.html', { waitUntil: 'networkidle' })
  if (await page.locator('.dish').count() !== 6) failures.push(`${vp.name}: expected six dishes on text-only menu`)
  const menuMetrics = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth }))
  if (menuMetrics.scrollWidth > menuMetrics.width) failures.push(`${vp.name}: full-page menu horizontal overflow (${menuMetrics.scrollWidth} > ${menuMetrics.width})`)
  await page.locator('#toggle-reading').click()
  if (!(await page.locator('body.reading-mode').count())) failures.push(`${vp.name}: full-screen reading control did not activate`)
  await page.screenshot({ path: `qa-artifacts/menu-${vp.name}.png`, fullPage: vp.width <= 768 })
  await page.goto(base, { waitUntil: 'networkidle' })
  if (await page.locator('.story-frame').count() !== 4) failures.push(`${vp.name}: expected 4 story frames`)
  if (!(await page.locator('.hero h1').isVisible())) failures.push(`${vp.name}: hero not visible`)

  if (!(await page.locator('a[href="/coffee-and-beignets"]').count())) failures.push(`${vp.name}: signature link missing`)
  const signatureResponse = await page.goto((base.endsWith('/') ? base.slice(0, -1) : base) + '/coffee-and-beignets', { waitUntil: 'networkidle' })
  if (signatureResponse?.status() >= 400) failures.push(`${vp.name}: signature page HTTP ${signatureResponse.status()}`)
  if (!(await page.locator('#signature-title').count())) failures.push(`${vp.name}: signature page content missing`)
  if (await page.locator('.signature-questions details').count() !== 7) failures.push(`${vp.name}: expected 7 FAQs`)
  if (!(await page.locator('a[href="https://futurechampsgym.com/"]').count())) failures.push(`${vp.name}: Future Champs doorway missing`)
  // The scrapbook is a real routed page with image viewer, keyboard navigation and video-ready filter.
  if (!(await page.locator('a[href="/gallery"]').count())) failures.push(`${vp.name}: scrapbook link missing`)
  const galleryResponse = await page.goto((base.endsWith('/') ? base.slice(0, -1) : base) + '/gallery', { waitUntil: 'networkidle' })
  if (galleryResponse?.status() >= 400) failures.push(`${vp.name}: scrapbook page HTTP ${galleryResponse.status()}`)
  if (!(await page.locator('#scrapbook-title').count())) failures.push(`${vp.name}: scrapbook heading missing`)
  if (await page.locator('.scrapbook-print').count() !== 4) failures.push(`${vp.name}: expected four real scrapbook photos`)
  const albumOverflow = await page.evaluate(() => ({ viewport: innerWidth, scrollWidth: document.documentElement.scrollWidth }))
  if (albumOverflow.scrollWidth > albumOverflow.viewport) failures.push(`${vp.name}: scrapbook horizontal overflow (${albumOverflow.scrollWidth} > ${albumOverflow.viewport})`)
  await page.locator('.scrapbook-photo-button').first().click()
  if (!(await page.locator('.scrapbook-viewer[role="dialog"]').count())) failures.push(`${vp.name}: scrapbook viewer did not open`)
  await page.keyboard.press('ArrowRight')
  if (!(await page.locator('.scrapbook-viewer-top').innerText()).includes('2 / 4')) failures.push(`${vp.name}: scrapbook keyboard navigation did not advance`)
  await page.keyboard.press('Escape')
  if (await page.locator('.scrapbook-viewer').count()) failures.push(`${vp.name}: Escape did not close scrapbook viewer`)
  await page.getByRole('button', { name: 'Film clips' }).click()
  if (!(await page.locator('.scrapbook-empty').count())) failures.push(`${vp.name}: video empty state missing before approved clip uploads`)
  await page.screenshot({ path: `qa-artifacts/scrapbook-${vp.name}.png`, fullPage: vp.width <= 768 })
  await page.goto(base, { waitUntil: 'networkidle' })
  const photos = page.locator('.hero-image img, .story-gallery img')
  if (await photos.count() !== 5) failures.push(`${vp.name}: expected 5 image elements`)
  for (let i = 0; i < await photos.count(); i++) {
    const photo = photos.nth(i)
    await photo.scrollIntoViewIfNeeded()
    try {
      await photo.evaluate(async image => {
        if (!image.complete) await new Promise((resolve, reject) => {
          image.addEventListener('load', resolve, { once: true })
          image.addEventListener('error', reject, { once: true })
        })
        if (image.naturalWidth === 0) throw new Error('image has zero natural width')
        await image.decode()
      }, { timeout: 15000 })
    } catch (error) { failures.push(`${vp.name}: image ${i}: ${error.message}`) }
    const info = await photo.evaluate(image => ({ src: image.currentSrc, width: image.naturalWidth, height: image.naturalHeight }))
    if (!info.src.includes('/images/') || info.width <= 0) failures.push(`${vp.name}: invalid image source ${info.src}`)
    if (i === 0) {
      if (!info.src.includes('/table-')) failures.push(`${vp.name}: medal photograph is not the hero`)
      try {
        const actualWidth = await photo.evaluate(async image => {
          const response = await fetch(image.currentSrc)
          if (!response.ok) throw new Error(`HTTP ${response.status}`)
          const bitmap = await createImageBitmap(await response.blob())
          const width = bitmap.width
          bitmap.close()
          return width
        })
        if (actualWidth < vp.width * vp.dpr) failures.push(`${vp.name}: hero file too small (${actualWidth} < ${vp.width * vp.dpr})`)
        console.log(`${vp.name} hero file: ${actualWidth}px wide`)
      } catch (error) { failures.push(`${vp.name}: hero file inspection failed: ${error.message}`) }
    }
    console.log(`${vp.name} image ${i}: ${info.width}x${info.height} ${info.src}`)
  }

  const metrics = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, bodyScrollWidth: document.body.scrollWidth, failed: document.documentElement.dataset.appFailed || '', oldHero: getComputedStyle(document.querySelector('.hero-image')).backgroundImage }))
  if (metrics.scrollWidth > metrics.width || metrics.bodyScrollWidth > metrics.width) failures.push(`${vp.name}: horizontal overflow (${metrics.scrollWidth}/${metrics.bodyScrollWidth} > ${metrics.width})`)
  if (metrics.failed === 'true') failures.push(`${vp.name}: React render failed`)
  if (metrics.oldHero.includes('ton-hero.svg')) failures.push(`${vp.name}: old low-resolution hero still in use`)

  const submitButtons = page.locator('button[type="submit"], form button')
  for (let i = 0; i < await submitButtons.count(); i++) {
    const box = await submitButtons.nth(i).boundingBox()
    if (box && box.height < 44) failures.push(`${vp.name}: submit target below 44px (${box.height})`)
  }
  if (vp.width <= 768) {
    const tapTargets = page.locator('a, button, input, select, textarea')
    for (let i = 0; i < await tapTargets.count(); i++) {
      const target = tapTargets.nth(i)
      if (!(await target.isVisible())) continue
      const box = await target.boundingBox()
      if (box && (box.height < 44 || box.width < 44)) failures.push(`${vp.name}: interactive target ${i} below 44px (${Math.round(box.width)}x${Math.round(box.height)})`)
    }
  }
  await page.locator('#menu').scrollIntoViewIfNeeded()
  await page.waitForTimeout(150)
  if (await page.locator('[data-motion].is-visible').count() < 1) failures.push(`${vp.name}: motion observer did not reveal content`)
  await page.screenshot({ path: `qa-artifacts/${vp.name}.png`, fullPage: vp.width <= 768 })
  failures.push(...errors.map(e => `${vp.name}: ${e}`))
  await page.close()
}

const reduced = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' })
await reduced.goto(base, { waitUntil: 'networkidle' })
const reducedState = await reduced.evaluate(() => {
  const el = document.querySelector('[data-motion]')
  if (!el) return null
  const s = getComputedStyle(el)
  return { opacity: s.opacity, transform: s.transform, transitionDuration: s.transitionDuration }
})
if (!reducedState || reducedState.opacity !== '1') failures.push('reduced-motion: content not immediately visible')
await reduced.close()
await browser.close()

if (failures.length) {
  console.error('\nQA FAILURES')
  failures.forEach(f => console.error(`- ${f}`))
  process.exit(1)
}
console.log('QA PASS: React, all five images, medal hero on every viewport, actual file resolution, no horizontal overflow, six-item menu, signature page, FAQ, story, motion and reduced motion.')
