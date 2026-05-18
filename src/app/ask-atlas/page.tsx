'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ArrowRight, Brain, CheckSquare, ClipboardList, FileText, Send, ShieldCheck, Sparkles } from 'lucide-react'
import { BrandHeader } from '@/components/brand-header'
import { SideNav } from '@/components/side-nav'
import type { AtlasBrainMode, AtlasBrainResponse } from '@/lib/ai/types'

const prompts = [
  'What should I focus on today?',
  'Generate my Daily Brief.',
  'What needs approval?',
  'Summarise my operational position.',
  'What risks or blockers should I know about?',
  'Suggest Command Queue actions.',
]

const helpCards = [
  {
    title: 'Decide what matters',
    description: 'Turn projects, calendar pressure, finance signals, and CRM follow-ups into a short next-action plan.',
    icon: ClipboardList,
  },
  {
    title: 'Prepare approvals',
    description: 'Draft safe actions for Command Queue so you stay in control before anything is executed.',
    icon: CheckSquare,
  },
  {
    title: 'Brief the day',
    description: 'Create a concise daily brief with priorities, blockers, and one practical insight.',
    icon: FileText,
  },
  {
    title: 'Stay resilient',
    description: 'Keep continuity, workload pressure, finance timing, and personal/work friction visible without alarm.',
    icon: ShieldCheck,
  },
]

function modeForPrompt(prompt: string): AtlasBrainMode {
  const normalized = prompt.toLowerCase()

  if (normalized.includes('daily brief')) return 'daily_brief'
  if (normalized.includes('approval') || normalized.includes('command queue')) return 'command_suggestions'
  if (normalized.includes('operational position') || normalized.includes('business position')) return 'operational_summary'
  if (normalized.includes('focus')) return 'focus'

  return 'ask'
}

export default function AskAtlasPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [input, setInput] = useState('')
  const [response, setResponse] = useState<AtlasBrainResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  if (status === 'loading' || !session) {
    return <div className="min-h-screen bg-[#070B10] text-[#EAF2F8] flex items-center justify-center">Loading...</div>
  }

  const submitPrompt = async (promptOverride?: string) => {
    const message = (promptOverride ?? input).trim()
    if (!message || isLoading) return

    setInput(message)
    setIsLoading(true)
    setError('')

    try {
      const atlasResponse = await fetch('/api/atlas-brain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          mode: modeForPrompt(message),
        }),
      })

      if (!atlasResponse.ok) {
        throw new Error('Atlas Brain request failed')
      }

      const data = await atlasResponse.json() as AtlasBrainResponse
      setResponse(data)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Atlas Brain is unavailable')
      setResponse(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#070B10] text-[#EAF2F8] md:flex">
      <SideNav />
      <main className="flex-1 px-4 py-5 sm:px-6 lg:px-10 lg:py-8">
        <BrandHeader userName={session.user?.name ?? 'Operator'} workspaceLabel="Ask Atlas" />

        <section className="mt-6 rounded-3xl border border-white/10 bg-[#121C28]/85 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.3em] text-[#00D9FF]">Atlas Brain</p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-4xl">Ask Atlas to turn operational noise into your next clear move.</h2>
              <p className="mt-4 text-sm leading-6 text-[#B0C9E0]">
                Atlas Brain now works from structured operational context: priorities, blockers, approval load, finance pressure, resilience awareness, and focus pressure. You stay in control through Command Queue.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-[#B0C9E0] lg:max-w-sm">
              <p className="font-semibold text-white">Calm context, not noise</p>
              <p className="mt-2">Atlas summarises what matters and proposes next steps without watching, spamming, or executing actions.</p>
            </div>
          </div>

          {response?.contextSnapshot && (
            <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {response.contextSnapshot.signals.slice(0, 4).map((signal) => (
                <div key={signal} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-6 text-[#B0C9E0]">
                  {signal}
                </div>
              ))}
            </div>
          )}

          <div className="mt-7 rounded-2xl border border-white/10 bg-[#0D1520] p-4">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              rows={5}
              placeholder="Ask Atlas about priorities, approvals, blockers, daily brief, business position, or personal/work balance..."
              className="w-full resize-none rounded-2xl border border-white/10 bg-[#111B27] px-4 py-4 text-sm leading-6 text-white outline-none transition placeholder:text-[#6F8499] focus:border-[#00AFFF] focus:ring-2 focus:ring-[#00AFFF]/20"
            />
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-xs text-[#8FA3B8]">
                <Sparkles className="h-4 w-4 text-[#00D9FF]" />
                <span>{response?.metadata.provider === 'fallback' ? 'Fallback mode is active; context remains structured and no action was executed.' : 'Atlas uses concise operational context for review-ready suggestions.'}</span>
              </div>
              <button
                type="button"
                onClick={() => submitPrompt()}
                disabled={isLoading || !input.trim()}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00AFFF] px-5 py-3 text-sm font-semibold text-[#061019] transition hover:bg-[#00D9FF] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                {isLoading ? 'Preparing...' : 'Ask Atlas'}
              </button>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {prompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => submitPrompt(prompt)}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-[#B0C9E0] transition hover:border-[#00AFFF] hover:text-white"
              >
                {prompt}
              </button>
            ))}
          </div>
        </section>

        {(response || error) && (
          <section className="mt-6 rounded-3xl border border-white/10 bg-[#111821]/90 p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-3">
              <Brain className="h-5 w-5 text-[#00D9FF]" />
              <h3 className="text-lg font-semibold text-white">Atlas response</h3>
              {response && (
                <span className="rounded-full bg-white/5 px-3 py-1 text-xs capitalize text-[#B0C9E0]">
                  {response.metadata.provider === 'ollama' ? 'Live Atlas Brain' : 'Safe fallback'}
                </span>
              )}
            </div>
            {error ? (
              <p className="mt-4 text-sm leading-6 text-[#FFB4A8]">{error}</p>
            ) : (
              <>
                <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-[#D7E7F5]">{response?.text}</p>
                {response && response.suggestedActions.length > 0 && (
                  <div className="mt-5 grid gap-3 lg:grid-cols-2">
                    {response.suggestedActions.map((action) => (
                      <div key={action.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="text-sm font-semibold text-white">{action.title}</p>
                        <p className="mt-2 text-sm leading-6 text-[#B0C9E0]">{action.rationale}</p>
                        <p className="mt-3 text-xs uppercase tracking-[0.2em] text-[#00D9FF]">Proposed only</p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </section>
        )}

        <section className="mt-6 grid gap-4 lg:grid-cols-2">
          {helpCards.map((card) => {
            const Icon = card.icon
            return (
              <div key={card.title} className="rounded-3xl border border-white/10 bg-[#111821]/90 p-5">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/5 text-[#00D9FF]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{card.title}</h3>
                </div>
                <p className="mt-4 text-sm leading-6 text-[#B0C9E0]">{card.description}</p>
              </div>
            )
          })}
        </section>

        <section className="mt-6 rounded-3xl border border-white/10 bg-[#111821]/90 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Brain className="h-5 w-5 text-[#00D9FF]" />
              <div>
                <h3 className="text-lg font-semibold text-white">Queue-ready outputs</h3>
                <p className="mt-1 text-sm text-[#B0C9E0]">Draft actions should flow into Command Queue for review, edit, snooze, or approval.</p>
              </div>
            </div>
            <Link href="/command-queue" className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-[#00D9FF] hover:border-[#00AFFF] hover:text-white">
              Open Command Queue <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
