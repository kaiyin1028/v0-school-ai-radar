import { cn } from '@/lib/utils'
import { GRADE_COLORS } from '@/lib/types'

interface GradeBadgeProps {
  grade: 'A' | 'B' | 'C' | 'D'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

const GRADE_LABELS = {
  A: '領先',
  B: '進階',
  C: '發展中',
  D: '起步',
}

export function GradeBadge({ grade, size = 'md', showLabel = false }: GradeBadgeProps) {
  const sizes = {
    sm: 'h-6 w-6 text-xs',
    md: 'h-8 w-8 text-sm',
    lg: 'h-12 w-12 text-lg',
  }

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          'flex items-center justify-center rounded-lg border font-bold',
          GRADE_COLORS[grade],
          sizes[size]
        )}
      >
        {grade}
      </div>
      {showLabel && (
        <span className={cn('text-sm', GRADE_COLORS[grade].split(' ')[0])}>
          {GRADE_LABELS[grade]}
        </span>
      )}
    </div>
  )
}
