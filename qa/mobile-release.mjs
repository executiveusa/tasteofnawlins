import { chromium, devices } from 'playwright'
import fs from 'node:fs/promises'

const base = (process.env.TASTE_BASE_URL || 'https://tasteofnawlins.netlify.app').replace(/\/$/, '')
const cases = [
  { name: 'android-320', width: 320, height: 568 },
  { name: 'android-360', width: 360, height: 800 },
  { name: 'iphone-375', width: 375, height: 812 },
  { name: 'iphone-390', width: 390, height: 844 },
  { name: 'iphone-430', width: 430, height: 932 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'desktop-1440', width: 1440, height: 900 },
]
const routes = ['/', '/coffee-and-beignets', '/gallery', '/taste-of-nawlins-menu.html']
const issues = []
const checks = []
const browser = await chromium.launch({ headless: true })
await fs.mkdir('qa-artifacts', { recursive: true })
for (const device of cases) {
  const context = await browser.newContext({ viewport: {width: device.width, height: device.height}, deviceScaleFactor: 2, isMobile: device.width < 768, hasTouch: device.width < 768, reducedMotion: 'reduce' })
  const page = await context.newPage()
  const consoleErrors = []
  page.on('pageerror', e => consoleErrors.push(e.message))
  for (const route of routes) {
    const id = device.name + ' ' + route
    try {
      const response = await page.goto(base + route, {waitUntil:'domcontentloaded', timeout: 30000})
      await page.locator('body').waitFor()
      if (route === '/') await page.locator('.hero h1').waitFor({ timeout: 12000 })
      if (route === '/coffee-and-beignets') await page.locator('#signature-title').waitFor({ timeout: 12000 })
      if (route === '/gallery') await page.locator('#scrapbook-title').waitFor({ timeout: 12000 })
      await page.waitForLoadState('networkidle').catch(() => {})
      await page.waitForTimeout(350)
      if (!response || response.status() >= 400) issues.push(id + ': HTTP ' + response?.status())
      const state = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth - innerWidth,
        title: document.title,
        images: [...document.images].filter(img => img.getBoundingClientRect().top < innerHeight && img.getBoundingClientRect().bottom > 0).map(img=>({src:img.currentSrc,loaded:img.complete && img.naturalWidth > 0})),
      }))
      if (state.overflow > 1) issues.push(id + ': horizontal overflow ' + state.overflow + 'px')
      for (const img of state.images.filter(x=>!x.loaded)) issues.push(id + ': image failed ' + img.src)
      if (route === '/coffee-and-beignets') {
        const product = page.locator('.signature-product-photo')
        await product.scrollIntoViewIfNeeded()
        try {
          await product.evaluate(async img => {
            if (!img.complete) await new Promise((resolve,reject) => {
              img.addEventListener('load',resolve,{once:true})
              img.addEventListener('error',()=>reject(new Error('product image load event failed')),{once:true})
            })
            if (!img.naturalWidth) throw new Error('zero-width or missing product image')
            await img.decode()
          })
        } catch(error) { issues.push(id + ': product photograph broken: ' + error.message) }
      }
      await page.screenshot({ path: 'qa-artifacts/' + device.name + '-' + (route === '/' ? 'home' : route.slice(1).replaceAll('/','-')) + '.png', fullPage: false })
      checks.push({id, status: response?.status(), overflow:state.overflow, title: state.title, images:state.images.length})
    } catch (e) {
      issues.push(id + ': ' + e.message.slice(0,240))
    }
  }
  try {
    await page.goto(base + '/', {waitUntil:'networkidle'})
    await page.locator('.story-statement').waitFor({timeout:12000})
    const logo = page.locator('.site-header .wordmark-logo img')
    if (!(await logo.isVisible())) issues.push(device.name + ': Fal wordmark hidden')
    else {
      const logoCheck = await logo.evaluate(img => ({
        loaded:img.complete && img.naturalWidth>0,
        src:img.currentSrc,
        width:img.getBoundingClientRect().width,
        overflow:img.getBoundingClientRect().right>innerWidth
      }))
      if (!logoCheck.loaded) issues.push(device.name + ': Fal wordmark asset failed to load')
      if (!logoCheck.src.endsWith('.svg')) issues.push(device.name + ': expected SVG wordmark')
      if (logoCheck.overflow) issues.push(device.name + ': logo overflows viewport')
      if (logoCheck.width<85) issues.push(device.name + ': logo too small')
    }
    if (device.width <= 900) {
      const toggle = page.locator('.mobile-nav-toggle')
      if (!(await toggle.isVisible())) issues.push(device.name + ': mobile navigation toggle missing')
      else {
        await toggle.click()
        if (await toggle.getAttribute('aria-expanded') !== 'true') issues.push(device.name + ': mobile nav did not expand')
        const links = page.locator('#primary-navigation a')
        if (await links.count() !== 5) issues.push(device.name + ': expected five mobile destinations')
        for (let i = 0; i < await links.count(); i++) {
          if (!(await links.nth(i).isVisible())) issues.push(device.name + ': mobile destination ' + i + ' hidden')
        }
        await page.keyboard.press('Escape')
        if (await toggle.getAttribute('aria-expanded') !== 'false') issues.push(device.name + ': Escape did not close mobile navigation')
      }
    } else if (!(await page.locator('#primary-navigation a').first().isVisible())) issues.push(device.name + ': desktop navigation hidden')
    const brand = page.getByText('Taste of Nawlins is a pop up kitchen with a purpose', {exact:true})
    if (await brand.count() !== 1) issues.push(device.name + ': original brand statement missing')
    const future = page.locator('a[href="https://futurechamps.netlify.app/"]')
    if (!(await future.count())) issues.push(device.name + ': Future Champs destination missing')
    const facebook = page.locator('.social-facebook')
    if ((await facebook.count()) !== 1 || (await facebook.innerText()).trim().indexOf('Facebook') < 0) issues.push(device.name + ': Facebook footer label missing')
    const forms = page.locator('form')
    if (await forms.count() !== 2) issues.push(device.name + ': expected two inquiry forms')
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(250)
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(250)
  } catch(e) { issues.push(device.name + ': homepage interaction ' + e.message.slice(0,180)) }
  try {
    await page.goto(base + '/gallery', {waitUntil:'networkidle'})
    await page.locator('#scrapbook-title').waitFor({timeout:12000})
    const photos = page.locator('.scrapbook-photo-button')
    if(await photos.count()) {
      await photos.first().click()
      if (!(await page.getByRole('dialog').count())) issues.push(device.name + ': gallery viewer failed to open')
      await page.keyboard.press('Escape')
      if (await page.getByRole('dialog').count()) issues.push(device.name + ': gallery viewer did not close on Escape')
    } else issues.push(device.name + ': scrapbook has no usable photo')
  } catch(e) { issues.push(device.name + ': gallery interaction ' + e.message.slice(0,180)) }
  issues.push(...consoleErrors.map(e=>device.name + ': runtime error ' + e))
  await context.close()
}
await browser.close()
await fs.writeFile('qa-artifacts/report.json', JSON.stringify({base,checks,issues},null,2))
console.log('Checks:',checks.length,'Issues:',issues.length)
issues.forEach(x=>console.error('ISSUE:',x))
if (issues.length) process.exitCode = 1
