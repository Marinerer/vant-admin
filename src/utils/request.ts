/**
 * HTTP 请求封装
 * 基于 axios 实例，支持请求/响应拦截器、Token 自动注入、统一错误处理
 */

import axios, { AxiosError } from 'axios'
import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { message } from 'antd'
import { getToken, removeToken } from './token'

// ============ 类型定义 ============

/** 后端标准响应结构 */
export interface ApiResponse<T = unknown> {
  code: number
  data: T
  message: string
}

/** 扩展 axios 请求配置 */
export interface RequestConfig extends AxiosRequestConfig {
  /** 是否跳过 Token 注入，默认 false（即默认携带 token） */
  skipAuth?: boolean
  /** 是否静默错误（不弹 message.error），默认 false */
  silent?: boolean
}

/** 业务逻辑错误 */
export class BizError extends Error {
  public code: number
  public msg: string

  constructor(code: number, msg: string) {
    super(`BizError ${code}: ${msg}`)
    this.name = 'BizError'
    this.code = code
    this.msg = msg
  }
}

// ============ axios 实例 ============

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '/api'

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
})

// ============ 请求拦截器 ============

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig & { skipAuth?: boolean }) => {
    if (!config.skipAuth) {
      const token = getToken()
      if (token) {
        config.headers.set('Authorization', `Bearer ${token}`)
      }
    }
    return config
  },
  (error: unknown) => Promise.reject(error instanceof Error ? error : new Error(String(error))),
)

// ============ 响应拦截器 ============

instance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { data: body, config } = response
    const silent = (config as RequestConfig).silent

    // 无 body（204 等）直接返回
    if (body === null || body === undefined) return response

    // 后端约定 code === 0 为成功
    if (body.code !== undefined && body.code !== 0) {
      if (!silent) message.error(body.message || '请求失败')
      return Promise.reject(new BizError(body.code, body.message))
    }

    return response
  },
  (error: AxiosError & { config?: RequestConfig }) => {
    // 请求配置中的 silent 标记可抑制错误提示
    const silent = error.config?.silent

    if (axios.isCancel(error))
      return Promise.reject(error instanceof Error ? error : new Error(String(error)))

    if (!silent) {
      if (error.response) {
        const status = error.response.status
        const msgMap: Partial<Record<number, string>> = {
          401: '登录已过期，请重新登录',
          403: '没有权限访问',
          404: '请求的资源不存在',
          500: '服务器内部错误',
        }
        message.error(msgMap[status] ?? `请求失败 (${status})`)

        // 401 自动跳转登录
        if (status === 401) {
          removeToken()
          window.location.href = '/login'
        }
      } else {
        message.error('网络连接异常，请检查网络')
      }
    }

    return Promise.reject(error)
  },
)

// ============ 请求函数 ============

/**
 * 通用请求函数，自动解包 ApiResponse.data
 * @example
 * const users = await request<User[]>('/users', { params: { page: 1 } })
 */
export async function request<T>(url: string, config?: RequestConfig): Promise<T> {
  const response = await instance.request<ApiResponse<T>>({
    url,
    ...config,
  })

  // 204 No Content
  if (response.status === 204) return undefined as T

  const body = response.data
  return body?.data !== undefined ? body.data : (body as T)
}

// ============ 快捷方法 ============

export function get<T>(url: string, params?: Record<string, unknown>, config?: RequestConfig) {
  return request<T>(url, { ...config, method: 'GET', params })
}

export function post<T>(url: string, data?: unknown, config?: RequestConfig) {
  return request<T>(url, { ...config, method: 'POST', data })
}

export function put<T>(url: string, data?: unknown, config?: RequestConfig) {
  return request<T>(url, { ...config, method: 'PUT', data })
}

export function del<T>(url: string, config?: RequestConfig) {
  return request<T>(url, { ...config, method: 'DELETE' })
}

/** 导出 axios 实例，供需要自定义的场景使用 */
export { instance as axiosInstance }
