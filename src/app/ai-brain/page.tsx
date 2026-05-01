'use client'

import { AIBrainPanel } from '@/components/ai-brain-panel'
import { BrandHeader } from '@/components/brand-header'
import { SideNav } from '@/components/side-nav'
import { LearningSignalsPanel } from '@/components/learning-signals-panel'
import { PrivacyBanner } from '@/components/privacy-banner'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AIBrainPage() {
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
          <BrandHeader userName={session.user.name ?? 'Operator'} workspaceLabel="AI Brain command layer" />
          <div className="mt-8 space-y-8">
            <AIBrainPanel />
            <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
              <PrivacyBanner />
              <LearningSignalsPanel />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
