'use client'

import { BrandHeader } from '@/components/brand-header'
import { SideNav } from '@/components/side-nav'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function SettingsPage() {
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
          <BrandHeader userName={session.user.name ?? 'Operator'} workspaceLabel="System settings and preferences" />
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_0.9fr]">
            <section className="rounded-3xl border border-white/10 bg-[#121C28]/80 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.3em] text-[#00D9FF]">Settings</p>
              <h2 className="mt-3 text-3xl font-semibold text-[#EAF2F8]">A calm command centre for system control</h2>
              <p className="mt-4 text-sm leading-6 text-[#8FA3B8]">Configure your ATLAS Life OS experience, privacy settings, and operational preferences in one place.</p>
              <div className="mt-8 space-y-6">
                <div className="rounded-3xl border border-white/10 bg-[#0F1620]/90 p-5">
                  <p className="text-sm font-semibold text-[#EAF2F8]">Personal privacy</p>
                  <p className="mt-2 text-sm text-[#8FA3B8]">Personal data is never visible to the organisation. Your private AI questions and private calendar remain private.</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-[#0F1620]/90 p-5">
                  <p className="text-sm font-semibold text-[#EAF2F8]">Team access</p>
                  <p className="mt-2 text-sm text-[#8FA3B8]">Control what team members can see and what actions they can execute.</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-[#0F1620]/90 p-5">
                  <p className="text-sm font-semibold text-[#EAF2F8]">AI behaviour</p>
                  <p className="mt-2 text-sm text-[#8FA3B8]">Adjust how ATLAS surfaces recommendations and what context it uses.</p>
                </div>
              </div>
            </section>
            <aside className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-[#121C28]/80 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.3em] text-[#00D9FF]">System notes</p>
                <h3 className="mt-3 text-2xl font-semibold text-[#EAF2F8]">Command layer preferences</h3>
                <p className="mt-4 text-sm leading-6 text-[#8FA3B8]">These settings are the foundation for a premium, private, and intelligent operating system experience.</p>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  )
}
