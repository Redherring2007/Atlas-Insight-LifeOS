import { NextResponse } from 'next/server'
import { mockGoogleCalendarEvents, extractGoogleCalendarReadonlySignals, fetchGoogleCalendarReadonlySignals } from '@/lib/connectors/google/calendar-readonly'
import { mockGoogleGmailMessages, extractGmailReadonlySignals, fetchGmailReadonlySignals } from '@/lib/connectors/google/gmail-readonly'
import { buildGoogleSignalSummary } from '@/lib/connectors/google/signal-mapper'
import { getGoogleReadonlyHealth } from '@/lib/connectors/google/health'

function bearerToken(request: Request) {
  const auth = request.headers.get('authorization') ?? ''
  return auth.toLowerCase().startsWith('bearer ') ? auth.slice(7).trim() : ''
}

export async function GET(request: Request) {
  const accessToken = bearerToken(request)
  const health = getGoogleReadonlyHealth()

  if (!accessToken || !health.configured) {
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
      safety: 'No token was provided or Google OAuth is not configured. Returning sanitised mock read-only signals only.',
    })
  }

  try {
    const signals = [
      ...await fetchGmailReadonlySignals(accessToken),
      ...await fetchGoogleCalendarReadonlySignals(accessToken),
    ]

    return NextResponse.json({
      provider: 'Google Workspace',
      source: 'live-readonly',
      live: true,
      signals,
      summary: buildGoogleSignalSummary(signals),
      health,
      safety: 'Live Google read-only signal extraction used the supplied access token for this request only. Tokens were not persisted or returned.',
    })
  } catch (error) {
    const signals = [
      ...extractGmailReadonlySignals(mockGoogleGmailMessages),
      ...extractGoogleCalendarReadonlySignals(mockGoogleCalendarEvents),
    ]

    return NextResponse.json({
      provider: 'Google Workspace',
      source: 'fallback-mock-safe',
      live: false,
      signals,
      summary: buildGoogleSignalSummary(signals),
      health,
      error: error instanceof Error ? error.message : 'Google read-only signal extraction failed.',
      safety: 'Atlas fell back to sanitised mock signals. No external action was taken.',
    }, { status: 200 })
  }
}
