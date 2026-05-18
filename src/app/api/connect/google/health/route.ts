import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { listConnectedAccountsForUser } from '@/lib/connectors/connected-account-store'
import { getGoogleReadonlyHealth } from '@/lib/connectors/google/health'
import { tokenEncryptionIsConfigured } from '@/lib/connectors/token-crypto'

export async function GET() {
  const session = await getServerSession(authOptions)
  const googleAccounts = session?.user?.id
    ? await listConnectedAccountsForUser(session.user.id).catch(() => [])
    : []

  return NextResponse.json({
    provider: 'Google Workspace',
    health: {
      ...getGoogleReadonlyHealth(),
      tokenEncryptionConfigured: tokenEncryptionIsConfigured(),
      connectedAccounts: googleAccounts.filter((account) => account.provider === 'google-workspace'),
    },
    safety: {
      readOnly: true,
      noSending: true,
      noDeleting: true,
      noArchiving: true,
      noMarkRead: true,
      noCalendarEditing: true,
      noEventCreation: true,
      noAutoResponding: true,
      noTokenLogging: true,
    },
  })
}
