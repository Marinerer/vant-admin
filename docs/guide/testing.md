# 测试指南

## 单元测试

```bash
# 运行所有单元测试
pnpm test

# 运行单元测试（带 UI 界面）
pnpm test:ui

# 生成测试覆盖率报告
pnpm test:coverage
```

### 编写测试用例

```tsx
// src/pages/Login.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Login from './Login'

describe('Login Component', () => {
  it('renders login form', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )
    expect(screen.getByText('Vant Admin')).toBeInTheDocument()
  })
})
```

**注意事项**：
- React Router 组件测试必须使用 `MemoryRouter` 包裹
- jsdom 环境需要 mock `window.matchMedia`（已在 `src/test/setup.ts` 配置）
- MSW Server 在 `beforeAll` 自动启动，`afterEach` 自动重置 handler 和数据

## E2E 测试

```bash
# 安装 Playwright 浏览器
pnpm exec playwright install

# 运行 E2E 测试
pnpm test:e2e

# 运行 E2E 测试（带 UI 界面）
pnpm test:e2e:ui
```

### 编写 E2E 测试

```ts
// e2e/dashboard.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Admin Dashboard', () => {
  test('should login and navigate to dashboard', async ({ page }) => {
    await page.goto('/login')
    await page.getByPlaceholder('用户名: admin 或任意字符').fill('admin')
    await page.getByPlaceholder('密码: 123456 或任意字符').fill('123456')
    await page.getByRole('button', { name: 'Login' }).click()

    await expect(page.getByText('欢迎回来，管理员!')).toBeVisible()
  })
})
```
