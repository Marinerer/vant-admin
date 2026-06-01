/**
 * 格式化工具函数
 * 日期（基于 dayjs）、数字、文件大小等格式化
 */

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

// 加载 relativeTime 插件（中文 locale 已在 antd.tsx 中全局设置）
dayjs.extend(relativeTime)

/**
 * 格式化日期（dayjs 薄封装）
 * @param date 日期对象 / 时间戳 / 日期字符串
 * @param fmt 格式模板，默认 'YYYY-MM-DD HH:mm:ss'
 * @example formatDate(new Date(), 'YYYY-MM-DD') // '2024-01-01'
 */
export function formatDate(date: dayjs.ConfigType, fmt = 'YYYY-MM-DD HH:mm:ss'): string {
  const d = dayjs(date)
  return d.isValid() ? d.format(fmt) : ''
}

/**
 * 相对时间（多久前）— 基于 dayjs relativeTime 插件
 * @example timeAgo(Date.now() - 60000) // '1 分钟前'
 */
export function timeAgo(date: dayjs.ConfigType): string {
  const d = dayjs(date)
  return d.isValid() ? d.fromNow() : ''
}

/**
 * 格式化数字，千分位分隔
 * @example formatNumber(1234567) // '1,234,567'
 */
export function formatNumber(num: number | string): string {
  const n = typeof num === 'string' ? parseFloat(num) : num
  if (isNaN(n)) return '0'
  return n.toLocaleString('zh-CN')
}

/**
 * 格式化文件大小
 * @example formatFileSize(1024) // '1.00 KB'
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const k = 1024
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${units[i]}`
}

/**
 * 手机号脱敏
 * @example maskPhone('13812345678') // '138****5678'
 */
export function maskPhone(phone: string): string {
  if (!phone || phone.length < 7) return phone
  return phone.replace(/(\d{3})\d{4}(\d+)/, '$1****$2')
}

/**
 * 截断字符串，超出部分用省略号代替
 * @example truncate('这是一段很长的文本', 5) // '这是一段很...'
 */
export function truncate(str: string, maxLen: number): string {
  if (!str || str.length <= maxLen) return str
  return str.slice(0, maxLen) + '...'
}

/**
 * 首字母大写
 */
export function capitalize(str: string): string {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}
