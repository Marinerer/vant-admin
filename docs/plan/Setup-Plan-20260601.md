
# Admin Dashboard Setup Plan

## 1. 依赖安装与 package.json 更新
- 安装运行时依赖：
  - `@ant-design/pro-components@^2.8.10`
  - `@tanstack/react-query@^5.80.6`
  - `zustand@^5.0.5`
  - `dayjs@^1.11.13` (AntD 6 默认使用 dayjs)
- 安装开发依赖：
  - `tailwindcss@^4.1.16`
  - `@tailwindcss/vite@^4.1.16`
  - `@tailwindcss/typography@^0.5.16`
- 运行 `pnpm add` 完成安装。

## 2. Tailwind CSS 配置
- 创建 `src/styles/index.css`，引入 Tailwind v4 指令：
  ```css
  @import "tailwindcss";
  @source "../";
  ```
- 在 `vite.config.ts` 中注册 `@tailwindcss/vite` 插件。
- 在 `src/main.tsx` 中将 CSS 入口从 `index.css` 切换为 `styles/index.css`。

## 3. 目录结构搭建
在 `src/` 下创建以下目录：
- `src/components/`：公共组件
- `src/layouts/`：布局组件（侧边栏、顶栏等）
- `src/pages/`：路由页面
- `src/routes/`：路由定义与配置
- `src/stores/`：Zustand 状态
- `src/services/`：react-query 数据请求
- `src/types/`：全局类型定义
- `src/utils/`：工具函数
- `src/styles/`：全局样式

## 4. 状态管理 (Zustand) 基础配置
- 创建 `src/stores/useAppStore.ts`：
  - 定义基础状态（如 `isAuthenticated`, `user`, `setUser`, `logout`）。
  - 导出 `useAppStore` hook。

## 5. 数据请求 (React Query) 配置
- 创建 `src/services/queryClient.ts`：
  - 实例化 `QueryClient`，配置默认缓存策略。
- 在 `src/main.tsx` 中通过 `QueryClientProvider` 包裹应用。

## 6. 路由系统配置 (React Router)
- 创建 `src/routes/index.tsx`：
  - 定义路由结构：`Login`、`Layout`（包含 `Dashboard`、`Settings` 等）。
  - 使用 `createBrowserRouter` 或 `RouterProvider` 集成。
- 创建 `src/layouts/MainLayout.tsx`：
  - 使用 Ant Design 的 `ProLayout` 或 `Layout` 组件搭建后台基础框架（侧边栏+Header+Content）。

## 7. Ant Design 与 Pro Components 集成
- 在 `App.tsx` 或 `MainLayout.tsx` 中引入 `ConfigProvider`。
- 配置全局主题色及组件默认属性。
- 使用 `ProLayout` 替代基础布局，提供开箱即用的管理后台 UI。

## 8. ESLint 优化
- 更新 `eslint.config.js`，添加针对 React Hooks、Zustand、Tailwind 的规则提示（可选）。

## 9. 入口文件 (main.tsx & App.tsx) 改造
- `main.tsx`：集成 `BrowserRouter`、`QueryClientProvider`、全局 CSS。
- `App.tsx`：作为最外层容器，主要承载 `<RouterProvider router={router} />`。

## 10. 验证与测试
- 运行 `pnpm run dev` 验证项目启动。
- 检查路由跳转、状态共享、样式加载及 AntD 组件渲染是否正常。
- 创建 `develop/admin-setup` 分支并在该分支上进行开发。
