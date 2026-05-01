'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ContactCard } from '@/components/contact-card'
import { QuickAddContactModal } from '@/components/quick-add-contact-modal'
import { ContactProfile, NewContactProfile } from '@/types'
import { Plus, Search, Filter } from 'lucide-react'

export default function ContactsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [contacts, setContacts] = useState<ContactProfile[]>([])
  const [filteredContacts, setFilteredContacts] = useState<ContactProfile[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'cold' | 'warm' | 'hot'>('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      // Mock data - in real app, fetch from API
      const mockContacts: ContactProfile[] = [
        {
          id: '1',
          workspaceId: '1',
          name: 'Sarah Johnson',
          email: 'sarah@techcorp.com',
          phone: '+1 555-0101',
          company: 'TechCorp',
          tags: ['partner', 'tech'],
          trustLevel: 8,
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          whereMet: 'Tech Conference 2026',
          conversationPoints: 'Interested in partnership for Q2 product launch',
        } as any,
        {
          id: '2',
          workspaceId: '1',
          name: 'Mike Chen',
          email: 'mike@investors.io',
          phone: '+1 555-0102',
          company: 'Investors.io',
          tags: ['investor', 'follow-up'],
          trustLevel: 4,
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          whereMet: 'LinkedIn',
          conversationPoints: 'Mentioned Series A interest, waiting for metrics',
        } as any,
        {
          id: '3',
          workspaceId: '1',
          name: 'Emma Rodriguez',
          email: 'emma@design.studio',
          company: 'Design Studio',
          tags: ['designer', 'contract'],
          trustLevel: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
          whereMet: 'Referral from Alex',
          conversationPoints: 'Referred for branding project, first contact',
        } as any,
      ]
      
      setContacts(mockContacts)
      setFilteredContacts(mockContacts)
      setIsLoading(false)
    }
  }, [session?.user])

  // Filter and search
  useEffect(() => {
    let results = contacts

    // Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      results = results.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.email?.toLowerCase().includes(query) ||
        c.company?.toLowerCase().includes(query)
      )
    }

    // Status filter
    if (filterStatus !== 'all') {
      results = results.filter(c => {
        const level = c.trustLevel || 5
        if (filterStatus === 'cold') return level <= 3
        if (filterStatus === 'warm') return level > 3 && level <= 7
        if (filterStatus === 'hot') return level > 7
        return true
      })
    }

    setFilteredContacts(results)
  }, [searchQuery, filterStatus, contacts])

  const handleAddContact = async (newContact: Omit<NewContactProfile, 'id' | 'createdAt' | 'updatedAt'>) => {
    // In real app, send to API
    const contact: ContactProfile = {
      id: Math.random().toString(),
      ...newContact,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any
    
    setContacts(prev => [contact, ...prev])
    setIsAddModalOpen(false)
  }

  const handleUpdateContact = (contactId: string, updates: Partial<ContactProfile>) => {
    setContacts(prev =>
      prev.map(c =>
        c.id === contactId
          ? { ...c, ...updates, updatedAt: new Date() }
          : c
      )
    )
  }

  const handleDeleteContact = (contactId: string) => {
    if (confirm('Delete this contact?')) {
      setContacts(prev => prev.filter(c => c.id !== contactId))
    }
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
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">💼 Contacts & CRM</h1>
            <p className="text-gray-400">Business card holder. Track leads, conversations and follow-ups.</p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
          >
            <Plus size={20} />
            <span>Add Contact</span>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-3 flex-wrap">
          <div className="flex-1 min-w-64 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter size={18} className="text-gray-400" />
            {(['all', 'cold', 'warm', 'hot'] as const).map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === status
                    ? status === 'cold'
                      ? 'bg-gray-600 text-white'
                      : status === 'warm'
                      ? 'bg-yellow-600 text-white'
                      : status === 'hot'
                      ? 'bg-red-600 text-white'
                      : 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto mb-6 grid grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-gray-400 text-sm">Total Contacts</div>
          <div className="text-2xl font-bold text-white">{contacts.length}</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-gray-400 text-sm">🔴 Cold</div>
          <div className="text-2xl font-bold text-gray-300">
            {contacts.filter(c => (c.trustLevel || 5) <= 3).length}
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-gray-400 text-sm">🟡 Warm</div>
          <div className="text-2xl font-bold text-yellow-300">
            {contacts.filter(c => (c.trustLevel || 5) > 3 && (c.trustLevel || 5) <= 7).length}
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-gray-400 text-sm">🔥 Hot</div>
          <div className="text-2xl font-bold text-red-300">
            {contacts.filter(c => (c.trustLevel || 5) > 7).length}
          </div>
        </div>
      </div>

      {/* Contacts Grid */}
      <div className="max-w-7xl mx-auto">
        {filteredContacts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">
              {contacts.length === 0 ? 'No contacts yet. Start by adding one!' : 'No contacts match your filter.'}
            </p>
            {contacts.length === 0 && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
              >
                <Plus size={18} />
                <span>Add Your First Contact</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContacts.map(contact => (
              <ContactCard
                key={contact.id}
                contact={contact}
                onUpdate={handleUpdateContact}
                onDelete={handleDeleteContact}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Contact Modal */}
      <QuickAddContactModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddContact}
        workspaceId={session?.user?.id || '1'}
        userId={session?.user?.id || 'user-1'}
      />
    </div>
  )
}
