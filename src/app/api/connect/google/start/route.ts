import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { buildGoogleAuthUrl } from '@/lib/connectors/google/oauth'
import { getGoogleReadonlyHealth } from '@/lib/connectors/google/health'
import { createSignedOAuthState } from '@/lib/connectors/oauth-state'

export async function GET() {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  if (!userId) {
    return NextResponse.json({
      provider: 'Google Workspace',
      ok: false,
      error: 'Sign in before connecting Google Workspace read-only access.',
    }, { status: 401 })
  }

  const state = createSignedOAuthState('google', userId)
  const start = buildGoogleAuthUrl(state)
  const health = getGoogleReadonlyHealth()

  return NextResponse.json({
    provider: 'Google Workspace',
    authUrl: start.authUrl,
    configured: start.configured,
    scopes: start.scopes,
    state: start.state,
    setupNotes: start.setupNotes,
    health,
    safety: {
      readOnly: true,
      noWriteAccess: true,
      noTokenLogging: true,
      message: 'Atlas reviews approved connected accounts for operational signals only.',
    },
  })
}
