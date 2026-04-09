/**
 * Services Index - 服務層統一導出
 * 
 * 使用方式:
 * import { schoolsService, solutionsService } from '@/services'
 */

export { schoolsService, type SchoolListParams, type DashboardStats } from './schools'
export { solutionsService, type SolutionRecommendation, type SchoolRecommendationsResponse } from './solutions'
export { workflowsService, type WorkflowStats, type WorkflowActivity } from './workflows'
export { scrapingService, type ScrapingTask, type ScrapingStats } from './scraping'
