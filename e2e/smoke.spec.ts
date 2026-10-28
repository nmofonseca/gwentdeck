import { expect, test } from '@playwright/test'

test('home and optimiser load', async ({ page }) => {
  await page.goto('./')
  await expect(page.getByRole('banner').getByText('GwentDeck')).toBeVisible()
  await page
    .getByRole('navigation', { name: 'Primary' })
    .getByRole('link', { name: 'Deck Optimiser' })
    .click()
  await expect(page.getByRole('heading', { name: 'Deck Optimiser' })).toBeVisible()
  await page.getByRole('button', { name: 'Generate' }).click()
  await expect(page.getByRole('status')).toContainText(/Legal deck|Need at least|leader/i)
})

test('card library lists cards', async ({ page }) => {
  await page.goto('./#/catalogue')
  await expect(page.getByRole('heading', { name: 'Card Library' })).toBeVisible()
  await expect(page.getByText(/Showing \d+ cards/)).toBeVisible()
})

test('card library row filter is exclusive', async ({ page }) => {
  await page.goto('./#/catalogue')
  const showing = page.getByText(/Showing \d+ cards/)
  await expect(showing).toBeVisible()
  const allText = await showing.textContent()
  const allCount = Number(allText?.match(/Showing (\d+)/)?.[1] ?? 0)
  expect(allCount).toBeGreaterThan(0)

  await page.getByLabel('Row').selectOption('siege')
  await expect(showing).toContainText(/Showing \d+ cards/)
  const siegeText = await showing.textContent()
  const siegeCount = Number(siegeText?.match(/Showing (\d+)/)?.[1] ?? 0)
  expect(siegeCount).toBeGreaterThan(0)
  expect(siegeCount).toBeLessThan(allCount)

  await page.getByLabel('Row').selectOption('agile')
  const agileText = await showing.textContent()
  const agileCount = Number(agileText?.match(/Showing (\d+)/)?.[1] ?? 0)
  expect(agileCount).toBeGreaterThan(0)
  expect(agileCount).not.toBe(siegeCount)
})
