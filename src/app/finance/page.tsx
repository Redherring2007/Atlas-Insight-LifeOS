import { ModulePage } from '@/components/module-page'
import { Landmark, TrendingUp, Receipt, BadgeCheck, FileSignature } from 'lucide-react'

export default function FinancePage() {
  return (
    <ModulePage
      title="Finance"
      subtitle="Accounts, cash flow, invoices, approvals, and contracts without finance clutter."
      primaryAction="Review Approval"
      privacy
      stats={[
        { label: "Accounts", value: "2", detail: "connected", icon: Landmark },
        { label: "Cash Flow", value: "£22.5k", detail: "net view", icon: TrendingUp },
        { label: "Invoices", value: "3", detail: "open", icon: Receipt },
        { label: "Approvals", value: "2", detail: "waiting", icon: BadgeCheck },
        { label: "Contracts", value: "4", detail: "tracked", icon: FileSignature },
      ]}
      sections={[
        { title: "Accounts", items: ["Business Checking: £25,000.", "Credit Card: £2,500 outstanding."], action: "Add account" },
        { title: "Cash Flow", items: ["Incoming invoices cover this month.", "One overdue amount needs follow-up."], action: "View cash flow" },
        { title: "Invoices", items: ["ABC Corp invoice pending.", "XYZ Ltd overdue by 5 days.", "Design Studio paid."], action: "Create invoice" },
        { title: "Payment Approvals", items: ["Approve supplier payment under limit.", "Hold contractor payment until milestone confirmation."], action: "Review approvals" },
        { title: "Contracts", items: ["ABC Corp revision pending.", "Two renewals due this quarter."], action: "Open contracts" },
      ]}
      quickSetup={[
        { title: "Add account", description: "Connect or record one finance account.", action: "Add account", icon: Landmark },
        { title: "Add invoice", description: "Create a simple invoice record.", action: "Add invoice", icon: Receipt },
        { title: "Review approval", description: "Approve, hold, or request context.", action: "Review", icon: BadgeCheck },
      ]}
    />
  )
}
