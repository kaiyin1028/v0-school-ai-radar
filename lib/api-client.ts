/**
 * API Client - 統一處理 API 請求
 * 
 * 功能:
 * - 統一 baseURL 管理
 * - 自動處理 headers (包含 auth token)
 * - 統一錯誤處理
 * - 請求/響應攔截
 * - 支援 Mock 模式切換
 */

// ===========================================
// 類型定義
// ===========================================
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  meta?: {
    total?: number
    page?: number
    pageSize?: number
    totalPages?: number
  }
}

export interface ApiError {
  code: string
  message: string
  status: number
  details?: Record<string, unknown>
}

export interface RequestConfig {
  headers?: Record<string, string>
  params?: Record<string, string | number | boolean | undefined>
  signal?: AbortSignal
}

export interface PaginationParams {
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface FilterParams {
  search?: string
  district?: string
  type?: string
  grade?: string
  status?: string
}

// ===========================================
// 環境配置
// ===========================================
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api'
const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === 'true'
const REQUEST_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000')

// ===========================================
// Token 管理 (預留 Auth 注入點)
// ===========================================
let authToken: string | null = null

export const setAuthToken = (token: string | null) => {
  authToken = token
}

export const getAuthToken = (): string | null => {
  // 優先使用內存中的 token
  if (authToken) return authToken
  
  // 備選: 從 localStorage 讀取 (瀏覽器環境)
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token')
  }
  
  return null
}

export const clearAuthToken = () => {
  authToken = null
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token')
  }
}

// ===========================================
// 錯誤處理
// ===========================================
export class ApiException extends Error {
  public readonly code: string
  public readonly status: number
  public readonly details?: Record<string, unknown>

  constructor(error: ApiError) {
    super(error.message)
    this.name = 'ApiException'
    this.code = error.code
    this.status = error.status
    this.details = error.details
  }

  static fromResponse(status: number, body?: unknown): ApiException {
    const errorMap: Record<number, { code: string; message: string }> = {
      400: { code: 'BAD_REQUEST', message: '請求參數錯誤' },
      401: { code: 'UNAUTHORIZED', message: '未授權，請重新登入' },
      403: { code: 'FORBIDDEN', message: '權限不足' },
      404: { code: 'NOT_FOUND', message: '資源不存在' },
      409: { code: 'CONFLICT', message: '資源衝突' },
      422: { code: 'VALIDATION_ERROR', message: '數據驗證失敗' },
      429: { code: 'RATE_LIMITED', message: '請求過於頻繁，請稍後再試' },
      500: { code: 'SERVER_ERROR', message: '伺服器錯誤' },
      502: { code: 'BAD_GATEWAY', message: '網關錯誤' },
      503: { code: 'SERVICE_UNAVAILABLE', message: '服務暫時不可用' },
    }

    const defaultError = errorMap[status] || { code: 'UNKNOWN_ERROR', message: '未知錯誤' }
    
    // 嘗試從響應體獲取更詳細的錯誤信息
    if (body && typeof body === 'object') {
      const bodyObj = body as Record<string, unknown>
      return new ApiException({
        code: (bodyObj.code as string) || defaultError.code,
        message: (bodyObj.message as string) || defaultError.message,
        status,
        details: bodyObj.details as Record<string, unknown>,
      })
    }

    return new ApiException({ ...defaultError, status })
  }
}

// ===========================================
// 請求工具函數
// ===========================================
const buildQueryString = (params?: Record<string, string | number | boolean | undefined>): string => {
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

const buildHeaders = (customHeaders?: Record<string, string>): Headers => {
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...customHeaders,
  })

  const token = getAuthToken()
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
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
  // Mock 模式檢查
  if (USE_MOCKS) {
    console.log(`[API Mock] ${method} ${endpoint}`, data)
    throw new Error('Mock mode enabled - implement mock handler')
  }

  const url = `${API_BASE_URL}${endpoint}${buildQueryString(config?.params)}`
  const headers = buildHeaders(config?.headers)

  // 創建 AbortController 用於超時控制
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
      signal: config?.signal || controller.signal,
    })

    clearTimeout(timeoutId)

    // 解析響應
    let responseBody: unknown
    const contentType = response.headers.get('content-type')
    
    if (contentType?.includes('application/json')) {
      responseBody = await response.json()
    } else {
      responseBody = await response.text()
    }

    // 處理錯誤響應
    if (!response.ok) {
      throw ApiException.fromResponse(response.status, responseBody)
    }

    // 標準化響應格式
    if (typeof responseBody === 'object' && responseBody !== null) {
      const body = responseBody as Record<string, unknown>
      if ('data' in body && 'success' in body) {
        return responseBody as ApiResponse<T>
      }
    }

    return {
      data: responseBody as T,
      success: true,
    }
  } catch (error) {
    clearTimeout(timeoutId)

    if (error instanceof ApiException) {
      throw error
    }

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new ApiException({
          code: 'TIMEOUT',
          message: '請求超時，請稍後再試',
          status: 408,
        })
      }

      throw new ApiException({
        code: 'NETWORK_ERROR',
        message: '網絡連接失敗，請檢查網絡設置',
        status: 0,
      })
    }

    throw new ApiException({
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
  get: <T>(endpoint: string, config?: RequestConfig) => 
    request<T>('GET', endpoint, undefined, config),
  
  post: <T>(endpoint: string, data?: unknown, config?: RequestConfig) => 
    request<T>('POST', endpoint, data, config),
  
  put: <T>(endpoint: string, data?: unknown, config?: RequestConfig) => 
    request<T>('PUT', endpoint, data, config),
  
  patch: <T>(endpoint: string, data?: unknown, config?: RequestConfig) => 
    request<T>('PATCH', endpoint, data, config),
  
  delete: <T>(endpoint: string, config?: RequestConfig) => 
    request<T>('DELETE', endpoint, undefined, config),
}

// ===========================================
// 環境檢查工具
// ===========================================
export const apiConfig = {
  baseUrl: API_BASE_URL,
  useMocks: USE_MOCKS,
  timeout: REQUEST_TIMEOUT,
  
  isMockMode: () => USE_MOCKS,
  getBaseUrl: () => API_BASE_URL,
}

export default apiClient
