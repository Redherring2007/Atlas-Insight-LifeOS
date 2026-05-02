// @ts-nocheck
'use client'

import { TeamHandoff } from '@/types'
import { User, Clock, CheckCircle, AlertCircle } from 'lucide-react'

interface HandoffCardProps {
  handoff: TeamHandoff
  onUpdate: (handoffId: string, updates: Partial<TeamHandoff>) => void
  onDelete: (handoffId: string) => void
}

const statusConfig = {
  pending: { bg: 'bg-yellow-600', text: 'text-yellow-200', label: '⏳ Pending', icon: Clock },
  accepted: { bg: 'bg-blue-600', text: 'text-blue-200', label: '✓ Accepted', icon: CheckCircle },
  completed: { bg: 'bg-green-600', text: 'text-green-200', label: '✅ Completed', icon: CheckCircle },
  rejected: { bg: 'bg-red-600', text: 'text-red-200', label: '❌ Rejected', icon: AlertCircle },
}

export function HandoffCard({ handoff, onUpdate, onDelete }: HandoffCardProps) {
  const status = handoff.status as keyof typeof statusConfig
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <User size={16} className="text-gray-400" />
            <span className="text-sm text-gray-400">From:</span>
            <span className="text-white">{(handoff as any).fromUser}</span>
            <span className="text-gray-500">to</span>
            <span className="text-white">{(handoff as any).toUser}</span>
          </div>
          <h3 className="text-lg font-semibold text-white">{(handoff as any).taskTitle}</h3>
          <p className="text-sm text-gray-400">{handoff.notes}</p>
        </div>
        <span className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs ${config.bg} ${config.text}`}>
          <Icon size={13} /> {config.label}
        </span>
      </div>

      <div className="flex justify-end gap-2">
        <button onClick={() => onUpdate(handoff.id, { status: 'completed' } as any)} className="rounded bg-gray-700 px-3 py-1 text-sm text-gray-300 hover:text-white">
          Complete
        </button>
        <button onClick={() => onDelete(handoff.id)} className="rounded bg-gray-700 px-3 py-1 text-sm text-gray-300 hover:text-white">
          Delete
        </button>
      </div>
    </div>
  )
}
