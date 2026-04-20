'use client'

import { StatCard } from './stat-card'
import { SchoolCard } from './school-card'
import { GradeBadge } from './grade-badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingState, SkeletonStats, SkeletonCard, ErrorState, EmptyState } from '@/components/ui/states'
import { schoolsService, type DashboardStats } from '@/services'
import { useAsync } from '@/hooks/use-async'
import { School, GraduationCap, TrendingUp, Target, ArrowRight, Leaf } from 'lucide-react'
import Image from 'next/image'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from 'recharts'

const GRADE_COLORS_HEX = {
  A: '#22c55e',
  B: '#3b82f6',
  C: '#f59e0b',
  D: '#ef4444',
}

const BAR_COLORS = ['#3d8b6e', '#5fa88a', '#81c4a6', '#a3e0c2', '#c5fcde', '#6b9080']

export function DashboardView() {
  const { 
    data: stats, 
    isLoading, 
    error, 
    execute: loadStats,
    retry 
  } = useAsync<DashboardStats>(
    async () => {
      const response = await schoolsService.getDashboardStats()
      return response.data
    },
    { immediate: true }
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-56 rounded-2xl bg-muted animate-pulse" />
        <SkeletonStats count={4} />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 h-80 rounded-xl bg-muted animate-pulse" />
          <div className="h-80 rounded-xl bg-muted animate-pulse" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <ErrorState
        title="無法載入儀表板數據"
        message={error.message || '請檢查網絡連接後重試'}
        errorCode={(error as { code?: string }).code}
        onRetry={retry}
      />
    )
  }

  if (!stats) {
    return (
      <EmptyState
        title="暫無數據"
        message="目前沒有可顯示的儀表板數據"
        action={{
          label: '重新載入',
          onClick: () => loadStats(),
        }}
      />
    )
  }

  const topSchools = stats.recentlyUpdated?.slice(0, 4) || []
  const topDistricts = stats.districtStats?.slice(0, 6) || []
  const gradeDistribution = stats.gradeDistribution || []

  return (
    <div className="space-y-6">
      {/* Hero Section - Clean & Minimal */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
        <div className="absolute right-0 top-0 h-full w-1/2 opacity-10">
          <svg viewBox="0 0 400 400" className="h-full w-full">
            <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="currentColor" className="text-primary" />
            </pattern>
            <rect fill="url(#dots)" width="100%" height="100%" />
          </svg>
        </div>
        <div className="relative z-10 flex items-center gap-8 p-8">
          <div className="flex-1">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <Leaf className="h-3 w-3" />
              AI 教育分析平台
            </div>
            <h2 className="mb-2 text-3xl font-semibold text-foreground">
              全港學校 AI 教育需求雷達
            </h2>
            <p className="mb-5 max-w-lg text-muted-foreground">
              智能分析香港學校的 AI 教育發展需求，助您精準定位、科學規劃教育資源配置
            </p>
            <div className="flex items-center gap-3">
              <button className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                開始分析
              </button>
              <button className="rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent">
                了解更多
              </button>
            </div>
          </div>
          <div className="relative hidden h-44 w-64 overflow-hidden rounded-xl border border-border lg:block">
            <Image
              src="/images/hero-education.jpg"
              alt="AI Education"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="已分析學校"
          value={String(stats.totalSchools)}
          subtitle={`全港學校覆蓋率 ${Math.round((stats.analyzedSchools / stats.totalSchools) * 100)}%`}
          icon={School}
          color="primary"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="平均成熟度"
          value={String(stats.averageScore)}
          subtitle="較去年提升 8.2 分"
          icon={TrendingUp}
          color="info"
          trend={{ value: 16, isPositive: true }}
        />
        <StatCard
          title="進行中項目"
          value="24"
          subtitle="跨 15 個區域"
          icon={Target}
          color="warning"
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="培訓教師"
          value="1,280"
          subtitle="本季度完成認證"
          icon={GraduationCap}
          color="success"
          trend={{ value: 22, isPositive: true }}
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border lg:col-span-2">
          <CardHeader className="border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-medium">各區平均評分</CardTitle>
                <p className="mt-0.5 text-sm text-muted-foreground">按區域劃分的 AI 教育成熟度</p>
              </div>
              <button className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                查看全部 <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {topDistricts.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={topDistricts} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} stroke="#9ca3af" fontSize={11} />
                  <YAxis
                    dataKey="district"
                    type="category"
                    width={70}
                    stroke="#9ca3af"
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      fontSize: '12px',
                    }}
                    formatter={(value: number) => [`${value} 分`, '平均評分']}
                  />
                  <Bar dataKey="avgScore" radius={[0, 4, 4, 0]}>
                    {topDistricts.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
                暫無區域數據
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-base font-medium">成熟度分佈</CardTitle>
            <p className="text-sm text-muted-foreground">學校等級 A/B/C/D 分佈</p>
          </CardHeader>
          <CardContent className="pt-4">
            {gradeDistribution.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={gradeDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={65}
                      dataKey="count"
                      nameKey="grade"
                      strokeWidth={2}
                      stroke="white"
                    >
                      {gradeDistribution.map((entry) => (
                        <Cell
                          key={entry.grade}
                          fill={GRADE_COLORS_HEX[entry.grade as keyof typeof GRADE_COLORS_HEX]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        fontSize: '12px',
                      }}
                      formatter={(value: number, name: string) => [`${value} 所`, `等級 ${name}`]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {gradeDistribution.map((item) => (
                    <div key={item.grade} className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-2.5">
                      <div className="flex items-center gap-2">
                        <GradeBadge grade={item.grade as 'A' | 'B' | 'C' | 'D'} size="sm" />
                        <span className="text-xs text-muted-foreground">{item.percentage}%</span>
                      </div>
                      <span className="text-sm font-medium text-foreground">{item.count}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
                暫無分佈數據
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Featured Image Section */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="group overflow-hidden border-border transition-shadow hover:shadow-md">
          <div className="relative h-36">
            <Image
              src="/images/school-campus.jpg"
              alt="School Campus"
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <p className="text-xs font-medium opacity-80">校園數據</p>
              <h3 className="font-semibold">數據視覺化</h3>
            </div>
          </div>
        </Card>
        <Card className="group overflow-hidden border-border transition-shadow hover:shadow-md">
          <div className="relative h-36">
            <Image
              src="/images/data-insights.jpg"
              alt="Data Insights"
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <p className="text-xs font-medium opacity-80">智能分析</p>
              <h3 className="font-semibold">洞察報告</h3>
            </div>
          </div>
        </Card>
        <Card className="group overflow-hidden border-border transition-shadow hover:shadow-md">
          <div className="relative h-36">
            <Image
              src="/images/collaboration.jpg"
              alt="Collaboration"
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <p className="text-xs font-medium opacity-80">協作平台</p>
              <h3 className="font-semibold">團隊合作</h3>
            </div>
          </div>
        </Card>
      </div>

      {/* Schools Grid */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-foreground">重點關注學校</h3>
            <p className="text-sm text-muted-foreground">需要優先跟進的學校列表</p>
          </div>
          <button className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            查看全部 <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
        {topSchools.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {topSchools.map((school) => (
              <SchoolCard key={school.id} school={school} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="暫無學校數據"
            message="目前沒有可顯示的學校資訊"
          />
        )}
      </div>
    </div>
  )
}
