/**
 * 验证工具函数
 * 提供正则验证和 Ant Design Form 规则生成器
 */

// ============ 正则验证 ============

/** 验证手机号 */
export function isPhone(value: string): boolean {
  return /^1[3-9]\d{9}$/.test(value)
}

/** 验证邮箱 */
export function isEmail(value: string): boolean {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
}

/** 验证 URL */
export function isUrl(value: string): boolean {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

/** 验证身份证号（简单校验18位） */
export function isIdCard(value: string): boolean {
  return /^\d{17}[\dXx]$/.test(value)
}

/** 验证用户名（字母、数字、下划线，4-20位） */
export function isUsername(value: string): boolean {
  return /^[a-zA-Z0-9_]{4,20}$/.test(value)
}

/** 验证密码强度（至少包含字母和数字，6-20位） */
export function isStrongPassword(value: string): boolean {
  return /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,20}$/.test(value)
}

/** 验证中文字符 */
export function isChinese(value: string): boolean {
  return /^[\u4e00-\u9fa5]+$/.test(value)
}

// ============ Ant Design Form 规则生成器 ============

import type { Rule } from 'antd/es/form'

/** 必填规则 */
export function requiredRule(message: string): Rule {
  return { required: true, message }
}

/** 手机号规则 */
export function phoneRule(message = '请输入正确的手机号'): Rule {
  return { pattern: /^1[3-9]\d{9}$/, message }
}

/** 邮箱规则 */
export function emailRule(message = '请输入正确的邮箱地址'): Rule {
  return { type: 'email', message }
}

/** URL 规则 */
export function urlRule(message = '请输入正确的 URL'): Rule {
  return { type: 'url', message }
}

/** 最小长度规则 */
export function minLengthRule(min: number, message?: string): Rule {
  return { min, message: message ?? `至少输入 ${min} 个字符` }
}

/** 最大长度规则 */
export function maxLengthRule(max: number, message?: string): Rule {
  return { max, message: message ?? `最多输入 ${max} 个字符` }
}

/** 密码强度规则 */
export function passwordRule(message = '密码需包含字母和数字，6-20位'): Rule {
  return {
    pattern: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,20}$/,
    message,
  }
}
