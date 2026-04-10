'use client'

/**
 * useAsync Hook - 異步數據獲取
 * 
 * 功能:
 * - 統一處理 loading / error / data 狀態
 * - 支援 retry 重試
 * - 自動錯誤處理
 * 
 * 使用方式:
 * const { data, isLoading, error, execute, retry } = useAsync(fetchFn)
 */

import { useState, useCallback, useEffect, useRef } from 'react'
import { ApiError } from '@/lib/api-client'

// ===========================================
// 類型定義
// ===========================================

export interface AsyncState<T> {
  data: T | null
  isLoading: boolean
  error: ApiError | Error | null
  isSuccess: boolean
  isError: boolean
}

export interface UseAsyncOptions<T> {
  /** 組件掛載時自動執行 */
  immediate?: boolean
  /** 初始數據 */
  initialData?: T | null
  /** 成功回調 */
  onSuccess?: (data: T) => void
  /** 錯誤回調 */
  onError?: (error: Error) => void
}

export interface UseAsyncReturn<T, P extends unknown[]> extends AsyncState<T> {
  /** 手動執行 */
  execute: (...params: P) => Promise<T | null>
  /** 重試上一次請求 */
  retry: () => Promise<T | null>
  /** 重置狀態 */
  reset: () => void
  /** 設置數據 */
  setData: (data: T | null) => void
}

// ===========================================
// Hook 實現
// ===========================================

export function useAsync<T, P extends unknown[] = []>(
  asyncFn: (...params: P) => Promise<T>,
  options: UseAsyncOptions<T> = {}
): UseAsyncReturn<T, P> {
  const { 
    immediate = false, 
    initialData = null,
    onSuccess,
    onError 
  } = options

  const [state, setState] = useState<AsyncState<T>>({
    data: initialData,
    isLoading: false,
    error: null,
    isSuccess: false,
    isError: false,
  })

  // 保存最後一次執行的參數，用於 retry
  const lastParamsRef = useRef<P | null>(null)
  // 防止組件卸載後更新狀態
  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const execute = useCallback(async (...params: P): Promise<T | null> => {
    lastParamsRef.current = params

    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      isError: false,
    }))

    try {
      const result = await asyncFn(...params)

      if (isMountedRef.current) {
        setState({
          data: result,
          isLoading: false,
          error: null,
          isSuccess: true,
          isError: false,
        })
        onSuccess?.(result)
      }

      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))

      if (isMountedRef.current) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error,
          isSuccess: false,
          isError: true,
        }))
        onError?.(error)
      }

      return null
    }
  }, [asyncFn, onSuccess, onError])

  const retry = useCallback(async (): Promise<T | null> => {
    if (lastParamsRef.current !== null) {
      return execute(...lastParamsRef.current)
    }
    return execute(...([] as unknown as P))
  }, [execute])

  const reset = useCallback(() => {
    setState({
      data: initialData,
      isLoading: false,
      error: null,
      isSuccess: false,
      isError: false,
    })
    lastParamsRef.current = null
  }, [initialData])

  const setData = useCallback((data: T | null) => {
    setState(prev => ({
      ...prev,
      data,
    }))
  }, [])

  // 組件掛載時自動執行
  useEffect(() => {
    if (immediate) {
      execute(...([] as unknown as P))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [immediate])

  return {
    ...state,
    execute,
    retry,
    reset,
    setData,
  }
}

// ===========================================
// useAsyncList - 列表數據專用
// ===========================================

export interface ListState<T> extends AsyncState<T[]> {
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface UseAsyncListOptions<T> extends UseAsyncOptions<T[]> {
  defaultPage?: number
  defaultPageSize?: number
}

export function useAsyncList<T, P extends Record<string, unknown>>(
  asyncFn: (params: P) => Promise<{ data: T[]; meta?: { total?: number; page?: number; pageSize?: number; totalPages?: number } }>,
  options: UseAsyncListOptions<T> = {}
) {
  const { defaultPage = 1, defaultPageSize = 10 } = options

  const [listState, setListState] = useState<ListState<T>>({
    data: [],
    isLoading: false,
    error: null,
    isSuccess: false,
    isError: false,
    total: 0,
    page: defaultPage,
    pageSize: defaultPageSize,
    totalPages: 0,
  })

  const lastParamsRef = useRef<P | null>(null)
  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const execute = useCallback(async (params: P): Promise<T[] | null> => {
    lastParamsRef.current = params

    setListState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      isError: false,
    }))

    try {
      const result = await asyncFn(params)

      if (isMountedRef.current) {
        setListState({
          data: result.data,
          isLoading: false,
          error: null,
          isSuccess: true,
          isError: false,
          total: result.meta?.total || result.data.length,
          page: result.meta?.page || defaultPage,
          pageSize: result.meta?.pageSize || defaultPageSize,
          totalPages: result.meta?.totalPages || 1,
        })
      }

      return result.data
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))

      if (isMountedRef.current) {
        setListState(prev => ({
          ...prev,
          isLoading: false,
          error,
          isSuccess: false,
          isError: true,
        }))
      }

      return null
    }
  }, [asyncFn, defaultPage, defaultPageSize])

  const retry = useCallback(() => {
    if (lastParamsRef.current) {
      return execute(lastParamsRef.current)
    }
    return Promise.resolve(null)
  }, [execute])

  const reset = useCallback(() => {
    setListState({
      data: [],
      isLoading: false,
      error: null,
      isSuccess: false,
      isError: false,
      total: 0,
      page: defaultPage,
      pageSize: defaultPageSize,
      totalPages: 0,
    })
  }, [defaultPage, defaultPageSize])

  return {
    ...listState,
    execute,
    retry,
    reset,
  }
}

export default useAsync
