/**
 * Workflows Service - 工作流程服務
 * 
 * 處理所有與工作流程管理相關的 API 請求
 */

import apiClient, { type ApiResponse, apiConfig } from '@/lib/api-client'
import type { Workflow } from '@/lib/types'
import { mockWorkflows } from '@/mocks/workflows'

// ===========================================
// 類型定義
// ===========================================
export type WorkflowStage = 'discovery' | 'analysis' | 'recommendation' | 'implementation' | 'review'
export type WorkflowStatus = 'active' | 'paused' | 'completed'

export interface WorkflowListParams {
  stage?: WorkflowStage
  status?: WorkflowStatus
  assignee?: string
  schoolId?: string
}

export interface WorkflowStats {
  total: number
  byStage: Record<WorkflowStage, number>
  byStatus: Record<WorkflowStatus, number>
  recentActivity: WorkflowActivity[]
}

export interface WorkflowActivity {
  id: string
  workflowId: string
  action: string
  description: string
  timestamp: string
  user: string
}

export interface CreateWorkflowInput {
  schoolId: string
  assignee?: string
  notes?: string[]
}

export interface UpdateWorkflowInput {
  stage?: WorkflowStage
  status?: WorkflowStatus
  assignee?: string
  notes?: string[]
}

export interface WorkflowTransition {
  from: WorkflowStage
  to: WorkflowStage
  timestamp: string
  user: string
  notes?: string
}

// ===========================================
// Mock 數據處理
// ===========================================
const filterMockWorkflows = (params: WorkflowListParams): Workflow[] => {
  let filtered = [...mockWorkflows]

  if (params.stage) {
    filtered = filtered.filter(w => w.stage === params.stage)
  }

  if (params.status) {
    filtered = filtered.filter(w => w.status === params.status)
  }

  if (params.assignee) {
    filtered = filtered.filter(w => w.assignee === params.assignee)
  }

  if (params.schoolId) {
    filtered = filtered.filter(w => w.schoolId === params.schoolId)
  }

  return filtered
}

const getMockWorkflowStats = (): WorkflowStats => {
  const workflows = mockWorkflows

  const byStage: Record<WorkflowStage, number> = {
    discovery: 0,
    analysis: 0,
    recommendation: 0,
    implementation: 0,
    review: 0,
  }

  const byStatus: Record<WorkflowStatus, number> = {
    active: 0,
    paused: 0,
    completed: 0,
  }

  workflows.forEach(w => {
    byStage[w.stage]++
    byStatus[w.status]++
  })

  return {
    total: workflows.length,
    byStage,
    byStatus,
    recentActivity: [
      {
        id: '1',
        workflowId: 'w1',
        action: 'stage_changed',
        description: '培正中學 進入深度分析階段',
        timestamp: '2024-03-10T10:30:00Z',
        user: '陳老師',
      },
      {
        id: '2',
        workflowId: 'w3',
        action: 'recommendation_generated',
        description: '華仁書院（九龍） 方案推薦已生成',
        timestamp: '2024-03-11T14:20:00Z',
        user: '王經理',
      },
    ],
  }
}

