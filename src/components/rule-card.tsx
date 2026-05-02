// @ts-nocheck
'use client'

import { Trash2, Edit2, ToggleRight } from 'lucide-react'

interface RuleCardProps {
  rule: {
    id: string
    name: string
    description: string
    trigger: string
    action: string
    isActive: boolean
    executionCount: number
    lastExecuted?: string
    category: 'email' | 'task' | 'finance' | 'calendar' | 'contact'
  }
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onToggle?: (id: string) => void
}

export function RuleCard({ rule, onEdit, onDelete, onToggle }: RuleCardProps) {
  const categoryColors = {
    email: 'bg-blue-100 text-blue-800',
    task: 'bg-purple-100 text-purple-800',
    finance: 'bg-green-100 text-green-800',
    calendar: 'bg-orange-100 text-orange-800',
    contact: 'bg-pink-100 text-pink-800',
  }

  return (
    <div className={`p-6 rounded-lg shadow-sm border ${rule.isActive ? 'border-gray-200 bg-white' : 'border-gray-200 bg-gray-50'}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-medium text-gray-900">{rule.name}</h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColors[rule.category]}`}>
              {rule.category}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-3">{rule.description}</p>
        </div>
        <button
          onClick={() => onToggle?.(rule.id)}
          className={`p-2 rounded-lg transition-colors ${rule.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}
          title={rule.isActive ? 'Disable rule' : 'Enable rule'}
        >
          <ToggleRight className="h-5 w-5" />
        </button>
      </div>

      {/* Rule Flow */}
      <div className="mb-4 p-3 bg-gray-50 rounded border border-gray-200">
        <div className="flex items-center space-x-3 text-sm">
          <div className="flex-1">
            <p className="text-xs text-gray-500 font-medium">WHEN</p>
            <p className="text-gray-900 font-medium">{rule.trigger}</p>
          </div>
          <div className="text-gray-400">→</div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 font-medium">THEN</p>
            <p className="text-gray-900 font-medium">{rule.action}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
        <span>Executed {rule.executionCount} times</span>
        {rule.lastExecuted && <span>Last: {rule.lastExecuted}</span>}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end space-x-2">
        <button
          onClick={() => onEdit?.(rule.id)}
          className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center space-x-1"
        >
          <Edit2 className="h-4 w-4" />
          <span>Edit</span>
        </button>
        <button
          onClick={() => onDelete?.(rule.id)}
          className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 flex items-center space-x-1"
        >
          <Trash2 className="h-4 w-4" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  )
}