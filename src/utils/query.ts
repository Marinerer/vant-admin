/**
 * React Query Hooks 封装
 * 基于 @tanstack/react-query，提供统一的查询/变更 hooks
 */

import {
  useQuery,
  useMutation,
  useInfiniteQuery,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
  type QueryKey,
} from '@tanstack/react-query'
import { request, type RequestConfig } from './request'

// ============ 通用查询 Hook ============

/**
 * 通用请求 Hook — 自动管理 loading / error / 缓存
 *
 * @example
 * const { data, isLoading } = useRequest(['users', page], () => get<User[]>('/users', { page }))
 */
export function useRequest<T>(
  queryKey: QueryKey,
  queryFn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<T>({
    queryKey,
    queryFn,
    ...options,
  })
}

// ============ 通用变更 Hook ============

/**
 * 通用变更 Hook — 用于 POST / PUT / DELETE 等写操作
 *
 * @example
 * const mutation = useRequestAction({
 *   mutationFn: (newUser: CreateUserDto) => post<User>('/users', newUser),
 *   onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
 * })
 */
export function useRequestAction<
  TData = unknown,
  TError = Error,
  TVariables = void,
  TOnMutateResult = unknown,
>(options: UseMutationOptions<TData, TError, TVariables, TOnMutateResult>) {
  return useMutation<TData, TError, TVariables, TOnMutateResult>(options)
}

// ============ 分页查询 Hook ============

/** 分页响应结构 */
export interface PaginatedData<T> {
  list: T[]
  total: number
}

/**
 * 分页查询 Hook — 自动处理翻页请求
 *
 * @example
 * const { data, fetchNextPage, hasNextPage, isLoading } = usePagination(
 *   ['users'],
 *   ({ pageParam = 1 }) => get<PaginatedData<User>>('/users', { page: pageParam, pageSize: 10 }),
 * )
 */
export function usePagination<T>(
  queryKey: QueryKey,
  queryFn: (ctx: { pageParam: number }) => Promise<PaginatedData<T>>,
  options?: Omit<
    Parameters<typeof useInfiniteQuery<PaginatedData<T>>>[0],
    'queryKey' | 'queryFn' | 'getNextPageParam' | 'initialPageParam'
  >,
) {
  return useInfiniteQuery<PaginatedData<T>>({
    queryKey,
    queryFn: ({ pageParam }) => queryFn({ pageParam: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalLoaded = allPages.reduce((sum, page) => sum + page.list.length, 0)
      return totalLoaded < lastPage.total ? allPages.length + 1 : undefined
    },
    ...options,
  })
}

// ============ 快捷 CRUD Hooks ============

/**
 * GET 查询 Hook — 直接传 URL 和参数
 *
 * @example
 * const { data: users } = useGet<User[]>('/users', { status: 'active' })
 */
export function useGet<T>(
  url: string,
  params?: Record<string, unknown>,
  config?: RequestConfig & {
    queryOptions?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
  },
) {
  const { queryOptions, ...requestConfig } = config ?? {}
  return useQuery<T>({
    queryKey: [url, params],
    queryFn: () => request<T>(url, { ...requestConfig, method: 'GET', params }),
    ...queryOptions,
  })
}

/**
 * 创建变更 Hook 的工厂函数，自动处理 invalidateKeys
 */
function createMutationHook(method: 'POST' | 'PUT' | 'DELETE') {
  return function <T, TVariables = unknown>(
    url: string,
    config?: RequestConfig & {
      mutationOptions?: Omit<UseMutationOptions<T, Error, TVariables>, 'mutationFn'>
      /** 成功后自动刷新的 queryKey */
      invalidateKeys?: QueryKey[]
    },
  ) {
    const queryClient = useQueryClient()
    const { mutationOptions, invalidateKeys, ...requestConfig } = config ?? {}

    return useMutation<T, Error, TVariables>({
      mutationFn: (variables) => request<T>(url, { ...requestConfig, method, data: variables }),
      ...mutationOptions,
      onSuccess: async (...args) => {
        if (invalidateKeys?.length) {
          await Promise.all(
            invalidateKeys.map((key) => queryClient.invalidateQueries({ queryKey: key })),
          )
        }
        mutationOptions?.onSuccess?.(...args)
      },
    })
  }
}

/**
 * POST 变更 Hook
 *
 * @example
 * const { mutate } = usePost<User, CreateUserDto>('/users', {
 *   invalidateKeys: [['users']],
 * })
 * mutate({ name: '张三' })
 */
export const usePost = createMutationHook('POST')

/**
 * PUT 变更 Hook
 */
export const usePut = createMutationHook('PUT')

/**
 * DELETE 变更 Hook
 */
export const useDelete = createMutationHook('DELETE')

// 重新导出 react-query 常用 API，减少外部导入
export { useQueryClient, useQuery, useMutation, useInfiniteQuery }
export type { QueryKey, UseQueryOptions, UseMutationOptions }
