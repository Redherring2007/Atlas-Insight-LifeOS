import { buildTwinDraftGuidance, createDefaultTwinProfile } from '@/lib/twin/profile'
import type { TwinProfile } from '@/lib/twin/types'

export interface IncomingEmailSignal {
  id: string
  from: string
  subject: string
  snippet: string
  receivedAt: string
}

export type EmailSignalDecision = 'ignore' | 'draft_reply' | 'draft_follow_up' | 'draft_meeting_confirmation' | 'draft_escalation'

const noiseWords = ['newsletter', 'unsubscribe', 'no-reply', 'noreply', 'promotion', 'sale', 'digest', 'marketing']
const urgencyWords = ['urgent', 'blocked', 'overdue', 'today', 'asap', 'deadline']
const meetingWords = ['meeting', 'reschedule', 'calendar', 'call', 'availability']

export function classifyEmailSignal(email: IncomingEmailSignal): EmailSignalDecision {
  const text = `${email.from} ${email.subject} ${email.snippet}`.toLowerCase()

  if (noiseWords.some((word) => text.includes(word))) return 'ignore'
  if (urgencyWords.some((word) => text.includes(word))) return 'draft_escalation'
  if (meetingWords.some((word) => text.includes(word))) return 'draft_meeting_confirmation'
  if (text.includes('following up') || text.includes('checking in')) return 'draft_follow_up'

  return 'draft_reply'
}

export function shouldDraftReply(email: IncomingEmailSignal) {
  return classifyEmailSignal(email) !== 'ignore'
}

export function draftEmailReply(email: IncomingEmailSignal, profile: TwinProfile = createDefaultTwinProfile()) {
  const guidance = buildTwinDraftGuidance(profile)
  const decision = classifyEmailSignal(email)

  if (decision === 'ignore') {
    return {
      decision,
      confidence: 0.91,
      draft: '',
      note: 'Atlas ignored this as likely promotional or automated noise.',
    }
  }

  const close = profile.traits.commercialAssertiveness === 'high' ? 'If useful, I can confirm the next step today.' : 'Happy to align on the next step.'
  const opener = profile.traits.warmthLevel === 'high' ? 'Thanks for the note - appreciate the context.' : 'Thanks for the update.'
  const body = decision === 'draft_meeting_confirmation'
    ? 'I can make that work. Please send the best time or confirm the proposed slot and I will review the relevant context beforehand.'
    : decision === 'draft_escalation'
      ? 'I have seen this and will prioritise it. I will review the blocker and come back with a clear path forward.'
      : 'I have reviewed the context and agree this is worth moving forward carefully.'

  return {
    decision,
    confidence: profile.traits.confidenceThresholdForDrafts,
    draft: `${opener}\n\n${body}\n\n${close}`,
    note: `${guidance.toneInstruction} ${guidance.safetyInstruction}`,
  }
}

export function rewriteDraftWithInstruction(draft: string, instruction: string) {
  const normalized = instruction.toLowerCase()
  if (normalized.includes('shorter')) return draft.split('\n').filter(Boolean).slice(0, 2).join('\n\n')
  if (normalized.includes('warmer')) return `${draft}\n\nAppreciate it.`
  if (normalized.includes('more direct')) return draft.replace('Happy to align on the next step.', 'Please confirm the next step.')
  if (normalized.includes('stronger close')) return `${draft}\n\nCan you confirm by the end of today?`
  return `${draft}\n\nRevision note: ${instruction}`
}
