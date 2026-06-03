# 常见问题

## 1. Tailwind CSS 与 Ant Design 样式冲突

**问题**: Tailwind 的样式重置影响了 Ant Design 组件。

**解决**: 已在 `src/styles/index.css` 中配置兼容性层，详见 [Ant Design 样式指南](./antd-style-guide.md)。

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

## 2. Pro Components 与 Ant Design 版本不匹配

**警告信息**: `unmet peer dependency antd@"^4.24.15 || ^5.11.2"`

**说明**: Pro Components 官方尚未完全支持 Ant Design 6，但目前基本功能正常运行。等待官方更新或使用 Ant Design 5。

## 3. React Router 测试报错

**错误**: `useNavigate() may be used only in the context of a <Router> component.`

**解决**: 测试时使用 `MemoryRouter` 包裹：

```tsx
render(
  <MemoryRouter>
    <YourComponent />
  </MemoryRouter>
)
```

## 4. 图标不显示

**确保已安装**:

```bash
pnpm add @ant-design/icons
```

**正确使用**:

```tsx
import { HomeOutlined } from '@ant-design/icons'

// ✅ 正确：使用组件
{ icon: <HomeOutlined /> }

// ❌ 错误：使用字符串
{ icon: 'HomeOutlined' }
```

## 5. 中文语言包未生效

**检查配置**:

```tsx
// src/config/antd.tsx
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')

<ConfigProvider locale={zhCN}>
  {/* ... */}
</ConfigProvider>
```

## 6. 热更新不生效

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

## 7. MSW Mock API 不生效

**检查 Service Worker**：打开浏览器 DevTools → Application → Service Workers，确认 `mockServiceWorker.js` 已激活。

**重新生成 Worker**：

```bash
npx msw init public --save
```

**确认 main.tsx 启动逻辑**：确保开发环境下 `worker.start()` 在 `createRoot` 之前执行。

## 8. 登录提示"登录失败"

**默认凭证**：账号密码登录使用 `admin` / `123456`，手机号登录任意 11 位手机号 + 任意验证码即可。

**检查 MSW 启动状态**：打开浏览器控制台，应看到 `[MSW] Mocking enabled.` 日志。如未启用，确认 `.env.development` 中 `VITE_MOCK_ENABLED=true`。
