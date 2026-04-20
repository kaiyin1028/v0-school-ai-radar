/**
 * Solutions Mock Data
 * 
 * 模擬解決方案數據，用於開發和測試
 */

import type { Solution } from '@/lib/types'

export const mockSolutions: Solution[] = [
  {
    id: 's1',
    name: 'AI 課程整合套件',
    category: '課程發展',
    description: '完整的 K-12 AI 課程體系，包含教材、教案及評估工具，幫助學校系統性地將 AI 教育融入現有課程。',
    targetDimensions: ['curriculum', 'studentLiteracy'],
    minGrade: 'C',
    provider: 'EdTech Solutions HK',
    features: ['模組化課程設計', '跨學科整合方案', '在線評估系統', '學習分析儀表板', '教師備課資源'],
  },
  {
    id: 's2',
    name: '教師 AI 專業發展計劃',
    category: '師資培訓',
    description: '分層次的教師 AI 能力培訓，從基礎認知到高階應用，配合實踐工作坊和持續支援。',
    targetDimensions: ['teacherTraining', 'curriculum'],
    minGrade: 'D',
    provider: '香港教育大學',
    features: ['認證課程體系', '實踐工作坊', '同儕學習社群', '持續專業支援', '教學資源庫'],
  },
  {
    id: 's3',
    name: '智慧校園基礎設施方案',
    category: '基礎建設',
    description: '一站式 AI 基礎設施升級方案，包含硬件設備、軟件平台及網絡環境優化。',
    targetDimensions: ['infrastructure', 'governance'],
    minGrade: 'D',
    provider: 'Smart Campus Tech',
    features: ['雲端運算平台', 'AI 工作站', '高速校園網絡', '安全管理系統', '技術支援服務'],
  },
  {
    id: 's4',
    name: 'AI 倫理與安全框架',
    category: '管理策略',
    description: '學校 AI 使用的倫理指引、政策模板及安全協議，確保負責任地使用 AI 技術。',
    targetDimensions: ['ethics', 'governance'],
    minGrade: 'C',
    provider: 'AI Ethics Institute',
    features: ['政策模板庫', '培訓教材', '審核工具', '合規檢查清單', '案例研究'],
  },
  {
    id: 's5',
    name: '產學合作平台',
    category: '合作夥伴',
    description: '連接學校與業界的 AI 項目合作平台，提供實習機會、業界導師及資源共享。',
    targetDimensions: ['partnership', 'innovation'],
    minGrade: 'B',
    provider: 'InnoHub HK',
    features: ['項目配對系統', '業界導師計劃', '學生實習安排', '資源共享平台', '成果展示會'],
  },
  {
    id: 's6',
    name: '學生 AI 創新實驗室',
    category: '創新實踐',
    description: '為學生提供 AI 項目開發的完整環境和指導，培養創新思維和實踐能力。',
    targetDimensions: ['innovation', 'studentLiteracy'],
    minGrade: 'B',
    provider: 'Future Ready Labs',
    features: ['項目孵化支援', '技術指導服務', '比賽培訓', '成果展示平台', '創業輔導'],
  },
  {
    id: 's7',
    name: 'AI 學習分析系統',
    category: '課程發展',
    description: '利用 AI 技術分析學生學習數據，提供個性化學習建議和教學改進方向。',
    targetDimensions: ['curriculum', 'studentLiteracy', 'innovation'],
    minGrade: 'B',
    provider: 'LearnTech Analytics',
    features: ['學習行為分析', '成績預測模型', '個性化推薦', '教學效果評估', '可視化報告'],
  },
  {
    id: 's8',
    name: '校園 AI 助手平台',
    category: '基礎建設',
    description: '部署校園專屬的 AI 助手，支援教學、行政和學生服務。',
    targetDimensions: ['infrastructure', 'innovation'],
    minGrade: 'C',
    provider: 'Campus AI Solutions',
    features: ['智能問答系統', '行政流程自動化', '學生服務機器人', '教學輔助工具', '數據安全保護'],
  },
]

export const solutionCategories = [
  '課程發展',
  '師資培訓',
  '基礎建設',
  '管理策略',
  '合作夥伴',
  '創新實踐',
]
