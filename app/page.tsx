'use client'

import { useState } from 'react'
import { SidebarNav } from '@/components/sidebar-nav'
import { DashboardView } from '@/components/dashboard-view'
import { SchoolsView } from '@/components/schools-view'
import { AnalysisView } from '@/components/analysis-view'
import { SolutionsView } from '@/components/solutions-view'
import { WorkflowView } from '@/components/workflow-view'
import { ScrapingView } from '@/components/scraping-view'
import { Bell, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

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
          <div className="flex h-96 items-center justify-center">
            <p className="text-muted-foreground">系統設置頁面開發中...</p>
          </div>
        )
      default:
        return <DashboardView />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SidebarNav activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="ml-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              {activeTab === 'dashboard' && '總覽儀表板'}
              {activeTab === 'schools' && '學校管理'}
              {activeTab === 'analysis' && '智能需求分析'}
              {activeTab === 'solutions' && '解決方案推薦'}
              {activeTab === 'workflow' && '工作流程管理'}
              {activeTab === 'scraping' && '數據抓取'}
              {activeTab === 'settings' && '系統設置'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </header>
        
        <main className="p-6">{renderContent()}</main>
      </div>
    </div>
  )
}
