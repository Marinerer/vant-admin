import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { AntdProvider } from './config/antd'
import { queryClient } from './services/queryClient'
import { router } from './routes'
import './styles/index.css'

async function bootstrap() {
  // 开发环境启用 MSW mock
  if (import.meta.env.DEV) {
    const { startMockWorker } = await import('./mocks/browser')
    await startMockWorker()
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <AntdProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </AntdProvider>
    </StrictMode>,
  )
}

void bootstrap()
