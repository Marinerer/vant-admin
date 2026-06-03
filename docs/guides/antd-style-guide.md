# Ant Design 样式指南

> Tailwind CSS 与 Ant Design 共存时的样式修复、覆盖方案和最佳实践。

## 目录

- [Tailwind + Ant Design 最佳实践](#tailwind--ant-design-最佳实践)
- [样式修复与覆盖方案](#样式修复与覆盖方案)
  - [1. 全局兼容性层](#1-全局兼容性层srcstylesindexcss)
  - [2. Tailwind ! 前缀覆盖](#2-使用-tailwind--前缀覆盖-ant-design-默认样式)
  - [3. ConfigProvider 全局主题定制](#3-通过-configprovider-全局主题定制srcconfigantdtsx)
  - [4. 组件级主题覆盖](#4-组件级主题覆盖)
  - [5. Input 组件注意事项](#5-input-组件注意事项)
  - [6. ProLayout 图标规范](#6-prolayout-图标必须传入-react-组件)
  - [7. 颜色系统映射](#7-颜色系统映射srcconfigthemets)
  - [8. 常见样式问题速查](#8-常见样式问题速查)

---

## Tailwind + Ant Design 最佳实践

### 1. 布局使用 Tailwind

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
  {/* 响应式网格布局 */}
</div>
```

### 2. 组件使用 Ant Design

```tsx
import { Card, Button, Table } from 'antd'

<Card title="统计卡片">
  <Table dataSource={data} columns={columns} />
</Card>
```

### 3. 样式覆盖规范

使用 `!` 前缀覆盖 Ant Design 默认样式：

```tsx
<Title level={4} className="!mb-0 !mt-2">
  标题
</Title>
```

### 4. 颜色系统

参考 `src/config/theme.ts` 中的颜色映射：

```tsx
// 使用 Tailwind 颜色
<div className="bg-blue-500 text-white">

// 使用 Ant Design 颜色
<Button type="primary">主要按钮</Button>
```

---

## 样式修复与覆盖方案

本项目同时使用 Tailwind CSS 和 Ant Design，两者可能存在样式冲突。以下是已采用的修复方案和最佳实践。

### 1. 全局兼容性层（`src/styles/index.css`）

Tailwind CSS 的 Preflight 重置会破坏 Ant Design 组件的默认样式，已通过以下三层防护解决：

```css
/* ① Base 层：防止 Tailwind 重置 Ant Design 表单和按钮样式 */
@layer base {
  button:not(:disabled),
  [role="button"]:not(:disabled) {
    all: unset;
  }
  input, textarea, select {
    all: revert;
  }
}

/* ② Components 层：为 Ant Design 组件补充 Tailwind 兼容样式 */
@layer components {
  .ant-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
}

/* ③ Utilities 层：仅对非 Ant Design 元素应用 box-sizing 重置 */
@layer utilities {
  *:not([class^="ant-"]):not([class*=" ant-"]) {
    box-sizing: border-box;
  }
}
```

**原理说明**：
- `all: unset` 将 `<button>` 的浏览器默认样式清除，让 Ant Design 自己的样式生效
- `all: revert` 将 `<input>` 等表单元素回退到浏览器默认，避免 Tailwind 重置导致输入框样式异常
- `box-sizing` 选择器通过 `[class^="ant-"]` 排除所有 Ant Design 组件，避免覆盖其内部盒模型

### 2. 使用 Tailwind `!` 前缀覆盖 Ant Design 默认样式

Ant Design 组件自带的 `margin` / `padding` 等间距通常通过内联样式或高优先级 CSS 设置，使用 Tailwind 的 `!important` 前缀可以可靠覆盖：

```tsx
{/* 移除 Typography 默认的上下边距 */}
<Title level={4} className="!mb-0 !mt-1">统计数值</Title>

{/* 移除标题默认底部间距 */}
<Title level={2} className="!mb-2 !text-gray-800">页面标题</Title>

{/* 调整 Button 内边距 */}
<Button type="link" size="small" className="!px-2">获取验证码</Button>
```

> **规范**：覆盖 Ant Design 默认样式时，**必须**使用 `!` 前缀（如 `!mb-0`），否则样式可能不生效。

### 3. 通过 ConfigProvider 全局主题定制（`src/config/antd.tsx`）

优先通过 `ConfigProvider` 的 `theme.token` 修改全局 Design Token，而非逐组件覆盖样式：

```tsx
<ConfigProvider
  locale={zhCN}
  theme={{
    token: {
      colorPrimary: '#1677ff',   // 主色调
      borderRadius: 6,           // 全局圆角
      fontSize: 14,              // 全局字号
      lineHeight: 1.6,           // 全局行高
    },
    algorithm: theme.defaultAlgorithm,
  }}
  componentSize="middle"
>
  {children}
</ConfigProvider>
```

**可定制的 Token 类别**：
- **颜色 Token**：`colorPrimary`、`colorSuccess`、`colorWarning`、`colorError` 等
- **尺寸 Token**：`borderRadius`、`fontSize`、`controlHeight` 等
- **间距 Token**：`margin`、`padding`、`paddingContentHorizontal` 等

### 4. 组件级主题覆盖

针对单个组件定制样式，使用 `ConfigProvider` 的 `theme.components` 而非 CSS 选择器：

```tsx
<ConfigProvider
  theme={{
    components: {
      Button: {
        primaryShadow: 'none',        // 移除主按钮阴影
        borderRadiusLG: 8,            // 大号按钮圆角
      },
      Card: {
        borderRadiusLG: 12,           // 卡片圆角
      },
      Input: {
        // 字体大小使用 CSS 变量，确保与框架默认一致
        // fontSize: var(--ant-input-input-font-size)
      },
    },
  }}
>
  {children}
</ConfigProvider>
```

### 5. Input 组件注意事项

- `addonAfter` 属性已弃用，使用 `suffix` 替代
- 自定义字体大小时，应使用 CSS 变量 `var(--ant-input-input-font-size)` 保持与框架一致

```tsx
{/* ✅ 使用 suffix 代替 addonAfter */}
<Input
  prefix={<UserOutlined />}
  suffix={<Button type="link" size="small">发送</Button>}
/>
```

### 6. ProLayout 图标必须传入 React 组件

ProLayout 的 `icon` 属性**必须传入 React 组件**，传字符串将不显示：

```tsx
import { HomeOutlined } from '@ant-design/icons'

// ✅ 正确
{ path: '/', name: 'Dashboard', icon: <HomeOutlined /> }

// ❌ 错误 — 图标不会渲染
{ path: '/', name: 'Dashboard', icon: 'HomeOutlined' }
```

### 7. 颜色系统映射（`src/config/theme.ts`）

项目维护了一份 Ant Design Token 与 Tailwind 颜色的映射表，确保两套系统视觉一致：

| Tailwind 类名     | Ant Design Token     | 色值      | 用途     |
| ----------------- | -------------------- | --------- | -------- |
| `bg-blue-500`     | `colorPrimary`       | `#1677ff` | 主色调   |
| `bg-gray-100`     | `colorBgLayout`      | `#f5f5f5` | 布局背景 |
| `text-gray-500`   | `colorTextSecondary` | `#8c8c8c` | 次要文字 |
| `text-gray-800`   | `colorText`          | `#262626` | 主要文字 |
| `border-gray-200` | `colorBorder`        | `#eeeeee` | 边框     |

完整映射关系参见 `src/config/theme.ts`。

### 8. 常见样式问题速查

| 问题                             | 原因                                 | 解决方案                                             |
| -------------------------------- | ------------------------------------ | ---------------------------------------------------- |
| Ant Design 按钮样式丢失          | Tailwind Preflight 重置了 `<button>` | `@layer base` 中 `all: unset`                        |
| Input / Select 无边框            | Tailwind 重置了表单元素              | `@layer base` 中 `all: revert`                       |
| Tailwind `mb-4` 对 AntD 组件无效 | AntD 内部样式优先级更高              | 使用 `!mb-4`（`!important`）                         |
| 卡片圆角不统一                   | 未通过 Token 全局配置                | 在 `theme.components.Card` 中统一设置                |
| ProLayout 图标不显示             | 传入了字符串而非组件                 | 传入 `<HomeOutlined />` 等 React 组件                |
| 按钮内图标和文字不对齐           | `display` 不一致                     | `@layer components` 中 `.ant-btn` 设为 `inline-flex` |
