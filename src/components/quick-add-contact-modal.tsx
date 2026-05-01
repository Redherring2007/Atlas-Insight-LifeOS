'use client'

import { useState } from 'react'
import { X, Upload } from 'lucide-react'
import { NewContactProfile } from '@/types'

interface QuickAddContactModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (contact: Omit<NewContactProfile, 'id' | 'createdAt' | 'updatedAt'>) => void
  workspaceId: string
  userId: string
}

export function QuickAddContactModal({ isOpen, onClose, onSubmit, workspaceId, userId }: QuickAddContactModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    whereMet: '',
    conversationPoints: '',
  })

  const [scanMode, setScanMode] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      alert('Please enter a name')
      return
    }

    onSubmit({
      workspaceId,
      name: formData.name.trim(),
      email: formData.email.trim() || null,
      phone: formData.phone.trim() || null,
      company: formData.company.trim() || null,
      tags: formData.conversationPoints.split(',').map(t => t.trim()).filter(Boolean),
      trustLevel: 5,
      whereMet: formData.whereMet.trim() || null,
      conversationPoints: formData.conversationPoints.trim() || null,
    } as any)

    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      whereMet: '',
      conversationPoints: '',
    })
    setScanMode(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-750">
          <h2 className="text-lg font-semibold text-white">
            {scanMode ? '📱 Scan Business Card' : '➕ Add Contact'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          {!scanMode ? (
            <>
              {/* Name (required) */}
              <div>
                <label className="text-xs font-semibold text-gray-300 mb-1 block">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Smith"
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  autoFocus
                />
              </div>

              {/* Company */}
              <div>
                <label className="text-xs font-semibold text-gray-300 mb-1 block">
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Acme Corp"
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-semibold text-gray-300 mb-1 block">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="text-xs font-semibold text-gray-300 mb-1 block">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 555-0123"
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Where Met */}
              <div>
                <label className="text-xs font-semibold text-gray-300 mb-1 block">
                  Where Met
                </label>
                <input
                  type="text"
                  name="whereMet"
                  value={formData.whereMet}
                  onChange={handleChange}
                  placeholder="Networking event, LinkedIn, Referral..."
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Conversation Points */}
              <div>
                <label className="text-xs font-semibold text-gray-300 mb-1 block">
                  Quick Notes
                </label>
                <textarea
                  name="conversationPoints"
                  value={formData.conversationPoints}
                  onChange={handleChange}
                  placeholder="Quick note about conversation or topics discussed..."
                  rows={2}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                />
              </div>
            </>
          ) : (
            <div className="py-8 text-center">
              <Upload size={32} className="text-gray-400 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">
                Business card scanning coming soon! 
              </p>
              <p className="text-gray-500 text-xs mt-2">
                For now, use manual entry with phone camera or OCR tool
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={() => setScanMode(!scanMode)}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
            >
              {scanMode ? '← Back' : '📱 Scan'}
            </button>
            <button
              type="submit"
              disabled={!formData.name.trim()}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Contact
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
