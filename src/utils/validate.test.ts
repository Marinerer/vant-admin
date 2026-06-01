import { describe, it, expect } from 'vitest'
import {
  isPhone,
  isEmail,
  isUrl,
  isIdCard,
  isUsername,
  isStrongPassword,
  isChinese,
  requiredRule,
  phoneRule,
  emailRule,
  urlRule,
  minLengthRule,
  maxLengthRule,
  passwordRule,
} from './validate'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const asObj = (rule: unknown) => rule as Record<string, any>

// ============ isPhone ============

describe('isPhone', () => {
  it('合法手机号', () => {
    expect(isPhone('13812345678')).toBe(true)
    expect(isPhone('15900001111')).toBe(true)
    expect(isPhone('18699998888')).toBe(true)
  })

  it('位数不对', () => {
    expect(isPhone('1381234567')).toBe(false)
    expect(isPhone('138123456789')).toBe(false)
  })

  it('不以 1 开头', () => {
    expect(isPhone('23812345678')).toBe(false)
  })

  it('第二位不在 3-9 范围', () => {
    expect(isPhone('12812345678')).toBe(false)
    expect(isPhone('10812345678')).toBe(false)
  })

  it('包含非数字字符', () => {
    expect(isPhone('138abcd5678')).toBe(false)
  })

  it('空字符串', () => {
    expect(isPhone('')).toBe(false)
  })
})

// ============ isEmail ============

describe('isEmail', () => {
  it('合法邮箱', () => {
    expect(isEmail('test@example.com')).toBe(true)
    expect(isEmail('user.name+tag@domain.co')).toBe(true)
    expect(isEmail('a@b.cd')).toBe(true)
  })

  it('缺少 @ 符号', () => {
    expect(isEmail('testexample.com')).toBe(false)
  })

  it('缺少域名后缀', () => {
    expect(isEmail('test@example')).toBe(false)
  })

  it('多个 @ 符号', () => {
    expect(isEmail('test@@example.com')).toBe(false)
  })

  it('空字符串', () => {
    expect(isEmail('')).toBe(false)
  })

  it('后缀只有一位', () => {
    expect(isEmail('test@example.c')).toBe(false)
  })
})

// ============ isUrl ============

describe('isUrl', () => {
  it('合法 URL', () => {
    expect(isUrl('https://example.com')).toBe(true)
    expect(isUrl('http://localhost:3000')).toBe(true)
    expect(isUrl('ftp://files.example.com/path')).toBe(true)
  })

  it('缺少协议', () => {
    expect(isUrl('example.com')).toBe(false)
  })

  it('空字符串', () => {
    expect(isUrl('')).toBe(false)
  })

  it('随机字符串', () => {
    expect(isUrl('not a url')).toBe(false)
  })
})

// ============ isIdCard ============

describe('isIdCard', () => {
  it('合法 18 位身份证（数字结尾）', () => {
    expect(isIdCard('110101199003077514')).toBe(true)
  })

  it('合法 18 位身份证（X 结尾）', () => {
    expect(isIdCard('11010119900307751X')).toBe(true)
    expect(isIdCard('11010119900307751x')).toBe(true)
  })

  it('17 位', () => {
    expect(isIdCard('11010119900307751')).toBe(false)
  })

  it('19 位', () => {
    expect(isIdCard('1101011990030775123')).toBe(false)
  })

  it('包含非法字符', () => {
    expect(isIdCard('11010119900307751A')).toBe(false)
  })

  it('空字符串', () => {
    expect(isIdCard('')).toBe(false)
  })
})

// ============ isUsername ============

describe('isUsername', () => {
  it('合法用户名', () => {
    expect(isUsername('user_01')).toBe(true)
    expect(isUsername('abcd')).toBe(true)
    expect(isUsername('A_B_C_1234567890ab')).toBe(true) // 20 chars
  })

  it('少于 4 位', () => {
    expect(isUsername('abc')).toBe(false)
  })

  it('超过 20 位', () => {
    expect(isUsername('a'.repeat(21))).toBe(false)
  })

  it('包含中文', () => {
    expect(isUsername('用户name')).toBe(false)
  })

  it('包含特殊字符', () => {
    expect(isUsername('user@name')).toBe(false)
    expect(isUsername('user-name')).toBe(false)
  })

  it('空字符串', () => {
    expect(isUsername('')).toBe(false)
  })
})

