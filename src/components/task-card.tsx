'use client'

import { Task } from '@/types'

interface TaskCardProps {
  task: Task
  onUpdate: (taskId: string, updates: Partial<Task>) => void
}

export function TaskCard({ task, onUpdate }: TaskCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-gray-600'
      case 'in-progress': return 'bg-blue-600'
      case 'done': return 'bg-green-600'
      default: return 'bg-gray-600'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400'
      case 'medium': return 'text-yellow-400'
      case 'low': return 'text-green-400'
      default: return 'text-gray-400'
    }
  }

  const handleStatusChange = (newStatus: string) => {
    onUpdate(task.id, { status: newStatus as any })
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2">{task.title}</h3>
          {task.description && (
            <p className="text-gray-400 text-sm mb-3">{task.description}</p>
          )}
          <div className="flex items-center space-x-4 text-sm">
            <span className={`font-medium ${getPriorityColor(task.priority)}`}>
              {task.priority.toUpperCase()}
            </span>
            {task.dueDate && (
              <span className="text-gray-400">
                Due: {task.dueDate.toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={task.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-white"
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <div className={`w-3 h-3 rounded-full ${getStatusColor(task.status)}`}></div>
        </div>
      </div>

      {/* Progress indicator for in-progress tasks */}
      {task.status === 'in-progress' && (
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-400 mb-1">
            <span>Progress</span>
            <span>75%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex space-x-2">
        <button className="text-blue-400 hover:text-blue-300 text-sm">
          Edit
        </button>
        <button className="text-gray-400 hover:text-gray-300 text-sm">
          Delegate
        </button>
        <button className="text-red-400 hover:text-red-300 text-sm">
          Delete
        </button>
      </div>
    </div>
  )
}