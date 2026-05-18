import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { decryptConnectedAccountAccessToken, getConnectedAccountForUser, storeConnectedAccountSignals } from '@/lib/connectors/connected-account-store'
import { mockGoogleCalendarEvents, extractGoogleCalendarReadonlySignals, fetchGoogleCalendarReadonlySignals } from '@/lib/connectors/google/calendar-readonly'
import { mockGoogleGmailMessages, extractGmailReadonlySignals, fetchGmailReadonlySignals } from '@/lib/connectors/google/gmail-readonly'
import { buildGoogleSignalSummary } from '@/lib/connectors/google/signal-mapper'
import { getGoogleReadonlyHealth } from '@/lib/connectors/google/health'

function bearerToken(request: Request) {
  const auth = request.headers.get('authorization') ?? ''
  return auth.toLowerCase().startsWith('bearer ') ? auth.slice(7).trim() : ''
}

function mockSafeResponse(health: ReturnType<typeof getGoogleReadonlyHealth>, reason: string) {
  const signals = [
    ...extractGmailReadonlySignals(mockGoogleGmailMessages),
    ...extractGoogleCalendarReadonlySignals(mockGoogleCalendarEvents),
  ]

  return NextResponse.json({
    provider: 'Google Workspace',
    source: 'mock-safe',
    live: false,
    signals,
    summary: buildGoogleSignalSummary(signals),
    health,
    safety: reason,
  })
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const connectedAccountId = url.searchParams.get('connectedAccountId')
  const suppliedAccessToken = bearerToken(request)
  const health = getGoogleReadonlyHealth()

  if (!health.configured) {
    return mockSafeResponse(health, 'Google OAuth is not configured. Returning sanitised mock read-only signals only.')
  }

  try {
    let accessToken = suppliedAccessToken
    let persistedAccountId: string | null = null

    if (connectedAccountId) {
      const session = await getServerSession(authOptions)
      if (!session?.user?.id) return mockSafeResponse(health, 'Sign in before syncing stored Google read-only signals.')

      const account = await getConnectedAccountForUser(session.user.id, connectedAccountId)
      if (!account || account.provider !== 'google-workspace') {
        return mockSafeResponse(health, 'Stored Google account was not available. Returning mock-safe signals.')
      }

      accessToken = decryptConnectedAccountAccessToken(account)
      persistedAccountId = account.id
    }

    if (!accessToken) {
      return mockSafeResponse(health, 'No live token was available. Returning sanitised mock read-only signals only.')
    }

    const gmailSignals = await fetchGmailReadonlySignals(accessToken)
    const calendarSignals = await fetchGoogleCalendarReadonlySignals(accessToken)
    const signals = [...gmailSignals, ...calendarSignals]

    if (persistedAccountId) {
      await storeConnectedAccountSignals(persistedAccountId, signals)
    }

    return NextResponse.json({
      provider: 'Google Workspace',
      source: persistedAccountId ? 'stored-live-readonly' : 'live-readonly',
      live: true,
      persisted: Boolean(persistedAccountId),
      signals,
      summary: buildGoogleSignalSummary(signals),
      health,
      safety: 'Live Google read-only signal extraction used approved read-only access only. No email body storage, attachments, mutations, or autonomous actions were performed.',
    })
  } catch (error) {
    const response = mockSafeResponse(health, 'Atlas fell back to sanitised mock signals. No external action was taken.')
    response.headers.set('x-atlas-connect-error', error instanceof Error ? error.message : 'Google read-only signal extraction failed.')
    return response
  }
}
