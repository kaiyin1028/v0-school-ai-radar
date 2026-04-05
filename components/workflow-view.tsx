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
} from 'lucide-react'

const STAGE_CONFIG: Record<
  Workflow['stage'],
  { color: string; bgColor: string; icon: typeof Search; step: number }
> = {
  discovery: { color: 'bg-blue-500', bgColor: 'bg-blue-100', icon: Search, step: 1 },
  analysis: { color: 'bg-amber-500', bgColor: 'bg-amber-100', icon: Eye, step: 2 },
  recommendation: { color: 'bg-purple-500', bgColor: 'bg-purple-100', icon: MessageSquare, step: 3 },
  implementation: { color: 'bg-emerald-500', bgColor: 'bg-emerald-100', icon: PlayCircle, step: 4 },
  review: { color: 'bg-teal-500', bgColor: 'bg-teal-100', icon: CheckCircle2, step: 5 },
}

const STATUS_CONFIG = {
  active: { label: '進行中', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  paused: { label: '已暫停', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  completed: { label: '已完成', color: 'bg-blue-100 text-blue-700 border-blue-200' },
}

function WorkflowCard({ workflow }: { workflow: Workflow }) {
  const stageConfig = STAGE_CONFIG[workflow.stage]
  const statusConfig = STATUS_CONFIG[workflow.status]
  const StageIcon = stageConfig.icon

  return (
    <Card className="overflow-hidden border-border/50 shadow-sm transition-all hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h3 className="font-bold text-foreground">{workflow.schoolName}</h3>
              <Badge variant="outline" className={statusConfig.color}>
                {statusConfig.label}
              </Badge>
            </div>

            <div className="mt-4">
              <div className="flex items-center gap-2">
                {Object.entries(STAGE_CONFIG).map(([stage, config], index) => (
                  <div key={stage} className="flex items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full shadow-sm ${
                        config.step <= stageConfig.step
                          ? config.color + ' text-white'
                          : 'bg-secondary text-muted-foreground'
                      }`}
                    >
                      {config.step < stageConfig.step ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <span className="text-xs font-semibold">{config.step}</span>
                      )}
                    </div>
                    {index < Object.keys(STAGE_CONFIG).length - 1 && (
                      <div
                        className={`mx-1 h-0.5 w-6 rounded-full ${
                          config.step < stageConfig.step ? 'bg-primary' : 'bg-secondary'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <p className="mt-2 flex items-center gap-1 text-sm font-medium text-primary">
                <StageIcon className="h-4 w-4" />
                {STAGE_LABELS[workflow.stage]}
              </p>
            </div>

            <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5">
                <User className="h-3 w-3" />
                {workflow.assignee}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                更新於 {new Date(workflow.updatedAt).toLocaleDateString('zh-HK')}
              </span>
            </div>

            {workflow.notes.length > 0 && (
              <div className="mt-4 rounded-lg bg-secondary/50 p-3">
                <p className="text-xs font-semibold text-muted-foreground">最新備註</p>
                {workflow.notes.slice(-2).map((note, index) => (
                  <p key={index} className="mt-1 text-sm text-foreground">
                    • {note}
                  </p>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Button variant="ghost" size="icon" className="hover:bg-secondary">
              <ChevronRight className="h-4 w-4" />
            </Button>
            {workflow.status === 'active' && (
              <Button variant="ghost" size="icon" className="hover:bg-secondary">
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
    color: STAGE_CONFIG[stage as Workflow['stage']].color,
    bgColor: STAGE_CONFIG[stage as Workflow['stage']].bgColor,
  }))

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-secondary to-accent/10 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="relative hidden h-16 w-16 overflow-hidden rounded-xl shadow-md lg:block">
              <Image
                src="/images/data-analysis.jpg"
                alt="Workflow"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <WorkflowIcon className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold text-foreground">工作流程管理</h2>
              </div>
              <p className="mt-1 text-muted-foreground">追蹤和管理學校 AI 教育項目進度</p>
            </div>
          </div>
          <Button className="gap-2 shadow-sm">
            <Plus className="h-4 w-4" />
            新建流程
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        {stageStats.map((stat) => (
          <Card key={stat.stage} className="overflow-hidden border-border/50 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full ${stat.color}`} />
                <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-foreground">{stat.count}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
              <PlayCircle className="h-5 w-5 text-emerald-500" />
              進行中
              <Badge className="bg-emerald-100 text-emerald-700">{activeWorkflows.length}</Badge>
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
              <CheckCircle2 className="h-5 w-5 text-blue-500" />
              已完成
              <Badge className="bg-blue-100 text-blue-700">{completedWorkflows.length}</Badge>
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
