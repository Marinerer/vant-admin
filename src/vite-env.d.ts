/// <reference types="vite/client" />

/**
 * 扩展 Vite 的 ImportMetaEnv 接口，为自定义 VITE_ 前缀环境变量提供类型提示
 * @see https://vitejs.dev/guide/env-and-mode.html#intellisense-for-typescript
 */
interface ImportMetaEnv {
  /** API 基础路径 */
  readonly VITE_API_BASE_URL: string
  /** 应用标题 */
  readonly VITE_APP_TITLE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
