/**
 * useScraping Hook - 數據抓取管理
 */

import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { scrapingService, type ScrapingTask, type ScrapingStats, type ScrapingTaskListParams } from '@/services/scraping'

// ===========================================
// 抓取任務列表 Hook
// ===========================================
export function useScrapingTasks(params: ScrapingTaskListParams = {}) {
  const key = ['scraping-tasks', params]
  
  const { data, error, isLoading, mutate } = useSWR<ScrapingTask[]>(
    key,
    async () => {
      const response = await scrapingService.getList(params)
      return response.data
    },
    {
      revalidateOnFocus: false,
      refreshInterval: params.status === 'running' ? 5000 : 0, // 運行中的任務每 5 秒刷新
    }
  )

  return {
    tasks: data || [],
    isLoading,
    error,
    refresh: mutate,
  }
}

// ===========================================
// 單個任務詳情 Hook
// ===========================================
export function useScrapingTask(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<ScrapingTask>(
    id ? ['scraping-task', id] : null,
    async () => {
      const response = await scrapingService.getById(id!)
      return response.data
    },
    {
      revalidateOnFocus: false,
      refreshInterval: data?.status === 'running' ? 3000 : 0,
    }
  )

  return {
    task: data,
    isLoading,
    error,
    refresh: mutate,
  }
}

// ===========================================
// 抓取統計 Hook
// ===========================================
export function useScrapingStats() {
  const { data, error, isLoading, mutate } = useSWR<ScrapingStats>(
    'scraping-stats',
    async () => {
      const response = await scrapingService.getStats()
      return response.data
    },
    {
      revalidateOnFocus: false,
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
// 任務日誌 Hook
// ===========================================
export function useScrapingLogs(taskId: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    taskId ? ['scraping-logs', taskId] : null,
    async () => {
      const response = await scrapingService.getLogs(taskId!)
      return response.data.logs
    },
    {
      revalidateOnFocus: false,
      refreshInterval: 5000,
    }
  )

  return {
    logs: data || [],
    isLoading,
    error,
    refresh: mutate,
  }
}

// ===========================================
// 抓取 Mutations
// ===========================================
export function useScrapingMutations() {
  const createMutation = useSWRMutation(
    'scraping-tasks',
    async (_key, { arg }: { arg: Parameters<typeof scrapingService.create>[0] }) => {
      const response = await scrapingService.create(arg)
      return response.data
    }
  )

  const startMutation = useSWRMutation(
    'scraping-tasks',
    async (_key, { arg }: { arg: string }) => {
      const response = await scrapingService.start(arg)
      return response.data
    }
  )

  const stopMutation = useSWRMutation(
    'scraping-tasks',
    async (_key, { arg }: { arg: string }) => {
      const response = await scrapingService.stop(arg)
      return response.data
    }
  )

  const retryMutation = useSWRMutation(
    'scraping-tasks',
    async (_key, { arg }: { arg: string }) => {
      const response = await scrapingService.retry(arg)
      return response.data
    }
  )

  const deleteMutation = useSWRMutation(
    'scraping-tasks',
    async (_key, { arg }: { arg: string }) => {
      await scrapingService.delete(arg)
    }
  )

  const bulkCreateMutation = useSWRMutation(
    'scraping-tasks',
    async (_key, { arg }: { arg: string[] }) => {
      const response = await scrapingService.bulkCreate(arg)
      return response.data
    }
  )

  return {
    createTask: createMutation.trigger,
    isCreating: createMutation.isMutating,
    
    startTask: startMutation.trigger,
    isStarting: startMutation.isMutating,
    
    stopTask: stopMutation.trigger,
    isStopping: stopMutation.isMutating,
    
    retryTask: retryMutation.trigger,
    isRetrying: retryMutation.isMutating,
    
    deleteTask: deleteMutation.trigger,
    isDeleting: deleteMutation.isMutating,
    
    bulkCreateTasks: bulkCreateMutation.trigger,
    isBulkCreating: bulkCreateMutation.isMutating,
  }
}

export type { ScrapingTask, ScrapingStats }
