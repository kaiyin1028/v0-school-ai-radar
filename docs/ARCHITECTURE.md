# 前端架構文檔

## 1. 架構概覽

```
┌─────────────────────────────────────────────────────────────────┐
│                         UI Layer (React)                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐│
│  │  Dashboard  │ │   Schools   │ │  Solutions  │ │  Workflows  ││
│  │    View     │ │    View     │ │    View     │ │    View     ││
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘│
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Hooks Layer (SWR)                            │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐│
│  │ useSchools  │ │useSolutions │ │useWorkflows │ │ useScraping ││
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘│
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Services Layer                               │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐│
│  │  schools    │ │  solutions  │ │  workflows  │ │  scraping   ││
│  │  Service    │ │  Service    │ │  Service    │ │  Service    ││
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘│
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     API Client Layer                             │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │              apiClient (lib/api-client.ts)                  ││
│  │  • Request/Response 攔截                                     ││
│  │  • Auth Token 管理                                           ││
│  │  • 錯誤處理                                                  ││
│  │  • Mock 模式切換                                             ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
            ┌─────────────┐     ┌─────────────┐
            │  Mock Data  │     │  Real API   │
            │  (開發環境)  │     │  (生產環境)  │
            └─────────────┘     └─────────────┘
```

## 2. 目錄結構

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 主頁面 (Dashboard)
│   ├── layout.tsx         # 根佈局
│   └── globals.css        # 全局樣式
│
├── components/            # React 組件
│   ├── ui/               # 基礎 UI 組件 (shadcn/ui)
│   ├── dashboard-view.tsx
│   ├── schools-view.tsx
│   ├── solutions-view.tsx
│   ├── workflow-view.tsx
│   ├── scraping-view.tsx
│   ├── analysis-view.tsx
│   └── ...
│
├── hooks/                # 自定義 React Hooks
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
│   ├── api-client.ts    # API 客戶端
│   ├── types.ts         # TypeScript 類型
│   ├── db-schema.ts     # 數據庫架構定義
│   └── utils.ts         # 工具函數
│
├── mocks/               # 模擬數據
│   ├── schools.ts
│   ├── solutions.ts
│   ├── workflows.ts
│   └── index.ts
│
└── docs/                # 文檔
    ├── ARCHITECTURE.md
    ├── PAGES_AND_DATA.md
    ├── API_CONTRACT.md
    └── INTEGRATION_GUIDE.md
```

## 3. 數據流

### 3.1 讀取數據流程

```
用戶操作 (查看學校列表)
        │
        ▼
Component 調用 useSchools()
        │
        ▼
SWR 檢查緩存 ─────────────────┐
        │                     │
        ▼ (緩存未命中)         ▼ (緩存命中)
調用 schoolsService.getList() │
        │                     │
        ▼                     │
apiClient.get('/schools')     │
        │                     │
        ├── Mock 模式 ──▶ 返回 mockSchools
        │                     │
        └── API 模式 ──▶ fetch 請求
                │
                ▼
        解析響應 / 錯誤處理
                │
                ▼
        SWR 更新緩存 & 觸發重新渲染
                │
                ▼
        Component 渲染數據 / loading / error 狀態
```

### 3.2 寫入數據流程

```
用戶操作 (創建學校)
        │
        ▼
Component 調用 mutation.trigger()
        │
        ▼
useSWRMutation 執行 fetcher
        │
        ▼
schoolsService.create(data)
        │
        ▼
apiClient.post('/schools', data)
        │
        ├── 成功 ──▶ SWR 自動 revalidate
        │                   │
        │                   ▼
        │            更新相關緩存
        │                   │
        │                   ▼
        │            觸發 UI 更新
        │
        └── 失敗 ──▶ 返回錯誤
                        │
                        ▼
                  Component 顯示錯誤
```

## 4. 狀態管理策略

### 4.1 服務器狀態 (SWR)

- **學校數據**: `useSchools`, `useSchool`, `useDashboardStats`
- **解決方案**: `useSolutions`, `useSchoolRecommendations`
- **工作流程**: `useWorkflows`, `useWorkflowStats`
- **抓取任務**: `useScrapingTasks`, `useScrapingStats`

### 4.2 客戶端狀態 (React useState)

- 表單輸入值
- 模態框開關狀態
- 選中的項目
- 篩選條件

### 4.3 URL 狀態

- 當前視圖 (Dashboard/Schools/Solutions...)
- 分頁參數
- 篩選參數

## 5. 錯誤處理策略

### 5.1 API 錯誤

```typescript
// API 錯誤會被 ApiException 包裝
class ApiException extends Error {
  code: string      // 錯誤代碼 (如 'UNAUTHORIZED')
  status: number    // HTTP 狀態碼
  details?: object  // 額外詳情
}
```

### 5.2 UI 錯誤處理

每個數據組件都應處理三種狀態：
1. **Loading**: 顯示骨架屏或加載動畫
2. **Error**: 顯示錯誤信息和重試按鈕
3. **Empty**: 顯示空狀態提示

### 5.3 錯誤邊界

使用 React Error Boundary 捕獲渲染錯誤：

```typescript
// 在關鍵組件周圍包裹 ErrorBoundary
<ErrorBoundary fallback={<ErrorFallback />}>
  <DashboardView />
</ErrorBoundary>
```

## 6. 性能優化

### 6.1 SWR 配置

```typescript
{
  revalidateOnFocus: false,     // 避免頻繁重新驗證
  dedupingInterval: 5000,       // 5 秒內重複請求去重
  refreshInterval: 0,           // 默認不自動刷新
}
```

### 6.2 組件優化

- 使用 `React.memo` 避免不必要的重新渲染
- 大列表使用虛擬化 (react-window)
- 圖片懶加載

### 6.3 代碼分割

- 按視圖分割代碼
- 動態導入大型組件

## 7. 安全考慮

### 7.1 認證

- Token 存儲在 httpOnly cookie (生產環境)
- 開發環境可使用 localStorage
- 敏感操作需要 re-authentication

### 7.2 數據驗證

- 所有用戶輸入在前端驗證
- 後端必須再次驗證
- 使用 Zod 進行 schema 驗證

### 7.3 XSS 防護

- React 默認轉義 HTML
- 避免使用 dangerouslySetInnerHTML
- 使用 DOMPurify 清理 HTML 內容
