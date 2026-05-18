import type { CalendarContext } from './types'

export function buildCalendarContext(): CalendarContext {
  return {
    meetingsToday: 4,
    protectedFocusBlocks: 1,
    scheduleConflicts: ['Late meeting may compress personal admin window'],
    workLifePressure: 'moderate',
    summary: 'The day has meeting pressure, but one protected focus block remains available.',
  }
}
