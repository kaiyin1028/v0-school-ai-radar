/**
 * Services Index - 服務層統一導出
 * 
 * 所有服務都支援 Mock 模式切換:
 * NEXT_PUBLIC_USE_MOCKS=true  -> 使用 Mock 數據
 * NEXT_PUBLIC_USE_MOCKS=false -> 調用真實 API
 */

// Auth Service
export { authService, login, logout, me } from './auth.service'
export type { LoginRequest, LoginResponse, User, UserRole } from './auth.service'

// Users Service
export { usersService, getMe, updateMe, getUsers, getUserById } from './users.service'
export type { UpdateUserRequest, UsersQuery, UserPreferences } from './users.service'

// Schools Service
export { schoolsService, type SchoolListParams, type DashboardStats } from './schools'
export type { 
  SchoolListResponse, 
  SchoolDetailResponse,
  CreateSchoolInput,
  UpdateSchoolInput,
  DistrictStat,
  GradeDistribution,
} from './schools'

// Solutions Service
export { solutionsService, type SolutionRecommendation, type SchoolRecommendationsResponse } from './solutions'

// Workflows Service
export { workflowsService, type WorkflowStats, type WorkflowActivity } from './workflows'

// Scraping Service
export { scrapingService, type ScrapingTask, type ScrapingStats } from './scraping'

// 環境檢查
export const isMockMode = (): boolean => {
  return process.env.NEXT_PUBLIC_USE_MOCKS === 'true'
}
