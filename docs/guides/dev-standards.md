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
