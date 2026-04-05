'use client'

import { StatCard } from './stat-card'
import { SchoolCard } from './school-card'
import { GradeBadge } from './grade-badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { mockSchools, gradeDistribution, districtStats } from '@/lib/mock-data'
import { School, GraduationCap, TrendingUp, Target, ArrowRight, Sparkles } from 'lucide-react'
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
  A: '#10b981',
  B: '#3b82f6',
  C: '#f59e0b',
  D: '#ef4444',
}

export function DashboardView() {
  const topSchools = mockSchools.slice(0, 4)
  const topDistricts = districtStats.slice(0, 6)

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/90 to-accent/80 p-8 text-white shadow-lg">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-10 right-20 h-32 w-32 rounded-full bg-white/10 blur-xl" />
        <div className="relative z-10 flex items-center gap-8">
          <div className="flex-1">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-sm font-medium backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              AI 教育分析平台
            </div>
            <h2 className="mb-2 text-3xl font-bold">全港學校 AI 教育需求雷達</h2>
            <p className="mb-4 max-w-lg text-white/90">
              智能分析香港學校的 AI 教育發展需求，助您精準定位、科學規劃教育資源配置
            </p>
            <button className="rounded-xl bg-white px-6 py-2.5 font-semibold text-primary shadow-md transition-all hover:bg-white/90 hover:shadow-lg">
              開始分析
            </button>
          </div>
          <div className="relative hidden h-48 w-64 overflow-hidden rounded-xl shadow-xl lg:block">
            <Image
              src="/images/ai-education.jpg"
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
          value="570"
          subtitle="全港學校覆蓋率 68%"
          icon={School}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="平均成熟度"
          value="58.5"
          subtitle="較去年提升 8.2 分"
          icon={TrendingUp}
          trend={{ value: 16, isPositive: true }}
        />
        <StatCard
          title="進行中項目"
          value="24"
          subtitle="跨 15 個區域"
          icon={Target}
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="培訓教師"
          value="1,280"
          subtitle="本季度完成認證"
          icon={GraduationCap}
          trend={{ value: 22, isPositive: true }}
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="overflow-hidden border-border/50 shadow-sm lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-secondary/50 to-transparent">
            <div>
              <CardTitle className="text-lg">各區平均評分</CardTitle>
              <p className="text-sm text-muted-foreground">按區域劃分的 AI 教育成熟度</p>
            </div>
            <button className="flex items-center gap-1 rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/20">
              查看全部 <ArrowRight className="h-4 w-4" />
            </button>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={topDistricts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis
                  dataKey="district"
                  type="category"
                  width={70}
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    color: 'hsl(var(--foreground))',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                  formatter={(value: number) => [`${value} 分`, '平均評分']}
                />
                <Bar dataKey="avgScore" fill="hsl(var(--primary))" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-border/50 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-secondary/50 to-transparent">
            <CardTitle className="text-lg">成熟度分佈</CardTitle>
            <p className="text-sm text-muted-foreground">學校等級 A/B/C/D 分佈</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={gradeDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  dataKey="count"
                  nameKey="grade"
                  strokeWidth={3}
                  stroke="hsl(var(--card))"
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
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    color: 'hsl(var(--foreground))',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                  formatter={(value: number, name: string) => [`${value} 所`, `等級 ${name}`]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {gradeDistribution.map((item) => (
                <div key={item.grade} className="flex items-center justify-between rounded-lg bg-secondary/50 p-2">
                  <div className="flex items-center gap-2">
                    <GradeBadge grade={item.grade as 'A' | 'B' | 'C' | 'D'} size="sm" />
                    <span className="text-xs text-muted-foreground">{item.percentage}%</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Image Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="overflow-hidden border-border/50 shadow-sm">
          <div className="relative h-48">
            <Image
              src="/images/school-building.jpg"
              alt="Hong Kong School"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h3 className="text-lg font-bold">校園數據視覺化</h3>
              <p className="text-sm text-white/80">深入了解每間學校的 AI 教育發展狀況</p>
            </div>
          </div>
        </Card>
        <Card className="overflow-hidden border-border/50 shadow-sm">
          <div className="relative h-48">
            <Image
              src="/images/data-analysis.jpg"
              alt="Data Analysis"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h3 className="text-lg font-bold">智能數據分析</h3>
              <p className="text-sm text-white/80">運用 AI 技術精準分析教育需求</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Schools Grid */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground">重點關注學校</h3>
            <p className="text-sm text-muted-foreground">需要優先跟進的學校列表</p>
          </div>
          <button className="flex items-center gap-1 rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20">
            查看全部 <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {topSchools.map((school) => (
            <SchoolCard key={school.id} school={school} />
          ))}
        </div>
      </div>
    </div>
  )
}
