/**
 * Hooks Index - 自定義 Hooks 統一導出
 * 
 * 使用方式:
 * import { useSchools, useSolutions } from '@/hooks'
 */

// 學校相關
export { 
  useSchools, 
  useSchool, 
  useDashboardStats, 
  useDistrictStats,
  useSchoolMutations,
} from './use-schools'

// 解決方案相關
export { 
  useSolutions, 
  useSolution, 
  useSchoolRecommendations,
  useSolutionCategories,
} from './use-solutions'

// 工作流程相關
export { 
  useWorkflows, 
  useWorkflow, 
  useWorkflowStats,
  useWorkflowMutations,
} from './use-workflows'

// 數據抓取相關
export { 
  useScrapingTasks, 
  useScrapingTask, 
  useScrapingStats,
  useScrapingLogs,
  useScrapingMutations,
} from './use-scraping'

// 工具 Hooks
export { useMobile } from './use-mobile'
export { useToast } from './use-toast'
