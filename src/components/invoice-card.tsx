'use client'

import { Invoice, InvoiceStatus } from '@/types'
import { Trash2, Eye, CheckCircle, AlertCircle } from 'lucide-react'
import { displayDate, formatCurrency } from '@/lib/display'

interface InvoiceCardProps {
  invoice: Invoice
  onUpdate: (invoiceId: string, updates: Partial<Invoice>) => void
  onDelete: (invoiceId: string) => void
}

const statusConfig = {
  pending: { bg: 'bg-yellow-600', text: 'text-yellow-200', label: 'Pending' },
  paid: { bg: 'bg-green-600', text: 'text-green-200', label: 'Paid' },
  overdue: { bg: 'bg-red-600', text: 'text-red-200', label: 'Overdue' },
}

function normalizeInvoiceStatus(status: string | null): Exclude<InvoiceStatus, 'overdue'> {
  return status === 'paid' ? 'paid' : 'pending'
}

export function InvoiceCard({ invoice, onUpdate, onDelete }: InvoiceCardProps) {
  const invoiceStatus = normalizeInvoiceStatus(invoice.status)
  const dueDate = invoice.dueDate ? new Date(invoice.dueDate) : null
  const isOverdue = Boolean(dueDate && dueDate < new Date() && invoiceStatus !== 'paid')
  const actualStatus: InvoiceStatus = isOverdue ? 'overdue' : invoiceStatus
  const config = statusConfig[actualStatus]

  const daysUntilDue = dueDate
    ? Math.ceil((dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
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
                onUpdate(invoice.id, { status: newStatus })
              }}
              className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-semibold ${config.bg} ${config.text} hover:opacity-80 transition-opacity cursor-pointer`}
            >
              {actualStatus === 'paid' ? (
                <>
                  <CheckCircle size={14} />
                  <span>{config.label}</span>
                </>
              ) : actualStatus === 'overdue' ? (
                <>
                  <AlertCircle size={14} />
                  <span>{config.label}</span>
                </>
              ) : (
                <>
                  <Eye size={14} />
                  <span>{config.label}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <p className="text-3xl font-bold text-white">
          £{formatCurrency(invoice.amount)}
        </p>
      </div>

      <div className="space-y-2 text-sm mb-3 pb-3 border-b border-gray-700">
        {dueDate && (
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Due date</span>
            <span className={`font-medium ${
              isOverdue ? 'text-red-400' : daysUntilDue < 7 ? 'text-yellow-400' : 'text-gray-300'
            }`}>
              {displayDate(dueDate)}
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

      <div className="flex justify-between items-center">
        <div className="text-xs text-gray-500">
          {displayDate(invoice.createdAt)}
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
