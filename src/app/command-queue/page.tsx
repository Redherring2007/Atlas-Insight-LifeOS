'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ArrowRight, Check, Clock3, Edit3, Mail, MinusCircle, RefreshCcw, Sparkles } from 'lucide-react'
import { BrandHeader } from '@/components/brand-header'
import { SideNav } from '@/components/side-nav'
import { createCommandQueueFeedback, groupPreparedActionsBySection, preparedCommandActions } from '@/lib/actions/command-queue'
import type { CommandQueueFeedback, CommandQueueSection, PreparedCommandAction } from '@/lib/actions/types'

const sectionLabels: Record<CommandQueueSection, string> = {
  ready_for_approval: 'Ready for approval',
  needs_guidance: 'Needs your guidance',
  draft_replies: 'Draft replies',
  suggested_scheduling_changes: 'Suggested scheduling changes',
  follow_up_opportunities: 'Follow-up opportunities',
  priority_recommendations: 'Priority recommendations',
}

const sectionOrder: CommandQueueSection[] = [
  'ready_for_approval',
  'needs_guidance',
  'draft_replies',
  'suggested_scheduling_changes',
  'follow_up_opportunities',
  'priority_recommendations',
]

function confidenceLabel(confidence: number) {
  return `${Math.round(confidence * 100)}% confidence`
}

function statusLabel(action: PreparedCommandAction) {
  if (action.status === 'ready') return 'Prepared'
  if (action.status === 'needs_guidance') return 'Needs guidance'
  return action.status.replace(/_/g, ' ')
}

