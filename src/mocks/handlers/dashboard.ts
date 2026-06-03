/**
 * 仪表盘 Mock Handlers
 * GET /api/dashboard/stats - 获取仪表盘统计数据
 */

import { http, HttpResponse, delay } from 'msw'
import { dashboardStats, ok } from '../data'

export const dashboardHandlers = [
  http.get('/api/dashboard/stats', async () => {
    await delay(300)
    return HttpResponse.json(ok(dashboardStats))
  }),
]
