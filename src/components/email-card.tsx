// @ts-nocheck
'use client'

import { Email } from '@/types'
import { Trash2, Check, Flag } from 'lucide-react'

interface EmailCardProps {
  email: Email
  onUpdate: (emailId: string, updates: Partial<Email>) => void
  onDelete: (emailId: string) => void
}

const urgencyConfig = {
  low: { bg: 'bg-green-600', text: 'text-green-200', label: '⚪ Low', icon: '📌' },
  medium: { bg: 'bg-yellow-600', text: 'text-yellow-200', label: '🟡 Medium', icon: '⚠️' },
  high: { bg: 'bg-red-600', text: 'text-red-200', label: '🔴 High', icon: '🚨' },
}

export function EmailCard({ email, onUpdate, onDelete }: EmailCardProps) {
  const urgency = (email as any).urgency || 'medium'
  const config = urgencyConfig[urgency as keyof typeof urgencyConfig]

  return (
    <div className="bg-gray-800 rounded-lg p-4 border-l-4" style={{
      borderLeftColor: urgency === 'high' ? '#dc2626' : urgency === 'medium' ? '#eab308' : '#16a34a'
    }}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* From and Subject */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="min-w-0">
              <p className="text-sm text-gray-400">{email.from}</p>
              <p className="text-white font-medium truncate">{email.subject}</p>
            </div>
            <div className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${config.bg} ${config.text}`}>
              <span>{config.icon}</span>
              <span>{config.label}</span>
            </div>
          </div>

          {/* Preview */}
          <p className="text-sm text-gray-400 mb-3">
            {(email as any).preview || email.body}
          </p>

          {/* Meta info */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Received {new Date((email as any).receivedAt || email.createdAt).toLocaleString()}</span>
            {(email as any).linkedProject && <span>Linked to {(email as any).linkedProject}</span>}
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={() => onUpdate(email.id, { read: true } as any)} className="rounded bg-gray-700 p-2 text-gray-300 hover:text-white">
            <Check size={14} />
          </button>
          <button onClick={() => onUpdate(email.id, { urgency: 'high' } as any)} className="rounded bg-gray-700 p-2 text-gray-300 hover:text-white">
            <Flag size={14} />
          </button>
          <button onClick={() => onDelete(email.id)} className="rounded bg-gray-700 p-2 text-gray-300 hover:text-white">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
