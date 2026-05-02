import { ModulePage } from '@/components/module-page'
import { Briefcase, FileSignature, BadgeCheck, CircleDollarSign, Clock } from 'lucide-react'

export default function DealsContractsPage() {
  return (
    <ModulePage
      title="Deals & Contracts"
      subtitle="Track deals, contract work, approvals, and next actions in one simple view."
      primaryAction="New Deal"
      stats={[
        { label: "Deals", value: "6", detail: "open", icon: Briefcase },
        { label: "Contracts", value: "4", detail: "active", icon: FileSignature },
        { label: "Approvals", value: "2", detail: "waiting", icon: BadgeCheck },
        { label: "Value", value: "£48k", detail: "pipeline", icon: CircleDollarSign },
        { label: "Due", value: "3", detail: "this week", icon: Clock },
      ]}
      sections={[
        { title: "Open Deals", items: ["ABC Corp contract revision.", "Design Studio proposal.", "Investor metrics follow-up."], action: "Open deals" },
        { title: "Contracts", items: ["ABC Corp redline pending.", "Supplier renewal due this quarter."], action: "Open contracts" },
        { title: "Approvals", items: ["Payment terms need approval.", "Contract change needs final review."], action: "Review approvals" },
        { title: "Next Actions", items: ["Send revised terms.", "Book negotiation call.", "Attach latest invoice."], action: "Create task" },
      ]}
      quickSetup={[
        { title: "Add deal", description: "Capture the company, value, and stage.", action: "Add deal", icon: Briefcase },
        { title: "Add contract", description: "Track renewal, owner, and status.", action: "Add contract", icon: FileSignature },
        { title: "Set approval", description: "Keep sensitive decisions controlled.", action: "Set approval", icon: BadgeCheck },
      ]}
    />
  )
}
