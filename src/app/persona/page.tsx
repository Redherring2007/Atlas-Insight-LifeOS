'use client'

import { useState, useMemo } from 'react'
import { BrandHeader } from '@/components/brand-header'
import { SideNav } from '@/components/side-nav'
import { PrivacyBanner } from '@/components/privacy-banner'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const QUESTIONS = [
  { id: 'q1', label: 'How do you usually make decisions?' },
  { id: 'q2', label: 'What do you prioritise most: time, money, growth, relationships, or control?' },
  { id: 'q3', label: 'What is your professional role?' },
  { id: 'q4', label: 'How do you approach work: structured, reactive, strategic, or creative?' },
  { id: 'q5', label: 'How do you usually write messages?' },
  { id: 'q6', label: 'How formal should your AI sound?' },
  { id: 'q7', label: 'What frustrates you most in work or life?' },
  { id: 'q8', label: 'What does success look like to you?' },
  { id: 'q9', label: 'Do you prefer control or delegation?' },
  { id: 'q10', label: 'What should never be automated without approval?' },
]

export default function PersonaPage() {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  const completion = useMemo(() => {
    const answered = QUESTIONS.filter((question) => answers[question.id]?.trim())
    return Math.round((answered.length / QUESTIONS.length) * 100)
  }, [answers])

  if (status === 'loading' || !session) {
    return <div className="min-h-screen bg-[#070B10] text-[#EAF2F8] flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-[#070B10] text-[#EAF2F8]">
      <div className="flex">
        <SideNav />
        <main className="flex-1 px-6 py-8 xl:px-10">
          <BrandHeader userName={session.user.name ?? 'Operator'} workspaceLabel="Persona setup and profile" />
          <div className="mt-8 grid gap-8 xl:grid-cols-[1.5fr_0.9fr]">
            <section className="space-y-6 rounded-3xl border border-white/10 bg-[#121C28]/80 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#00D9FF]">AI Persona</p>
                <h2 className="mt-2 text-3xl font-semibold text-[#EAF2F8]">Your digital decision twin</h2>
                <p className="mt-3 text-sm leading-6 text-[#8FA3B8]">Your AI Persona learns how you think, communicate, prioritise, and make decisions.</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-[#0F1620]/90 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#00D9FF]">Persona progress</p>
                <div className="mt-4 h-4 w-full overflow-hidden rounded-full bg-white/5">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#00AFFF] to-[#4CFF3C]" style={{ width: `${completion}%` }} />
                </div>
                <p className="mt-3 text-sm text-[#8FA3B8]">{completion}% complete</p>
              </div>

              <form
                onSubmit={(event) => {
                  event.preventDefault()
                  setSubmitted(true)
                }}
                className="space-y-6"
              >
                {QUESTIONS.map((question) => (
                  <div key={question.id} className="space-y-2">
                    <label className="text-sm font-semibold text-[#EAF2F8]">{question.label}</label>
                    <textarea
                      rows={3}
                      value={answers[question.id] || ''}
                      onChange={(event) => setAnswers((prev) => ({ ...prev, [question.id]: event.target.value }))}
                      placeholder="Type your answer..."
                      className="w-full rounded-3xl border border-white/10 bg-[#0F1620]/90 px-4 py-3 text-sm text-[#EAF2F8] outline-none transition focus:border-[#00AFFF] focus:ring-2 focus:ring-[#00AFFF]/20"
                    />
                  </div>
                ))}
                <div className="flex flex-wrap items-center gap-4">
                  <button type="submit" className="rounded-full bg-[#00AFFF] px-6 py-3 text-sm font-semibold text-[#070B10] transition hover:bg-[#00D9FF]">Save Persona</button>
                  <span className="text-sm text-[#8FA3B8]">Persona answers are stored locally and ready for future AI personalization.</span>
                </div>
                {submitted && (
                  <p className="rounded-3xl border border-[#4CFF3C]/20 bg-[#4CFF3C]/10 px-4 py-3 text-sm text-[#4CFF3C]">Persona saved. Your digital twin is learning from your preferences.</p>
                )}
              </form>
            </section>
            <aside className="space-y-6">
              <PrivacyBanner />
              <div className="rounded-3xl border border-white/10 bg-[#121C28]/80 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.3em] text-[#00D9FF]">Why it matters</p>
                <h3 className="mt-3 text-2xl font-semibold text-[#EAF2F8]">Your AI Persona shapes outcomes</h3>
                <p className="mt-4 text-sm leading-6 text-[#8FA3B8]">This profile helps ATLAS tailor recommendations, tone, and decision support to what matters most for your life and business.</p>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  )
}
