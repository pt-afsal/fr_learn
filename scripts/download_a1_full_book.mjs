import fs from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright'

const EMAIL = process.env.EHACHETTE_EMAIL
const PASSWORD = process.env.EHACHETTE_PASSWORD

if (!EMAIL || !PASSWORD) {
  console.error('Missing EHACHETTE_EMAIL or EHACHETTE_PASSWORD')
  process.exit(1)
}

const BOOK_ID = 29
const START_PAGE = 1
const END_PAGE = 119
const OUT_DIR = path.resolve('book29_full_screenshots')

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1600, height: 1200 }, deviceScaleFactor: 1 })

async function ensureLoggedIn(bookUrl) {
  await page.goto(bookUrl, { waitUntil: 'domcontentloaded', timeout: 120000 })
  await page.waitForTimeout(2500)

  if (page.url().includes('sign_in') || (await page.locator('input[type="password"]').count())) {
    await page.locator('input[type="email"]').first().fill(EMAIL)
    await page.locator('input[type="password"]').first().fill(PASSWORD)
    await page.locator('button[type="submit"], input[type="submit"]').first().click()
    await page.waitForLoadState('networkidle', { timeout: 120000 }).catch(() => {})
    await page.waitForTimeout(4000)
    if (!page.url().includes('/#/books/')) {
      await page.goto(bookUrl, { waitUntil: 'domcontentloaded', timeout: 120000 })
      await page.waitForTimeout(4000)
    }
  }

  const continueButton = page.getByRole('button', { name: /^Continue$/i })
  if (await continueButton.count()) {
    await continueButton.first().click().catch(() => {})
    await page.waitForTimeout(1000)
  }

  await page.locator('input.form-control').first().waitFor({ timeout: 30000 })
}

async function waitForCanvases() {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const count = await page.locator('canvas').count()
    if (count >= 2) return
    await page.waitForTimeout(1000)
  }
  throw new Error(`Expected two canvases, found ${await page.locator('canvas').count()}`)
}

async function setSpread(leftPage) {
  const input = page.locator('input.form-control').first()
  await input.click({ clickCount: 3 })
  await input.fill(`${leftPage} - ${leftPage + 1}`)
  await input.press('Enter')
  await page.waitForTimeout(1200)
  await waitForCanvases()
}

async function saveCanvas(index, filePath) {
  const dataUrl = await page.locator('canvas').nth(index).evaluate((canvas) => canvas.toDataURL('image/png'))
  const base64 = dataUrl.replace(/^data:image\/png;base64,/, '')
  await fs.writeFile(filePath, Buffer.from(base64, 'base64'))
}

try {
  await fs.rm(OUT_DIR, { recursive: true, force: true })
  await fs.mkdir(OUT_DIR, { recursive: true })

  const manifest = {
    bookId: BOOK_ID,
    startPage: START_PAGE,
    endPage: END_PAGE,
    exportedAt: new Date().toISOString(),
    files: [],
  }

  const url = `https://bibliotheque.ehachettefle.com/#/books/${BOOK_ID}?page=${START_PAGE}`
  await ensureLoggedIn(url)

  for (let left = START_PAGE; left <= END_PAGE; left += 2) {
    try {
      await setSpread(left)
    } catch {
      await ensureLoggedIn(url)
      await setSpread(left)
    }

    const leftFile = path.join(OUT_DIR, `book-${BOOK_ID}-page-${String(left).padStart(3, '0')}.png`)
    await saveCanvas(0, leftFile)
    manifest.files.push(path.basename(leftFile))

    const right = left + 1
    if (right <= END_PAGE) {
      const rightFile = path.join(OUT_DIR, `book-${BOOK_ID}-page-${String(right).padStart(3, '0')}.png`)
      await saveCanvas(1, rightFile)
      manifest.files.push(path.basename(rightFile))
    }

    console.log(`Saved spread ${left}-${Math.min(right, END_PAGE)}`)
  }

  await fs.writeFile(path.join(OUT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8')
} finally {
  await browser.close()
}
