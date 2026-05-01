'use client'

import { WifiOff, ArrowLeft } from 'lucide-react'

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <WifiOff className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">You're Offline</h1>
          <p className="text-gray-600 mb-6">
            It looks like you've lost your internet connection. Some features may not be available right now, but your cached data is still accessible.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-medium text-blue-900 mb-2">Available Offline:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✓ Dashboard</li>
              <li>✓ Tasks & Projects</li>
              <li>✓ Contacts & CRM</li>
              <li>✓ Calendar</li>
              <li>✓ Finance Overview</li>
              <li>✓ Saved Emails</li>
            </ul>
          </div>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Go Back</span>
          </button>
        </div>

        <div className="mt-8 text-gray-600 text-sm">
          <p>Check your internet connection and try again. Your changes will sync automatically when you're back online.</p>
        </div>
      </div>
    </div>
  )
}
