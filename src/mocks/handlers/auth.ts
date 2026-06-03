/**
 * 认证相关 Mock Handlers
 * POST /api/auth/login  - 用户登录
 * POST /api/auth/logout - 用户登出
 * GET  /api/auth/me     - 获取当前用户信息
 */

import { http, HttpResponse, delay } from 'msw'
import { validCredentials, ok, fail } from '../data'

export const authHandlers = [
  // 用户登录（支持账号密码 + 手机号验证码）
  http.post('/api/auth/login', async ({ request }) => {
    await delay(600)

    const body = (await request.json()) as {
      username?: string
      password?: string
      phone?: string
      code?: string
    }

    // 手机号登录
    if (body.phone) {
      if (!body.code) {
        return HttpResponse.json(fail(400, '验证码不能为空'), { status: 400 })
      }

      return HttpResponse.json(
        ok({
          accessToken: 'mock_access_token_' + Date.now(),
          refreshToken: 'mock_refresh_token_' + Date.now(),
          user: {
            id: '3',
            name: '手机用户' + body.phone.slice(-4),
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + body.phone,
            role: 'user',
          },
        }),
      )
    }

    // 账号密码登录
    const { username, password } = body

    if (!username || !password) {
      return HttpResponse.json(fail(400, '用户名和密码不能为空'), { status: 400 })
    }

    if (username === validCredentials.username && password === validCredentials.password) {
      return HttpResponse.json(
        ok({
          accessToken: 'mock_access_token_' + Date.now(),
          refreshToken: 'mock_refresh_token_' + Date.now(),
          user: {
            id: '1',
            name: username,
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
            role: 'admin',
          },
        }),
      )
    }

    // 任意非 admin 用户也能登录（演示用）
    return HttpResponse.json(
      ok({
        accessToken: 'mock_access_token_' + Date.now(),
        refreshToken: 'mock_refresh_token_' + Date.now(),
        user: {
          id: '2',
          name: username,
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + username,
          role: 'user',
        },
      }),
    )
  }),

  // 用户登出
  http.post('/api/auth/logout', async () => {
    await delay(200)
    return HttpResponse.json(ok(null))
  }),

  // 获取当前用户信息
  http.get('/api/auth/me', async ({ request }) => {
    await delay(300)

    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return HttpResponse.json(fail(401, '未登录或 Token 已过期'), { status: 401 })
    }

    return HttpResponse.json(
      ok({
        id: '1',
        name: 'admin',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
        role: 'admin',
      }),
    )
  }),
]
