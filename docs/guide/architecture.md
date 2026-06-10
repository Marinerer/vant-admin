# 项目架构详解

## 技术栈

| 分类 | 技术 |
|------|------|
| 核心框架 | Vite 8、React 19、TypeScript ~6.0 |
| UI 与样式 | Ant Design 6、Pro Components、Tailwind CSS 4 |
| 状态与数据 | Zustand 5、React Query 5、React Router 6、dayjs |
| 开发工具 | ESLint 10、Prettier 3、Vitest 4、Playwright、pnpm 10、MSW 2 |

## 状态管理 (Zustand)

使用 `create<AppState>` 创建 store，通过 selector 访问状态：

```tsx
import { useAppStore } from '../stores/useAppStore'

function MyComponent() {
  const user = useAppStore((state) => state.user)
  const logout = useAppStore((state) => state.logout)

  return <div>{user?.name}</div>
}
```

## 数据请求 (React Query + Axios)

请求封装在 `src/utils/request.ts`，自动解包 `ApiResponse.data`：

```tsx
import { useQuery } from '@tanstack/react-query'
import { get } from '../utils/request'

function Users() {
  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => get('/users', { current: 1, pageSize: 10 }),
  })

  if (isLoading) return <div>加载中...</div>
  return <div>{/* 渲染数据 */}</div>
}
```

**快捷方法**：`get<T>()`, `post<T>()`, `put<T>()`, `del<T>()`

**特性**：
- Token 自动注入（请求拦截器）
- 统一错误处理（响应拦截器）
- 401 自动跳转登录

## Mock 数据 (MSW)

**浏览器端**：`src/mocks/browser.ts` 自动拦截请求（开发环境）

**测试端**：`src/mocks/node.ts` 在 `beforeAll` 自动启动

**添加新的 Mock API**：

```ts
// src/mocks/handlers/products.ts
import { http, HttpResponse, delay } from 'msw'
import { ok } from '../data'

export const productHandlers = [
  http.get('/api/products', async ({ request }) => {
    await delay(300)
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('current') ?? '1', 10)
    return HttpResponse.json(ok({ list: [], total: 0, current: page }))
  }),
]
```

然后在 `src/mocks/handlers/index.ts` 中注册。

## 路由 (React Router 6)

使用 `createBrowserRouter` 创建路由，布局组件使用 `<Outlet />` 渲染子路由：

```tsx
// src/routes/index.tsx
import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'users', element: <Users /> },
    ],
  },
])
```

## 样式 (Tailwind CSS 4)

使用 Vite 插件集成：`@tailwindcss/vite`，可与 Ant Design 组件混用。

**注意**：详见 [Ant Design 样式指南](./antd-style-guide.md)。

## 目录结构

```
src/
├── assets/             # 静态资源
├── components/         # 公共组件
├── config/             # 配置文件（Ant Design 主题、语言包）
├── layouts/            # 布局组件（ProLayout）
├── mocks/              # MSW Mock 数据层
├── pages/              # 页面组件
├── routes/             # 路由配置
├── services/           # API 服务（React Query）
├── stores/             # 状态管理（Zustand）
├── styles/             # 全局样式（Tailwind CSS）
├── test/               # 测试配置
├── types/              # TypeScript 类型定义
├── utils/              # 工具函数
├── App.tsx             # 应用根组件
└── main.tsx            # 应用入口
```
