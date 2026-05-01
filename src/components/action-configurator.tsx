'use client'

import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

interface ActionOption {
  id: string
  label: string
  category: 'email' | 'task' | 'finance' | 'notification' | 'integration'
  description: string
  config?: string[]
}

const ACTION_OPTIONS: ActionOption[] = [
  {
    id: 'create-task',
    label: 'Create a task',
    category: 'task',
    description: 'Create a new task in your task list',
    config: ['title', 'priority', 'dueDate']
  },
  {
    id: 'update-task',
    label: 'Update task status',
    category: 'task',
    description: 'Change the status of an existing task',
    config: ['taskId', 'status']
  },
  {
    id: 'send-email',
    label: 'Send email',
    category: 'email',
    description: 'Send an email to a recipient',
    config: ['recipient', 'subject', 'template']
  },
  {
    id: 'add-note',
    label: 'Add note to contact',
    category: 'task',
    description: 'Add a quick note to a contact record',
    config: ['contactId', 'note']
  },
  {
    id: 'create-calendar-event',
    label: 'Create calendar event',
    category: 'task',
    description: 'Add an event to your calendar',
    config: ['title', 'dateTime', 'duration', 'attendees']
  },
  {
    id: 'send-slack-message',
    label: 'Send Slack message',
    category: 'integration',
    description: 'Send a message to Slack channel',
    config: ['channel', 'message', 'mentions']
  },
  {
    id: 'log-finance',
    label: 'Log financial transaction',
    category: 'finance',
    description: 'Record a transaction in finance module',
    config: ['type', 'amount', 'account']
  },
  {
    id: 'update-lead-status',
    label: 'Update contact lead status',
    category: 'task',
    description: 'Change the lead status of a contact',
    config: ['contactId', 'status']
  },
  {
    id: 'send-notification',
    label: 'Send notification',
    category: 'notification',
    description: 'Send a push notification',
    config: ['title', 'message', 'actionUrl']
  },
]

interface ActionConfiguratorProps {
  selected?: string
  onSelect: (actionId: string) => void
}

export function ActionConfigurator({ selected, onSelect }: ActionConfiguratorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedAction = ACTION_OPTIONS.find(a => a.id === selected)

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Then...
      </label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left bg-white hover:bg-gray-50 flex items-center justify-between"
      >
        <div>
          <div className="font-medium text-gray-900">
            {selectedAction?.label || 'Select an action'}
          </div>
          {selectedAction && (
            <div className="text-sm text-gray-500">{selectedAction.description}</div>
          )}
        </div>
        <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="mt-2 border border-gray-200 rounded-lg bg-white shadow-lg z-10">
          {/* Group by category */}
          {['task', 'email', 'finance', 'notification', 'integration'].map((category) => {
            const groupActions = ACTION_OPTIONS.filter(a => a.category === category)
            if (groupActions.length === 0) return null

            return (
              <div key={category}>
                <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-xs font-semibold text-gray-600 uppercase">
                    {category}
                  </h3>
                </div>
                {groupActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => {
                      onSelect(action.id)
                      setIsOpen(false)
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-purple-50 border-b border-gray-100 last:border-b-0 ${
                      selected === action.id ? 'bg-purple-50' : ''
                    }`}
                  >
                    <div className="font-medium text-gray-900">{action.label}</div>
                    <div className="text-sm text-gray-500">{action.description}</div>
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

export { ACTION_OPTIONS }