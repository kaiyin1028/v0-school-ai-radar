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
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  analyzing: 'bg-blue-50 text-blue-700 border-blue-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  error: 'bg-red-50 text-red-700 border-red-200',
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
      className={`border-border transition-shadow hover:shadow-md ${
        selected ? 'ring-2 ring-primary ring-offset-2' : ''
      } ${onSelect ? 'cursor-pointer' : ''}`}
      onClick={() => onSelect?.(school)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-medium text-foreground">{school.name}</h3>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {school.district}
              </span>
              <span className="text-border">|</span>
              <span className="flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                {school.type}
              </span>
            </div>
          </div>
          <GradeBadge grade={school.maturityGrade} size="sm" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">綜合評分</span>
          </div>
          <span className="text-xl font-semibold text-foreground">
            {school.overallScore}
          </span>
        </div>

        <DimensionRadarChart data={school.dimensions} size="sm" showLabels={false} />

        <div className="flex items-center justify-between">
          <Badge variant="outline" className={`border text-xs ${STATUS_STYLES[school.status]}`}>
            {STATUS_LABELS[school.status]}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 text-xs text-muted-foreground hover:text-foreground"
            onClick={(e) => {
              e.stopPropagation()
              window.open(school.website, '_blank')
            }}
          >
            <ExternalLink className="h-3 w-3" />
            官網
          </Button>
        </div>

        <p className="text-[11px] text-muted-foreground">
          更新：{new Date(school.lastUpdated).toLocaleDateString('zh-HK')}
        </p>
      </CardContent>
    </Card>
  )
}
