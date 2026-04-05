'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DimensionRadarChart } from './radar-chart'
import { GradeBadge } from './grade-badge'
import { mockSchools } from '@/lib/mock-data'
import { DIMENSION_LABELS, DIMENSION_DESCRIPTIONS, type School, type DimensionScores } from '@/lib/types'
import {
  Brain,
  Zap,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  BarChart3,
} from 'lucide-react'

export function AnalysisView() {
  const [selectedSchool, setSelectedSchool] = useState<School>(mockSchools[4]) // Start with a C-grade school

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
      <div>
        <h2 className="text-2xl font-bold text-foreground">智能需求分析</h2>
        <p className="mt-1 text-muted-foreground">基於 8 大維度的科學評分與深度分析</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border/50 bg-card/50 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">選擇學校</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {mockSchools.map((school) => (
              <button
                key={school.id}
                onClick={() => setSelectedSchool(school)}
                className={`flex w-full items-center justify-between rounded-lg border p-3 text-left transition-colors ${
                  selectedSchool.id === school.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border/50 hover:border-primary/50 hover:bg-muted/30'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-foreground">{school.name}</p>
                  <p className="text-xs text-muted-foreground">{school.district}</p>
                </div>
                <GradeBadge grade={school.maturityGrade} size="sm" />
              </button>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6 lg:col-span-2">
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    {selectedSchool.name}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {selectedSchool.district} · {selectedSchool.type} {selectedSchool.level}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">綜合評分</p>
                    <p className="text-3xl font-bold text-foreground">{selectedSchool.overallScore}</p>
                  </div>
                  <GradeBadge grade={selectedSchool.maturityGrade} size="lg" showLabel />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-muted/30 p-4">
                <div className="flex items-start gap-3">
                  <Zap className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">AI 分析建議</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {getGradeRecommendation(selectedSchool.maturityGrade)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  8 維度雷達圖
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DimensionRadarChart data={selectedSchool.dimensions} size="lg" />
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="h-5 w-5 text-primary" />
                  維度詳細評分
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(selectedSchool.dimensions).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {DIMENSION_LABELS[key as keyof DimensionScores]}
                      </span>
                      <span
                        className={`font-medium ${
                          value >= 80
                            ? 'text-emerald-400'
                            : value >= 60
                              ? 'text-amber-400'
                              : 'text-red-400'
                        }`}
                      >
                        {value}
                      </span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full transition-all ${
                          value >= 80
                            ? 'bg-emerald-400'
                            : value >= 60
                              ? 'bg-amber-400'
                              : 'bg-red-400'
                        }`}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-emerald-400" />
                  優勢領域
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {strengths.length > 0 ? (
                  strengths.map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-start gap-3 rounded-lg bg-emerald-400/5 p-3"
                    >
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                      <div>
                        <p className="font-medium text-foreground">
                          {DIMENSION_LABELS[key as keyof DimensionScores]}
                          <Badge variant="secondary" className="ml-2">
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

            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <AlertTriangle className="h-5 w-5 text-amber-400" />
                  待改進領域
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {weaknesses.length > 0 ? (
                  weaknesses.map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-start gap-3 rounded-lg bg-amber-400/5 p-3"
                    >
                      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
                      <div>
                        <p className="font-medium text-foreground">
                          {DIMENSION_LABELS[key as keyof DimensionScores]}
                          <Badge
                            variant="secondary"
                            className="ml-2 bg-amber-400/10 text-amber-400"
                          >
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
            <Button variant="outline">下載分析報告</Button>
            <Button className="gap-2">
              查看推薦方案
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
