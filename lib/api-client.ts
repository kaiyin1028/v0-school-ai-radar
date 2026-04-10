/**
 * API Client - 統一處理 API 請求
 * 
 * 功能:
 * - 讀取 NEXT_PUBLIC_API_BASE_URL
 * - 提供 get/post/patch/delete (fetch wrapper)
 * - 統一 headers (JSON、Authorization)
 * - 統一錯誤處理 (HTTP 非 2xx 轉為標準 Error)
 * 
 * 注意: 此模組不處理 mock 邏輯，mock 切換在 services 層處理
 */

import { getToken } from './auth-token'

// ===========================================
// 類型定義
// ===========================================

/**
 * 統一 API 成功響應格式
 */
export interface ApiResponse<T> {
  data: T
  meta?: {
    total?: number
    page?: number
    pageSize?: number
    totalPages?: number
  }
}

/**
 * 統一 API 錯誤響應格式
 */
export interface ApiErrorResponse {
  error: {
    code: string
    message: string
    details?: Record<string, unknown>
  }
}

/**
 * 請求配置
 */
export interface RequestConfig {
  headers?: Record<string, string>
  params?: Record<string, string | number | boolean | undefined>
  signal?: AbortSignal
  skipAuth?: boolean // 跳過 Authorization header
}

// ===========================================
// API 錯誤類
// ===========================================

export class ApiError extends Error {
  public readonly code: string
  public readonly status: number
  public readonly details?: Record<string, unknown>

  constructor(params: {
    code: string
    message: string
    status: number
    details?: Record<string, unknown>
  }) {
    super(params.message)
    this.name = 'ApiError'
    this.code = params.code
    this.status = params.status
    this.details = params.details
  }

  /**
   * 從 HTTP 響應創建 ApiError
   */
  static async fromResponse(response: Response): Promise<ApiError> {
    let body: unknown

    try {
      const contentType = response.headers.get('content-type')
      if (contentType?.includes('application/json')) {
        body = await response.json()
      } else {
        body = await response.text()
      }
    } catch {
      body = null
    }

    // 嘗試從響應體獲取錯誤信息
    if (body && typeof body === 'object') {
      const errorBody = body as { error?: { code?: string; message?: string; details?: Record<string, unknown> } }
      if (errorBody.error) {
        return new ApiError({
          code: errorBody.error.code || `HTTP_${response.status}`,
          message: errorBody.error.message || response.statusText,
          status: response.status,
          details: errorBody.error.details,
        })
      }
    }

    // 默認錯誤映射
    const defaultMessages: Record<number, string> = {
      400: '請求參數錯誤',
      401: '未授權，請重新登入',
      403: '權限不足',
      404: '資源不存在',
      409: '資源衝突',
      422: '數據驗證失敗',
      429: '請求過於頻繁',
      500: '伺服器錯誤',
      502: '網關錯誤',
      503: '服務暫時不可用',
    }

    return new ApiError({
      code: `HTTP_${response.status}`,
      message: defaultMessages[response.status] || response.statusText || '未知錯誤',
      status: response.status,
    })
  }

  /**
   * 從網絡錯誤創建 ApiError
   */
  static fromNetworkError(error: Error): ApiError {
    if (error.name === 'AbortError') {
      return new ApiError({
        code: 'REQUEST_ABORTED',
        message: '請求已取消',
        status: 0,
      })
    }

    return new ApiError({
      code: 'NETWORK_ERROR',
      message: '網絡連接失敗，請檢查網絡設置',
      status: 0,
    })
  }
}

// ===========================================
// 環境配置
// ===========================================

const getApiBaseUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_BASE_URL || '/api'
}

// ===========================================
// 工具函數
// ===========================================

/**
 * 構建 URL 查詢字符串
 */
function buildQueryString(params?: Record<string, string | number | boolean | undefined>): string {
  if (!params) return ''
  
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value))
    }
  })
  
  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ''
}

/**
 * 構建請求 Headers
 */
function buildHeaders(config?: RequestConfig): Headers {
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  })

  // 添加自定義 headers
  if (config?.headers) {
    Object.entries(config.headers).forEach(([key, value]) => {
      headers.set(key, value)
    })
  }

  // 添加 Authorization header
  if (!config?.skipAuth) {
    const token = getToken()
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
  }

  return headers
}

// ===========================================
// 核心請求方法
// ===========================================

async function request<T>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  endpoint: string,
  data?: unknown,
  config?: RequestConfig
): Promise<ApiResponse<T>> {
  const baseUrl = getApiBaseUrl()
  const url = `${baseUrl}${endpoint}${buildQueryString(config?.params)}`
  const headers = buildHeaders(config)

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
      signal: config?.signal,
    })

    // 處理錯誤響應
    if (!response.ok) {
      throw await ApiError.fromResponse(response)
    }

    // 處理無內容響應
    if (response.status === 204) {
      return { data: null as T }
    }

    // 解析 JSON 響應
    const responseBody = await response.json()

    // 標準化響應格式
    if (responseBody && typeof responseBody === 'object' && 'data' in responseBody) {
      return responseBody as ApiResponse<T>
    }

    return { data: responseBody as T }

  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }

    if (error instanceof Error) {
      throw ApiError.fromNetworkError(error)
    }

    throw new ApiError({
      code: 'UNKNOWN_ERROR',
      message: '發生未知錯誤',
      status: 0,
    })
  }
}

// ===========================================
// 導出的 API 方法
// ===========================================

export const apiClient = {
  /**
   * GET 請求
   */
  get: <T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> =>
    request<T>('GET', endpoint, undefined, config),
  
  /**
   * POST 請求
   */
  post: <T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> =>
    request<T>('POST', endpoint, data, config),
  
  /**
   * PUT 請求
   */
  put: <T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> =>
    request<T>('PUT', endpoint, data, config),
  
  /**
   * PATCH 請求
   */
  patch: <T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> =>
    request<T>('PATCH', endpoint, data, config),
  
  /**
   * DELETE 請求
   */
  delete: <T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> =>
    request<T>('DELETE', endpoint, undefined, config),
}

// ===========================================
// 環境檢查
// ===========================================

export const apiConfig = {
  getBaseUrl: getApiBaseUrl,
  isMockMode: (): boolean => process.env.NEXT_PUBLIC_USE_MOCKS === 'true',
}

export default apiClient
