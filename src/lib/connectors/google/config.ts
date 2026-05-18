import type { GoogleReadonlyConfig } from './types'

const DEFAULT_GOOGLE_READONLY_SCOPES = [
  'openid',
  'email',
  'profile',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/calendar.readonly',
]

function parseScopes(value?: string) {
  if (!value) return DEFAULT_GOOGLE_READONLY_SCOPES

  const scopes = value
    .split(/[\s,]+/)
    .map((scope) => scope.trim())
    .filter(Boolean)

  return scopes.length > 0 ? scopes : DEFAULT_GOOGLE_READONLY_SCOPES
}

export function getGoogleReadonlyScopes() {
  return parseScopes(process.env.GOOGLE_CONNECT_SCOPES)
}

export function getGoogleReadonlyConfig(): GoogleReadonlyConfig {
  const clientId = process.env.GOOGLE_CLIENT_ID ?? ''
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET ?? ''
  const redirectUri = process.env.GOOGLE_REDIRECT_URI ?? 'http://localhost:3000/api/connect/google/callback'
  const scopes = getGoogleReadonlyScopes()

  return {
    clientId,
    clientSecret,
    redirectUri,
    scopes,
    configured: Boolean(clientId && clientSecret && redirectUri),
  }
}

export function googleScopesAreReadOnly(scopes: string[]) {
  return scopes.every((scope) => {
    const normalized = scope.toLowerCase()
    return normalized === 'openid'
      || normalized === 'email'
      || normalized === 'profile'
      || normalized === 'https://www.googleapis.com/auth/gmail.readonly'
      || normalized === 'https://www.googleapis.com/auth/calendar.readonly'
  })
}
