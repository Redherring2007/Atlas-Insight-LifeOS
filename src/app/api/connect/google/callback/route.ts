import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { persistConnectedAccount } from '@/lib/connectors/connected-account-store'
import { getGoogleReadonlyConfig } from '@/lib/connectors/google/config'
import { getGoogleReadonlyHealth } from '@/lib/connectors/google/health'
import { exchangeGoogleCodeForTokens, fetchGoogleReadonlyProfile } from '@/lib/connectors/google/oauth'
import { verifySignedOAuthState } from '@/lib/connectors/oauth-state'
import { tokenEncryptionIsConfigured } from '@/lib/connectors/token-crypto'

function redirectToConnect(request: Request, status: string, detail?: string) {
  const url = new URL('/connect', request.url)
  url.searchParams.set('google', status)
  if (detail) url.searchParams.set('detail', detail)
  return NextResponse.redirect(url)
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const error = url.searchParams.get('error')
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const health = getGoogleReadonlyHealth()
  const session = await getServerSession(authOptions)

  if (error) {
    return redirectToConnect(request, 'error', 'google_oauth_denied')
  }

  const verifiedState = verifySignedOAuthState(state, 'google')
  if (!verifiedState.ok) {
    return redirectToConnect(request, 'error', 'invalid_state')
  }

  if (!session?.user?.id || session.user.id !== verifiedState.payload.userId) {
    return redirectToConnect(request, 'error', 'session_mismatch')
  }

  if (!code) {
    return redirectToConnect(request, 'error', 'missing_code')
  }

  if (!health.configured) {
    return redirectToConnect(request, 'mock-safe', 'google_env_not_ready')
  }

  if (!tokenEncryptionIsConfigured()) {
    return redirectToConnect(request, 'encryption-required', 'missing_token_key')
  }

  const tokenResult = await exchangeGoogleCodeForTokens(code)

  if (!tokenResult.ok || !tokenResult.tokenSet) {
    return redirectToConnect(request, 'error', 'token_exchange_failed')
  }

  try {
    const profile = await fetchGoogleReadonlyProfile(tokenResult.tokenSet.accessToken)
    const scopes = tokenResult.tokenSet.scope?.split(' ').filter(Boolean) ?? getGoogleReadonlyConfig().scopes
    const tokenExpiresAt = tokenResult.tokenSet.expiresIn
      ? new Date(Date.now() + tokenResult.tokenSet.expiresIn * 1000)
      : undefined

    const account = await persistConnectedAccount({
      userId: session.user.id,
      provider: 'google-workspace',
      providerAccountId: profile.id,
      accountEmail: profile.email,
      displayName: profile.name,
      scopes,
      accessToken: tokenResult.tokenSet.accessToken,
      refreshToken: tokenResult.tokenSet.refreshToken,
      tokenExpiresAt,
    })

    if (!account) {
      return redirectToConnect(request, 'error', 'storage_unavailable')
    }

    return redirectToConnect(request, 'connected')
  } catch {
    return redirectToConnect(request, 'error', 'storage_failed')
  }
}
