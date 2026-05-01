'use client'

import Link from 'next/link'
import { BrandHeader } from '@/components/brand-header'
import { SideNav } from '@/components/side-nav'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function TeamAliasPage() {
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
          <BrandHeader userName={session.user.name ?? 'Operator'} workspaceLabel="Team access and collaboration" />
          <div className="mt-8 rounded-3xl border border-white/10 bg-[#121C28]/80 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.3em] text-[#00D9FF]">Team Access</p>
            <h2 className="mt-3 text-3xl font-semibold text-[#EAF2F8]">Manage team roles and permission flow</h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#8FA3B8]">ATLAS Life OS separates personal privacy from business access while keeping the AI Assistant included by default for every user.</p>
            <div className="mt-8 rounded-3xl border border-white/10 bg-[#0F1620]/90 p-6">
              <p className="text-sm font-semibold text-[#EAF2F8]">This page is an alias to the full team access view.</p>
              <Link href="/teams" className="mt-4 inline-flex rounded-full bg-[#00AFFF] px-5 py-3 text-sm font-semibold text-[#070B10] transition hover:bg-[#00D9FF]">
                Open Team Access
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
