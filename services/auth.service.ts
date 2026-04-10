/**
 * Auth Service - 認證服務
 * 
 * 提供:
 * - login(username, password)
 * - logout()
 * - me() - 獲取當前用戶
 * 
 * Mock 模式: NEXT_PUBLIC_USE_MOCKS=true 時使用 mock 數據
 */

import { apiClient, ApiError } from '@/lib/api-client'
import { 
  setToken, 
  clearAllAuthData, 
  setStoredUser, 
  getStoredUser,
  type StoredUser 
} from '@/lib/auth-token'

// ===========================================
// 類型定義
// ===========================================

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  refreshToken?: string
  user: User
}

export interface User {
  id: string
  username: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  school?: {
    id: string
    name: string
  }
  createdAt: string
  updatedAt: string
}

export type UserRole = 'admin' | 'school_admin' | 'teacher' | 'student' | 'parent'

// ===========================================
// Mock 數據
// ===========================================

const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@hkeea.org.hk',
    name: '系統管理員',
    role: 'admin',
    avatar: '/images/avatars/admin.png',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    username: 'teacher',
    email: 'teacher@school.edu.hk',
    name: '陳老師',
    role: 'teacher',
    school: { id: 'SCH001', name: '香港培正中學' },
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '3',
    username: 'principal',
    email: 'principal@school.edu.hk',
    name: '李校長',
    role: 'school_admin',
    school: { id: 'SCH001', name: '香港培正中學' },
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
]

const mockDelay = () => new Promise(resolve => setTimeout(resolve, 500))

// ===========================================
// 環境檢查
// ===========================================

const isMockMode = (): boolean => {
  return process.env.NEXT_PUBLIC_USE_MOCKS === 'true'
}

// ===========================================
// Service 實現
// ===========================================

/**
 * 用戶登入
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  if (isMockMode()) {
    await mockDelay()
    
    // Mock: 簡單密碼驗證
    const user = mockUsers.find(u => u.username === credentials.username)
    
    if (!user || credentials.password !== 'password123') {
      throw new ApiError({
        code: 'INVALID_CREDENTIALS',
        message: '用戶名或密碼錯誤',
        status: 401,
      })
    }
    
    const mockToken = `mock_token_${user.id}_${Date.now()}`
    
    // 儲存 token 和用戶資料
    setToken(mockToken)
    setStoredUser({
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
    })
    
    return {
      token: mockToken,
      user,
    }
  }
  
  // Real API
  const response = await apiClient.post<LoginResponse>('/auth/login', credentials, {
    skipAuth: true,
  })
  
  // 儲存認證數據
  setToken(response.data.token)
  setStoredUser({
    id: response.data.user.id,
    username: response.data.user.username,
    email: response.data.user.email,
    name: response.data.user.name,
    role: response.data.user.role,
    avatar: response.data.user.avatar,
  })
  
  return response.data
}

/**
 * 用戶登出
 */
export async function logout(): Promise<void> {
  if (isMockMode()) {
    await mockDelay()
    clearAllAuthData()
    return
  }
  
  try {
    await apiClient.post('/auth/logout')
  } finally {
    // 無論 API 是否成功，都清除本地認證數據
    clearAllAuthData()
  }
}

/**
 * 獲取當前登入用戶
 */
export async function me(): Promise<User> {
  if (isMockMode()) {
    await mockDelay()
    
    const storedUser = getStoredUser()
    if (!storedUser) {
      throw new ApiError({
        code: 'UNAUTHORIZED',
        message: '未登入',
        status: 401,
      })
    }
    
    const user = mockUsers.find(u => u.id === storedUser.id)
    if (!user) {
      throw new ApiError({
        code: 'USER_NOT_FOUND',
        message: '用戶不存在',
        status: 404,
      })
    }
    
    return user
  }
  
  const response = await apiClient.get<User>('/auth/me')
  return response.data
}

// ===========================================
// 導出
// ===========================================

export const authService = {
  login,
  logout,
  me,
}

export default authService
