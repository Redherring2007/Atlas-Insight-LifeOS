import type { AtlasAiConfig } from '../config'
import type { OllamaGenerateResponse } from '../types'

export class OllamaProviderError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'OllamaProviderError'
  }
}

export async function generateWithOllama(prompt: string, config: AtlasAiConfig): Promise<string> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), config.requestTimeoutMs)

  try {
    const response = await fetch(`${config.ollamaBaseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: config.atlasBrainModel,
        prompt,
        stream: false,
      }),
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new OllamaProviderError(`Ollama responded with ${response.status}`)
    }

    const data = await response.json() as OllamaGenerateResponse
    const text = data.response?.trim()

    if (!text) {
      throw new OllamaProviderError('Ollama returned an empty response')
    }

    return text
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new OllamaProviderError('Ollama request timed out')
    }

    if (error instanceof OllamaProviderError) {
      throw error
    }

    throw new OllamaProviderError(error instanceof Error ? error.message : 'Ollama request failed')
  } finally {
    clearTimeout(timeout)
  }
}
