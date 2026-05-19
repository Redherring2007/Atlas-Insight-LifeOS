import type { CalendarBusyBlock, SchedulableTask } from '@/lib/scheduling/types'
import type { CalendarPlanningState } from './types'

const todayIso = new Date().toISOString()
const tomorrowIso = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

export const planningBusyBlocks: CalendarBusyBlock[] = [
  { id: 'meeting-1', title: 'Client scope review', start: todayIso, end: new Date(Date.now() + 60 * 60 * 1000).toISOString(), type: 'meeting' },
  { id: 'deadline-1', title: 'Stakeholder update deadline', start: tomorrowIso, end: tomorrowIso, type: 'deadline' },
]

export const planningTasks: SchedulableTask[] = [
  { id: 'task-1', title: 'Investor update', dueAt: tomorrowIso, estimatedMinutes: 90, priority: 'high', project: 'Atlas Growth' },
  { id: 'task-2', title: 'CRM follow-up review', dueAt: tomorrowIso, estimatedMinutes: 30, priority: 'medium', project: 'Pipeline' },
]

export function buildCalendarPlanningState(): CalendarPlanningState {
  return {
    today: [
      { id: 'today-1', type: 'today', title: 'Client scope review', timeLabel: '10:00', detail: 'Prep pack suggested before the meeting.', pressure: 'medium' },
      { id: 'today-2', type: 'focus', title: 'Investor update focus block', timeLabel: '09:30-11:00', detail: 'Best available window for deep work.', pressure: 'high' },
    ],
    upcoming: [
      { id: 'upcoming-1', type: 'upcoming', title: 'Finance review', timeLabel: 'Tomorrow', detail: 'Useful to review before weekly commitments lock.', pressure: 'medium' },
    ],
    deadlines: [
      { id: 'deadline-1', type: 'deadline', title: 'Stakeholder update', timeLabel: 'Tomorrow', detail: 'Needs one focused work block and a short summary.', pressure: 'high' },
    ],
    overdue: [
      { id: 'overdue-1', type: 'overdue', title: 'Confirm CRM owner', timeLabel: 'Overdue', detail: 'Should be resolved before the next pipeline review.', pressure: 'medium' },
    ],
    unscheduledTasks: [
      { id: 'unscheduled-1', type: 'today', title: 'Draft project summary', timeLabel: 'Unscheduled', detail: 'Atlas can prepare a Command Queue action for review.', pressure: 'medium' },
    ],
    focusProtection: ['Protect 09:30-11:00 for priority work', 'Avoid adding low-value meetings after 15:00'],
    meetingPrep: ['Prepare objective, open decision, and follow-up options for the client scope review'],
  }
}
