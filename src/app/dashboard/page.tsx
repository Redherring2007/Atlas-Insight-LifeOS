'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BrandHeader } from '@/components/brand-header'
import { SideNav } from '@/components/side-nav'
import { CommandBrief } from '@/components/command-brief'
import { DashboardPanels } from '@/components/dashboard-panels'
import { ModuleCard } from '@/components/module-card'
import { WorkspaceSelector } from '@/components/workspace-selector'
import { Workspace } from '@/types'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null)
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      const mockWorkspaces: Workspace[] = [
        {
          id: '1',
          name: 'Business Workspace',
          ownerId: 'user-1',
          type: 'business',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          name: 'Private Life',
          ownerId: 'user-1',
          type: 'private',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]
      setWorkspaces(mockWorkspaces)
      setCurrentWorkspace(mockWorkspaces[0])
    }
  }, [session])

  const handleWorkspaceChange = (workspace: Workspace) => {
    setCurrentWorkspace(workspace)
  }

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
    <div className="min-h-screen flex bg-[#070B10] text-[#EAF2F8]">
      <SideNav />

      <main className="flex-1 px-6 py-6 lg:px-10">
        <BrandHeader userName={userName} workspaceLabel="Premium command centre" />

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.45fr_0.55fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-[#111821]/90 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#8FA3B8]">Workspace</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">{currentWorkspace?.name ?? 'Business Workspace'}</h2>
                </div>
                <span className="text-sm text-[#8FA3B8]">{currentWorkspace?.type === 'private' ? 'Private' : 'Business'}</span>
              </div>

              <div className="mt-4">
                <WorkspaceSelector workspaces={workspaces} currentWorkspace={currentWorkspace} onWorkspaceChange={handleWorkspaceChange} />
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#111821]/90 p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-white">Quick links</h3>
                <span className="text-sm text-[#8FA3B8]">One click</span>
              </div>
              <div className="mt-4 grid gap-3">
                <ModuleCard title="AI Brain" description="Open the brain layer and make decisions faster." href="/brain" />
                <ModuleCard title="Tasks" description="Jump straight into task planning and daily work." href="/tasks" />
                <ModuleCard title="Calendar" description="See your schedule and next appointments." href="/calendar" />
                <ModuleCard title="Finance" description="Review budgets, approvals, and cash flow." href="/finance" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <CommandBrief />
            <DashboardPanels workspaceType={currentWorkspace?.type === 'private' ? 'private' : 'business'} />
          </div>
        </div>
      </main>
    </div>
  )
}
