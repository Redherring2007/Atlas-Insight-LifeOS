export type PlanningFeedType = 'today' | 'upcoming' | 'deadline' | 'overdue' | 'prep' | 'focus'

export interface PlanningFeedItem {
  id: string
  type: PlanningFeedType
  title: string
  timeLabel: string
  detail: string
  pressure: 'low' | 'medium' | 'high'
}

export interface CalendarPlanningState {
  today: PlanningFeedItem[]
  upcoming: PlanningFeedItem[]
  deadlines: PlanningFeedItem[]
  overdue: PlanningFeedItem[]
  unscheduledTasks: PlanningFeedItem[]
  focusProtection: string[]
  meetingPrep: string[]
}
