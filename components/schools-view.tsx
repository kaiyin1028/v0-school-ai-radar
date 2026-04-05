'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { GradeBadge } from './grade-badge'
import { DimensionRadarChart } from './radar-chart'
import { mockSchools } from '@/lib/mock-data'
import { DIMENSION_LABELS, DIMENSION_DESCRIPTIONS, type School, type DimensionScores } from '@/lib/types'
import {
  Search,
  Filter,
  Plus,
  ExternalLink,
  MapPin,
  Building2,
  RefreshCw,
  X,
} from 'lucide-react'

export function SchoolsView() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null)
  const [filterGrade, setFilterGrade] = useState<string>('all')

  const filteredSchools = mockSchools.filter((school) => {
    const matchesSearch =
      school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.district.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesGrade = filterGrade === 'all' || school.maturityGrade === filterGrade
    return matchesSearch && matchesGrade
  })

  return (
    <div className="flex gap-6">
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">學校管理</h2>
            <p className="mt-1 text-muted-foreground">管理和分析學校 AI 教育需求</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            添加學校
          </Button>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="搜索學校名稱或地區..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'A', 'B', 'C', 'D'].map((grade) => (
              <Button
                key={grade}
                variant={filterGrade === grade ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterGrade(grade)}
                className="min-w-12"
              >
                {grade === 'all' ? '全部' : grade}
              </Button>
            ))}
          </div>
        </div>

        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      學校名稱
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      地區
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      類型
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                      成熟度
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                      評分
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                      狀態
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSchools.map((school) => (
                    <tr
                      key={school.id}
                      className={`border-b border-border/30 transition-colors hover:bg-muted/30 ${
                        selectedSchool?.id === school.id ? 'bg-muted/50' : ''
                      }`}
                      onClick={() => setSelectedSchool(school)}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{school.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {school.district}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Building2 className="h-3 w-3" />
                          {school.type} {school.level}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center">
                          <GradeBadge grade={school.maturityGrade} size="sm" />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-lg font-bold text-foreground">
                          {school.overallScore}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge
                          variant="outline"
                          className={
                            school.status === 'completed'
                              ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30'
                              : school.status === 'analyzing'
                                ? 'bg-blue-400/10 text-blue-400 border-blue-400/30'
                                : 'bg-amber-400/10 text-amber-400 border-amber-400/30'
                          }
                        >
                          {school.status === 'completed'
                            ? '已完成'
                            : school.status === 'analyzing'
                              ? '分析中'
                              : '待處理'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation()
                              window.open(school.website, '_blank')
                            }}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedSchool && (
        <Card className="w-96 shrink-0 border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle className="text-lg">{selectedSchool.name}</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                {selectedSchool.district} · {selectedSchool.type} {selectedSchool.level}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setSelectedSchool(null)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">成熟度等級</p>
                <div className="mt-1">
                  <GradeBadge grade={selectedSchool.maturityGrade} size="lg" showLabel />
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">綜合評分</p>
                <p className="mt-1 text-4xl font-bold text-foreground">
                  {selectedSchool.overallScore}
                </p>
              </div>
            </div>

            <div>
              <h4 className="mb-3 text-sm font-medium text-foreground">8 維度雷達圖</h4>
              <DimensionRadarChart data={selectedSchool.dimensions} size="md" />
            </div>

            <div>
              <h4 className="mb-3 text-sm font-medium text-foreground">維度詳情</h4>
              <div className="space-y-2">
                {Object.entries(selectedSchool.dimensions).map(([key, value]) => (
                  <div key={key} className="group">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {DIMENSION_LABELS[key as keyof DimensionScores]}
                      </span>
                      <span className="text-sm font-medium text-foreground">{value}</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                    <p className="mt-1 hidden text-xs text-muted-foreground group-hover:block">
                      {DIMENSION_DESCRIPTIONS[key as keyof DimensionScores]}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1">生成報告</Button>
              <Button variant="outline" className="flex-1">
                推薦方案
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
