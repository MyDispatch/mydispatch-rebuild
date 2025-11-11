import { test, expect } from '@playwright/test'

// Fester Screen: Mobile Home mit Footer‑Check
test.use({ viewport: { width: 390, height: 844 } })

test.describe('Mobile Home Footer – Spacing & Layering', () => {
  test('Footer hat Top‑Padding und bleibt unter Overlays', async ({ page }) => {
    const base = process.env.VITE_APP_URL || 'http://localhost:5173'
    await page.goto(`${base}/`)

    const footer = page.locator('footer')
    await expect(footer).toBeVisible()

    const inner = page.locator('[data-testid="mobile-footer-inner"]')
    await expect(inner).toBeVisible()

    // Top‑Padding muss mindestens 4px (pt-1) betragen
    const paddingTop = await inner.evaluate((el) => {
      const v = getComputedStyle(el).paddingTop
      return parseFloat(v || '0')
    })
    expect(paddingTop).toBeGreaterThanOrEqual(4)

    // Footer ist am unteren Rand fixiert
    const isFixed = await footer.evaluate((el) => getComputedStyle(el).position === 'fixed')
    expect(isFixed).toBeTruthy()

    const bottomAligned = await footer.evaluate((el) => {
      const rect = el.getBoundingClientRect()
      return Math.abs(window.innerHeight - rect.bottom) <= 1
    })
    expect(bottomAligned).toBeTruthy()

    // Screenshots zur schnellen Sichtprüfung
    await page.screenshot({ path: 'tests/visual/artifacts/home-mobile.png', fullPage: true })

    // Generische Overlay‑Prüfung: Elemente mit hohem z-index (>40) sollten über dem Footer liegen
    const footerZ = await footer.evaluate((el) => parseInt(getComputedStyle(el).zIndex || '0', 10))
    const overlayMaxZ = await page.evaluate(() => {
      const all = Array.from(document.querySelectorAll('*')) as HTMLElement[]
      const zList = all
        .map((el) => parseInt(getComputedStyle(el).zIndex || '0', 10))
        .filter((z) => Number.isFinite(z) && z >= 40)
      return zList.length ? Math.max(...zList) : 0
    })
    // Erwartung: Overlay‑zIndex ist vorhanden und größer als der Footer‑zIndex (Footer ~20, Overlays ~50)
    expect(overlayMaxZ).toBeGreaterThanOrEqual(50)
    expect(overlayMaxZ).toBeGreaterThan(footerZ)
  })
})
