/**
 * Solutions Service - 解決方案服務
 * 
 * 處理所有與解決方案推薦相關的 API 請求
 */

import apiClient, { type ApiResponse, apiConfig } from '@/lib/api-client'
import type { Solution, DimensionScores } from '@/lib/types'
import { mockSolutions } from '@/mocks/solutions'

// ===========================================
// 類型定義
// ===========================================
export interface SolutionListParams {
  category?: string
  targetGrade?: string
  targetDimension?: keyof DimensionScores
}

export interface SolutionRecommendation {
  solution: Solution
  matchScore: number
  priority: number
  reasons: string[]
}

export interface SchoolRecommendationsResponse {
  schoolId: string
  schoolName: string
  recommendations: SolutionRecommendation[]
  weakDimensions: {
    dimension: keyof DimensionScores
    score: number
    label: string
  }[]
}

export interface CreateSolutionInput {
  name: string
  category: string
  description: string
  targetDimensions: (keyof DimensionScores)[]
  minGrade: 'A' | 'B' | 'C' | 'D'
  provider: string
  features: string[]
}

// ===========================================
// Mock 數據處理
// ===========================================
const filterMockSolutions = (params: SolutionListParams): Solution[] => {
  let filtered = [...mockSolutions]

  if (params.category) {
    filtered = filtered.filter(s => s.category === params.category)
  }

  if (params.targetGrade) {
    const gradeOrder = { A: 4, B: 3, C: 2, D: 1 }
    const minOrder = gradeOrder[params.targetGrade as keyof typeof gradeOrder]
    filtered = filtered.filter(s => gradeOrder[s.minGrade] <= minOrder)
  }

  if (params.targetDimension) {
    filtered = filtered.filter(s => 
      s.targetDimensions.includes(params.targetDimension!)
    )
  }

  return filtered
}

// ===========================================
// API 服務方法
// ===========================================
export const solutionsService = {
  /**
   * 獲取解決方案列表
   */
  async getList(params: SolutionListParams = {}): Promise<ApiResponse<Solution[]>> {
    if (apiConfig.isMockMode()) {
      await new Promise(resolve => setTimeout(resolve, 400))
      return {
        data: filterMockSolutions(params),
        success: true,
      }
    }

    return apiClient.get<Solution[]>('/solutions', { params })
  },

  /**
   * 獲取單個解決方案詳情
   */
  async getById(id: string): Promise<ApiResponse<Solution>> {
    if (apiConfig.isMockMode()) {
      await new Promise(resolve => setTimeout(resolve, 300))
      const solution = mockSolutions.find(s => s.id === id)
      if (!solution) {
        throw new Error('Solution not found')
      }
      return { data: solution, success: true }
    }

    return apiClient.get<Solution>(`/solutions/${id}`)
  },

  /**
   * 為學校生成推薦方案
   */
  async getRecommendationsForSchool(schoolId: string): Promise<ApiResponse<SchoolRecommendationsResponse>> {
    if (apiConfig.isMockMode()) {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // 模擬推薦邏輯
      const { mockSchools } = await import('@/mocks/schools')
      const school = mockSchools.find(s => s.id === schoolId)
      
      if (!school) {
        throw new Error('School not found')
      }

      // 找出薄弱維度
      const dimensions = Object.entries(school.dimensions) as [keyof DimensionScores, number][]
      const weakDimensions = dimensions
        .filter(([, score]) => score < 70)
        .sort((a, b) => a[1] - b[1])
        .slice(0, 3)
        .map(([dimension, score]) => ({
          dimension,
          score,
          label: dimension,
        }))

      // 匹配解決方案
      const recommendations: SolutionRecommendation[] = mockSolutions
        .filter(solution => {
          const gradeOrder = { A: 4, B: 3, C: 2, D: 1 }
          return gradeOrder[solution.minGrade] <= gradeOrder[school.maturityGrade]
        })
        .filter(solution => 
          solution.targetDimensions.some(d => 
            weakDimensions.some(w => w.dimension === d)
          )
        )
        .map((solution, index) => ({
          solution,
          matchScore: 95 - index * 10,
          priority: index + 1,
          reasons: [
            `針對 ${solution.targetDimensions.join(', ')} 維度提供專業支援`,
            `適合 ${school.maturityGrade} 級別學校`,
            `由 ${solution.provider} 提供專業服務`,
          ],
        }))

      return {
        data: {
          schoolId,
          schoolName: school.name,
          recommendations,
          weakDimensions,
        },
        success: true,
      }
    }

    return apiClient.get<SchoolRecommendationsResponse>(`/solutions/recommendations/${schoolId}`)
  },

  /**
   * 創建解決方案
   */
  async create(input: CreateSolutionInput): Promise<ApiResponse<Solution>> {
    if (apiConfig.isMockMode()) {
      await new Promise(resolve => setTimeout(resolve, 500))
      const newSolution: Solution = {
        id: `s${Date.now()}`,
        ...input,
      }
      return { data: newSolution, success: true }
    }

    return apiClient.post<Solution>('/solutions', input)
  },

  /**
   * 更新解決方案
   */
  async update(id: string, input: Partial<CreateSolutionInput>): Promise<ApiResponse<Solution>> {
    if (apiConfig.isMockMode()) {
      await new Promise(resolve => setTimeout(resolve, 500))
      const solution = mockSolutions.find(s => s.id === id)
      if (!solution) {
        throw new Error('Solution not found')
      }
      return { data: { ...solution, ...input }, success: true }
    }

    return apiClient.patch<Solution>(`/solutions/${id}`, input)
  },

  /**
   * 刪除解決方案
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    if (apiConfig.isMockMode()) {
      await new Promise(resolve => setTimeout(resolve, 300))
      return { data: undefined, success: true }
    }

    return apiClient.delete<void>(`/solutions/${id}`)
  },

  /**
   * 獲取方案分類列表
   */
  async getCategories(): Promise<ApiResponse<string[]>> {
    if (apiConfig.isMockMode()) {
      await new Promise(resolve => setTimeout(resolve, 200))
      const categories = [...new Set(mockSolutions.map(s => s.category))]
      return { data: categories, success: true }
    }

    return apiClient.get<string[]>('/solutions/categories')
  },
}

export default solutionsService
