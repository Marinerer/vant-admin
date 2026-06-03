# 核心功能

## 1. 认证系统

- ✅ 登录页面（账号密码 / 手机号双模式认证）
- ✅ 用户状态管理（Zustand）
- ✅ 路由保护（可扩展）
- ✅ 退出登录功能

## 2. 布局系统

- ✅ ProLayout 高级布局
- ✅ 响应式侧边栏
- ✅ 顶部导航栏
- ✅ 用户头像和菜单
- ✅ 面包屑导航

## 3. 主题配置

- ✅ Ant Design 主题定制
- ✅ 中文语言包
- ✅ 表单验证消息中文化
- ✅ Tailwind 颜色映射
- ✅ 响应式断点统一

## 4. 示例页面

### Dashboard（仪表盘）

- 通过 React Query + MSW 获取实时统计数据
- 统计卡片展示（总用户数、活跃用户、待处理任务、完成率）
- 快捷操作按钮
- 响应式网格布局
- 加载中（Spin）和空数据（Empty）状态处理

### Users（用户管理）

- ProTable 高级表格 + MSW API 数据源
- 内置搜索（按姓名筛选）和分页
- 数据状态标签（启用/禁用）+ 角色标签（管理员/编辑/普通用户）
- 删除操作（Popconfirm 二次确认 + MSW DELETE 接口）
- 新增用户入口（Modal 提示）

## 5. MSW Mock 数据层

本项目使用 [Mock Service Worker (MSW)](https://mswjs.io/) 实现完整的 API Mock 方案：

- ✅ **浏览器端**：通过 Service Worker 拦截 `fetch` / `XMLHttpRequest`，开发环境自动启用
- ✅ **测试端**：通过 Node Server 在 Vitest 中拦截请求，测试环境自动启动
- ✅ **数据隔离**：每次测试后自动重置 mock 数据，避免测试间状态泄漏
- ✅ **类型安全**：Mock 数据与 TypeScript 接口类型完全对应

**Mock API 接口列表**：

| 接口                   | 方法   | 说明                    |
| ---------------------- | ------ | ----------------------- |
| `/api/auth/login`      | POST   | 用户登录（账号/手机号） |
| `/api/auth/logout`     | POST   | 用户登出                |
| `/api/auth/me`         | GET    | 获取当前用户信息        |
| `/api/users`           | GET    | 用户列表（分页 + 搜索） |
| `/api/users`           | POST   | 新增用户                |
| `/api/users/:id`       | PUT    | 编辑用户                |
| `/api/users/:id`       | DELETE | 删除用户                |
| `/api/dashboard/stats` | GET    | 仪表盘统计数据          |

## 6. 开发工具集成

- ✅ React Compiler 性能优化
- ✅ ESLint 代码检查（类型感知 + React-X / React-DOM 插件）
- ✅ Prettier 代码格式化（保存时自动格式化）
- ✅ TypeScript 类型安全
- ✅ 热模块替换（HMR）