// ============ isStrongPassword ============

describe('isStrongPassword', () => {
  it('合法强密码（字母+数字）', () => {
    expect(isStrongPassword('abc123')).toBe(true)
    expect(isStrongPassword('Password1')).toBe(true)
  })

  it('包含特殊字符', () => {
    expect(isStrongPassword('abc123@')).toBe(true)
    expect(isStrongPassword('Pass1!')).toBe(true)
  })

  it('纯字母（无数字）', () => {
    expect(isStrongPassword('abcdef')).toBe(false)
  })

  it('纯数字（无字母）', () => {
    expect(isStrongPassword('123456')).toBe(false)
  })

  it('少于 6 位', () => {
    expect(isStrongPassword('ab1')).toBe(false)
  })

  it('超过 20 位', () => {
    expect(isStrongPassword('a1' + 'a'.repeat(19))).toBe(false)
  })

  it('包含非法特殊字符（如 #）', () => {
    expect(isStrongPassword('abc123#')).toBe(false)
  })

  it('空字符串', () => {
    expect(isStrongPassword('')).toBe(false)
  })
})

// ============ isChinese ============

describe('isChinese', () => {
  it('纯中文', () => {
    expect(isChinese('你好世界')).toBe(true)
  })

  it('包含英文', () => {
    expect(isChinese('你好abc')).toBe(false)
  })

  it('包含数字', () => {
    expect(isChinese('你好123')).toBe(false)
  })

  it('包含空格', () => {
    expect(isChinese('你好 世界')).toBe(false)
  })

  it('空字符串', () => {
    expect(isChinese('')).toBe(false)
  })
})

// ============ Ant Design Rule Generators ============

describe('requiredRule', () => {
  it('返回 required 规则', () => {
    const rule = requiredRule('不能为空')
    expect(rule).toEqual({ required: true, message: '不能为空' })
  })
})

describe('phoneRule', () => {
  it('使用默认消息', () => {
    const rule = asObj(phoneRule())
    expect(rule.message).toBe('请输入正确的手机号')
    expect(rule.pattern).toBeInstanceOf(RegExp)
  })

  it('使用自定义消息', () => {
    const rule = asObj(phoneRule('手机号格式错误'))
    expect(rule.message).toBe('手机号格式错误')
  })
})

describe('emailRule', () => {
  it('使用默认消息', () => {
    const rule = asObj(emailRule())
    expect(rule.message).toBe('请输入正确的邮箱地址')
    expect(rule.type).toBe('email')
  })
})

describe('urlRule', () => {
  it('使用默认消息', () => {
    const rule = asObj(urlRule())
    expect(rule.message).toBe('请输入正确的 URL')
    expect(rule.type).toBe('url')
  })
})

describe('minLengthRule', () => {
  it('使用默认消息', () => {
    const rule = minLengthRule(6)
    expect(rule).toEqual({ min: 6, message: '至少输入 6 个字符' })
  })

  it('使用自定义消息', () => {
    const rule = minLengthRule(3, '太短了')
    expect(rule).toEqual({ min: 3, message: '太短了' })
  })
})

describe('maxLengthRule', () => {
  it('使用默认消息', () => {
    const rule = maxLengthRule(100)
    expect(rule).toEqual({ max: 100, message: '最多输入 100 个字符' })
  })

  it('使用自定义消息', () => {
    const rule = maxLengthRule(50, '太长了')
    expect(rule).toEqual({ max: 50, message: '太长了' })
  })
})

describe('passwordRule', () => {
  it('使用默认消息', () => {
    const rule = asObj(passwordRule())
    expect(rule.message).toBe('密码需包含字母和数字，6-20位')
    expect(rule.pattern).toBeInstanceOf(RegExp)
  })

  it('使用自定义消息', () => {
    const rule = asObj(passwordRule('密码不符合要求'))
    expect(rule.message).toBe('密码不符合要求')
  })
})
