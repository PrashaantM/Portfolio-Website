import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

// Phase 20's exact flow: open site, navigate, open a project, use an
// interaction, reach Contact. One real user journey through real
// rendered pages rather than five disconnected assertions, since that's
// the thing a unit test can't cover: whether the pieces actually work
// together in a real browser.
test('open site, navigate, open a project, toggle music, reach contact', async ({ page }) => {
  // './', not '/': baseURL already includes the GitHub Pages subpath
  // (playwright.config.ts), and a leading '/' is a path-absolute
  // reference that replaces the whole path, dropping that subpath and
  // landing on the wrong page entirely.
  await page.goto('./')
  await expect(page).toHaveTitle(/Prashaant Mudgala/)

  await page.getByRole('link', { name: 'Projects' }).first().click()
  await expect(page.locator('#projects')).toBeInViewport()

  // Scoped by `aria-controls` (`ProjectCard.tsx` sets it to
  // `${project.id}-details`) rather than DOM-tree traversal from the
  // heading, which would be fragile against the card's own nesting.
  await page.locator('button[aria-controls="mcq-platform-details"]').click()
  await expect(page.getByText(/moved multi-variant exam generation/i)).toBeVisible()

  const musicToggle = page.getByRole('button', { name: /music off|mysterious trap|dark trap/i })
  const initialLabel = await musicToggle.textContent()
  await musicToggle.click()
  await expect(musicToggle).not.toHaveText(initialLabel ?? '')

  await page.getByRole('link', { name: 'Contact' }).first().click()
  await expect(page.locator('#contact')).toBeInViewport()

  const emailLink = page.getByRole('link', { name: /mudgala\.prashaant@gmail\.com/i })
  await expect(emailLink).toHaveAttribute('href', 'mailto:mudgala.prashaant@gmail.com')

  const githubLink = page.locator('#contact').getByRole('link', { name: 'GitHub' })
  await expect(githubLink).toHaveAttribute('href', 'https://github.com/PrashaantM')
  await expect(githubLink).toHaveAttribute('target', '_blank')
  await expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer')
})

test('has no critical or serious automated accessibility violations', async ({ page }) => {
  await page.goto('./')
  // Let every whileInView reveal actually fire before scanning a
  // static snapshot; otherwise a card still mid-fade-in reads as a
  // real contrast violation (see notes/phase-15-accessibility.md for
  // the investigation that first caught this).
  await page.evaluate(async () => {
    const step = 500
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((resolve) => setTimeout(resolve, 60))
    }
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(500)

  const results = await new AxeBuilder({ page }).analyze()
  const seriousOrWorse = results.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious')

  expect(seriousOrWorse, JSON.stringify(seriousOrWorse, null, 2)).toEqual([])
})
