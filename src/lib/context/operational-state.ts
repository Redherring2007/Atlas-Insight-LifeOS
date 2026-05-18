import { buildCalendarContext } from './calendar'
import { buildCommandQueueContext } from './command-queue'
import { buildDailyBriefContext } from './daily-brief'
import { buildFinanceContext } from './finance'
import { buildFocusAnalysisContext } from './focus-analysis'
import { buildPriorityContext } from './priorities'
import { buildProjectContext } from './projects'
import { buildRiskContext } from './risk'
import { buildTaskContext } from './tasks'
import type { OperationalSnapshot, OperationalState } from './types'

export function buildOperationalState(): OperationalState {
  const tasks = buildTaskContext()
  const projects = buildProjectContext()
  const commandQueue = buildCommandQueueContext()
  const finance = buildFinanceContext()
  const calendar = buildCalendarContext()
  const risk = buildRiskContext()
  const priorities = buildPriorityContext()
  const focusAnalysis = buildFocusAnalysisContext()

  const stateWithoutBrief = {
    generatedAt: new Date().toISOString(),
    summary: 'Atlas sees an elevated focus day with moderate finance, resilience, and approval pressure. The clearest next move is to unlock one delayed project decision, then review pending approvals.',
    workloadPressure: 'moderate' as const,
    focusPressure: focusAnalysis.focusPressure,
    approvalLoad: 'moderate' as const,
    financePressure: finance.operationalFinancePressure,
    riskLevel: risk.workloadPressure,
    blockers: [...tasks.blockedTasks, ...projects.overdueMilestones],
    opportunities: ['Prepare a concise stakeholder summary', 'Use the protected focus block before the day fragments', 'Approve one CRM follow-up while the relationship is warm'],
    riskIndicators: [...risk.operationalConcerns, ...risk.continuityIndicators],
    contextSignals: [tasks.summary, projects.summary, commandQueue.summary, finance.summary, calendar.summary, risk.summary],
    tasks,
    projects,
    commandQueue,
    finance,
    calendar,
    risk,
    priorities,
    focusAnalysis,
  }

  return {
    ...stateWithoutBrief,
    dailyBrief: buildDailyBriefContext(stateWithoutBrief),
  }
}

export function buildOperationalSnapshot(state: OperationalState): OperationalSnapshot {
  return {
    summary: state.summary,
    signals: [
      `${state.tasks.overdueCount} overdue priorities need attention.`,
      `${state.commandQueue.pendingApprovals} approvals are pending in Command Queue.`,
      `Finance pressure is ${state.financePressure} this week.`,
      state.projects.stalledProjects.length > 0 ? 'One project appears stalled.' : 'Projects appear to be moving.',
    ],
    workloadPressure: state.workloadPressure,
    focusPressure: state.focusPressure,
    approvalLoad: state.approvalLoad,
    financePressure: state.financePressure,
    riskLevel: state.riskLevel,
  }
}

export function formatOperationalStateForPrompt(state: OperationalState) {
  return `Operational summary: ${state.summary}
Workload pressure: ${state.workloadPressure}
Focus pressure: ${state.focusPressure}
Approval load: ${state.approvalLoad}
Finance pressure: ${state.financePressure}
Resilience awareness: ${state.riskLevel}

Context signals:
- ${state.contextSignals.join('\n- ')}

Blockers:
- ${state.blockers.join('\n- ')}

Opportunities:
- ${state.opportunities.join('\n- ')}

Risk and continuity indicators:
- ${state.riskIndicators.join('\n- ')}

Daily brief inputs:
Top priorities: ${state.dailyBrief.topPriorities.join('; ')}
Command Queue recommendations: ${state.dailyBrief.commandQueueRecommendations.join('; ')}
Recommended next action: ${state.dailyBrief.recommendedNextAction}`
}
