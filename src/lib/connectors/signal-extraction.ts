import { summarizeConnectionHealth } from './connection-health'
import { mockConnectedAccounts, mockConnectorSignals } from './mock-connected-accounts'
import type { ConnectedAccount, ConnectorSignal, ConnectorSignalSummary, ConnectorSignalType } from './types'

function countSignals(signals: ConnectorSignal[], type: ConnectorSignalType) {
  return signals.filter((signal) => signal.type === type).length
}

export function buildConnectorSignalSummary(
  accounts: ConnectedAccount[] = mockConnectedAccounts,
  signals: ConnectorSignal[] = mockConnectorSignals,
): ConnectorSignalSummary {
  const health = summarizeConnectionHealth(accounts)
  const meetingPressure = countSignals(signals, 'meeting') + countSignals(signals, 'schedule-pressure')
  const travelMentions = countSignals(signals, 'travel')
  const urgentFollowUps = countSignals(signals, 'urgent-follow-up')
  const schedulePressure = countSignals(signals, 'schedule-pressure') + countSignals(signals, 'personal-work-clash')
  const operationalBlockers = countSignals(signals, 'operational-blocker')

  const commandQueueRecommendations = Array.from(new Set(signals.map((signal) => signal.suggestedQueueAction))).slice(0, 5)
  const dailyBriefNotes = [
    meetingPressure > 0 ? 'Upcoming meeting pressure is visible from approved connected accounts.' : 'No meeting pressure signal in the mock connector summary.',
    travelMentions > 0 ? 'A possible travel planning mention should be reviewed calmly.' : 'No travel planning signal in the mock connector summary.',
    urgentFollowUps > 0 ? 'At least one urgent follow-up signal may need review.' : 'No urgent follow-up signal in the mock connector summary.',
    schedulePressure > 0 ? 'One schedule pressure or calendar clash placeholder is visible.' : 'No schedule pressure signal in the mock connector summary.',
    health.warnings.length > 0 ? health.summary : 'Connector health is clear in the mock summary.',
  ]

  return {
    totalSignals: signals.length,
    meetingPressure,
    travelMentions,
    urgentFollowUps,
    schedulePressure,
    operationalBlockers,
    connectorHealthWarnings: health.warnings,
    dailyBriefNotes,
    commandQueueRecommendations,
    summary: `Atlas Connect has ${accounts.length} approved mock accounts and ${signals.length} read-only operational signals available for summaries.`,
  }
}

export function signalsForAccount(accountId: string, signals: ConnectorSignal[] = mockConnectorSignals) {
  return signals.filter((signal) => signal.accountId === accountId)
}
