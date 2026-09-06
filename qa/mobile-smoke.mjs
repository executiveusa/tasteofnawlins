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
  if (await page.locator('.menu-row').count() !== 3) failures.push(`${vp.name}: expected 3 menu rows`)
  if (await page.locator('.story-frame').count() !== 4) failures.push(`${vp.name}: expected 4 story frames`)
  if (!(await page.locator('.hero h1').isVisible())) failures.push(`${vp.name}: hero not visible`)

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
    if (i === 0 && !info.src.includes(vp.width <= 760 ? '/counter-' : '/table-')) failures.push(`${vp.name}: wrong hero art direction`)
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
console.log('QA PASS: React, all five images, responsive source selection, no horizontal overflow, menu, story, motion and reduced motion.')
