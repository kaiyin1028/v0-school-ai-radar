/**
 * Auth Token 管理模組
 * 
 * 功能:
 * - 管理用戶認證 token
 * - 支援 localStorage 儲存 (瀏覽器環境)
 * - 預留 HttpOnly Cookie 支援 (生產環境建議)
 * 
 * 注意事項:
 * - 目前使用 localStorage 儲存 token，適合快速開發
 * - 生產環境建議改用 HttpOnly Cookie 提升安全性
 * - 後端需要配合設置 Set-Cookie header
 */

const TOKEN_KEY = 'hk_edu_auth_token'
const REFRESH_TOKEN_KEY = 'hk_edu_refresh_token'
const USER_KEY = 'hk_edu_user'

// ===========================================
// Token 管理
// ===========================================

/**
 * 獲取 Access Token
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    console.warn('[AuthToken] Failed to read token from localStorage')
    return null
  }
}

/**
 * 設置 Access Token
 */
export function setToken(token: string): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(TOKEN_KEY, token)
  } catch {
    console.error('[AuthToken] Failed to save token to localStorage')
  }
}

/**
 * 清除 Access Token
 */
export function clearToken(): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem(TOKEN_KEY)
  } catch {
    console.error('[AuthToken] Failed to clear token from localStorage')
  }
}

// ===========================================
// Refresh Token 管理
// ===========================================

/**
 * 獲取 Refresh Token
 */
export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null
  
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  } catch {
    return null
  }
}

/**
 * 設置 Refresh Token
 */
export function setRefreshToken(token: string): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(REFRESH_TOKEN_KEY, token)
  } catch {
    console.error('[AuthToken] Failed to save refresh token')
  }
}

/**
 * 清除 Refresh Token
 */
export function clearRefreshToken(): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  } catch {
    console.error('[AuthToken] Failed to clear refresh token')
  }
}

// ===========================================
// User Data 管理
// ===========================================

export interface StoredUser {
  id: string
  username: string
  email?: string
  name?: string
  role: string
  avatar?: string
}

/**
 * 獲取儲存的用戶資料
 */
export function getStoredUser(): StoredUser | null {
  if (typeof window === 'undefined') return null
  
  try {
    const userData = localStorage.getItem(USER_KEY)
    return userData ? JSON.parse(userData) : null
  } catch {
    return null
  }
}

/**
 * 設置用戶資料
 */
export function setStoredUser(user: StoredUser): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  } catch {
    console.error('[AuthToken] Failed to save user data')
  }
}

/**
 * 清除用戶資料
 */
export function clearStoredUser(): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem(USER_KEY)
  } catch {
    console.error('[AuthToken] Failed to clear user data')
  }
}

// ===========================================
// 統一清除所有認證數據
// ===========================================

/**
 * 清除所有認證相關數據 (登出時使用)
 */
export function clearAllAuthData(): void {
  clearToken()
  clearRefreshToken()
  clearStoredUser()
}

// ===========================================
// 檢查認證狀態
// ===========================================

/**
 * 檢查是否已認證 (有 token)
 */
export function isAuthenticated(): boolean {
  return !!getToken()
}

/**
 * 檢查 Token 是否過期
 * 注意: 這只做簡單的 JWT 解析，不驗證簽名
 */
export function isTokenExpired(token?: string | null): boolean {
  const t = token || getToken()
  if (!t) return true
  
  try {
    const payload = JSON.parse(atob(t.split('.')[1]))
    const exp = payload.exp
    
    if (!exp) return false // 沒有過期時間則視為不過期
    
    // 預留 30 秒緩衝
    return Date.now() >= (exp * 1000) - 30000
  } catch {
    return true // 解析失敗視為過期
  }
}

export default {
  getToken,
  setToken,
  clearToken,
  getRefreshToken,
  setRefreshToken,
  clearRefreshToken,
  getStoredUser,
  setStoredUser,
  clearStoredUser,
  clearAllAuthData,
  isAuthenticated,
  isTokenExpired,
}
