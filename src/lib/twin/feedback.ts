import type { TwinFeedbackAction, TwinFeedbackEvent } from './types'

export function createTwinFeedbackEvent(input: {
  action: TwinFeedbackAction
  targetType: TwinFeedbackEvent['targetType']
  targetId: string
  instruction?: string
  beforeText?: string
  afterText?: string
}): TwinFeedbackEvent {
  return {
    id: `twin-feedback-${Date.now()}`,
    action: input.action,
    targetType: input.targetType,
    targetId: input.targetId,
    instruction: input.instruction,
    beforeText: input.beforeText,
    afterText: input.afterText,
    createdAt: new Date().toISOString(),
  }
}

export function feedbackSummary(event: TwinFeedbackEvent) {
  if (event.action === 'approved') return 'Atlas can treat similar suggestions as a stronger match.'
  if (event.action === 'edited') return 'Atlas should learn from the final edited version.'
  if (event.action === 'rewritten') return event.instruction ? `Atlas should rewrite future drafts with: ${event.instruction}.` : 'Atlas should adjust draft style before approval.'
  if (event.action === 'regenerated') return 'Atlas should lower confidence for this draft pattern.'
  return 'Atlas should avoid similar suggestions unless stronger context exists.'
}
