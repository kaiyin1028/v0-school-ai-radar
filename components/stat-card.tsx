'use client'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: 'primary' | 'pink' | 'cyan' | 'lime' | 'warning' | 'success'
  className?: string
}

const colorStyles = {
  primary: {
    bg: 'bg-gradient-to-br from-violet-500 to-purple-600',
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-600',
  },
  pink: {
    bg: 'bg-gradient-to-br from-pink-500 to-rose-500',
    iconBg: 'bg-pink-100',
    iconColor: 'text-pink-600',
  },
  cyan: {
    bg: 'bg-gradient-to-br from-cyan-500 to-teal-500',
    iconBg: 'bg-cyan-100',
    iconColor: 'text-cyan-600',
  },
  lime: {
    bg: 'bg-gradient-to-br from-lime-500 to-green-500',
    iconBg: 'bg-lime-100',
    iconColor: 'text-lime-600',
  },
  warning: {
    bg: 'bg-gradient-to-br from-amber-500 to-orange-500',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
  },
  success: {
    bg: 'bg-gradient-to-br from-emerald-500 to-green-600',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
  },
}

export function StatCard({ title, value, subtitle, icon: Icon, trend, color = 'primary', className }: StatCardProps) {
  const styles = colorStyles[color]
  
  return (
    <Card className={cn('group relative overflow-hidden border-0 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl', className)}>
      <div className={cn('absolute inset-0 opacity-90', styles.bg)} />
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-xl" />
      <div className="absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-white/10 blur-lg" />
      <CardContent className="relative p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-white/80">{title}</p>
            <p className="text-3xl font-bold text-white">{value}</p>
            {subtitle && <p className="text-xs text-white/70">{subtitle}</p>}
            {trend && (
              <div className="flex items-center gap-1.5 pt-1">
                <span
                  className={cn(
                    'flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold',
                    trend.isPositive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-red-400/30 text-white'
                  )}
                >
                  {trend.isPositive ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {trend.isPositive ? '+' : ''}
                  {trend.value}%
                </span>
                <span className="text-xs text-white/70">較上月</span>
              </div>
            )}
          </div>
          <div className="rounded-2xl bg-white/20 p-3 backdrop-blur-sm">
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
