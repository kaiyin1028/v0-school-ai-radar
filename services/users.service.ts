/**
 * Users Service - 用戶管理服務
 * 
 * 提供:
 * - getMe() - 獲取當前用戶資料
 * - updateMe(payload) - 更新當前用戶資料
 * - getUsers() - 獲取用戶列表 (管理員)
 * - getUserById(id) - 獲取指定用戶
 * 
 * Mock 模式: NEXT_PUBLIC_USE_MOCKS=true 時使用 mock 數據
 */

import { apiClient, ApiError, type ApiResponse } from '@/lib/api-client'
import { getStoredUser, setStoredUser } from '@/lib/auth-token'

// ===========================================
// 類型定義
// ===========================================

export interface User {
  id: string
  username: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  phone?: string
  school?: {
    id: string
    name: string
  }
  preferences?: UserPreferences
  createdAt: string
  updatedAt: string
}

export type UserRole = 'admin' | 'school_admin' | 'teacher' | 'student' | 'parent'

export interface UserPreferences {
  language: 'zh-HK' | 'zh-CN' | 'en'
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
  }
  theme: 'light' | 'dark' | 'system'
}

export interface UpdateUserRequest {
  name?: string
  email?: string
  phone?: string
  avatar?: string
  preferences?: Partial<UserPreferences>
}

export interface UsersQuery {
  page?: number
  pageSize?: number
  search?: string
  role?: UserRole
  schoolId?: string
}

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
    phone: '+852 9123 4567',
    preferences: {
      language: 'zh-HK',
      notifications: { email: true, push: true, sms: false },
      theme: 'light',
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    username: 'teacher',
    email: 'teacher@school.edu.hk',
    name: '陳老師',
    role: 'teacher',
    phone: '+852 9234 5678',
    school: { id: 'SCH001', name: '香港培正中學' },
    preferences: {
      language: 'zh-HK',
      notifications: { email: true, push: false, sms: false },
      theme: 'light',
    },
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '3',
    username: 'principal',
    email: 'principal@school.edu.hk',
    name: '李校長',
    role: 'school_admin',
    phone: '+852 9345 6789',
    school: { id: 'SCH001', name: '香港培正中學' },
    preferences: {
      language: 'zh-HK',
      notifications: { email: true, push: true, sms: true },
      theme: 'system',
    },
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
]

const mockDelay = () => new Promise(resolve => setTimeout(resolve, 300))

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
 * 獲取當前用戶資料
 */
export async function getMe(): Promise<User> {
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
  
  const response = await apiClient.get<User>('/users/me')
  return response.data
}

/**
 * 更新當前用戶資料
 */
export async function updateMe(payload: UpdateUserRequest): Promise<User> {
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
    
    const userIndex = mockUsers.findIndex(u => u.id === storedUser.id)
    if (userIndex === -1) {
      throw new ApiError({
        code: 'USER_NOT_FOUND',
        message: '用戶不存在',
        status: 404,
      })
    }
    
    // 更新 mock 數據
    const updatedUser: User = {
      ...mockUsers[userIndex],
      ...payload,
      preferences: {
        ...mockUsers[userIndex].preferences!,
        ...payload.preferences,
      },
      updatedAt: new Date().toISOString(),
    }
    mockUsers[userIndex] = updatedUser
    
    // 更新儲存的用戶資料
    setStoredUser({
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
      avatar: updatedUser.avatar,
    })
    
    return updatedUser
  }
  
  const response = await apiClient.patch<User>('/users/me', payload)
  
  // 更新本地儲存
  setStoredUser({
    id: response.data.id,
    username: response.data.username,
    email: response.data.email,
    name: response.data.name,
    role: response.data.role,
    avatar: response.data.avatar,
  })
  
  return response.data
}

/**
 * 獲取用戶列表 (管理員功能)
 */
export async function getUsers(query?: UsersQuery): Promise<ApiResponse<User[]>> {
  if (isMockMode()) {
    await mockDelay()
    
    let filtered = [...mockUsers]
    
    if (query?.search) {
      const search = query.search.toLowerCase()
      filtered = filtered.filter(u => 
        u.name.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search) ||
        u.username.toLowerCase().includes(search)
      )
    }
    
    if (query?.role) {
      filtered = filtered.filter(u => u.role === query.role)
    }
    
    const page = query?.page || 1
    const pageSize = query?.pageSize || 10
    const start = (page - 1) * pageSize
    const end = start + pageSize
    
    return {
      data: filtered.slice(start, end),
      meta: {
        total: filtered.length,
        page,
        pageSize,
        totalPages: Math.ceil(filtered.length / pageSize),
      },
    }
  }
  
  return apiClient.get<User[]>('/users', {
    params: query as Record<string, string | number | boolean | undefined>,
  })
}

/**
 * 獲取指定用戶
 */
export async function getUserById(id: string): Promise<User> {
  if (isMockMode()) {
    await mockDelay()
    
    const user = mockUsers.find(u => u.id === id)
    if (!user) {
      throw new ApiError({
        code: 'USER_NOT_FOUND',
        message: '用戶不存在',
        status: 404,
      })
    }
    
    return user
  }
  
  const response = await apiClient.get<User>(`/users/${id}`)
  return response.data
}

// ===========================================
// 導出
// ===========================================

export const usersService = {
  getMe,
  updateMe,
  getUsers,
  getUserById,
}

export default usersService
