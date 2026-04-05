'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { mockSolutions, mockSchools } from '@/lib/mock-data'
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
  Star,
} from 'lucide-react'

const CATEGORY_ICONS: Record<string, typeof BookOpen> = {
  課程發展: BookOpen,
  師資培訓: Users,
  基礎建設: Server,
  管理策略: Shield,
  合作夥伴: Handshake,
  創新實踐: Lightbulb,
}

const CATEGORY_COLORS: Record<string, string> = {
  課程發展: 'from-violet-500 to-purple-500',
  師資培訓: 'from-pink-500 to-rose-500',
  基礎建設: 'from-cyan-500 to-teal-500',
  管理策略: 'from-amber-500 to-orange-500',
  合作夥伴: 'from-lime-500 to-green-500',
  創新實踐: 'from-blue-500 to-indigo-500',
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
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-8 text-white shadow-2xl">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-10 left-20 h-40 w-40 rounded-full bg-yellow-300/20 blur-2xl" />
        <div className="absolute right-1/4 top-1/2 h-32 w-32 rounded-full bg-red-300/20 blur-xl" />
        <div className="relative z-10 flex items-center gap-6">
          <div className="relative hidden h-24 w-24 overflow-hidden rounded-2xl shadow-xl ring-4 ring-white/20 lg:block">
            <Image
              src="/images/ai-education.jpg"
              alt="Solutions"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-sm font-medium backdrop-blur-sm">
              <Lightbulb className="h-4 w-4" />
              智能推薦引擎
            </div>
            <h2 className="text-2xl font-bold">解決方案推薦</h2>
            <p className="mt-1 text-white/90">基於學校需求智能推薦個性化解決方案</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="overflow-hidden border-0 shadow-lg lg:col-span-1">
          <CardHeader className="border-b bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50">
            <CardTitle className="flex items-center gap-2 text-lg">
              <span className="h-3 w-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500" />
              選擇學校
            </CardTitle>
            <CardDescription>選擇學校以獲取個性化方案推薦</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜索學校..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-xl border-2 border-amber-100 bg-amber-50/50 pl-10 focus:border-amber-300"
              />
            </div>

            <div className="max-h-96 space-y-2 overflow-y-auto">
              {filteredSchools.map((school) => (
                <button
                  key={school.id}
                  onClick={() => setSelectedSchool(school)}
                  className={`flex w-full items-center justify-between rounded-xl border-2 p-3 text-left transition-all ${
                    selectedSchool?.id === school.id
                      ? 'border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 shadow-md'
                      : 'border-transparent bg-gray-50 hover:border-amber-200 hover:bg-gradient-to-r hover:from-amber-50/50 hover:to-orange-50/50'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-foreground">{school.name}</p>
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
              <Card className="overflow-hidden border-0 shadow-lg">
                <CardContent className="bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 p-2.5 shadow-lg shadow-amber-500/30">
                          <Building className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">
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
                      <p className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-3xl font-bold text-transparent">
                        {selectedSchool.overallScore}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                      <Brain className="h-4 w-4 text-amber-600" />
                      需要改進的維度
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(selectedSchool.dimensions)
                        .filter(([, value]) => value < 70)
                        .map(([key, value]) => (
                          <Badge
                            key={key}
                            className="border-0 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700"
                          >
                            {DIMENSION_LABELS[key as keyof DimensionScores]}: {value}分
                          </Badge>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 p-1.5">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-lg font-bold text-foreground">推薦解決方案</h3>
                <Badge className="border-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm">
                  {getRecommendedSolutions(selectedSchool).length} 個方案
                </Badge>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {getRecommendedSolutions(selectedSchool).map((solution) => {
                  const Icon = CATEGORY_ICONS[solution.category] || Lightbulb
                  const colorClass = CATEGORY_COLORS[solution.category] || 'from-violet-500 to-purple-500'
                  return (
                    <Card
                      key={solution.id}
                      className="group overflow-hidden border-0 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
                    >
                      <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white pb-3">
                        <div className="flex items-start gap-3">
                          <div className={`rounded-xl bg-gradient-to-br ${colorClass} p-2.5 shadow-lg`}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-base">{solution.name}</CardTitle>
                            <CardDescription className="mt-1 flex items-center gap-1">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                              {solution.provider}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4 pt-4">
                        <p className="text-sm text-muted-foreground">{solution.description}</p>

                        <div className="flex flex-wrap gap-1">
                          {solution.targetDimensions.map((dim, idx) => (
                            <Badge 
                              key={dim} 
                              className={`border-0 bg-gradient-to-r text-white text-xs ${CATEGORY_COLORS[Object.keys(CATEGORY_COLORS)[idx % Object.keys(CATEGORY_COLORS).length]]}`}
                            >
                              {DIMENSION_LABELS[dim]}
                            </Badge>
                          ))}
                        </div>

                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-muted-foreground">主要功能</p>
                          <div className="grid grid-cols-2 gap-1">
                            {solution.features.map((feature) => (
                              <div key={feature} className="flex items-center gap-1 text-xs">
                                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                                <span className="text-foreground">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Button className={`w-full gap-2 rounded-xl bg-gradient-to-r ${colorClass} shadow-lg transition-all hover:shadow-xl`}>
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
            <Card className="flex h-96 items-center justify-center border-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 shadow-lg">
              <div className="text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/30">
                  <Sparkles className="h-10 w-10 text-white" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-foreground">選擇學校以開始</h3>
                <p className="mx-auto mt-2 max-w-sm text-muted-foreground">
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
