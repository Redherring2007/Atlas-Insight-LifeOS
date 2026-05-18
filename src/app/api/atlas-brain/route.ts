import { NextResponse } from 'next/server'
import { atlasBrainModes, buildMockOperationalContext, runAtlasBrain } from '@/lib/ai/atlas-brain'
import type { AtlasBrainMode } from '@/lib/ai/types'

function isAtlasBrainMode(value: unknown): value is AtlasBrainMode {
  return typeof value === 'string' && atlasBrainModes.includes(value as AtlasBrainMode)
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({})) as Record<string, unknown>
    const mode = isAtlasBrainMode(body.mode) ? body.mode : 'ask'
    const message = typeof body.message === 'string' ? body.message : ''

    const response = await runAtlasBrain({
      mode,
      message,
      context: buildMockOperationalContext(),
    })

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json({
      text: 'Atlas Brain fallback mode is active. The request could not be completed live, but no external action was taken.',
      suggestedActions: [],
      metadata: {
        provider: 'fallback',
        model: process.env.ATLAS_BRAIN_MODEL ?? 'atlas-brain',
        mode: 'ask',
        ok: false,
        elapsedMs: 0,
        error: error instanceof Error ? error.message : 'Atlas Brain route failed',
      },
    })
  }
}
