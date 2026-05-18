export type ConnectorProviderType = 'email' | 'calendar' | 'email-calendar'

export type ConnectionMethod = 'oauth-later' | 'app-password' | 'bridge' | 'imap' | 'caldav' | 'ics' | 'manual'

export type ConnectorHealthStatus = 'healthy' | 'needs-review' | 'setup-required' | 'paused'

export type ConnectorSignalType =
  | 'meeting'
  | 'meeting-change'
  | 'travel'
  | 'urgent-follow-up'
  | 'client-opportunity'
  | 'finance-pressure'
  | 'schedule-pressure'
  | 'operational-blocker'
  | 'risk-awareness'
  | 'personal-work-clash'
  | 'deadline'

export interface ProviderCapabilitySummary {
  canReviewSignals: boolean
  canReadMetadata: boolean
  canReadBodiesLater: boolean
  canWrite: false
  summary: string
}

export interface ProviderDetectionResult {
  provider: string
  providerType: ConnectorProviderType
  connectionMethod: ConnectionMethod
  confidence: number
  requiredSetupNotes: string[]
  readOnlyCapabilitySummary: ProviderCapabilitySummary
  manualFallbackOption: string
}

export interface ConnectedAccount {
  id: string
  label: string
  accountAddress: string
  provider: string
  providerType: ConnectorProviderType
  connectionMethod: ConnectionMethod
  healthStatus: ConnectorHealthStatus
  lastSignalScanAt: string
  signalTypes: ConnectorSignalType[]
  readOnly: true
}

export interface ConnectorSignal {
  id: string
  accountId: string
  type: ConnectorSignalType
  title: string
  summary: string
  confidence: number
  suggestedQueueAction: string
  occurredAt: string
}

export interface ConnectorSignalSummary {
  totalSignals: number
  meetingPressure: number
  travelMentions: number
  urgentFollowUps: number
  schedulePressure: number
  operationalBlockers: number
  connectorHealthWarnings: string[]
  dailyBriefNotes: string[]
  commandQueueRecommendations: string[]
  summary: string
}
