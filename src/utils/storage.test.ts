import { describe, it, expect, beforeEach, vi } from 'vitest'
import { set, get, remove, clearAll, setSession, getSession, removeSession } from './storage'

const PREFIX = 'vant_'

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})

// ============ localStorage: set / get ============

describe('set & get', () => {
  it('存取字符串', () => {
    set('token', 'abc123')
    expect(get<string>('token')).toBe('abc123')
  })

  it('存取数字', () => {
    set('count', 42)
    expect(get<number>('count')).toBe(42)
  })

  it('存取对象', () => {
    const user = { name: '张三', age: 25 }
    set('user', user)
    expect(get('user')).toEqual(user)
  })

  it('存取数组', () => {
    const arr = [1, 2, 3]
    set('list', arr)
    expect(get('list')).toEqual(arr)
  })

  it('存取布尔值', () => {
    set('flag', true)
    expect(get<boolean>('flag')).toBe(true)
  })

  it('存取 null', () => {
    set('empty', null)
    expect(get('empty')).toBeNull()
  })

  it('不存在的 key 返回 null', () => {
    expect(get('nonexistent')).toBeNull()
  })

  it('key 带前缀存储', () => {
    set('myKey', 'value')
    expect(localStorage.getItem(PREFIX + 'myKey')).not.toBeNull()
    expect(localStorage.getItem('myKey')).toBeNull()
  })
})

// ============ 过期机制 ============

describe('过期机制', () => {
  it('未过期的数据正常返回', () => {
    set('fresh', 'data', 1000 * 60 * 60) // 1小时
    expect(get('fresh')).toBe('data')
  })

  it('已过期的数据返回 null 并删除', () => {
    // 手动写入一个已过期的数据
    const expiredData = {
      value: 'old',
      expire: Date.now() - 1000, // 1秒前就过期了
    }
    localStorage.setItem(PREFIX + 'expired', JSON.stringify(expiredData))

    expect(get('expired')).toBeNull()
    // 验证已被删除
    expect(localStorage.getItem(PREFIX + 'expired')).toBeNull()
  })

  it('设置过期时间后数据在有效期内可读取', () => {
    set('timed', 'value', 1000 * 60) // 1分钟
    expect(get('timed')).toBe('value')
  })

  it('expire 为 0 视为不过期', () => {
    set('noExpire', 'value', 0)
    // expire = 0 是 falsy，走 null（不过期）分支
    expect(get('noExpire')).toBe('value')
  })

  it('使用 fake timer 验证过期', () => {
    vi.useFakeTimers()
    set('timer', 'data', 5000) // 5秒后过期

    // 3秒后，应该还在有效期
    vi.advanceTimersByTime(3000)
    expect(get('timer')).toBe('data')

    // 再过 3 秒（共 6 秒），已过期
    vi.advanceTimersByTime(3000)
    expect(get('timer')).toBeNull()

    vi.useRealTimers()
  })
})

// ============ remove ============

describe('remove', () => {
  it('删除指定 key', () => {
    set('toRemove', 'value')
    expect(get('toRemove')).toBe('value')

    remove('toRemove')
    expect(get('toRemove')).toBeNull()
  })

  it('删除不存在的 key 不报错', () => {
    expect(() => remove('nope')).not.toThrow()
  })
})

// ============ clearAll ============

describe('clearAll', () => {
  it('清除所有带前缀的存储', () => {
    set('a', 1)
    set('b', 2)
    set('c', 3)
    // 手动添加一个不带前缀的
    localStorage.setItem('other', 'keep')

    clearAll()

    expect(get('a')).toBeNull()
    expect(get('b')).toBeNull()
    expect(get('c')).toBeNull()
    // 不带前缀的应保留
    expect(localStorage.getItem('other')).toBe('keep')
  })

  it('空存储调用不报错', () => {
    expect(() => clearAll()).not.toThrow()
  })
})

// ============ JSON 解析异常 ============

describe('JSON 解析异常', () => {
  it('localStorage 中存储了非法 JSON，get 返回 null', () => {
    localStorage.setItem(PREFIX + 'badJson', 'not-json')
    expect(get('badJson')).toBeNull()
  })
})

// ============ sessionStorage ============

describe('setSession & getSession', () => {
  it('存取字符串', () => {
    setSession('sToken', 'xyz')
    expect(getSession<string>('sToken')).toBe('xyz')
  })

  it('存取对象', () => {
    const obj = { a: 1 }
    setSession('obj', obj)
    expect(getSession('obj')).toEqual(obj)
  })

  it('不存在的 key 返回 null', () => {
    expect(getSession('nope')).toBeNull()
  })

  it('key 带前缀', () => {
    setSession('k', 'v')
    expect(sessionStorage.getItem(PREFIX + 'k')).not.toBeNull()
    expect(sessionStorage.getItem('k')).toBeNull()
  })

  it('非法 JSON 返回 null', () => {
    sessionStorage.setItem(PREFIX + 'bad', '{invalid}')
    expect(getSession('bad')).toBeNull()
  })
})

describe('removeSession', () => {
  it('删除指定 sessionStorage key', () => {
    setSession('toRemove', 'val')
    expect(getSession('toRemove')).toBe('val')

    removeSession('toRemove')
    expect(getSession('toRemove')).toBeNull()
  })

  it('删除不存在的 key 不报错', () => {
    expect(() => removeSession('nope')).not.toThrow()
  })
})
