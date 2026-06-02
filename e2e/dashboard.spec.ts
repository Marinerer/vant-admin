import { test, expect } from '@playwright/test'

test.describe('Admin Dashboard', () => {
  test('should load login page', async ({ page }) => {
    await page.goto('/login')
    await expect(page).toHaveTitle(/Vant Admin|Vite/)
    await expect(page.getByText('Admin Login')).toBeVisible()
  })

  test('should login and navigate to dashboard', async ({ page }) => {
    await page.goto('/login')
    await page.getByPlaceholder('Enter any username').fill('testuser')
    await page.getByRole('button', { name: 'Login' }).click()

    await expect(page.getByText('Welcome, testuser!')).toBeVisible()
  })
})
