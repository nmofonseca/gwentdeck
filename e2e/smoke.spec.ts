import { expect, test } from '@playwright/test'

test('home and optimiser load', async ({ page }) => {
  await page.goto('./')
  await expect(page.getByRole('banner').getByText('GwentDeck')).toBeVisible()
  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Optimiser' }).click()
  await expect(page.getByRole('heading', { name: 'Deck optimiser' })).toBeVisible()
  await expect(page.getByRole('status')).toContainText(/Legal deck|Need at least|leader/i)
})

test('catalogue lists cards', async ({ page }) => {
  await page.goto('./#/catalogue')
  await expect(page.getByRole('heading', { name: 'Catalogue' })).toBeVisible()
  await expect(page.getByText(/Showing \d+ cards/)).toBeVisible()
})
