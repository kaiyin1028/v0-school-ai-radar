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
  color?: 'primary' | 'info' | 'warning' | 'success'
  className?: string
}

const colorStyles = {
  primary: {
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
  },
  info: {
    iconBg: 'bg-info/10',
    iconColor: 'text-info',
  },
  warning: {
    iconBg: 'bg-warning/10',
    iconColor: 'text-warning',
  },
  success: {
    iconBg: 'bg-success/10',
    iconColor: 'text-success',
  },
}

export function StatCard({ title, value, subtitle, icon: Icon, trend, color = 'primary', className }: StatCardProps) {
  const styles = colorStyles[color]
  
  return (
    <Card className={cn('border-border transition-shadow hover:shadow-md', className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-semibold text-foreground">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
            {trend && (
              <div className="flex items-center gap-1.5 pt-1">
                <span
                  className={cn(
                    'flex items-center gap-0.5 text-xs font-medium',
                    trend.isPositive ? 'text-success' : 'text-destructive'
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
                <span className="text-xs text-muted-foreground">較上月</span>
              </div>
            )}
          </div>
          <div className={cn('rounded-lg p-2.5', styles.iconBg)}>
            <Icon className={cn('h-5 w-5', styles.iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
