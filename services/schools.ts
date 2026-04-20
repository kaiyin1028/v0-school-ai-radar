/**
 * Schools Service - 學校數據服務
 * 
 * 處理所有與學校相關的 API 請求
 */

import apiClient, { 
  type ApiResponse, 
  type PaginationParams, 
  type FilterParams,
  apiConfig 
} from '@/lib/api-client'
import type { School, DimensionScores } from '@/lib/types'
import { mockSchools, districtStats, gradeDistribution } from '@/mocks/schools'

// ===========================================
// 類型定義
// ===========================================
export interface SchoolListParams extends PaginationParams, FilterParams {}

export interface SchoolListResponse {
  schools: School[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface SchoolDetailResponse {
  school: School
  assessmentHistory?: AssessmentRecord[]
}

export interface AssessmentRecord {
  id: string
  assessedAt: string
  overallScore: number
  grade: string
  dimensions: DimensionScores
}

export interface CreateSchoolInput {
  name: string
  district: string
  type: School['type']
  level: School['level']
  website?: string
}

export interface UpdateSchoolInput {
  name?: string
  district?: string
  type?: School['type']
  level?: School['level']
  website?: string
}

export interface DistrictStat {
  district: string
  schools: number
  avgScore: number
}

export interface GradeDistribution {
  grade: string
  count: number
  percentage: number
}

export interface DashboardStats {
  totalSchools: number
  analyzedSchools: number
  averageScore: number
  gradeDistribution: GradeDistribution[]
  districtStats: DistrictStat[]
  recentlyUpdated: School[]
}

// ===========================================
// Mock 數據處理
// ===========================================
const getMockSchoolList = (params: SchoolListParams): SchoolListResponse => {
  let filtered = [...mockSchools]

  // 搜索過濾
  if (params.search) {
    const searchLower = params.search.toLowerCase()
    filtered = filtered.filter(s => 
      s.name.toLowerCase().includes(searchLower) ||
      s.district.toLowerCase().includes(searchLower)
    )
  }

  // 區域過濾
  if (params.district) {
    filtered = filtered.filter(s => s.district === params.district)
  }

  // 類型過濾
  if (params.type) {
    filtered = filtered.filter(s => s.type === params.type)
  }

  // 等級過濾
  if (params.grade) {
    filtered = filtered.filter(s => s.maturityGrade === params.grade)
  }

  // 排序
  if (params.sortBy) {
    filtered.sort((a, b) => {
      const aVal = a[params.sortBy as keyof School]
      const bVal = b[params.sortBy as keyof School]
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return params.sortOrder === 'desc' ? bVal - aVal : aVal - bVal
      }
      return params.sortOrder === 'desc' 
        ? String(bVal).localeCompare(String(aVal))
        : String(aVal).localeCompare(String(bVal))
    })
  }

  // 分頁
  const page = params.page || 1
  const pageSize = params.pageSize || 10
  const start = (page - 1) * pageSize
  const paged = filtered.slice(start, start + pageSize)

  return {
    schools: paged,
    total: filtered.length,
    page,
    pageSize,
    totalPages: Math.ceil(filtered.length / pageSize),
  }
}

const getMockDashboardStats = (): DashboardStats => {
  const totalSchools = 570
  const analyzedSchools = mockSchools.filter(s => s.status === 'completed').length
  const averageScore = Math.round(
    mockSchools.reduce((sum, s) => sum + s.overallScore, 0) / mockSchools.length
  )

  return {
    totalSchools,
    analyzedSchools,
    averageScore,
    gradeDistribution,
    districtStats,
    recentlyUpdated: mockSchools.slice(0, 5),
  }
}

// ===========================================
// API 服務方法
// ===========================================
export const schoolsService = {
  /**
   * 獲取學校列表
   */
  async getList(params: SchoolListParams = {}): Promise<ApiResponse<SchoolListResponse>> {
    if (apiConfig.isMockMode()) {
      // 模擬網絡延遲
      await new Promise(resolve => setTimeout(resolve, 500))
      return {
        data: getMockSchoolList(params),
        success: true,
      }
    }

    return apiClient.get<SchoolListResponse>('/schools', {
      params: {
        page: params.page,
        pageSize: params.pageSize,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
        search: params.search,
        district: params.district,
        type: params.type,
        grade: params.grade,
        status: params.status,
      },
    })
  },

  /**
   * 獲取單個學校詳情
   */
  async getById(id: string): Promise<ApiResponse<SchoolDetailResponse>> {
    if (apiConfig.isMockMode()) {
      await new Promise(resolve => setTimeout(resolve, 300))
      const school = mockSchools.find(s => s.id === id)
      if (!school) {
        throw new Error('School not found')
      }
      return {
        data: { school },
        success: true,
      }
    }

    return apiClient.get<SchoolDetailResponse>(`/schools/${id}`)
  },

  /**
   * 創建新學校
   */
  async create(input: CreateSchoolInput): Promise<ApiResponse<School>> {
    if (apiConfig.isMockMode()) {
      await new Promise(resolve => setTimeout(resolve, 500))
      const newSchool: School = {
        id: String(Date.now()),
        ...input,
        website: input.website || '',
        maturityGrade: 'D',
        overallScore: 0,
        dimensions: {
          curriculum: 0,
          infrastructure: 0,
          teacherTraining: 0,
          studentLiteracy: 0,
          governance: 0,
          ethics: 0,
          partnership: 0,
          innovation: 0,
        },
        lastUpdated: new Date().toISOString().split('T')[0],
        status: 'pending',
      }
      return { data: newSchool, success: true }
    }

    return apiClient.post<School>('/schools', input)
  },

  /**
   * 更新學校信息
   */
  async update(id: string, input: UpdateSchoolInput): Promise<ApiResponse<School>> {
    if (apiConfig.isMockMode()) {
      await new Promise(resolve => setTimeout(resolve, 500))
      const school = mockSchools.find(s => s.id === id)
      if (!school) {
        throw new Error('School not found')
      }
      const updated = { ...school, ...input }
      return { data: updated, success: true }
    }

    return apiClient.patch<School>(`/schools/${id}`, input)
  },

  /**
   * 刪除學校
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    if (apiConfig.isMockMode()) {
      await new Promise(resolve => setTimeout(resolve, 300))
      return { data: undefined, success: true }
    }

    return apiClient.delete<void>(`/schools/${id}`)
  },

  /**
   * 獲取儀表板統計數據
   */
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    if (apiConfig.isMockMode()) {
      await new Promise(resolve => setTimeout(resolve, 600))
      return {
        data: getMockDashboardStats(),
        success: true,
      }
    }

    return apiClient.get<DashboardStats>('/schools/dashboard-stats')
  },

  /**
   * 獲取區域統計
   */
  async getDistrictStats(): Promise<ApiResponse<DistrictStat[]>> {
    if (apiConfig.isMockMode()) {
      await new Promise(resolve => setTimeout(resolve, 400))
      return { data: districtStats, success: true }
    }

    return apiClient.get<DistrictStat[]>('/schools/district-stats')
  },

  /**
   * 批量匯入學校
   */
  async bulkImport(schools: CreateSchoolInput[]): Promise<ApiResponse<{ imported: number; failed: number }>> {
    if (apiConfig.isMockMode()) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return {
        data: { imported: schools.length, failed: 0 },
        success: true,
      }
    }

    return apiClient.post<{ imported: number; failed: number }>('/schools/bulk-import', { schools })
  },

  /**
   * 導出學校數據
   */
  async export(params: FilterParams): Promise<ApiResponse<{ downloadUrl: string }>> {
    if (apiConfig.isMockMode()) {
      await new Promise(resolve => setTimeout(resolve, 800))
      return {
        data: { downloadUrl: '/mock-export.csv' },
        success: true,
      }
    }

    return apiClient.post<{ downloadUrl: string }>('/schools/export', params)
  },
}

export default schoolsService
