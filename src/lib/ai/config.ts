export interface AtlasAiConfig {
  ollamaBaseUrl: string
  atlasBrainModel: string
  requestTimeoutMs: number
}

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, '')
}

export function getAtlasAiConfig(): AtlasAiConfig {
  return {
    ollamaBaseUrl: trimTrailingSlash(process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434'),
    atlasBrainModel: process.env.ATLAS_BRAIN_MODEL ?? 'atlas-brain',
    requestTimeoutMs: 12000,
  }
}
