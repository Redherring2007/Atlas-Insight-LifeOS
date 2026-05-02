import { ModulePage } from '@/components/module-page'
import { Lock, CalendarDays, FileText, MessageSquare, Shield } from 'lucide-react'

export default function PrivatePage() {
  return (
    <ModulePage
      title="Private"
      subtitle="Owner-only space for personal tasks, calendar, finance notes, and AI questions."
      primaryAction="Add Private Item"
      privacy
      stats={[
        { label: "Private tasks", value: "6", detail: "owner-only", icon: Lock },
        { label: "Private calendar", value: "3", detail: "events", icon: CalendarDays },
        { label: "Finance notes", value: "4", detail: "private", icon: FileText },
        { label: "AI questions", value: "8", detail: "private", icon: MessageSquare },
        { label: "Visibility", value: "You", detail: "only", icon: Shield },
      ]}
      sections={[
        { title: "Private Tasks", items: ["Renew passport.", "Plan personal travel.", "Call family accountant."], action: "Add private task" },
        { title: "Private Calendar", items: ["Morning workout.", "Personal appointment.", "Family dinner."], action: "Add private event" },
        { title: "Private Finance Notes", items: ["Personal budget note.", "Savings plan review."], action: "Add note" },
        { title: "Private AI Questions", items: ["Ask personal questions without workspace visibility.", "Keep business and private context separate."], action: "Ask privately" },
      ]}
      quickSetup={[
        { title: "Add private task", description: "Only you can see it.", action: "Add task", icon: Lock },
        { title: "Add private event", description: "Keep personal time out of workspace view.", action: "Add event", icon: CalendarDays },
        { title: "Ask privately", description: "Use ATLAS without business exposure.", action: "Ask", icon: MessageSquare },
      ]}
    />
  )
}
