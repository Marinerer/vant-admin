# vant-admin

> Vite + React + Ant Design — 现代化管理后台系统模板

基于 Vite 8、React 19、Ant Design 6 的现代化管理后台系统模板。开箱即用，集成 Pro Components、Tailwind CSS 4、Zustand 状态管理、React Query 数据请求和 MSW Mock 数据层，助你快速启动中后台项目。

## 📋 目录

- [技术栈](#-技术栈)
- [项目结构](#-项目结构)
- [开发脚本](#-开发脚本)
- [快速开始](#-快速开始)
- [开发指南](#-开发指南)
- [文档索引](#-文档索引)
- [相关链接](#-相关链接)

## 🛠 技术栈

| 分类       | 技术                                                        |
| ---------- | ----------------------------------------------------------- |
| 核心框架   | Vite 8、React 19、TypeScript ~6.0                           |
| UI 与样式  | Ant Design 6、Pro Components、Tailwind CSS 4                |
| 状态与数据 | Zustand 5、React Query 5、React Router 6、dayjs             |
| 开发工具   | ESLint 10、Prettier 3、Vitest 4、Playwright、pnpm 10、MSW 2 |

## 📁 项目结构

```
vant-admin/
├── public/                  # 静态资源
├── src/
│   ├── assets/             # 图片等静态资源
│   ├── components/         # 公共组件
│   ├── config/             # 配置文件（Ant Design 主题、语言包）
│   ├── layouts/            # 布局组件（ProLayout）
│   ├── mocks/              # MSW Mock 数据层
│   ├── pages/              # 页面组件
│   ├── routes/             # 路由配置
│   ├── services/           # API 服务（React Query）
│   ├── stores/             # 状态管理（Zustand）
│   ├── styles/             # 全局样式（Tailwind CSS）
│   ├── test/               # 测试配置
│   ├── types/              # TypeScript 类型定义
│   ├── utils/              # 工具函数
│   ├── App.tsx             # 应用根组件
│   └── main.tsx            # 应用入口
├── docs/                   # 项目文档
├── e2e/                    # E2E 测试
├── vite.config.ts          # Vite 配置
├── vitest.config.ts        # Vitest 配置
├── tsconfig.json           # TypeScript 配置
├── eslint.config.js        # ESLint 配置
└── package.json
```

## 📜 开发脚本

| 脚本                 | 说明                                    |
| -------------------- | --------------------------------------- |
| `pnpm dev`           | 启动开发服务器（http://localhost:5173） |
| `pnpm build`         | TypeScript 类型检查 + 生产构建          |
| `pnpm build:analyze` | 生产构建并生成包体积分析报告            |
| `pnpm preview`       | 预览生产构建产物                        |
| `pnpm lint`          | 运行 ESLint 代码检查                    |
| `pnpm lint:fix`      | 自动修复 ESLint 可修复的问题            |
| `pnpm format`        | 使用 Prettier 格式化所有源码文件        |
| `pnpm test`          | 运行单元测试（Vitest）                  |
| `pnpm test:ui`       | 启动 Vitest UI 界面                     |
| `pnpm test:coverage` | 生成测试覆盖率报告                      |
| `pnpm test:e2e`      | 运行 E2E 测试（Playwright）             |
| `pnpm test:e2e:ui`   | 启动 Playwright UI 界面                 |

## 🚀 快速开始

### 环境要求

- **Node.js**: >= 18.18.0
- **包管理器**: pnpm >= 10.33.0
- **操作系统**: Windows / macOS / Linux

### 安装依赖

```bash
# 克隆项目
git clone https://github.com/marinerer/vant-admin

# 安装依赖（使用 pnpm）
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:5173 查看应用。

> 💡 **提示**：所有 API 请求由 MSW (Mock Service Worker) 在浏览器端拦截，无需后端服务。Mock 数据定义在 `src/mocks/` 目录下，可在不依赖后端的情况下进行完整的前端开发。

## 📖 开发指南

### 添加新页面

1. 在 `src/pages/` 目录下创建新组件：

```tsx
// src/pages/Settings.tsx
import { Card, Typography } from 'antd'

const { Title } = Typography

export default function Settings() {
  return (
    <div className="p-6">
      <Title level={3}>系统设置</Title>
      <Card>
        <p>设置内容...</p>
      </Card>
    </div>
  )
}
```

2. 在 `src/routes/index.tsx` 中添加路由：

```tsx
import Settings from '../pages/Settings'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      // ... 其他路由
      { path: 'settings', element: <Settings /> },
    ],
  },
])
```

3. 在 `src/layouts/MainLayout.tsx` 中添加菜单项：

```tsx
import { SettingOutlined } from '@ant-design/icons'

route({
  path: '/',
  routes: [
    // ... 其他菜单
    { path: '/settings', name: '系统设置', icon: <SettingOutlined /> },
  ],
})
```

### 使用 Zustand 状态管理

```tsx
import { useAppStore } from '../stores/useAppStore'

function MyComponent() {
  // 读取状态
  const user = useAppStore((state) => state.user)

  // 使用 actions
  const logout = useAppStore((state) => state.logout)

  return <div>{user?.name}</div>
}
```

### 使用 React Query 数据请求

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

### 使用 Pro Components

```tsx
import { ProTable } from '@ant-design/pro-components'
import type { ProColumns } from '@ant-design/pro-components'

const columns: ProColumns<DataType>[] = [
  {
    title: '姓名',
    dataIndex: 'name',
    search: true,
  },
  {
    title: '状态',
    dataIndex: 'status',
    valueEnum: {
      active: { text: '启用', status: 'Success' },
      inactive: { text: '禁用', status: 'Error' },
    },
  },
]

<ProTable
  columns={columns}
  request={async (params) => {
    const data = await get('/users', params)
    return { data: data.list, success: true, total: data.total }
  }}
  rowKey="id"
  toolBarRender={() => [<Button type="primary">新增</Button>]}
/>
```

### 使用 MSW Mock API

本项目集成了 MSW 实现 API Mock，开发时无需后端服务。

**目录结构**：

```
src/mocks/
├── data.ts              # Mock 共享数据
├── browser.ts           # 浏览器端 Worker 启动配置
├── node.ts              # Node 端 Server（Vitest 测试用）
└── handlers/
    ├── index.ts         # Handler 聚合导出
    ├── auth.ts          # 认证 API
    ├── users.ts         # 用户 CRUD API
    └── dashboard.ts     # 仪表盘统计 API
```

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

然后在 `src/mocks/handlers/index.ts` 中注册即可。

**测试中覆盖特定 handler**：

```ts
import { server } from '../mocks/node'
import { http, HttpResponse } from 'msw'

server.use(
  http.get('/api/users', () => {
    return HttpResponse.json({ code: 0, data: { list: [], total: 0 } })
  }),
)
```

## 📚 文档索引

| 文档                                              | 说明                                       |
| ------------------------------------------------- | ------------------------------------------ |
| [核心功能](./docs/core-features.md)               | 认证系统、布局、主题、示例页面、MSW Mock   |
| [Ant Design 样式指南](./docs/antd-style-guide.md) | Tailwind + AntD 共存方案、样式修复与覆盖   |
| [测试指南](./docs/testing.md)                     | 单元测试（Vitest）、E2E 测试（Playwright） |
| [构建部署](./docs/deployment.md)                  | 生产构建、Vercel / Nginx / Docker 部署     |
| [常见问题](./docs/faq.md)                         | 样式冲突、Pro Components 兼容、MSW 调试等  |
| [开发规范](./docs/dev-standards.md)               | 代码风格、格式化、命名规范、Git 提交规范   |

## 🔗 相关链接

- [Vite 官方文档](https://vite.dev/)
- [React 官方文档](https://react.dev/)
- [Ant Design 组件库](https://ant.design/)
- [Pro Components](https://procomponents.ant.design/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand 状态管理](https://zustand-demo.pmnd.rs/)
- [React Query](https://tanstack.com/query/latest)
- [React Router](https://reactrouter.com/)
- [Vitest 测试框架](https://vitest.dev/)
- [Playwright E2E](https://playwright.dev/)
- [MSW Mock Service Worker](https://mswjs.io/)

## 📄 License

MIT License

---

**开发团队**: vant-admin Team  
**最后更新**: 2026-06-03
