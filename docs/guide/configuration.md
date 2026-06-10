# 项目配置

## 环境变量

| 文件 | 说明 |
|------|------|
| `.env` | 基础配置（所有环境共享） |
| `.env.development` | 开发环境配置 |
| `.env.production` | 生产环境配置 |

**常用环境变量**：

```bash
# API 基础路径
VITE_API_BASE_URL=/api

# 代理目标地址
VITE_PROXY_TARGET=http://localhost:3000

# 是否启用 Mock
VITE_MOCK_ENABLED=true
```

## 路径别名

`@` 指向 `src/` 目录，配置在 `vite.config.ts` 和 `vitest.config.ts`：

```ts
resolve: {
  alias: {
    '@': path.resolve(__dirname, 'src'),
  },
},
```

## 代理配置

开发服务器将 `/api` 前缀的请求转发到后端服务（默认 `http://localhost:3000`）：

```ts
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: env.VITE_PROXY_TARGET ?? 'http://localhost:3000',
      changeOrigin: true,
      rewrite: (path: string) => path.replace(/^\/api/, ''),
    },
  },
},
```

## 包管理器

- **pnpm**: 10.33.0+
- **Node.js**: >= 18.18.0

## IDE 配置

### VS Code

自动保存时运行 Prettier 格式化（已配置 `.vscode/settings.json`）。

**必需扩展**：
- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

### Prettier 规则

```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100
}
```

## ESLint 配置

配置文件：`eslint.config.js`

**主要规则**：
- TypeScript 严格模式（类型感知检查）
- React Hooks 规则
- React Refresh 规则
- 与 Prettier 兼容（eslint-config-prettier）

## Git Hooks

使用 Husky + lint-staged：

**pre-commit**：
- 自动运行 ESLint 修复
- 自动运行 Prettier 格式化

**commit-msg**：
- 使用 commitlint 检查提交信息格式

**提交格式**：
```
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式调整
refactor: 重构代码
test: 测试相关
chore: 构建/工具链变更
```
