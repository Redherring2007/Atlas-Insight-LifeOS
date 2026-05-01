'use client'

import { useState } from 'react'
import { X, Send } from 'lucide-react'
import { NewTeamHandoff } from '@/types'

interface CreateHandoffModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (handoff: Omit<NewTeamHandoff, 'id' | 'createdAt' | 'updatedAt'>) => void
  workspaceId: string
  currentUserId: string
  teamMembers: Array<{ id: string; name: string; email: string }>
  availableTasks: Array<{ id: string; title: string; priority: string; dueDate?: Date }>
}

export function CreateHandoffModal({
  isOpen,
  onClose,
  onSubmit,
  workspaceId,
  currentUserId,
  teamMembers,
  availableTasks
}: CreateHandoffModalProps) {
  const [formData, setFormData] = useState({
    taskId: '',
    toUserId: '',
    notes: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.taskId || !formData.toUserId) {
      alert('Please select a task and team member')
      return
    }

    const selectedTask = availableTasks.find(t => t.id === formData.taskId)
    if (!selectedTask) return

    onSubmit({
      workspaceId,
      taskId: formData.taskId,
      fromUserId: currentUserId,
      toUserId: formData.toUserId,
      status: 'pending',
      notes: formData.notes.trim() || null,
      taskTitle: selectedTask.title,
      priority: selectedTask.priority,
      dueDate: selectedTask.dueDate,
    } as any)

    setFormData({
      taskId: '',
      toUserId: '',
      notes: '',
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-750">
          <h2 className="text-lg font-semibold text-white">👥 Delegate Task</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Task Selection */}
          <div>
            <label className="text-xs font-semibold text-gray-300 mb-2 block">
              Select Task to Delegate
            </label>
            <select
              name="taskId"
              value={formData.taskId}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="">Choose a task...</option>
              {availableTasks.map(task => (
                <option key={task.id} value={task.id}>
                  {task.title} ({task.priority})
                </option>
              ))}
            </select>
          </div>

          {/* Team Member Selection */}
          <div>
            <label className="text-xs font-semibold text-gray-300 mb-2 block">
              Delegate To
            </label>
            <select
              name="toUserId"
              value={formData.toUserId}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="">Choose team member...</option>
              {teamMembers.map(member => (
                <option key={member.id} value={member.id}>
                  {member.name} ({member.email})
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-semibold text-gray-300 mb-2 block">
              Handover Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any context or instructions for the team member..."
              rows={3}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.taskId || !formData.toUserId}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={16} className="inline mr-2" />
              Delegate Task
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
