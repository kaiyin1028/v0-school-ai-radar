# 頁面與數據需求文檔

## 1. 頁面概覽

| 頁面 | 路徑 | 描述 | 主要功能 |
|------|------|------|----------|
| 總覽 | `/` | 儀表板首頁 | 統計概覽、圖表、快速導航 |
| 學校管理 | `/` (Schools Tab) | 學校列表與詳情 | 搜索、篩選、查看詳情 |
| 需求分析 | `/` (Analysis Tab) | 8維度分析 | 雷達圖、評分、建議 |
| 方案推薦 | `/` (Solutions Tab) | 解決方案管理 | 推薦匹配、方案詳情 |
| 工作流程 | `/` (Workflow Tab) | 流程管理 | 階段追蹤、任務分配 |
| 數據抓取 | `/` (Scraping Tab) | 抓取任務管理 | 任務創建、進度監控 |

## 2. 各頁面數據需求

---

### 2.1 總覽頁面 (Dashboard)

**API 調用:**
```typescript
GET /api/schools/dashboard-stats
```

**數據欄位:**
```typescript
interface DashboardStats {
  totalSchools: number        // 總學校數
  analyzedSchools: number     // 已分析學校數
  averageScore: number        // 平均評分
  gradeDistribution: {        // 等級分佈
    grade: 'A' | 'B' | 'C' | 'D'
    count: number
    percentage: number
  }[]
  districtStats: {            // 區域統計
    district: string
    schools: number
    avgScore: number
  }[]
  recentlyUpdated: School[]   // 最近更新的學校
}
```

**UI 狀態:**
- Loading: 4個統計卡片骨架屏 + 圖表骨架
- Error: 錯誤提示 + 重試按鈕
- Empty: N/A (統計數據總是有值)

---

### 2.2 學校管理頁面 (Schools)

**API 調用:**
```typescript
GET /api/schools?page=1&pageSize=10&search=&district=&type=&grade=&sortBy=&sortOrder=
GET /api/schools/:id
```

**數據欄位:**
```typescript
// 列表響應
interface SchoolListResponse {
  schools: School[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// 學校詳情
interface School {
  id: string
  name: string
  district: string
  type: '官立' | '資助' | '直資' | '私立' | '國際'
  level: '小學' | '中學' | '特殊學校'
  website: string
  maturityGrade: 'A' | 'B' | 'C' | 'D'
  overallScore: number
  dimensions: {
    curriculum: number       // 課程融合
    infrastructure: number   // 基礎設施
    teacherTraining: number  // 師資培訓
    studentLiteracy: number  // 學生素養
    governance: number       // 管理策略
    ethics: number           // 倫理安全
    partnership: number      // 合作夥伴
    innovation: number       // 創新實踐
  }
  lastUpdated: string
  status: 'pending' | 'analyzing' | 'completed' | 'error'
}
```

**篩選/排序需求:**
- 搜索: 學校名稱、區域
- 篩選: 區域、類型、等級、狀態
- 排序: 名稱、評分、更新日期
- 分頁: 10/20/50 項/頁

**UI 狀態:**
- Loading: 表格行骨架屏
- Error: 錯誤提示卡片 + 重試
- Empty: "暫無學校數據，請先添加學校"

---

### 2.3 需求分析頁面 (Analysis)

**API 調用:**
```typescript
GET /api/schools/:id
GET /api/schools/:id/assessment-history
```

**數據欄位:**
```typescript
interface SchoolDetailResponse {
  school: School
  assessmentHistory?: {
    id: string
    assessedAt: string
    overallScore: number
    grade: string
    dimensions: DimensionScores
  }[]
}
```

**分析邏輯 (前端計算):**
- 識別低於 70 分的維度為「待改進」
- 識別高於 85 分的維度為「優勢」
- 計算與全港平均的差異

**UI 狀態:**
- Loading: 雷達圖佔位 + 維度卡片骨架
- Error: 錯誤提示 + 重試
- Empty: "請先選擇一所學校進行分析"

---

### 2.4 方案推薦頁面 (Solutions)

**API 調用:**
```typescript
GET /api/solutions?category=&targetGrade=&targetDimension=
GET /api/solutions/recommendations/:schoolId
```

