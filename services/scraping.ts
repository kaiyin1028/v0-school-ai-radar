/**
 * Scraping Service - 數據抓取服務
 * 
 * 處理所有與學校官網數據抓取相關的 API 請求
 */

import apiClient, { type ApiResponse, apiConfig } from '@/lib/api-client'

// ===========================================
// 類型定義
// ===========================================
export type ScrapingStatus = 'pending' | 'running' | 'completed' | 'failed'

export interface ScrapingTask {
  id: string
  schoolId: string
  schoolName: string
  schoolWebsite: string
  status: ScrapingStatus
  progress: number
  pagesScraped: number
  totalPages: number
  dataCollected: ScrapedData
  startedAt?: string
  completedAt?: string
  errorMessage?: string
  createdAt: string
}

export interface ScrapedData {
  basicInfo: boolean
  curriculum: boolean
  facilities: boolean
  news: boolean
  events: boolean
  achievements: boolean
}

export interface ScrapingStats {
  totalTasks: number
  completed: number
  running: number
  pending: number
  failed: number
  totalPagesScraped: number
  avgPagesPerSchool: number
}

export interface CreateScrapingTaskInput {
  schoolId: string
  priority?: 'low' | 'normal' | 'high'
  options?: {
    includeImages?: boolean
    includeDocuments?: boolean
    maxPages?: number
  }
}

export interface ScrapingTaskListParams {
  status?: ScrapingStatus
  schoolId?: string
  page?: number
  pageSize?: number
}

// ===========================================
// Mock 數據
// ===========================================
const mockScrapingTasks: ScrapingTask[] = [
  {
    id: 'st1',
    schoolId: '1',
    schoolName: '聖保羅男女中學',
    schoolWebsite: 'https://www.spcc.edu.hk',
    status: 'completed',
    progress: 100,
    pagesScraped: 45,
    totalPages: 45,
    dataCollected: {
      basicInfo: true,
      curriculum: true,
      facilities: true,
      news: true,
      events: true,
      achievements: true,
    },
    startedAt: '2024-03-14T09:00:00Z',
    completedAt: '2024-03-14T09:15:00Z',
    createdAt: '2024-03-14T08:55:00Z',
  },
  {
    id: 'st2',
    schoolId: '2',
    schoolName: '拔萃男書院',
    schoolWebsite: 'https://www.dbs.edu.hk',
    status: 'completed',
    progress: 100,
    pagesScraped: 38,
    totalPages: 38,
    dataCollected: {
      basicInfo: true,
      curriculum: true,
      facilities: true,
      news: true,
      events: true,
      achievements: true,
    },
    startedAt: '2024-03-13T14:00:00Z',
    completedAt: '2024-03-13T14:12:00Z',
    createdAt: '2024-03-13T13:50:00Z',
  },
  {
    id: 'st3',
    schoolId: '6',
    schoolName: '培正中學',
    schoolWebsite: 'https://www.puiching.edu.hk',
    status: 'running',
    progress: 65,
    pagesScraped: 22,
    totalPages: 34,
    dataCollected: {
      basicInfo: true,
      curriculum: true,
      facilities: true,
      news: false,
      events: false,
      achievements: false,
    },
    startedAt: '2024-03-15T10:30:00Z',
    createdAt: '2024-03-15T10:25:00Z',
  },
  {
    id: 'st4',
    schoolId: '8',
    schoolName: '新界鄉議局元朗區中學',
    schoolWebsite: 'https://www.nthykyldss.edu.hk',
    status: 'pending',
    progress: 0,
    pagesScraped: 0,
    totalPages: 0,
    dataCollected: {
      basicInfo: false,
      curriculum: false,
      facilities: false,
      news: false,
      events: false,
      achievements: false,
    },
    createdAt: '2024-03-15T11:00:00Z',
  },
  {
    id: 'st5',
    schoolId: '5',
    schoolName: '華仁書院（九龍）',
    schoolWebsite: 'https://www.wyk.edu.hk',
    status: 'failed',
    progress: 30,
    pagesScraped: 12,
    totalPages: 40,
    dataCollected: {
      basicInfo: true,
      curriculum: false,
      facilities: false,
      news: false,
      events: false,
      achievements: false,
    },
    startedAt: '2024-03-12T16:00:00Z',
    errorMessage: '連接超時：無法訪問學校網站',
    createdAt: '2024-03-12T15:55:00Z',
  },
]

// ===========================================
// Mock 數據處理
// ===========================================
const filterMockTasks = (params: ScrapingTaskListParams): ScrapingTask[] => {
  let filtered = [...mockScrapingTasks]

  if (params.status) {
    filtered = filtered.filter(t => t.status === params.status)
  }

  if (params.schoolId) {
    filtered = filtered.filter(t => t.schoolId === params.schoolId)
  }

  return filtered
}

const getMockStats = (): ScrapingStats => {
  const tasks = mockScrapingTasks
  const completed = tasks.filter(t => t.status === 'completed')
  
  return {
    totalTasks: tasks.length,
    completed: completed.length,
    running: tasks.filter(t => t.status === 'running').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    failed: tasks.filter(t => t.status === 'failed').length,
    totalPagesScraped: tasks.reduce((sum, t) => sum + t.pagesScraped, 0),
    avgPagesPerSchool: completed.length > 0 
      ? Math.round(completed.reduce((sum, t) => sum + t.pagesScraped, 0) / completed.length)
      : 0,
  }
}

