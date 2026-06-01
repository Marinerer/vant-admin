/**
 * 本地存储工具函数
 * 支持 localStorage / sessionStorage，支持过期时间
 */

const STORAGE_PREFIX = 'nest_cms_'

/** 生成带前缀的 key */
function prefixKey(key: string): string {
  return STORAGE_PREFIX + key
}

/** 存储数据结构 */
interface StorageData<T> {
  value: T
  expire: number | null // 过期时间戳，null 表示永不过期
}

// ============ localStorage ============

/**
 * 设置 localStorage，支持过期时间（毫秒）
 * @example set('token', 'abc123', 1000 * 60 * 60 * 24) // 1天后过期
 */
export function set<T>(key: string, value: T, expire?: number): void {
  const data: StorageData<T> = {
    value,
    expire: expire ? Date.now() + expire : null,
  }
  try {
    localStorage.setItem(prefixKey(key), JSON.stringify(data))
  } catch {
    console.warn(`localStorage.setItem failed for key: ${key}`)
  }
}

/**
 * 获取 localStorage，自动检测过期
 * @returns 值或 null（不存在 / 已过期）
 */
export function get<T>(key: string): T | null {
  const raw = localStorage.getItem(prefixKey(key))
  if (!raw) return null

  try {
    const data = JSON.parse(raw) as StorageData<T>
    if (data.expire !== null && Date.now() > data.expire) {
      remove(key)
      return null
    }
    return data.value
  } catch {
    return null
  }
}

/** 删除指定 key */
export function remove(key: string): void {
  localStorage.removeItem(prefixKey(key))
}

/** 清除所有带前缀的存储 */
export function clearAll(): void {
  const keysToRemove: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)
    if (k?.startsWith(STORAGE_PREFIX)) {
      keysToRemove.push(k)
    }
  }
  keysToRemove.forEach((k) => localStorage.removeItem(k))
}

// ============ sessionStorage ============

/** 设置 sessionStorage */
export function setSession<T>(key: string, value: T): void {
  try {
    sessionStorage.setItem(prefixKey(key), JSON.stringify(value))
  } catch {
    console.warn(`sessionStorage.setItem failed for key: ${key}`)
  }
}

/** 获取 sessionStorage */
export function getSession<T>(key: string): T | null {
  const raw = sessionStorage.getItem(prefixKey(key))
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

/** 删除 sessionStorage */
export function removeSession(key: string): void {
  sessionStorage.removeItem(prefixKey(key))
}
