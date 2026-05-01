import { Database, TrendingUp, Target, Lightbulb } from 'lucide-react'

interface MemoryCardProps {
  memory: {
    id: string
    type: 'pattern' | 'decision' | 'insight'
    content: string
    confidence: number
    lastUpdated: string
    actions: number
  }
}

export function MemoryCard({ memory }: MemoryCardProps) {
  return (
    <div className="p-6 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              memory.type === 'pattern' ? 'bg-blue-100 text-blue-800' :
              memory.type === 'decision' ? 'bg-green-100 text-green-800' :
              'bg-purple-100 text-purple-800'
            }`}>
              {memory.type}
            </span>
            <span className="text-sm text-gray-500">
              {memory.actions} observations
            </span>
          </div>
          <p className="text-sm text-gray-900 mb-2">{memory.content}</p>
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span>Last updated: {memory.lastUpdated}</span>
            <span>Confidence: {memory.confidence}%</span>
          </div>
        </div>
        <div className="ml-4">
          <div className="w-16 bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                memory.confidence > 90 ? 'bg-green-500' :
                memory.confidence > 80 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${memory.confidence}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

interface SuggestionCardProps {
  suggestion: {
    id: string
    title: string
    reason: string
    confidence: number
    action: 'schedule' | 'prioritize' | 'delegate'
  }
  onApply?: (id: string) => void
  onDismiss?: (id: string) => void
}

export function SuggestionCard({ suggestion, onApply, onDismiss }: SuggestionCardProps) {
  return (
    <div className="p-6 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-sm font-medium text-gray-900 mb-1">
            {suggestion.title}
          </h4>
          <p className="text-sm text-gray-600 mb-3">{suggestion.reason}</p>
          <div className="flex items-center space-x-4">
            <span className="text-xs text-gray-500">
              Confidence: {suggestion.confidence}%
            </span>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              suggestion.action === 'schedule' ? 'bg-blue-100 text-blue-800' :
              suggestion.action === 'prioritize' ? 'bg-red-100 text-red-800' :
              'bg-green-100 text-green-800'
            }`}>
              {suggestion.action}
            </span>
          </div>
        </div>
        <div className="ml-4 flex space-x-2">
          <button
            onClick={() => onApply?.(suggestion.id)}
            className="px-3 py-1 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Apply
          </button>
          <button
            onClick={() => onDismiss?.(suggestion.id)}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  )
}

interface BrainStatsCardProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  value: string | number
  color: string
}

export function BrainStatsCard({ icon: Icon, title, value, color }: BrainStatsCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center">
        <Icon className={`h-8 w-8 text-${color}-600`} />
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  )
}

interface PatternAnalysisProps {
  patterns: Array<{
    name: string
    description: string
    confidence: number
    impact: 'high' | 'medium' | 'low'
  }>
}

export function PatternAnalysis({ patterns }: PatternAnalysisProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Pattern Analysis</h3>
        <p className="text-sm text-gray-600">AI-detected behavioral patterns</p>
      </div>
      <div className="divide-y divide-gray-200">
        {patterns.map((pattern, index) => (
          <div key={index} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900 mb-1">
                  {pattern.name}
                </h4>
                <p className="text-sm text-gray-600 mb-2">{pattern.description}</p>
                <div className="flex items-center space-x-4">
                  <span className="text-xs text-gray-500">
                    Confidence: {pattern.confidence}%
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    pattern.impact === 'high' ? 'bg-red-100 text-red-800' :
                    pattern.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {pattern.impact} impact
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}