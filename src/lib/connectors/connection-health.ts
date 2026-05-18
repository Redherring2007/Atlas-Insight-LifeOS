import type { ConnectedAccount, ConnectorHealthStatus } from './types'

export function connectionHealthLabel(status: ConnectorHealthStatus) {
  switch (status) {
    case 'healthy': return 'Healthy'
    case 'needs-review': return 'Needs review'
    case 'setup-required': return 'Setup required'
    case 'paused': return 'Paused'
  }
}

export function summarizeConnectionHealth(accounts: ConnectedAccount[]) {
  const warnings = accounts
    .filter((account) => account.healthStatus !== 'healthy')
    .map((account) => `${account.label}: ${connectionHealthLabel(account.healthStatus)}`)

  return {
    totalAccounts: accounts.length,
    healthyAccounts: accounts.filter((account) => account.healthStatus === 'healthy').length,
    warnings,
    summary: warnings.length > 0
      ? `${warnings.length} connected account needs attention before signals are complete.`
      : 'All connected account mocks are healthy for read-only signal review.',
  }
}
