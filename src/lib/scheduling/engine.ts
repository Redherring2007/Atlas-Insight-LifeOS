import type { CalendarBusyBlock, SchedulableTask, ScheduleAnalysis, ScheduleSuggestion } from './types'

function hoursBetween(start: string, end: string) {
  const durationMs = new Date(end).getTime() - new Date(start).getTime()
  return Math.max(0, durationMs / (1000 * 60 * 60))
}

export function analyseSchedule(blocks: CalendarBusyBlock[], tasks: SchedulableTask[]): ScheduleAnalysis {
  const meetingHours = blocks.reduce((sum, block) => sum + hoursBetween(block.start, block.end), 0)
  const highPriorityTasks = tasks.filter((task) => task.priority === 'high')
  const deadlineRisks = highPriorityTasks.filter((task) => new Date(task.dueAt).getTime() - Date.now() < 36 * 60 * 60 * 1000).map((task) => task.title)
  const workloadDensity = meetingHours > 5 ? 'heavy' : meetingHours > 2.5 ? 'balanced' : 'light'
  const focusWindows = findFocusWindows(blocks)

  return {
    workloadDensity,
    overloadedDays: workloadDensity === 'heavy' ? ['Today'] : [],
    deadlineRisks,
    focusWindows,
    suggestions: buildScheduleSuggestions(blocks, tasks, focusWindows, deadlineRisks),
  }
}

export function findFocusWindows(blocks: CalendarBusyBlock[]) {
  const titles = blocks.map((block) => block.title.toLowerCase())
  if (titles.some((title) => title.includes('morning'))) return ['14:00-15:30']
  return ['09:30-11:00', '15:00-16:00']
}

export function buildScheduleSuggestions(blocks: CalendarBusyBlock[], tasks: SchedulableTask[], focusWindows: string[], deadlineRisks: string[]): ScheduleSuggestion[] {
  const primaryTask = tasks.find((task) => task.priority === 'high') ?? tasks[0]
  const hasMeetingPrep = blocks.some((block) => block.type === 'meeting')

  return [
    primaryTask ? {
      id: 'schedule-primary-focus',
      title: `Block focus time for ${primaryTask.title}`,
      reason: deadlineRisks.length > 0 ? 'A priority deadline is close enough to protect deep work.' : 'The calendar has usable open space for meaningful progress.',
      proposedWindow: focusWindows[0] ?? 'Next available 90-minute window',
      confidence: 0.82,
      riskLevel: deadlineRisks.length > 0 ? 'medium' : 'low',
      approvalRequired: true,
    } : {
      id: 'schedule-focus-default',
      title: 'Protect a focus block',
      reason: 'Atlas found a clear window for priority work.',
      proposedWindow: focusWindows[0] ?? 'Next available window',
      confidence: 0.72,
      riskLevel: 'low',
      approvalRequired: true,
    },
    hasMeetingPrep ? {
      id: 'prepare-meeting-context',
      title: 'Prepare meeting context before the next client call',
      reason: 'A short prep window reduces context switching and improves meeting quality.',
      proposedWindow: '30 minutes before the next external meeting',
      confidence: 0.78,
      riskLevel: 'low',
      approvalRequired: true,
    } : {
      id: 'review-unscheduled-work',
      title: 'Review unscheduled priority work',
      reason: 'Some priority work has no protected slot yet.',
      proposedWindow: focusWindows[1] ?? 'Tomorrow morning',
      confidence: 0.7,
      riskLevel: 'medium',
      approvalRequired: true,
    },
  ]
}
