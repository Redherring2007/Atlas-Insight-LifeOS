import type { ProjectContext } from './types'

export function buildProjectContext(): ProjectContext {
  return {
    activeProjects: 4,
    stalledProjects: ['Client delivery stabilisation'],
    overdueMilestones: ['Weekly stakeholder summary'],
    operationalPressure: 'moderate',
    summary: 'One project appears stalled while four active projects remain in motion.',
  }
}
