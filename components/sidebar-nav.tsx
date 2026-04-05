'use client'

import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  School,
  Lightbulb,
  Workflow,
  Settings,
  Search,
  Globe,
  type LucideIcon,
} from 'lucide-react'

interface NavItem {
  icon: LucideIcon
  label: string
  value: string
  badge?: number
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: '總覽儀表板', value: 'dashboard' },
  { icon: School, label: '學校管理', value: 'schools', badge: 8 },
  { icon: Search, label: '需求分析', value: 'analysis' },
  { icon: Lightbulb, label: '方案推薦', value: 'solutions' },
  { icon: Workflow, label: '工作流程', value: 'workflow', badge: 4 },
  { icon: Globe, label: '數據抓取', value: 'scraping' },
  { icon: Settings, label: '系統設置', value: 'settings' },
]

interface SidebarNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function SidebarNav({ activeTab, onTabChange }: SidebarNavProps) {
  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <span className="text-lg font-bold text-primary-foreground">AI</span>
        </div>
        <div>
          <h1 className="font-semibold text-sidebar-foreground">教育需求雷達</h1>
          <p className="text-xs text-muted-foreground">全港學校分析平台</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.value

          return (
            <button
              key={item.value}
              onClick={() => onTabChange(item.value)}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span
                  className={cn(
                    'flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-medium',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <div className="rounded-lg bg-sidebar-accent/50 p-4">
          <h4 className="text-sm font-medium text-sidebar-foreground">需要幫助？</h4>
          <p className="mt-1 text-xs text-muted-foreground">查看文檔或聯繫支援團隊</p>
          <button className="mt-3 w-full rounded-lg bg-primary py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            查看文檔
          </button>
        </div>
      </div>
    </aside>
  )
}
