import { draftEmailReply, type IncomingEmailSignal } from './email-drafts'
import type { CommandQueueFeedback, PreparedCommandAction } from './types'

const sampleEmail: IncomingEmailSignal = {
  id: 'email-signal-1',
  from: 'maya@northstar.example',
  subject: 'Quick follow-up on proposal timing',
  snippet: 'Checking whether you are still comfortable moving this forward this week.',
  receivedAt: new Date().toISOString(),
}

const replyDraft = draftEmailReply(sampleEmail)

export const preparedCommandActions: PreparedCommandAction[] = [
  {
    id: 'approve-client-reply-draft',
    type: 'email_reply_draft',
    section: 'draft_replies',
    title: 'Review client reply draft',
    context: 'A warm commercial thread needs a concise reply. Atlas ignored promotional noise and prepared only the human follow-up.',
    proposedOutput: replyDraft.draft,
    confidence: replyDraft.confidence,
    urgency: 'medium',
    riskLevel: 'low',
    sourceSignal: 'Google Workspace signal: client follow-up',
    suggestedNextStep: 'Edit or approve the draft. Nothing will be sent until you explicitly approve sending.',
    status: 'ready',
  },
  {
    id: 'outreach-new-intro',
    type: 'email_outreach_draft',
    section: 'follow_up_opportunities',
    title: 'Draft outreach to new introduction',
    context: 'A new contact may be useful for a current business priority.',
    proposedOutput: 'Thanks for the introduction. Good to connect. I would be interested to compare notes and see whether there is a practical way to help each other. Would a short call next week work?',
    confidence: 0.78,
    urgency: 'medium',
    riskLevel: 'low',
    sourceSignal: 'CRM relationship signal',
    suggestedNextStep: 'Review tone and approve as a draft only.',
    status: 'ready',
  },
  {
    id: 'protect-focus-window',
    type: 'calendar_schedule_suggestion',
    section: 'suggested_scheduling_changes',
    title: 'Protect a deep work block',
    context: 'Today has meeting density after lunch, but 09:30-11:00 is clear enough for priority work.',
    proposedOutput: 'Reserve 09:30-11:00 for the investor update and move low-value admin to tomorrow afternoon.',
    confidence: 0.82,
    urgency: 'high',
    riskLevel: 'medium',
    sourceSignal: 'Calendar workload density',
    suggestedNextStep: 'Approve to place this suggestion into scheduling review. Atlas will not edit the calendar automatically.',
    status: 'ready',
  },
  {
    id: 'reschedule-overdue-task',
    type: 'task_reschedule_suggestion',
    section: 'needs_guidance',
    title: 'Resolve overdue task timing',
    context: 'One overdue project task is creating pressure against a stakeholder update.',
    proposedOutput: 'Move the task to tomorrow morning, assign a clear owner, and prepare a short update for the stakeholder.',
    confidence: 0.7,
    urgency: 'high',
    riskLevel: 'medium',
    sourceSignal: 'Project deadline risk',
    suggestedNextStep: 'Choose owner and timing before Atlas prepares the update.',
    status: 'needs_guidance',
  },
  {
    id: 'prepare-meeting-pack',
    type: 'meeting_pack',
    section: 'ready_for_approval',
    title: 'Prepare meeting pack',
    context: 'A client meeting is coming up and recent signals mention scope, timing, and a pending decision.',
    proposedOutput: 'Create a one-page pack with objective, key context, open decisions, risks, and suggested close.',
    confidence: 0.8,
    urgency: 'medium',
    riskLevel: 'low',
    sourceSignal: 'Calendar meeting plus CRM context',
    suggestedNextStep: 'Approve pack generation for review only.',
    status: 'ready',
  },
  {
    id: 'daily-priority-adjustment',
    type: 'daily_priority_adjustment',
    section: 'priority_recommendations',
    title: 'Adjust today’s top priority',
    context: 'Finance timing and an overdue blocker make the stakeholder update more important than inbox processing.',
    proposedOutput: 'Make the stakeholder update the first meaningful action today, then review two approvals.',
    confidence: 0.76,
    urgency: 'high',
    riskLevel: 'low',
    sourceSignal: 'Operational State Engine',
    suggestedNextStep: 'Accept the priority order or rewrite it with your own constraint.',
    status: 'ready',
  },
]

export function groupPreparedActionsBySection(actions: PreparedCommandAction[]) {
  return actions.reduce<Record<PreparedCommandAction['section'], PreparedCommandAction[]>>((groups, action) => {
    groups[action.section] = [...(groups[action.section] ?? []), action]
    return groups
  }, {
    ready_for_approval: [],
    needs_guidance: [],
    draft_replies: [],
    suggested_scheduling_changes: [],
    follow_up_opportunities: [],
    priority_recommendations: [],
  })
}

export function createCommandQueueFeedback(actionId: string, event: CommandQueueFeedback['event'], instruction?: string): CommandQueueFeedback {
  return {
    actionId,
    event,
    instruction,
    createdAt: new Date().toISOString(),
  }
}
