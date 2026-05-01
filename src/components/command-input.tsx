'use client'

import { useState } from 'react'

interface CommandInputProps {
  onCommand: (command: string) => void
  isProcessing: boolean
}

export function CommandInput({ onCommand, isProcessing }: CommandInputProps) {
  const [command, setCommand] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (command.trim()) {
      onCommand(command.trim())
      setCommand('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Enter command... (e.g., 'schedule meeting with Karl', 'urgent tasks', 'finance summary')"
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isProcessing}
        />
        <button
          type="submit"
          disabled={isProcessing || !command.trim()}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-md text-sm font-medium transition-colors"
        >
          {isProcessing ? 'Processing...' : 'Execute'}
        </button>
      </div>
    </form>
  )
}