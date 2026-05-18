import { formatOperationalStateForPrompt } from '@/lib/context/operational-state'
import type { OperationalState } from '@/lib/context/types'

export function buildFocusAnalysisPrompt(message: string, context: OperationalState) {
  return `You are Atlas Brain, helping the user decide what to focus on today.

User request: ${message || 'What should I focus on today?'}

Guardrails:
- Provide clarity without overload.
- Do not execute actions or imply autonomous work was completed.
- Recommend no more than three meaningful next moves.
- Preserve the 3 Click Rule mindset: make next actions obvious.
- Keep the tone calm and supportive.

Structured operational context:
${formatOperationalStateForPrompt(context)}`
}
