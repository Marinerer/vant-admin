# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

vant-admin 是基于 Vite 8 + React 19 + Ant Design 6 的现代化管理后台系统模板。集成 Pro Components、Tailwind CSS 4、Zustand 5 状态管理、React Query 5 数据请求和 MSW 2 Mock 数据层。

## 常用命令

```bash
# 开发
pnpm dev                    # 启动开发服务器 (http://localhost:5173)
pnpm build                  # TypeScript 类型检查 + 生产构建
pnpm build:analyze          # 生产构建并生成包体积分析报告
pnpm preview                # 预览生产构建产物

# 代码质量
pnpm lint                   # 运行 ESLint 检查
pnpm lint:fix               # 自动修复 ESLint 问题
pnpm format                 # 使用 Prettier 格式化所有源码

# 测试
pnpm test                   # 运行单元测试 (Vitest)
pnpm test:ui                # 启动 Vitest UI 界面
pnpm test:coverage          # 生成测试覆盖率报告
pnpm test:e2e               # 运行 E2E 测试 (Playwright)
pnpm test:e2e:ui            # 启动 Playwright UI 界面

# 单个测试文件
pnpm test src/utils/format.test.ts
```

## 项目架构

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

## 开发规范

**命名规范**：
- 组件：PascalCase（如 `UserList.tsx`）
- Hooks：camelCase，以 `use` 开头（如 `useAppStore`）
- 常量：UPPER_SNAKE_CASE
- 变量/函数：camelCase
- 类型/接口：PascalCase

## 文档索引

| 文档                                              | 说明                                          |
| ------------------------------------------------- | --------------------------------------------- |
| [项目架构详解](./docs/guide/architecture.md)      | 技术栈、状态管理、数据请求、Mock、路由、样式  |
| [开发规范](./docs/guide/dev-standards.md)         | TypeScript、React、错误处理、测试、导入规范   |
| [Ant Design 使用指南](./docs/guide/antd-guide.md) | Ant Design 组件使用规范、与 Tailwind 共存方案 |
| [Git 工作流规则](./docs/guide/dev-standards.md)   | 分支策略、Commit Message、PR 规范             |
| [测试指南](./docs/guide/testing.md)               | 单元测试（Vitest）、E2E 测试（Playwright）    |
| [项目配置](./docs/guide/configuration.md)         | 环境变量、路径别名、代理、IDE 配置            |
| [核心功能](./docs/guide/core-features.md)         | 认证系统、布局、主题、示例页面                |
| [构建部署](./docs/guide/deployment.md)            | 生产构建、Vercel / Nginx / Docker 部署        |
| [常见问题](./docs/guide/faq.md)                   | 样式冲突、Pro Components 兼容、MSW 调试       |
