# 系統架構文檔

## 概述

本系統是一個 AI 教育需求分析平台，採用 Next.js 15 App Router 架構，支援 Mock/API 雙模式切換。

## 技術棧

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui
- **Charts**: Recharts
- **State**: SWR (data fetching), React hooks
- **Authentication**: JWT Token + HTTP-only cookies

## 目錄結構

```
├── app/                    # Next.js App Router 頁面
│   ├── layout.tsx          # 全局 Layout
│   ├── page.tsx            # 主頁面
│   └── api/                # API Routes
├── components/             # React 組件
│   ├── ui/                 # shadcn/ui 基礎組件
│   └── *.tsx               # 業務組件
├── services/               # Service 層 (Mock + API 切換)
│   ├── index.ts            # 統一導出
│   ├── auth.service.ts     # 認證服務
│   ├── users.service.ts    # 用戶服務
│   ├── schools/            # 學校服務模組
│   ├── solutions/          # 方案服務模組
│   ├── workflows/          # 工作流服務模組
│   └── scraping/           # 爬蟲服務模組
├── lib/                    # 工具函數和配置
│   ├── api-client.ts       # API 客戶端
│   ├── auth-token.ts       # Token 管理
│   ├── types.ts            # 類型定義
│   └── utils.ts            # 通用工具
├── hooks/                  # React Hooks
│   └── use-async.ts        # 異步數據 hook
├── mocks/                  # Mock 數據
│   └── index.ts            # Mock 數據導出
└── docs/                   # 開發文檔
```

## 分層架構

```
┌─────────────────────────────────────────────────────────┐
│                    UI Components                        │
│              (components/*.tsx)                         │
├─────────────────────────────────────────────────────────┤
│                      Hooks                              │
│                 (hooks/use-async.ts)                    │
├─────────────────────────────────────────────────────────┤
│                    Services                             │
│    (services/*.service.ts, services/*/index.ts)         │
│    ┌─────────────┐    ┌─────────────┐                   │
│    │  Mock Data  │ OR │  API Client │  <── 環境切換     │
│    └─────────────┘    └─────────────┘                   │
├─────────────────────────────────────────────────────────┤
│                    Lib / Utils                          │
│      (lib/api-client.ts, lib/auth-token.ts)             │
└─────────────────────────────────────────────────────────┘
```

## Mock 模式切換

### 環境變量

```env
# .env.local
NEXT_PUBLIC_USE_MOCKS=true   # true = Mock 模式, false = API 模式
NEXT_PUBLIC_API_URL=http://localhost:8080  # 後端 API 地址
```

### Service 實現模式

每個 service 模組都遵循相同的模式：

```typescript
// services/example/index.ts
import { apiClient } from '@/lib/api-client'
import * as mockData from './mock'
import * as realApi from './api'

const useMocks = process.env.NEXT_PUBLIC_USE_MOCKS === 'true'

export const exampleService = {
  getList: useMocks ? mockData.getList : realApi.getList,
  getById: useMocks ? mockData.getById : realApi.getById,
  create: useMocks ? mockData.create : realApi.create,
  update: useMocks ? mockData.update : realApi.update,
  delete: useMocks ? mockData.delete : realApi.delete,
}
```

## 狀態管理

### 頁面狀態處理

每個頁面組件都應處理三種狀態：

1. **Loading** - 使用 `<LoadingState>` 或 Skeleton 組件
2. **Error** - 使用 `<ErrorState>` 並提供 retry 按鈕
3. **Empty** - 使用 `<EmptyState>` 並提供操作按鈕

```tsx
import { useAsync } from '@/hooks/use-async'
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/states'

function MyPage() {
  const { data, isLoading, error, retry } = useAsync(fetchData, { immediate: true })
  
  if (isLoading) return <LoadingState />
  if (error) return <ErrorState onRetry={retry} />
  if (!data) return <EmptyState />
  
  return <DataView data={data} />
}
```

## API 客戶端

### 基礎用法

```typescript
import { apiClient, ApiError } from '@/lib/api-client'

// GET 請求
const { data, error } = await apiClient.get<SchoolList>('/api/schools')

// POST 請求
const { data, error } = await apiClient.post<School>('/api/schools', { name: '...' })

// 錯誤處理
if (error) {
  console.error(error.code, error.message)
}
```

### 認證

```typescript
import { authToken } from '@/lib/auth-token'

// 登入後設置 token
authToken.set('jwt-token-here')

// 檢查是否已認證
if (authToken.isAuthenticated()) {
  // ...
}

// 登出時清除 token
authToken.clear()
```

## 組件設計原則

1. **單一職責** - 每個組件只做一件事
2. **可重用性** - 提取通用邏輯到 hooks 和工具函數
3. **類型安全** - 使用 TypeScript 強類型
4. **無障礙** - 遵循 ARIA 規範
5. **響應式** - 支援桌面和移動設備
