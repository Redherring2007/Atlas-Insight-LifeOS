import type { ConnectionMethod, ProviderDetectionResult } from './types'

interface EmailProviderRule {
  provider: string
  domains: string[]
  connectionMethod: ConnectionMethod
  confidence: number
  setupNotes: string[]
  manualFallback: string
}

export const emailProviderRules: EmailProviderRule[] = [
  {
    provider: 'Gmail / Google Workspace',
    domains: ['gmail.com', 'googlemail.com'],
    connectionMethod: 'oauth-later',
    confidence: 0.96,
    setupNotes: ['Google OAuth read-only consent is the preferred future path.', 'Workspace domains may need admin approval later.'],
    manualFallback: 'Use Gmail export or approved IMAP/app-password setup where permitted by the account owner.',
  },
  {
    provider: 'Microsoft 365 / Outlook / Exchange',
    domains: ['outlook.com', 'hotmail.com', 'live.com', 'msn.com'],
    connectionMethod: 'oauth-later',
    confidence: 0.94,
    setupNotes: ['Microsoft OAuth read-only consent is the preferred future path.', 'Exchange tenant policy may require admin approval later.'],
    manualFallback: 'Use approved Exchange/IMAP read-only setup where available.',
  },
  {
    provider: 'iCloud Mail',
    domains: ['icloud.com', 'me.com', 'mac.com'],
    connectionMethod: 'app-password',
    confidence: 0.9,
    setupNotes: ['iCloud typically requires an app-specific password for mail access.', 'Calendar may use CalDAV in a later implementation.'],
    manualFallback: 'Use app-specific password setup or manual signal import.',
  },
  {
    provider: 'Zoho Mail',
    domains: ['zoho.com', 'zohomail.com'],
    connectionMethod: 'oauth-later',
    confidence: 0.88,
    setupNotes: ['Zoho OAuth read-only consent is the preferred future path.', 'Custom domains may need manual confirmation.'],
    manualFallback: 'Use Zoho approved IMAP read-only setup or manual signal import.',
  },
  {
    provider: 'Yahoo Mail',
    domains: ['yahoo.com', 'ymail.com', 'rocketmail.com'],
    connectionMethod: 'app-password',
    confidence: 0.88,
    setupNotes: ['Yahoo commonly requires app-password setup for mail clients.', 'OAuth can be evaluated later.'],
    manualFallback: 'Use app-password setup or manual signal import.',
  },
  {
    provider: 'Proton Mail Bridge',
    domains: ['proton.me', 'protonmail.com', 'pm.me'],
    connectionMethod: 'bridge',
    confidence: 0.9,
    setupNotes: ['Proton requires Bridge or approved manual export for local client access.', 'Atlas should not attempt direct mailbox access without user setup.'],
    manualFallback: 'Use Proton Mail Bridge locally or manual signal import.',
  },
]

export function buildEmailProviderDetection(rule: EmailProviderRule): ProviderDetectionResult {
  return {
    provider: rule.provider,
    providerType: 'email',
    connectionMethod: rule.connectionMethod,
    confidence: rule.confidence,
    requiredSetupNotes: rule.setupNotes,
    readOnlyCapabilitySummary: {
      canReviewSignals: true,
      canReadMetadata: true,
      canReadBodiesLater: true,
      canWrite: false,
      summary: 'Read-only signal review for meetings, urgent follow-ups, blockers, schedule pressure, and operational context. No sending, deleting, editing, or auto-responding.',
    },
    manualFallbackOption: rule.manualFallback,
  }
}
