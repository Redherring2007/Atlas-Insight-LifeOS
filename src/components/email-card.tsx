'use client'

import { EmailUi, EmailUrgency } from '@/types'
import { Trash2, Check, Flag } from 'lucide-react'
import { displayDate, displayString } from '@/lib/display'

interface EmailCardProps {
  email: EmailUi
  onUpdate: (emailId: string, updates: Partial<EmailUi>) => void
  onDelete: (emailId: string) => void
}

const urgencyConfig = {
  low: { bg: 'bg-green-600', text: 'text-green-200', label: 'Low', icon: '•' },
  medium: { bg: 'bg-yellow-600', text: 'text-yellow-200', label: 'Medium', icon: '!' },
  high: { bg: 'bg-red-600', text: 'text-red-200', label: 'High', icon: '!' },
}

function normalizeUrgency(urgency: string | null | undefined): EmailUrgency {
  if (urgency === 'high' || urgency === 'low') return urgency
  return 'medium'
}

export function EmailCard({ email, onUpdate, onDelete }: EmailCardProps) {
  const urgency = normalizeUrgency(email.urgency)
  const config = urgencyConfig[urgency]
  const subject = displayString(email.subject, 'No subject')

  return (
    <div className="bg-gray-800 rounded-lg p-4 border-l-4" style={{
      borderLeftColor: urgency === 'high' ? '#dc2626' : urgency === 'medium' ? '#eab308' : '#16a34a'
    }}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="min-w-0">
              <p className="text-sm text-gray-400">{displayString(email.from, 'Unknown sender')}</p>
              <p className="text-white font-medium truncate">{subject}</p>
            </div>
            <div className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${config.bg} ${config.text}`}>
              <span>{config.icon}</span>
              <span>{config.label}</span>
            </div>
          </div>

          <p className="text-sm text-gray-400 line-clamp-2 mb-3">
            {email.preview || subject}
          </p>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{displayDate(email.receivedAt ?? email.createdAt)}</span>
            {email.linkedProject && (
              <span className="bg-gray-700 px-2 py-1 rounded text-blue-300">
                {email.linkedProject}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => onUpdate(email.id, { read: !email.read })}
            className={`p-2 rounded transition-colors ${
              email.read
                ? 'bg-gray-700 text-gray-400 hover:text-white'
                : 'bg-blue-600 text-white hover:bg-blue-500'
            }`}
            title={email.read ? 'Mark unread' : 'Mark read'}
          >
            <Check size={16} />
          </button>
          <button
            onClick={() => {
              const newUrgency =
                urgency === 'low' ? 'medium' :
                urgency === 'medium' ? 'high' :
                'low'
              onUpdate(email.id, { urgency: newUrgency })
            }}
            className="p-2 rounded bg-gray-700 text-gray-400 hover:text-yellow-300 transition-colors"
            title="Cycle urgency"
          >
            <Flag size={16} />
          </button>
          <button
            onClick={() => onDelete(email.id)}
            className="p-2 rounded bg-gray-700 text-gray-400 hover:text-red-400 transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {email.tags && email.tags.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-700 flex flex-wrap gap-2">
          {email.tags.map((tag, idx) => (
            <span key={idx} className="text-xs bg-blue-600/20 text-blue-300 px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
