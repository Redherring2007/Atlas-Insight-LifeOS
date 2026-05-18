import { mapGmailMetadataToSignals } from './signal-mapper'
import type { ConnectorSignal } from '../types'
import type { GoogleGmailMessageMetadata } from './types'

interface GmailListResponse {
  messages?: Array<{ id?: string, threadId?: string }>
}

interface GmailMessageResponse {
  id?: string
  threadId?: string
  snippet?: string
  internalDate?: string
  labelIds?: string[]
  payload?: {
    headers?: Array<{ name?: string, value?: string }>
  }
}

function headerValue(message: GmailMessageResponse, name: string) {
  return message.payload?.headers?.find((header) => header.name?.toLowerCase() === name.toLowerCase())?.value
}

export function sanitizeGmailMessage(message: GmailMessageResponse): GoogleGmailMessageMetadata {
  return {
    id: message.id ?? 'unknown-message',
    threadId: message.threadId,
    from: headerValue(message, 'From'),
    subject: headerValue(message, 'Subject'),
    snippet: message.snippet,
    internalDate: message.internalDate,
    labelIds: message.labelIds,
  }
}

export function extractGmailReadonlySignals(messages: GoogleGmailMessageMetadata[]): ConnectorSignal[] {
  return messages.flatMap((message) => mapGmailMetadataToSignals(message))
}

export async function fetchGmailReadonlySignals(accessToken: string, maxResults = 10): Promise<ConnectorSignal[]> {
  const listUrl = new URL('https://gmail.googleapis.com/gmail/v1/users/me/messages')
  listUrl.searchParams.set('maxResults', String(maxResults))
  listUrl.searchParams.set('q', 'newer_than:14d')

  const listResponse = await fetch(listUrl.toString(), {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!listResponse.ok) {
    throw new Error(`Gmail read-only list failed with status ${listResponse.status}`)
  }

  const listPayload = await listResponse.json() as GmailListResponse
  const messageRefs = listPayload.messages?.filter((message): message is { id: string, threadId?: string } => Boolean(message.id)) ?? []

  const metadata = await Promise.all(messageRefs.map(async (message) => {
    const messageUrl = new URL(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}`)
    messageUrl.searchParams.set('format', 'metadata')
    messageUrl.searchParams.set('metadataHeaders', 'From')
    messageUrl.searchParams.append('metadataHeaders', 'Subject')

    const response = await fetch(messageUrl.toString(), {
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    if (!response.ok) {
      throw new Error(`Gmail read-only metadata fetch failed with status ${response.status}`)
    }

    return sanitizeGmailMessage(await response.json() as GmailMessageResponse)
  }))

  return extractGmailReadonlySignals(metadata)
}

export const mockGoogleGmailMessages: GoogleGmailMessageMetadata[] = [
  {
    id: 'mock-gmail-urgent-follow-up',
    threadId: 'mock-thread-1',
    from: 'Client Lead <lead@example.com>',
    subject: 'Follow-up needed today on proposal decision',
    snippet: 'Can we confirm the proposal next step today? The client is ready to move if blockers are cleared.',
    internalDate: '1779094800000',
    labelIds: ['INBOX'],
  },
  {
    id: 'mock-gmail-finance-pressure',
    threadId: 'mock-thread-2',
    from: 'Finance Ops <finance@example.com>',
    subject: 'Invoice timing and payment review',
    snippet: 'A payment timing review would help avoid pressure later this week.',
    internalDate: '1779098400000',
    labelIds: ['INBOX'],
  },
]
