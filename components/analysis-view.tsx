'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DimensionRadarChart } from './radar-chart'
import { GradeBadge } from './grade-badge'
import { mockSchools } from '@/mocks'
import { DIMENSION_LABELS, DIMENSION_DESCRIPTIONS, type School, type DimensionScores } from '@/lib/types'
import Image from 'next/image'
import {
  Brain,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Leaf,
} from 'lucide-react'

const DIMENSION_COLORS = [
  'bg-primary',
  'bg-chart-2',
  'bg-chart-3',
  'bg-chart-4',
  'bg-chart-5',
  'bg-chart-6',
  'bg-chart-7',
  'bg-chart-8',
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
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-5">
          <svg viewBox="0 0 400 400" className="h-full w-full">
            <circle cx="200" cy="200" r="150" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary" />
            <circle cx="200" cy="200" r="100" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary" />
            <circle cx="200" cy="200" r="50" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary" />
          </svg>
        </div>
        <div className="relative z-10 flex items-center gap-6 p-6">
          <div className="relative hidden h-20 w-20 overflow-hidden rounded-xl border border-border lg:block">
            <Image
              src="/images/data-insights.jpg"
              alt="Analysis"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <Leaf className="h-3 w-3" />
              智能分析引擎
            </div>
            <h2 className="text-xl font-semibold text-foreground">智能需求分析</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">基於 8 大維度的科學評分，深度分析學校 AI 教育發展需求</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border lg:col-span-1">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-base font-medium">選擇學校</CardTitle>
            <CardDescription>點擊查看詳細分析</CardDescription>
          </CardHeader>
          <CardContent className="max-h-[500px] space-y-1.5 overflow-y-auto p-3">
            {mockSchools.map((school) => (
              <button
                key={school.id}
                onClick={() => setSelectedSchool(school)}
                className={`flex w-full items-center justify-between rounded-lg border p-2.5 text-left transition-all ${
                  selectedSchool.id === school.id
                    ? 'border-primary bg-primary/5'
                    : 'border-transparent hover:border-border hover:bg-muted/50'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{school.name}</p>
                  <p className="text-xs text-muted-foreground">{school.district}</p>
                </div>
                <GradeBadge grade={school.maturityGrade} size="sm" />
              </button>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6 lg:col-span-2">
          <Card className="border-border">
            <CardHeader className="border-b border-border">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Brain className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-medium">{selectedSchool.name}</CardTitle>
                    <CardDescription>
                      {selectedSchool.district} · {selectedSchool.type} {selectedSchool.level}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">綜合評分</p>
                    <p className="text-2xl font-semibold text-foreground">
                      {selectedSchool.overallScore}
                    </p>
                  </div>
                  <GradeBadge grade={selectedSchool.maturityGrade} size="lg" showLabel />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary p-2">
                    <Zap className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">AI 分析建議</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {getGradeRecommendation(selectedSchool.maturityGrade)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-border">
              <CardHeader className="border-b border-border">
                <CardTitle className="text-base font-medium">8 維度雷達圖</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <DimensionRadarChart data={selectedSchool.dimensions} size="lg" />
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="border-b border-border">
                <CardTitle className="text-base font-medium">維度詳細評分</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5 pt-4">
                {Object.entries(selectedSchool.dimensions).map(([key, value], index) => (
                  <div key={key}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {DIMENSION_LABELS[key as keyof DimensionScores]}
                      </span>
                      <span
                        className={`font-medium ${
                          value >= 80
                            ? 'text-success'
                            : value >= 60
                              ? 'text-warning'
                              : 'text-destructive'
                        }`}
                      >
                        {value}
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full transition-all ${DIMENSION_COLORS[index]}`}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-border">
              <CardHeader className="border-b border-success/20 bg-success/5">
                <CardTitle className="flex items-center gap-2 text-base font-medium text-success">
                  <TrendingUp className="h-4 w-4" />
                  優勢領域
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-4">
                {strengths.length > 0 ? (
                  strengths.map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-start gap-2.5 rounded-lg border border-success/20 bg-success/5 p-2.5"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-success" />
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {DIMENSION_LABELS[key as keyof DimensionScores]}
                          <Badge className="ml-2 bg-success text-xs text-success-foreground">
                            {value}分
                          </Badge>
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {DIMENSION_DESCRIPTIONS[key as keyof DimensionScores]}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-sm text-muted-foreground">暫無突出優勢領域</p>
                )}
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="border-b border-warning/20 bg-warning/5">
                <CardTitle className="flex items-center gap-2 text-base font-medium text-warning">
                  <AlertTriangle className="h-4 w-4" />
                  待改進領域
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-4">
                {weaknesses.length > 0 ? (
                  weaknesses.map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-start gap-2.5 rounded-lg border border-warning/20 bg-warning/5 p-2.5"
                    >
                      <AlertTriangle className="mt-0.5 h-4 w-4 text-warning" />
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {DIMENSION_LABELS[key as keyof DimensionScores]}
                          <Badge className="ml-2 bg-warning text-xs text-white">
                            {value}分
                          </Badge>
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {DIMENSION_DESCRIPTIONS[key as keyof DimensionScores]}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-sm text-muted-foreground">所有維度表現良好</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" className="rounded-lg">
              下載分析報告
            </Button>
            <Button className="gap-2 rounded-lg">
              查看推薦方案
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
