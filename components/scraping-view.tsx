'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import {
  Globe,
  Search,
  Pause,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
  FileText,
  Users,
  Cpu,
  Download,
  Play,
  Leaf,
} from 'lucide-react'

interface ScrapeJob {
  id: string
  url: string
  schoolName: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  progress: number
  dataCollected: {
    pages: number
    images: number
    documents: number
  }
  startedAt?: string
  completedAt?: string
}

const mockJobs: ScrapeJob[] = [
  {
    id: '1',
    url: 'https://www.spcc.edu.hk',
    schoolName: '聖保羅男女中學',
    status: 'completed',
    progress: 100,
    dataCollected: { pages: 45, images: 128, documents: 23 },
    startedAt: '2024-03-15T10:00:00',
    completedAt: '2024-03-15T10:15:00',
  },
  {
    id: '2',
    url: 'https://www.dbs.edu.hk',
    schoolName: '拔萃男書院',
    status: 'running',
    progress: 65,
    dataCollected: { pages: 28, images: 67, documents: 12 },
    startedAt: '2024-03-15T10:30:00',
  },
  {
    id: '3',
    url: 'https://www.yingwa.edu.hk',
    schoolName: '英華書院',
    status: 'pending',
    progress: 0,
    dataCollected: { pages: 0, images: 0, documents: 0 },
  },
  {
    id: '4',
    url: 'https://www.lasalle.edu.hk',
    schoolName: '喇沙書院',
    status: 'failed',
    progress: 32,
    dataCollected: { pages: 12, images: 24, documents: 5 },
    startedAt: '2024-03-15T09:00:00',
  },
]

const STATUS_CONFIG = {
  pending: {
    label: '待處理',
    color: 'bg-muted',
    textColor: 'text-muted-foreground',
    badgeColor: 'bg-muted text-muted-foreground',
    icon: Clock,
  },
  running: {
    label: '抓取中',
    color: 'bg-blue-500',
    textColor: 'text-blue-700',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: RefreshCw,
  },
  completed: {
    label: '已完成',
    color: 'bg-success',
    textColor: 'text-success',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: CheckCircle2,
  },
  failed: {
    label: '失敗',
    color: 'bg-destructive',
    textColor: 'text-destructive',
    badgeColor: 'bg-red-50 text-red-700 border-red-200',
    icon: AlertCircle,
  },
}

export function ScrapingView() {
  const [newUrl, setNewUrl] = useState('')
  const [jobs] = useState(mockJobs)

  const stats = {
    total: jobs.length,
    completed: jobs.filter((j) => j.status === 'completed').length,
    running: jobs.filter((j) => j.status === 'running').length,
    failed: jobs.filter((j) => j.status === 'failed').length,
  }

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-5">
          <svg viewBox="0 0 100 100" className="h-full w-full">
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary" />
            <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary" />
          </svg>
        </div>
        <div className="relative z-10 flex items-center gap-5 p-6">
          <div className="relative hidden h-16 w-16 overflow-hidden rounded-xl border border-border lg:block">
            <Image
              src="/images/collaboration.jpg"
              alt="Scraping"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <div className="mb-1.5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <Leaf className="h-3 w-3" />
              自動化數據收集
            </div>
            <h2 className="text-xl font-semibold text-foreground">數據抓取</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">自動抓取學校官網信息用於 AI 分析</p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Globe className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">總任務數</p>
                <p className="text-xl font-semibold text-foreground">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-success/10 p-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">已完成</p>
                <p className="text-xl font-semibold text-foreground">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-info/10 p-2">
                <RefreshCw className="h-4 w-4 text-info" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">進行中</p>
                <p className="text-xl font-semibold text-foreground">{stats.running}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-destructive/10 p-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">失敗</p>
                <p className="text-xl font-semibold text-foreground">{stats.failed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-base font-medium">新增抓取任務</CardTitle>
          <CardDescription>輸入學校官網 URL 開始數據抓取</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="輸入學校官網 URL，例如 https://www.school.edu.hk"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button className="gap-2">
              <Play className="h-4 w-4" />
              開始抓取
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-base font-medium">抓取任務列表</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">學校</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">URL</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">狀態</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">進度</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">數據收集</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">操作</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job, index) => {
                  const statusConfig = STATUS_CONFIG[job.status]
                  const StatusIcon = statusConfig.icon

                  return (
                    <tr key={job.id} className={`border-b border-border transition-colors hover:bg-muted/30 ${index % 2 === 0 ? '' : 'bg-muted/10'}`}>
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-foreground">{job.schoolName}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-muted-foreground">{job.url}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant="outline" className={`border text-xs ${statusConfig.badgeColor}`}>
                          <StatusIcon className={`mr-1 h-3 w-3 ${job.status === 'running' ? 'animate-spin' : ''}`} />
                          {statusConfig.label}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                            <div
                              className={`h-full rounded-full transition-all ${statusConfig.color}`}
                              style={{ width: `${job.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">{job.progress}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1.5 text-[10px]">
                          <span className="flex items-center gap-0.5 rounded border border-border bg-muted/30 px-1.5 py-0.5 text-muted-foreground">
                            <FileText className="h-2.5 w-2.5" />
                            {job.dataCollected.pages}
                          </span>
                          <span className="flex items-center gap-0.5 rounded border border-border bg-muted/30 px-1.5 py-0.5 text-muted-foreground">
                            <Users className="h-2.5 w-2.5" />
                            {job.dataCollected.images}
                          </span>
                          <span className="flex items-center gap-0.5 rounded border border-border bg-muted/30 px-1.5 py-0.5 text-muted-foreground">
                            <Cpu className="h-2.5 w-2.5" />
                            {job.dataCollected.documents}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {job.status === 'running' && (
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <Pause className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          {job.status === 'failed' && (
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <RefreshCw className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          {job.status === 'completed' && (
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <Download className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
