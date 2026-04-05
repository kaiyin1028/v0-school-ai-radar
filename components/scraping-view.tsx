'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Globe,
  Search,
  Play,
  Pause,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
  FileText,
  Users,
  Cpu,
  Download,
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
    color: 'bg-muted text-muted-foreground border-border',
    icon: Clock,
  },
  running: {
    label: '抓取中',
    color: 'bg-blue-400/10 text-blue-400 border-blue-400/30',
    icon: RefreshCw,
  },
  completed: {
    label: '已完成',
    color: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30',
    icon: CheckCircle2,
  },
  failed: {
    label: '失敗',
    color: 'bg-red-400/10 text-red-400 border-red-400/30',
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
      <div>
        <h2 className="text-2xl font-bold text-foreground">數據抓取</h2>
        <p className="mt-1 text-muted-foreground">自動抓取學校官網信息用於 AI 分析</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">總任務數</p>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-400/10 p-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">已完成</p>
                <p className="text-2xl font-bold text-foreground">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-400/10 p-2">
                <RefreshCw className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">進行中</p>
                <p className="text-2xl font-bold text-foreground">{stats.running}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-red-400/10 p-2">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">失敗</p>
                <p className="text-2xl font-bold text-foreground">{stats.failed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg">新增抓取任務</CardTitle>
          <CardDescription>輸入學校官網 URL 開始數據抓取</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="輸入學校官網 URL，例如 https://www.school.edu.hk"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button className="gap-2">
              <Play className="h-4 w-4" />
              開始抓取
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg">抓取任務列表</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    學校
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    URL
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                    狀態
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                    進度
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                    數據收集
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => {
                  const statusConfig = STATUS_CONFIG[job.status]
                  const StatusIcon = statusConfig.icon

                  return (
                    <tr key={job.id} className="border-b border-border/30 hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <span className="font-medium text-foreground">{job.schoolName}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-muted-foreground">{job.url}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant="outline" className={statusConfig.color}>
                          <StatusIcon
                            className={`mr-1 h-3 w-3 ${job.status === 'running' ? 'animate-spin' : ''}`}
                          />
                          {statusConfig.label}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                            <div
                              className={`h-full transition-all ${
                                job.status === 'failed' ? 'bg-red-400' : 'bg-primary'
                              }`}
                              style={{ width: `${job.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">{job.progress}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {job.dataCollected.pages}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {job.dataCollected.images}
                          </span>
                          <span className="flex items-center gap-1">
                            <Cpu className="h-3 w-3" />
                            {job.dataCollected.documents}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {job.status === 'running' && (
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Pause className="h-4 w-4" />
                            </Button>
                          )}
                          {job.status === 'failed' && (
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          )}
                          {job.status === 'completed' && (
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Download className="h-4 w-4" />
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
