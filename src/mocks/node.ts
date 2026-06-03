/**
 * MSW Node 端配置
 * 用于 Vitest 单元测试环境，拦截服务端请求
 */

import { setupServer } from 'msw/node'
import { handlers } from './handlers'
import { resetUserData } from './handlers/users'

export const server = setupServer(...handlers)
export const isMockEnabled = import.meta.env.VITE_MOCK_ENABLED === 'true'

/**
 * 启动 Mock 服务
 */
export const startMockServer = () => {
  if (isMockEnabled) {
    server.listen({
      onUnhandledRequest: 'bypass',
    })
    console.log('✅ Mock服务已全局启用')
  }
}

/**
 * 重置 Mock 服务，用于重新加载数据
 */
export const resetMockServer = () => {
  if (isMockEnabled) {
    server.resetHandlers()
    resetUserData()
    console.log('✅ Mock服务已重置')
  }
}

/**
 * 停止 Mock 服务
 */
export const stopMockServer = () => {
  if (isMockEnabled) {
    server.close()
    console.log('✅ Mock服务已停止')
  }
}
