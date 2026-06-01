# src/utils 工具函数库

> 项目通用工具函数，统一从 `src/utils` 或各子模块导入。

## 目录结构

```
src/utils/
├── index.ts      # 统一导出入口
├── storage.ts    # 本地存储（localStorage / sessionStorage）
├── format.ts     # 格式化（日期、数字、文件大小等）
├── validate.ts   # 验证函数 + Ant Design Form 规则
├── request.ts    # HTTP 请求（axios 实例 + 拦截器）
├── query.ts      # React Query Hooks 封装
└── tree.ts       # 树形数据处理

src/types/
└── common.ts     # 通用类型定义
```

---

## storage — 本地存储

带 `nest_cms_` 前缀隔离，支持过期时间。

```ts
import * as storage from '@/utils/storage'

// 设置（永不过期）
storage.set('user', { id: 1, name: 'admin' })

// 设置（24 小时后过期）
storage.set('token', 'abc123', 1000 * 60 * 60 * 24)

// 获取（自动检测过期，过期返回 null）
const token = storage.get<string>('token')

// 删除 / 清除所有
storage.remove('token')
storage.clearAll()

// sessionStorage
storage.setSession('temp', { draft: true })
storage.getSession('temp')
storage.removeSession('temp')
```

| 函数                          | 说明                               |
| ----------------------------- | ---------------------------------- |
| `set<T>(key, value, expire?)` | 设置 localStorage，expire 为毫秒数 |
| `get<T>(key)`                 | 获取，过期自动清除返回 null        |
| `remove(key)`                 | 删除指定 key                       |
| `clearAll()`                  | 清除所有带前缀的存储               |
| `setSession<T>(key, value)`   | 设置 sessionStorage                |
| `getSession<T>(key)`          | 获取 sessionStorage                |
| `removeSession(key)`          | 删除 sessionStorage                |

---

## format — 格式化

日期基于 `dayjs`，已加载 `relativeTime` 插件。

```ts
import { formatDate, timeAgo, formatNumber, formatFileSize, maskPhone, truncate, capitalize } from '@/utils'

formatDate(new Date())                  // '2024-06-01 12:30:00'
formatDate('2024-06-01', 'YYYY/MM/DD') // '2024/06/01'

timeAgo(Date.now() - 60000)             // '1 分钟前'

formatNumber(1234567)                   // '1,234,567'

formatFileSize(1048576)                 // '1.00 MB'

maskPhone('13812345678')               // '138****5678'

truncate('这是一段很长的文本', 5)        // '这是一段很...'

capitalize('hello')                     // 'Hello'
```

| 函数                     | 说明                                   |
| ------------------------ | -------------------------------------- |
| `formatDate(date, fmt?)` | 日期格式化，默认 `YYYY-MM-DD HH:mm:ss` |
| `timeAgo(date)`          | 相对时间（X 分钟前）                   |
| `formatNumber(num)`      | 千分位分隔                             |
| `formatFileSize(bytes)`  | 文件大小（B/KB/MB/GB/TB）              |
| `maskPhone(phone)`       | 手机号中间四位脱敏                     |
| `truncate(str, maxLen)`  | 字符串截断加省略号                     |
| `capitalize(str)`        | 首字母大写                             |

---

## validate — 验证

提供布尔验证函数和 Ant Design Form 规则生成器。

### 布尔验证

```ts
import { isPhone, isEmail, isUrl, isUsername, isStrongPassword } from '@/utils'

isPhone('13812345678')         // true
isEmail('user@example.com')    // true
isUrl('https://example.com')   // true
isUsername('admin_01')         // true（字母/数字/下划线，4-20 位）
isStrongPassword('abc123')     // true（字母+数字，6-20 位）
```

| 函数                      | 规则                      |
| ------------------------- | ------------------------- |
| `isPhone(value)`          | 中国大陆手机号            |
| `isEmail(value)`          | 邮箱格式                  |
| `isUrl(value)`            | 合法 URL                  |
| `isIdCard(value)`         | 18 位身份证号             |
| `isUsername(value)`       | 字母/数字/下划线，4-20 位 |
| `isStrongPassword(value)` | 字母+数字，6-20 位        |
| `isChinese(value)`        | 纯中文字符                |

