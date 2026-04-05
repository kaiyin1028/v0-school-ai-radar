'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { mockSolutions, mockSchools } from '@/lib/mock-data'
import { DIMENSION_LABELS, type DimensionScores, type Solution, type School } from '@/lib/types'
import { GradeBadge } from './grade-badge'
import {
  Search,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Building,
  Users,
  BookOpen,
  Shield,
  Handshake,
  Lightbulb,
  Server,
  Brain,
} from 'lucide-react'

const CATEGORY_ICONS: Record<string, typeof BookOpen> = {
  課程發展: BookOpen,
  師資培訓: Users,
  基礎建設: Server,
  管理策略: Shield,
  合作夥伴: Handshake,
  創新實踐: Lightbulb,
}

export function SolutionsView() {
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const getRecommendedSolutions = (school: School): Solution[] => {
    const weakDimensions = Object.entries(school.dimensions)
      .filter(([, value]) => value < 70)
      .map(([key]) => key as keyof DimensionScores)

    return mockSolutions.filter((solution) => {
      const isRelevant = solution.targetDimensions.some((dim) => weakDimensions.includes(dim))
      const meetsGradeReq =
        solution.minGrade.charCodeAt(0) >= school.maturityGrade.charCodeAt(0)
      return isRelevant && meetsGradeReq
    })
  }

  const filteredSchools = mockSchools.filter(
    (school) =>
      school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.district.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">解決方案推薦</h2>
        <p className="mt-1 text-muted-foreground">基於學校需求智能推薦個性化解決方案</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border/50 bg-card/50 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">選擇學校</CardTitle>
            <CardDescription>選擇學校以獲取個性化方案推薦</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜索學校..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="max-h-96 space-y-2 overflow-y-auto">
              {filteredSchools.map((school) => (
                <button
                  key={school.id}
                  onClick={() => setSelectedSchool(school)}
                  className={`flex w-full items-center justify-between rounded-lg border p-3 text-left transition-colors ${
                    selectedSchool?.id === school.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border/50 hover:border-primary/50 hover:bg-muted/30'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">{school.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {school.district} · 評分 {school.overallScore}
                    </p>
                  </div>
                  <GradeBadge grade={school.maturityGrade} size="sm" />
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          {selectedSchool ? (
            <div className="space-y-4">
              <Card className="border-border/50 bg-card/50">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <Building className="h-5 w-5 text-primary" />
                        <h3 className="text-xl font-semibold text-foreground">
                          {selectedSchool.name}
                        </h3>
                        <GradeBadge grade={selectedSchool.maturityGrade} />
                      </div>
                      <p className="mt-2 text-muted-foreground">
                        {selectedSchool.district} · {selectedSchool.type} {selectedSchool.level}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">綜合評分</p>
                      <p className="text-3xl font-bold text-foreground">
                        {selectedSchool.overallScore}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                      <Brain className="h-4 w-4 text-primary" />
                      需要改進的維度
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(selectedSchool.dimensions)
                        .filter(([, value]) => value < 70)
                        .map(([key, value]) => (
                          <Badge
                            key={key}
                            variant="outline"
                            className="border-amber-400/30 bg-amber-400/10 text-amber-400"
                          >
                            {DIMENSION_LABELS[key as keyof DimensionScores]}: {value}分
                          </Badge>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">推薦解決方案</h3>
                <Badge variant="secondary">
                  {getRecommendedSolutions(selectedSchool).length} 個方案
                </Badge>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {getRecommendedSolutions(selectedSchool).map((solution) => {
                  const Icon = CATEGORY_ICONS[solution.category] || Lightbulb
                  return (
                    <Card
                      key={solution.id}
                      className="border-border/50 bg-card/50 transition-all hover:border-primary/50"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start gap-3">
                          <div className="rounded-lg bg-primary/10 p-2">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-base">{solution.name}</CardTitle>
                            <CardDescription className="mt-1">
                              {solution.provider}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">{solution.description}</p>

                        <div className="flex flex-wrap gap-1">
                          {solution.targetDimensions.map((dim) => (
                            <Badge key={dim} variant="secondary" className="text-xs">
                              {DIMENSION_LABELS[dim]}
                            </Badge>
                          ))}
                        </div>

                        <div className="space-y-1">
                          <p className="text-xs font-medium text-muted-foreground">主要功能</p>
                          <div className="grid grid-cols-2 gap-1">
                            {solution.features.map((feature) => (
                              <div key={feature} className="flex items-center gap-1 text-xs">
                                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                                <span className="text-foreground">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Button className="w-full gap-2" variant="outline">
                          了解詳情
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          ) : (
            <Card className="flex h-96 items-center justify-center border-border/50 bg-card/50">
              <div className="text-center">
                <Sparkles className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium text-foreground">選擇學校以開始</h3>
                <p className="mt-2 text-muted-foreground">
                  從左側選擇一所學校，系統將自動分析需求並推薦適合的解決方案
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
