'use client'

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { DIMENSION_LABELS, type DimensionScores } from '@/lib/types'

interface RadarChartProps {
  data: DimensionScores
  showLabels?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function DimensionRadarChart({ data, showLabels = true, size = 'md' }: RadarChartProps) {
  const chartData = Object.entries(data).map(([key, value]) => ({
    dimension: DIMENSION_LABELS[key as keyof DimensionScores],
    value,
    fullMark: 100,
  }))

  const heights = {
    sm: 200,
    md: 300,
    lg: 400,
  }

  return (
    <ResponsiveContainer width="100%" height={heights[size]}>
      <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="80%">
        <PolarGrid stroke="hsl(var(--border))" strokeOpacity={0.5} />
        <PolarAngleAxis
          dataKey="dimension"
          tick={showLabels ? { fill: 'hsl(var(--muted-foreground))', fontSize: 11 } : false}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 100]}
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
          tickCount={5}
        />
        <Radar
          name="評分"
          dataKey="value"
          stroke="hsl(var(--primary))"
          fill="hsl(var(--primary))"
          fillOpacity={0.3}
          strokeWidth={2}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            color: 'hsl(var(--foreground))',
          }}
          formatter={(value: number) => [`${value} 分`, '評分']}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}