// ===========================================
// API 服務方法
// ===========================================
export const workflowsService = {
  /**
   * 獲取工作流程列表
   */
  async getList(params: WorkflowListParams = {}): Promise<ApiResponse<Workflow[]>> {
    if (apiConfig.isMockMode()) {
      await new Promise(resolve => setTimeout(resolve, 400))
      return {
        data: filterMockWorkflows(params),
        success: true,
      }
    }

    return apiClient.get<Workflow[]>('/workflows', { params })
  },

  /**
   * 獲取單個工作流程詳情
   */
  async getById(id: string): Promise<ApiResponse<Workflow>> {
    if (apiConfig.isMockMode()) {
      await new Promise(resolve => setTimeout(resolve, 300))
      const workflow = mockWorkflows.find(w => w.id === id)
      if (!workflow) {
        throw new Error('Workflow not found')
      }
      return { data: workflow, success: true }
    }

    return apiClient.get<Workflow>(`/workflows/${id}`)
  },

  /**
   * 獲取工作流程統計
   */
  async getStats(): Promise<ApiResponse<WorkflowStats>> {
    if (apiConfig.isMockMode()) {
      await new Promise(resolve => setTimeout(resolve, 500))
      return {
        data: getMockWorkflowStats(),
        success: true,
      }
    }

    return apiClient.get<WorkflowStats>('/workflows/stats')
  },

  /**
   * 創建新工作流程
   */
  async create(input: CreateWorkflowInput): Promise<ApiResponse<Workflow>> {
    if (apiConfig.isMockMode()) {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const { mockSchools } = await import('@/mocks/schools')
      const school = mockSchools.find(s => s.id === input.schoolId)
      
      const newWorkflow: Workflow = {
        id: `w${Date.now()}`,
        schoolId: input.schoolId,
        schoolName: school?.name || 'Unknown School',
        stage: 'discovery',
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        assignee: input.assignee || '',
        notes: input.notes || [],
      }
      return { data: newWorkflow, success: true }
    }

    return apiClient.post<Workflow>('/workflows', input)
  },

  /**
   * 更新工作流程
   */
  async update(id: string, input: UpdateWorkflowInput): Promise<ApiResponse<Workflow>> {
    if (apiConfig.isMockMode()) {
      await new Promise(resolve => setTimeout(resolve, 500))
      const workflow = mockWorkflows.find(w => w.id === id)
      if (!workflow) {
        throw new Error('Workflow not found')
      }
      const updated = {
        ...workflow,
        ...input,
        updatedAt: new Date().toISOString().split('T')[0],
      }
      return { data: updated, success: true }
    }

    return apiClient.patch<Workflow>(`/workflows/${id}`, input)
  },

  /**
   * 推進工作流程到下一階段
   */
  async advanceStage(id: string, notes?: string): Promise<ApiResponse<Workflow>> {
    if (apiConfig.isMockMode()) {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const workflow = mockWorkflows.find(w => w.id === id)
      if (!workflow) {
        throw new Error('Workflow not found')
      }

      const stageOrder: WorkflowStage[] = [
        'discovery',
        'analysis',
        'recommendation',
        'implementation',
        'review',
      ]
      
      const currentIndex = stageOrder.indexOf(workflow.stage)
      if (currentIndex >= stageOrder.length - 1) {
        throw new Error('Workflow already at final stage')
      }

      const updated: Workflow = {
        ...workflow,
        stage: stageOrder[currentIndex + 1],
        updatedAt: new Date().toISOString().split('T')[0],
        notes: notes ? [...workflow.notes, notes] : workflow.notes,
      }
      
      return { data: updated, success: true }
    }

    return apiClient.post<Workflow>(`/workflows/${id}/advance`, { notes })
  },

  /**
   * 完成工作流程
   */
  async complete(id: string, notes?: string): Promise<ApiResponse<Workflow>> {
    if (apiConfig.isMockMode()) {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const workflow = mockWorkflows.find(w => w.id === id)
      if (!workflow) {
        throw new Error('Workflow not found')
      }

      const updated: Workflow = {
        ...workflow,
        status: 'completed',
        updatedAt: new Date().toISOString().split('T')[0],
        notes: notes ? [...workflow.notes, notes] : workflow.notes,
      }
      
      return { data: updated, success: true }
    }

    return apiClient.post<Workflow>(`/workflows/${id}/complete`, { notes })
  },

  /**
   * 暫停工作流程
   */
  async pause(id: string, reason?: string): Promise<ApiResponse<Workflow>> {
    if (apiConfig.isMockMode()) {
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const workflow = mockWorkflows.find(w => w.id === id)
      if (!workflow) {
        throw new Error('Workflow not found')
      }

      const updated: Workflow = {
        ...workflow,
        status: 'paused',
        updatedAt: new Date().toISOString().split('T')[0],
        notes: reason ? [...workflow.notes, `暫停原因: ${reason}`] : workflow.notes,
      }
      
      return { data: updated, success: true }
    }

    return apiClient.post<Workflow>(`/workflows/${id}/pause`, { reason })
  },

  /**
   * 恢復工作流程
   */
  async resume(id: string): Promise<ApiResponse<Workflow>> {
    if (apiConfig.isMockMode()) {
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const workflow = mockWorkflows.find(w => w.id === id)
      if (!workflow) {
        throw new Error('Workflow not found')
      }

      const updated: Workflow = {
        ...workflow,
        status: 'active',
        updatedAt: new Date().toISOString().split('T')[0],
      }
      
      return { data: updated, success: true }
    }

    return apiClient.post<Workflow>(`/workflows/${id}/resume`)
  },

  /**
   * 添加備註
   */
  async addNote(id: string, note: string): Promise<ApiResponse<Workflow>> {
    if (apiConfig.isMockMode()) {
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const workflow = mockWorkflows.find(w => w.id === id)
      if (!workflow) {
        throw new Error('Workflow not found')
      }

      const updated: Workflow = {
        ...workflow,
        notes: [...workflow.notes, note],
        updatedAt: new Date().toISOString().split('T')[0],
      }
      
      return { data: updated, success: true }
    }

    return apiClient.post<Workflow>(`/workflows/${id}/notes`, { note })
  },
}

export default workflowsService
