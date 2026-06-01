/**
 * 通用类型定义
 */

/** 分页参数 */
export interface PaginationParams {
  page: number
  pageSize: number
}

/** 分页响应 */
export interface PaginatedResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

/** 通用键值对 */
export interface KeyValue {
  label: string
  value: string | number
}

/** 通用 ID 类型 */
export type ID = string | number

/** 通用状态枚举 */
export type Status = 'active' | 'inactive'

/** 通用排序方向 */
export type SortOrder = 'asc' | 'desc'

/** 排序参数 */
export interface SortParams {
  field: string
  order: SortOrder
}

/** 文件上传响应 */
export interface UploadResult {
  url: string
  filename: string
  size: number
  mimeType: string
}

/** 可选 Promise 类型 */
export type MaybePromise<T> = T | Promise<T>

/** 使部分字段可选 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/** 使部分字段必填 */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>
