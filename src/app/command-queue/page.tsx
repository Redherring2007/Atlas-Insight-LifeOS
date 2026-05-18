'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Check, Clock3, Edit3, Mail, MinusCircle, ShieldCheck, WalletCards } from 'lucide-react'
import { BrandHeader } from '@/components/brand-header'
import { SideNav } from '@/components/side-nav'

type QueueStatus = 'pending' | 'approved' | 'snoozed' | 'dismissed'

interface QueueItem {
  id: string
  title: string
  source: string
  reason: string
  impact: string
  icon: 'email' | 'task' | 'risk' | 'crm' | 'finance' | 'project'
  status: QueueStatus
}

const initialQueue: QueueItem[] = [
  {
    id: 'follow-up-email',
    title: 'Approve follow-up email',
    source: 'Atlas CRM',
    reason: 'A warm relationship has gone quiet and a short check-in is ready.',
    impact: 'Keeps the conversation moving without adding a meeting.',
    icon: 'email',
    status: 'pending',
  },
  {
    id: 'overdue-task',
    title: 'Review overdue task',
    source: 'Atlas Projects',
    reason: 'One deadline needs a new owner or a revised due date.',
    impact: 'Reduces project drag before it becomes a blocker.',
    icon: 'task',
    status: 'pending',
  },
  {
    id: 'travel-risk-brief',
    title: 'Confirm travel risk brief',
    source: 'Atlas Risk',
    reason: 'A planned trip has schedule and disruption context ready for review.',
    impact: 'Keeps planning calm and practical.',
    icon: 'risk',
    status: 'pending',
  },
  {
    id: 'crm-update',
    title: 'Approve CRM update',
    source: 'Atlas CRM',
    reason: 'A contact should move to active follow-up based on recent activity.',
    impact: 'Keeps relationship context current.',
    icon: 'crm',
    status: 'pending',
  },
  {
    id: 'finance-concern',
    title: 'Review finance concern',
    source: 'Atlas Finance',
    reason: 'Cashflow timing may need attention before the end of the week.',
    impact: 'Gives you time to act before pressure builds.',
    icon: 'finance',
    status: 'pending',
  },
  {
    id: 'project-summary',
    title: 'Generate project summary',
    source: 'Atlas Projects',
    reason: 'A short stakeholder update can be prepared from current task state.',
    impact: 'Saves context-switching and keeps communication crisp.',
    icon: 'project',
    status: 'pending',
  },
]

function itemIcon(type: QueueItem['icon']) {
  switch (type) {
    case 'email': return Mail
    case 'finance': return WalletCards
    case 'risk': return ShieldCheck
    default: return Check
  }
}

export default function CommandQueuePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [items, setItems] = useState(initialQueue)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  if (status === 'loading' || !session) {
    return <div className="min-h-screen bg-[#070B10] text-[#EAF2F8] flex items-center justify-center">Loading...</div>
  }

  const pendingCount = items.filter((item) => item.status === 'pending').length

  const updateItem = (id: string, itemStatus: QueueStatus) => {
    setItems((current) => current.map((item) => item.id === id ? { ...item, status: itemStatus } : item))
  }

  return (
    <div className="min-h-screen bg-[#070B10] text-[#EAF2F8] md:flex">
      <SideNav />
      <main className="flex-1 px-4 py-5 sm:px-6 lg:px-10 lg:py-8">
        <BrandHeader userName={session.user?.name ?? 'Operator'} workspaceLabel="Command Queue" />

        <section className="mt-6 rounded-3xl border border-white/10 bg-[#121C28]/85 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#00D9FF]">Approval Layer</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Nothing important happens invisibly.</h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-[#B0C9E0]">
                Atlas prepares the next useful action, then waits here for approval, editing, snoozing, or dismissal.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
              <p className="text-sm text-[#B0C9E0]">Pending</p>
              <p className="mt-1 text-3xl font-semibold text-white">{pendingCount}</p>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4">
          {items.map((item) => {
            const Icon = itemIcon(item.icon)
            return (
              <article key={item.id} className="rounded-3xl border border-white/10 bg-[#111821]/90 p-5">
                <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
                  <div className="flex gap-4">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/5 text-[#00D9FF]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                        <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-[#B0C9E0]">{item.source}</span>
                        {item.status !== 'pending' && (
                          <span className="rounded-full bg-[#00D9FF]/10 px-3 py-1 text-xs capitalize text-[#00D9FF]">{item.status}</span>
                        )}
                      </div>
                      <p className="mt-2 text-sm leading-6 text-[#B0C9E0]">{item.reason}</p>
                      <p className="mt-1 text-sm leading-6 text-[#8FA3B8]">{item.impact}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    <button onClick={() => updateItem(item.id, 'approved')} className="inline-flex items-center gap-2 rounded-xl bg-[#00AFFF] px-4 py-2 text-sm font-semibold text-[#061019] hover:bg-[#00D9FF]">
                      <Check className="h-4 w-4" /> Approve
                    </button>
                    <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-[#B0C9E0] hover:border-[#00AFFF] hover:text-white">
                      <Edit3 className="h-4 w-4" /> Edit
                    </button>
                    <button onClick={() => updateItem(item.id, 'snoozed')} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-[#B0C9E0] hover:border-[#00AFFF] hover:text-white">
                      <Clock3 className="h-4 w-4" /> Snooze
                    </button>
                    <button onClick={() => updateItem(item.id, 'dismissed')} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-[#B0C9E0] hover:border-[#00AFFF] hover:text-white">
                      <MinusCircle className="h-4 w-4" /> Dismiss
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </section>
      </main>
    </div>
  )
}
