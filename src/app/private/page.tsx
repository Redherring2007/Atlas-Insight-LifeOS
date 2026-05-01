'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BrainIcon } from '@/components/brain-icon'
import { CommandInput } from '@/components/command-input'
import { DashboardPanels } from '@/components/dashboard-panels'

export default function PrivateWorkspace() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  const handleCommand = async (command: string) => {
    setIsProcessing(true)
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false)
      console.log('Processed private command:', command)
    }, 2000)
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  // In real app, check if user is owner
  // For now, assume access

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">ATLAS LifeOS - Private</h1>
            <BrainIcon isProcessing={isProcessing} size={40} />
          </div>
          <div className="text-sm text-gray-400">
            Private Workspace - Owner Only
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        {/* Command Input */}
        <div className="mb-8">
          <CommandInput onCommand={handleCommand} isProcessing={isProcessing} />
        </div>

        {/* Private Dashboard Panels */}
        <DashboardPanels workspaceType="private" />
      </main>
    </div>
  )
}