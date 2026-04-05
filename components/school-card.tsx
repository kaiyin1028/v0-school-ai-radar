'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { GradeBadge } from './grade-badge'
import { DimensionRadarChart } from './radar-chart'
import type { School } from '@/lib/types'
import { ExternalLink, MapPin, Building2, BarChart3 } from 'lucide-react'

interface SchoolCardProps {
  school: School
  onSelect?: (school: School) => void
  selected?: boolean
}

const STATUS_STYLES = {
  pending: 'bg-amber-400/10 text-amber-400 border-amber-400/30',
  analyzing: 'bg-blue-400/10 text-blue-400 border-blue-400/30',
  completed: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30',
  error: 'bg-red-400/10 text-red-400 border-red-400/30',
}

const STATUS_LABELS = {
  pending: '待處理',
  analyzing: '分析中',
  completed: '已完成',
  error: '錯誤',
}

export function SchoolCard({ school, onSelect, selected }: SchoolCardProps) {
  return (
    <Card
      className={`border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/50 ${
        selected ? 'border-primary ring-1 ring-primary/20' : ''
      } ${onSelect ? 'cursor-pointer' : ''}`}
      onClick={() => onSelect?.(school)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-foreground">{school.name}</h3>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {school.district}
              </span>
              <span className="flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                {school.type} {school.level}
              </span>
            </div>
          </div>
          <GradeBadge grade={school.maturityGrade} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">綜合評分</span>
          </div>
          <span className="text-2xl font-bold text-foreground">{school.overallScore}</span>
        </div>

        <DimensionRadarChart data={school.dimensions} size="sm" showLabels={false} />

        <div className="flex items-center justify-between">
          <Badge variant="outline" className={STATUS_STYLES[school.status]}>
            {STATUS_LABELS[school.status]}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1 text-xs"
            onClick={(e) => {
              e.stopPropagation()
              window.open(school.website, '_blank')
            }}
          >
            <ExternalLink className="h-3 w-3" />
            訪問官網
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          最後更新：{new Date(school.lastUpdated).toLocaleDateString('zh-HK')}
        </p>
      </CardContent>
    </Card>
  )
}