export default function CommandQueuePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [actions, setActions] = useState<PreparedCommandAction[]>(preparedCommandActions)
  const [rewriteInstruction, setRewriteInstruction] = useState('')
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null)
  const [feedbackEvents, setFeedbackEvents] = useState<CommandQueueFeedback[]>([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  if (status === 'loading' || !session) {
    return <div className="min-h-screen bg-[#070B10] text-[#EAF2F8] flex items-center justify-center">Loading...</div>
  }

  const grouped = groupPreparedActionsBySection(actions)
  const readyCount = actions.filter((action) => action.status === 'ready' || action.status === 'needs_guidance').length

  const recordFeedback = (actionId: string, event: CommandQueueFeedback['event'], instruction?: string) => {
    setFeedbackEvents((current) => [createCommandQueueFeedback(actionId, event, instruction), ...current].slice(0, 5))
  }

  const updateActionStatus = (id: string, statusValue: PreparedCommandAction['status'], event: CommandQueueFeedback['event'], instruction?: string) => {
    setActions((current) => current.map((action) => action.id === id ? { ...action, status: statusValue } : action))
    recordFeedback(id, event, instruction)
  }

  const regenerateAction = (id: string) => {
    setActions((current) => current.map((action) => action.id === id ? {
      ...action,
      status: 'regenerated',
      confidence: Math.max(0.45, action.confidence - 0.04),
      proposedOutput: `${action.proposedOutput}\n\nRegenerated note: Atlas would refresh this with the latest context before approval.`,
    } : action))
    recordFeedback(id, 'regenerate')
  }

  const rewriteAction = (id: string) => {
    if (!rewriteInstruction.trim()) return
    setActions((current) => current.map((action) => action.id === id ? {
      ...action,
      status: 'rewritten',
      proposedOutput: `${action.proposedOutput}\n\nRewrite instruction applied: ${rewriteInstruction.trim()}`,
    } : action))
    recordFeedback(id, 'rewrite', rewriteInstruction.trim())
    setRewriteInstruction('')
    setActiveDraftId(null)
  }

  return (
    <div className="min-h-screen bg-[#070B10] text-[#EAF2F8] md:flex">
      <SideNav />
      <main className="flex-1 px-4 py-5 pb-24 sm:px-6 lg:px-10 lg:py-8">
        <BrandHeader userName={session.user?.name ?? 'Operator'} workspaceLabel="Command Queue" />

        <section className="mt-6 rounded-3xl border border-white/10 bg-[#121C28]/85 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.3em] text-[#00D9FF]">Approval Layer</p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-4xl">The work Atlas has prepared for you.</h2>
              <p className="mt-4 text-sm leading-6 text-[#B0C9E0]">Atlas observes, understands, prepares, and suggests. You approve, edit, rewrite, regenerate, or dismiss before anything external can happen.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:w-[420px]">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                <p className="text-sm text-[#B0C9E0]">Prepared items</p>
                <p className="mt-1 text-3xl font-semibold text-white">{readyCount}</p>
              </div>
              <Link href="/twin/setup" className="rounded-2xl border border-[#00AFFF]/30 bg-[#00AFFF]/10 px-5 py-4 text-sm font-semibold text-[#00D9FF] transition hover:border-[#00D9FF] hover:text-white">
                Tune Digital Twin <ArrowRight className="mt-3 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4">
          {sectionOrder.map((section) => (
            <div key={section} className="rounded-3xl border border-white/10 bg-[#111821]/90 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-white">{sectionLabels[section]}</h3>
                <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-[#B0C9E0]">{grouped[section].length} prepared</span>
              </div>

              <div className="mt-4 grid gap-4">
                {grouped[section].map((action) => (
                  <article key={action.id} className="rounded-2xl border border-white/10 bg-[#0D1520] p-4">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-white/5 text-[#00D9FF]"><Sparkles className="h-4 w-4" /></span>
                          <h4 className="text-base font-semibold text-white">{action.title}</h4>
                          <span className="rounded-full bg-[#00D9FF]/10 px-3 py-1 text-xs capitalize text-[#00D9FF]">{statusLabel(action)}</span>
                          <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-[#B0C9E0]">{confidenceLabel(action.confidence)}</span>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-[#B0C9E0]">{action.context}</p>
                        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                          <p className="text-xs uppercase tracking-[0.2em] text-[#8FA3B8]">Proposed output</p>
                          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#D7E7F5]">{action.proposedOutput}</p>
                        </div>
                        <div className="mt-3 grid gap-2 text-sm text-[#8FA3B8] md:grid-cols-3">
                          <p>Urgency: <span className="capitalize text-[#B0C9E0]">{action.urgency}</span></p>
                          <p>Risk: <span className="capitalize text-[#B0C9E0]">{action.riskLevel}</span></p>
                          <p>Signal: <span className="text-[#B0C9E0]">{action.sourceSignal}</span></p>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-[#8FA3B8]">{action.suggestedNextStep}</p>
                      </div>

                      <div className="flex flex-wrap gap-2 xl:w-72 xl:justify-end">
                        <button onClick={() => updateActionStatus(action.id, 'approved', 'approve')} className="inline-flex items-center gap-2 rounded-xl bg-[#00AFFF] px-4 py-2 text-sm font-semibold text-[#061019] hover:bg-[#00D9FF]">
                          <Check className="h-4 w-4" /> Approve
                        </button>
                        {action.type === 'email_reply_draft' || action.type === 'email_outreach_draft' ? (
                          <button onClick={() => updateActionStatus(action.id, 'approved', 'approve')} className="inline-flex items-center gap-2 rounded-xl border border-[#00AFFF]/40 px-4 py-2 text-sm font-semibold text-[#00D9FF] hover:border-[#00D9FF] hover:text-white">
                            <Mail className="h-4 w-4" /> Approve & Send
                          </button>
                        ) : null}
                        <button onClick={() => updateActionStatus(action.id, 'edited', 'edit')} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-[#B0C9E0] hover:border-[#00AFFF] hover:text-white">
                          <Edit3 className="h-4 w-4" /> Edit
                        </button>
                        <button onClick={() => setActiveDraftId(activeDraftId === action.id ? null : action.id)} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-[#B0C9E0] hover:border-[#00AFFF] hover:text-white">
                          <Clock3 className="h-4 w-4" /> Rewrite
                        </button>
                        <button onClick={() => regenerateAction(action.id)} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-[#B0C9E0] hover:border-[#00AFFF] hover:text-white">
                          <RefreshCcw className="h-4 w-4" /> Regenerate
                        </button>
                        <button onClick={() => updateActionStatus(action.id, 'dismissed', 'dismiss')} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-[#B0C9E0] hover:border-[#00AFFF] hover:text-white">
                          <MinusCircle className="h-4 w-4" /> Dismiss
                        </button>
                      </div>
                    </div>
                    {activeDraftId === action.id && (
                      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="text-sm font-semibold text-white">Rewrite with instruction</p>
                        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                          <input value={rewriteInstruction} onChange={(event) => setRewriteInstruction(event.target.value)} placeholder="make it warmer, shorter, more professional, stronger close..." className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#0D1520] px-4 py-3 text-sm text-white outline-none placeholder:text-[#6F8499] focus:border-[#00AFFF]" />
                          <button onClick={() => rewriteAction(action.id)} className="rounded-xl bg-[#00AFFF] px-4 py-3 text-sm font-semibold text-[#061019] hover:bg-[#00D9FF]">Apply rewrite</button>
                        </div>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="mt-6 rounded-3xl border border-white/10 bg-[#111821]/90 p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Learning loop</h3>
              <p className="mt-2 text-sm leading-6 text-[#B0C9E0]">Approvals, edits, rewrites, regenerations, and dismissals are recorded as lightweight feedback signals for future draft quality. No vector memory or hidden execution is active.</p>
            </div>
            <div className="text-sm text-[#8FA3B8]">Recent feedback: {feedbackEvents.length}</div>
          </div>
        </section>
      </main>
    </div>
  )
}
