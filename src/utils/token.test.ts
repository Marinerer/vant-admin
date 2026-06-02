import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  getToken,
  setToken,
  removeToken,
  getRefreshToken,
  setRefreshToken,
  removeRefreshToken,
  clearTokens,
} from './token'

const PREFIX = 'vant_'
const ACCESS_KEY = PREFIX + 'token'
const REFRESH_KEY = PREFIX + 'refresh_token'

beforeEach(() => {
  localStorage.clear()
})

// ============ Access Token ============

describe('setToken & getToken', () => {
  it('存取 token', () => {
    setToken('abc123')
    expect(getToken()).toBe('abc123')
  })

  it('不存在时返回 null', () => {
    expect(getToken()).toBeNull()
  })

  it('默认 7 天过期', () => {
    setToken('default_expire')
    const raw = localStorage.getItem(ACCESS_KEY)
    expect(raw).not.toBeNull()

    const data = JSON.parse(raw!) as { value: string; expire: number }
    expect(data.expire).toBeGreaterThan(Date.now() + 1000 * 60 * 60 * 24 * 6)
    expect(data.expire).toBeLessThanOrEqual(Date.now() + 1000 * 60 * 60 * 24 * 7 + 1000)
  })

  it('自定义过期时间', () => {
    setToken('custom', 1000 * 60) // 1分钟
    const data = JSON.parse(localStorage.getItem(ACCESS_KEY)!) as { expire: number }
    expect(data.expire).toBeGreaterThan(Date.now())
    expect(data.expire).toBeLessThanOrEqual(Date.now() + 1000 * 60 + 1000)
  })

  it('key 带前缀存储', () => {
    setToken('test')
    expect(localStorage.getItem(ACCESS_KEY)).not.toBeNull()
    expect(localStorage.getItem('token')).toBeNull()
  })
})

describe('removeToken', () => {
  it('清除 accessToken', () => {
    setToken('toRemove')
    expect(getToken()).toBe('toRemove')

    removeToken()
    expect(getToken()).toBeNull()
  })

  it('不存在时调用不报错', () => {
    expect(() => removeToken()).not.toThrow()
  })
})

// ============ Refresh Token ============

describe('setRefreshToken & getRefreshToken', () => {
  it('存取 refreshToken', () => {
    setRefreshToken('refresh_abc')
    expect(getRefreshToken()).toBe('refresh_abc')
  })

  it('不存在时返回 null', () => {
    expect(getRefreshToken()).toBeNull()
  })

  it('默认 7 天过期', () => {
    setRefreshToken('default_expire')
    const raw = localStorage.getItem(REFRESH_KEY)
    expect(raw).not.toBeNull()

    const data = JSON.parse(raw!) as { expire: number }
    expect(data.expire).toBeGreaterThan(Date.now() + 1000 * 60 * 60 * 24 * 6)
  })

  it('自定义过期时间', () => {
    setRefreshToken('custom', 1000 * 60 * 30) // 30分钟
    const data = JSON.parse(localStorage.getItem(REFRESH_KEY)!) as { expire: number }
    expect(data.expire).toBeLessThanOrEqual(Date.now() + 1000 * 60 * 30 + 1000)
  })

  it('key 带前缀存储', () => {
    setRefreshToken('test')
    expect(localStorage.getItem(REFRESH_KEY)).not.toBeNull()
    expect(localStorage.getItem('refresh_token')).toBeNull()
  })
})

describe('removeRefreshToken', () => {
  it('清除 refreshToken', () => {
    setRefreshToken('toRemove')
    expect(getRefreshToken()).toBe('toRemove')

    removeRefreshToken()
    expect(getRefreshToken()).toBeNull()
  })

  it('不存在时调用不报错', () => {
    expect(() => removeRefreshToken()).not.toThrow()
  })
})

// ============ 过期机制 ============

describe('Token 过期机制', () => {
  it('已过期的 accessToken 返回 null 并删除', () => {
    const expiredData = { value: 'old_token', expire: Date.now() - 1000 }
    localStorage.setItem(ACCESS_KEY, JSON.stringify(expiredData))

    expect(getToken()).toBeNull()
    expect(localStorage.getItem(ACCESS_KEY)).toBeNull()
  })

  it('已过期的 refreshToken 返回 null 并删除', () => {
    const expiredData = { value: 'old_refresh', expire: Date.now() - 1000 }
    localStorage.setItem(REFRESH_KEY, JSON.stringify(expiredData))

    expect(getRefreshToken()).toBeNull()
    expect(localStorage.getItem(REFRESH_KEY)).toBeNull()
  })

  it('使用 fake timer 验证 token 过期', () => {
    vi.useFakeTimers()
    setToken('timed_token', 5000)

    vi.advanceTimersByTime(3000)
    expect(getToken()).toBe('timed_token')

    vi.advanceTimersByTime(3000)
    expect(getToken()).toBeNull()

    vi.useRealTimers()
  })
})

// ============ clearTokens ============

describe('clearTokens', () => {
  it('同时清除 accessToken 和 refreshToken', () => {
    setToken('access')
    setRefreshToken('refresh')
    expect(getToken()).toBe('access')
    expect(getRefreshToken()).toBe('refresh')

    clearTokens()
    expect(getToken()).toBeNull()
    expect(getRefreshToken()).toBeNull()
  })

  it('仅存在 accessToken 时清除不报错', () => {
    setToken('only_access')
    expect(() => clearTokens()).not.toThrow()
    expect(getToken()).toBeNull()
  })

  it('仅存在 refreshToken 时清除不报错', () => {
    setRefreshToken('only_refresh')
    expect(() => clearTokens()).not.toThrow()
    expect(getRefreshToken()).toBeNull()
  })

  it('都不存在时调用不报错', () => {
    expect(() => clearTokens()).not.toThrow()
  })

  it('不影响其他存储数据', () => {
    setToken('access')
    setRefreshToken('refresh')
    localStorage.setItem(PREFIX + 'other', JSON.stringify({ value: 'keep', expire: null }))

    clearTokens()
    expect(localStorage.getItem(PREFIX + 'other')).not.toBeNull()
  })
})

// ============ accessToken 与 refreshToken 互不干扰 ============

describe('accessToken 与 refreshToken 独立性', () => {
  it('清除 accessToken 不影响 refreshToken', () => {
    setToken('access')
    setRefreshToken('refresh')

    removeToken()
    expect(getToken()).toBeNull()
    expect(getRefreshToken()).toBe('refresh')
  })

  it('清除 refreshToken 不影响 accessToken', () => {
    setToken('access')
    setRefreshToken('refresh')

    removeRefreshToken()
    expect(getRefreshToken()).toBeNull()
    expect(getToken()).toBe('access')
  })
})
