/**
 * useSolutions Hook - 解決方案數據管理
 */

import useSWR from 'swr'
import { solutionsService, type SchoolRecommendationsResponse } from '@/services/solutions'
import type { Solution, DimensionScores } from '@/lib/types'

// ===========================================
// 類型定義
// ===========================================
export interface SolutionListParams {
  category?: string
  targetGrade?: string
  targetDimension?: keyof DimensionScores
}

// ===========================================
// 解決方案列表 Hook
// ===========================================
export function useSolutions(params: SolutionListParams = {}) {
  const key = ['solutions', params]
  
  const { data, error, isLoading, mutate } = useSWR<Solution[]>(
    key,
    async () => {
      const response = await solutionsService.getList(params)
      return response.data
    },
    {
      revalidateOnFocus: false,
    }
  )

  return {
    solutions: data || [],
    isLoading,
    error,
    refresh: mutate,
  }
}

// ===========================================
// 單個解決方案 Hook
// ===========================================
export function useSolution(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Solution>(
    id ? ['solution', id] : null,
    async () => {
      const response = await solutionsService.getById(id!)
      return response.data
    },
    {
      revalidateOnFocus: false,
    }
  )

  return {
    solution: data,
    isLoading,
    error,
    refresh: mutate,
  }
}

// ===========================================
// 學校推薦方案 Hook
// ===========================================
export function useSchoolRecommendations(schoolId: string | null) {
  const { data, error, isLoading, mutate } = useSWR<SchoolRecommendationsResponse>(
    schoolId ? ['recommendations', schoolId] : null,
    async () => {
      const response = await solutionsService.getRecommendationsForSchool(schoolId!)
      return response.data
    },
    {
      revalidateOnFocus: false,
    }
  )

  return {
    schoolName: data?.schoolName,
    recommendations: data?.recommendations || [],
    weakDimensions: data?.weakDimensions || [],
    isLoading,
    error,
    refresh: mutate,
  }
}

// ===========================================
// 方案分類列表 Hook
// ===========================================
export function useSolutionCategories() {
  const { data, error, isLoading } = useSWR<string[]>(
    'solution-categories',
    async () => {
      const response = await solutionsService.getCategories()
      return response.data
    },
    {
      revalidateOnFocus: false,
    }
  )

  return {
    categories: data || [],
    isLoading,
    error,
  }
}

export type { Solution, SchoolRecommendationsResponse }
