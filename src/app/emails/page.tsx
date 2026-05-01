'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { EmailCard } from '@/components/email-card'
import { Email } from '@/types'
import { Search, Filter, Inbox } from 'lucide-react'

export default function EmailsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [emails, setEmails] = useState<Email[]>([])
  const [filteredEmails, setFilteredEmails] = useState<Email[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [urgencyFilter, setUrgencyFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all')
  const [readFilter, setReadFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      // Mock data - in real app, fetch from API
      const mockEmails: Email[] = [
        {
          id: '1',
          workspaceId: '1',
          from: 'sarah@techcorp.com',
          subject: 'Urgent: Contract revision needed - ABC Corp deal at risk',
          body: 'We received feedback from legal that requires immediate changes...',
          receivedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          read: false,
          urgency: 'high',
          linkedProject: 'ABC Corp Deal',
          preview: 'We received feedback from legal that requires immediate changes to close by Friday...',
          tags: ['contract', 'deal', 'legal'],
        } as any,
        {
          id: '2',
          workspaceId: '1',
          from: 'invoice@stripe.com',
          subject: 'Payment received: Invoice #2024-001',
          body: 'Your payment of £5,000 has been received.',
          receivedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
          read: true,
          urgency: 'low',
          linkedProject: 'Invoice tracking',
          preview: 'Your payment of £5,000 has been received and processed.',
          tags: ['payment', 'invoice'],
        } as any,
        {
          id: '3',
          workspaceId: '1',
          from: 'team@company.com',
          subject: 'Q2 planning meeting scheduled for Tuesday',
          body: 'Hi team, the Q2 planning meeting is scheduled...',
          receivedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
          read: false,
          urgency: 'medium',
          linkedProject: 'Q2 Planning',
          preview: 'The Q2 planning meeting is scheduled for Tuesday at 10am. Please come prepared...',
          tags: ['meeting', 'planning'],
        } as any,
        {
          id: '4',
          workspaceId: '1',
          from: 'client@example.com',
          subject: 'Question about pricing',
          body: 'Hi, I have a question about your pricing options...',
          receivedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
          read: false,
          urgency: 'medium',
          linkedProject: 'Sales lead',
          preview: 'I have a question about your pricing options and whether customization is available...',
          tags: ['sales', 'lead'],
        } as any,
        {
          id: '5',
          workspaceId: '1',
          from: 'newsletter@news.com',
          subject: 'This week in tech',
          body: 'Here are the top stories this week...',
          receivedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
          read: true,
          urgency: 'low',
          linkedProject: null,
          preview: 'Here are the top stories this week in tech news...',
          tags: ['newsletter'],
        } as any,
      ]

      setEmails(mockEmails)
      setFilteredEmails(mockEmails)
      setIsLoading(false)
    }
  }, [session?.user])

  // Filter and search
  useEffect(() => {
    let results = emails

    // Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      results = results.filter(e =>
        e.from.toLowerCase().includes(query) ||
        e.subject.toLowerCase().includes(query) ||
        e.body?.toLowerCase().includes(query)
      )
    }

    // Urgency filter
    if (urgencyFilter !== 'all') {
      results = results.filter(e => (e as any).urgency === urgencyFilter)
    }

    // Read filter
    if (readFilter === 'unread') {
      results = results.filter(e => !(e as any).read)
    } else if (readFilter === 'read') {
      results = results.filter(e => (e as any).read)
    }

    setFilteredEmails(results)
  }, [searchQuery, urgencyFilter, readFilter, emails])

  const handleUpdateEmail = (emailId: string, updates: Partial<Email>) => {
    setEmails(prev =>
      prev.map(e =>
        e.id === emailId
          ? { ...e, ...updates, updatedAt: new Date() }
          : e
      )
    )
  }

  const handleDeleteEmail = (emailId: string) => {
    if (confirm('Delete this email?')) {
      setEmails(prev => prev.filter(e => e.id !== emailId))
    }
  }

  const stats = {
    total: emails.length,
    unread: emails.filter(e => !(e as any).read).length,
    high: emails.filter(e => (e as any).urgency === 'high').length,
    medium: emails.filter(e => (e as any).urgency === 'medium').length,
  }

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
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">📧 Email Triage</h1>
            <p className="text-gray-400">AI-powered urgency classification. Handle what matters first.</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">{stats.total}</div>
            <p className="text-sm text-gray-400">emails</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          <div className="bg-blue-600/20 border border-blue-600 rounded p-3">
            <p className="text-xs text-blue-300">Unread</p>
            <p className="text-2xl font-bold text-blue-300">{stats.unread}</p>
          </div>
          <div className="bg-red-600/20 border border-red-600 rounded p-3">
            <p className="text-xs text-red-300">🔴 High</p>
            <p className="text-2xl font-bold text-red-300">{stats.high}</p>
          </div>
          <div className="bg-yellow-600/20 border border-yellow-600 rounded p-3">
            <p className="text-xs text-yellow-300">🟡 Medium</p>
            <p className="text-2xl font-bold text-yellow-300">{stats.medium}</p>
          </div>
          <div className="bg-gray-700/50 border border-gray-600 rounded p-3">
            <p className="text-xs text-gray-300">Time saved</p>
            <p className="text-2xl font-bold text-white">2h 15m</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-400" />
              <span className="text-sm text-gray-400">Urgency:</span>
            </div>
            {(['all', 'high', 'medium', 'low'] as const).map(urgency => (
              <button
                key={urgency}
                onClick={() => setUrgencyFilter(urgency)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  urgencyFilter === urgency
                    ? urgency === 'high'
                      ? 'bg-red-600 text-white'
                      : urgency === 'medium'
                      ? 'bg-yellow-600 text-white'
                      : urgency === 'low'
                      ? 'bg-green-600 text-white'
                      : 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {urgency === 'all' ? 'All' : urgency === 'high' ? '🔴 High' : urgency === 'medium' ? '🟡 Medium' : '⚪ Low'}
              </button>
            ))}

            <div className="flex-1"></div>

            <span className="text-sm text-gray-400 mr-2">Read:</span>
            {(['all', 'unread', 'read'] as const).map(read => (
              <button
                key={read}
                onClick={() => setReadFilter(read)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  readFilter === read
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {read === 'all' ? 'All' : read === 'unread' ? 'Unread' : 'Read'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Emails List */}
      <div className="max-w-4xl mx-auto">
        {filteredEmails.length === 0 ? (
          <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
            <Inbox size={48} className="text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">No emails match your filters</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEmails.map(email => (
              <EmailCard
                key={email.id}
                email={email}
                onUpdate={handleUpdateEmail}
                onDelete={handleDeleteEmail}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
