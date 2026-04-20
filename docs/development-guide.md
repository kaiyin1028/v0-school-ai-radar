# 開發指南

## 快速開始

### 環境要求

- Node.js 18+
- pnpm 8+

### 安裝依賴

```bash
pnpm install
```

### 環境配置

複製環境變量模板：

```bash
cp .env.example .env.local
```

編輯 `.env.local`：

```env
# Mock 模式 (開發時使用)
NEXT_PUBLIC_USE_MOCKS=true

# API 地址 (連接後端時使用)
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 啟動開發服務器

```bash
pnpm dev
```

訪問 http://localhost:3000

---

## 開發模式

### Mock 模式 (默認)

適用於前端獨立開發，無需後端支持。

```env
NEXT_PUBLIC_USE_MOCKS=true
```

特點：
- 使用 `/mocks` 目錄中的靜態數據
- 模擬 API 延遲 (500ms)
- 支持基本的 CRUD 操作

### API 模式

連接真實後端 API。

```env
NEXT_PUBLIC_USE_MOCKS=false
NEXT_PUBLIC_API_URL=http://localhost:8080
```

---

## 添加新功能

### 1. 添加新 Service

以添加「報告」功能為例：

```bash
# 創建目錄結構
mkdir -p services/reports
touch services/reports/index.ts
touch services/reports/types.ts
touch services/reports/mock.ts
touch services/reports/api.ts
```

**types.ts** - 定義類型：

```typescript
export interface Report {
  id: string
  schoolId: string
  title: string
  generatedAt: string
  content: string
}

export interface GenerateReportInput {
  schoolId: string
  templateId: string
}
```

**mock.ts** - Mock 實現：

```typescript
import { Report, GenerateReportInput } from './types'

const mockReports: Report[] = [
  // ... mock 數據
]

export async function getList(): Promise<{ data: Report[] }> {
  await new Promise(r => setTimeout(r, 500))
  return { data: mockReports }
}

export async function generate(input: GenerateReportInput): Promise<{ data: Report }> {
  await new Promise(r => setTimeout(r, 1000))
  return {
    data: {
      id: `report-${Date.now()}`,
      schoolId: input.schoolId,
      title: '分析報告',
      generatedAt: new Date().toISOString(),
      content: '...'
    }
  }
}
```

**api.ts** - API 實現：

```typescript
import { apiClient } from '@/lib/api-client'
import { Report, GenerateReportInput } from './types'

export async function getList() {
  return apiClient.get<Report[]>('/api/reports')
}

export async function generate(input: GenerateReportInput) {
  return apiClient.post<Report>('/api/reports/generate', input)
}
```

**index.ts** - 統一導出：

```typescript
import * as mockData from './mock'
import * as realApi from './api'

const useMocks = process.env.NEXT_PUBLIC_USE_MOCKS === 'true'

export const reportsService = {
  getList: useMocks ? mockData.getList : realApi.getList,
  generate: useMocks ? mockData.generate : realApi.generate,
}

export * from './types'
```

### 2. 更新 services/index.ts

```typescript
export { reportsService, type Report, type GenerateReportInput } from './reports'
```

### 3. 創建 UI 組件

```tsx
// components/reports-view.tsx
'use client'

import { useAsync } from '@/hooks/use-async'
import { reportsService } from '@/services'
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/states'

export function ReportsView() {
  const { data, isLoading, error, retry } = useAsync(
    () => reportsService.getList().then(r => r.data),
    { immediate: true }
  )

  if (isLoading) return <LoadingState message="載入報告..." />
  if (error) return <ErrorState onRetry={retry} />
  if (!data?.length) return <EmptyState title="暫無報告" />

  return (
    <div>
      {data.map(report => (
        <ReportCard key={report.id} report={report} />
      ))}
    </div>
  )
}
```

---

## 代碼規範

### 命名規範

| 類型 | 格式 | 示例 |
|------|------|------|
| 組件 | PascalCase | `SchoolCard.tsx` |
| Hook | camelCase + use 前綴 | `useAsync.ts` |
| Service | camelCase + Service 後綴 | `schoolsService` |
| 類型 | PascalCase | `SchoolListParams` |
| 常量 | UPPER_SNAKE_CASE | `API_BASE_URL` |

### 文件組織

```
# Service 模組結構
services/
  schools/
    index.ts      # 統一導出
    types.ts      # 類型定義
    mock.ts       # Mock 實現
    api.ts        # API 實現

# 組件結構
components/
  ui/             # 通用 UI 組件
    button.tsx
    card.tsx
    states.tsx    # Loading/Error/Empty
  school-card.tsx # 業務組件
  schools-view.tsx
```

### TypeScript 規範

```typescript
// ✅ 明確定義參數和返回類型
async function fetchSchools(params: SchoolListParams): Promise<ApiResponse<SchoolList>> {
  // ...
}

// ❌ 避免使用 any
function handleData(data: any) { ... }

// ✅ 使用 unknown + 類型守衛
function handleData(data: unknown) {
  if (isSchool(data)) {
    // ...
  }
}
```

---

## 測試

### 運行測試

```bash
pnpm test
```

### 編寫測試

```typescript
// __tests__/services/schools.test.ts
import { schoolsService } from '@/services'

describe('Schools Service', () => {
  it('should return school list', async () => {
    const result = await schoolsService.getList({ page: 1, pageSize: 10 })
    expect(result.data.schools).toHaveLength(10)
  })
})
```

---

## 常見問題

### Q: 如何切換 Mock/API 模式？

修改 `.env.local` 中的 `NEXT_PUBLIC_USE_MOCKS` 值並重啟開發服務器。

### Q: API 請求失敗怎麼辦？

1. 檢查 `NEXT_PUBLIC_API_URL` 是否正確
2. 確認後端服務是否運行
3. 查看瀏覽器 Network 面板的錯誤信息
4. 檢查 Token 是否過期

### Q: 如何添加新的環境變量？

1. 在 `.env.example` 中添加說明
2. 在 `.env.local` 中設置值
3. 如需在客戶端使用，變量名必須以 `NEXT_PUBLIC_` 開頭

### Q: 如何調試 Service 層？

```typescript
// 在 service 中添加日誌
export async function getList(params: SchoolListParams) {
  console.log('[v0] schoolsService.getList called with:', params)
  const result = await apiClient.get('/api/schools', { params })
  console.log('[v0] schoolsService.getList result:', result)
  return result
}
```
