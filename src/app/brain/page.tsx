'use client'

import { useState } from 'react'
import { Brain, TrendingUp, Clock, Target, Lightbulb, Database } from 'lucide-react'

// Mock data for AI Brain
const mockMemories = [
  {
    id: '1',
    type: 'pattern',
    content: 'You consistently mark emails from "john@client.com" as high priority',
    confidence: 95,
    lastUpdated: '2024-01-15',
    actions: 23
  },
  {
    id: '2',
    type: 'decision',
    content: 'Delegated 3 tasks to Sarah this week - she completed them 2x faster',
    confidence: 88,
    lastUpdated: '2024-01-14',
    actions: 3
  },
  {
    id: '3',
    type: 'insight',
    content: 'Your most productive hours are 9-11 AM on weekdays',
    confidence: 92,
    lastUpdated: '2024-01-13',
    actions: 45
  }
]

const mockSuggestions = [
  {
    id: '1',
    title: 'Schedule team standup for 10 AM',
    reason: 'Based on your productivity patterns and team availability',
    confidence: 87,
    action: 'schedule'
  },
  {
    id: '2',
    title: 'Mark email from john@client.com as urgent',
    reason: 'You\'ve marked 23 similar emails as high priority',
    confidence: 95,
    action: 'prioritize'
  },
  {
    id: '3',
    title: 'Delegate invoice review to accounting team',
    reason: 'Sarah completed similar tasks 2x faster last week',
    confidence: 88,
    action: 'delegate'
  }
]

const mockDailyBriefing = {
  date: '2024-01-15',
  insights: [
    'You completed 12 tasks this week, 40% above your average',
    'Email response time improved by 25% compared to last week',
    '3 team members are at 90%+ capacity - consider redistributing work',
    'Finance module shows $15K in overdue invoices'
  ],
  recommendations: [
    'Schedule 30-min buffer time between meetings tomorrow',
    'Review high-priority emails before 11 AM',
    'Consider automating invoice follow-ups'
  ],
  patterns: [
    'Most productive: Monday 9-11 AM',
    'Email volume peaks: Tuesday afternoons',
    'Task completion rate: Highest on Wednesdays'
  ]
}

export default function BrainPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'memories' | 'suggestions' | 'briefing'>('dashboard')

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Brain },
    { id: 'memories', label: 'Memory', icon: Database },
    { id: 'suggestions', label: 'Suggestions', icon: Lightbulb },
    { id: 'briefing', label: 'Daily Briefing', icon: Clock }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Brain className="h-8 w-8 text-purple-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Brain</h1>
              <p className="text-sm text-gray-600">Your intelligent assistant learns from your patterns</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              Learning Active
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'dashboard' && <BrainDashboard />}
        {activeTab === 'memories' && <MemoriesView />}
        {activeTab === 'suggestions' && <SuggestionsView />}
        {activeTab === 'briefing' && <DailyBriefingView />}
      </div>
    </div>
  )
}

function BrainDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Database className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Memories Stored</p>
              <p className="text-2xl font-bold text-gray-900">1,247</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Patterns Learned</p>
              <p className="text-2xl font-bold text-gray-900">89</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Confidence</p>
              <p className="text-2xl font-bold text-gray-900">92%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Lightbulb className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Suggestions Today</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Learning Activity</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {mockMemories.slice(0, 3).map((memory) => (
              <div key={memory.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    memory.confidence > 90 ? 'bg-green-500' :
                    memory.confidence > 80 ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{memory.content}</p>
                    <p className="text-xs text-gray-500">
                      {memory.actions} actions • Updated {memory.lastUpdated}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{memory.confidence}%</div>
                  <div className="text-xs text-gray-500">confidence</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function MemoriesView() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Memory Bank</h3>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                Filter by Type
              </button>
              <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                Sort by Confidence
              </button>
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {mockMemories.map((memory) => (
            <div key={memory.id} className="p-6 hover:bg-gray-50">
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
          ))}
        </div>
      </div>
    </div>
  )
}

function SuggestionsView() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">AI Suggestions</h3>
          <p className="text-sm text-gray-600">Smart recommendations based on your patterns</p>
        </div>
        <div className="divide-y divide-gray-200">
          {mockSuggestions.map((suggestion) => (
            <div key={suggestion.id} className="p-6 hover:bg-gray-50">
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
                  <button className="px-3 py-1 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700">
                    Apply
                  </button>
                  <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function DailyBriefingView() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Daily Briefing</h3>
              <p className="text-sm text-gray-600">{mockDailyBriefing.date}</p>
            </div>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
              Generate New Briefing
            </button>
          </div>
        </div>
        <div className="p-6 space-y-6">
          {/* Key Insights */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">Key Insights</h4>
            <ul className="space-y-2">
              {mockDailyBriefing.insights.map((insight, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{insight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommendations */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">Recommendations</h4>
            <ul className="space-y-2">
              {mockDailyBriefing.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Patterns */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">Your Patterns</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockDailyBriefing.patterns.map((pattern, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">{pattern}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}