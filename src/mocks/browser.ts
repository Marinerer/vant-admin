/**
 * MSW 浏览器端配置
 * 仅在开发环境启用，拦截 fetch / XMLHttpRequest
 */

import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)

export const startMockWorker = () => {
  if (import.meta.env.VITE_MOCK_ENABLED === 'true') {
    return worker.start({
      onUnhandledRequest: 'bypass',
    })
  } else {
    return Promise.resolve('❌ Mock server is disabled')
  }
}
