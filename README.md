# 全港學校 AI 教育需求雷達系統

> Hong Kong School AI Education Demand Radar System
> 
> 智能分析香港學校 AI 教育需求的專業平台

---

## 目錄

- [專案概述](#專案概述)
- [功能概覽](#功能概覽)
- [技術棧](#技術棧)
- [快速開始](#快速開始)
- [專案結構](#專案結構)
- [頁面與路由](#頁面與路由)
- [數據層架構](#數據層架構)
- [環境變量](#環境變量)
- [開發指南](#開發指南)
- [技術文檔](#技術文檔)
- [後端整合](#後端整合)

---

## 專案概述

本系統為香港教育界提供智能化的 AI 教育需求分析平台，通過 8 大維度評估學校的 AI 教育準備度，並提供個性化的解決方案推薦。

### 核心價值

1. **智能分析** - 基於 8 大維度的科學評估體系
2. **數據驅動** - 自動抓取學校官網信息
3. **個性推薦** - 根據學校特點推薦解決方案
4. **流程管理** - 完整的工作流程追蹤

---

## 功能概覽

### 1. 總覽儀表板
- 全港學校 AI 教育發展統計
- 區域評分分佈圖表
- 成熟度等級分佈 (A/B/C/D)

### 2. 學校管理
- 學校列表 (搜索、篩選、分頁)
- 學校詳情與評分歷史
- 批量導入/導出

### 3. 需求分析 (8 大維度)
| 維度 | 描述 |
|------|------|
| 課程融合 | AI 融入各學科課程的程度與質量 |
| 基礎設施 | AI 硬件設備、軟件平台及網絡環境 |
| 師資培訓 | 教師 AI 能力培訓與專業發展 |
| 學生素養 | 學生 AI 認知、技能與態度 |
| 管理策略 | 學校 AI 發展策略與行政支援 |
| 倫理安全 | AI 使用的倫理規範與數據安全 |
| 合作夥伴 | 與業界、高校的 AI 合作項目 |
| 創新實踐 | AI 創新項目與實踐成果 |

### 4. 方案推薦
- 智能匹配解決方案
- 按維度/等級篩選
- 推薦理由說明

### 5. 工作流程
- 5 階段流程管理 (發現→分析→推薦→實施→評估)
- 任務分配與備註
- 進度追蹤

### 6. 數據抓取
- 學校官網信息自動抓取
- 任務進度監控
- 日誌查看

---

## 技術棧

| 類別 | 技術 | 版本 |
|------|------|------|
| 框架 | Next.js | 15.x |
| 語言 | TypeScript | 5.x |
| UI 庫 | shadcn/ui | latest |
| 樣式 | Tailwind CSS | 4.x |
| 數據獲取 | SWR | 2.x |
| 圖表 | Recharts | 2.x |
| 包管理 | pnpm | 9.x |

---

## 快速開始

### 環境要求

- Node.js >= 18.17.0
- pnpm >= 9.0.0

### 安裝步驟

```bash
# 1. 克隆專案
git clone https://github.com/kaiyin1028/v0-school-ai-radar.git
cd v0-school-ai-radar

# 2. 安裝依賴
pnpm install

# 3. 配置環境變量
cp .env.example .env.local

# 4. 啟動開發服務器
pnpm dev
```

訪問 http://localhost:3000 查看應用。

### 可用命令

```bash
pnpm dev          # 啟動開發服務器
pnpm build        # 構建生產版本
pnpm start        # 運行生產版本
pnpm lint         # 運行 ESLint
```

---

## 專案結構

```
├── app/                    # Next.js App Router
│   ├── page.tsx           # 主頁面
│   ├── layout.tsx         # 根佈局
│   └── globals.css        # 全局樣式
│
├── components/            # React 組件
│   ├── ui/               # 基礎 UI 組件 (shadcn/ui)
│   ├── dashboard-view.tsx # 儀表板視圖
│   ├── schools-view.tsx   # 學校管理視圖
│   ├── analysis-view.tsx  # 需求分析視圖
│   ├── solutions-view.tsx # 方案推薦視圖
│   ├── workflow-view.tsx  # 工作流程視圖
│   ├── scraping-view.tsx  # 數據抓取視圖
│   ├── radar-chart.tsx    # 8維度雷達圖
│   └── ...
│
├── hooks/                # 自定義 React Hooks (SWR)
│   ├── use-schools.ts   # 學校數據 hooks
│   ├── use-solutions.ts # 解決方案 hooks
│   ├── use-workflows.ts # 工作流程 hooks
│   ├── use-scraping.ts  # 數據抓取 hooks
│   └── index.ts
│
├── services/             # API 服務層
│   ├── schools.ts       # 學校 API
│   ├── solutions.ts     # 解決方案 API
│   ├── workflows.ts     # 工作流程 API
│   ├── scraping.ts      # 數據抓取 API
│   └── index.ts
│
├── lib/                  # 工具庫
│   ├── api-client.ts    # API 客戶端 (統一請求處理)
│   ├── types.ts         # TypeScript 類型定義
│   ├── db-schema.ts     # 數據庫架構定義
│   └── utils.ts         # 工具函數
│
├── mocks/               # 模擬數據 (開發環境)
│   ├── schools.ts
│   ├── solutions.ts
│   ├── workflows.ts
│   └── index.ts
│
├── docs/                # 技術文檔
│   ├── ARCHITECTURE.md      # 前端架構
│   ├── PAGES_AND_DATA.md    # 頁面數據需求
│   ├── API_CONTRACT.md      # API 契約
│   └── INTEGRATION_GUIDE.md # 後端整合指南
│
└── public/              # 靜態資源
    └── images/
```

---

## 頁面與路由

| 視圖 | Tab | 描述 | Hook | 主要 API |
|------|-----|------|------|----------|
| Dashboard | 總覽 | 儀表板首頁 | `useDashboardStats()` | `GET /schools/dashboard-stats` |
| Schools | 學校管理 | 學校列表 | `useSchools()` | `GET /schools` |
| Analysis | 需求分析 | 8維度分析 | `useSchool(id)` | `GET /schools/:id` |
| Solutions | 方案推薦 | 解決方案 | `useSchoolRecommendations(id)` | `GET /solutions/recommendations/:id` |
| Workflow | 工作流程 | 流程管理 | `useWorkflows()` | `GET /workflows` |
| Scraping | 數據抓取 | 抓取任務 | `useScrapingTasks()` | `GET /scraping/tasks` |

---

## 數據層架構

```
┌─────────────────────────────────────────────────────────────┐
│                     UI Components                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Hooks Layer (SWR 緩存 & 同步)                   │
│  useSchools() | useSolutions() | useWorkflows() | ...       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Services Layer                            │
│  schoolsService | solutionsService | workflowsService | ... │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Client Layer                          │
│  統一請求處理 | Auth Token | 錯誤處理 | Mock 切換            │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
      ┌─────────────┐                 ┌─────────────┐
      │  Mock Data  │                 │  Real API   │
      │ (開發環境)   │                 │ (生產環境)   │
      └─────────────┘                 └─────────────┘
```

### 使用方式

```typescript
// 在組件中使用 hooks
import { useSchools, useDashboardStats } from '@/hooks'

function MyComponent() {
  const { schools, isLoading, error, refresh } = useSchools({
    page: 1,
    pageSize: 10,
    district: '中西區',
  })

  if (isLoading) return <LoadingSkeleton />
  if (error) return <ErrorMessage error={error} onRetry={refresh} />
  if (schools.length === 0) return <EmptyState />
  
  return <SchoolList schools={schools} />
}
```

---

## 環境變量

```bash
# ===========================================
# Mock 模式 (開發時設為 true)
# ===========================================
NEXT_PUBLIC_USE_MOCKS=true

# ===========================================
# API 配置 (生產環境)
# ===========================================
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NEXT_PUBLIC_API_TIMEOUT=30000

# ===========================================
# 數據庫 (後端整合時配置)
# ===========================================
DATABASE_URL=postgresql://...

# ===========================================
# 認證 (後端整合時配置)
# ===========================================
AUTH_SECRET=your-secret-key-min-32-chars

# ===========================================
# AI 服務 (可選)
# ===========================================
OPENAI_API_KEY=sk-...
```

完整配置請參考 `.env.example`。

---

## 開發指南

### 添加新功能流程

1. 在 `lib/types.ts` 定義 TypeScript 類型
2. 在 `mocks/` 添加模擬數據
3. 在 `services/` 實現 API 服務
4. 在 `hooks/` 創建 React Hook
5. 在 `components/` 實現 UI 組件

### UI 狀態處理

每個數據組件必須處理三種狀態:

```typescript
function DataComponent() {
  const { data, isLoading, error } = useData()

  // 1. Loading 狀態
  if (isLoading) return <Skeleton />
  
  // 2. Error 狀態
  if (error) return <ErrorCard message={error.message} onRetry={refresh} />
  
  // 3. Empty 狀態
  if (!data || data.length === 0) return <EmptyState />
  
  // 正常渲染
  return <DataList data={data} />
}
```

### 代碼規範

- TypeScript 嚴格模式
- 函數式組件 + Hooks
- Tailwind CSS 樣式
- 遵循 ESLint 規則

---

## 技術文檔

| 文檔 | 描述 | 讀者 |
|------|------|------|
| [ARCHITECTURE.md](./docs/ARCHITECTURE.md) | 前端架構、數據流、狀態管理 | 前端開發者 |
| [PAGES_AND_DATA.md](./docs/PAGES_AND_DATA.md) | 頁面數據需求、欄位定義 | 前後端開發者 |
| [API_CONTRACT.md](./docs/API_CONTRACT.md) | API 契約、請求/響應格式 | 後端開發者 |
| [INTEGRATION_GUIDE.md](./docs/INTEGRATION_GUIDE.md) | 後端整合、Mock 切換 | 後端開發者 |

---

## 後端整合

當準備好整合真實後端時:

### 步驟 1: 關閉 Mock 模式

```bash
# .env.local
NEXT_PUBLIC_USE_MOCKS=false
NEXT_PUBLIC_API_BASE_URL=http://your-backend.com/api
```

### 步驟 2: 實現後端 API

參考以下文檔:
- `docs/API_CONTRACT.md` - 完整的 API 契約
- `docs/INTEGRATION_GUIDE.md` - 整合指南
- `lib/db-schema.ts` - 數據庫 Schema

### 步驟 3: 數據庫設置

推薦方案:
- PostgreSQL + Prisma ORM
- Supabase (快速原型)
- Neon (Serverless)

---

## 許可證

MIT License

---

Built with [v0](https://v0.app) | Powered by [Next.js](https://nextjs.org)
