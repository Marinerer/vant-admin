/**
 * Token 存取工具函数
 * 统一管理 accessToken / refreshToken 的读取、设置与清除
 */

import { get, set, remove } from './storage'

const ACCESS_TOKEN_KEY = 'token'
const REFRESH_TOKEN_KEY = 'refresh_token'

/** 默认 token 过期时间：7 天（毫秒） */
const DEFAULT_EXPIRE = 1000 * 60 * 60 * 24 * 7

// ============ Access Token ============

/** 获取 accessToken，不存在或已过期返回 null */
export function getToken(): string | null {
  return get<string>(ACCESS_TOKEN_KEY)
}

/**
 * 设置 accessToken
 * @param token  token 值
 * @param expire 过期时间（毫秒），默认 7 天
 */
export function setToken(token: string, expire?: number): void {
  set(ACCESS_TOKEN_KEY, token, expire ?? DEFAULT_EXPIRE)
}

/** 清除 accessToken */
export function removeToken(): void {
  remove(ACCESS_TOKEN_KEY)
}

// ============ Refresh Token ============

/** 获取 refreshToken，不存在或已过期返回 null */
export function getRefreshToken(): string | null {
  return get<string>(REFRESH_TOKEN_KEY)
}

/**
 * 设置 refreshToken
 * @param token  token 值
 * @param expire 过期时间（毫秒），默认 7 天
 */
export function setRefreshToken(token: string, expire?: number): void {
  set(REFRESH_TOKEN_KEY, token, expire ?? DEFAULT_EXPIRE)
}

/** 清除 refreshToken */
export function removeRefreshToken(): void {
  remove(REFRESH_TOKEN_KEY)
}

// ============ 批量操作 ============

/** 清除所有 token（accessToken + refreshToken） */
export function clearTokens(): void {
  removeToken()
  removeRefreshToken()
}
