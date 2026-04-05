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
  Sparkles,
  Zap,
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
    gradient: 'from-gray-400 to-slate-400',
    bgColor: 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700',
    icon: Clock,
  },
  running: {
    label: '抓取中',
    gradient: 'from-blue-500 to-indigo-500',
    bgColor: 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700',
    icon: RefreshCw,
  },
  completed: {
    label: '已完成',
    gradient: 'from-emerald-500 to-green-500',
    bgColor: 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700',
    icon: CheckCircle2,
  },
  failed: {
    label: '失敗',
    gradient: 'from-rose-500 to-red-500',
    bgColor: 'bg-gradient-to-r from-rose-100 to-red-100 text-rose-700',
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
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 p-8 text-white shadow-2xl">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-10 left-20 h-40 w-40 rounded-full bg-indigo-300/20 blur-2xl" />
        <div className="absolute right-1/3 top-1/2 h-32 w-32 rounded-full bg-violet-300/20 blur-xl" />
        <div className="relative z-10 flex items-center gap-6">
          <div className="relative hidden h-24 w-24 overflow-hidden rounded-2xl shadow-xl ring-4 ring-white/20 lg:block">
            <Image
              src="/images/students-learning.jpg"
              alt="Scraping"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-sm font-medium backdrop-blur-sm">
              <Globe className="h-4 w-4" />
              自動化數據收集
            </div>
            <h2 className="text-2xl font-bold">數據抓取</h2>
            <p className="mt-1 text-white/90">自動抓取學校官網信息用於 AI 分析</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="group overflow-hidden border-0 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
          <CardContent className="bg-gradient-to-br from-violet-100 via-purple-50 to-pink-100 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 p-3 shadow-lg shadow-violet-500/30">
                <Globe className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">總任務數</p>
                <p className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
                  {stats.total}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="group overflow-hidden border-0 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
          <CardContent className="bg-gradient-to-br from-emerald-100 via-green-50 to-teal-100 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 p-3 shadow-lg shadow-emerald-500/30">
                <CheckCircle2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">已完成</p>
                <p className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-3xl font-bold text-transparent">
                  {stats.completed}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="group overflow-hidden border-0 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
          <CardContent className="bg-gradient-to-br from-blue-100 via-indigo-50 to-sky-100 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 p-3 shadow-lg shadow-blue-500/30">
                <RefreshCw className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">進行中</p>
                <p className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-3xl font-bold text-transparent">
                  {stats.running}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="group overflow-hidden border-0 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
          <CardContent className="bg-gradient-to-br from-rose-100 via-red-50 to-orange-100 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-gradient-to-br from-rose-500 to-red-500 p-3 shadow-lg shadow-rose-500/30">
                <AlertCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">失敗</p>
                <p className="bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-3xl font-bold text-transparent">
                  {stats.failed}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden border-0 shadow-lg">
        <CardHeader className="border-b bg-gradient-to-r from-blue-50 via-indigo-50 to-violet-50">
          <CardTitle className="flex items-center gap-2 text-lg">
            <span className="rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 p-1.5">
              <Sparkles className="h-4 w-4 text-white" />
            </span>
            新增抓取任務
          </CardTitle>
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
                className="rounded-xl border-2 border-indigo-100 bg-indigo-50/50 pl-10 focus:border-indigo-300"
              />
            </div>
            <Button className="gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl">
              <Zap className="h-4 w-4" />
              開始抓取
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-0 shadow-lg">
        <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white">
          <CardTitle className="flex items-center gap-2 text-lg">
            <span className="h-3 w-3 rounded-full bg-gradient-to-r from-violet-500 to-purple-500" />
            抓取任務列表
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gradient-to-r from-violet-50 via-purple-50 to-pink-50">
                  <th className="px-4 py-3 text-left text-sm font-bold text-foreground">
                    學校
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-foreground">
                    URL
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-bold text-foreground">
                    狀態
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-bold text-foreground">
                    進度
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-bold text-foreground">
                    數據收集
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-bold text-foreground">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job, index) => {
                  const statusConfig = STATUS_CONFIG[job.status]
                  const StatusIcon = statusConfig.icon

                  return (
                    <tr key={job.id} className={`border-b border-gray-100 transition-colors hover:bg-gradient-to-r hover:from-violet-50/50 hover:to-purple-50/50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                      <td className="px-4 py-4">
                        <span className="font-bold text-foreground">{job.schoolName}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-muted-foreground">{job.url}</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <Badge className={`border-0 shadow-sm ${statusConfig.bgColor}`}>
                          <StatusIcon
                            className={`mr-1 h-3 w-3 ${job.status === 'running' ? 'animate-spin' : ''}`}
                          />
                          {statusConfig.label}
                        </Badge>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <div className="h-2.5 w-28 overflow-hidden rounded-full bg-gray-100">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r transition-all ${statusConfig.gradient}`}
                              style={{ width: `${job.progress}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-muted-foreground">{job.progress}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2 text-xs">
                          <span className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-violet-100 to-purple-100 px-2 py-1 font-medium text-violet-700">
                            <FileText className="h-3 w-3" />
                            {job.dataCollected.pages}
                          </span>
                          <span className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-pink-100 to-rose-100 px-2 py-1 font-medium text-pink-700">
                            <Users className="h-3 w-3" />
                            {job.dataCollected.images}
                          </span>
                          <span className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-cyan-100 to-teal-100 px-2 py-1 font-medium text-cyan-700">
                            <Cpu className="h-3 w-3" />
                            {job.dataCollected.documents}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {job.status === 'running' && (
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-gradient-to-r hover:from-amber-100 hover:to-orange-100">
                              <Pause className="h-4 w-4 text-amber-600" />
                            </Button>
                          )}
                          {job.status === 'failed' && (
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100">
                              <RefreshCw className="h-4 w-4 text-blue-600" />
                            </Button>
                          )}
                          {job.status === 'completed' && (
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-gradient-to-r hover:from-emerald-100 hover:to-green-100">
                              <Download className="h-4 w-4 text-emerald-600" />
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
