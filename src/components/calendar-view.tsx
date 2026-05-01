'use client'

import { useState } from 'react'
import { CalendarEvent } from '@/types'

interface CalendarViewProps {
  currentDate: Date
  events: CalendarEvent[]
  onDateChange: (date: Date) => void
  onEventCreate: (event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => void
}

export function CalendarView({ currentDate, events, onDateChange, onEventCreate }: CalendarViewProps) {
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('week')

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'bg-blue-600'
      case 'deadline': return 'bg-red-600'
      case 'personal': return 'bg-green-600'
      default: return 'bg-gray-600'
    }
  }

  const formatTime = (date: Date | undefined) => {
    if (!date) return ''
    return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start!)
      return (
        eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getDate() === date.getDate()
      )
    })
  }

  const monthView = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // Empty cells
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    // Days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }

    const weeks = []
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7))
    }

    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-semibold text-gray-400 text-sm">
              {day}
            </div>
          ))}
        </div>
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-2 mb-2">
            {week.map((day, dayIndex) => {
              const dateObj = day ? new Date(currentDate.getFullYear(), currentDate.getMonth(), day) : null
              const dayEvents = dateObj ? getEventsForDate(dateObj) : []
              const isToday = dateObj && dateObj.toDateString() === new Date().toDateString()

              return (
                <div
                  key={dayIndex}
                  className={`min-h-24 p-2 rounded border ${
                    day
                      ? isToday
                        ? 'bg-blue-900/30 border-blue-500'
                        : 'bg-gray-700 border-gray-600 hover:border-gray-500'
                      : 'bg-gray-900 border-gray-800'
                  } cursor-pointer transition-colors`}
                >
                  {day && (
                    <>
                      <div className={`text-sm font-semibold ${isToday ? 'text-blue-400' : 'text-gray-300'}`}>
                        {day}
                      </div>
                      <div className="mt-1 space-y-1">
                        {dayEvents.slice(0, 2).map(event => (
                          <div
                            key={event.id}
                            className={`${getEventColor(event.type)} text-white text-xs p-1 rounded truncate`}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-gray-400">+{dayEvents.length - 2} more</div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    )
  }

  const weekView = () => {
    const startDate = new Date(currentDate)
    startDate.setDate(currentDate.getDate() - currentDate.getDay())

    const hours = Array.from({ length: 24 }, (_, i) => i)
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startDate)
      date.setDate(date.getDate() + i)
      return date
    })

    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-x-auto">
        <div className="flex min-w-max">
          {/* Time column */}
          <div className="w-16 border-r border-gray-700">
            <div className="h-12 border-b border-gray-700"></div>
            {hours.map(hour => (
              <div key={hour} className="h-12 border-b border-gray-700 text-xs text-gray-400 px-2 py-1">
                {hour.toString().padStart(2, '0')}:00
              </div>
            ))}
          </div>

          {/* Days columns */}
          {weekDays.map((date, dateIndex) => (
            <div key={dateIndex} className="flex-1 border-r border-gray-700 min-w-32">
              {/* Day header */}
              <div className="h-12 border-b border-gray-700 p-2 text-center">
                <div className="text-xs text-gray-400">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                <div className={`text-sm font-semibold ${date.toDateString() === new Date().toDateString() ? 'text-blue-400' : 'text-white'}`}>
                  {date.getDate()}
                </div>
              </div>

              {/* Hours */}
              {hours.map(hour => {
                const dayEvents = events.filter(event => {
                  const eventDate = new Date(event.start!)
                  return (
                    eventDate.getHours() === hour &&
                    eventDate.toDateString() === date.toDateString()
                  )
                })

                return (
                  <div
                    key={hour}
                    className="h-12 border-b border-gray-700 p-1 relative hover:bg-gray-700/50 transition-colors"
                  >
                    {dayEvents.map(event => (
                      <div
                        key={event.id}
                        className={`${getEventColor(event.type)} text-white text-xs p-1 rounded truncate cursor-pointer hover:opacity-90`}
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const dayView = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i)
    const dayEvents = getEventsForDate(currentDate)

    return (
      <div className="grid grid-cols-3 gap-6">
        {/* Main calendar */}
        <div className="col-span-2">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-white">
                {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </h2>
            </div>

            <div className="space-y-3">
              {hours.map(hour => {
                const hourEvents = dayEvents.filter(event => {
                  const eventDate = new Date(event.start!)
                  return eventDate.getHours() === hour
                })

                return (
                  <div key={hour} className="flex">
                    <div className="w-16 text-xs text-gray-400 py-2">
                      {hour.toString().padStart(2, '0')}:00
                    </div>
                    <div className="flex-1 border-l border-gray-700 pl-4">
                      {hourEvents.map(event => (
                        <div
                          key={event.id}
                          className={`${getEventColor(event.type)} text-white p-3 rounded mb-2 cursor-pointer hover:opacity-90`}
                        >
                          <div className="font-semibold text-sm">{event.title}</div>
                          <div className="text-xs mt-1">
                            {formatTime(event.start)} - {formatTime(event.end)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Sidebar - Events list */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 h-fit">
          <h3 className="text-lg font-semibold mb-4">Today's Events</h3>
          {dayEvents.length === 0 ? (
            <p className="text-gray-400 text-sm">No events scheduled</p>
          ) : (
            <div className="space-y-3">
              {dayEvents.map(event => (
                <div key={event.id} className="border border-gray-700 rounded p-3">
                  <div className={`inline-block px-2 py-1 rounded text-xs font-medium text-white mb-2 ${getEventColor(event.type)}`}>
                    {event.type}
                  </div>
                  <p className="font-semibold text-white text-sm">{event.title}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    {formatTime(event.start)} - {formatTime(event.end)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* View mode selector */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setViewMode('month')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            viewMode === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Month
        </button>
        <button
          onClick={() => setViewMode('week')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            viewMode === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Week
        </button>
        <button
          onClick={() => setViewMode('day')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            viewMode === 'day' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Day
        </button>
      </div>

      {/* Calendar display */}
      {viewMode === 'month' && monthView()}
      {viewMode === 'week' && weekView()}
      {viewMode === 'day' && dayView()}
    </div>
  )
}