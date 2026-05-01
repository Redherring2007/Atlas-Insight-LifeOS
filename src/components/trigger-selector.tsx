'use client'

import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

interface TriggerOption {
  id: string
  label: string
  category: 'email' | 'task' | 'finance' | 'calendar' | 'contact'
  description: string
  config?: string[]
}

const TRIGGER_OPTIONS: TriggerOption[] = [
  {
    id: 'email-marked-urgent',
    label: 'Email marked as urgent',
    category: 'email',
    description: 'When you mark an email as high priority',
  },
  {
    id: 'email-from-contact',
    label: 'Email from specific contact',
    category: 'email',
    description: 'When email arrives from a selected contact',
    config: ['contact']
  },
  {
    id: 'task-created',
    label: 'Task created',
    category: 'task',
    description: 'When a new task is added',
    config: ['project']
  },
  {
    id: 'task-completed',
    label: 'Task marked complete',
    category: 'task',
    description: 'When you complete a task',
  },
  {
    id: 'invoice-overdue',
    label: 'Invoice becomes overdue',
    category: 'finance',
    description: 'When an invoice passes its due date',
  },
  {
    id: 'invoice-paid',
    label: 'Invoice marked paid',
    category: 'finance',
    description: 'When you mark an invoice as paid',
  },
  {
    id: 'calendar-event-soon',
    label: 'Event starts in X minutes',
    category: 'calendar',
    description: 'When a calendar event is about to start',
    config: ['minutes']
  },
  {
    id: 'contact-added',
    label: 'New contact added',
    category: 'contact',
    description: 'When you add a new contact',
  },
  {
    id: 'lead-status-changed',
    label: 'Lead status changes',
    category: 'contact',
    description: 'When a contact lead status is updated',
    config: ['fromStatus', 'toStatus']
  },
]

interface TriggerSelectorProps {
  selected?: string
  onSelect: (triggerId: string) => void
}

export function TriggerSelector({ selected, onSelect }: TriggerSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedTrigger = TRIGGER_OPTIONS.find(t => t.id === selected)

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        When...
      </label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left bg-white hover:bg-gray-50 flex items-center justify-between"
      >
        <div>
          <div className="font-medium text-gray-900">
            {selectedTrigger?.label || 'Select a trigger'}
          </div>
          {selectedTrigger && (
            <div className="text-sm text-gray-500">{selectedTrigger.description}</div>
          )}
        </div>
        <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="mt-2 border border-gray-200 rounded-lg bg-white shadow-lg z-10">
          {/* Group by category */}
          {['email', 'task', 'finance', 'calendar', 'contact'].map((category) => {
            const groupTriggers = TRIGGER_OPTIONS.filter(t => t.category === category)
            if (groupTriggers.length === 0) return null

            return (
              <div key={category}>
                <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-xs font-semibold text-gray-600 uppercase">
                    {category}
                  </h3>
                </div>
                {groupTriggers.map((trigger) => (
                  <button
                    key={trigger.id}
                    onClick={() => {
                      onSelect(trigger.id)
                      setIsOpen(false)
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-purple-50 border-b border-gray-100 last:border-b-0 ${
                      selected === trigger.id ? 'bg-purple-50' : ''
                    }`}
                  >
                    <div className="font-medium text-gray-900">{trigger.label}</div>
                    <div className="text-sm text-gray-500">{trigger.description}</div>
                  </button>
                ))}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export { TRIGGER_OPTIONS }