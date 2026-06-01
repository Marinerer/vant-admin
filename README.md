# Nest CMS Admin

基于 React 19 + Vite 8 的现代化管理后台系统，集成 Ant Design 6、Pro Components、Tailwind CSS 4、Zustand 状态管理和 React Query 数据请求。

## 📋 目录

- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [快速开始](#快速开始)
- [开发指南](#开发指南)
- [核心功能](#核心功能)
- [测试](#测试)
- [构建部署](#构建部署)
- [常见问题](#常见问题)

## 🛠 技术栈

### 核心框架
- **构建工具**: [Vite 8](https://vite.dev/) - 极速的前端构建工具
- **前端框架**: [React 19](https://react.dev/) - 最新版本，支持 React Compiler
- **TypeScript**: ~6.0.2 - 类型安全的 JavaScript 超集

### UI 与样式
- **UI 组件库**: [Ant Design 6](https://ant.design/) - 企业级 UI 设计语言
- **Pro Components**: [@ant-design/pro-components](https://procomponents.ant.design/) - 高级组件库
- **图标库**: [@ant-design/icons](https://ant.design/components/icon-cn/) - 图标组件
- **CSS 框架**: [Tailwind CSS 4](https://tailwindcss.com/) - 原子化 CSS 框架
- **样式兼容**: 完整的 Ant Design 与 Tailwind CSS 集成方案

### 状态与数据
- **状态管理**: [Zustand 5](https://zustand-demo.pmnd.rs/) - 轻量级状态管理
- **数据请求**: [React Query 5](https://tanstack.com/query/latest) - 强大的异步状态管理
- **路由管理**: [React Router 6](https://reactrouter.com/) - 声明式路由
- **日期处理**: [dayjs](https://day.js.org/) - 轻量级日期库（已配置中文）

### 开发工具
- **代码检查**: [ESLint 10](https://eslint.org/) + TypeScript-ESLint
- **单元测试**: [Vitest 4](https://vitest.dev/) + [React Testing Library](https://testing-library.com/)
- **E2E 测试**: [Playwright](https://playwright.dev/) - 端到端测试
- **包管理**: [pnpm 10](https://pnpm.io/) - 高效的包管理器

## 📁 项目结构

```
nest-cms-admin/
├── public/                  # 静态资源
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/             # 图片等静态资源
│   ├── components/         # 公共组件
│   ├── config/             # 配置文件
│   │   ├── antd.tsx        # Ant Design 配置（主题、语言包）
│   │   └── theme.ts        # 主题配置（颜色、断点、间距）
│   ├── layouts/            # 布局组件
│   │   └── MainLayout.tsx  # 主布局（ProLayout）
│   ├── pages/              # 页面组件
│   │   ├── Login.tsx       # 登录页
│   │   ├── Dashboard.tsx   # 仪表盘
│   │   └── Users.tsx       # 用户管理（ProTable 示例）
│   ├── routes/             # 路由配置
│   │   └── index.tsx       # 路由定义
│   ├── services/           # API 服务
│   │   └── queryClient.ts  # React Query 配置
│   ├── stores/             # Zustand 状态
│   │   └── useAppStore.ts  # 全局状态管理
│   ├── styles/             # 全局样式
│   │   └── index.css       # Tailwind CSS 入口
│   ├── test/               # 测试配置
│   │   └── setup.ts        # 测试环境设置
│   ├── types/              # TypeScript 类型定义
│   ├── utils/              # 工具函数
│   ├── App.tsx             # 应用根组件
│   └── main.tsx            # 应用入口
├── e2e/                    # E2E 测试
│   └── dashboard.spec.ts   # 端到端测试用例
├── .gitignore
├── eslint.config.js        # ESLint 配置
├── index.html              # HTML 入口
├── package.json
├── playwright.config.ts    # Playwright 配置
├── tsconfig.json           # TypeScript 配置
├── vite.config.ts          # Vite 配置
└── vitest.config.ts        # Vitest 配置
```

## 🚀 快速开始

### 环境要求

- **Node.js**: >= 18.18.0
- **包管理器**: pnpm >= 10.33.0
- **操作系统**: Windows / macOS / Linux

### 安装依赖

```bash
# 克隆项目
git clone <repository-url>
cd nest-cms-admin

# 安装依赖（使用 pnpm）
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:5173 查看应用。

### 首次使用

1. 打开浏览器访问 http://localhost:5173
2. 进入登录页面，输入任意用户名
3. 点击 "登录" 进入管理后台
4. 浏览 Dashboard、用户管理等页面

## 📖 开发指南

### 添加新页面

1. 在 `src/pages/` 目录下创建新组件：

```tsx
// src/pages/Settings.tsx
import { Card, Typography } from 'antd';

const { Title } = Typography;

export default function Settings() {
  return (
    <div className="p-6">
      <Title level={3}>系统设置</Title>
      <Card>
        <p>设置内容...</p>
      </Card>
    </div>
  );
}
```

2. 在 `src/routes/index.tsx` 中添加路由：

```tsx
import Settings from '../pages/Settings';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      // ... 其他路由
      { path: 'settings', element: <Settings /> },
    ],
  },
]);
```

3. 在 `src/layouts/MainLayout.tsx` 中添加菜单项：

```tsx
import { SettingOutlined } from '@ant-design/icons';

route={{
  path: '/',
  routes: [
    // ... 其他菜单
    { path: '/settings', name: '系统设置', icon: <SettingOutlined /> },
  ],
}}
```

### 使用 Zustand 状态管理

```tsx
import { useAppStore } from '../stores/useAppStore';

function MyComponent() {
  // 读取状态
  const user = useAppStore((state) => state.user);
  
  // 使用 actions
  const logout = useAppStore((state) => state.logout);
  
  return <div>{user?.name}</div>;
}
```

### 使用 React Query 数据请求

```tsx
import { useQuery, useMutation } from '@tanstack/react-query';

function Users() {
  // 查询数据
  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then(res => res.json()),
  });
  
  // 修改数据
  const mutation = useMutation({
    mutationFn: (newUser) => fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(newUser),
    }),
  });
  
  if (isLoading) return <div>加载中...</div>;
  
  return <div>{/* 渲染数据 */}</div>;
}
```

### Tailwind CSS + Ant Design 最佳实践

#### 1. 布局使用 Tailwind

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
  {/* 响应式网格布局 */}
</div>
```

#### 2. 组件使用 Ant Design

```tsx
import { Card, Button, Table } from 'antd';

<Card title="统计卡片">
  <Table dataSource={data} columns={columns} />
</Card>
```

#### 3. 样式覆盖规范

使用 `!` 前缀覆盖 Ant Design 默认样式：

```tsx
<Title level={4} className="!mb-0 !mt-2">
  标题
</Title>
```

#### 4. 颜色系统

参考 `src/config/theme.ts` 中的颜色映射：

```tsx
// 使用 Tailwind 颜色
<div className="bg-blue-500 text-white">

// 使用 Ant Design 颜色
<Button type="primary">主要按钮</Button>
```

### 使用 Pro Components

#### ProTable 示例

```tsx
import { ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';

const columns: ProColumns<DataType>[] = [
  {
    title: '姓名',
    dataIndex: 'name',
    search: true, // 启用搜索
  },
  {
    title: '状态',
    dataIndex: 'status',
    valueEnum: {
      active: { text: '启用', status: 'Success' },
      inactive: { text: '禁用', status: 'Error' },
    },
  },
];

<ProTable
  columns={columns}
  dataSource={data}
  rowKey="id"
  toolBarRender={() => [
    <Button type="primary">新增</Button>,
  ]}
/>
```

## 🎯 核心功能

### 1. 认证系统

- ✅ 登录页面（模拟认证）
- ✅ 用户状态管理（Zustand）
- ✅ 路由保护（可扩展）
- ✅ 退出登录功能

### 2. 布局系统

- ✅ ProLayout 高级布局
- ✅ 响应式侧边栏
- ✅ 顶部导航栏
- ✅ 用户头像和菜单
- ✅ 面包屑导航

### 3. 主题配置

- ✅ Ant Design 主题定制
- ✅ 中文语言包
- ✅ 表单验证消息中文化
- ✅ Tailwind 颜色映射
- ✅ 响应式断点统一

### 4. 示例页面

#### Dashboard（仪表盘）

- 统计卡片展示
- 快捷操作按钮
- 响应式网格布局
- Tailwind + Ant Design 结合示例

#### Users（用户管理）

- ProTable 高级表格
- 内置搜索和筛选
- 数据状态标签
- 操作按钮（编辑、删除）
- 分页功能

### 5. 开发工具集成

- ✅ React Compiler 性能优化
- ✅ ESLint 代码检查
- ✅ TypeScript 类型安全
- ✅ 热模块替换（HMR）

## 🧪 测试

### 单元测试

```bash
# 运行所有单元测试
pnpm test

# 运行单元测试（带 UI 界面）
pnpm test:ui

# 生成测试覆盖率报告
pnpm test:coverage
```

#### 编写测试用例

```tsx
// src/pages/Login.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';

describe('Login Component', () => {
  it('renders login form', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    expect(screen.getByText('Admin Login')).toBeInTheDocument();
  });
});
```

**注意事项**：
- React Router 组件测试必须使用 `MemoryRouter` 包裹
- jsdom 环境需要 mock `window.matchMedia`（已在 `src/test/setup.ts` 配置）

### E2E 测试

```bash
# 安装 Playwright 浏览器
pnpm exec playwright install

# 运行 E2E 测试
pnpm test:e2e

# 运行 E2E 测试（带 UI 界面）
pnpm test:e2e:ui
```

#### 编写 E2E 测试

```ts
// e2e/dashboard.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard', () => {
  test('should login and navigate to dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('Enter any username').fill('testuser');
    await page.getByRole('button', { name: 'Login' }).click();
    
    await expect(page.getByText('Welcome, testuser!')).toBeVisible();
  });
});
```

## 📦 构建部署

### 生产构建

```bash
# 类型检查 + 构建
pnpm build

# 预览生产构建
pnpm preview
```

构建输出位于 `dist/` 目录。

### 部署建议

#### Vercel 部署

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel
```

#### Nginx 配置

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### Docker 部署

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install
COPY . .
RUN pnpm build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## ❓ 常见问题

### 1. Tailwind CSS 与 Ant Design 样式冲突

**问题**: Tailwind 的样式重置影响了 Ant Design 组件。

**解决**: 已在 `src/styles/index.css` 中配置兼容性层：

```css
@layer base {
  button:not(:disabled),
  [role="button"]:not(:disabled) {
    all: unset;
  }
  
  input, textarea, select {
    all: revert;
  }
}
```

### 2. Pro Components 与 Ant Design 版本不匹配

**警告信息**: `unmet peer dependency antd@"^4.24.15 || ^5.11.2"`

**说明**: Pro Components 官方尚未完全支持 Ant Design 6，但目前基本功能正常运行。等待官方更新或使用 Ant Design 5。

### 3. React Router 测试报错

**错误**: `useNavigate() may be used only in the context of a <Router> component.`

**解决**: 测试时使用 `MemoryRouter` 包裹：

```tsx
render(
  <MemoryRouter>
    <YourComponent />
  </MemoryRouter>
);
```

### 4. 图标不显示

**确保已安装**:

```bash
pnpm add @ant-design/icons
```

**正确使用**:

```tsx
import { HomeOutlined } from '@ant-design/icons';

// ✅ 正确：使用组件
{ icon: <HomeOutlined /> }

// ❌ 错误：使用字符串
{ icon: 'HomeOutlined' }
```

### 5. 中文语言包未生效

**检查配置**:

```tsx
// src/config/antd.tsx
import zhCN from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');

<ConfigProvider locale={zhCN}>
  {/* ... */}
</ConfigProvider>
```

### 6. 热更新不生效

**重启开发服务器**:

```bash
# 停止当前服务器（Ctrl+C）
pnpm dev
```

**清除缓存**:

```bash
rm -rf node_modules/.vite
pnpm dev
```

## 📝 开发规范

### 代码风格

- 使用 TypeScript 严格模式
- 遵循 ESLint 规则
- 组件使用函数式声明
- 使用 ES Module 导入导出

### 命名规范

- **组件**: PascalCase（如 `UserList.tsx`）
- **Hooks**: camelCase，以 `use` 开头（如 `useAppStore`）
- **常量**: UPPER_SNAKE_CASE
- **变量/函数**: camelCase
- **类型/接口**: PascalCase

### 目录规范

- 每个功能模块独立目录
- 组件、样式、测试文件放在一起
- 公共组件放在 `src/components/`

### Git 提交规范

```
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式调整
refactor: 重构代码
test: 测试相关
chore: 构建/工具链变更
```

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

## 📄 License

MIT License

---

**开发团队**: Nest CMS Team  
**最后更新**: 2026-06-01
