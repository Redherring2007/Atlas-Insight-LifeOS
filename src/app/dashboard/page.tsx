'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { ArrowRight, Brain, CalendarDays, CheckCircle2, Clock3, FileText, Grid3X3, Send } from 'lucide-react'
import { BrandHeader } from '@/components/brand-header'
import { SideNav } from '@/components/side-nav'

const focusItems = [
  { title: 'Confirm today’s top priority', detail: 'Atlas Projects has two active deadlines and one blocked task.', time: '5 min' },
  { title: 'Review pending approvals', detail: 'Three low-risk actions are waiting in Command Queue.', time: '8 min' },
  { title: 'Prepare client follow-up', detail: 'CRM context suggests a short check-in before close of day.', time: '4 min' },
]

const queuePreview = [
  'Approve follow-up email',
  'Review overdue project task',
  'Generate project summary',
]

const modulePreview = [
  { name: 'Atlas Projects', status: 'Active' },
  { name: 'Atlas CRM', status: 'Active' },
  { name: 'Atlas Finance', status: 'Planned' },
  { name: 'Atlas MyLife', status: 'Planned' },
]

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#070B10] flex items-center justify-center text-white">
        Loading ATLAS...
      </div>
    )
  }

  if (!session) {
    return null
  }

  const userName = session.user?.name ?? 'Operator'

  return (
    <div className="min-h-screen bg-[#070B10] text-[#EAF2F8] md:flex">
      <SideNav />

      <main className="flex-1 px-4 py-5 sm:px-6 lg:px-10 lg:py-8">
        <BrandHeader userName={userName} workspaceLabel="Home" />

        <section className="mt-6 rounded-3xl border border-white/10 bg-[#121C28]/85 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:p-7">
          <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#00D9FF]">Ask Atlas</p>
              <h2 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight text-white sm:text-4xl">
                Operational Intelligence for Human and Business Performance.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-[#B0C9E0]">
                Start with a question, approve the next action, or prepare your daily brief. ATLAS keeps the system calm while the intelligence works underneath.
              </p>
              <div className="mt-6 rounded-2xl border border-white/10 bg-[#0D1520] p-3">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    className="min-h-12 flex-1 rounded-xl border border-white/10 bg-[#111B27] px-4 text-sm text-white outline-none transition placeholder:text-[#6F8499] focus:border-[#00AFFF] focus:ring-2 focus:ring-[#00AFFF]/20"
                    placeholder="Ask Atlas what needs your attention today..."
                  />
                  <Link href="/ask-atlas" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00AFFF] px-5 py-3 text-sm font-semibold text-[#061019] transition hover:bg-[#00D9FF]">
                    <Send className="h-4 w-4" />
                    Ask
                  </Link>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-3">
                <CalendarDays className="h-5 w-5 text-[#00D9FF]" />
                <h3 className="text-base font-semibold text-white">Daily Brief</h3>
              </div>
              <p className="mt-3 text-sm leading-6 text-[#B0C9E0]">
                A short operational brief: priorities, approvals, blockers, and one useful insight.
              </p>
              <Link href="/ask-atlas" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#00D9FF] hover:text-white">
                Prepare brief <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-3xl border border-white/10 bg-[#111821]/90 p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#8FA3B8]">Today’s Focus</p>
                <h3 className="mt-2 text-xl font-semibold text-white">What matters now</h3>
              </div>
              <Clock3 className="h-5 w-5 text-[#00D9FF]" />
            </div>
            <div className="mt-5 space-y-3">
              {focusItems.map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-[#0D1520]/90 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-white">{item.title}</p>
                      <p className="mt-1 text-sm leading-6 text-[#B0C9E0]">{item.detail}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-white/5 px-3 py-1 text-xs text-[#B0C9E0]">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-[#111821]/90 p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#8FA3B8]">Command Queue</p>
                <h3 className="mt-2 text-xl font-semibold text-white">Ready for approval</h3>
              </div>
              <Link href="/command-queue" className="text-sm font-semibold text-[#00D9FF] hover:text-white">Open</Link>
            </div>
            <div className="mt-5 space-y-3">
              {queuePreview.map((item) => (
                <div key={item} className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0D1520]/90 p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-4 w-4 text-[#4CFF3C]" />
                    <span className="text-sm text-[#EAF2F8]">{item}</span>
                  </div>
                  <span className="text-xs text-[#8FA3B8]">Mock</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-3xl border border-white/10 bg-[#111821]/90 p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#8FA3B8]">Modules</p>
                <h3 className="mt-2 text-xl font-semibold text-white">Operational ecosystem</h3>
              </div>
              <Grid3X3 className="h-5 w-5 text-[#00D9FF]" />
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {modulePreview.map((module) => (
                <div key={module.name} className="rounded-2xl border border-white/10 bg-[#0D1520]/90 p-4">
                  <p className="text-sm font-semibold text-white">{module.name}</p>
                  <p className="mt-2 text-xs text-[#B0C9E0]">{module.status}</p>
                </div>
              ))}
            </div>
            <Link href="/modules" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#00D9FF] hover:text-white">
              View modules <ArrowRight className="h-4 w-4" />
            </Link>
          </section>

          <section className="rounded-3xl border border-white/10 bg-[#111821]/90 p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <Brain className="h-5 w-5 text-[#00D9FF]" />
              <h3 className="text-xl font-semibold text-white">Strategic Signals</h3>
            </div>
            <div className="mt-5 grid gap-3 lg:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-[#0D1520]/90 p-4">
                <p className="text-sm font-semibold text-white">Focus is the constraint</p>
                <p className="mt-2 text-sm leading-6 text-[#B0C9E0]">The queue is light enough to clear quickly. Today’s best move is approval discipline, not more planning.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#0D1520]/90 p-4">
                <p className="text-sm font-semibold text-white">Modules stay beneath the shell</p>
                <p className="mt-2 text-sm leading-6 text-[#B0C9E0]">Projects, CRM, finance, risk, and life admin feed the command layer without crowding Home.</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
