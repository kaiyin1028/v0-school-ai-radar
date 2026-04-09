# API 契約文檔

## 1. 基礎配置

### 1.1 Base URL
```
開發環境: http://localhost:3000/api
生產環境: https://your-domain.com/api
```

### 1.2 認證方式
```
Authorization: Bearer <token>
```

### 1.3 通用響應格式

**成功響應:**
```typescript
{
  "success": true,
  "data": T,
  "meta"?: {
    "total": number,
    "page": number,
    "pageSize": number,
    "totalPages": number
  }
}
```

**錯誤響應:**
```typescript
{
  "success": false,
  "error": {
    "code": string,
    "message": string,
    "details"?: object
  }
}
```

### 1.4 通用錯誤碼

| 狀態碼 | 錯誤碼 | 描述 |
|--------|--------|------|
| 400 | BAD_REQUEST | 請求參數錯誤 |
| 401 | UNAUTHORIZED | 未授權，請重新登入 |
| 403 | FORBIDDEN | 權限不足 |
| 404 | NOT_FOUND | 資源不存在 |
| 409 | CONFLICT | 資源衝突 |
| 422 | VALIDATION_ERROR | 數據驗證失敗 |
| 429 | RATE_LIMITED | 請求過於頻繁 |
| 500 | SERVER_ERROR | 伺服器錯誤 |

---

## 2. Schools API

### 2.1 獲取學校列表

```
GET /api/schools
```

**Query Parameters:**
| 參數 | 類型 | 必填 | 描述 |
|------|------|------|------|
| page | number | 否 | 頁碼，默認 1 |
| pageSize | number | 否 | 每頁數量，默認 10 |
| search | string | 否 | 搜索關鍵字 |
| district | string | 否 | 區域篩選 |
| type | string | 否 | 學校類型 |
| grade | string | 否 | 成熟度等級 |
| status | string | 否 | 狀態篩選 |
| sortBy | string | 否 | 排序欄位 |
| sortOrder | 'asc' \| 'desc' | 否 | 排序方向 |

**Response:**
```typescript
{
  "success": true,
  "data": {
    "schools": School[],
    "total": number,
    "page": number,
    "pageSize": number,
    "totalPages": number
  }
}

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
    curriculum: number
    infrastructure: number
    teacherTraining: number
    studentLiteracy: number
    governance: number
    ethics: number
    partnership: number
    innovation: number
  }
  lastUpdated: string
  status: 'pending' | 'analyzing' | 'completed' | 'error'
}
```

---

### 2.2 獲取學校詳情

```
GET /api/schools/:id
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "school": School,
    "assessmentHistory"?: AssessmentRecord[]
  }
}

interface AssessmentRecord {
  id: string
  assessedAt: string
  overallScore: number
  grade: string
  dimensions: DimensionScores
}
```

**Error Codes:**
- 404: 學校不存在

---

### 2.3 創建學校

```
POST /api/schools
```

**Request Body:**
```typescript
{
  "name": string,          // 必填
  "district": string,      // 必填
  "type": string,          // 必填
  "level": string,         // 必填
  "website"?: string
}
```

**Response:**
```typescript
{
  "success": true,
  "data": School
}
```

**Error Codes:**
- 400: 缺少必填欄位
- 409: 學校已存在
- 422: 數據驗證失敗

---

### 2.4 更新學校

```
PATCH /api/schools/:id
```

**Request Body:**
```typescript
{
  "name"?: string,
  "district"?: string,
  "type"?: string,
  "level"?: string,
  "website"?: string
}
```

**Response:**
```typescript
{
  "success": true,
  "data": School
}
```

---

### 2.5 刪除學校

```
DELETE /api/schools/:id
```

**Response:**
```typescript
{
  "success": true,
  "data": null
}
```

---

### 2.6 獲取儀表板統計

```
GET /api/schools/dashboard-stats
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "totalSchools": number,
    "analyzedSchools": number,
    "averageScore": number,
    "gradeDistribution": {
      "grade": string,
      "count": number,
      "percentage": number
    }[],
    "districtStats": {
      "district": string,
      "schools": number,
      "avgScore": number
    }[],
    "recentlyUpdated": School[]
  }
}
```