// ===========================================
// API 服務方法
// ===========================================
export const scrapingService = {
  /**
   * 獲取抓取任務列表
   */
  async getList(params: ScrapingTaskListParams = {}): Promise<ApiResponse<ScrapingTask[]>> {
    if (apiConfig.isMockMode()) {
      await new Promise(resolve => setTimeout(resolve, 400))
      return {
        data: filterMockTasks(params),
        success: true,
      }
    }

    return apiClient.get<ScrapingTask[]>('/scraping/tasks', { params })
  },

  /**
   * 獲取單個任務詳情
   */
  async getById(id: string): Promise<ApiResponse<ScrapingTask>> {
    if (apiConfig.isMockMode()) {
      await new Promise(resolve => setTimeout(resolve, 300))
      const task = mockScrapingTasks.find(t => t.id === id)
      if (!task) {
        throw new Error('Task not found')
      }
      return { data: task, success: true }
    }

    return apiClient.get<ScrapingTask>(`/scraping/tasks/${id}`)
  },

  /**
   * 獲取抓取統計
   */
  async getStats(): Promise<ApiResponse<ScrapingStats>> {
    if (apiConfig.isMockMode()) {
      await new Promise(resolve => setTimeout(resolve, 400))
      return {
        data: getMockStats(),
        success: true,
      }
    }

    return apiClient.get<ScrapingStats>('/scraping/stats')
  },

  /**
   * 創建抓取任務
   */
  async create(input: CreateScrapingTaskInput): Promise<ApiResponse<ScrapingTask>> {
    if (apiConfig.isMockMode()) {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const { mockSchools } = await import('@/mocks/schools')
      const school = mockSchools.find(s => s.id === input.schoolId)
      
      const newTask: ScrapingTask = {
        id: `st${Date.now()}`,
        schoolId: input.schoolId,
        schoolName: school?.name || 'Unknown School',
        schoolWebsite: school?.website || '',
        status: 'pending',
        progress: 0,
        pagesScraped: 0,
        totalPages: 0,
        dataCollected: {
          basicInfo: false,
          curriculum: false,
          facilities: false,
          news: false,
          events: false,
          achievements: false,
        },
        createdAt: new Date().toISOString(),
      }
      return { data: newTask, success: true }
    }

    return apiClient.post<ScrapingTask>('/scraping/tasks', input)
  },

  /**
   * 開始執行任務
   */
  async start(id: string): Promise<ApiResponse<ScrapingTask>> {
    if (apiConfig.isMockMode()) {
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const task = mockScrapingTasks.find(t => t.id === id)
      if (!task) {
        throw new Error('Task not found')
      }

      const updated: ScrapingTask = {
        ...task,
        status: 'running',
        startedAt: new Date().toISOString(),
      }
      return { data: updated, success: true }
    }

    return apiClient.post<ScrapingTask>(`/scraping/tasks/${id}/start`)
  },

  /**
   * 停止任務
   */
  async stop(id: string): Promise<ApiResponse<ScrapingTask>> {
    if (apiConfig.isMockMode()) {
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const task = mockScrapingTasks.find(t => t.id === id)
      if (!task) {
        throw new Error('Task not found')
      }

      const updated: ScrapingTask = {
        ...task,
        status: 'pending',
      }
      return { data: updated, success: true }
    }

    return apiClient.post<ScrapingTask>(`/scraping/tasks/${id}/stop`)
  },

  /**
   * 重試失敗的任務
   */
  async retry(id: string): Promise<ApiResponse<ScrapingTask>> {
    if (apiConfig.isMockMode()) {
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const task = mockScrapingTasks.find(t => t.id === id)
      if (!task) {
        throw new Error('Task not found')
      }

      const updated: ScrapingTask = {
        ...task,
        status: 'pending',
        progress: 0,
        errorMessage: undefined,
      }
      return { data: updated, success: true }
    }

    return apiClient.post<ScrapingTask>(`/scraping/tasks/${id}/retry`)
  },

  /**
   * 刪除任務
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    if (apiConfig.isMockMode()) {
      await new Promise(resolve => setTimeout(resolve, 300))
      return { data: undefined, success: true }
    }

    return apiClient.delete<void>(`/scraping/tasks/${id}`)
  },

  /**
   * 批量創建抓取任務
   */
  async bulkCreate(schoolIds: string[]): Promise<ApiResponse<{ created: number }>> {
    if (apiConfig.isMockMode()) {
      await new Promise(resolve => setTimeout(resolve, 800))
      return {
        data: { created: schoolIds.length },
        success: true,
      }
    }

    return apiClient.post<{ created: number }>('/scraping/tasks/bulk', { schoolIds })
  },

  /**
   * 獲取任務日誌
   */
  async getLogs(id: string): Promise<ApiResponse<{ logs: string[] }>> {
    if (apiConfig.isMockMode()) {
      await new Promise(resolve => setTimeout(resolve, 300))
      return {
        data: {
          logs: [
            '[10:30:00] 開始抓取任務...',
            '[10:30:01] 連接到 https://www.example.edu.hk',
            '[10:30:02] 解析首頁內容...',
            '[10:30:05] 發現 34 個頁面待抓取',
            '[10:30:10] 完成基本信息抓取',
            '[10:32:15] 完成課程信息抓取',
            '[10:35:20] 完成設施信息抓取',
          ],
        },
        success: true,
      }
    }

    return apiClient.get<{ logs: string[] }>(`/scraping/tasks/${id}/logs`)
  },
}

export default scrapingService
