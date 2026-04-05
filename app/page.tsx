'use client'

import { useState } from 'react'
import { SidebarNav } from '@/components/sidebar-nav'
import { DashboardView } from '@/components/dashboard-view'
import { SchoolsView } from '@/components/schools-view'
import { AnalysisView } from '@/components/analysis-view'
import { SolutionsView } from '@/components/solutions-view'
import { WorkflowView } from '@/components/workflow-view'
import { ScrapingView } from '@/components/scraping-view'
import { Bell, User, Search, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: '總覽儀表板', subtitle: '全港學校 AI 教育發展概況' },
  schools: { title: '學校管理', subtitle: '管理和查看所有學校資料' },
  analysis: { title: '智能需求分析', subtitle: '8 大維度深度分析學校 AI 教育需求' },
  solutions: { title: '解決方案推薦', subtitle: '根據學校需求智能推薦最佳方案' },
  workflow: { title: '工作流程管理', subtitle: '追蹤和管理所有進行中的項目' },
  scraping: { title: '數據抓取', subtitle: '自動抓取學校官網信息' },
  settings: { title: '系統設置', subtitle: '配置系統參數和偏好設定' },
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard')

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />
      case 'schools':
        return <SchoolsView />
      case 'analysis':
        return <AnalysisView />
      case 'solutions':
        return <SolutionsView />
      case 'workflow':
        return <WorkflowView />
      case 'scraping':
        return <ScrapingView />
      case 'settings':
        return (
          <div className="flex h-96 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-secondary/30">
            <Settings className="mb-4 h-16 w-16 text-muted-foreground/50" />
            <p className="text-lg font-medium text-muted-foreground">系統設置頁面開發中...</p>
            <p className="mt-1 text-sm text-muted-foreground/70">敬請期待更多功能</p>
          </div>
        )
      default:
        return <DashboardView />
    }
  }

  const currentPage = PAGE_TITLES[activeTab] || PAGE_TITLES.dashboard

  return (
    <div className="min-h-screen bg-background">
      <SidebarNav activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="ml-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/95 px-6 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/80">
          <div>
            <h1 className="text-lg font-bold text-foreground">{currentPage.title}</h1>
            <p className="text-xs text-muted-foreground">{currentPage.subtitle}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜尋學校、方案..."
                className="w-64 border-border/50 bg-secondary/50 pl-9 focus:bg-background"
              />
            </div>
            <Button variant="ghost" size="icon" className="relative hover:bg-secondary">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-secondary">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
                <User className="h-4 w-4 text-white" />
              </div>
            </Button>
          </div>
        </header>
        
        <main className="p-6">{renderContent()}</main>
      </div>
    </div>
  )
}
