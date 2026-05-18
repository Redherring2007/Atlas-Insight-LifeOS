import { getAtlasAiConfig } from './config'
import { generateWithOllama } from './providers/ollama'
import { buildCommandSuggestionsPrompt } from './prompts/command-suggestions'
import { buildDailyBriefPrompt } from './prompts/daily-brief'
import { buildFocusAnalysisPrompt } from './prompts/focus-analysis'
import { buildOperationalSummaryPrompt } from './prompts/operational-summary'
import type { AtlasBrainMode, AtlasBrainRequest, AtlasBrainResponse, AtlasOperationalContext, AtlasSuggestedAction } from './types'

export const atlasBrainModes: AtlasBrainMode[] = ['ask', 'daily_brief', 'command_suggestions', 'operational_summary', 'focus']

export function buildMockOperationalContext(): AtlasOperationalContext {
  return {
    priorities: ['Confirm today\'s most important project decision', 'Review pending approvals', 'Prepare one concise stakeholder update'],
    blockers: ['One overdue task needs ownership', 'A finance timing question needs review'],
    opportunities: ['A warm CRM relationship is ready for follow-up', 'A daily brief can reduce context switching'],
    riskNotes: ['Travel and continuity notes should be checked before planning changes', 'No urgent escalation is assumed from placeholder data'],
    commandQueue: ['Approve follow-up email', 'Review overdue task', 'Generate project summary'],
  }
}

function buildGeneralAskPrompt(message: string, context: AtlasOperationalContext) {
  return `You are Atlas Brain, the calm operational intelligence layer for ATLAS LifeOS.
Act like an AI Chief of Staff for business and personal life management.

User request: ${message || 'Help me decide the next useful move.'}

Guardrails:
- Do not execute real-world actions.
- Do not send emails, make payments, update databases, or call external tools.
- Do not expose hidden backend or tool details.
- Recommend user-controlled Command Queue actions where useful.
- Keep the response concise, clear, and operational.

Context:
Priorities: ${context.priorities.join('; ')}
Blockers: ${context.blockers.join('; ')}
Opportunities: ${context.opportunities.join('; ')}
Risk notes: ${context.riskNotes.join('; ')}
Command Queue: ${context.commandQueue.join('; ')}`
}

function buildPrompt(request: AtlasBrainRequest, context: AtlasOperationalContext) {
  switch (request.mode) {
    case 'daily_brief':
      return buildDailyBriefPrompt(context)
    case 'command_suggestions':
      return buildCommandSuggestionsPrompt(context)
    case 'operational_summary':
      return buildOperationalSummaryPrompt(request.message ?? '', context)
    case 'focus':
      return buildFocusAnalysisPrompt(request.message ?? '', context)
    default:
      return buildGeneralAskPrompt(request.message ?? '', context)
  }
}

function suggestedActionsForMode(mode: AtlasBrainMode): AtlasSuggestedAction[] {
  const actions: Record<AtlasBrainMode, AtlasSuggestedAction[]> = {
    ask: [
      { id: 'atlas-review-next-action', title: 'Review recommended next action', type: 'review', rationale: 'Keep the next step explicit before anything changes.', source: 'Atlas Brain', proposed: true },
    ],
    daily_brief: [
      { id: 'atlas-prepare-daily-brief', title: 'Review Daily Brief', type: 'brief', rationale: 'Convert the brief into visible approval-led next steps.', source: 'Atlas Brain', proposed: true },
      { id: 'atlas-check-blockers', title: 'Check blockers', type: 'check', rationale: 'Confirm whether any blocker needs action today.', source: 'Atlas Brain', proposed: true },
    ],
    command_suggestions: [
      { id: 'atlas-follow-up-draft', title: 'Approve follow-up draft', type: 'follow-up', rationale: 'A warm relationship can be nudged without adding a meeting.', source: 'Atlas Brain', proposed: true },
      { id: 'atlas-overdue-review', title: 'Review overdue task', type: 'review', rationale: 'One task may need a new owner or date.', source: 'Atlas Brain', proposed: true },
      { id: 'atlas-project-summary', title: 'Generate project summary', type: 'summarise', rationale: 'A concise update can reduce context switching.', source: 'Atlas Brain', proposed: true },
    ],
    operational_summary: [
      { id: 'atlas-summarise-position', title: 'Review operational summary', type: 'summarise', rationale: 'Confirm the current position before choosing next actions.', source: 'Atlas Brain', proposed: true },
    ],
    focus: [
      { id: 'atlas-focus-check', title: 'Confirm today\'s focus', type: 'check', rationale: 'Keep the day anchored to the highest-leverage move.', source: 'Atlas Brain', proposed: true },
    ],
  }

  return actions[mode]
}

function fallbackText(mode: AtlasBrainMode) {
  switch (mode) {
    case 'daily_brief':
      return 'Atlas Brain is using fallback mode. Today: review the highest-priority project decision, clear pending approvals, check blockers, and choose one next action for Command Queue.'
    case 'command_suggestions':
      return 'Atlas Brain is using fallback mode. Proposed queue actions are ready for review only; nothing has been executed.'
    case 'operational_summary':
      return 'Atlas Brain is using fallback mode. Your current operational position appears stable, with attention needed on approvals, one overdue task, and finance timing.'
    case 'focus':
      return 'Atlas Brain is using fallback mode. Focus first on the decision or approval that unlocks the most work today, then review blockers before adding new activity.'
    default:
      return 'Atlas Brain is using fallback mode. I can still prepare safe, approval-led suggestions, but the local model did not provide a live response.'
  }
}

export async function runAtlasBrain(request: AtlasBrainRequest): Promise<AtlasBrainResponse> {
  const startedAt = Date.now()
  const config = getAtlasAiConfig()
  const context = request.context ?? buildMockOperationalContext()
  const prompt = buildPrompt(request, context)

  try {
    const text = await generateWithOllama(prompt, config)

    return {
      text,
      suggestedActions: suggestedActionsForMode(request.mode),
      metadata: {
        provider: 'ollama',
        model: config.atlasBrainModel,
        mode: request.mode,
        ok: true,
        elapsedMs: Date.now() - startedAt,
      },
    }
  } catch (error) {
    return {
      text: fallbackText(request.mode),
      suggestedActions: suggestedActionsForMode(request.mode),
      metadata: {
        provider: 'fallback',
        model: config.atlasBrainModel,
        mode: request.mode,
        ok: false,
        elapsedMs: Date.now() - startedAt,
        error: error instanceof Error ? error.message : 'Atlas Brain fallback activated',
      },
    }
  }
}
