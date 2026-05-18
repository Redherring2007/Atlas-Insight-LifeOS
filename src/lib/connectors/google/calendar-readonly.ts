import { mapGoogleCalendarEventToSignals } from './signal-mapper'
import type { ConnectorSignal } from '../types'
import type { GoogleCalendarEventMetadata } from './types'

interface GoogleCalendarEventsResponse {
  items?: Array<{
    id?: string
    summary?: string
    description?: string
    location?: string
    status?: string
    start?: { dateTime?: string, date?: string }
    end?: { dateTime?: string, date?: string }
    attendees?: Array<{ email?: string }>
  }>
}

function sanitizeCalendarEvent(event: NonNullable<GoogleCalendarEventsResponse['items']>[number]): GoogleCalendarEventMetadata {
  return {
    id: event.id ?? 'unknown-event',
    summary: event.summary,
    description: event.description,
    location: event.location,
    status: event.status,
    start: event.start?.dateTime ?? event.start?.date,
    end: event.end?.dateTime ?? event.end?.date,
    attendees: event.attendees?.map((attendee) => attendee.email ?? '').filter(Boolean),
  }
}

export function extractGoogleCalendarReadonlySignals(events: GoogleCalendarEventMetadata[]): ConnectorSignal[] {
  return events.flatMap((event) => mapGoogleCalendarEventToSignals(event))
}

export async function fetchGoogleCalendarReadonlySignals(accessToken: string, calendarId = 'primary', maxResults = 10): Promise<ConnectorSignal[]> {
  const eventsUrl = new URL(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`)
  eventsUrl.searchParams.set('singleEvents', 'true')
  eventsUrl.searchParams.set('orderBy', 'startTime')
  eventsUrl.searchParams.set('maxResults', String(maxResults))
  eventsUrl.searchParams.set('timeMin', new Date().toISOString())

  const response = await fetch(eventsUrl.toString(), {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!response.ok) {
    throw new Error(`Google Calendar read-only events fetch failed with status ${response.status}`)
  }

  const payload = await response.json() as GoogleCalendarEventsResponse
  const events = payload.items?.map(sanitizeCalendarEvent) ?? []

  return extractGoogleCalendarReadonlySignals(events)
}

export const mockGoogleCalendarEvents: GoogleCalendarEventMetadata[] = [
  {
    id: 'mock-calendar-client-review',
    summary: 'Client review meeting',
    description: 'Prepare proposal blockers and next-step options before the meeting.',
    location: 'Google Meet',
    start: '2026-05-19T10:00:00.000Z',
    end: '2026-05-19T10:45:00.000Z',
    attendees: ['operator@example.com', 'client@example.com', 'advisor@example.com', 'ops@example.com', 'finance@example.com', 'lead@example.com'],
    status: 'confirmed',
  },
  {
    id: 'mock-calendar-travel-planning',
    summary: 'Travel planning window',
    description: 'Check itinerary and schedule pressure before confirming meetings.',
    location: 'Dubai',
    start: '2026-05-20T08:00:00.000Z',
    end: '2026-05-20T09:00:00.000Z',
    attendees: ['operator@example.com'],
    status: 'confirmed',
  },
]
