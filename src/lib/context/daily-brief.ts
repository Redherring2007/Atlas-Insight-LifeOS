import type { DailyBriefContext, OperationalState } from './types'

export function buildDailyBriefContext(state: Omit<OperationalState, 'dailyBrief'>): DailyBriefContext {
  return {
    topPriorities: [state.priorities.primaryFocus, ...state.priorities.secondaryFocus.slice(0, 2)],
    blockers: state.blockers,
    opportunities: state.opportunities,
    riskAndContinuityNotes: state.riskIndicators,
    connectorNotes: state.connectors.dailyBriefNotes,
    commandQueueRecommendations: [...state.commandQueue.escalationCandidates, ...state.connectors.commandQueueRecommendations].slice(0, 6),
    recommendedNextAction: state.focusAnalysis.suggestedNextMove,
    summary: 'A concise brief can keep the day focused on one decision, two approvals, and read-only connector signals for meeting pressure, travel mentions, follow-ups, and schedule clashes.',
  }
}
