'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { mockWorkflows } from '@/lib/mock-data'
import { STAGE_LABELS, type Workflow } from '@/lib/types'
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
} from 'lucide-react'

const STAGE_CONFIG: Record<
  Workflow['stage'],
  { color: string; icon: typeof Search; step: number }
> = {
  discovery: { color: 'bg-blue-400', icon: Search, step: 1 },
  analysis: { color: 'bg-amber-400', icon: Eye, step: 2 },
  recommendation: { color: 'bg-purple-400', icon: MessageSquare, step: 3 },
  implementation: { color: 'bg-emerald-400', icon: PlayCircle, step: 4 },
  review: { color: 'bg-teal-400', icon: CheckCircle2, step: 5 },
}

const STATUS_CONFIG = {
  active: { label: '進行中', color: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30' },
  paused: { label: '已暫停', color: 'bg-amber-400/10 text-amber-400 border-amber-400/30' },
  completed: { label: '已完成', color: 'bg-blue-400/10 text-blue-400 border-blue-400/30' },
}

function WorkflowCard({ workflow }: { workflow: Workflow }) {
  const stageConfig = STAGE_CONFIG[workflow.stage]
  const statusConfig = STATUS_CONFIG[workflow.status]
  const StageIcon = stageConfig.icon

  return (
    <Card className="border-border/50 bg-card/50 transition-all hover:border-primary/50">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-foreground">{workflow.schoolName}</h3>
              <Badge variant="outline" className={statusConfig.color}>
                {statusConfig.label}
              </Badge>
            </div>

            <div className="mt-4">
              <div className="flex items-center gap-2">
                {Object.entries(STAGE_CONFIG).map(([stage, config], index) => (
                  <div key={stage} className="flex items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        config.step <= stageConfig.step
                          ? config.color + ' text-background'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {config.step < stageConfig.step ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <span className="text-xs font-medium">{config.step}</span>
                      )}
                    </div>
                    {index < Object.keys(STAGE_CONFIG).length - 1 && (
                      <div
                        className={`mx-1 h-0.5 w-6 ${
                          config.step < stageConfig.step ? 'bg-primary' : 'bg-muted'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <p className="mt-2 flex items-center gap-1 text-sm text-primary">
                <StageIcon className="h-4 w-4" />
                {STAGE_LABELS[workflow.stage]}
              </p>
            </div>

            <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {workflow.assignee}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                更新於 {new Date(workflow.updatedAt).toLocaleDateString('zh-HK')}
              </span>
            </div>

            {workflow.notes.length > 0 && (
              <div className="mt-4 space-y-1">
                <p className="text-xs font-medium text-muted-foreground">最新備註</p>
                {workflow.notes.slice(-2).map((note, index) => (
                  <p key={index} className="text-sm text-foreground">
                    • {note}
                  </p>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Button variant="ghost" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
            {workflow.status === 'active' && (
              <Button variant="ghost" size="icon">
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
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">工作流程管理</h2>
          <p className="mt-1 text-muted-foreground">追蹤和管理學校 AI 教育項目進度</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          新建流程
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        {stageStats.map((stat) => (
          <Card key={stat.stage} className="border-border/50 bg-card/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full ${stat.color}`} />
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-foreground">{stat.count}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <PlayCircle className="h-5 w-5 text-emerald-400" />
              進行中
              <Badge variant="secondary">{activeWorkflows.length}</Badge>
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
            <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <CheckCircle2 className="h-5 w-5 text-blue-400" />
              已完成
              <Badge variant="secondary">{completedWorkflows.length}</Badge>
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
