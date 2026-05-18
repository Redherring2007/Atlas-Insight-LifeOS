import type { RiskContext } from './types'

export function buildRiskContext(): RiskContext {
  return {
    operationalConcerns: ['Workload concentration', 'Delayed decision path on one project'],
    workloadPressure: 'moderate',
    continuityIndicators: ['Supplier payment timing needs review', 'Stakeholder update should be prepared before drift builds'],
    travelWorkConflicts: ['Travel planning context is placeholder-only in this pass'],
    executiveWorkloadRisk: 'moderate',
    summary: 'Operational resilience is steady, with moderate workload and continuity pressure to keep visible.',
  }
}
