import { describe, it, expect } from 'vitest'
import {
  formatDate,
  timeAgo,
  formatNumber,
  formatFileSize,
  maskPhone,
  truncate,
  capitalize,
} from './format'

// ============ formatDate ============

describe('formatDate', () => {
  it('使用默认格式输出完整日期时间', () => {
    // 2024-06-15 10:30:00 UTC+8
    const result = formatDate('2024-06-15 10:30:00')
    expect(result).toBe('2024-06-15 10:30:00')
  })

  it('使用自定义格式', () => {
    expect(formatDate('2024-06-15', 'YYYY/MM/DD')).toBe('2024/06/15')
    expect(formatDate('2024-06-15', 'MM-DD')).toBe('06-15')
  })

  it('接受 Date 对象', () => {
    const date = new Date('2024-01-01T00:00:00')
    const result = formatDate(date, 'YYYY-MM-DD')
    expect(result).toMatch(/2024-01-01/)
  })

  it('接受时间戳', () => {
    const ts = new Date('2024-06-15T10:30:00').getTime()
    const result = formatDate(ts, 'YYYY')
    expect(result).toBe('2024')
  })

  it('无效日期返回空字符串', () => {
    expect(formatDate('not-a-date')).toBe('')
    expect(formatDate('')).toBe('')
    expect(formatDate(null)).toBe('')
  })

  it('undefined 被 dayjs 解析为当前时间（有效）', () => {
    // dayjs(undefined) 等价于 dayjs()
    const result = formatDate(undefined)
    expect(result).not.toBe('')
  })
})

// ============ timeAgo ============

describe('timeAgo', () => {
  it('返回相对时间字符串', () => {
    const oneMinuteAgo = Date.now() - 60 * 1000
    const result = timeAgo(oneMinuteAgo)
    expect(result).toBeTruthy()
    expect(typeof result).toBe('string')
  })

  it('无效日期返回空字符串', () => {
    expect(timeAgo('invalid')).toBe('')
    expect(timeAgo(null)).toBe('')
  })
})

// ============ formatNumber ============

describe('formatNumber', () => {
  it('千分位分隔整数', () => {
    expect(formatNumber(1234567)).toBe('1,234,567')
  })

  it('小数不加千分位', () => {
    const result = formatNumber(1234.56)
    expect(result).toContain('1')
    expect(result).toContain('234')
  })

  it('接受字符串数字', () => {
    expect(formatNumber('9999')).toBe('9,999')
  })

  it('零返回 "0"', () => {
    expect(formatNumber(0)).toBe('0')
  })

  it('NaN 返回 "0"', () => {
    expect(formatNumber(NaN)).toBe('0')
    expect(formatNumber('abc')).toBe('0')
  })

  it('负数正常处理', () => {
    const result = formatNumber(-1234)
    expect(result).toContain('1,234')
  })
})

// ============ formatFileSize ============

describe('formatFileSize', () => {
  it('0 字节返回 "0 B"', () => {
    expect(formatFileSize(0)).toBe('0 B')
  })

  it('字节级', () => {
    expect(formatFileSize(500)).toBe('500.00 B')
  })

  it('KB 级', () => {
    expect(formatFileSize(1024)).toBe('1.00 KB')
    expect(formatFileSize(1536)).toBe('1.50 KB')
  })

  it('MB 级', () => {
    expect(formatFileSize(1024 * 1024)).toBe('1.00 MB')
  })

  it('GB 级', () => {
    expect(formatFileSize(1024 * 1024 * 1024)).toBe('1.00 GB')
  })

  it('TB 级', () => {
    expect(formatFileSize(1024 * 1024 * 1024 * 1024)).toBe('1.00 TB')
  })
})

// ============ maskPhone ============

describe('maskPhone', () => {
  it('正常手机号脱敏', () => {
    expect(maskPhone('13812345678')).toBe('138****5678')
  })

  it('短于7位原样返回', () => {
    expect(maskPhone('12345')).toBe('12345')
  })

  it('空字符串返回空', () => {
    expect(maskPhone('')).toBe('')
  })

  it('7位号码无法匹配正则（至少8位才脱敏）', () => {
    // 正则 (\d{3})\d{4}(\d+) 需要至少 8 位才能匹配
    const result = maskPhone('1234567')
    expect(result).toBe('1234567')
  })

  it('8位号码可以脱敏', () => {
    const result = maskPhone('12345678')
    expect(result).toBe('123****8')
  })

  it('超长号码正常脱敏', () => {
    const result = maskPhone('138123456789')
    expect(result).toBe('138****56789')
  })
})

// ============ truncate ============

describe('truncate', () => {
  it('超出长度截断并加省略号', () => {
    expect(truncate('这是一段很长的文本', 5)).toBe('这是一段很...')
  })

  it('未超出原样返回', () => {
    expect(truncate('短文本', 10)).toBe('短文本')
  })

  it('刚好等于最大长度原样返回', () => {
    expect(truncate('abc', 3)).toBe('abc')
  })

  it('空字符串返回空', () => {
    expect(truncate('', 5)).toBe('')
  })

  it('maxLen 为 0 时只返回省略号', () => {
    expect(truncate('hello', 0)).toBe('...')
  })
})

// ============ capitalize ============

describe('capitalize', () => {
  it('首字母大写', () => {
    expect(capitalize('hello')).toBe('Hello')
  })

  it('已经大写保持不变', () => {
    expect(capitalize('Hello')).toBe('Hello')
  })

  it('单字符', () => {
    expect(capitalize('a')).toBe('A')
  })

  it('空字符串返回空', () => {
    expect(capitalize('')).toBe('')
  })

  it('数字开头不变', () => {
    expect(capitalize('123abc')).toBe('123abc')
  })

  it('中文开头不变', () => {
    expect(capitalize('你好')).toBe('你好')
  })
})
