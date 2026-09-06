import { chromium } from 'playwright'
import fs from 'node:fs/promises'

const viewports = [
  { name: '320', width: 320, height: 800 },
  { name: '375', width: 375, height: 812 },
  { name: '390', width: 390, height: 844 },
  { name: '430', width: 430, height: 932 },
  { name: '768', width: 768, height: 1024 },
]

const browser = await chromium.launch({ headless: true })
let failures = []
await fs.mkdir('qa-artifacts', { recursive: true })

for (const vp of viewports) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height }, reducedMotion: 'no-preference' })
  const errors = []
  page.on('console', msg => { if (msg.type() === 'error') errors.push(`console: ${msg.text()}`) })
  page.on('pageerror', err => errors.push(`pageerror: ${err.message}`))
  await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle' })

  const metrics = await page.evaluate(() => ({
    width: innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    bodyScrollWidth: document.body.scrollWidth,
    title: document.title,
  }))
  if (metrics.scrollWidth > metrics.width || metrics.bodyScrollWidth > metrics.width) {
    failures.push(`${vp.name}: horizontal overflow (${metrics.scrollWidth}/${metrics.bodyScrollWidth} > ${metrics.width})`)
  }

  const required = ['#top', '#menu', '.field-notes', '#boxing', '#catering', '#follow', '.editorial-footer']
  for (const selector of required) {
    if (!(await page.locator(selector).count())) failures.push(`${vp.name}: missing ${selector}`)
  }

  const menuRows = await page.locator('.menu-row').count()
  if (menuRows !== 3) failures.push(`${vp.name}: expected 3 menu rows, got ${menuRows}`)
  const storyFrames = await page.locator('.story-frame').count()
  if (storyFrames !== 4) failures.push(`${vp.name}: expected 4 story frames, got ${storyFrames}`)

  const heroVisible = await page.locator('.hero h1').isVisible()
  if (!heroVisible) failures.push(`${vp.name}: hero headline not visible`)

  const submitButtons = page.locator('button[type="submit"], form button')
  for (let i = 0; i < await submitButtons.count(); i++) {
    const box = await submitButtons.nth(i).boundingBox()
    if (box && box.height < 44) failures.push(`${vp.name}: submit target below 44px (${box.height})`)
  }

  await page.locator('#menu').scrollIntoViewIfNeeded()
  await page.waitForTimeout(150)
  const visibleMotion = await page.locator('[data-motion].is-visible').count()
  if (visibleMotion < 1) failures.push(`${vp.name}: scroll motion observer did not reveal content`)

  await page.screenshot({ path: `qa-artifacts/${vp.name}.png`, fullPage: true })
  if (errors.length) failures.push(...errors.map(e => `${vp.name}: ${e}`))
  await page.close()
}

const reduced = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' })
await reduced.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle' })
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
console.log('QA PASS: build renders, no horizontal overflow across 320/375/390/430/768, required sections present, 3 menu rows, 4 story frames, motion reveals, reduced-motion content visible.')
