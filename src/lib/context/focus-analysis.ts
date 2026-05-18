import type { FocusAnalysisContext } from './types'

export function buildFocusAnalysisContext(): FocusAnalysisContext {
  return {
    focusPressure: 'elevated',
    recommendedFocusWindow: 'Use the next protected block for one project decision and one approval review.',
    contextSwitchingRisk: 'moderate',
    suggestedNextMove: 'Confirm the project owner, then approve or dismiss the related queue item.',
    summary: 'Focus pressure is elevated, so the day should stay anchored to one unlocking decision.',
  }
}
