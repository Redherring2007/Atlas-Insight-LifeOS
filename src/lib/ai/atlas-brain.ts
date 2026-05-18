import { getAtlasAiConfig } from './config'
import { generateWithOllama } from './providers/ollama'
import { buildCommandSuggestionsPrompt } from './prompts/command-suggestions'
import { buildDailyBriefPrompt } from './prompts/daily-brief'
import { buildFocusAnalysisPrompt } from './prompts/focus-analysis'
import { buildOperationalSummaryPrompt } from './prompts/operational-summary'
import { buildOperationalSnapshot, buildOperationalState, formatOperationalStateForPrompt } from '@/lib/context/operational-state'
import type { OperationalState } from '@/lib/context/types'
import type { AtlasBrainMode, AtlasBrainRequest, AtlasBrainResponse, AtlasSuggestedAction } from './types'

export const atlasBrainModes: AtlasBrainMode[] = ['ask', 'daily_brief', 'command_suggestions', 'operational_summary', 'focus']

function buildGeneralAskPrompt(message: string, context: OperationalState) {
  return `You are Atlas Brain, the calm operational intelligence layer for ATLAS LifeOS.
Act like an AI Chief of Staff for business and personal life management.

User request: ${message || 'Help me decide the next useful move.'}

Guardrails:
- Do not execute real-world actions.
- Do not send emails, make payments, update databases, or call external tools.
- Do not expose hidden backend or tool details.
- Recommend user-controlled Command Queue actions where useful.
- Keep the response concise, clear, supportive, and operational.

Structured operational context:
${formatOperationalStateForPrompt(context)}`
}

function buildPrompt(request: AtlasBrainRequest, context: OperationalState) {
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

function suggestedActionsForMode(mode: AtlasBrainMode, context: OperationalState): AtlasSuggestedAction[] {
  const focusAction: AtlasSuggestedAction = {
    id: 'atlas-focus-check',
    title: 'Confirm today\'s focus',
    type: 'check',
    rationale: context.focusAnalysis.suggestedNextMove,
    source: 'Atlas Brain',
    proposed: true,
  }

  const actions: Record<AtlasBrainMode, AtlasSuggestedAction[]> = {
    ask: [
      { id: 'atlas-review-next-action', title: 'Review recommended next action', type: 'review', rationale: 'Keep the next step explicit before anything changes.', source: 'Atlas Brain', proposed: true },
    ],
    daily_brief: [
      { id: 'atlas-prepare-daily-brief', title: 'Review Daily Brief', type: 'brief', rationale: context.dailyBrief.summary, source: 'Atlas Brain', proposed: true },
      focusAction,
    ],
    command_suggestions: [
      { id: 'atlas-delayed-project', title: 'Follow up delayed project', type: 'review', rationale: context.projects.summary, source: 'Atlas Brain', proposed: true },
      { id: 'atlas-finance-review', title: 'Review finance pressure', type: 'check', rationale: context.finance.summary, source: 'Atlas Brain', proposed: true },
      { id: 'atlas-workload-pressure', title: 'Review workload pressure', type: 'review', rationale: context.risk.summary, source: 'Atlas Brain', proposed: true },
      { id: 'atlas-project-summary', title: 'Generate project summary', type: 'summarise', rationale: 'A concise update can reduce context switching and keep stakeholders aligned.', source: 'Atlas Brain', proposed: true },
    ],
    operational_summary: [
      { id: 'atlas-summarise-position', title: 'Review operational summary', type: 'summarise', rationale: 'Confirm the current position before choosing next actions.', source: 'Atlas Brain', proposed: true },
    ],
    focus: [focusAction],
  }

  return actions[mode]
}

function fallbackText(mode: AtlasBrainMode, context: OperationalState) {
  switch (mode) {
    case 'daily_brief':
      return `Atlas Brain is using fallback mode. ${context.dailyBrief.summary} Recommended next action: ${context.dailyBrief.recommendedNextAction}`
    case 'command_suggestions':
      return 'Atlas Brain is using fallback mode. Context-aware queue suggestions are ready for review only; nothing has been executed.'
    case 'operational_summary':
      return `Atlas Brain is using fallback mode. ${context.summary}`
    case 'focus':
      return `Atlas Brain is using fallback mode. ${context.focusAnalysis.summary} ${context.focusAnalysis.suggestedNextMove}`
    default:
      return 'Atlas Brain is using fallback mode. I can still prepare safe, approval-led suggestions from the current operational context, but the local model did not provide a live response.'
  }
}

export async function runAtlasBrain(request: AtlasBrainRequest): Promise<AtlasBrainResponse> {
  const startedAt = Date.now()
  const config = getAtlasAiConfig()
  const context = request.context ?? buildOperationalState()
  const contextSnapshot = buildOperationalSnapshot(context)
  const prompt = buildPrompt(request, context)

  try {
    const text = await generateWithOllama(prompt, config)

    return {
      text,
      suggestedActions: suggestedActionsForMode(request.mode, context),
      contextSnapshot,
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
      text: fallbackText(request.mode, context),
      suggestedActions: suggestedActionsForMode(request.mode, context),
      contextSnapshot,
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
