import { buildCalendarProviderDetection, calendarProviderRules } from './calendar-providers'
import { buildEmailProviderDetection, emailProviderRules } from './email-providers'
import type { ProviderDetectionResult } from './types'

function domainFromAddress(value: string) {
  const trimmed = value.trim().toLowerCase()
  const domain = trimmed.includes('@') ? trimmed.split('@').pop() : trimmed
  return domain?.replace(/^www\./, '') ?? ''
}

function isBusinessGoogleDomain(domain: string) {
  return domain.endsWith('.edu') || domain.endsWith('.org') || domain.endsWith('.co') || domain.endsWith('.io') || domain.endsWith('.com')
}

export function detectConnectorProvider(addressOrDomain: string): ProviderDetectionResult {
  const domain = domainFromAddress(addressOrDomain)

  const emailRule = emailProviderRules.find((rule) => rule.domains.includes(domain))
  if (emailRule) {
    return buildEmailProviderDetection(emailRule)
  }

  const calendarRule = calendarProviderRules.find((rule) => rule.domains.includes(domain))
  if (calendarRule) {
    return buildCalendarProviderDetection(calendarRule)
  }

  if (domain.includes('outlook') || domain.includes('office365') || domain.includes('exchange')) {
    return {
      provider: 'Microsoft 365 / Exchange custom domain',
      providerType: 'email-calendar',
      connectionMethod: 'oauth-later',
      confidence: 0.72,
      requiredSetupNotes: ['Autodiscover and tenant checks are future placeholders.', 'Admin approval may be required later.'],
      readOnlyCapabilitySummary: {
        canReviewSignals: true,
        canReadMetadata: true,
        canReadBodiesLater: true,
        canWrite: false,
        summary: 'Read-only signal review for approved mail and calendar accounts. No sending, deleting, editing, event creation, or account changes.',
      },
      manualFallbackOption: 'Use Microsoft OAuth later, or approved read-only IMAP/ICS setup where available.',
    }
  }

  if (isBusinessGoogleDomain(domain)) {
    return {
      provider: 'Custom domain, likely Google Workspace or Microsoft 365',
      providerType: 'email-calendar',
      connectionMethod: 'manual',
      confidence: 0.56,
      requiredSetupNotes: ['MX lookup and autodiscover are future placeholders.', 'Choose Google Workspace, Microsoft 365, IMAP, or CalDAV manually when setup is implemented.'],
      readOnlyCapabilitySummary: {
        canReviewSignals: true,
        canReadMetadata: true,
        canReadBodiesLater: true,
        canWrite: false,
        summary: 'Read-only operational signal review after the user approves a provider. Atlas does not send, delete, edit, auto-respond, create events, or change account settings.',
      },
      manualFallbackOption: 'Manual provider selection with Generic IMAP, Generic CalDAV, or read-only ICS feed.',
    }
  }

  return {
    provider: 'Generic IMAP / CalDAV / ICS',
    providerType: 'email-calendar',
    connectionMethod: 'manual',
    confidence: 0.4,
    requiredSetupNotes: ['Provider could not be identified safely from the address alone.', 'Use manual setup when the user explicitly chooses a provider.'],
    readOnlyCapabilitySummary: {
      canReviewSignals: true,
      canReadMetadata: true,
      canReadBodiesLater: true,
      canWrite: false,
      summary: 'Read-only signal review through approved manual setup. Atlas does not send, delete, edit, auto-respond, create events, or change accounts.',
    },
    manualFallbackOption: 'Generic IMAP for email, Generic CalDAV for calendar, or read-only ICS feed for calendar-only visibility.',
  }
}
