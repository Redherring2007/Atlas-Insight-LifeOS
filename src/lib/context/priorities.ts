import type { PriorityContext } from './types'

export function buildPriorityContext(): PriorityContext {
  return {
    primaryFocus: 'Clear the delayed project decision that unlocks stakeholder communication.',
    secondaryFocus: ['Review finance timing', 'Approve one CRM follow-up', 'Prepare concise daily brief'],
    deferCandidates: ['Non-urgent module exploration', 'Low-impact admin review'],
    summary: 'The highest-leverage move is to clear one project decision before adding new work.',
  }
}
