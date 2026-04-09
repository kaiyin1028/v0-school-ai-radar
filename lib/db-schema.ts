/**
 * 數據庫架構定義
 * 用於未來數據庫集成時參考
 * 
 * 建議使用: PostgreSQL + Prisma ORM 或 Supabase
 */

// ===========================================
// 學校表 (schools)
// ===========================================
export interface DbSchool {
  id: string                    // UUID 主鍵
  name: string                  // 學校名稱
  english_name?: string         // 英文名稱
  district: string              // 所屬區域
  type: 'primary' | 'secondary' | 'special' // 學校類型
  website?: string              // 官方網站
  address?: string              // 學校地址
  phone?: string                // 聯繫電話
  email?: string                // 聯繫郵箱
  principal?: string            // 校長姓名
  student_count?: number        // 學生人數
  teacher_count?: number        // 教師人數
  established_year?: number     // 成立年份
  last_scraped_at?: Date        // 最後抓取時間
  created_at: Date              // 創建時間
  updated_at: Date              // 更新時間
}

// ===========================================
// 評分記錄表 (assessments)
// ===========================================
export interface DbAssessment {
  id: string                    // UUID 主鍵
  school_id: string             // 關聯學校 ID
  assessed_by?: string          // 評估人員 ID
  assessed_at: Date             // 評估時間
  overall_score: number         // 總體評分 (0-100)
  overall_grade: 'A' | 'B' | 'C' | 'D' // 成熟度等級
  notes?: string                // 評估備註
  created_at: Date              // 創建時間
}

// ===========================================
// 維度評分表 (dimension_scores)
// ===========================================
export interface DbDimensionScore {
  id: string                    // UUID 主鍵
  assessment_id: string         // 關聯評估 ID
  dimension: string             // 維度名稱
  score: number                 // 評分 (0-100)
  evidence?: string             // 評分依據
  recommendations?: string      // 改進建議
}

// 8 大維度常量
export const DIMENSIONS = [
  'curriculum',      // 課程融合度
  'infrastructure',  // 基礎設施
  'teacher_training', // 師資培訓
  'student_literacy', // 學生素養
  'management',      // 管理策略
  'ethics_safety',   // 倫理安全
  'partnerships',    // 合作夥伴
  'innovation',      // 創新實踐
] as const

export type DimensionType = typeof DIMENSIONS[number]

// ===========================================
// 抓取任務表 (scraping_tasks)
// ===========================================
export interface DbScrapingTask {
  id: string                    // UUID 主鍵
  school_id: string             // 關聯學校 ID
  status: 'pending' | 'running' | 'completed' | 'failed'
  started_at?: Date             // 開始時間
  completed_at?: Date           // 完成時間
  pages_scraped: number         // 已抓取頁面數
  data_collected: Record<string, unknown> // 收集的數據
  error_message?: string        // 錯誤信息
  created_at: Date              // 創建時間
}

// ===========================================
// 工作流程表 (workflows)
// ===========================================
export interface DbWorkflow {
  id: string                    // UUID 主鍵
  school_id: string             // 關聯學校 ID
  stage: number                 // 當前階段 (1-5)
  status: 'active' | 'paused' | 'completed'
  assigned_to?: string          // 負責人 ID
  notes?: string                // 備註
  started_at: Date              // 開始時間
  updated_at: Date              // 更新時間
}

// 工作流程階段
export const WORKFLOW_STAGES = [
  { stage: 1, name: '發現需求', description: '初步了解學校需求' },
  { stage: 2, name: '深度分析', description: '詳細評估 8 大維度' },
  { stage: 3, name: '方案推薦', description: '制定個性化解決方案' },
  { stage: 4, name: '實施跟進', description: '協助方案落地實施' },
  { stage: 5, name: '成效評估', description: '評估實施效果' },
] as const

// ===========================================
// 解決方案表 (solutions)
// ===========================================
export interface DbSolution {
  id: string                    // UUID 主鍵
  name: string                  // 方案名稱
  category: string              // 方案類別
  description: string           // 方案描述
  target_dimensions: string[]   // 目標維度
  target_grades: string[]       // 適用等級
  provider?: string             // 供應商
  price_range?: string          // 價格範圍
  implementation_time?: string  // 實施時間
  features: string[]            // 功能特點
  is_active: boolean            // 是否啟用
  created_at: Date              // 創建時間
}

// ===========================================
// 推薦記錄表 (recommendations)
// ===========================================
export interface DbRecommendation {
  id: string                    // UUID 主鍵
  school_id: string             // 關聯學校 ID
  solution_id: string           // 關聯方案 ID
  assessment_id: string         // 關聯評估 ID
  priority: number              // 優先級 (1-10)
  match_score: number           // 匹配度 (0-100)
  reason: string                // 推薦理由
  status: 'pending' | 'accepted' | 'rejected'
  created_at: Date              // 創建時間
}

// ===========================================
// 用戶表 (users) - 未來認證使用
// ===========================================
export interface DbUser {
  id: string                    // UUID 主鍵
  email: string                 // 郵箱 (唯一)
  name: string                  // 姓名
  role: 'admin' | 'analyst' | 'viewer'
  avatar_url?: string           // 頭像 URL
  created_at: Date              // 創建時間
  updated_at: Date              // 更新時間
}

// ===========================================
// SQL 建表語句參考 (PostgreSQL)
// ===========================================
export const SQL_CREATE_TABLES = `
-- 學校表
CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  english_name VARCHAR(255),
  district VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  website VARCHAR(500),
  address TEXT,
  phone VARCHAR(50),
  email VARCHAR(255),
  principal VARCHAR(100),
  student_count INTEGER,
  teacher_count INTEGER,
  established_year INTEGER,
  last_scraped_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 評估記錄表
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  assessed_by UUID,
  assessed_at TIMESTAMPTZ DEFAULT NOW(),
  overall_score DECIMAL(5,2) NOT NULL,
  overall_grade VARCHAR(1) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 維度評分表
CREATE TABLE dimension_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
  dimension VARCHAR(50) NOT NULL,
  score DECIMAL(5,2) NOT NULL,
  evidence TEXT,
  recommendations TEXT
);

-- 抓取任務表
CREATE TABLE scraping_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  pages_scraped INTEGER DEFAULT 0,
  data_collected JSONB,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 工作流程表
CREATE TABLE workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  stage INTEGER NOT NULL DEFAULT 1,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  assigned_to UUID,
  notes TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 解決方案表
CREATE TABLE solutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  target_dimensions TEXT[],
  target_grades TEXT[],
  provider VARCHAR(255),
  price_range VARCHAR(100),
  implementation_time VARCHAR(100),
  features TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 推薦記錄表
CREATE TABLE recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  solution_id UUID REFERENCES solutions(id) ON DELETE CASCADE,
  assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
  priority INTEGER NOT NULL,
  match_score DECIMAL(5,2) NOT NULL,
  reason TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 用戶表
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'viewer',
  avatar_url VARCHAR(500),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_schools_district ON schools(district);
CREATE INDEX idx_assessments_school ON assessments(school_id);
CREATE INDEX idx_dimension_scores_assessment ON dimension_scores(assessment_id);
CREATE INDEX idx_workflows_school ON workflows(school_id);
CREATE INDEX idx_recommendations_school ON recommendations(school_id);
`
