/**
 * 用户管理 Mock Handlers
 * GET    /api/users     - 获取用户列表（分页 + 搜索）
 * POST   /api/users     - 新增用户
 * PUT    /api/users/:id - 编辑用户
 * DELETE /api/users/:id - 删除用户
 */

import { http, HttpResponse, delay } from 'msw'
import { createInitialUsers, ok, fail } from '../data'
import type { MockUser } from '../data'

/** 模块级可变副本，handler 内部使用；可通过 resetUserData 重置 */
let users = createInitialUsers()

/** 重置用户数据到初始状态（用于测试 afterEach） */
export function resetUserData() {
  users = createInitialUsers()
}

export const userHandlers = [
  // 获取用户列表（分页 + 搜索）
  http.get('/api/users', async ({ request }) => {
    await delay(400)

    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('current') ?? '1', 10)
    const pageSize = parseInt(url.searchParams.get('pageSize') ?? '10', 10)
    const keyword = url.searchParams.get('name')?.trim() ?? ''

    let filtered = users
    if (keyword) {
      filtered = users.filter((u) => u.name.includes(keyword))
    }

    const total = filtered.length
    const start = (page - 1) * pageSize
    const paged = filtered.slice(start, start + pageSize)

    return HttpResponse.json(
      ok({
        list: paged,
        total,
        current: page,
        pageSize,
      }),
    )
  }),

  // 新增用户
  http.post('/api/users', async ({ request }) => {
    await delay(500)

    const body = (await request.json()) as Partial<MockUser>
    const newUser: MockUser = {
      id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
      name: body.name ?? '',
      email: body.email ?? '',
      role: body.role ?? 'user',
      status: body.status ?? 'active',
      phone: body.phone ?? '',
      createdAt: new Date().toISOString().slice(0, 10),
    }

    users.unshift(newUser)
    return HttpResponse.json(ok(newUser))
  }),

  // 编辑用户
  http.put('/api/users/:id', async ({ request, params }) => {
    await delay(400)

    const id = Number(params.id)
    const body = (await request.json()) as Partial<MockUser>
    const index = users.findIndex((u) => u.id === id)

    if (index === -1) {
      return HttpResponse.json(fail(404, '用户不存在'), { status: 404 })
    }

    users[index] = { ...users[index], ...body }
    return HttpResponse.json(ok(users[index]))
  }),

  // 删除用户
  http.delete('/api/users/:id', async ({ params }) => {
    await delay(300)

    const id = Number(params.id)
    const index = users.findIndex((u) => u.id === id)

    if (index === -1) {
      return HttpResponse.json(fail(404, '用户不存在'), { status: 404 })
    }

    users.splice(index, 1)
    return HttpResponse.json(ok(null))
  }),
]