---

## 3. Solutions API

### 3.1 獲取方案列表

```
GET /api/solutions
```

**Query Parameters:**
| 參數 | 類型 | 必填 | 描述 |
|------|------|------|------|
| category | string | 否 | 分類篩選 |
| targetGrade | string | 否 | 適用等級 |
| targetDimension | string | 否 | 目標維度 |

**Response:**
```typescript
{
  "success": true,
  "data": Solution[]
}

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
```

---

### 3.2 獲取學校推薦方案

```
GET /api/solutions/recommendations/:schoolId
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "schoolId": string,
    "schoolName": string,
    "recommendations": {
      "solution": Solution,
      "matchScore": number,
      "priority": number,
      "reasons": string[]
    }[],
    "weakDimensions": {
      "dimension": string,
      "score": number,
      "label": string
    }[]
  }
}
```

---

## 4. Workflows API

### 4.1 獲取工作流程列表

```
GET /api/workflows
```

**Query Parameters:**
| 參數 | 類型 | 必填 | 描述 |
|------|------|------|------|
| stage | string | 否 | 階段篩選 |
| status | string | 否 | 狀態篩選 |
| assignee | string | 否 | 負責人篩選 |
| schoolId | string | 否 | 學校篩選 |

**Response:**
```typescript
{
  "success": true,
  "data": Workflow[]
}

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
```

---

### 4.2 創建工作流程

```
POST /api/workflows
```

**Request Body:**
```typescript
{
  "schoolId": string,      // 必填
  "assignee"?: string,
  "notes"?: string[]
}
```

---

### 4.3 推進工作流程

```
POST /api/workflows/:id/advance
```

**Request Body:**
```typescript
{
  "notes"?: string
}
```

---

### 4.4 完成工作流程

```
POST /api/workflows/:id/complete
```

---

### 4.5 暫停/恢復工作流程

```
POST /api/workflows/:id/pause
POST /api/workflows/:id/resume
```

---

## 5. Scraping API

### 5.1 獲取抓取任務列表

```
GET /api/scraping/tasks
```

**Query Parameters:**
| 參數 | 類型 | 必填 | 描述 |
|------|------|------|------|
| status | string | 否 | 狀態篩選 |
| schoolId | string | 否 | 學校篩選 |

**Response:**
```typescript
{
  "success": true,
  "data": ScrapingTask[]
}

interface ScrapingTask {
  id: string
  schoolId: string
  schoolName: string
  schoolWebsite: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  progress: number
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
```

---

### 5.2 創建抓取任務

```
POST /api/scraping/tasks
```

**Request Body:**
```typescript
{
  "schoolId": string,
  "priority"?: 'low' | 'normal' | 'high',
  "options"?: {
    "includeImages"?: boolean,
    "includeDocuments"?: boolean,
    "maxPages"?: number
  }
}
```

---

### 5.3 控制任務

```
POST /api/scraping/tasks/:id/start
POST /api/scraping/tasks/:id/stop
POST /api/scraping/tasks/:id/retry
DELETE /api/scraping/tasks/:id
```

---

### 5.4 獲取任務日誌

```
GET /api/scraping/tasks/:id/logs
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "logs": string[]
  }
}
```

---

### 5.5 獲取抓取統計

```
GET /api/scraping/stats
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "totalTasks": number,
    "completed": number,
    "running": number,
    "pending": number,
    "failed": number,
    "totalPagesScraped": number,
    "avgPagesPerSchool": number
  }
}
```

---

## 6. Auth API (待實現)

### 6.1 登入

```
POST /api/auth/login
```

**Request Body:**
```typescript
{
  "email": string,
  "password": string
}
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "user": User,
    "token": string,
    "expiresAt": string
  }
}
```

---

### 6.2 登出

```
POST /api/auth/logout
```

---

### 6.3 獲取當前用戶

```
GET /api/auth/me
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "id": string,
    "email": string,
    "name": string,
    "role": 'admin' | 'analyst' | 'viewer'
  }
}
```
