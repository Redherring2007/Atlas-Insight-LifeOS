'use client'

import { ContactProfile } from '@/types'
import { Trash2, Mail, Phone, MapPin, Zap } from 'lucide-react'

interface ContactCardProps {
  contact: ContactProfile
  onUpdate: (contactId: string, updates: Partial<ContactProfile>) => void
  onDelete: (contactId: string) => void
}

const leadStatusColors = {
  cold: { bg: 'bg-gray-600', text: 'text-gray-200', label: 'Cold' },
  warm: { bg: 'bg-yellow-600', text: 'text-yellow-200', label: 'Warm' },
  hot: { bg: 'bg-red-600', text: 'text-red-200', label: 'Hot' },
}

export function ContactCard({ contact, onUpdate, onDelete }: ContactCardProps) {
  const tags = Array.isArray(contact.tags) ? contact.tags : (contact.tags as any)?.split(',').filter(Boolean) || []
  
  // Determine lead status based on trustLevel
  const getLeadStatus = (level: number) => {
    if (level <= 3) return 'cold'
    if (level <= 7) return 'warm'
    return 'hot'
  }
  
  const status = getLeadStatus(contact.trustLevel || 5)
  const statusConfig = leadStatusColors[status as keyof typeof leadStatusColors]

  const cycleStatus = () => {
    const statuses = ['cold', 'warm', 'hot']
    const currentIndex = statuses.indexOf(status)
    const nextIndex = (currentIndex + 1) % statuses.length
    const trustMap = { cold: 2, warm: 5, hot: 9 }
    onUpdate(contact.id, { trustLevel: trustMap[nextIndex as keyof typeof trustMap] })
  }

  return (
    <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-4 border border-gray-600 hover:border-gray-500 transition-all shadow-lg hover:shadow-xl">
      {/* Header with status */}
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

      {/* Contact info */}
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
        {(contact as any).whereMet && (
          <div className="flex items-center space-x-2 text-gray-300">
            <MapPin size={14} className="text-orange-400" />
            <span>{(contact as any).whereMet}</span>
          </div>
        )}
      </div>

      {/* Conversation points */}
      {(contact as any).conversationPoints && (
        <div className="mb-3 pb-3 border-b border-gray-600">
          <p className="text-xs text-gray-400 mb-2">Last Conversation:</p>
          <p className="text-sm text-gray-300 italic">"{(contact as any).conversationPoints}"</p>
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {tags.map((tag, idx) => (
            <span key={idx} className="text-xs bg-blue-600/30 text-blue-300 px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Meta info */}
      <div className="text-xs text-gray-500 flex items-center justify-between">
        <span>Added {new Date(contact.createdAt).toLocaleDateString()}</span>
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
