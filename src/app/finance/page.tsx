'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { InvoiceCard } from '@/components/invoice-card'
import { Invoice, Payment, FinanceAccount } from '@/types'
import { Plus, TrendingUp, DollarSign, AlertCircle } from 'lucide-react'

interface FinanceData {
  invoices: Invoice[]
  payments: Payment[]
  accounts: FinanceAccount[]
}

export default function FinancePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [data, setData] = useState<FinanceData>({
    invoices: [],
    payments: [],
    accounts: [],
  })
  const [showAddInvoice, setShowAddInvoice] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('month')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      // Mock data - in real app, fetch from API
      const mockInvoices: Invoice[] = [
        {
          id: '1',
          workspaceId: '1',
          clientId: '1',
          amount: 5000,
          status: 'pending',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
        {
          id: '2',
          workspaceId: '1',
          clientId: '2',
          amount: 3200,
          status: 'pending',
          dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
        },
        {
          id: '3',
          workspaceId: '1',
          clientId: '3',
          amount: 7500,
          status: 'paid',
          dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
      ]

      const mockAccounts: FinanceAccount[] = [
        {
          id: '1',
          workspaceId: '1',
          name: 'Business Checking',
          type: 'bank',
          balance: 25000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          workspaceId: '1',
          name: 'Credit Card',
          type: 'credit',
          balance: -2500,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      setData({
        invoices: mockInvoices,
        payments: [],
        accounts: mockAccounts,
      })
      setIsLoading(false)
    }
  }, [session?.user])

  const calculateStats = () => {
    const pending = data.invoices
      .filter(i => i.status === 'pending')
      .reduce((sum, i) => sum + parseFloat(String(i.amount || 0)), 0)

    const overdue = data.invoices
      .filter(i => i.status === 'pending' && i.dueDate && new Date(i.dueDate) < new Date())
      .reduce((sum, i) => sum + parseFloat(String(i.amount || 0)), 0)

    const paid = data.invoices
      .filter(i => i.status === 'paid')
      .reduce((sum, i) => sum + parseFloat(String(i.amount || 0)), 0)

    const totalAccounts = data.accounts.reduce((sum, a) => sum + parseFloat(String(a.balance || 0)), 0)

    return { pending, overdue, paid, totalAccounts }
  }

  const stats = calculateStats()

  const handleUpdateInvoice = (invoiceId: string, updates: Partial<Invoice>) => {
    setData(prev => ({
      ...prev,
      invoices: prev.invoices.map(i =>
        i.id === invoiceId ? { ...i, ...updates, updatedAt: new Date() } : i
      ),
    }))
  }

  const handleDeleteInvoice = (invoiceId: string) => {
    if (confirm('Delete this invoice?')) {
      setData(prev => ({
        ...prev,
        invoices: prev.invoices.filter(i => i.id !== invoiceId),
      }))
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
            <h1 className="text-3xl font-bold text-white mb-2">💰 Finance</h1>
            <p className="text-gray-400">Track invoices, payments, and cash flow at a glance.</p>
          </div>
          <button
            onClick={() => setShowAddInvoice(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
          >
            <Plus size={20} />
            <span>New Invoice</span>
          </button>
        </div>

        {/* Time Range Filter */}
        <div className="flex space-x-2">
          {(['month', 'quarter', 'year'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {range === 'month' ? 'This Month' : range === 'quarter' ? 'This Quarter' : 'This Year'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">Total Accounts</p>
            <DollarSign size={18} className="text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white">
            £{stats.totalAccounts.toLocaleString('en-GB', { 
              minimumFractionDigits: 0, 
              maximumFractionDigits: 0 
            })}
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">Pending Invoices</p>
            <AlertCircle size={18} className="text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-yellow-300">
            £{stats.pending.toLocaleString('en-GB', { 
              minimumFractionDigits: 0, 
              maximumFractionDigits: 0 
            })}
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-red-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">Overdue 🚨</p>
            <AlertCircle size={18} className="text-red-400" />
          </div>
          <p className="text-2xl font-bold text-red-400">
            £{stats.overdue.toLocaleString('en-GB', { 
              minimumFractionDigits: 0, 
              maximumFractionDigits: 0 
            })}
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">Paid</p>
            <TrendingUp size={18} className="text-green-400" />
          </div>
          <p className="text-2xl font-bold text-green-300">
            £{stats.paid.toLocaleString('en-GB', { 
              minimumFractionDigits: 0, 
              maximumFractionDigits: 0 
            })}
          </p>
        </div>
      </div>

      {/* Accounts */}
      <div className="max-w-7xl mx-auto mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Bank Accounts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.accounts.map(account => (
            <div key={account.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-gray-400 text-sm">{account.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{account.type}</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-white">
                £{parseFloat(String(account.balance || 0)).toLocaleString('en-GB', { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Invoices Section */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl font-semibold text-white mb-4">Invoices</h2>
        
        {data.invoices.length === 0 ? (
          <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
            <p className="text-gray-400 mb-4">No invoices yet. Create your first one!</p>
            <button
              onClick={() => setShowAddInvoice(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
            >
              <Plus size={18} />
              <span>Create Invoice</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.invoices.map(invoice => (
              <InvoiceCard
                key={invoice.id}
                invoice={invoice}
                onUpdate={handleUpdateInvoice}
                onDelete={handleDeleteInvoice}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Invoice Modal (placeholder) */}
      {showAddInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold text-white mb-4">Create Invoice</h2>
            <p className="text-gray-400 mb-4">Quick invoice form coming soon!</p>
            <button
              onClick={() => setShowAddInvoice(false)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
