'use client'

import { Workspace } from '@/types'

interface WorkspaceSelectorProps {
  workspaces: Workspace[]
  currentWorkspace: Workspace | null
  onWorkspaceChange: (workspace: Workspace) => void
}

export function WorkspaceSelector({ workspaces, currentWorkspace, onWorkspaceChange }: WorkspaceSelectorProps) {
  return (
    <div className="flex items-center space-x-2 mb-6">
      <span className="text-gray-400 text-sm">Workspace:</span>
      <div className="flex space-x-2">
        {workspaces.map((workspace) => (
          <button
            key={workspace.id}
            onClick={() => onWorkspaceChange(workspace)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              currentWorkspace?.id === workspace.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {workspace.name} ({workspace.type})
          </button>
        ))}
      </div>
    </div>
  )
}