import { cn } from '@/lib/utils'

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

const GRADE_STYLES = {
  A: {
    bg: 'bg-emerald-500',
    text: 'text-white',
    labelColor: 'text-emerald-600',
  },
  B: {
    bg: 'bg-blue-500',
    text: 'text-white',
    labelColor: 'text-blue-600',
  },
  C: {
    bg: 'bg-amber-500',
    text: 'text-white',
    labelColor: 'text-amber-600',
  },
  D: {
    bg: 'bg-red-500',
    text: 'text-white',
    labelColor: 'text-red-600',
  },
}

export function GradeBadge({ grade, size = 'md', showLabel = false }: GradeBadgeProps) {
  const sizes = {
    sm: 'h-6 w-6 text-xs',
    md: 'h-8 w-8 text-sm',
    lg: 'h-12 w-12 text-lg',
  }

  const styles = GRADE_STYLES[grade]

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          'flex items-center justify-center rounded-lg font-semibold',
          styles.bg,
          styles.text,
          sizes[size]
        )}
      >
        {grade}
      </div>
      {showLabel && (
        <span className={cn('text-sm font-medium', styles.labelColor)}>
          {GRADE_LABELS[grade]}
        </span>
      )}
    </div>
  )
}
