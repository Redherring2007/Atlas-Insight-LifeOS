'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { TeamMemberCard } from '@/components/team-member-card'
import { HandoffCard } from '@/components/handoff-card'
import { CreateHandoffModal } from '@/components/create-handoff-modal'
import { WorkspaceMember, TeamHandoff, Task } from '@/types'
import { Plus, Users, ArrowRightLeft, TrendingUp } from 'lucide-react'

export default function TeamsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [teamMembers, setTeamMembers] = useState<WorkspaceMember[]>([])
  const [handoffs, setHandoffs] = useState<TeamHandoff[]>([])
  const [availableTasks, setAvailableTasks] = useState<Task[]>([])
  const [isHandoffModalOpen, setIsHandoffModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'members' | 'handoffs'>('members')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      // Mock team members
      const mockMembers: WorkspaceMember[] = [
        {
          id: '1',
          workspaceId: '1',
          userId: 'user-2',
          role: 'admin',
          joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          user: { name: 'Sarah Johnson', email: 'sarah@company.com' },
          workload: { total: 12, pending: 8, overdue: 2 },
        } as any,
        {
          id: '2',
          workspaceId: '1',
          userId: 'user-3',
          role: 'member',
          joinedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          user: { name: 'Mike Chen', email: 'mike@company.com' },
          workload: { total: 6, pending: 4, overdue: 0 },
        } as any,
        {
          id: '3',
          workspaceId: '1',
          userId: 'user-4',
          role: 'member',
          joinedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          user: { name: 'Emma Rodriguez', email: 'emma@company.com' },
          workload: { total: 9, pending: 6, overdue: 1 },
        } as any,
      ]

      // Mock handoffs
      const mockHandoffs: TeamHandoff[] = [
        {
          id: '1',
          workspaceId: '1',
          taskId: 'task-1',
          fromUserId: 'user-1',
          toUserId: 'user-2',
          status: 'pending',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          fromUser: 'You',
          toUser: 'Sarah Johnson',
          taskTitle: 'Review contract with ABC Corp',
          priority: 'high',
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          notes: 'Please review the attached contract and provide feedback by EOD',
        } as any,
        {
          id: '2',
          workspaceId: '1',
          taskId: 'task-2',
          fromUserId: 'user-2',
          toUserId: 'user-3',
          status: 'accepted',
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
          fromUser: 'Sarah Johnson',
          toUser: 'Mike Chen',
          taskTitle: 'Update website content',
          priority: 'medium',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          notes: 'Need the homepage and about page updated with new branding',
        } as any,
        {
          id: '3',
          workspaceId: '1',
          taskId: 'task-3',
          fromUserId: 'user-3',
          toUserId: 'user-4',
          status: 'completed',
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          fromUser: 'Mike Chen',
          toUser: 'Emma Rodriguez',
          taskTitle: 'Prepare client presentation',
          priority: 'high',
          dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          notes: 'Client meeting tomorrow, need slides ready by 5pm',
        } as any,
      ]

      // Mock available tasks for delegation
      const mockTasks: Task[] = [
        {
          id: 'task-4',
          projectId: 'proj-1',
          workspaceId: '1',
          title: 'Follow up on invoice #2024-001',
          description: 'Client hasn\'t paid yet',
          status: 'pending',
          priority: 'high',
          assigneeId: 'user-1',
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'task-5',
          projectId: 'proj-2',
          workspaceId: '1',
          title: 'Schedule team meeting',
          description: 'Weekly sync for Q2 planning',
          status: 'pending',
          priority: 'medium',
          assigneeId: 'user-1',
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      setTeamMembers(mockMembers)
      setHandoffs(mockHandoffs)
      setAvailableTasks(mockTasks)
      setIsLoading(false)
    }
  }, [session?.user])

  const handleCreateHandoff = async (newHandoff: Omit<TeamHandoff, 'id' | 'createdAt' | 'updatedAt'>) => {
    const handoff: TeamHandoff = {
      id: Math.random().toString(),
      ...newHandoff,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any

    setHandoffs(prev => [handoff, ...prev])
    setIsHandoffModalOpen(false)
  }

  const handleUpdateHandoff = (handoffId: string, updates: Partial<TeamHandoff>) => {
    setHandoffs(prev =>
      prev.map(h =>
        h.id === handoffId
          ? { ...h, ...updates, updatedAt: new Date() }
          : h
      )
    )
  }

  const handleDeleteHandoff = (handoffId: string) => {
    if (confirm('Delete this handoff?')) {
      setHandoffs(prev => prev.filter(h => h.id !== handoffId))
    }
  }

  const handleRemoveMember = (memberId: string) => {
    if (confirm('Remove this team member?')) {
      setTeamMembers(prev => prev.filter(m => m.id !== memberId))
    }
  }

  const calculateStats = () => {
    const totalMembers = teamMembers.length
    const totalWorkload = teamMembers.reduce((sum, m) => sum + ((m as any).workload?.total || 0), 0)
    const pendingHandoffs = handoffs.filter(h => h.status === 'pending').length
    const completedHandoffs = handoffs.filter(h => h.status === 'completed').length

    return { totalMembers, totalWorkload, pendingHandoffs, completedHandoffs }
  }

  const stats = calculateStats()

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">👥 Team & Handoffs</h1>
            <p className="text-gray-400">Manage team members and delegate tasks efficiently.</p>
          </div>
          <button
            onClick={() => setIsHandoffModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
          >
            <Plus size={20} />
            <span>Delegate Task</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">Team Members</p>
              <Users size={18} className="text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-white">{stats.totalMembers}</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">Total Tasks</p>
              <TrendingUp size={18} className="text-green-400" />
            </div>
            <p className="text-2xl font-bold text-white">{stats.totalWorkload}</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">Pending Handoffs</p>
              <ArrowRightLeft size={18} className="text-yellow-400" />
            </div>
            <p className="text-2xl font-bold text-yellow-300">{stats.pendingHandoffs}</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">Completed</p>
              <ArrowRightLeft size={18} className="text-green-400" />
            </div>
            <p className="text-2xl font-bold text-green-300">{stats.completedHandoffs}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-800 rounded-lg p-1 mb-6">
          {(['members', 'handoffs'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              {tab === 'members' ? '👥 Team Members' : '🔄 Task Handoffs'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto">
        {activeTab === 'members' ? (
          <>
            <h2 className="text-xl font-semibold text-white mb-4">Team Members</h2>
            {teamMembers.length === 0 ? (
              <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
                <Users size={48} className="text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">No team members yet.</p>
                <p className="text-gray-500 text-sm">Invite team members to start collaborating!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teamMembers.map(member => (
                  <TeamMemberCard
                    key={member.id}
                    member={member}
                    onRemove={handleRemoveMember}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-white mb-4">Task Handoffs</h2>
            {handoffs.length === 0 ? (
              <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
                <ArrowRightLeft size={48} className="text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">No handoffs yet.</p>
                <p className="text-gray-500 text-sm">Delegate tasks to team members to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {handoffs.map(handoff => (
                  <HandoffCard
                    key={handoff.id}
                    handoff={handoff}
                    onUpdate={handleUpdateHandoff}
                    onDelete={handleDeleteHandoff}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Handoff Modal */}
      <CreateHandoffModal
        isOpen={isHandoffModalOpen}
        onClose={() => setIsHandoffModalOpen(false)}
        onSubmit={handleCreateHandoff}
        workspaceId={session?.user?.id || '1'}
        currentUserId={session?.user?.id || 'user-1'}
        teamMembers={teamMembers.map(m => ({
          id: (m as any).userId,
          name: (m as any).user?.name || 'Unknown',
          email: (m as any).user?.email || 'unknown@example.com'
        }))}
        availableTasks={availableTasks}
      />
    </div>
  )
}
