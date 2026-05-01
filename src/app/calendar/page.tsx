'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BrainIcon } from '@/components/brain-icon'
import { CalendarView } from '@/components/calendar-view'
import { CalendarEvent } from '@/types'

export default function CalendarPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      // Mock events - in real app, fetch from API
      const mockEvents: CalendarEvent[] = [
        {
          id: '1',
          workspaceId: '1',
          userId: 'user-1',
          title: 'Client Meeting - ABC Corp',
          start: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 10, 0),
          end: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 11, 0),
          type: 'meeting',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          workspaceId: '1',
          userId: 'user-1',
          title: 'Project Deadline - Website Redesign',
          start: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 17, 0),
          end: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 17, 0),
          type: 'deadline',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '3',
          workspaceId: '2',
          userId: 'user-1',
          title: 'Morning Workout',
          start: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 7, 0),
          end: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 8, 0),
          type: 'personal',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '4',
          workspaceId: '1',
          userId: 'user-1',
          title: 'Team Standup',
          start: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1, 9, 0),
          end: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1, 9, 30),
          type: 'meeting',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]
      setEvents(mockEvents)
    }
  }, [session, currentDate])

  const handleDateChange = (date: Date) => {
    setCurrentDate(date)
  }

  const handleEventCreate = (event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setEvents(prev => [...prev, newEvent])
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
            <h1 className="text-2xl font-bold">Calendar</h1>
            <BrainIcon isProcessing={false} size={32} />
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleDateChange(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000))}
              className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm"
            >
              ‹ Week
            </button>
            <button
              onClick={() => handleDateChange(new Date())}
              className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm"
            >
              Today
            </button>
            <button
              onClick={() => handleDateChange(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000))}
              className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm"
            >
              Week ›
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium ml-4">
              + New Event
            </button>
          </div>
        </div>
      </header>

      {/* Calendar View */}
      <main className="px-6 py-8">
        <CalendarView
          currentDate={currentDate}
          events={events}
          onDateChange={handleDateChange}
          onEventCreate={handleEventCreate}
        />
      </main>

      {/* AI Suggestions Panel */}
      <aside className="fixed right-0 top-20 bottom-0 w-80 bg-gray-800 border-l border-gray-700 p-6 hidden lg:block">
        <h3 className="text-lg font-semibold mb-4">AI Suggestions</h3>
        <div className="space-y-4">
          <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
            <h4 className="font-medium text-blue-400 mb-2">Schedule Optimization</h4>
            <p className="text-sm text-gray-300">
              Based on your patterns, moving the team standup to 10 AM would reduce conflicts by 40%.
            </p>
          </div>
          <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
            <h4 className="font-medium text-green-400 mb-2">Focus Block</h4>
            <p className="text-sm text-gray-300">
              Add a 2-hour focus block at 2 PM for deep work on the website redesign.
            </p>
          </div>
          <div className="bg-purple-900/20 border border-purple-700 rounded-lg p-4">
            <h4 className="font-medium text-purple-400 mb-2">Meeting Prep</h4>
            <p className="text-sm text-gray-300">
              Review ABC Corp contract before the 10 AM meeting.
            </p>
          </div>
        </div>
      </aside>

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
          <button
            onClick={() => router.push('/projects')}
            className="flex flex-col items-center text-gray-400 hover:text-white"
          >
            <div className="w-6 h-6 bg-gray-400 rounded mb-1"></div>
            <span className="text-xs">Projects</span>
          </button>
          <button className="flex flex-col items-center text-blue-400">
            <div className="w-6 h-6 bg-blue-400 rounded mb-1"></div>
            <span className="text-xs">Calendar</span>
          </button>
        </div>
      </nav>
    </div>
  )
}