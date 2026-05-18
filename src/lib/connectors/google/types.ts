import type { ConnectorSignal } from '../types'

export interface GoogleReadonlyConfig {
  clientId: string
  clientSecret: string
  redirectUri: string
  scopes: string[]
  configured: boolean
}

export interface GoogleReadonlyTokenSet {
  accessToken: string
  refreshToken?: string
  expiresIn?: number
  scope?: string
  tokenType?: string
}

export interface GoogleOAuthStartResult {
  authUrl: string | null
  configured: boolean
  scopes: string[]
  state: string
  setupNotes: string[]
}

export interface GoogleTokenExchangeResult {
  ok: boolean
  tokenSet?: GoogleReadonlyTokenSet
  error?: string
}

export interface GoogleReadonlyProfile {
  id: string
  email?: string
  name?: string
  picture?: string
}

export interface GoogleGmailMessageMetadata {
  id: string
  threadId?: string
  from?: string
  subject?: string
  snippet?: string
  internalDate?: string
  labelIds?: string[]
}

export interface GoogleCalendarEventMetadata {
  id: string
  summary?: string
  description?: string
  location?: string
  start?: string
  end?: string
  attendees?: string[]
  status?: string
}

export interface GoogleSignalMappingResult {
  signals: ConnectorSignal[]
  source: 'gmail' | 'calendar' | 'mock'
}
