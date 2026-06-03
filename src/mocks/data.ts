/**
 * MSW Mock 数据层
 * 所有 mock handler 共享的数据定义
 */

// ============ 用户数据类型 ============

export interface MockUser {
  id: number
  name: string
  email: string
  role: 'admin' | 'user' | 'editor'
  status: 'active' | 'inactive'
  phone: string
  createdAt: string
}

// ============ 用户数据 ============

/** 创建初始用户数据（每次调用返回全新数组，避免测试间状态泄漏） */
export function createInitialUsers(): MockUser[] {
  return [
    {
      id: 1,
      name: '张三',
      email: 'zhangsan@example.com',
      role: 'admin',
      status: 'active',
      phone: '13800000001',
      createdAt: '2024-01-15',
    },
    {
      id: 2,
      name: '李四',
      email: 'lisi@example.com',
      role: 'user',
      status: 'active',
      phone: '13800000002',
      createdAt: '2024-02-20',
    },
    {
      id: 3,
      name: '王五',
      email: 'wangwu@example.com',
      role: 'editor',
      status: 'inactive',
      phone: '13800000003',
      createdAt: '2024-03-10',
    },
    {
      id: 4,
      name: '赵六',
      email: 'zhaoliu@example.com',
      role: 'user',
      status: 'active',
      phone: '13800000004',
      createdAt: '2024-04-05',
    },
    {
      id: 5,
      name: '孙七',
      email: 'sunqi@example.com',
      role: 'editor',
      status: 'active',
      phone: '13800000005',
      createdAt: '2024-05-12',
    },
    {
      id: 6,
      name: '周八',
      email: 'zhouba@example.com',
      role: 'user',
      status: 'inactive',
      phone: '13800000006',
      createdAt: '2024-06-18',
    },
    {
      id: 7,
      name: '吴九',
      email: 'wujiu@example.com',
      role: 'admin',
      status: 'active',
      phone: '13800000007',
      createdAt: '2024-07-22',
    },
    {
      id: 8,
      name: '郑十',
      email: 'zhengshi@example.com',
      role: 'user',
      status: 'active',
      phone: '13800000008',
      createdAt: '2024-08-30',
    },
  ]
}

// ============ 仪表盘统计数据 ============

export const dashboardStats = {
  totalUsers: 1234,
  activeUsers: 892,
  pendingTasks: 56,
  completionRate: 98.5,
}

// ============ 登录凭证 ============

export const validCredentials = {
  username: 'admin',
  password: '123456',
}

// ============ 工具函数 ============

/** 生成标准 API 成功响应 */
export function ok<T>(data: T, message = 'success') {
  return { code: 0, data, message }
}

/** 生成标准 API 错误响应 */
export function fail(code: number, message: string) {
  return { code, data: null, message }
}
