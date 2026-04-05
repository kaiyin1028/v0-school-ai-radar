'use client'

import { StatCard } from './stat-card'
import { SchoolCard } from './school-card'
import { GradeBadge } from './grade-badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { mockSchools, gradeDistribution, districtStats } from '@/lib/mock-data'
import { School, GraduationCap, TrendingUp, Target, ArrowRight } from 'lucide-react'
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
  A: '#34d399',
  B: '#60a5fa',
  C: '#fbbf24',
  D: '#f87171',
}

export function DashboardView() {
  const topSchools = mockSchools.slice(0, 4)
  const topDistricts = districtStats.slice(0, 8)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">總覽儀表板</h2>
        <p className="mt-1 text-muted-foreground">全港學校 AI 教育發展概況</p>
      </div>

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

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">各區平均評分</CardTitle>
            <button className="flex items-center gap-1 text-sm text-primary hover:underline">
              查看全部 <ArrowRight className="h-4 w-4" />
            </button>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topDistricts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" />
                <YAxis
                  dataKey="district"
                  type="category"
                  width={80}
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))',
                  }}
                  formatter={(value: number) => [`${value} 分`, '平均評分']}
                />
                <Bar dataKey="avgScore" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">成熟度分佈</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={gradeDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="count"
                  nameKey="grade"
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
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))',
                  }}
                  formatter={(value: number, name: string) => [`${value} 所`, `等級 ${name}`]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {gradeDistribution.map((item) => (
                <div key={item.grade} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GradeBadge grade={item.grade as 'A' | 'B' | 'C' | 'D'} size="sm" />
                    <span className="text-sm text-muted-foreground">{item.percentage}%</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">重點關注學校</h3>
          <button className="flex items-center gap-1 text-sm text-primary hover:underline">
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
