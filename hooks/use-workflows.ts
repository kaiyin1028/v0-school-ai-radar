/**
 * useWorkflows Hook - 工作流程數據管理
 */

import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { workflowsService, type WorkflowStats, type WorkflowListParams } from '@/services/workflows'
import type { Workflow } from '@/lib/types'

// ===========================================
// 工作流程列表 Hook
// ===========================================
export function useWorkflows(params: WorkflowListParams = {}) {
  const key = ['workflows', params]
  
  const { data, error, isLoading, mutate } = useSWR<Workflow[]>(
    key,
    async () => {
      const response = await workflowsService.getList(params)
      return response.data
    },
    {
      revalidateOnFocus: false,
    }
  )

  return {
    workflows: data || [],
    isLoading,
    error,
    refresh: mutate,
  }
}

// ===========================================
// 單個工作流程 Hook
// ===========================================
export function useWorkflow(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Workflow>(
    id ? ['workflow', id] : null,
    async () => {
      const response = await workflowsService.getById(id!)
      return response.data
    },
    {
      revalidateOnFocus: false,
    }
  )

  return {
    workflow: data,
    isLoading,
    error,
    refresh: mutate,
  }
}

// ===========================================
// 工作流程統計 Hook
// ===========================================
export function useWorkflowStats() {
  const { data, error, isLoading, mutate } = useSWR<WorkflowStats>(
    'workflow-stats',
    async () => {
      const response = await workflowsService.getStats()
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
// 工作流程 Mutations
// ===========================================
export function useWorkflowMutations() {
  const createMutation = useSWRMutation(
    'workflows',
    async (_key, { arg }: { arg: Parameters<typeof workflowsService.create>[0] }) => {
      const response = await workflowsService.create(arg)
      return response.data
    }
  )

  const advanceMutation = useSWRMutation(
    'workflows',
    async (_key, { arg }: { arg: { id: string; notes?: string } }) => {
      const response = await workflowsService.advanceStage(arg.id, arg.notes)
      return response.data
    }
  )

  const completeMutation = useSWRMutation(
    'workflows',
    async (_key, { arg }: { arg: { id: string; notes?: string } }) => {
      const response = await workflowsService.complete(arg.id, arg.notes)
      return response.data
    }
  )

  const pauseMutation = useSWRMutation(
    'workflows',
    async (_key, { arg }: { arg: { id: string; reason?: string } }) => {
      const response = await workflowsService.pause(arg.id, arg.reason)
      return response.data
    }
  )

  const resumeMutation = useSWRMutation(
    'workflows',
    async (_key, { arg }: { arg: string }) => {
      const response = await workflowsService.resume(arg)
      return response.data
    }
  )

  const addNoteMutation = useSWRMutation(
    'workflows',
    async (_key, { arg }: { arg: { id: string; note: string } }) => {
      const response = await workflowsService.addNote(arg.id, arg.note)
      return response.data
    }
  )

  return {
    createWorkflow: createMutation.trigger,
    isCreating: createMutation.isMutating,
    
    advanceWorkflow: (id: string, notes?: string) => advanceMutation.trigger({ id, notes }),
    isAdvancing: advanceMutation.isMutating,
    
    completeWorkflow: (id: string, notes?: string) => completeMutation.trigger({ id, notes }),
    isCompleting: completeMutation.isMutating,
    
    pauseWorkflow: (id: string, reason?: string) => pauseMutation.trigger({ id, reason }),
    isPausing: pauseMutation.isMutating,
    
    resumeWorkflow: resumeMutation.trigger,
    isResuming: resumeMutation.isMutating,
    
    addNote: (id: string, note: string) => addNoteMutation.trigger({ id, note }),
    isAddingNote: addNoteMutation.isMutating,
  }
}

export type { Workflow, WorkflowStats, WorkflowListParams }
