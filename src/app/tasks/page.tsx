'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BrainIcon } from '@/components/brain-icon'
import { TaskCard } from '@/components/task-card'
import { Task } from '@/types'

export default function TasksPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<'all' | 'todo' | 'in-progress' | 'done'>('all')
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      // Mock tasks - in real app, fetch from API
      const mockTasks: Task[] = [
        {
          id: '1',
          projectId: '1',
          workspaceId: '1',
          title: 'Review contract with ABC Corp',
          description: 'Legal review and approval needed',
          status: 'todo',
          priority: 'high',
          assigneeId: 'user-1',
          dueDate: new Date(Date.now() + 86400000), // tomorrow
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          projectId: '1',
          workspaceId: '1',
          title: 'Send invoice to XYZ Ltd',
          description: 'Monthly billing for services',
          status: 'in-progress',
          priority: 'medium',
          assigneeId: 'user-1',
          dueDate: new Date(Date.now() + 172800000), // day after tomorrow
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '3',
          projectId: '2',
          workspaceId: '1',
          title: 'Plan team building event',
          description: 'Organize quarterly team outing',
          status: 'todo',
          priority: 'low',
          assigneeId: 'user-1',
          dueDate: new Date(Date.now() + 604800000), // next week
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]
      setTasks(mockTasks)
    }
  }, [session])

  const filteredTasks = tasks.filter(task => {
    const statusMatch = filter === 'all' || task.status === filter
    const priorityMatch = priorityFilter === 'all' || task.priority === priorityFilter
    return statusMatch && priorityMatch
  })

  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    ))
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">Tasks</h1>
            <BrainIcon isProcessing={false} size={32} />
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium">
            + New Task
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className="px-6 py-4 border-b border-gray-800">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Status</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-white"
            >
              <option value="all">All Status</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Priority</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-white"
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <main className="px-6 py-8">
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={handleTaskUpdate}
            />
          ))}
          {filteredTasks.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No tasks found matching your filters.</p>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 px-4 py-2">
        <div className="flex justify-around">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex flex-col items-center text-gray-400 hover:text-white"
          >
            <div className="w-6 h-6 bg-gray-400 rounded mb-1"></div>
            <span className="text-xs">Dashboard</span>
          </button>
          <button className="flex flex-col items-center text-blue-400">
            <div className="w-6 h-6 bg-blue-400 rounded mb-1"></div>
            <span className="text-xs">Tasks</span>
          </button>
          <button
            onClick={() => router.push('/projects')}
            className="flex flex-col items-center text-gray-400 hover:text-white"
          >
            <div className="w-6 h-6 bg-gray-400 rounded mb-1"></div>
            <span className="text-xs">Projects</span>
          </button>
          <button
            onClick={() => router.push('/calendar')}
            className="flex flex-col items-center text-gray-400 hover:text-white"
          >
            <div className="w-6 h-6 bg-gray-400 rounded mb-1"></div>
            <span className="text-xs">Calendar</span>
          </button>
        </div>
      </nav>
    </div>
  )
}