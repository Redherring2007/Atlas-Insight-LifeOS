'use client'

import { BrandHeader } from '@/components/brand-header'
import { SideNav } from '@/components/side-nav'
import { ConnectedSystemCard } from '@/components/connected-system-card'
import { PrivacyBanner } from '@/components/privacy-banner'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const systems = [
  {
    id: 'atlas-insight',
    name: 'ATLAS Insight',
    category: 'Intelligence / OSINT / risk signals',
    status: 'connected',
    description: 'External module for signals, risk scoring, and intelligence that feeds the command layer.'
  },
  {
    id: 'sargassum',
    name: 'Sargassum System',
    category: 'Environmental tracking / routing',
    status: 'available',
    description: 'Connect tracking and routing data to build smarter operational choices.'
  },
  {
    id: 'trading-bot',
    name: 'Trading Bot',
    category: 'Finance / signal intelligence',
    status: 'available',
    description: 'Link trading signals and finance insights while keeping control in ATLAS.'
  },
  {
    id: 'future-products',
    name: 'Future Products',
    category: 'Plugin-ready ecosystem',
    status: 'disabled',
    description: 'Add future integrations without changing the core command hub.'
  },
]

export default function ConnectedSystemsPage() {
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
    <div className="min-h-screen bg-[#070B10] text-[#EAF2F8]">
      <div className="flex">
        <SideNav />
        <main className="flex-1 px-6 py-8 xl:px-10">
          <BrandHeader userName={session.user.name ?? 'Operator'} workspaceLabel="Connected systems hub" />
          <div className="mt-8 grid gap-8 xl:grid-cols-[1.5fr_0.9fr]">
            <section className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-[#121C28]/80 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.3em] text-[#00D9FF]">Connected Systems</p>
                <h2 className="mt-2 text-3xl font-semibold text-[#EAF2F8]">All systems work independently. Together, they become stronger.</h2>
                <p className="mt-3 text-sm leading-6 text-[#8FA3B8]">ATLAS Life OS is the central command layer. Connected modules bring added intelligence without changing the independent behaviour of each system.</p>
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                {systems.map((system) => (
                  <ConnectedSystemCard key={system.id} {...system} />
                ))}
              </div>
            </section>
            <aside className="space-y-6">
              <PrivacyBanner />
              <div className="rounded-3xl border border-white/10 bg-[#121C28]/80 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.3em] text-[#00D9FF]">Integration note</p>
                <h3 className="mt-3 text-2xl font-semibold text-[#EAF2F8]">The hub stays central</h3>
                <p className="mt-4 text-sm leading-6 text-[#8FA3B8]">When systems are linked, ATLAS Life OS becomes the command layer for intelligence, finance, calendar, and decisions.</p>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  )
}
