import { chromium } from 'playwright'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
const base = (process.env.TASTE_BASE_URL || 'http://127.0.0.1:4173').replace(/\/$/, '')
const browser = await chromium.launch({ headless: true })
await fs.mkdir('qa-artifacts', { recursive: true })
const sample = { status: 'scheduled', venue: 'TEST ONLY — NOT A PUBLIC EVENT', address: '123 Example Street, Seattle, WA 98101', date: '2026-10-19', hours: '11 AM – 3 PM', timeZone: 'America/Los_Angeles' }
try {
  // An open tab must stop advertising yesterday's directions, even offline.
  const page = await browser.newPage({ reducedMotion: 'reduce' })
  await page.clock.install({ time: new Date('2026-10-20T06:59:30Z') })
  let offline = false
  await page.route('**/next-stop.json', route => offline ? route.abort() : route.fulfill({ json: sample }))
  await page.goto(base)
  await page.locator('.next-stop-card-scheduled').waitFor()
  offline = true
  await page.clock.fastForward(61_000)
  await page.locator('.next-stop-card-pending').waitFor()
  assert.equal(await page.locator('a.next-stop-primary').count(), 0)
  assert.ok(!(await page.locator('.next-drop').innerText()).includes('TEST ONLY'))
  await page.close()
  for (const payload of [{ ...sample, date: '2020-01-01' }, { ...sample, address: '' }, { status: 'unannounced' }]) {
    const p = await browser.newPage({ reducedMotion: 'reduce' })
    await p.route('**/next-stop.json', route => route.fulfill({ json: payload }))
    await p.goto(base)
    await p.locator('.next-stop-card-pending').waitFor()
    assert.equal(await p.locator('a.next-stop-primary').count(), 0)
    await p.close()
  }
  // Live cancellation refreshes both the strip and the card.
  const changed = await browser.newPage({ reducedMotion: 'reduce' })
  await changed.clock.install({ time: new Date('2026-10-19T18:00:00Z') })
  let payload = { ...sample, date: '2099-08-20' }
  await changed.route('**/next-stop.json', route => route.fulfill({ json: payload }))
  await changed.goto(base)
  await changed.locator('.next-stop-card-scheduled').waitFor()
  payload = { status: 'unannounced' }
  await changed.clock.fastForward(61_000)
  await changed.locator('.next-stop-card-pending').waitFor()
  assert.ok(!(await changed.locator('.next-drop').innerText()).includes('TEST ONLY'))
  await changed.close()
  for (const width of [320, 375, 390, 430, 768, 1280]) {
    const p = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce', acceptDownloads: true })
    const errors = []
    p.on('pageerror', error => errors.push(error.message))
    await p.goto(`${base}/prepare-stop`)
    const button = p.getByRole('button', { name: 'Download announcement file' })
    assert.equal(await button.isEnabled(), false)
    await p.getByLabel('Venue name').fill(sample.venue)
    await p.getByLabel('Full public address').fill(sample.address)
    await p.getByLabel('Service date').fill('2099-08-20')
    await p.getByLabel('Service hours').fill(sample.hours)
    await p.getByRole('checkbox').check()
    await p.locator('.next-stop-card-scheduled').waitFor()
    assert.equal(await button.isEnabled(), true)
    const downloadPromise = p.waitForEvent('download')
    await button.click()
    const download = await downloadPromise
    assert.equal(download.suggestedFilename(), 'next-stop.json')
    const data = JSON.parse(await fs.readFile(await download.path(), 'utf8'))
    assert.equal(data.address, sample.address)
    assert.equal(data.date, '2099-08-20')
    await p.getByLabel('Venue name').fill('Changed venue')
    assert.equal(await button.isEnabled(), false, 'Editing must require renewed confirmation')
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
    for (const target of await p.locator('a, input, button, select, textarea').all()) {
      if (!(await target.isVisible())) continue
      const box = await target.boundingBox()
      assert.ok(box.width >= 44 && box.height >= 44, `Small owner control at ${width}: ${JSON.stringify(box)}`)
    }
    await p.screenshot({ path: `qa-artifacts/prepare-stop-${width}.png`, fullPage: true })
    await p.locator('select[name="status"]').selectOption('unannounced')
    await p.getByRole('checkbox').check()
    const pendingDownload = p.waitForEvent('download')
    await button.click()
    const pendingData = JSON.parse(await fs.readFile(await (await pendingDownload).path(), 'utf8'))
    assert.equal(pendingData.status, 'unannounced')
    assert.equal(pendingData.address, '')
    assert.deepEqual(errors, [])
    await p.close()
  }
  console.log('PASS: offline midnight expiry, expired/incomplete/pending fallbacks, cancellation refresh, owner preview and downloads at six widths, confirmation reset, 44px controls, no overflow.')
} finally { await browser.close() }