### Ant Design Form 规则

```tsx
import { requiredRule, phoneRule, passwordRule } from '@/utils'

<Form.Item name="phone" rules={[requiredRule('请输入手机号'), phoneRule()]}>
  <Input />
</Form.Item>

<Form.Item name="password" rules={[requiredRule('请输入密码'), passwordRule()]}>
  <Input.Password />
</Form.Item>
```

| 函数                           | 说明       |
| ------------------------------ | ---------- |
| `requiredRule(message)`        | 必填       |
| `phoneRule(message?)`          | 手机号格式 |
| `emailRule(message?)`          | 邮箱格式   |
| `urlRule(message?)`            | URL 格式   |
| `minLengthRule(min, message?)` | 最小长度   |
| `maxLengthRule(max, message?)` | 最大长度   |
| `passwordRule(message?)`       | 密码强度   |

---

## request — HTTP 请求

基于 axios 实例，自动注入 Token、统一错误处理。

```ts
import { get, post, put, del } from '@/utils'

// GET
const users = await get<User[]>('/users', { page: 1, status: 'active' })

// POST
const user = await post<User>('/users', { name: '张三', role: 'admin' })

// PUT
await put('/users/1', { name: '李四' })

// DELETE
await del('/users/1')
```

### 配置项

```ts
import { request } from '@/utils'

const data = await request<User>('/users/1', {
  method: 'GET',
  skipAuth: true,   // 跳过 Token 注入
  silent: true,     // 静默错误（不弹 message.error）
  timeout: 30000,   // 自定义超时（ms）
})
```

### 拦截器行为

| 场景                    | 行为                                                        |
| ----------------------- | ----------------------------------------------------------- |
| 请求拦截                | 自动从 storage 读取 token，注入 `Authorization: Bearer xxx` |
| 响应成功但 `code !== 0` | 弹出 `message.error`，抛出 `BizError`                       |
| HTTP 401                | 提示"登录已过期"，清除 token，跳转 `/login`                 |
| HTTP 403/404/500        | 弹出对应提示                                                |
| 网络异常                | 提示"网络连接异常"                                          |

### 自定义 axios 实例

```ts
import { axiosInstance } from '@/utils'

// 添加自定义拦截器
axiosInstance.interceptors.request.use(...)
```

### 后端响应约定

```ts
interface ApiResponse<T> {
  code: number    // 0 = 成功，其他 = 失败
  data: T         // 业务数据
  message: string // 错误消息
}
```

请求函数自动解包 `data` 字段，调用方直接拿到业务数据。

---

## query — React Query Hooks

基于 `@tanstack/react-query` 封装的数据请求 hooks。

### useGet — 快捷查询

```tsx
import { useGet } from '@/utils'

function UserList() {
  const { data: users, isLoading, error } = useGet<User[]>('/users', { page: 1 })

  if (isLoading) return <Spin />
  return <Table dataSource={users} />
}
```

### usePost / usePut / useDelete — 快捷变更

```tsx
import { usePost, useDelete } from '@/utils'

function UserForm() {
  const { mutate: createUser } = usePost<User, CreateUserDto>('/users', {
    invalidateKeys: [['users']], // 成功后自动刷新 ['users'] 查询缓存
  })

  const { mutate: deleteUser } = useDelete<void, number>('/users', {
    invalidateKeys: [['users']],
  })

  return (
    <Button onClick={() => createUser({ name: '张三' })}>新增</Button>
  )
}
```

### useRequest — 通用查询

```tsx
import { useRequest } from '@/utils'
import { get } from '@/utils'

const { data } = useRequest(['dashboard', 'stats'], () =>
  get<Stats>('/dashboard/stats'),
)
```

### useRequestAction — 通用变更

```tsx
import { useRequestAction, useQueryClient } from '@/utils'
import { post } from '@/utils'

const queryClient = useQueryClient()
const mutation = useRequestAction({
  mutationFn: (dto: CreateUserDto) => post<User>('/users', dto),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
})
```

### usePagination — 无限翻页

