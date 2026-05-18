import type { ConnectionMethod, ProviderDetectionResult } from './types'

interface CalendarProviderRule {
  provider: string
  domains: string[]
  connectionMethod: ConnectionMethod
  confidence: number
  setupNotes: string[]
  manualFallback: string
}

export const calendarProviderRules: CalendarProviderRule[] = [
  {
    provider: 'Google Calendar',
    domains: ['gmail.com', 'googlemail.com'],
    connectionMethod: 'oauth-later',
    confidence: 0.94,
    setupNotes: ['Google Calendar read-only OAuth is the preferred future path.'],
    manualFallback: 'Use a read-only ICS feed where appropriate.',
  },
  {
    provider: 'Microsoft 365 / Outlook Calendar',
    domains: ['outlook.com', 'hotmail.com', 'live.com', 'msn.com'],
    connectionMethod: 'oauth-later',
    confidence: 0.92,
    setupNotes: ['Microsoft calendar read-only OAuth is the preferred future path.'],
    manualFallback: 'Use an approved ICS feed or tenant-approved read-only setup.',
  },
  {
    provider: 'iCloud / CalDAV',
    domains: ['icloud.com', 'me.com', 'mac.com'],
    connectionMethod: 'caldav',
    confidence: 0.86,
    setupNotes: ['iCloud calendar access may use app-specific passwords and CalDAV later.'],
    manualFallback: 'Use read-only ICS feed where available.',
  },
]

export function buildCalendarProviderDetection(rule: CalendarProviderRule): ProviderDetectionResult {
  return {
    provider: rule.provider,
    providerType: 'calendar',
    connectionMethod: rule.connectionMethod,
    confidence: rule.confidence,
    requiredSetupNotes: rule.setupNotes,
    readOnlyCapabilitySummary: {
      canReviewSignals: true,
      canReadMetadata: true,
      canReadBodiesLater: false,
      canWrite: false,
      summary: 'Read-only calendar signal review for meetings, travel planning, schedule pressure, and personal/work clashes. No event creation, deletion, editing, or account changes.',
    },
    manualFallbackOption: rule.manualFallback,
  }
}
