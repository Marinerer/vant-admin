import { defineConfig } from 'vite'
import path from 'node:path'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { DevTools } from '@vitejs/devtools'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig(async ({ mode }) => ({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
    await DevTools(),
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
}))
