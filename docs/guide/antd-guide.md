# Ant Design 使用指南

> Tailwind CSS 与 Ant Design 共存时的样式修复、覆盖方案、组件使用规范和最佳实践。

## 目录

- [Ant Design 使用指南](#ant-design-使用指南)
  - [目录](#目录)
  - [组件使用规范](#组件使用规范)
    - [反馈组件选择](#反馈组件选择)
    - [表单承载方式](#表单承载方式)
    - [加载与空状态](#加载与空状态)
    - [组件使用要点](#组件使用要点)
      - [Table / ProTable](#table--protable)
      - [Form / ProForm](#form--proform)
  - [Tailwind + Ant Design 最佳实践](#tailwind--ant-design-最佳实践)
    - [1. 布局使用 Tailwind](#1-布局使用-tailwind)
    - [2. 组件使用 Ant Design](#2-组件使用-ant-design)
    - [3. 样式覆盖规范](#3-样式覆盖规范)
    - [4. 颜色系统](#4-颜色系统)
  - [样式修复与覆盖方案](#样式修复与覆盖方案)
    - [1. 全局兼容性层（`src/styles/index.css`）](#1-全局兼容性层srcstylesindexcss)
    - [2. 使用 Tailwind `!` 前缀覆盖 Ant Design 默认样式](#2-使用-tailwind--前缀覆盖-ant-design-默认样式)
    - [3. 通过 ConfigProvider 全局主题定制（`src/config/antd.tsx`）](#3-通过-configprovider-全局主题定制srcconfigantdtsx)
    - [4. 组件级主题覆盖](#4-组件级主题覆盖)
    - [5. Input 组件注意事项](#5-input-组件注意事项)
    - [6. ProLayout 图标必须传入 React 组件](#6-prolayout-图标必须传入-react-组件)
    - [7. 颜色系统映射（`src/config/theme.ts`）](#7-颜色系统映射srcconfigthemets)
    - [8. 常见样式问题速查](#8-常见样式问题速查)


---


## 组件使用规范

### 反馈组件选择

根据操作的严重程度和耗时，选择对应的反馈组件：

| 场景         | 组件            | 说明                       |
| ------------ | --------------- | -------------------------- |
| 即时反馈     | `message`       | 成功/失败提示，3秒自动消失 |
| 后台任务完成 | `notification`  | 需用户知晓但不打断操作     |
| 复杂操作结果 | `Result`        | 独立页面展示最终结果       |
| 轻量危险操作 | `Popconfirm`    | 单行数据删除等             |
| 重度确认操作 | `Modal.confirm` | 批量删除、不可逆操作       |

### 表单承载方式

根据字段数量选择合适的承载方式：

- **≤5 字段**：使用 `Modal`（重命名、简单配置）
- **6~12 字段**：使用 `Drawer`（详情编辑、中等复杂度）
- **>12 字段**：使用独立页面（复杂配置、文章发布）

> **状态清理**：Modal/Drawer 必须使用 `destroyOnClose` 或受控 `open` 配合 `form.resetFields()`，防止脏数据残留。

### 加载与空状态

- **首次加载**：优先使用 `Skeleton`（骨架屏）替代 `Spin`，减少白屏闪烁感
- **局部加载**：使用组件自带 `loading` 属性，禁止全屏遮挡
- **防抖处理**：搜索框必须使用 `debounce` (300-500ms)
- **防重复点击**：提交按钮必须立即设置 `loading={true}`
- **空状态**：必须使用 `Empty` 组件并提供引导操作

### 组件使用要点

#### Table / ProTable

- 必须指定 `rowKey` 属性
- 大数据量使用 `scroll={{ x: 'max-content' }}` 或虚拟滚动
- 优先使用 `ProTable` 替代原生 `Table`

#### Form / ProForm

- 优先使用 `ProForm` / `ModalForm` / `DrawerForm`
- 复杂联动使用 `Form.useWatch` 替代 `onValuesChange`
- 提交按钮必须绑定 `htmlType="submit"`

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
