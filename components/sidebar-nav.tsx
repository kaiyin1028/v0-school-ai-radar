'use client'

import { cn } from '@/lib/utils'
import Image from 'next/image'
import {
  LayoutDashboard,
  School,
  Lightbulb,
  Workflow,
  Settings,
  Search,
  Globe,
  type LucideIcon,
  Leaf,
  BookOpen,
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
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
          <Leaf className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-semibold text-foreground">AI 教育雷達</h1>
          <p className="text-xs text-muted-foreground">全港學校分析平台</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          主要功能
        </p>
        {navItems.slice(0, 4).map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.value

          return (
            <button
              key={item.value}
              onClick={() => onTabChange(item.value)}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all',
                isActive
                  ? 'bg-primary font-medium text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span
                  className={cn(
                    'flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-medium',
                    isActive
                      ? 'bg-primary-foreground/20 text-primary-foreground'
                      : 'bg-primary/10 text-primary'
                  )}
                >
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}

        <p className="mb-2 mt-6 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          系統管理
        </p>
        {navItems.slice(4).map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.value

          return (
            <button
              key={item.value}
              onClick={() => onTabChange(item.value)}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all',
                isActive
                  ? 'bg-primary font-medium text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span
                  className={cn(
                    'flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-medium',
                    isActive
                      ? 'bg-primary-foreground/20 text-primary-foreground'
                      : 'bg-primary/10 text-primary'
                  )}
                >
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Bottom Card */}
      <div className="border-t border-border p-3">
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="relative h-20 w-full">
            <Image
              src="/images/hero-education.jpg"
              alt="Students learning"
              fill
              className="object-cover"
            />
          </div>
          <div className="p-3">
            <div className="mb-1 flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-primary" />
              <h4 className="text-xs font-semibold text-foreground">學習資源</h4>
            </div>
            <p className="text-[11px] leading-relaxed text-muted-foreground">探索 AI 教育最佳實踐指南</p>
            <button className="mt-2.5 w-full rounded-lg bg-primary py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90">
              查看指南
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}
