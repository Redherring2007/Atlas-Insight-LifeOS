'use client'

import { ContactProfileUi, LeadStatus } from '@/types'
import { Trash2, Mail, Phone, MapPin, Zap } from 'lucide-react'
import { asStringArray, displayDate } from '@/lib/display'

interface ContactCardProps {
  contact: ContactProfileUi
  onUpdate: (contactId: string, updates: Partial<ContactProfileUi>) => void
  onDelete: (contactId: string) => void
}

const leadStatusColors = {
  cold: { bg: 'bg-gray-600', text: 'text-gray-200', label: 'Cold' },
  warm: { bg: 'bg-yellow-600', text: 'text-yellow-200', label: 'Warm' },
  hot: { bg: 'bg-red-600', text: 'text-red-200', label: 'Hot' },
}

export function ContactCard({ contact, onUpdate, onDelete }: ContactCardProps) {
  const tags = asStringArray(contact.tags)

  const getLeadStatus = (level: number | null): LeadStatus => {
    const safeLevel = level ?? 5
    if (safeLevel <= 3) return 'cold'
    if (safeLevel <= 7) return 'warm'
    return 'hot'
  }

  const status = getLeadStatus(contact.trustLevel)
  const statusConfig = leadStatusColors[status]

  const cycleStatus = () => {
    const statuses: LeadStatus[] = ['cold', 'warm', 'hot']
    const currentIndex = statuses.indexOf(status)
    const nextIndex = (currentIndex + 1) % statuses.length
    const trustMap: Record<LeadStatus, number> = { cold: 2, warm: 5, hot: 9 }
    const nextStatus = statuses[nextIndex]
    onUpdate(contact.id, { trustLevel: trustMap[nextStatus] })
  }

  return (
    <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-4 border border-gray-600 hover:border-gray-500 transition-all shadow-lg hover:shadow-xl">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">{contact.name}</h3>
          {contact.company && <p className="text-sm text-gray-400">{contact.company}</p>}
        </div>
        <button
          onClick={cycleStatus}
          className={`flex items-center space-x-1 px-3 py-1 rounded text-xs font-semibold ${statusConfig.bg} ${statusConfig.text} hover:opacity-80 transition-opacity`}
        >
          <Zap size={14} />
          <span>{statusConfig.label}</span>
        </button>
      </div>

      <div className="space-y-2 mb-3 text-sm">
        {contact.email && (
          <div className="flex items-center space-x-2 text-gray-300 hover:text-white cursor-pointer">
            <Mail size={14} className="text-blue-400" />
            <span>{contact.email}</span>
          </div>
        )}
        {contact.phone && (
          <div className="flex items-center space-x-2 text-gray-300 hover:text-white cursor-pointer">
            <Phone size={14} className="text-green-400" />
            <span>{contact.phone}</span>
          </div>
        )}
        {contact.whereMet && (
          <div className="flex items-center space-x-2 text-gray-300">
            <MapPin size={14} className="text-orange-400" />
            <span>{contact.whereMet}</span>
          </div>
        )}
      </div>

      {contact.conversationPoints && (
        <div className="mb-3 pb-3 border-b border-gray-600">
          <p className="text-xs text-gray-400 mb-2">Last Conversation:</p>
          <p className="text-sm text-gray-300 italic">"{contact.conversationPoints}"</p>
        </div>
      )}

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {tags.map((tag, idx) => (
            <span key={idx} className="text-xs bg-blue-600/30 text-blue-300 px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="text-xs text-gray-500 flex items-center justify-between">
        <span>Added {displayDate(contact.createdAt)}</span>
        <button
          onClick={() => onDelete(contact.id)}
          className="text-red-400 hover:text-red-300 transition-colors"
          title="Delete contact"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}
