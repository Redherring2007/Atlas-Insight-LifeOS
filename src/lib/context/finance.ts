import type { FinanceContext } from './types'

export function buildFinanceContext(): FinanceContext {
  return {
    cashflowConcernLevel: 'moderate',
    overdueInvoices: 1,
    upcomingPayments: ['Supplier payment review this week', 'Subscription renewal check'],
    operationalFinancePressure: 'moderate',
    summary: 'Finance pressure is moderate this week because one invoice and two upcoming payments need review.',
  }
}
