'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { mockWorkflows } from '@/mocks'
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
  Leaf,
} from 'lucide-react'

const STAGE_CONFIG: Record<
  Workflow['stage'],
  { color: string; bgColor: string; icon: typeof Search; step: number }
> = {
  discovery: { color: 'bg-blue-500', bgColor: 'bg-blue-50 text-blue-700', icon: Search, step: 1 },
  analysis: { color: 'bg-amber-500', bgColor: 'bg-amber-50 text-amber-700', icon: Eye, step: 2 },
  recommendation: { color: 'bg-violet-500', bgColor: 'bg-violet-50 text-violet-700', icon: MessageSquare, step: 3 },
  implementation: { color: 'bg-emerald-500', bgColor: 'bg-emerald-50 text-emerald-700', icon: PlayCircle, step: 4 },
  review: { color: 'bg-cyan-500', bgColor: 'bg-cyan-50 text-cyan-700', icon: CheckCircle2, step: 5 },
}

const STATUS_CONFIG = {
  active: { label: '進行中', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  paused: { label: '已暫停', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  completed: { label: '已完成', color: 'bg-blue-50 text-blue-700 border-blue-200' },
}

function WorkflowCard({ workflow }: { workflow: Workflow }) {
  const stageConfig = STAGE_CONFIG[workflow.stage]
  const statusConfig = STATUS_CONFIG[workflow.status]
  const StageIcon = stageConfig.icon

  return (
    <Card className="border-border transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-foreground">{workflow.schoolName}</h3>
              <Badge variant="outline" className={`border text-xs ${statusConfig.color}`}>
                {statusConfig.label}
              </Badge>
            </div>

            <div className="mt-3">
              <div className="flex items-center gap-1.5">
                {Object.entries(STAGE_CONFIG).map(([stage, config], index) => (
                  <div key={stage} className="flex items-center">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-medium ${
                        config.step <= stageConfig.step
                          ? `${config.color} text-white`
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {config.step < stageConfig.step ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : (
                        config.step
                      )}
                    </div>
                    {index < Object.keys(STAGE_CONFIG).length - 1 && (
                      <div
                        className={`mx-0.5 h-0.5 w-4 rounded-full ${
                          config.step < stageConfig.step ? config.color : 'bg-muted'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <p className="mt-2 flex items-center gap-1.5 text-sm">
                <span className={`rounded p-1 ${stageConfig.color}`}>
                  <StageIcon className="h-3 w-3 text-white" />
                </span>
                <span className="font-medium text-foreground">{STAGE_LABELS[workflow.stage]}</span>
              </p>
            </div>

            <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {workflow.assignee}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date(workflow.updatedAt).toLocaleDateString('zh-HK')}
              </span>
            </div>

            {workflow.notes.length > 0 && (
              <div className="mt-3 rounded-lg border border-border bg-muted/30 p-2.5">
                <p className="text-[10px] font-medium text-muted-foreground">最新備註</p>
                {workflow.notes.slice(-1).map((note, index) => (
                  <p key={index} className="mt-0.5 text-xs text-foreground">{note}</p>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <ChevronRight className="h-4 w-4" />
            </Button>
            {workflow.status === 'active' && (
              <Button variant="ghost" size="icon" className="h-7 w-7">
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
    ...STAGE_CONFIG[stage as Workflow['stage']],
  }))

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-5">
          <svg viewBox="0 0 100 100" className="h-full w-full">
            <path d="M10,50 L30,50 L30,30 L50,30 L50,50 L70,50 L70,70 L90,70" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" />
          </svg>
        </div>
        <div className="relative z-10 flex items-center justify-between p-6">
          <div className="flex items-center gap-5">
            <div className="relative hidden h-16 w-16 overflow-hidden rounded-xl border border-border lg:block">
              <Image
                src="/images/growth-chart.jpg"
                alt="Workflow"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="mb-1.5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                <Leaf className="h-3 w-3" />
                流程管理
              </div>
              <h2 className="text-xl font-semibold text-foreground">工作流程管理</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">追蹤和管理學校 AI 教育項目進度</p>
            </div>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            新建流程
          </Button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-5">
        {stageStats.map((stat) => (
          <Card key={stat.stage} className="border-border">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <div className={`h-2.5 w-2.5 rounded-full ${stat.color}`} />
                <span className="text-xs font-medium text-muted-foreground">{stat.label}</span>
              </div>
              <p className="mt-1.5 text-2xl font-semibold text-foreground">{stat.count}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <PlayCircle className="h-4 w-4 text-success" />
            <h3 className="font-medium text-foreground">進行中</h3>
            <Badge variant="secondary" className="text-xs">{activeWorkflows.length}</Badge>
          </div>
          <div className="space-y-3">
            {activeWorkflows.map((workflow) => (
              <WorkflowCard key={workflow.id} workflow={workflow} />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-info" />
            <h3 className="font-medium text-foreground">已完成</h3>
            <Badge variant="secondary" className="text-xs">{completedWorkflows.length}</Badge>
          </div>
          <div className="space-y-3">
            {completedWorkflows.map((workflow) => (
              <WorkflowCard key={workflow.id} workflow={workflow} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
