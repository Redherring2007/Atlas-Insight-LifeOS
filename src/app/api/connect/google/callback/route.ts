import { NextResponse } from 'next/server'
import { exchangeGoogleCodeForTokens } from '@/lib/connectors/google/oauth'
import { getGoogleReadonlyHealth } from '@/lib/connectors/google/health'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const error = url.searchParams.get('error')
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const health = getGoogleReadonlyHealth()

  if (error) {
    return NextResponse.json({
      ok: false,
      provider: 'Google Workspace',
      state,
      error: 'Google returned an OAuth error before Atlas could connect read-only access.',
      health,
    }, { status: 400 })
  }

  if (!code) {
    return NextResponse.json({
      ok: false,
      provider: 'Google Workspace',
      state,
      error: 'No OAuth code was provided.',
      health,
    }, { status: 400 })
  }

  if (!health.configured) {
    return NextResponse.json({
      ok: false,
      provider: 'Google Workspace',
      state,
      mockSafe: true,
      message: 'Google OAuth callback shape received, but the adapter is in mock-safe mode because environment configuration is incomplete or scopes are not read-only.',
      health,
    })
  }

  const tokenResult = await exchangeGoogleCodeForTokens(code)

  if (!tokenResult.ok || !tokenResult.tokenSet) {
    return NextResponse.json({
      ok: false,
      provider: 'Google Workspace',
      state,
      error: tokenResult.error ?? 'Google token exchange failed.',
      health,
    }, { status: 400 })
  }

  return NextResponse.json({
    ok: true,
    provider: 'Google Workspace',
    state,
    persisted: false,
    message: 'Google read-only OAuth completed. Tokens were not persisted or returned in this foundation pass.',
    tokenSummary: {
      hasAccessToken: Boolean(tokenResult.tokenSet.accessToken),
      hasRefreshToken: Boolean(tokenResult.tokenSet.refreshToken),
      expiresIn: tokenResult.tokenSet.expiresIn,
      scope: tokenResult.tokenSet.scope,
      tokenType: tokenResult.tokenSet.tokenType,
    },
    health,
  })
}
