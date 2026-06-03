import { defineConfig, loadEnv } from 'vite'
import path from 'node:path'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 加载对应模式的 .env 文件（如 .env.development / .env.production）
  const env = loadEnv(mode, process.cwd(), '')

  return {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },

    // 开发服务器配置
    server: {
      port: 5173,
      // 跨域代理：将 /api 前缀的请求转发到后端服务
      proxy: {
        '/api': {
          target: env.VITE_PROXY_TARGET ?? 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/api/, ''),
        },
      },
    },

    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] }),
      tailwindcss(),
      mode === 'analyze' &&
        visualizer({
          open: true,
          filename: 'dist/stats.html',
          gzipSize: true,
          brotliSize: true,
        }),
    ],
    build: {
      rolldownOptions: {
        output: {
          manualChunks(id: string) {
            if (
              id.includes('node_modules/react-dom') ||
              id.includes('node_modules/react/') ||
              id.includes('node_modules/react-router')
            ) {
              return 'react-vendor'
            }
            if (id.includes('node_modules/antd') || id.includes('node_modules/@ant-design')) {
              return 'antd-vendor'
            }
          },
        },
      },
    },
  }
})
