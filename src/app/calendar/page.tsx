import { ModulePage } from '@/components/module-page'
import { CalendarDays, Clock, AlertTriangle, Focus, Plus } from 'lucide-react'

export default function CalendarPage() {
  return (
    <ModulePage
      title="Calendar"
      subtitle="See today, upcoming commitments, conflicts, and suggested focus time."
      primaryAction="New Event"
      privacy
      stats={[
        { label: "Today", value: "3", detail: "events", icon: CalendarDays },
        { label: "Upcoming", value: "8", detail: "this week", icon: Clock },
        { label: "Conflicts", value: "1", detail: "needs review", icon: AlertTriangle },
        { label: "Focus", value: "2h", detail: "suggested", icon: Focus },
        { label: "Open slots", value: "4", detail: "available", icon: Plus },
      ]}
      sections={[
        { title: "Today", items: ["10:00 Client meeting with ABC Corp.", "14:00 Contract revision block.", "16:30 Finance approval check."], action: "View day" },
        { title: "Upcoming", items: ["Tuesday team planning.", "Wednesday invoice review.", "Friday project closeout."], action: "View week" },
        { title: "Conflicts", items: ["Team standup overlaps with client prep tomorrow."], action: "Resolve conflict" },
        { title: "Suggested Focus Block", items: ["Block 10:00 to 12:00 for contract work.", "Protect Friday morning for deep finance review."], action: "Add focus block" },
      ]}
      quickSetup={[
        { title: "Add event", description: "Create a meeting or deadline.", action: "Add event", icon: CalendarDays },
        { title: "Add focus block", description: "Reserve time for important work.", action: "Block time", icon: Focus },
        { title: "Review conflict", description: "Move or merge overlapping events.", action: "Review", icon: AlertTriangle },
      ]}
    />
  )
}
