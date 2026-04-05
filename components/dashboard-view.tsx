'use client'

import { StatCard } from './stat-card'
import { SchoolCard } from './school-card'
import { GradeBadge } from './grade-badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { mockSchools, gradeDistribution, districtStats } from '@/lib/mock-data'
import { School, GraduationCap, TrendingUp, Target, ArrowRight, Sparkles, Zap } from 'lucide-react'
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
  B: '#8b5cf6',
  C: '#f59e0b',
  D: '#ef4444',
}

const BAR_COLORS = ['#8b5cf6', '#ec4899', '#06b6d4', '#f59e0b', '#10b981', '#6366f1']

export function DashboardView() {
  const topSchools = mockSchools.slice(0, 4)
  const topDistricts = districtStats.slice(0, 6)

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 p-8 text-white shadow-2xl">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 left-20 h-48 w-48 rounded-full bg-pink-400/20 blur-3xl" />
        <div className="absolute right-1/3 top-1/2 h-32 w-32 rounded-full bg-cyan-400/20 blur-2xl" />
        <div className="relative z-10 flex items-center gap-8">
          <div className="flex-1">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              AI 教育分析平台
            </div>
            <h2 className="mb-3 text-4xl font-bold leading-tight">
              全港學校 AI 教育<br />需求雷達
            </h2>
            <p className="mb-5 max-w-lg text-lg text-white/90">
              智能分析香港學校的 AI 教育發展需求，助您精準定位、科學規劃教育資源配置
            </p>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-purple-600 shadow-lg transition-all hover:scale-105 hover:shadow-xl">
                <Zap className="h-5 w-5" />
                開始分析
              </button>
              <button className="rounded-xl border-2 border-white/30 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20">
                了解更多
              </button>
            </div>
          </div>
          <div className="relative hidden h-52 w-72 overflow-hidden rounded-2xl shadow-2xl ring-4 ring-white/20 lg:block">
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
          color="primary"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="平均成熟度"
          value="58.5"
          subtitle="較去年提升 8.2 分"
          icon={TrendingUp}
          color="pink"
          trend={{ value: 16, isPositive: true }}
        />
        <StatCard
          title="進行中項目"
          value="24"
          subtitle="跨 15 個區域"
          icon={Target}
          color="cyan"
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="培訓教師"
          value="1,280"
          subtitle="本季度完成認證"
          icon={GraduationCap}
          color="lime"
          trend={{ value: 22, isPositive: true }}
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="overflow-hidden border-0 shadow-lg lg:col-span-2">
          <CardHeader className="border-b bg-gradient-to-r from-violet-50 via-purple-50 to-pink-50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="h-3 w-3 rounded-full bg-gradient-to-r from-violet-500 to-purple-500" />
                  各區平均評分
                </CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">按區域劃分的 AI 教育成熟度</p>
              </div>
              <button className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg">
                查看全部 <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={topDistricts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} stroke="#9ca3af" fontSize={12} />
                <YAxis
                  dataKey="district"
                  type="category"
                  width={70}
                  stroke="#9ca3af"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '16px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                  }}
                  formatter={(value: number) => [`${value} 分`, '平均評分']}
                />
                <Bar dataKey="avgScore" radius={[0, 8, 8, 0]}>
                  {topDistricts.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-0 shadow-lg">
          <CardHeader className="border-b bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50">
            <CardTitle className="flex items-center gap-2 text-lg">
              <span className="h-3 w-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
              成熟度分佈
            </CardTitle>
            <p className="text-sm text-muted-foreground">學校等級 A/B/C/D 分佈</p>
          </CardHeader>
          <CardContent className="pt-4">
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
                  strokeWidth={4}
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
                    border: 'none',
                    borderRadius: '16px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                  }}
                  formatter={(value: number, name: string) => [`${value} 所`, `等級 ${name}`]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {gradeDistribution.map((item) => (
                <div key={item.grade} className="flex items-center justify-between rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 p-3">
                  <div className="flex items-center gap-2">
                    <GradeBadge grade={item.grade as 'A' | 'B' | 'C' | 'D'} size="sm" />
                    <span className="text-xs text-muted-foreground">{item.percentage}%</span>
                  </div>
                  <span className="text-sm font-bold text-foreground">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Image Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="group overflow-hidden border-0 shadow-lg transition-all hover:shadow-xl">
          <div className="relative h-52">
            <Image
              src="/images/school-building.jpg"
              alt="Hong Kong School"
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-violet-900/80 via-violet-900/40 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-violet-500/30 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                <School className="h-3 w-3" />
                校園數據
              </div>
              <h3 className="text-xl font-bold">校園數據視覺化</h3>
              <p className="mt-1 text-sm text-white/80">深入了解每間學校的 AI 教育發展狀況</p>
            </div>
          </div>
        </Card>
        <Card className="group overflow-hidden border-0 shadow-lg transition-all hover:shadow-xl">
          <div className="relative h-52">
            <Image
              src="/images/data-analysis.jpg"
              alt="Data Analysis"
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-pink-900/80 via-pink-900/40 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-pink-500/30 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                <TrendingUp className="h-3 w-3" />
                智能分析
              </div>
              <h3 className="text-xl font-bold">智能數據分析</h3>
              <p className="mt-1 text-sm text-white/80">運用 AI 技術精準分析教育需求</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Schools Grid */}
      <div>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-xl font-bold text-foreground">
              <span className="h-3 w-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500" />
              重點關注學校
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">需要優先跟進的學校列表</p>
          </div>
          <button className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg">
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
