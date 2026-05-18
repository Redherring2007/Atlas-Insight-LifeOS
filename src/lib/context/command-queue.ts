import type { CommandQueueContext } from './types'

export function buildCommandQueueContext(): CommandQueueContext {
  return {
    pendingApprovals: 2,
    ignoredActions: 1,
    snoozedActions: 1,
    escalationCandidates: ['Review overdue task', 'Approve CRM follow-up'],
    summary: 'Two approvals are pending, with one snoozed item worth checking before it drifts.',
  }
}
