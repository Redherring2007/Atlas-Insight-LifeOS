import { ModulePage } from '@/components/module-page'
import { Workflow, Lightbulb, BadgeCheck, PauseCircle, Zap } from 'lucide-react'

export default function AutomationsPage() {
  return (
    <ModulePage
      title="Automations"
      subtitle="Simple rules that save time while keeping approvals visible."
      primaryAction="Create Rule"
      stats={[
        { label: "Active rules", value: "5", detail: "running", icon: Workflow },
        { label: "Suggested", value: "4", detail: "ready", icon: Lightbulb },
        { label: "Approvals", value: "2", detail: "required", icon: BadgeCheck },
        { label: "Paused", value: "1", detail: "manual", icon: PauseCircle },
        { label: "Runs", value: "156", detail: "this month", icon: Zap },
      ]}
      sections={[
        { title: "Active Rules", items: ["Flag urgent emails for review.", "Create tasks from priority emails.", "Send overdue invoice reminders."], action: "View active" },
        { title: "Suggested Rules", items: ["Prepare meeting brief before client calls.", "Create follow-up task after new lead email.", "Ask approval before payment execution."], action: "Review suggestions" },
        { title: "Approval Required", items: ["Payment execution needs approval.", "Contract follow-up draft is ready."], action: "Approve or hold" },
        { title: "Create Simple Rule", items: ["Choose a trigger.", "Choose an action.", "Decide if approval is required."], action: "Create rule" },
      ]}
      quickSetup={[
        { title: "Choose trigger", description: "Pick the event that starts the rule.", action: "Choose", icon: Zap },
        { title: "Choose action", description: "Keep the action clear and reversible.", action: "Set action", icon: Workflow },
        { title: "Set approval", description: "Require approval for sensitive actions.", action: "Set approval", icon: BadgeCheck },
      ]}
    />
  )
}
