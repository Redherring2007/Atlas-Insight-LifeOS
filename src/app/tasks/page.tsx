import { ModulePage } from '@/components/module-page'
import { CheckSquare, CalendarClock, Clock, CheckCircle2, Users, Plus } from 'lucide-react'

export default function TasksPage() {
  return (
    <ModulePage
      title="Tasks"
      subtitle="A simple place for today, upcoming work, and what is waiting."
      primaryAction="Quick Add Task"
      stats={[
        { label: "Today", value: "5", detail: "active", icon: CheckSquare },
        { label: "Upcoming", value: "9", detail: "next 7 days", icon: CalendarClock },
        { label: "Waiting", value: "3", detail: "blocked", icon: Clock },
        { label: "Completed", value: "18", detail: "this week", icon: CheckCircle2 },
        { label: "Owners", value: "4", detail: "assigned", icon: Users },
      ]}
      sections={[
        { title: "Today", items: ["Review contract with ABC Corp.", "Send invoice follow-up.", "Confirm Tuesday meeting brief."], action: "Open today" },
        { title: "Upcoming", items: ["Prepare client presentation.", "Plan next finance review.", "Update workspace permissions."], action: "Plan week" },
        { title: "Waiting", items: ["Legal feedback on contract.", "Client approval on invoice.", "Sarah to confirm availability."], action: "Send nudge" },
        { title: "Completed", items: ["Added three contacts.", "Closed Q2 planning task.", "Updated payment approval copy."], action: "View completed" },
      ]}
      quickSetup={[
        { title: "Add task", description: "Capture the next action in one line.", action: "Add", icon: Plus },
        { title: "Assign owner", description: "Choose who is responsible.", action: "Assign", icon: Users },
        { title: "Set due date", description: "Give the task a clear time horizon.", action: "Set date", icon: CalendarClock },
      ]}
    />
  )
}
