'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { ArrowRight, BriefcaseBusiness, Contact, FileCheck2, Landmark, LifeBuoy, Link2, ShieldCheck, Vault } from 'lucide-react'
import { BrandHeader } from '@/components/brand-header'
import { SideNav } from '@/components/side-nav'

type ModuleStatus = 'Active' | 'Connected' | 'Coming Soon' | 'Planned'

const modules = [
  {
    name: 'Atlas Projects',
    purpose: 'Project and task management module.',
    description: 'Plan work, manage priorities, track blockers, and feed action requests into Command Queue.',
    status: 'Active' as ModuleStatus,
    href: '/projects',
    cta: 'Open module',
    icon: BriefcaseBusiness,
  },
  {
    name: 'Atlas CRM',
    purpose: 'Contacts, pipeline, relationships and simple email-aware follow-up management.',
    description: 'Keep relationship context clear and prepare follow-ups without turning Home into a CRM dashboard.',
    status: 'Active' as ModuleStatus,
    href: '/contacts',
    cta: 'Open module',
    icon: Contact,
  },
  {
    name: 'Atlas Verify',
    purpose: 'Commercial due diligence and verification module.',
    description: 'Includes Snapshot and DeepSweep as clean commercial verification products for confident decisions.',
    status: 'Planned' as ModuleStatus,
    href: '/modules',
    cta: 'View plan',
    icon: FileCheck2,
  },
  {
    name: 'Atlas Risk',
    purpose: 'Operational resilience and awareness for business and life management.',
    description: 'Future sections include business performance overview, risk and security overview, and personal/executive awareness.',
    status: 'Planned' as ModuleStatus,
    href: '/modules',
    cta: 'View plan',
    icon: ShieldCheck,
  },
  {
    name: 'Atlas Finance',
    purpose: 'Finance awareness and operational cashflow guidance.',
    description: 'Designed to integrate with Xero, QuickBooks, and Zoho later rather than replace accounting systems.',
    status: 'Active' as ModuleStatus,
    href: '/finance',
    cta: 'Open module',
    icon: Landmark,
  },
  {
    name: 'Atlas Vault',
    purpose: 'Secure documents, memory, evidence, files and operational knowledge storage.',
    description: 'A future knowledge layer for documents, records, and trusted operational context.',
    status: 'Planned' as ModuleStatus,
    href: '/modules',
    cta: 'View plan',
    icon: Vault,
  },
  {
    name: 'Atlas Connect',
    purpose: 'Approved integrations/connectors for email, calendar, finance, CRM and external systems.',
    description: 'Keeps external systems connected beneath the shell without exposing backend complexity.',
    status: 'Coming Soon' as ModuleStatus,
    href: '/modules',
    cta: 'View plan',
    icon: Link2,
  },
  {
    name: 'Atlas MyLife',
    purpose: 'Personal operational layer for life admin and work/life balance.',
    description: 'Calendar, routines, goals, personal finance awareness, and conflict awareness in one calm layer.',
    status: 'Planned' as ModuleStatus,
    href: '/calendar',
    cta: 'Open prototype',
    icon: LifeBuoy,
  },
]

function statusClass(status: ModuleStatus) {
  switch (status) {
    case 'Active': return 'bg-[#4CFF3C]/10 text-[#8DFF83]'
    case 'Connected': return 'bg-[#00D9FF]/10 text-[#00D9FF]'
    case 'Coming Soon': return 'bg-[#FFC857]/10 text-[#FFD987]'
    default: return 'bg-white/5 text-[#B0C9E0]'
  }
}

export default function ModulesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

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
        <BrandHeader userName={session.user?.name ?? 'Operator'} workspaceLabel="Modules" />

        <section className="mt-6 rounded-3xl border border-white/10 bg-[#121C28]/85 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:p-7">
          <p className="text-xs uppercase tracking-[0.3em] text-[#00D9FF]">Atlas Ecosystem</p>
          <h2 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight text-white sm:text-4xl">A universal operational shell with focused modules underneath.</h2>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-[#B0C9E0]">
            Modules hold the detail. LifeOS keeps the interface simple: ask, review, approve, and launch the right workspace in a few clicks.
          </p>
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {modules.map((module) => {
            const Icon = module.icon
            return (
              <article key={module.name} className="rounded-3xl border border-white/10 bg-[#111821]/90 p-5 transition hover:border-[#00AFFF]/40">
                <div className="flex items-start justify-between gap-4">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/5 text-[#00D9FF]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(module.status)}`}>{module.status}</span>
                </div>
                <h3 className="mt-5 text-xl font-semibold text-white">{module.name}</h3>
                <p className="mt-2 text-sm font-medium text-[#EAF2F8]">{module.purpose}</p>
                <p className="mt-3 text-sm leading-6 text-[#B0C9E0]">{module.description}</p>
                <Link href={module.href} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#00D9FF] hover:text-white">
                  {module.cta} <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            )
          })}
        </section>
      </main>
    </div>
  )
}
