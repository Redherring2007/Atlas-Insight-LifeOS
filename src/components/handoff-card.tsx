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
            <span className="text-white font-medium">{(handoff as any).fromUser}</span>
            <span className="text-gray-400">→</span>
            <span className="text-white font-medium">{(handoff as any).toUser}</span>
          </div>
          <h3 className="text-lg font-semibold text-white">{(handoff as any).taskTitle}</h3>
          {(handoff as any).notes && (
            <p className="text-gray-400 text-sm mt-1">{(handoff as any).notes}</p>
          )}
        </div>
        <button
          onClick={() => {
            const statuses = ['pending', 'accepted', 'completed', 'rejected']
            const currentIndex = statuses.indexOf(status)
            const nextIndex = (currentIndex + 1) % statuses.length
            onUpdate(handoff.id, { status: statuses[nextIndex] as any })
          }}
          className={`flex items-center space-x-1 px-3 py-1 rounded text-xs font-semibold whitespace-nowrap ${config.bg} ${config.text} hover:opacity-80 transition-opacity`}
        >
          <Icon size={14} />
          <span>{config.label}</span>
        </button>
      </div>

      {/* Task details */}
      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
        <div>
          <span className="text-gray-400">Priority:</span>
          <span className={`ml-2 font-medium ${
            (handoff as any).priority === 'high' ? 'text-red-400' :
            (handoff as any).priority === 'medium' ? 'text-yellow-400' :
            'text-green-400'
          }`}>
            {(handoff as any).priority?.toUpperCase()}
          </span>
        </div>
        <div>
          <span className="text-gray-400">Due:</span>
          <span className="ml-2 text-white">
            {(handoff as any).dueDate ? new Date((handoff as any).dueDate).toLocaleDateString() : 'No due date'}
          </span>
        </div>
      </div>

      {/* Meta info */}
      <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-700 pt-3">
        <span>Created {new Date(handoff.createdAt).toLocaleDateString()}</span>
        <button
          onClick={() => onDelete(handoff.id)}
          className="text-red-400 hover:text-red-300 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
