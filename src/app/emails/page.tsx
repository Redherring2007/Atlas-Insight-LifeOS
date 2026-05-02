import { ModulePage } from '@/components/module-page'
import { AlertCircle, Reply, Clock, Link2, CheckCircle2, Mail } from 'lucide-react'

export default function EmailsPage() {
  return (
    <ModulePage
      title="Emails"
      subtitle="Triage urgent mail, replies, waiting threads, and project-linked messages."
      primaryAction="Quick Triage"
      stats={[
        { label: "Urgent", value: "2", detail: "needs action", icon: AlertCircle },
        { label: "Needs reply", value: "5", detail: "open", icon: Reply },
        { label: "Waiting", value: "3", detail: "threads", icon: Clock },
        { label: "Linked", value: "7", detail: "projects", icon: Link2 },
        { label: "Cleared", value: "18", detail: "today", icon: CheckCircle2 },
      ]}
      sections={[
        { title: "Urgent", items: ["Contract revision from Sarah.", "Pricing question from active lead."], action: "Open urgent" },
        { title: "Needs Reply", items: ["ABC Corp legal feedback.", "Q2 planning confirmation.", "Investor metrics request."], action: "Draft replies" },
        { title: "Waiting", items: ["Client approval on invoice.", "Contract redline response."], action: "Send follow-up" },
        { title: "Linked to Projects", items: ["ABC Corp Deal.", "Q2 Planning.", "Invoice tracking."], action: "Open linked" },
      ]}
      quickSetup={[
        { title: "Quick triage", description: "Mark urgent, reply, wait, or archive.", action: "Triage", icon: Mail },
        { title: "Draft reply", description: "Let ATLAS prepare a concise response.", action: "Draft", icon: Reply },
        { title: "Link project", description: "Attach an email to the right deal or task.", action: "Link", icon: Link2 },
      ]}
    />
  )
}
