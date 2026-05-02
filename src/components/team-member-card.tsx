// @ts-nocheck
'use client'

import { WorkspaceMember } from '@/types'
import { User, Mail, Calendar, TrendingUp } from 'lucide-react'

interface TeamMemberCardProps {
  member: WorkspaceMember & {
    user?: { name: string; email: string }
    workload?: { total: number; pending: number; overdue: number }
  }
  onRemove?: (memberId: string) => void
}

export function TeamMemberCard({ member, onRemove }: TeamMemberCardProps) {
  const workload = member.workload || { total: 0, pending: 0, overdue: 0 }
  const workloadPercentage = workload.total > 0 ? (workload.pending / workload.total) * 100 : 0

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <User size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              {member.user?.name || 'Unknown User'}
            </h3>
            <p className="text-sm text-gray-400 capitalize">{member.role}</p>
          </div>
        </div>
        {onRemove && (
          <button
            onClick={() => onRemove(member.id)}
            className="text-red-400 hover:text-red-300 transition-colors"
            title="Remove from team"
          >
            ×
          </button>
        )}
      </div>

      {/* Contact info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-300">
          <Mail size={14} className="text-blue-400" />
          <span>{member.user?.email || 'No email'}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-300">
          <Calendar size={14} className="text-green-400" />
          <span>Joined {new Date(member.joinedAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Workload */}
      <div className="border-t border-gray-700 pt-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Workload</span>
          <span className="text-sm text-white">{workload.pending}/{workload.total} tasks</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
          <div
            className={`h-2 rounded-full transition-all ${
              workloadPercentage > 80 ? 'bg-red-600' :
              workloadPercentage > 60 ? 'bg-yellow-600' :
              'bg-green-600'
            }`}
            style={{ width: `${Math.min(workloadPercentage, 100)}%` }}
          ></div>
        </div>
        {workload.overdue > 0 && (
          <div className="flex items-center space-x-1 text-xs text-red-400">
            <TrendingUp size={12} />
            <span>{workload.overdue} overdue</span>
          </div>
        )}
      </div>
    </div>
  )
}
