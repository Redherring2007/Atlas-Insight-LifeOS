export type CommandQueueActionType =
  | 'email_reply_draft'
  | 'email_outreach_draft'
  | 'calendar_schedule_suggestion'
  | 'task_reschedule_suggestion'
  | 'project_follow_up'
  | 'meeting_pack'
  | 'daily_priority_adjustment'

export type CommandQueueActionStatus = 'ready' | 'needs_guidance' | 'approved' | 'edited' | 'rewritten' | 'regenerated' | 'saved_draft' | 'cancelled' | 'dismissed'
export type CommandQueueSection = 'ready_for_approval' | 'needs_guidance' | 'draft_replies' | 'suggested_scheduling_changes' | 'follow_up_opportunities' | 'priority_recommendations'
export type ActionUrgency = 'low' | 'medium' | 'high'
export type ActionRiskLevel = 'low' | 'medium' | 'high'

export interface PreparedCommandAction {
  id: string
  type: CommandQueueActionType
  section: CommandQueueSection
  title: string
  context: string
  proposedOutput: string
  confidence: number
  urgency: ActionUrgency
  riskLevel: ActionRiskLevel
  sourceSignal: string
  suggestedNextStep: string
  status: CommandQueueActionStatus
}

export interface CommandQueueFeedback {
  actionId: string
  event: 'approve' | 'edit' | 'rewrite' | 'regenerate' | 'save_draft' | 'cancel' | 'dismiss'
  instruction?: string
  createdAt: string
}
