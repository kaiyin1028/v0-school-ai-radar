'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DimensionRadarChart } from './radar-chart'
import { GradeBadge } from './grade-badge'
import { mockSchools } from '@/lib/mock-data'
import { DIMENSION_LABELS, DIMENSION_DESCRIPTIONS, type School, type DimensionScores } from '@/lib/types'
import Image from 'next/image'
import {
  Brain,
  Zap,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  BarChart3,
  Sparkles,
} from 'lucide-react'

const DIMENSION_COLORS = [
  'from-violet-500 to-purple-500',
  'from-pink-500 to-rose-500',
  'from-cyan-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-lime-500 to-green-500',
  'from-blue-500 to-indigo-500',
  'from-red-500 to-rose-500',
  'from-emerald-500 to-green-500',
]

export function AnalysisView() {
  const [selectedSchool, setSelectedSchool] = useState<School>(mockSchools[4])

  const getStrengths = (dimensions: DimensionScores) => {
    return Object.entries(dimensions)
      .filter(([, value]) => value >= 70)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
  }

  const getWeaknesses = (dimensions: DimensionScores) => {
    return Object.entries(dimensions)
      .filter(([, value]) => value < 70)
      .sort((a, b) => a[1] - b[1])
      .slice(0, 3)
  }

  const strengths = getStrengths(selectedSchool.dimensions)
  const weaknesses = getWeaknesses(selectedSchool.dimensions)

  const getGradeRecommendation = (grade: string) => {
    switch (grade) {
      case 'A':
        return '持續領先，可作為標杆學校分享經驗'
      case 'B':
        return '發展良好，建議加強薄弱維度突破瓶頸'
      case 'C':
        return '有發展空間，建議制定系統性提升計劃'
      case 'D':
        return '需要重點支援，建議從基礎設施和師資培訓開始'
      default:
        return ''
    }
  }

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 p-8 text-white shadow-2xl">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-10 left-20 h-40 w-40 rounded-full bg-emerald-300/20 blur-2xl" />
        <div className="relative z-10 flex items-center gap-6">
          <div className="relative hidden h-24 w-24 overflow-hidden rounded-2xl shadow-xl ring-4 ring-white/20 lg:block">
            <Image
              src="/images/data-analysis.jpg"
              alt="Analysis"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-sm font-medium backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              智能分析引擎
            </div>
            <h2 className="text-2xl font-bold">智能需求分析</h2>
            <p className="mt-1 text-white/90">基於 8 大維度的科學評分，深度分析學校 AI 教育發展需求</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="overflow-hidden border-0 shadow-lg lg:col-span-1">
          <CardHeader className="border-b bg-gradient-to-r from-violet-50 via-purple-50 to-pink-50">
            <CardTitle className="flex items-center gap-2 text-lg">
              <span className="h-3 w-3 rounded-full bg-gradient-to-r from-violet-500 to-purple-500" />
              選擇學校
            </CardTitle>
            <CardDescription>點擊查看詳細分析</CardDescription>
          </CardHeader>
          <CardContent className="max-h-[500px] space-y-2 overflow-y-auto p-4">
            {mockSchools.map((school) => (
              <button
                key={school.id}
                onClick={() => setSelectedSchool(school)}
                className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition-all ${
                  selectedSchool.id === school.id
                    ? 'border-violet-300 bg-gradient-to-r from-violet-50 to-purple-50 shadow-md'
                    : 'border-transparent bg-gray-50 hover:border-violet-200 hover:bg-gradient-to-r hover:from-violet-50/50 hover:to-purple-50/50'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-foreground">{school.name}</p>
                  <p className="text-xs text-muted-foreground">{school.district}</p>
                </div>
                <GradeBadge grade={school.maturityGrade} size="sm" />
              </button>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6 lg:col-span-2">
          <Card className="overflow-hidden border-0 shadow-lg">
            <CardHeader className="border-b bg-gradient-to-r from-cyan-50 via-teal-50 to-emerald-50">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <div className="rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 p-2">
                      <Brain className="h-5 w-5 text-white" />
                    </div>
                    {selectedSchool.name}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {selectedSchool.district} · {selectedSchool.type} {selectedSchool.level}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">綜合評分</p>
                    <p className="bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-3xl font-bold text-transparent">
                      {selectedSchool.overallScore}
                    </p>
                  </div>
                  <GradeBadge grade={selectedSchool.maturityGrade} size="lg" showLabel />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="rounded-2xl bg-gradient-to-r from-violet-100 via-purple-50 to-pink-100 p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 p-2.5 shadow-lg shadow-violet-500/30">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">AI 分析建議</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {getGradeRecommendation(selectedSchool.maturityGrade)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="overflow-hidden border-0 shadow-lg">
              <CardHeader className="border-b bg-gradient-to-r from-pink-50 via-rose-50 to-red-50">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="h-3 w-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500" />
                  8 維度雷達圖
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <DimensionRadarChart data={selectedSchool.dimensions} size="lg" />
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-0 shadow-lg">
              <CardHeader className="border-b bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="h-3 w-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500" />
                  維度詳細評分
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                {Object.entries(selectedSchool.dimensions).map(([key, value], index) => (
                  <div key={key}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">
                        {DIMENSION_LABELS[key as keyof DimensionScores]}
                      </span>
                      <span
                        className={`font-bold ${
                          value >= 80
                            ? 'text-emerald-600'
                            : value >= 60
                              ? 'text-amber-600'
                              : 'text-rose-600'
                        }`}
                      >
                        {value}
                      </span>
                    </div>
                    <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r transition-all ${DIMENSION_COLORS[index]}`}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="overflow-hidden border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-emerald-100 via-green-100 to-teal-100">
                <CardTitle className="flex items-center gap-2 text-lg text-emerald-700">
                  <TrendingUp className="h-5 w-5" />
                  優勢領域
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                {strengths.length > 0 ? (
                  strengths.map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-start gap-3 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 p-3"
                    >
                      <div className="rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 p-1.5">
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          {DIMENSION_LABELS[key as keyof DimensionScores]}
                          <Badge className="ml-2 border-0 bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-sm">
                            {value}分
                          </Badge>
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {DIMENSION_DESCRIPTIONS[key as keyof DimensionScores]}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground">暫無突出優勢領域</p>
                )}
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-amber-100 via-orange-100 to-yellow-100">
                <CardTitle className="flex items-center gap-2 text-lg text-amber-700">
                  <AlertTriangle className="h-5 w-5" />
                  待改進領域
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                {weaknesses.length > 0 ? (
                  weaknesses.map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-start gap-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 p-3"
                    >
                      <div className="rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 p-1.5">
                        <AlertTriangle className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          {DIMENSION_LABELS[key as keyof DimensionScores]}
                          <Badge className="ml-2 border-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm">
                            {value}分
                          </Badge>
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {DIMENSION_DESCRIPTIONS[key as keyof DimensionScores]}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground">所有維度表現良好</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" className="rounded-xl border-2 shadow-sm">
              下載分析報告
            </Button>
            <Button className="gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 shadow-lg shadow-violet-500/30 transition-all hover:shadow-xl">
              查看推薦方案
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
