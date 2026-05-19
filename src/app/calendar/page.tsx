'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { ArrowRight, CalendarDays, Clock3, Focus, ListChecks, ShieldCheck } from 'lucide-react'
import { BrandHeader } from '@/components/brand-header'
import { SideNav } from '@/components/side-nav'
import { buildCalendarPlanningState, planningBusyBlocks, planningTasks } from '@/lib/calendar/planning'
import { analyseSchedule } from '@/lib/scheduling/engine'
import type { PlanningFeedItem } from '@/lib/calendar/types'

function pressureClass(pressure: PlanningFeedItem['pressure']) {
  if (pressure === 'high') return 'text-[#FFD166] bg-[#FFD166]/10'
  if (pressure === 'medium') return 'text-[#00D9FF] bg-[#00D9FF]/10'
  return 'text-[#B0C9E0] bg-white/5'
}

function FeedList({ title, items }: { title: string; items: PlanningFeedItem[] }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-[#111821]/90 p-5">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <article key={item.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-white">{item.title}</p>
              <span className={`rounded-full px-3 py-1 text-xs ${pressureClass(item.pressure)}`}>{item.timeLabel}</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-[#B0C9E0]">{item.detail}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default function CalendarPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const planning = buildCalendarPlanningState()
  const analysis = analyseSchedule(planningBusyBlocks, planningTasks)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  if (status === 'loading' || !session) {
    return <div className="min-h-screen bg-[#070B10] text-[#EAF2F8] flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-[#070B10] text-[#EAF2F8] md:flex">
      <SideNav />
      <main className="flex-1 px-4 py-5 pb-24 sm:px-6 lg:px-10 lg:py-8">
        <BrandHeader userName={session.user?.name ?? 'Operator'} workspaceLabel="Calendar" />

        <section className="mt-6 rounded-3xl border border-white/10 bg-[#121C28]/85 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.3em] text-[#00D9FF]">Planning Layer</p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-4xl">A calmer view of time, pressure, and preparation.</h2>
              <p className="mt-4 text-sm leading-6 text-[#B0C9E0]">Atlas can see deadline pressure, meeting density, unscheduled work, and focus windows. It prepares schedule suggestions for Command Queue; it does not edit your calendar without approval.</p>
            </div>
            <Link href="/command-queue" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00AFFF] px-4 py-3 text-sm font-semibold text-[#061019] transition hover:bg-[#00D9FF]">
              Review schedule actions <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <CalendarDays className="h-5 w-5 text-[#00D9FF]" />
              <p className="mt-3 text-sm text-[#B0C9E0]">Workload density</p>
              <p className="mt-1 text-2xl font-semibold capitalize text-white">{analysis.workloadDensity}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <Clock3 className="h-5 w-5 text-[#00D9FF]" />
              <p className="mt-3 text-sm text-[#B0C9E0]">Focus windows</p>
              <p className="mt-1 text-2xl font-semibold text-white">{analysis.focusWindows.length}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <ListChecks className="h-5 w-5 text-[#00D9FF]" />
              <p className="mt-3 text-sm text-[#B0C9E0]">Deadline risks</p>
              <p className="mt-1 text-2xl font-semibold text-white">{analysis.deadlineRisks.length}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <ShieldCheck className="h-5 w-5 text-[#00D9FF]" />
              <p className="mt-3 text-sm text-[#B0C9E0]">Calendar writes</p>
              <p className="mt-1 text-2xl font-semibold text-white">Approval only</p>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 xl:grid-cols-2">
          <FeedList title="Today" items={planning.today} />
          <FeedList title="Upcoming" items={planning.upcoming} />
          <FeedList title="Deadline feed" items={planning.deadlines} />
          <FeedList title="Overdue feed" items={planning.overdue} />
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-white/10 bg-[#111821]/90 p-5">
            <div className="flex items-center gap-3">
              <Focus className="h-5 w-5 text-[#00D9FF]" />
              <h3 className="text-lg font-semibold text-white">Suggested schedule blocks</h3>
            </div>
            <div className="mt-4 space-y-3">
              {analysis.suggestions.map((suggestion) => (
                <article key={suggestion.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-white">{suggestion.title}</p>
                    <span className="rounded-full bg-[#00D9FF]/10 px-3 py-1 text-xs text-[#00D9FF]">{Math.round(suggestion.confidence * 100)}% confidence</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#B0C9E0]">{suggestion.reason}</p>
                  <p className="mt-2 text-sm text-[#8FA3B8]">Window: {suggestion.proposedWindow}</p>
                </article>
              ))}
            </div>
          </div>

          <aside className="space-y-4">
            <FeedList title="Unscheduled tasks" items={planning.unscheduledTasks} />
            <section className="rounded-3xl border border-white/10 bg-[#111821]/90 p-5">
              <h3 className="text-lg font-semibold text-white">Focus protection</h3>
              <div className="mt-4 space-y-3">
                {planning.focusProtection.concat(planning.meetingPrep).map((item) => (
                  <p key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-[#B0C9E0]">{item}</p>
                ))}
              </div>
            </section>
          </aside>
        </section>
      </main>
    </div>
  )
}
