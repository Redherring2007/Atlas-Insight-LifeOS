import type { TaskContext } from './types'

export function buildTaskContext(): TaskContext {
  return {
    overdueCount: 3,
    urgentCount: 2,
    blockedTasks: ['Confirm project owner for delayed client delivery', 'Resolve finance timing question before supplier payment'],
    upcomingDeadlines: ['Stakeholder summary due today', 'CRM follow-up window closes tomorrow'],
    focusLoad: 'elevated',
    summary: 'Three priorities are overdue, with two urgent items creating elevated focus load.',
  }
}
