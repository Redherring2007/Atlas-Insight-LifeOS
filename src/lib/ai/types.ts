import type { OperationalSnapshot, OperationalState } from '@/lib/context/types'

export type AtlasBrainMode = 'ask' | 'daily_brief' | 'command_suggestions' | 'operational_summary' | 'focus'

export type AtlasBrainProvider = 'ollama' | 'fallback'

export type AtlasActionType = 'follow-up' | 'review' | 'schedule' | 'brief' | 'check' | 'summarise'

export interface AtlasSuggestedAction {
  id: string
  title: string
  type: AtlasActionType
  rationale: string
  source: string
  proposed: true
}

export interface AtlasBrainRequest {
  mode: AtlasBrainMode
  message?: string
  context?: OperationalState
}

export interface AtlasBrainMetadata {
  provider: AtlasBrainProvider
  model: string
  mode: AtlasBrainMode
  ok: boolean
  elapsedMs: number
  error?: string
}

export interface AtlasBrainResponse {
  text: string
  suggestedActions: AtlasSuggestedAction[]
  contextSnapshot: OperationalSnapshot
  metadata: AtlasBrainMetadata
}

export interface OllamaGenerateResponse {
  response?: string
  model?: string
  done?: boolean
}
