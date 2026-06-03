import { test, expect } from '@playwright/test'

test.describe('Admin Dashboard', () => {
  test('should load login page', async ({ page }) => {
    await page.goto('/login')
    await expect(page).toHaveTitle(/Vant Admin/)
    await expect(page.getByRole('heading', { name: 'Vant Admin' })).toBeVisible()
  })

  test('should login and navigate to dashboard', async ({ page }) => {
    await page.goto('/login')
    await page.getByPlaceholder('用户名: admin 或任意字符').fill('testuser')
    await page.getByPlaceholder('密码: 123456 或任意字符').fill('123456')
    await page.getByRole('button', { name: '登 录' }).click()

    await expect(page.getByText('欢迎回来，testuser!')).toBeVisible()
  })

  test('should navigate to users page and verify user data', async ({ page }) => {
    // 登录
    await page.goto('/login')
    await page.getByPlaceholder('用户名: admin 或任意字符').fill('testuser')
    await page.getByPlaceholder('密码: 123456 或任意字符').fill('123456')
    await page.getByRole('button', { name: '登 录' }).click()

    // 验证已登录到 Dashboard
    await expect(page.getByText('欢迎回来，testuser!')).toBeVisible()

    // 验证侧边栏菜单可见
    await expect(page.getByRole('menuitem', { name: 'Dashboard' })).toBeVisible()
    await expect(page.getByRole('menuitem', { name: '用户管理' })).toBeVisible()

    // 点击「用户管理」菜单
    await page.getByRole('menuitem', { name: '用户管理' }).click()

    // 验证跳转到 /users 页面
    await expect(page).toHaveURL(/\/users/)

    // 验证 mock 用户数据已渲染
    await expect(page.getByText('张三')).toBeVisible()
    await expect(page.getByText('李四')).toBeVisible()
    await expect(page.getByText('王五')).toBeVisible()
  })
})
