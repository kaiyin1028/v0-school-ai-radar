'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { mockSolutions, mockSchools } from '@/mocks'
import { DIMENSION_LABELS, type DimensionScores, type Solution, type School } from '@/lib/types'
import { GradeBadge } from './grade-badge'
import Image from 'next/image'
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
  Leaf,
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
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-5">
          <svg viewBox="0 0 100 100" className="h-full w-full">
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary" />
            </pattern>
            <rect fill="url(#grid)" width="100%" height="100%" />
          </svg>
        </div>
        <div className="relative z-10 flex items-center gap-6 p-6">
          <div className="relative hidden h-20 w-20 overflow-hidden rounded-xl border border-border lg:block">
            <Image
              src="/images/ai-assistant.jpg"
              alt="Solutions"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <Leaf className="h-3 w-3" />
              智能推薦引擎
            </div>
            <h2 className="text-xl font-semibold text-foreground">解決方案推薦</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">基於學校需求智能推薦個性化解決方案</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border lg:col-span-1">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-base font-medium">選擇學校</CardTitle>
            <CardDescription>選擇學校以獲取個性化方案推薦</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜索學校..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="max-h-96 space-y-1.5 overflow-y-auto">
              {filteredSchools.map((school) => (
                <button
                  key={school.id}
                  onClick={() => setSelectedSchool(school)}
                  className={`flex w-full items-center justify-between rounded-lg border p-2.5 text-left transition-all ${
                    selectedSchool?.id === school.id
                      ? 'border-primary bg-primary/5'
                      : 'border-transparent hover:border-border hover:bg-muted/50'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{school.name}</p>
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
              <Card className="border-border">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Building className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{selectedSchool.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedSchool.district} · {selectedSchool.type}
                        </p>
                      </div>
                      <GradeBadge grade={selectedSchool.maturityGrade} size="sm" />
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">綜合評分</p>
                      <p className="text-2xl font-semibold text-foreground">{selectedSchool.overallScore}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      <Brain className="h-3.5 w-3.5" />
                      需要改進的維度
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {Object.entries(selectedSchool.dimensions)
                        .filter(([, value]) => value < 70)
                        .map(([key, value]) => (
                          <Badge key={key} variant="outline" className="text-xs">
                            {DIMENSION_LABELS[key as keyof DimensionScores]}: {value}分
                          </Badge>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <h3 className="text-base font-medium text-foreground">推薦解決方案</h3>
                <Badge variant="secondary" className="text-xs">
                  {getRecommendedSolutions(selectedSchool).length} 個方案
                </Badge>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {getRecommendedSolutions(selectedSchool).map((solution) => {
                  const Icon = CATEGORY_ICONS[solution.category] || Lightbulb
                  return (
                    <Card key={solution.id} className="border-border transition-shadow hover:shadow-md">
                      <CardHeader className="pb-3">
                        <div className="flex items-start gap-3">
                          <div className="rounded-lg bg-primary/10 p-2">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-sm font-medium">{solution.name}</CardTitle>
                            <CardDescription className="text-xs">{solution.provider}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3 pt-0">
                        <p className="text-xs text-muted-foreground">{solution.description}</p>

                        <div className="flex flex-wrap gap-1">
                          {solution.targetDimensions.map((dim) => (
                            <Badge key={dim} variant="outline" className="text-[10px]">
                              {DIMENSION_LABELS[dim]}
                            </Badge>
                          ))}
                        </div>

                        <div className="space-y-1">
                          <p className="text-[10px] font-medium text-muted-foreground">主要功能</p>
                          <div className="grid grid-cols-2 gap-0.5">
                            {solution.features.map((feature) => (
                              <div key={feature} className="flex items-center gap-1 text-[10px]">
                                <CheckCircle2 className="h-2.5 w-2.5 text-success" />
                                <span className="text-foreground">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Button size="sm" className="w-full gap-1.5 text-xs">
                          了解詳情
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          ) : (
            <Card className="flex h-80 items-center justify-center border-border bg-muted/30">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mt-4 font-medium text-foreground">選擇學校以開始</h3>
                <p className="mx-auto mt-1.5 max-w-xs text-sm text-muted-foreground">
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
