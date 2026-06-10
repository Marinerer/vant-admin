# Git 工作流规则

## 分支策略
- `main`：生产分支，保持可发布状态，禁止直接推送
- `develop`：开发主分支，日常开发合并到此
- `feature/<name>`：功能分支，从 `develop` 切出，完成后 PR 合并回 `develop`
- `fix/<name>`：修复分支，从 `develop` 或 `main` 切出
- `release/<version>`：发布分支，从 `develop` 切出，测试通过后合并到 `main` 和 `develop`

## Commit Message
- 格式：`<type>(<scope>): <description>`
- type：`feat`（新功能）、`fix`（修复）、`docs`（文档）、`style`（格式）、`refactor`（重构）、`test`（测试）、`chore`（构建/工具）
- scope：模块名（如 `auth`、`content`、`attachment`）
- 示例：`feat(content): 添加内容定时发布功能`

## PR 规范
- 标题与 commit message 格式一致
- 描述中说明改动内容、影响范围、测试方式
- 确保 lint 和测试通过后再提交 PR
