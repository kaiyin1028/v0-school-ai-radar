'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { GradeBadge } from './grade-badge'
import { DimensionRadarChart } from './radar-chart'
import type { School } from '@/lib/types'
import { ExternalLink, MapPin, Building2, BarChart3, Sparkles } from 'lucide-react'

interface SchoolCardProps {
  school: School
  onSelect?: (school: School) => void
  selected?: boolean
}

const STATUS_STYLES = {
  pending: 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border-amber-200',
  analyzing: 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-blue-200',
  completed: 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border-emerald-200',
  error: 'bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border-red-200',
}

const STATUS_LABELS = {
  pending: '待處理',
  analyzing: '分析中',
  completed: '已完成',
  error: '錯誤',
}

const CARD_GRADIENTS = [
  'from-violet-500/10 via-purple-500/5 to-transparent',
  'from-pink-500/10 via-rose-500/5 to-transparent',
  'from-cyan-500/10 via-teal-500/5 to-transparent',
  'from-amber-500/10 via-orange-500/5 to-transparent',
]

export function SchoolCard({ school, onSelect, selected }: SchoolCardProps) {
  const gradientIndex = school.id.charCodeAt(0) % CARD_GRADIENTS.length

  return (
    <Card
      className={`group overflow-hidden border-0 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl ${
        selected ? 'ring-2 ring-violet-500 ring-offset-2' : ''
      } ${onSelect ? 'cursor-pointer' : ''}`}
      onClick={() => onSelect?.(school)}
    >
      <CardHeader className={`bg-gradient-to-br ${CARD_GRADIENTS[gradientIndex]} pb-3`}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-bold text-foreground">{school.name}</h3>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
              <span className="flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 text-xs font-medium text-muted-foreground shadow-sm">
                <MapPin className="h-3 w-3 text-pink-500" />
                {school.district}
              </span>
              <span className="flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 text-xs font-medium text-muted-foreground shadow-sm">
                <Building2 className="h-3 w-3 text-cyan-500" />
                {school.type}
              </span>
            </div>
          </div>
          <GradeBadge grade={school.maturityGrade} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-violet-100 via-purple-50 to-pink-100 p-4">
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 p-2">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">綜合評分</span>
          </div>
          <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
            {school.overallScore}
          </span>
        </div>

        <DimensionRadarChart data={school.dimensions} size="sm" showLabels={false} />

        <div className="flex items-center justify-between">
          <Badge variant="outline" className={`border-0 shadow-sm ${STATUS_STYLES[school.status]}`}>
            <Sparkles className="mr-1 h-3 w-3" />
            {STATUS_LABELS[school.status]}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1 rounded-lg bg-gradient-to-r from-violet-500/10 to-purple-500/10 text-xs font-medium text-violet-700 hover:from-violet-500/20 hover:to-purple-500/20"
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
