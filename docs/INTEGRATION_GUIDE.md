# 後端整合指南

## 1. 概述

本文檔為後端工程師/Claude Code 提供將前端 Mock 數據切換到真實 API 的完整指南。

## 2. 當前架構

```
前端 UI
    │
    ▼
Hooks (SWR)  ──── 數據獲取、緩存、同步
    │
    ▼
Services     ──── API 調用封裝
    │
    ▼
API Client   ──── 統一請求處理
    │
    ├── NEXT_PUBLIC_USE_MOCKS=true  ──▶ Mock Data
    │
    └── NEXT_PUBLIC_USE_MOCKS=false ──▶ Real API
```

## 3. 切換到真實 API

### 3.1 環境變量配置

```bash
# .env.local

# 關閉 Mock 模式
NEXT_PUBLIC_USE_MOCKS=false

# 設置 API 地址
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
# 或
NEXT_PUBLIC_API_BASE_URL=https://your-backend.com/api
```

### 3.2 後端需要實現的 Endpoints

參考 `docs/API_CONTRACT.md` 實現以下 API：

#### 核心 API (優先實現)
1. `GET /api/schools` - 學校列表
2. `GET /api/schools/:id` - 學校詳情
3. `GET /api/schools/dashboard-stats` - 儀表板統計

#### 完整 API 列表
- Schools: 6 個 endpoints
- Solutions: 5 個 endpoints
- Workflows: 8 個 endpoints
- Scraping: 8 個 endpoints
- Auth: 3 個 endpoints

### 3.3 響應格式要求

後端必須返回以下格式：

```typescript
// 成功響應
{
  "success": true,
  "data": <實際數據>,
  "meta"?: {
    "total": number,
    "page": number,
    "pageSize": number,
    "totalPages": number
  }
}

// 錯誤響應
{
  "success": false,
  "error": {
    "code": string,
    "message": string,
    "details"?: object
  }
}
```

## 4. 數據庫設置

### 4.1 建議技術棧

- **PostgreSQL** + **Prisma ORM** (推薦)
- **Supabase** (快速原型)
- **Neon** (Serverless PostgreSQL)

### 4.2 數據庫 Schema

參考 `lib/db-schema.ts` 中的 SQL 建表語句：

```sql
-- 主要表
CREATE TABLE schools (...);
CREATE TABLE assessments (...);
CREATE TABLE dimension_scores (...);
CREATE TABLE scraping_tasks (...);
CREATE TABLE workflows (...);
CREATE TABLE solutions (...);
CREATE TABLE recommendations (...);
CREATE TABLE users (...);
```

### 4.3 Prisma Schema 示例

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model School {
  id            String   @id @default(uuid())
  name          String
  englishName   String?  @map("english_name")
  district      String
  type          String
  website       String?
  address       String?
  phone         String?
  email         String?
  principal     String?
  studentCount  Int?     @map("student_count")
  teacherCount  Int?     @map("teacher_count")
  establishedYear Int?   @map("established_year")
  lastScrapedAt DateTime? @map("last_scraped_at")
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  assessments   Assessment[]
  workflows     Workflow[]
  scrapingTasks ScrapingTask[]
  recommendations Recommendation[]

  @@map("schools")
}

model Assessment {
  id            String   @id @default(uuid())
  schoolId      String   @map("school_id")
  assessedBy    String?  @map("assessed_by")
  assessedAt    DateTime @default(now()) @map("assessed_at")
  overallScore  Float    @map("overall_score")
  overallGrade  String   @map("overall_grade")
  notes         String?
  createdAt     DateTime @default(now()) @map("created_at")

  school        School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  dimensionScores DimensionScore[]

  @@map("assessments")
}

model DimensionScore {
  id             String   @id @default(uuid())
  assessmentId   String   @map("assessment_id")
  dimension      String
  score          Float
  evidence       String?
  recommendations String?

  assessment     Assessment @relation(fields: [assessmentId], references: [id], onDelete: Cascade)

  @@map("dimension_scores")
}

// ... 其他模型
```

## 5. 認證整合

### 5.1 當前設計

前端使用 Bearer Token 認證：

```typescript
// lib/api-client.ts
const buildHeaders = () => {
  const headers = new Headers({
    'Content-Type': 'application/json',
  })
  
  const token = getAuthToken()
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  
  return headers
}
```

### 5.2 後端實現建議

```typescript
// 使用 JWT
import jwt from 'jsonwebtoken'

