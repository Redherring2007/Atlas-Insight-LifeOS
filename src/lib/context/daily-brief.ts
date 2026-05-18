import type { DailyBriefContext, OperationalState } from './types'

export function buildDailyBriefContext(state: Omit<OperationalState, 'dailyBrief'>): DailyBriefContext {
  return {
    topPriorities: [state.priorities.primaryFocus, ...state.priorities.secondaryFocus.slice(0, 2)],
    blockers: state.blockers,
    opportunities: state.opportunities,
    riskAndContinuityNotes: state.riskIndicators,
    commandQueueRecommendations: state.commandQueue.escalationCandidates,
    recommendedNextAction: state.focusAnalysis.suggestedNextMove,
    summary: 'A concise brief can keep the day focused on one decision, two approvals, and moderate finance/resilience awareness.',
  }
}
