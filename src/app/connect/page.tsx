'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Activity, CalendarDays, CheckCircle2, Link2, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'
import { BrandHeader } from '@/components/brand-header'
import { SideNav } from '@/components/side-nav'
import { connectionHealthLabel } from '@/lib/connectors/connection-health'
import { mockConnectedAccounts } from '@/lib/connectors/mock-connected-accounts'
import { detectConnectorProvider } from '@/lib/connectors/provider-detection'
import { signalsForAccount } from '@/lib/connectors/signal-extraction'
import type { ProviderDetectionResult } from '@/lib/connectors/types'

const signalLabels = [
  'Meetings',
  'Travel mentions',
  'Urgent follow-ups',
  'Client opportunities',
  'Finance pressure',
  'Schedule pressure',
  'Operational blockers',
  'Risk awareness',
  'Personal/work clashes',
]

function confidenceLabel(confidence: number) {
  if (confidence >= 0.85) return 'High confidence'
  if (confidence >= 0.6) return 'Moderate confidence'
  return 'Manual setup recommended'
}

function statusClass(status: string) {
  switch (status) {
    case 'healthy': return 'bg-[#4CFF3C]/10 text-[#8DFF83]'
    case 'needs-review': return 'bg-[#FFC857]/10 text-[#FFD987]'
    case 'setup-required': return 'bg-[#FFB4A8]/10 text-[#FFB4A8]'
    default: return 'bg-white/5 text-[#B0C9E0]'
  }
}

export default function ConnectPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [accountInput, setAccountInput] = useState('operator@gmail.com')
  const [detection, setDetection] = useState<ProviderDetectionResult | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  const detectedResult = useMemo(() => detectConnectorProvider(accountInput), [accountInput])

  useEffect(() => {
    setDetection(detectedResult)
  }, [detectedResult])

  if (status === 'loading' || !session) {
    return <div className="min-h-screen bg-[#070B10] text-[#EAF2F8] flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-[#070B10] text-[#EAF2F8] md:flex">
      <SideNav />
      <main className="flex-1 px-4 py-5 pb-24 sm:px-6 lg:px-10 lg:py-8">
        <BrandHeader userName={session.user?.name ?? 'Operator'} workspaceLabel="Atlas Connect" />

        <section className="mt-6 rounded-3xl border border-white/10 bg-[#121C28]/85 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:p-7">
          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr] xl:items-start">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#00D9FF]">Atlas Connect</p>
              <h2 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight text-white sm:text-4xl">Tell Atlas the account. Atlas identifies the safest read-only path.</h2>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-[#B0C9E0]">
                Atlas reviews approved connected accounts for operational signals such as meetings, travel, urgent follow-ups, blockers and schedule pressure. This foundation uses mock data only and never sends, deletes, edits, auto-responds, creates events, or changes account settings.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-[#B0C9E0]">
              <div className="flex items-center gap-3 text-white">
                <LockKeyhole className="h-5 w-5 text-[#00D9FF]" />
                <p className="font-semibold">Read-only first</p>
              </div>
              <p className="mt-3">OAuth and live provider connections come later. This pass only prepares neutral provider detection and signal summaries.</p>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.95fr]">
          <div className="rounded-3xl border border-white/10 bg-[#111821]/90 p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <Link2 className="h-5 w-5 text-[#00D9FF]" />
              <h3 className="text-xl font-semibold text-white">Add connected account</h3>
            </div>
            <p className="mt-3 text-sm leading-6 text-[#B0C9E0]">Enter an email address or domain. Atlas uses local heuristics only in this phase.</p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <input
                value={accountInput}
                onChange={(event) => setAccountInput(event.target.value)}
                placeholder="name@company.com"
                className="min-h-12 flex-1 rounded-xl border border-white/10 bg-[#0D1520] px-4 text-sm text-white outline-none transition placeholder:text-[#6F8499] focus:border-[#00AFFF] focus:ring-2 focus:ring-[#00AFFF]/20"
              />
              <button
                type="button"
                onClick={() => setDetection(detectConnectorProvider(accountInput))}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00AFFF] px-5 py-3 text-sm font-semibold text-[#061019] transition hover:bg-[#00D9FF]"
              >
                <ShieldCheck className="h-4 w-4" />
                Detect provider
              </button>
            </div>

            {detection && (
              <div className="mt-5 rounded-2xl border border-white/10 bg-[#0D1520] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-[#8FA3B8]">Likely provider</p>
                    <p className="mt-1 text-lg font-semibold text-white">{detection.provider}</p>
                  </div>
                  <span className="rounded-full bg-[#00D9FF]/10 px-3 py-1 text-xs font-semibold text-[#00D9FF]">{confidenceLabel(detection.confidence)}</span>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#8FA3B8]">Connection method</p>
                    <p className="mt-2 text-sm font-semibold text-white">{detection.connectionMethod}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#8FA3B8]">Capability</p>
                    <p className="mt-2 text-sm leading-6 text-[#B0C9E0]">{detection.readOnlyCapabilitySummary.summary}</p>
                  </div>
                </div>
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-semibold text-white">Setup notes</p>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-[#B0C9E0]">
                    {detection.requiredSetupNotes.map((note) => <li key={note}>{note}</li>)}
                  </ul>
                  <p className="mt-4 text-sm leading-6 text-[#8FA3B8]">Manual fallback: {detection.manualFallbackOption}</p>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#111821]/90 p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-[#00D9FF]" />
              <h3 className="text-xl font-semibold text-white">Signals Atlas can use</h3>
            </div>
            <p className="mt-3 text-sm leading-6 text-[#B0C9E0]">Atlas Connect turns approved account context into operational signals for Daily Brief and Command Queue.</p>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {signalLabels.map((signal) => (
                <div key={signal} className="rounded-2xl border border-white/10 bg-[#0D1520] px-4 py-3 text-sm text-[#D7E7F5]">{signal}</div>
              ))}
            </div>
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-[#B0C9E0]">
              <p className="font-semibold text-white">Safety boundary</p>
              <p className="mt-2">No sending. No deleting. No editing. No auto-responding. No event creation. No account changes.</p>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-white/10 bg-[#111821]/90 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-[#00D9FF]" />
            <h3 className="text-xl font-semibold text-white">Connected account mocks</h3>
          </div>
          <div className="mt-5 grid gap-4 xl:grid-cols-3">
            {mockConnectedAccounts.map((account) => {
              const accountSignals = signalsForAccount(account.id)
              const Icon = account.providerType === 'calendar' ? CalendarDays : Mail
              return (
                <article key={account.id} className="rounded-3xl border border-white/10 bg-[#0D1520]/90 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/5 text-[#00D9FF]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{account.label}</p>
                        <p className="mt-1 text-xs text-[#8FA3B8]">{account.provider}</p>
                      </div>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(account.healthStatus)}`}>{connectionHealthLabel(account.healthStatus)}</span>
                  </div>
                  <p className="mt-4 text-sm text-[#B0C9E0]">{account.accountAddress}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#00D9FF]">Read-only</p>
                  <div className="mt-4 space-y-2">
                    {accountSignals.slice(0, 2).map((signal) => (
                      <p key={signal.id} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm leading-6 text-[#B0C9E0]">{signal.title}</p>
                    ))}
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      </main>
    </div>
  )
}
