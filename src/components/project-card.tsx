// @ts-nocheck
'use client'

import { Project } from '@/types'

interface ProjectCardProps {
  project: Project
  onUpdate: (projectId: string, updates: Partial<Project>) => void
}

export function ProjectCard({ project, onUpdate }: ProjectCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-600'
      case 'completed': return 'bg-blue-600'
      case 'on-hold': return 'bg-yellow-600'
      default: return 'bg-gray-600'
    }
  }

  const handleStatusChange = (newStatus: string) => {
    onUpdate(project.id, { status: newStatus as any })
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2">{project.name}</h3>
          {project.description && (
            <p className="text-gray-400 text-sm mb-3">{project.description}</p>
          )}
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor(project.status)}`}></div>
            <span className="text-sm text-gray-400 capitalize">{project.status}</span>
          </div>
        </div>
        <select
          value={project.status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-white"
        >
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="on-hold">On Hold</option>
        </select>
      </div>

      {/* Project stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-xl font-bold text-blue-400">12</div>
          <div className="text-xs text-gray-400">Tasks</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-green-400">8</div>
          <div className="text-xs text-gray-400">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-yellow-400">4</div>
          <div className="text-xs text-gray-400">In Progress</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-400 mb-1">
          <span>Progress</span>
          <span>67%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div className="bg-green-600 h-2 rounded-full" style={{ width: '67%' }}></div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex space-x-2">
        <button className="text-blue-400 hover:text-blue-300 text-sm">
          View Details
        </button>
        <button className="text-gray-400 hover:text-gray-300 text-sm">
          Edit
        </button>
        <button className="text-red-400 hover:text-red-300 text-sm">
          Archive
        </button>
      </div>
    </div>
  )
}