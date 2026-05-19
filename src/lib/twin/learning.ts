import { createTwinFeedbackEvent, feedbackSummary } from './feedback'
import { applyTwinAdjustment } from './profile'
import type { TwinAdjustment, TwinFeedbackAction, TwinFeedbackEvent, TwinProfile } from './types'

export function recordTwinLearningEvent(input: {
  action: TwinFeedbackAction
  targetType: TwinFeedbackEvent['targetType']
  targetId: string
  instruction?: string
  beforeText?: string
  afterText?: string
}) {
  const event = createTwinFeedbackEvent(input)

  return {
    event,
    summary: feedbackSummary(event),
    persisted: false,
    note: 'Persistence is represented by the twin_feedback_events migration and will be wired to authenticated storage in a later pass.',
  }
}

export function applyLearningAdjustment(profile: TwinProfile, adjustment: TwinAdjustment) {
  return applyTwinAdjustment(profile, adjustment)
}

export function confidenceAfterFeedback(confidence: number, action: TwinFeedbackAction) {
  if (action === 'approved') return Math.min(0.98, confidence + 0.04)
  if (action === 'edited') return Math.max(0.45, confidence - 0.03)
  if (action === 'rewritten') return Math.max(0.4, confidence - 0.06)
  if (action === 'regenerated') return Math.max(0.35, confidence - 0.08)
  return Math.max(0.25, confidence - 0.12)
}
