'use client'

import { useState } from 'react'
import { Zap, Plus, Filter } from 'lucide-react'
import { RuleCard } from '@/components/rule-card'
import { RuleBuilder } from '@/components/rule-builder'

interface Rule {
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

const mockRules: Rule[] = [
  {
    id: '1',
    name: 'Flag urgent emails to Slack',
    description: 'Automatically notify team when an email is marked urgent',
    trigger: 'Email marked as urgent',
    action: 'Send Slack message',
    isActive: true,
    executionCount: 45,
    lastExecuted: '5 mins ago',
    category: 'email'
  },
  {
    id: '2',
    name: 'Create task from high-priority email',
    description: 'Convert important emails into actionable tasks',
    trigger: 'Email from specific contact',
    action: 'Create a task',
    isActive: true,
    executionCount: 32,
    lastExecuted: '2 hours ago',
    category: 'email'
  },
  {
    id: '3',
    name: 'Send follow-up on overdue invoices',
    description: 'Automatically send reminder email when invoice is overdue',
    trigger: 'Invoice becomes overdue',
    action: 'Send email',
    isActive: true,
    executionCount: 8,
    lastExecuted: '1 day ago',
    category: 'finance'
  },
  {
    id: '4',
    name: 'Update CRM on task completion',
    description: 'When a task is completed, update the related contact',
    trigger: 'Task marked complete',
    action: 'Update contact lead status',
    isActive: false,
    executionCount: 0,
    category: 'task'
  },
  {
    id: '5',
    name: 'Calendar event reminder notification',
    description: 'Send notification 15 minutes before meeting starts',
    trigger: 'Event starts in X minutes',
    action: 'Send notification',
    isActive: true,
    executionCount: 156,
    lastExecuted: 'Just now',
    category: 'calendar'
  }
]

export default function AutomationsPage() {
  const [rules, setRules] = useState<Rule[]>(mockRules)
  const [isBuilderOpen, setIsBuilderOpen] = useState(false)
  const [filterCategory, setFilterCategory] = useState<string | null>(null)
  const [filterActive, setFilterActive] = useState<boolean | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredRules = rules.filter(rule => {
    if (filterCategory && rule.category !== filterCategory) return false
    if (filterActive !== null && rule.isActive !== filterActive) return false
    if (searchQuery && !rule.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const handleCreateRule = (newRule: any) => {
    const rule: Rule = {
      id: Date.now().toString(),
      ...newRule,
      isActive: true,
      executionCount: 0
    }
    setRules([rule, ...rules])
  }

  const handleEditRule = (id: string) => {
    // In real app, would open builder with rule pre-filled
    console.log('Edit rule:', id)
  }

  const handleDeleteRule = (id: string) => {
    setRules(rules.filter(r => r.id !== id))
  }

  const handleToggleRule = (id: string) => {
    setRules(rules.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r))
  }

  const activeRulesCount = rules.filter(r => r.isActive).length
  const totalExecutions = rules.reduce((sum, r) => sum + r.executionCount, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Zap className="h-8 w-8 text-yellow-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Automations</h1>
              <p className="text-sm text-gray-600">Create rules to automate your workflow</p>
            </div>
          </div>
          <button
            onClick={() => setIsBuilderOpen(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>New Rule</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Rules</p>
                <p className="text-2xl font-bold text-gray-900">{activeRulesCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Rules</p>
                <p className="text-2xl font-bold text-gray-900">{rules.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Executions</p>
                <p className="text-2xl font-bold text-gray-900">{totalExecutions}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search rules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={filterCategory || ''}
                onChange={(e) => setFilterCategory(e.target.value || null)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
              >
                <option value="">All Categories</option>
                <option value="email">Email</option>
                <option value="task">Task</option>
                <option value="finance">Finance</option>
                <option value="calendar">Calendar</option>
                <option value="contact">Contact</option>
              </select>
              <select
                value={filterActive === null ? '' : filterActive ? 'active' : 'inactive'}
                onChange={(e) => {
                  if (e.target.value === '') setFilterActive(null)
                  else setFilterActive(e.target.value === 'active')
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Rules List */}
        <div className="space-y-4">
          {filteredRules.length > 0 ? (
            filteredRules.map(rule => (
              <RuleCard
                key={rule.id}
                rule={rule}
                onEdit={handleEditRule}
                onDelete={handleDeleteRule}
                onToggle={handleToggleRule}
              />
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No rules found</p>
              <button
                onClick={() => setIsBuilderOpen(true)}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Create your first rule
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Rule Builder Modal */}
      <RuleBuilder
        isOpen={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
        onSave={handleCreateRule}
      />

      {/* Template Suggestions */}
      <div className="px-6 pb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Popular Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: '📧', name: 'Email to Task', description: 'Convert urgent emails into tasks' },
              { icon: '💰', name: 'Invoice Follow-up', description: 'Remind about overdue invoices' },
              { icon: '📅', name: 'Meeting Prep', description: 'Notify before meetings start' },
              { icon: '👥', name: 'Contact Update', description: 'Update contact status automatically' }
            ].map((template, index) => (
              <button
                key={index}
                className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-left"
              >
                <div className="flex items-start">
                  <span className="text-2xl mr-3">{template.icon}</span>
                  <div>
                    <p className="font-medium text-gray-900">{template.name}</p>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}