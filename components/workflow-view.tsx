'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { mockWorkflows } from '@/lib/mock-data'
import { STAGE_LABELS, type Workflow } from '@/lib/types'
import Image from 'next/image'
import {
  Search,
  Eye,
  CheckCircle2,
  PlayCircle,
  PauseCircle,
  Clock,
  User,
  MessageSquare,
  Plus,
  ChevronRight,
  Workflow as WorkflowIcon,
  Sparkles,
} from 'lucide-react'

const STAGE_CONFIG: Record<
  Workflow['stage'],
  { gradient: string; bgGradient: string; icon: typeof Search; step: number }
> = {
  discovery: { gradient: 'from-blue-500 to-indigo-500', bgGradient: 'from-blue-100 to-indigo-100', icon: Search, step: 1 },
  analysis: { gradient: 'from-amber-500 to-orange-500', bgGradient: 'from-amber-100 to-orange-100', icon: Eye, step: 2 },
  recommendation: { gradient: 'from-violet-500 to-purple-500', bgGradient: 'from-violet-100 to-purple-100', icon: MessageSquare, step: 3 },
  implementation: { gradient: 'from-emerald-500 to-green-500', bgGradient: 'from-emerald-100 to-green-100', icon: PlayCircle, step: 4 },
  review: { gradient: 'from-cyan-500 to-teal-500', bgGradient: 'from-cyan-100 to-teal-100', icon: CheckCircle2, step: 5 },
}

const STATUS_CONFIG = {
  active: { label: '進行中', gradient: 'from-emerald-500 to-green-500', bgColor: 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700' },
  paused: { label: '已暫停', gradient: 'from-amber-500 to-orange-500', bgColor: 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700' },
  completed: { label: '已完成', gradient: 'from-blue-500 to-indigo-500', bgColor: 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700' },
}

function WorkflowCard({ workflow }: { workflow: Workflow }) {
  const stageConfig = STAGE_CONFIG[workflow.stage]
  const statusConfig = STATUS_CONFIG[workflow.status]
  const StageIcon = stageConfig.icon

  return (
    <Card className="group overflow-hidden border-0 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h3 className="font-bold text-foreground">{workflow.schoolName}</h3>
              <Badge className={`border-0 ${statusConfig.bgColor}`}>
                {statusConfig.label}
              </Badge>
            </div>

            <div className="mt-4">
              <div className="flex items-center gap-2">
                {Object.entries(STAGE_CONFIG).map(([stage, config], index) => (
                  <div key={stage} className="flex items-center">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-xl shadow-md ${
                        config.step <= stageConfig.step
                          ? `bg-gradient-to-br ${config.gradient} text-white`
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {config.step < stageConfig.step ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <span className="text-xs font-bold">{config.step}</span>
                      )}
                    </div>
                    {index < Object.keys(STAGE_CONFIG).length - 1 && (
                      <div
                        className={`mx-1 h-1 w-6 rounded-full ${
                          config.step < stageConfig.step 
                            ? `bg-gradient-to-r ${config.gradient}` 
                            : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <p className={`mt-3 flex items-center gap-2 text-sm font-semibold`}>
                <span className={`rounded-lg bg-gradient-to-r ${stageConfig.gradient} p-1.5`}>
                  <StageIcon className="h-3 w-3 text-white" />
                </span>
                <span className={`bg-gradient-to-r ${stageConfig.gradient} bg-clip-text text-transparent`}>
                  {STAGE_LABELS[workflow.stage]}
                </span>
              </p>
            </div>

            <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-gray-100 to-gray-50 px-3 py-1">
                <User className="h-3 w-3 text-violet-500" />
                {workflow.assignee}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3 w-3 text-cyan-500" />
                更新於 {new Date(workflow.updatedAt).toLocaleDateString('zh-HK')}
              </span>
            </div>

            {workflow.notes.length > 0 && (
              <div className="mt-4 rounded-xl bg-gradient-to-r from-violet-50 via-purple-50 to-pink-50 p-3">
                <p className="text-xs font-bold text-violet-700">最新備註</p>
                {workflow.notes.slice(-2).map((note, index) => (
                  <p key={index} className="mt-1 text-sm text-foreground">
                    • {note}
                  </p>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-gradient-to-r hover:from-violet-100 hover:to-purple-100">
              <ChevronRight className="h-4 w-4" />
            </Button>
            {workflow.status === 'active' && (
              <Button variant="ghost" size="icon" className="rounded-xl hover:bg-gradient-to-r hover:from-amber-100 hover:to-orange-100">
                <PauseCircle className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function WorkflowView() {
  const activeWorkflows = mockWorkflows.filter((w) => w.status === 'active')
  const completedWorkflows = mockWorkflows.filter((w) => w.status === 'completed')

  const stageStats = Object.entries(STAGE_LABELS).map(([stage, label]) => ({
    stage,
    label,
    count: mockWorkflows.filter((w) => w.stage === stage && w.status === 'active').length,
    gradient: STAGE_CONFIG[stage as Workflow['stage']].gradient,
    bgGradient: STAGE_CONFIG[stage as Workflow['stage']].bgGradient,
  }))

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-lime-500 via-green-500 to-emerald-500 p-8 text-white shadow-2xl">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-10 left-20 h-40 w-40 rounded-full bg-emerald-300/20 blur-2xl" />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="relative hidden h-20 w-20 overflow-hidden rounded-2xl shadow-xl ring-4 ring-white/20 lg:block">
              <Image
                src="/images/data-analysis.jpg"
                alt="Workflow"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-sm font-medium backdrop-blur-sm">
                <WorkflowIcon className="h-4 w-4" />
                流程管理
              </div>
              <h2 className="text-2xl font-bold">工作流程管理</h2>
              <p className="mt-1 text-white/90">追蹤和管理學校 AI 教育項目進度</p>
            </div>
          </div>
          <Button className="gap-2 rounded-xl bg-white px-6 font-semibold text-emerald-600 shadow-lg transition-all hover:scale-105 hover:shadow-xl">
            <Plus className="h-4 w-4" />
            新建流程
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        {stageStats.map((stat) => (
          <Card key={stat.stage} className="group overflow-hidden border-0 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
            <CardContent className={`bg-gradient-to-br ${stat.bgGradient} p-4`}>
              <div className="flex items-center gap-3">
                <div className={`h-4 w-4 rounded-full bg-gradient-to-r ${stat.gradient} shadow-lg`} />
                <span className="text-sm font-semibold text-gray-700">{stat.label}</span>
              </div>
              <p className={`mt-3 bg-gradient-to-r ${stat.gradient} bg-clip-text text-3xl font-bold text-transparent`}>
                {stat.count}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
              <span className="rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 p-1.5">
                <PlayCircle className="h-4 w-4 text-white" />
              </span>
              進行中
              <Badge className="border-0 bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-sm">
                {activeWorkflows.length}
              </Badge>
            </h3>
          </div>
          <div className="space-y-4">
            {activeWorkflows.map((workflow) => (
              <WorkflowCard key={workflow.id} workflow={workflow} />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
              <span className="rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 p-1.5">
                <CheckCircle2 className="h-4 w-4 text-white" />
              </span>
              已完成
              <Badge className="border-0 bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm">
                {completedWorkflows.length}
              </Badge>
            </h3>
          </div>
          <div className="space-y-4">
            {completedWorkflows.map((workflow) => (
              <WorkflowCard key={workflow.id} workflow={workflow} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