**數據欄位:**
```typescript
// 解決方案列表
interface Solution {
  id: string
  name: string
  category: string
  description: string
  targetDimensions: string[]
  minGrade: 'A' | 'B' | 'C' | 'D'
  provider: string
  features: string[]
}

// 學校推薦
interface SchoolRecommendationsResponse {
  schoolId: string
  schoolName: string
  recommendations: {
    solution: Solution
    matchScore: number     // 匹配度 0-100
    priority: number       // 優先級 1-10
    reasons: string[]      // 推薦理由
  }[]
  weakDimensions: {
    dimension: string
    score: number
    label: string
  }[]
}
```

**篩選需求:**
- 按分類篩選
- 按適用等級篩選
- 按目標維度篩選

**UI 狀態:**
- Loading: 方案卡片骨架屏
- Error: 錯誤提示 + 重試
- Empty: "暫無匹配的解決方案"

---

### 2.5 工作流程頁面 (Workflow)

**API 調用:**
```typescript
GET /api/workflows?stage=&status=&assignee=
GET /api/workflows/:id
GET /api/workflows/stats
POST /api/workflows
PATCH /api/workflows/:id
POST /api/workflows/:id/advance
POST /api/workflows/:id/complete
```

**數據欄位:**
```typescript
interface Workflow {
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

interface WorkflowStats {
  total: number
  byStage: Record<WorkflowStage, number>
  byStatus: Record<WorkflowStatus, number>
  recentActivity: {
    id: string
    workflowId: string
    action: string
    description: string
    timestamp: string
    user: string
  }[]
}
```

**操作需求:**
- 創建新流程
- 推進到下一階段
- 暫停/恢復流程
- 添加備註
- 完成流程

**UI 狀態:**
- Loading: 流程卡片骨架屏
- Error: 錯誤提示 + 重試
- Empty: "暫無進行中的工作流程"

---

### 2.6 數據抓取頁面 (Scraping)

**API 調用:**
```typescript
GET /api/scraping/tasks?status=
GET /api/scraping/tasks/:id
GET /api/scraping/stats
GET /api/scraping/tasks/:id/logs
POST /api/scraping/tasks
POST /api/scraping/tasks/:id/start
POST /api/scraping/tasks/:id/stop
POST /api/scraping/tasks/:id/retry
DELETE /api/scraping/tasks/:id
```

**數據欄位:**
```typescript
interface ScrapingTask {
  id: string
  schoolId: string
  schoolName: string
  schoolWebsite: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  progress: number          // 0-100
  pagesScraped: number
  totalPages: number
  dataCollected: {
    basicInfo: boolean
    curriculum: boolean
    facilities: boolean
    news: boolean
    events: boolean
    achievements: boolean
  }
  startedAt?: string
  completedAt?: string
  errorMessage?: string
  createdAt: string
}

interface ScrapingStats {
  totalTasks: number
  completed: number
  running: number
  pending: number
  failed: number
  totalPagesScraped: number
  avgPagesPerSchool: number
}
```

**實時更新需求:**
- 運行中的任務每 5 秒刷新進度
- 日誌每 5 秒更新

**UI 狀態:**
- Loading: 任務卡片骨架屏
- Error: 錯誤提示 + 重試
- Empty: "暫無抓取任務，點擊創建新任務"

---

## 3. 共用組件數據需求

### 3.1 學校選擇器
```typescript
// 用於選擇學校的下拉框
GET /api/schools?pageSize=100&status=completed
```

### 3.2 評分徽章
```typescript
// 顯示 A/B/C/D 等級
interface GradeBadgeProps {
  grade: 'A' | 'B' | 'C' | 'D'
  size?: 'sm' | 'md' | 'lg'
}
```

### 3.3 雷達圖
```typescript
// 8 維度雷達圖
interface RadarChartProps {
  dimensions: DimensionScores
  showLabels?: boolean
}
```

## 4. 數據更新策略

| 數據類型 | 緩存時間 | 自動刷新 | 觸發刷新 |
|----------|----------|----------|----------|
| 儀表板統計 | 1 分鐘 | 每分鐘 | 手動刷新 |
| 學校列表 | 5 秒去重 | 否 | 篩選/分頁變化 |
| 學校詳情 | 5 秒去重 | 否 | 選擇變化 |
| 推薦方案 | 5 秒去重 | 否 | 學校變化 |
| 工作流程 | 5 秒去重 | 否 | 操作後 |
| 抓取任務 | 5 秒去重 | 運行中 5 秒 | 操作後 |
