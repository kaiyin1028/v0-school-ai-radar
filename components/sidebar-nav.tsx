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
  Sparkles,
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
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-border bg-card shadow-sm">
      <div className="flex h-20 items-center gap-3 border-b border-border px-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-md">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-foreground">AI 教育雷達</h1>
          <p className="text-xs text-muted-foreground">全港學校分析平台</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
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
                'flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span
                  className={cn(
                    'flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold',
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-accent text-accent-foreground'
                  )}
                >
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}

        <p className="mb-3 mt-6 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
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
                'flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span
                  className={cn(
                    'flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold',
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-accent text-accent-foreground'
                  )}
                >
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      <div className="border-t border-border p-4">
        <div className="overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 to-accent/10">
          <div className="relative h-24 w-full">
            <Image
              src="/images/students-learning.jpg"
              alt="Students learning with AI"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/90 to-transparent" />
          </div>
          <div className="p-4 pt-0">
            <h4 className="text-sm font-semibold text-foreground">培育未來人才</h4>
            <p className="mt-1 text-xs text-muted-foreground">了解如何運用 AI 提升教學質素</p>
            <button className="mt-3 w-full rounded-lg bg-primary py-2 text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md">
              查看指南
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}
