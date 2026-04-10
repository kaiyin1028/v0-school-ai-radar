'use client'

/**
 * UI State Components - Loading / Error / Empty 狀態組件
 * 
 * 每個頁面都需要處理三種狀態:
 * 1. Loading - 數據加載中
 * 2. Error - 加載失敗，可重試
 * 3. Empty - 無數據
 */

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, AlertCircle, FileX, RefreshCw, WifiOff, ShieldX, ServerCrash } from 'lucide-react'
import { cn } from '@/lib/utils'

// ===========================================
// Loading State
// ===========================================

interface LoadingStateProps {
  message?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function LoadingState({ 
  message = '正在載入...', 
  className,
  size = 'md' 
}: LoadingStateProps) {
  const sizeClasses = {
    sm: 'h-32',
    md: 'h-64',
    lg: 'h-96',
  }

  const iconSizes = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-14 w-14',
  }

  return (
    <div className={cn(
      'flex flex-col items-center justify-center gap-4',
      sizeClasses[size],
      className
    )}>
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-20 blur-xl animate-pulse" />
        <Loader2 className={cn('animate-spin text-primary', iconSizes[size])} />
      </div>
      <p className="text-muted-foreground text-sm animate-pulse">{message}</p>
    </div>
  )
}

// ===========================================
// Loading Skeleton
// ===========================================

interface SkeletonCardProps {
  className?: string
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="h-4 w-3/4 rounded-md bg-muted animate-pulse" />
          <div className="h-4 w-1/2 rounded-md bg-muted animate-pulse" />
          <div className="h-20 w-full rounded-md bg-muted animate-pulse" />
          <div className="flex gap-2">
            <div className="h-8 w-20 rounded-md bg-muted animate-pulse" />
            <div className="h-8 w-20 rounded-md bg-muted animate-pulse" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex gap-4 px-4 py-3 border-b">
        <div className="h-4 w-1/4 rounded bg-muted animate-pulse" />
        <div className="h-4 w-1/4 rounded bg-muted animate-pulse" />
        <div className="h-4 w-1/4 rounded bg-muted animate-pulse" />
        <div className="h-4 w-1/4 rounded bg-muted animate-pulse" />
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 px-4 py-4 border-b">
          <div className="h-4 w-1/4 rounded bg-muted animate-pulse" />
          <div className="h-4 w-1/4 rounded bg-muted animate-pulse" />
          <div className="h-4 w-1/4 rounded bg-muted animate-pulse" />
          <div className="h-4 w-1/4 rounded bg-muted animate-pulse" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonStats({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="h-4 w-1/2 rounded bg-muted animate-pulse" />
              <div className="h-8 w-3/4 rounded bg-muted animate-pulse" />
              <div className="h-3 w-1/3 rounded bg-muted animate-pulse" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// ===========================================
// Error State
// ===========================================

interface ErrorStateProps {
  title?: string
  message?: string
  errorCode?: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({ 
  title = '載入失敗',
  message = '無法獲取數據，請稍後再試',
  errorCode,
  onRetry,
  className 
}: ErrorStateProps) {
  // 根據錯誤代碼選擇圖標
  const getErrorIcon = () => {
    if (errorCode === 'NETWORK_ERROR') return WifiOff
    if (errorCode === 'UNAUTHORIZED' || errorCode === 'FORBIDDEN') return ShieldX
    if (errorCode?.startsWith('HTTP_5')) return ServerCrash
    return AlertCircle
  }

  const ErrorIcon = getErrorIcon()

  return (
    <Card className={cn('border-destructive/30 bg-destructive/5', className)}>
      <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <div className="mb-4 rounded-full bg-destructive/10 p-4">
          <ErrorIcon className="h-10 w-10 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-1 max-w-md">{message}</p>
        {errorCode && (
          <p className="text-xs text-muted-foreground/70 mb-4">
            錯誤代碼: {errorCode}
          </p>
        )}
        {onRetry && (
          <Button 
            variant="outline" 
            onClick={onRetry}
            className="mt-2 gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            重新載入
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// Inline error for smaller areas
export function InlineError({ 
  message = '載入失敗', 
  onRetry,
  className 
}: { 
  message?: string
  onRetry?: () => void
  className?: string 
}) {
  return (
    <div className={cn(
      'flex items-center justify-center gap-3 py-8 text-destructive',
      className
    )}>
      <AlertCircle className="h-5 w-5" />
      <span className="text-sm">{message}</span>
      {onRetry && (
        <Button variant="ghost" size="sm" onClick={onRetry} className="h-7 px-2">
          <RefreshCw className="h-3 w-3 mr-1" />
          重試
        </Button>
      )}
    </div>
  )
}

// ===========================================
// Empty State
// ===========================================

interface EmptyStateProps {
  title?: string
  message?: string
  icon?: React.ReactNode
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({ 
  title = '暫無數據',
  message = '目前沒有可顯示的內容',
  icon,
  action,
  className 
}: EmptyStateProps) {
  return (
    <Card className={cn('border-dashed', className)}>
      <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="mb-4 rounded-full bg-muted p-4">
          {icon || <FileX className="h-10 w-10 text-muted-foreground" />}
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-md mb-4">{message}</p>
        {action && (
          <Button onClick={action.onClick}>
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// ===========================================
// Page Wrapper with States
// ===========================================

interface PageStateWrapperProps {
  isLoading: boolean
  error: Error | null
  isEmpty?: boolean
  children: React.ReactNode
  onRetry?: () => void
  loadingMessage?: string
  emptyTitle?: string
  emptyMessage?: string
  emptyAction?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function PageStateWrapper({
  isLoading,
  error,
  isEmpty = false,
  children,
  onRetry,
  loadingMessage,
  emptyTitle,
  emptyMessage,
  emptyAction,
  className,
}: PageStateWrapperProps) {
  if (isLoading) {
    return (
      <div className={className}>
        <LoadingState message={loadingMessage} size="lg" />
      </div>
    )
  }

  if (error) {
    const apiError = error as { code?: string; message?: string }
    return (
      <div className={className}>
        <ErrorState
          message={apiError.message || error.message}
          errorCode={apiError.code}
          onRetry={onRetry}
        />
      </div>
    )
  }

  if (isEmpty) {
    return (
      <div className={className}>
        <EmptyState
          title={emptyTitle}
          message={emptyMessage}
          action={emptyAction}
        />
      </div>
    )
  }

  return <>{children}</>
}
