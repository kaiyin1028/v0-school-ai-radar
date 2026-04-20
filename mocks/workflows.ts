/**
 * Workflows Mock Data
 * 
 * 模擬工作流程數據，用於開發和測試
 */

import type { Workflow } from '@/lib/types'

export const mockWorkflows: Workflow[] = [
  {
    id: 'w1',
    schoolId: '6',
    schoolName: '培正中學',
    stage: 'analysis',
    status: 'active',
    createdAt: '2024-03-01',
    updatedAt: '2024-03-10',
    assignee: '陳老師',
    notes: ['已完成初步評估', '待進行深度訪談', '學校積極配合中'],
  },
  {
    id: 'w2',
    schoolId: '8',
    schoolName: '新界鄉議局元朗區中學',
    stage: 'discovery',
    status: 'active',
    createdAt: '2024-03-05',
    updatedAt: '2024-03-08',
    assignee: '李顧問',
    notes: ['已獲取學校官網數據', '等待學校確認參與'],
  },
  {
    id: 'w3',
    schoolId: '5',
    schoolName: '華仁書院（九龍）',
    stage: 'recommendation',
    status: 'active',
    createdAt: '2024-02-15',
    updatedAt: '2024-03-11',
    assignee: '王經理',
    notes: ['分析完成', '已生成方案建議', '待學校審閱', '計劃下週會議討論'],
  },
  {
    id: 'w4',
    schoolId: '3',
    schoolName: '英華書院',
    stage: 'implementation',
    status: 'active',
    createdAt: '2024-01-20',
    updatedAt: '2024-03-13',
    assignee: '張顧問',
    notes: ['方案已批准', '師資培訓進行中', '基礎設施升級計劃中', '預計四月完成第一階段'],
  },
  {
    id: 'w5',
    schoolId: '1',
    schoolName: '聖保羅男女中學',
    stage: 'review',
    status: 'completed',
    createdAt: '2023-09-01',
    updatedAt: '2024-02-28',
    assignee: '陳老師',
    notes: ['所有項目已完成', '成效評估優異', '已建立持續合作關係', '可作為示範案例'],
  },
  {
    id: 'w6',
    schoolId: '4',
    schoolName: '喇沙書院',
    stage: 'analysis',
    status: 'paused',
    createdAt: '2024-02-01',
    updatedAt: '2024-02-20',
    assignee: '黃顧問',
    notes: ['學校暫時無法配合', '待學校確認後繼續'],
  },
]

export const workflowStages = [
  { id: 'discovery', name: '發現需求', description: '初步了解學校需求，收集基礎信息' },
  { id: 'analysis', name: '深度分析', description: '詳細評估 8 大維度，識別改進空間' },
  { id: 'recommendation', name: '方案推薦', description: '制定個性化解決方案，匹配最佳資源' },
  { id: 'implementation', name: '實施跟進', description: '協助方案落地實施，提供持續支援' },
  { id: 'review', name: '成效評估', description: '評估實施效果，總結經驗教訓' },
]

export const assignees = [
  { id: '1', name: '陳老師', role: '教育顧問' },
  { id: '2', name: '李顧問', role: '技術顧問' },
  { id: '3', name: '王經理', role: '項目經理' },
  { id: '4', name: '張顧問', role: '實施顧問' },
  { id: '5', name: '黃顧問', role: '分析師' },
]
