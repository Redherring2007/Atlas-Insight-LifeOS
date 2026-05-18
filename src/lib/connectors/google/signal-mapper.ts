import { buildConnectorSignalSummary } from '../signal-extraction'
import type { ConnectorSignal, ConnectorSignalType } from '../types'
import type { GoogleCalendarEventMetadata, GoogleGmailMessageMetadata } from './types'

const urgentWords = ['urgent', 'asap', 'today', 'overdue', 'blocked', 'blocking', 'priority']
const financeWords = ['invoice', 'payment', 'cashflow', 'budget', 'renewal', 'overdue payment', 'purchase order']
const travelWords = ['flight', 'hotel', 'travel', 'trip', 'itinerary', 'airport']
const opportunityWords = ['proposal', 'contract', 'intro', 'opportunity', 'decision', 'follow up', 'follow-up']
const meetingChangeWords = ['rescheduled', 'moved', 'cancelled', 'canceled', 'new time', 'changed']
const blockerWords = ['blocked', 'blocker', 'issue', 'cannot proceed', 'waiting on']

function includesAny(value: string, words: string[]) {
  const lower = value.toLowerCase()
  return words.some((word) => lower.includes(word))
}

function signalId(prefix: string, id: string, type: ConnectorSignalType) {
  return `google-${prefix}-${id}-${type}`.replace(/[^a-zA-Z0-9-_]/g, '-')
}

function signalFromMessage(message: GoogleGmailMessageMetadata, type: ConnectorSignalType, title: string, confidence: number, action: string): ConnectorSignal {
  const subject = message.subject ?? 'Untitled message'
  const sender = message.from ? ` from ${message.from}` : ''

  return {
    id: signalId('gmail', message.id, type),
    accountId: 'google-workspace-readonly',
    type,
    title,
    summary: `${subject}${sender}. Snippet signal: ${message.snippet ?? 'No snippet available.'}`,
    confidence,
    suggestedQueueAction: action,
    occurredAt: message.internalDate ? new Date(Number(message.internalDate)).toISOString() : new Date().toISOString(),
  }
}

export function mapGmailMetadataToSignals(message: GoogleGmailMessageMetadata): ConnectorSignal[] {
  const searchable = [message.subject, message.snippet, message.from].filter(Boolean).join(' ')
  const signals: ConnectorSignal[] = []

  if (includesAny(searchable, urgentWords)) {
    signals.push(signalFromMessage(message, 'urgent-follow-up', 'Urgent follow-up signal', 0.82, 'Review urgent email signal'))
  }

  if (includesAny(searchable, opportunityWords)) {
    signals.push(signalFromMessage(message, 'client-opportunity', 'Client opportunity signal', 0.74, 'Follow up client'))
  }

  if (includesAny(searchable, meetingChangeWords)) {
    signals.push(signalFromMessage(message, 'meeting-change', 'Meeting change signal', 0.76, 'Check scheduling clash'))
  }

  if (includesAny(searchable, financeWords)) {
    signals.push(signalFromMessage(message, 'finance-pressure', 'Finance pressure signal', 0.72, 'Review finance concern'))
  }

  if (includesAny(searchable, travelWords)) {
    signals.push(signalFromMessage(message, 'travel', 'Travel planning signal', 0.7, 'Review travel brief'))
  }

  if (includesAny(searchable, blockerWords)) {
    signals.push(signalFromMessage(message, 'operational-blocker', 'Operational blocker signal', 0.78, 'Review operational blocker'))
  }

  return signals
}

function signalFromEvent(event: GoogleCalendarEventMetadata, type: ConnectorSignalType, title: string, confidence: number, action: string): ConnectorSignal {
  return {
    id: signalId('calendar', event.id, type),
    accountId: 'google-workspace-readonly',
    type,
    title,
    summary: `${event.summary ?? 'Calendar event'}${event.location ? ` at ${event.location}` : ''}. Start: ${event.start ?? 'unknown'}.`,
    confidence,
    suggestedQueueAction: action,
    occurredAt: event.start ?? new Date().toISOString(),
  }
}

export function mapGoogleCalendarEventToSignals(event: GoogleCalendarEventMetadata): ConnectorSignal[] {
  const searchable = [event.summary, event.description, event.location].filter(Boolean).join(' ')
  const attendeeCount = event.attendees?.length ?? 0
  const signals: ConnectorSignal[] = []

  signals.push(signalFromEvent(event, 'meeting', 'Meeting signal', attendeeCount > 4 ? 0.78 : 0.66, 'Prepare meeting pack'))

  if (includesAny(searchable, travelWords)) {
    signals.push(signalFromEvent(event, 'travel', 'Travel calendar signal', 0.78, 'Review travel brief'))
  }

  if (attendeeCount >= 6) {
    signals.push(signalFromEvent(event, 'schedule-pressure', 'Schedule pressure signal', 0.72, 'Check scheduling clash'))
  }

  if (includesAny(searchable, ['school', 'family', 'doctor', 'personal'])) {
    signals.push(signalFromEvent(event, 'personal-work-clash', 'Personal/work clash signal', 0.68, 'Review calendar clash'))
  }

  if (includesAny(searchable, ['deadline', 'due', 'submission'])) {
    signals.push(signalFromEvent(event, 'deadline', 'Deadline signal', 0.76, 'Review overdue task'))
  }

  if (includesAny(searchable, blockerWords)) {
    signals.push(signalFromEvent(event, 'operational-blocker', 'Operational blocker signal', 0.74, 'Review operational blocker'))
  }

  return signals
}

export function buildGoogleSignalSummary(signals: ConnectorSignal[]) {
  return buildConnectorSignalSummary([], signals)
}
