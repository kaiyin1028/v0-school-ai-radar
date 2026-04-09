/**
 * useSchools Hook - 學校數據管理
 * 
 * 使用 SWR 進行數據獲取、緩存和同步
 */

import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { schoolsService, type SchoolListParams, type DashboardStats } from '@/services/schools'
import type { School } from '@/lib/types'

// ===========================================
// 學校列表 Hook
// ===========================================
export function useSchools(params: SchoolListParams = {}) {
  const key = ['schools', params]
  
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    key,
    async () => {
      const response = await schoolsService.getList(params)
      return response.data
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  )

  return {
    schools: data?.schools || [],
    total: data?.total || 0,
    page: data?.page || 1,
    pageSize: data?.pageSize || 10,
    totalPages: data?.totalPages || 0,
    isLoading,
    isValidating,
    error,
    refresh: mutate,
  }
}

// ===========================================
// 單個學校詳情 Hook
// ===========================================
export function useSchool(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? ['school', id] : null,
    async () => {
      const response = await schoolsService.getById(id!)
      return response.data
    },
    {
      revalidateOnFocus: false,
    }
  )

  return {
    school: data?.school,
    assessmentHistory: data?.assessmentHistory,
    isLoading,
    error,
    refresh: mutate,
  }
}

// ===========================================
// 儀表板統計 Hook
// ===========================================
export function useDashboardStats() {
  const { data, error, isLoading, mutate } = useSWR<DashboardStats>(
    'dashboard-stats',
    async () => {
      const response = await schoolsService.getDashboardStats()
      return response.data
    },
    {
      revalidateOnFocus: false,
      refreshInterval: 60000, // 每分鐘刷新
    }
  )

  return {
    stats: data,
    isLoading,
    error,
    refresh: mutate,
  }
}

// ===========================================
// 區域統計 Hook
// ===========================================
export function useDistrictStats() {
  const { data, error, isLoading } = useSWR(
    'district-stats',
    async () => {
      const response = await schoolsService.getDistrictStats()
      return response.data
    },
    {
      revalidateOnFocus: false,
    }
  )

  return {
    districtStats: data || [],
    isLoading,
    error,
  }
}

// ===========================================
// 學校 Mutations
// ===========================================
export function useSchoolMutations() {
  const createMutation = useSWRMutation(
    'schools',
    async (_key, { arg }: { arg: Parameters<typeof schoolsService.create>[0] }) => {
      const response = await schoolsService.create(arg)
      return response.data
    }
  )

  const updateMutation = useSWRMutation(
    'schools',
    async (_key, { arg }: { arg: { id: string; data: Parameters<typeof schoolsService.update>[1] } }) => {
      const response = await schoolsService.update(arg.id, arg.data)
      return response.data
    }
  )

  const deleteMutation = useSWRMutation(
    'schools',
    async (_key, { arg }: { arg: string }) => {
      await schoolsService.delete(arg)
    }
  )

  return {
    createSchool: createMutation.trigger,
    isCreating: createMutation.isMutating,
    createError: createMutation.error,
    
    updateSchool: (id: string, data: Parameters<typeof schoolsService.update>[1]) => 
      updateMutation.trigger({ id, data }),
    isUpdating: updateMutation.isMutating,
    updateError: updateMutation.error,
    
    deleteSchool: deleteMutation.trigger,
    isDeleting: deleteMutation.isMutating,
    deleteError: deleteMutation.error,
  }
}

// ===========================================
// 導出類型
// ===========================================
export type { School, SchoolListParams, DashboardStats }
