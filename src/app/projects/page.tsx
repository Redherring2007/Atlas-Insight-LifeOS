'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BrainIcon } from '@/components/brain-icon'
import { ProjectCard } from '@/components/project-card'
import { Project } from '@/types'

export default function ProjectsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      // Mock projects - in real app, fetch from API
      const mockProjects: Project[] = [
        {
          id: '1',
          workspaceId: '1',
          name: 'Q1 Marketing Campaign',
          description: 'Launch new product marketing campaign for Q1',
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          workspaceId: '1',
          name: 'Website Redesign',
          description: 'Complete overhaul of company website',
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '3',
          workspaceId: '1',
          name: 'Client Onboarding System',
          description: 'Automated client onboarding workflow',
          status: 'completed',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]
      setProjects(mockProjects)
    }
  }, [session])

  const filteredProjects = projects.filter(project => {
    if (filter === 'all') return true
    return project.status === filter
  })

  const handleProjectUpdate = (projectId: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(project =>
      project.id === projectId ? { ...project, ...updates } : project
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
            <h1 className="text-2xl font-bold">Projects</h1>
            <BrainIcon isProcessing={false} size={32} />
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium">
            + New Project
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className="px-6 py-4 border-b border-gray-800">
        <div className="flex gap-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            All Projects
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === 'active' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <main className="px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onUpdate={handleProjectUpdate}
            />
          ))}
          {filteredProjects.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400">No projects found.</p>
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
          <button
            onClick={() => router.push('/tasks')}
            className="flex flex-col items-center text-gray-400 hover:text-white"
          >
            <div className="w-6 h-6 bg-gray-400 rounded mb-1"></div>
            <span className="text-xs">Tasks</span>
          </button>
          <button className="flex flex-col items-center text-blue-400">
            <div className="w-6 h-6 bg-blue-400 rounded mb-1"></div>
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