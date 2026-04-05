export interface School {
  id: string
  name: string
  district: string
  type: '官立' | '資助' | '直資' | '私立' | '國際'
  level: '小學' | '中學' | '特殊學校'
  website: string
  maturityGrade: 'A' | 'B' | 'C' | 'D'
  overallScore: number
  dimensions: DimensionScores
  lastUpdated: string
  status: 'pending' | 'analyzing' | 'completed' | 'error'
}

export interface DimensionScores {
  curriculum: number // 課程融合
  infrastructure: number // 基礎設施
  teacherTraining: number // 師資培訓
  studentLiteracy: number // 學生素養
  governance: number // 管理策略
  ethics: number // 倫理安全
  partnership: number // 合作夥伴
  innovation: number // 創新實踐
}

export const DIMENSION_LABELS: Record<keyof DimensionScores, string> = {
  curriculum: '課程融合',
  infrastructure: '基礎設施',
  teacherTraining: '師資培訓',
  studentLiteracy: '學生素養',
  governance: '管理策略',
  ethics: '倫理安全',
  partnership: '合作夥伴',
  innovation: '創新實踐',
}

export const DIMENSION_DESCRIPTIONS: Record<keyof DimensionScores, string> = {
  curriculum: 'AI 融入各學科課程的程度與質量',
  infrastructure: 'AI 硬件設備、軟件平台及網絡環境',
  teacherTraining: '教師 AI 能力培訓與專業發展',
  studentLiteracy: '學生 AI 認知、技能與態度',
  governance: '學校 AI 發展策略與行政支援',
  ethics: 'AI 使用的倫理規範與數據安全',
  partnership: '與業界、高校的 AI 合作項目',
  innovation: 'AI 創新項目與實踐成果',
}

export interface Solution {
  id: string
  name: string
  category: string
  description: string
  targetDimensions: (keyof DimensionScores)[]
  minGrade: 'A' | 'B' | 'C' | 'D'
  provider: string
  features: string[]
}

export interface Workflow {
  id: string
  schoolId: string
  schoolName: string
  stage: 'discovery' | 'analysis' | 'recommendation' | 'implementation' | 'review'
  status: 'active' | 'paused' | 'completed'
  createdAt: string
  updatedAt: string
  assignee: string
  notes: string[]
}

export const GRADE_COLORS = {
  A: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
  B: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  C: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
  D: 'text-red-400 bg-red-400/10 border-red-400/30',
}

export const STAGE_LABELS: Record<Workflow['stage'], string> = {
  discovery: '發現需求',
  analysis: '深度分析',
  recommendation: '方案推薦',
  implementation: '實施跟進',
  review: '成效評估',
}
