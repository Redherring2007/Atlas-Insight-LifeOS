'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, CheckCircle2, Minus, Sparkles } from 'lucide-react'
import { BrandHeader } from '@/components/brand-header'
import { SideNav } from '@/components/side-nav'
import { applyTwinAdjustment, createDefaultTwinProfile, inferTwinProfile, summarizeTwinProfile } from '@/lib/twin/profile'
import { buildTwinSetupPrompt, twinAdjustmentLabels, twinScenarioQuestions } from '@/lib/twin/prompts'
import type { TwinAdjustment, TwinProfile, TwinScenarioResponse } from '@/lib/twin/types'

export default function TwinSetupPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [profile, setProfile] = useState<TwinProfile | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  const currentQuestion = twinScenarioQuestions[step]
  const progress = Math.round(((profile ? twinScenarioQuestions.length : step) / twinScenarioQuestions.length) * 100)

  const scenarioResponses = useMemo<TwinScenarioResponse[]>(() => {
    return twinScenarioQuestions.map((question) => ({
      scenarioId: question.id,
      response: responses[question.id] ?? '',
    }))
  }, [responses])

  if (status === 'loading' || !session) {
    return <div className="min-h-screen bg-[#070B10] text-[#EAF2F8] flex items-center justify-center">Loading...</div>
  }

  const updateResponse = (value: string) => {
    if (!currentQuestion) return
    setResponses((current) => ({ ...current, [currentQuestion.id]: value }))
  }

  const completeSetup = () => {
    const completed = scenarioResponses.filter((item) => item.response.trim().length > 0)
    setProfile(completed.length >= 3 ? inferTwinProfile(scenarioResponses, session.user?.id) : createDefaultTwinProfile(session.user?.id))
  }

  const skipSetup = () => {
    setProfile(createDefaultTwinProfile(session.user?.id))
  }

  const applyAdjustment = (adjustment: TwinAdjustment) => {
    setProfile((current) => applyTwinAdjustment(current ?? createDefaultTwinProfile(session.user?.id), adjustment))
  }

  const nextQuestion = () => {
    if (step >= twinScenarioQuestions.length - 1) {
      completeSetup()
      return
    }
    setStep((current) => current + 1)
  }

  return (
    <div className="min-h-screen bg-[#070B10] text-[#EAF2F8] md:flex">
      <SideNav />
      <main className="flex-1 px-4 py-5 pb-24 sm:px-6 lg:px-10 lg:py-8">
        <BrandHeader userName={session.user?.name ?? 'Operator'} workspaceLabel="Digital Twin" />

        <section className="mt-6 rounded-3xl border border-white/10 bg-[#121C28]/85 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.3em] text-[#00D9FF]">Digital Twin Foundation</p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-4xl">Teach Atlas how you work by example.</h2>
              <p className="mt-4 text-sm leading-6 text-[#B0C9E0]">{buildTwinSetupPrompt()}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-[#B0C9E0] lg:w-72">
              <p className="font-semibold text-white">Progress</p>
              <div className="mt-3 h-2 rounded-full bg-white/10">
                <div className="h-2 rounded-full bg-[#00AFFF] transition-all" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-3 text-xs text-[#8FA3B8]">{profile ? 'Setup complete' : `Scenario ${step + 1} of ${twinScenarioQuestions.length}`}</p>
            </div>
          </div>
        </section>

        {profile ? (
          <section className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-white/10 bg-[#111821]/90 p-6">
              <div className="flex items-start gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#00D9FF]/10 text-[#00D9FF]">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-white">Atlas has learned your preferred communication and planning style.</h3>
                  <p className="mt-3 text-sm leading-6 text-[#B0C9E0]">Drafts, scheduling suggestions, and approval recommendations can now use this profile as guidance while still waiting for your approval.</p>
                </div>
              </div>
              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {summarizeTwinProfile(profile).map((summary) => (
                  <div key={summary} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-[#B0C9E0]">{summary}</div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {(Object.keys(twinAdjustmentLabels) as TwinAdjustment[]).map((adjustment) => (
                  <button key={adjustment} type="button" onClick={() => applyAdjustment(adjustment)} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-[#B0C9E0] transition hover:border-[#00AFFF] hover:text-white">
                    {twinAdjustmentLabels[adjustment]}
                  </button>
                ))}
              </div>
            </div>
            <aside className="rounded-3xl border border-white/10 bg-[#111821]/90 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[#00D9FF]">Next</p>
              <h3 className="mt-3 text-2xl font-semibold text-white">Review prepared work</h3>
              <p className="mt-4 text-sm leading-6 text-[#B0C9E0]">Your Twin does not execute actions. It helps Atlas prepare work that you can approve, edit, rewrite, regenerate, or dismiss.</p>
              <Link href="/command-queue" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#00AFFF] px-4 py-3 text-sm font-semibold text-[#061019] hover:bg-[#00D9FF]">
                Open Command Queue <ArrowRight className="h-4 w-4" />
              </Link>
            </aside>
          </section>
        ) : (
          <section className="mt-6 rounded-3xl border border-white/10 bg-[#111821]/90 p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/5 text-[#00D9FF]">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs uppercase tracking-[0.25em] text-[#8FA3B8]">{currentQuestion.title}</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">{currentQuestion.prompt}</h3>
                <textarea
                  value={responses[currentQuestion.id] ?? ''}
                  onChange={(event) => updateResponse(event.target.value)}
                  rows={8}
                  placeholder={currentQuestion.placeholder}
                  className="mt-5 w-full resize-none rounded-2xl border border-white/10 bg-[#0D1520] px-4 py-4 text-sm leading-6 text-white outline-none transition placeholder:text-[#6F8499] focus:border-[#00AFFF] focus:ring-2 focus:ring-[#00AFFF]/20"
                />
                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button type="button" onClick={skipSetup} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-[#B0C9E0] hover:border-[#00AFFF] hover:text-white">
                    <Minus className="h-4 w-4" /> Use defaults
                  </button>
                  <div className="flex gap-2">
                    {step > 0 && (
                      <button type="button" onClick={() => setStep((current) => Math.max(0, current - 1))} className="rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-[#B0C9E0] hover:border-[#00AFFF] hover:text-white">
                        Back
                      </button>
                    )}
                    <button type="button" onClick={nextQuestion} className="inline-flex items-center gap-2 rounded-xl bg-[#00AFFF] px-5 py-3 text-sm font-semibold text-[#061019] hover:bg-[#00D9FF]">
                      {step >= twinScenarioQuestions.length - 1 ? 'Complete setup' : 'Next scenario'} <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
