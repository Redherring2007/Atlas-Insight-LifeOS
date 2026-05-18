import { getGoogleReadonlyConfig, googleScopesAreReadOnly } from './config'
import type { GoogleOAuthStartResult, GoogleReadonlyConfig, GoogleReadonlyProfile, GoogleTokenExchangeResult } from './types'

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'
const GOOGLE_USERINFO_URL = 'https://openidconnect.googleapis.com/v1/userinfo'

function buildState() {
  return `atlas-google-${Date.now().toString(36)}`
}

function safeOAuthConfig(config: GoogleReadonlyConfig) {
  if (!config.configured) {
    return { ok: false, error: 'Google OAuth environment variables are not configured.' }
  }

  if (!googleScopesAreReadOnly(config.scopes)) {
    return { ok: false, error: 'Google connector scopes must remain read-only.' }
  }

  return { ok: true, error: null }
}

export function buildGoogleAuthUrl(state = buildState()): GoogleOAuthStartResult {
  const config = getGoogleReadonlyConfig()
  const safety = safeOAuthConfig(config)

  if (!safety.ok) {
    return {
      authUrl: null,
      configured: false,
      scopes: config.scopes,
      state,
      setupNotes: [safety.error ?? 'Google OAuth is not ready.', 'Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI, and read-only GOOGLE_CONNECT_SCOPES.'],
    }
  }

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    scope: config.scopes.join(' '),
    access_type: 'offline',
    prompt: 'consent',
    state,
    include_granted_scopes: 'true',
  })

  return {
    authUrl: `${GOOGLE_AUTH_URL}?${params.toString()}`,
    configured: true,
    scopes: config.scopes,
    state,
    setupNotes: ['Google will be asked for Gmail read-only and Calendar read-only access only.', 'Atlas will not request write, send, delete, archive, mark-read, or calendar edit permissions.'],
  }
}

async function requestGoogleTokens(body: URLSearchParams): Promise<GoogleTokenExchangeResult> {
  try {
    const response = await fetch(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    })

    if (!response.ok) {
      return { ok: false, error: `Google token request failed with status ${response.status}` }
    }

    const payload = await response.json() as Record<string, unknown>
    const accessToken = typeof payload.access_token === 'string' ? payload.access_token : ''

    if (!accessToken) {
      return { ok: false, error: 'Google token response did not include an access token.' }
    }

    return {
      ok: true,
      tokenSet: {
        accessToken,
        refreshToken: typeof payload.refresh_token === 'string' ? payload.refresh_token : undefined,
        expiresIn: typeof payload.expires_in === 'number' ? payload.expires_in : undefined,
        scope: typeof payload.scope === 'string' ? payload.scope : undefined,
        tokenType: typeof payload.token_type === 'string' ? payload.token_type : undefined,
      },
    }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Google token request failed.' }
  }
}

export async function exchangeGoogleCodeForTokens(code: string): Promise<GoogleTokenExchangeResult> {
  const config = getGoogleReadonlyConfig()
  const safety = safeOAuthConfig(config)

  if (!safety.ok) return { ok: false, error: safety.error ?? 'Google OAuth is not configured.' }

  return requestGoogleTokens(new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    redirect_uri: config.redirectUri,
    grant_type: 'authorization_code',
    code,
  }))
}

export async function refreshGoogleAccessToken(refreshToken: string): Promise<GoogleTokenExchangeResult> {
  const config = getGoogleReadonlyConfig()
  const safety = safeOAuthConfig(config)

  if (!safety.ok) return { ok: false, error: safety.error ?? 'Google OAuth is not configured.' }

  return requestGoogleTokens(new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  }))
}

export async function fetchGoogleReadonlyProfile(accessToken: string): Promise<GoogleReadonlyProfile> {
  const response = await fetch(GOOGLE_USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!response.ok) {
    throw new Error(`Google profile fetch failed with status ${response.status}`)
  }

  const payload = await response.json() as Record<string, unknown>

  return {
    id: typeof payload.sub === 'string' ? payload.sub : 'google-account',
    email: typeof payload.email === 'string' ? payload.email : undefined,
    name: typeof payload.name === 'string' ? payload.name : undefined,
    picture: typeof payload.picture === 'string' ? payload.picture : undefined,
  }
}
