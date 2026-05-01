'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { TriggerSelector, TRIGGER_OPTIONS } from './trigger-selector'
import { ActionConfigurator, ACTION_OPTIONS } from './action-configurator'

interface RuleBuilderProps {
  isOpen: boolean
  onClose: () => void
  onSave: (rule: {
    name: string
    description: string
    trigger: string
    action: string
    category: 'email' | 'task' | 'finance' | 'calendar' | 'contact'
  }) => void
}

export function RuleBuilder({ isOpen, onClose, onSave }: RuleBuilderProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [triggerId, setTriggerId] = useState('')
  const [actionId, setActionId] = useState('')

  if (!isOpen) return null

  const selectedTrigger = TRIGGER_OPTIONS.find(t => t.id === triggerId)
  const selectedAction = ACTION_OPTIONS.find(a => a.id === actionId)

  const handleSave = () => {
    if (!name || !triggerId || !actionId) {
      alert('Please fill in all required fields')
      return
    }

    const category = (selectedTrigger?.category || 'task') as 'email' | 'task' | 'finance' | 'calendar' | 'contact'

    onSave({
      name,
      description,
      trigger: triggerId,
      action: actionId,
      category,
    })

    // Reset form
    setName('')
    setDescription('')
    setTriggerId('')
    setActionId('')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Create Automation Rule</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Rule Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rule Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., 'Flag urgent emails'"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this rule do?"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Trigger Selector */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <TriggerSelector
              selected={triggerId}
              onSelect={setTriggerId}
            />
            {selectedTrigger?.config && selectedTrigger.config.length > 0 && (
              <div className="mt-4 pt-4 border-t border-blue-200">
                <p className="text-sm text-gray-600 mb-3">Additional Configuration:</p>
                <div className="space-y-2">
                  {selectedTrigger.config.map((field) => (
                    <input
                      key={field}
                      type="text"
                      placeholder={`Enter ${field}`}
                      className="w-full px-3 py-2 border border-blue-200 rounded bg-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Configurator */}
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <ActionConfigurator
              selected={actionId}
              onSelect={setActionId}
            />
            {selectedAction?.config && selectedAction.config.length > 0 && (
              <div className="mt-4 pt-4 border-t border-green-200">
                <p className="text-sm text-gray-600 mb-3">Configure Action:</p>
                <div className="space-y-2">
                  {selectedAction.config.map((field) => (
                    <input
                      key={field}
                      type="text"
                      placeholder={`Enter ${field}`}
                      className="w-full px-3 py-2 border border-green-200 rounded bg-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Preview */}
          {selectedTrigger && selectedAction && (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Rule Preview:</p>
              <div className="flex items-center space-x-3 text-sm font-medium text-gray-900">
                <span className="text-blue-600">When {selectedTrigger.label.toLowerCase()}</span>
                <span className="text-gray-400">→</span>
                <span className="text-green-600">{selectedAction.label.toLowerCase()}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name || !triggerId || !actionId}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Create Rule
          </button>
        </div>
      </div>
    </div>
  )
}