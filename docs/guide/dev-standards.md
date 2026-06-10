# 开发规范

## 代码风格

- 使用 TypeScript 严格模式
- 遵循 ESLint 规则（含类型感知检查）
- 组件使用函数式声明
- 使用 ES Module 导入导出

## 代码格式化

保存文件时 VS Code 会自动运行 Prettier 格式化（已配置 `.vscode/settings.json`）。

> **前提**：需安装 VS Code 扩展 [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)（`esbenp.prettier-vscode`）

```bash
# 手动检查 ESLint
pnpm lint

# 自动修复 ESLint 问题
pnpm lint:fix

# 手动格式化所有源码
pnpm format
```

**Prettier 主要规则**（见 `.prettierrc`）：
- 无分号（`semi: false`）
- 单引号（`singleQuote: true`）
- 尾逗号（`trailingComma: all`）
- 行宽 100 字符（`printWidth: 100`）

## 命名规范

- **组件**: PascalCase（如 `UserList.tsx`）
- **Hooks**: camelCase，以 `use` 开头（如 `useAppStore`）
- **常量**: UPPER_SNAKE_CASE
- **变量/函数**: camelCase
- **类型/接口**: PascalCase

## 目录规范

- 每个功能模块独立目录
- 组件、样式、测试文件放在一起
- 公共组件放在 `src/components/`

## Git 提交规范

```
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式调整
refactor: 重构代码
test: 测试相关
chore: 构建/工具链变更
```

## 代码质量要求

### TypeScript 规范

- 禁止使用 `any` 类型，使用 `unknown` 替代
- 函数必须有明确的返回类型标注
- 接口优先于类型别名（`interface` vs `type`）
- 使用 `readonly` 修饰不可变数据

### React 规范

- 组件使用函数式声明，禁止类组件
- 使用 `React.FC` 或直接函数声明
- Props 接口以组件名 + `Props` 命名（如 `UserCardProps`）
- 使用 `useCallback` 和 `useMemo` 优化性能（避免不必要的重渲染）

### 错误处理

- 异步操作必须有 `try/catch` 或 `.catch()` 处理
- 使用 `message.error()` 显示用户友好的错误信息
- 记录详细错误信息到控制台（开发环境）

### 测试规范

- 测试文件与源文件同目录，命名为 `*.test.ts` 或 `*.test.tsx`
- 使用 `describe` 和 `it` 组织测试用例
- 每个测试用例必须有明确的断言
- 使用 MSW mock API 请求，避免真实网络调用

### 样式规范

- 优先使用 Tailwind CSS 类名
- 避免内联样式，除非是动态计算的值
- 与 Ant Design 组件混用时，注意样式优先级

### 导入规范

- 使用 `@/` 路径别名导入 `src/` 目录下的模块
- 第三方库导入在前，本地模块导入在后
- 使用 `type` 关键字导入纯类型（如 `import type { User } from './types'`）