```tsx
import { usePagination } from '@/utils'

const { data, fetchNextPage, hasNextPage, isLoading } = usePagination<User>(
  ['users'],
  ({ pageParam }) => get<PaginatedData<User>>('/users', { page: pageParam, pageSize: 10 }),
)

// data.pages 包含所有已加载的页
const allUsers = data?.pages.flatMap((page) => page.list) ?? []
```

### Hooks 速查表

| Hook                            | 用途        | 核心参数                         |
| ------------------------------- | ----------- | -------------------------------- |
| `useGet<T>(url, params?)`       | GET 查询    | `queryOptions?` 透传 react-query |
| `usePost<T, V>(url, config?)`   | POST 变更   | `invalidateKeys?` 自动刷新缓存   |
| `usePut<T, V>(url, config?)`    | PUT 变更    | 同上                             |
| `useDelete<T, V>(url, config?)` | DELETE 变更 | 同上                             |
| `useRequest<T>(key, fn)`        | 通用查询    | 完全自定义 queryKey + queryFn    |
| `useRequestAction(opts)`        | 通用变更    | 透传 UseMutationOptions          |
| `usePagination<T>(key, fn)`     | 无限翻页    | 自动计算 `getNextPageParam`      |

---

## tree — 树形数据

CMS 菜单、分类、组织架构等树形结构操作。

```ts
import { listToTree, treeToList, findNode, getNodePath, filterTree, getLeafNodes } from '@/utils'

const flatList = [
  { id: 1, parentId: null, name: '根分类' },
  { id: 2, parentId: 1, name: '子分类 A' },
  { id: 3, parentId: 1, name: '子分类 B' },
  { id: 4, parentId: 2, name: '孙分类 A1' },
]

// 扁平转树形
const tree = listToTree(flatList)

// 树形转扁平
const list = treeToList(tree)

// 查找节点
const node = findNode(tree, (n) => n.name === '子分类 A')

// 获取路径（面包屑）
const path = getNodePath(tree, 4)
// => [{ id:1 }, { id:2 }, { id:4 }]

// 过滤树（搜索）
const filtered = filterTree(tree, (n) => (n.name as string).includes('A'))

// 获取所有叶子节点
const leaves = getLeafNodes(tree)
```

| 函数                          | 说明                             |
| ----------------------------- | -------------------------------- |
| `listToTree(list, rootId?)`   | 扁平数组转树形，rootId 默认 null |
| `treeToList(tree)`            | 树形转扁平数组                   |
| `findNode(tree, predicate)`   | DFS 查找节点                     |
| `getNodePath(tree, targetId)` | 获取根到目标的路径               |
| `filterTree(tree, predicate)` | 过滤树（保留匹配节点及其祖先）   |
| `getLeafNodes(tree)`          | 获取所有叶子节点                 |

### TreeNode 接口

```ts
interface TreeNode {
  id: string | number
  parentId?: string | number | null
  children?: TreeNode[]
  [key: string]: unknown  // 允许扩展任意字段
}
```

---

## types/common — 通用类型

```ts
import type { PaginatedResponse, KeyValue, ID, Status, UploadResult } from '@/types/common'

// 分页响应
interface PaginatedResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

// 键值对（下拉选项等）
interface KeyValue {
  label: string
  value: string | number
}

// 工具类型
type PartialBy<T, K extends keyof T>   // 使部分字段可选
type RequiredBy<T, K extends keyof T>  // 使部分字段必填
```

| 类型                       | 说明                     |
| -------------------------- | ------------------------ |
| `PaginationParams`         | `{ page, pageSize }`     |
| `PaginatedResponse<T>`     | 分页响应结构             |
| `KeyValue`                 | 通用键值对               |
| `ID`                       | `string \| number`       |
| `Status`                   | `'active' \| 'inactive'` |
| `SortOrder` / `SortParams` | 排序方向与参数           |
| `UploadResult`             | 文件上传响应             |
| `MaybePromise<T>`          | `T \| Promise<T>`        |
| `PartialBy<T, K>`          | 使部分字段可选           |
| `RequiredBy<T, K>`         | 使部分字段必填           |
