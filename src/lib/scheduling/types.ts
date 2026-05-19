export interface CalendarBusyBlock {
  id: string
  title: string
  start: string
  end: string
  type: 'meeting' | 'focus' | 'personal' | 'deadline' | 'travel'
}

export interface SchedulableTask {
  id: string
  title: string
  dueAt: string
  estimatedMinutes: number
  priority: 'low' | 'medium' | 'high'
  project?: string
}

export interface ScheduleSuggestion {
  id: string
  title: string
  reason: string
  proposedWindow: string
  confidence: number
  riskLevel: 'low' | 'medium' | 'high'
  approvalRequired: true
}

export interface ScheduleAnalysis {
  workloadDensity: 'light' | 'balanced' | 'heavy'
  overloadedDays: string[]
  deadlineRisks: string[]
  focusWindows: string[]
  suggestions: ScheduleSuggestion[]
}
