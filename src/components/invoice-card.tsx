// @ts-nocheck
'use client'

import { Invoice } from '@/types'
import { Trash2, Eye, CheckCircle, AlertCircle } from 'lucide-react'

interface InvoiceCardProps {
  invoice: Invoice
  onUpdate: (invoiceId: string, updates: Partial<Invoice>) => void
  onDelete: (invoiceId: string) => void
}

const statusConfig = {
  pending: { bg: 'bg-yellow-600', text: 'text-yellow-200', label: '⏳ Pending' },
  paid: { bg: 'bg-green-600', text: 'text-green-200', label: '✓ Paid' },
  overdue: { bg: 'bg-red-600', text: 'text-red-200', label: '⚠️ Overdue' },
}

export function InvoiceCard({ invoice, onUpdate, onDelete }: InvoiceCardProps) {
  const isOverdue = invoice.dueDate && new Date(invoice.dueDate) < new Date() && invoice.status !== 'paid'
  const actualStatus = isOverdue ? 'overdue' : (invoice.status as keyof typeof statusConfig)
  const config = statusConfig[actualStatus]

  const daysUntilDue = invoice.dueDate 
    ? Math.ceil((new Date(invoice.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-white">Invoice #{invoice.id.slice(0, 8)}</h3>
            <button
              onClick={() => {
                const newStatus = actualStatus === 'paid' ? 'pending' : 'paid'
                onUpdate(invoice.id, { status: newStatus as any })
              }}
              className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-semibold ${config.bg} ${config.text} hover:opacity-80 transition-opacity cursor-pointer`}
            >
              {actualStatus === 'paid' ? (
                <>
                  <CheckCircle size={14} />
                  <span>Paid</span>
                </>
              ) : actualStatus === 'overdue' ? (
                <>
                  <AlertCircle size={14} />
                  <span>Overdue</span>
                </>
              ) : (
                <>
                  <Eye size={14} />
                  <span>Pending</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Amount */}
      <div className="mb-3">
        <p className="text-3xl font-bold text-white">
          £{parseFloat(String(invoice.amount || 0)).toLocaleString('en-GB', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
          })}
        </p>
      </div>

      {/* Due date and client */}
      <div className="space-y-2 text-sm mb-3 pb-3 border-b border-gray-700">
        {invoice.dueDate && (
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Due date</span>
            <span className={`font-medium ${
              isOverdue ? 'text-red-400' : daysUntilDue < 7 ? 'text-yellow-400' : 'text-gray-300'
            }`}>
              {new Date(invoice.dueDate).toLocaleDateString()}
              {daysUntilDue > 0 && !isOverdue && (
                <span className="text-gray-500 ml-1">({daysUntilDue}d left)</span>
              )}
              {isOverdue && (
                <span className="text-red-500 ml-1">({Math.abs(daysUntilDue)}d overdue)</span>
              )}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <div className="text-xs text-gray-500">
          {new Date(invoice.createdAt).toLocaleDateString()}
        </div>
        <button
          onClick={() => onDelete(invoice.id)}
          className="text-red-400 hover:text-red-300 transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  )
}
