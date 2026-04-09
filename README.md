# 全港學校 AI 教育需求雷達系統

Hong Kong School AI Education Demand Radar System

智能分析香港學校 AI 教育需求的專業平台

## 系統功能

- **智能分析學校 AI 教育需求（8 大維度）**
  - 課程融合度
  - 基礎設施
  - 師資培訓
  - 學生素養
  - 管理策略
  - 倫理安全
  - 合作夥伴
  - 創新實踐

- **自動抓取學校官網信息**
- **科學評分成熟度等級（A/B/C/D）**
- **個性化推薦解決方案**
- **完整工作流程管理**

## 技術棧

- **Frontend**: Next.js 16, React 19, TypeScript
- **UI Components**: shadcn/ui, Radix UI
- **Styling**: Tailwind CSS 4
- **Charts**: Recharts
- **State Management**: React Hooks

## 快速開始

### 系統要求

- Node.js 18.17 或更高版本
- pnpm 8.0 或更高版本（推薦）

### 安裝步驟

1. Clone 項目
```bash
git clone https://github.com/kaiyin1028/v0-school-ai-radar.git
cd v0-school-ai-radar
```

2. 安裝依賴
```bash
pnpm install
```

3. 啟動開發服務器
```bash
pnpm dev
```

4. 打開瀏覽器訪問 [http://localhost:3000](http://localhost:3000)

## 項目結構

```
├── app/                    # Next.js App Router
│   ├── globals.css        # 全局樣式和主題變量
│   ├── layout.tsx         # 根佈局
│   └── page.tsx           # 主頁面
├── components/            # React 組件
│   ├── ui/               # shadcn/ui 基礎組件
│   ├── dashboard-view.tsx # 儀表板視圖
│   ├── schools-view.tsx   # 學校管理視圖
│   ├── analysis-view.tsx  # 需求分析視圖
│   ├── solutions-view.tsx # 方案推薦視圖
│   ├── workflow-view.tsx  # 工作流程視圖
│   ├── scraping-view.tsx  # 數據抓取視圖
│   ├── radar-chart.tsx    # 8維度雷達圖
│   ├── school-card.tsx    # 學校卡片
│   ├── stat-card.tsx      # 統計卡片
│   ├── grade-badge.tsx    # 評分徽章
│   └── sidebar-nav.tsx    # 側邊導航
├── lib/                   # 工具函數和類型
│   ├── types.ts          # TypeScript 類型定義
│   ├── mock-data.ts      # 模擬數據
│   └── utils.ts          # 工具函數
├── public/               # 靜態資源
│   └── images/           # 圖片資源
└── hooks/                # 自定義 Hooks
```

## 未來開發計劃

### 數據庫集成
- PostgreSQL / Supabase 數據庫
- 學校數據持久化存儲
- 用戶認證和授權

### AI 功能增強
- 自動網站抓取和分析
- 智能評分算法
- 個性化推薦引擎

### 數據可視化
- 更多圖表類型
- 數據導出功能
- 報告生成

## 環境變量

創建 `.env.local` 文件（未來數據庫集成時使用）:

```env
# Database (未來使用)
DATABASE_URL=

# Supabase (未來使用)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# AI Services (未來使用)
OPENAI_API_KEY=
```

## 開發命令

```bash
# 開發模式
pnpm dev

# 構建生產版本
pnpm build

# 啟動生產服務器
pnpm start

# 代碼檢查
pnpm lint
```

## 貢獻指南

1. Fork 此項目
2. 創建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 開啟 Pull Request

## 許可證

MIT License

## 聯繫方式

如有問題或建議，請提交 Issue 或 Pull Request。

---

Built with [v0](https://v0.app) | Powered by [Next.js](https://nextjs.org)
