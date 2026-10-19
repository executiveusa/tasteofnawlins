import { chromium } from 'playwright'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
const base = (process.env.TASTE_BASE_URL || 'http://127.0.0.1:4173').replace(/\/$/, '')
const browser = await chromium.launch({ headless: true })
await fs.mkdir('qa-artifacts', { recursive: true })
try {
  for (const width of [320, 375, 390, 430, 768, 1280]) {
    const p = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' })
    await p.route('**/next-stop.json', route => route.fulfill({ json: { status: 'unannounced' } }))
    await p.goto(base)
    const invite = p.getByRole('button', { name: 'Take me there', exact: true })
    await invite.click()
    const dialog = p.getByRole('dialog')
    await dialog.waitFor({ state: 'visible' })
    assert.ok((await dialog.innerText()).includes('The next stop has not been announced yet.'))
    assert.equal(await p.locator('#stop-dialog-title').evaluate(e => e === document.activeElement), true)
    assert.equal(await p.locator('[name=texts]').isChecked(), false)
    assert.equal(await p.locator('[name=raffle]').isChecked(), false)
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
    assert.equal(await dialog.evaluate(e => e.scrollWidth > e.clientWidth), false)
    assert.equal(await dialog.evaluate(e => getComputedStyle(e).animationName), 'none')
    for (let i = 0; i < 12; i++) {
      await p.keyboard.press('Tab')
      assert.equal(await dialog.evaluate(e => e.contains(document.activeElement)), true, 'Focus escaped modal')
    }
    await p.locator('#stop-alert-phone').fill('-------')
    await p.getByRole('button', { name: 'Prepare my request' }).click()
    assert.equal(await p.locator('#stop-alert-phone').evaluate(e => e.validity.valid), false)
    await p.locator('#stop-alert-phone').fill('+1 202 555 0123')
    await p.getByRole('button', { name: 'Prepare my request' }).click()
    assert.ok((await p.getByRole('status').innerText()).includes('Choose text alerts'))
    // Raffle interest must not require marketing text consent.
    await p.locator('[name=raffle]').check()
    await p.getByRole('button', { name: 'Prepare my request' }).click()
    assert.ok((await p.getByRole('status').innerText()).includes('not confirmed until the kitchen responds'))
    assert.equal(await p.locator('[name=texts]').isChecked(), false)
    await dialog.screenshot({ path: `qa-artifacts/stop-invite-${width}.png` })
    for (const target of await dialog.locator('button,input,a').all()) {
      if (!(await target.isVisible())) continue
      const box = await target.boundingBox()
      assert.ok(box.width >= 44 && box.height >= 44, `Small modal control at ${width}`)
    }
    await p.keyboard.press('Escape')
    assert.equal(await dialog.count(), 0)
    assert.equal(await invite.evaluate(e => e === document.activeElement), true)
    await invite.click()
    assert.equal(await p.locator('#stop-alert-phone').inputValue(), '')
    await p.getByRole('button', { name: 'Close announcement popup' }).click()
    assert.equal(await dialog.count(), 0)
    await p.close()
  }
  const p = await browser.newPage({ viewport: { width: 390, height: 844 }, userAgent: 'Mozilla/5.0 (iPhone)' })
  await p.route('**/next-stop.json', route => route.fulfill({ json: { status: 'scheduled', venue: 'TEST ONLY — not an event', address: '123 Example Street, Seattle, WA 98101', date: '2099-08-20', hours: '11 AM – 3 PM', timeZone: 'America/Los_Angeles' } }))
  await p.goto(base)
  const directions = p.getByRole('link', { name: 'Take me there', exact: false })
  await directions.waitFor()
  assert.ok((await directions.getAttribute('href')).startsWith('https://maps.apple.com/?daddr='))
  assert.equal(await p.getByRole('button', { name: 'Take me there' }).count(), 0)
  assert.equal(await p.getByRole('dialog').count(), 0)
  await p.close()
  console.log('PASS: conditional directions, pending popup, six widths, opt-in choices, phone validation, honest email handoff, raffle without text consent, focus trap/restore, Escape, 44px controls, reduced motion, no overflow.')
} finally { await browser.close() }
