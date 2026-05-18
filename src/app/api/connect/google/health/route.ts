import { NextResponse } from 'next/server'
import { getGoogleReadonlyHealth } from '@/lib/connectors/google/health'

export async function GET() {
  return NextResponse.json({
    provider: 'Google Workspace',
    health: getGoogleReadonlyHealth(),
    safety: {
      readOnly: true,
      noSending: true,
      noDeleting: true,
      noArchiving: true,
      noMarkRead: true,
      noCalendarEditing: true,
      noEventCreation: true,
      noAutoResponding: true,
      noTokenPersistence: true,
    },
  })
}
