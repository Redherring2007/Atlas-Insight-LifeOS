export type TwinTraitLevel = 'low' | 'balanced' | 'high'

export type MessageLengthPreference = 'short' | 'balanced' | 'detailed'
export type DecisionBias = 'speed' | 'evidence' | 'relationship' | 'balanced'
export type ApologyStyle = 'brief_accountable' | 'warm_repair' | 'direct_reset'
export type DelegationStyle = 'clear_owner_deadline' | 'collaborative' | 'direct_priority'
export type CalendarProtectionStyle = 'protect_focus_first' | 'protect_meetings_first' | 'balanced'

export interface TwinScenarioQuestion {
  id: string
  title: string
  prompt: string
  placeholder: string
}

export interface TwinScenarioResponse {
  scenarioId: string
  response: string
}

export interface TwinProfileTraits {
  writingDirectness: TwinTraitLevel
  warmthLevel: TwinTraitLevel
  formalityLevel: TwinTraitLevel
  messageLengthPreference: MessageLengthPreference
  commercialAssertiveness: TwinTraitLevel
  apologyStyle: ApologyStyle
  followUpPressure: TwinTraitLevel
  decisionBias: DecisionBias
  delegationStyle: DelegationStyle
  calendarProtectionStyle: CalendarProtectionStyle
  phrasesToUse: string[]
  phrasesToAvoid: string[]
  confidenceThresholdForDrafts: number
  rewritePreferences: string[]
}

export interface TwinProfile {
  id: string
  userId?: string
  status: 'default' | 'inferred' | 'adjusted'
  summary: string
  traits: TwinProfileTraits
  scenarioResponses: TwinScenarioResponse[]
  createdAt: string
  updatedAt: string
}

export type TwinAdjustment =
  | 'warmer'
  | 'shorter'
  | 'more_direct'
  | 'less_salesy'
  | 'more_professional'
  | 'stronger_close'
  | 'protect_focus_time_more'

export type TwinFeedbackAction = 'approved' | 'edited' | 'rewritten' | 'dismissed' | 'regenerated'

export interface TwinFeedbackEvent {
  id: string
  action: TwinFeedbackAction
  targetType: 'email_draft' | 'schedule_suggestion' | 'command_queue_action' | 'priority_recommendation'
  targetId: string
  instruction?: string
  beforeText?: string
  afterText?: string
  createdAt: string
}

export interface TwinDraftGuidance {
  toneInstruction: string
  lengthInstruction: string
  pressureInstruction: string
  safetyInstruction: string
  rewritePreferences: string[]
}