// 生成 Token
const generateToken = (user: User) => {
  return jwt.sign(
    { userId: user.id, role: user.role },
    process.env.AUTH_SECRET,
    { expiresIn: '7d' }
  )
}

// 驗證中間件
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  
  if (!token) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: '未授權' }
    })
  }
  
  try {
    const decoded = jwt.verify(token, process.env.AUTH_SECRET)
    req.user = decoded
    next()
  } catch {
    return res.status(401).json({
      success: false,
      error: { code: 'TOKEN_EXPIRED', message: 'Token 已過期' }
    })
  }
}
```

### 5.3 切換到 Cookie-based Auth (可選)

如果需要使用 httpOnly cookie：

```typescript
// 修改 api-client.ts
const request = async (method, endpoint, data, config) => {
  const response = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: 'include', // 添加這行以發送 cookies
  })
  // ...
}
```

## 6. 抓取服務整合

### 6.1 建議架構

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   前端 UI   │───▶│   API 層    │───▶│  任務隊列   │
└─────────────┘    └─────────────┘    └─────────────┘
                                            │
                                            ▼
                                     ┌─────────────┐
                                     │  抓取 Worker │
                                     └─────────────┘
                                            │
                                            ▼
                                     ┌─────────────┐
                                     │   數據庫    │
                                     └─────────────┘
```

### 6.2 推薦工具

- **任務隊列**: Bull + Redis 或 BullMQ
- **抓取庫**: Puppeteer, Playwright, Cheerio
- **代理服務**: ScrapingBee, Crawlbase

### 6.3 抓取 Worker 示例

```typescript
// workers/scraping-worker.ts
import { Queue, Worker } from 'bullmq'
import * as cheerio from 'cheerio'

const scrapingQueue = new Queue('scraping')

const worker = new Worker('scraping', async (job) => {
  const { taskId, schoolId, website } = job.data
  
  try {
    // 更新狀態為運行中
    await updateTaskStatus(taskId, 'running')
    
    // 抓取網頁
    const pages = await scrapeWebsite(website)
    
    // 解析數據
    const data = await parseSchoolData(pages)
    
    // 保存結果
    await saveScrapedData(taskId, schoolId, data)
    
    // 更新狀態為完成
    await updateTaskStatus(taskId, 'completed')
    
  } catch (error) {
    await updateTaskStatus(taskId, 'failed', error.message)
  }
})
```

## 7. AI 分析服務整合

### 7.1 評分算法

8 維度評分可以結合：
1. 抓取的網站數據
2. 問卷調查結果
3. AI 分析結果

### 7.2 OpenAI 整合示例

```typescript
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const analyzeSchool = async (schoolData: SchoolData) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: '你是一個教育科技專家，請根據提供的學校資料評估其 AI 教育準備度。'
      },
      {
        role: 'user',
        content: JSON.stringify(schoolData)
      }
    ],
    response_format: { type: 'json_object' }
  })
  
  return JSON.parse(response.choices[0].message.content)
}
```

## 8. 部署建議

### 8.1 開發環境

```bash
# 前端
cd frontend
pnpm install
pnpm dev

# 後端 (假設使用 Node.js)
cd backend
npm install
npm run dev
```

### 8.2 生產環境

- **前端**: Vercel (推薦)
- **後端**: Railway, Render, AWS Lambda
- **數據庫**: Supabase, Neon, PlanetScale
- **Redis**: Upstash

### 8.3 環境變量檢查清單

```
前端:
✅ NEXT_PUBLIC_USE_MOCKS=false
✅ NEXT_PUBLIC_API_BASE_URL=<backend-url>

後端:
✅ DATABASE_URL=<postgresql-url>
✅ AUTH_SECRET=<random-32-chars>
✅ OPENAI_API_KEY=<api-key>
```

## 9. 測試建議

### 9.1 API 測試

使用 Postman 或 REST Client 測試所有 endpoints。

### 9.2 整合測試

1. 關閉 Mock 模式
2. 啟動後端服務
3. 測試所有功能流程

### 9.3 負載測試

- 學校列表分頁
- 並發抓取任務
- 實時數據更新

## 10. 故障排除

### 10.1 CORS 問題

確保後端設置正確的 CORS headers：

```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}))
```

### 10.2 認證問題

檢查 Token 格式和有效期。

### 10.3 數據格式問題

確保響應格式符合 API 契約。
