export type PressureLevel = 'low' | 'moderate' | 'elevated'

export interface TaskContext {
  overdueCount: number
  urgentCount: number
  blockedTasks: string[]
  upcomingDeadlines: string[]
  focusLoad: PressureLevel
  summary: string
}

export interface ProjectContext {
  activeProjects: number
  stalledProjects: string[]
  overdueMilestones: string[]
  operationalPressure: PressureLevel
  summary: string
}

export interface CommandQueueContext {
  pendingApprovals: number
  ignoredActions: number
  snoozedActions: number
  escalationCandidates: string[]
  summary: string
}

export interface FinanceContext {
  cashflowConcernLevel: PressureLevel
  overdueInvoices: number
  upcomingPayments: string[]
  operationalFinancePressure: PressureLevel
  summary: string
}

export interface CalendarContext {
  meetingsToday: number
  protectedFocusBlocks: number
  scheduleConflicts: string[]
  workLifePressure: PressureLevel
  summary: string
}

export interface RiskContext {
  operationalConcerns: string[]
  workloadPressure: PressureLevel
  continuityIndicators: string[]
  travelWorkConflicts: string[]
  executiveWorkloadRisk: PressureLevel
  summary: string
}

export interface PriorityContext {
  primaryFocus: string
  secondaryFocus: string[]
  deferCandidates: string[]
  summary: string
}

export interface FocusAnalysisContext {
  focusPressure: PressureLevel
  recommendedFocusWindow: string
  contextSwitchingRisk: PressureLevel
  suggestedNextMove: string
  summary: string
}

export interface DailyBriefContext {
  topPriorities: string[]
  blockers: string[]
  opportunities: string[]
  riskAndContinuityNotes: string[]
  commandQueueRecommendations: string[]
  recommendedNextAction: string
  summary: string
}

export interface OperationalState {
  generatedAt: string
  summary: string
  workloadPressure: PressureLevel
  focusPressure: PressureLevel
  approvalLoad: PressureLevel
  financePressure: PressureLevel
  riskLevel: PressureLevel
  blockers: string[]
  opportunities: string[]
  riskIndicators: string[]
  contextSignals: string[]
  tasks: TaskContext
  projects: ProjectContext
  commandQueue: CommandQueueContext
  finance: FinanceContext
  calendar: CalendarContext
  risk: RiskContext
  priorities: PriorityContext
  focusAnalysis: FocusAnalysisContext
  dailyBrief: DailyBriefContext
}

export interface OperationalSnapshot {
  summary: string
  signals: string[]
  workloadPressure: PressureLevel
  focusPressure: PressureLevel
  approvalLoad: PressureLevel
  financePressure: PressureLevel
  riskLevel: PressureLevel
}
