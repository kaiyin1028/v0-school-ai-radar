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
  Star,
} from 'lucide-react'

interface NavItem {
  icon: LucideIcon
  label: string
  value: string
  badge?: number
  color?: string
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: '總覽儀表板', value: 'dashboard', color: 'from-violet-500 to-purple-500' },
  { icon: School, label: '學校管理', value: 'schools', badge: 8, color: 'from-pink-500 to-rose-500' },
  { icon: Search, label: '需求分析', value: 'analysis', color: 'from-cyan-500 to-teal-500' },
  { icon: Lightbulb, label: '方案推薦', value: 'solutions', color: 'from-amber-500 to-orange-500' },
  { icon: Workflow, label: '工作流程', value: 'workflow', badge: 4, color: 'from-lime-500 to-green-500' },
  { icon: Globe, label: '數據抓取', value: 'scraping', color: 'from-blue-500 to-indigo-500' },
  { icon: Settings, label: '系統設置', value: 'settings', color: 'from-gray-500 to-slate-500' },
]

interface SidebarNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function SidebarNav({ activeTab, onTabChange }: SidebarNavProps) {
  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-border/50 bg-white shadow-xl">
      <div className="flex h-20 items-center gap-3 border-b border-border/50 px-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/30">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text font-bold text-transparent">AI 教育雷達</h1>
          <p className="text-xs text-muted-foreground">全港學校分析平台</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        <p className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
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
                  ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                  : 'text-muted-foreground hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span
                  className={cn(
                    'flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold',
                    isActive
                      ? 'bg-white/25 text-white'
                      : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white'
                  )}
                >
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}

        <p className="mb-3 mt-6 px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
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
                  ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                  : 'text-muted-foreground hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span
                  className={cn(
                    'flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold',
                    isActive
                      ? 'bg-white/25 text-white'
                      : 'bg-gradient-to-r from-lime-500 to-green-500 text-white'
                  )}
                >
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      <div className="border-t border-border/50 p-4">
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-violet-100 via-purple-50 to-pink-100 shadow-inner">
          <div className="relative h-24 w-full">
            <Image
              src="/images/students-learning.jpg"
              alt="Students learning with AI"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
          </div>
          <div className="p-4 pt-0">
            <div className="mb-1 flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            </div>
            <h4 className="text-sm font-bold text-foreground">培育未來人才</h4>
            <p className="mt-1 text-xs text-muted-foreground">了解如何運用 AI 提升教學質素</p>
            <button className="mt-3 w-full rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-500/30 transition-all hover:shadow-xl">
              查看指南
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}
