import { NextResponse } from 'next/server'
import { buildGoogleAuthUrl } from '@/lib/connectors/google/oauth'
import { getGoogleReadonlyHealth } from '@/lib/connectors/google/health'

export async function GET() {
  const start = buildGoogleAuthUrl()
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
      noTokenPersistence: true,
      message: 'Atlas reviews approved connected accounts for operational signals only.',
    },
  })
}
