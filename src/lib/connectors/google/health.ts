import { getGoogleReadonlyConfig, googleScopesAreReadOnly } from './config'

export function getGoogleReadonlyHealth() {
  const config = getGoogleReadonlyConfig()
  const scopesAreReadOnly = googleScopesAreReadOnly(config.scopes)
  const warnings: string[] = []

  if (!config.configured) {
    warnings.push('Google OAuth environment variables are not configured; mock-safe mode is active.')
  }

  if (!scopesAreReadOnly) {
    warnings.push('Configured Google scopes include unsupported write access. The adapter will not start OAuth until scopes are read-only.')
  }

  return {
    provider: 'Google Workspace',
    configured: config.configured && scopesAreReadOnly,
    scopes: config.scopes,
    status: config.configured && scopesAreReadOnly ? 'ready' : 'mock-safe',
    warnings,
    safetyBoundary: [
      'Gmail readonly metadata and snippet signal extraction only.',
      'Google Calendar readonly event signal extraction only.',
      'No sending, deleting, archiving, marking read, event creation, calendar editing, or account changes.',
      'No token persistence in this foundation pass.',
    ],
  }
}
