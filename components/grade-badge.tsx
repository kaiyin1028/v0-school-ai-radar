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
    bg: 'bg-gradient-to-br from-emerald-400 to-green-500',
    text: 'text-white',
    shadow: 'shadow-lg shadow-emerald-500/30',
    labelColor: 'text-emerald-600',
  },
  B: {
    bg: 'bg-gradient-to-br from-violet-400 to-purple-500',
    text: 'text-white',
    shadow: 'shadow-lg shadow-violet-500/30',
    labelColor: 'text-violet-600',
  },
  C: {
    bg: 'bg-gradient-to-br from-amber-400 to-orange-500',
    text: 'text-white',
    shadow: 'shadow-lg shadow-amber-500/30',
    labelColor: 'text-amber-600',
  },
  D: {
    bg: 'bg-gradient-to-br from-rose-400 to-red-500',
    text: 'text-white',
    shadow: 'shadow-lg shadow-rose-500/30',
    labelColor: 'text-rose-600',
  },
}

export function GradeBadge({ grade, size = 'md', showLabel = false }: GradeBadgeProps) {
  const sizes = {
    sm: 'h-7 w-7 text-xs',
    md: 'h-9 w-9 text-sm',
    lg: 'h-14 w-14 text-xl',
  }

  const styles = GRADE_STYLES[grade]

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          'flex items-center justify-center rounded-xl font-bold',
          styles.bg,
          styles.text,
          styles.shadow,
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
