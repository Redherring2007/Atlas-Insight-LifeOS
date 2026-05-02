import { ModulePage } from '@/components/module-page'
import { Contact, UserRoundPlus, MessageCircle, Users, Plus } from 'lucide-react'

export default function ContactsPage() {
  return (
    <ModulePage
      title="Contacts"
      subtitle="A clean business card holder for people, leads, and follow-ups."
      primaryAction="Quick Add Contact"
      stats={[
        { label: "People", value: "42", detail: "known", icon: Contact },
        { label: "Leads", value: "8", detail: "active", icon: UserRoundPlus },
        { label: "Follow-ups", value: "5", detail: "due", icon: MessageCircle },
        { label: "Warm", value: "12", detail: "relationships", icon: Users },
        { label: "New", value: "3", detail: "this week", icon: Plus },
      ]}
      sections={[
        { title: "People", items: ["Sarah Johnson, TechCorp.", "Mike Chen, Investors.io.", "Emma Rodriguez, Design Studio."], action: "View people" },
        { title: "Leads", items: ["ABC Corp decision maker.", "Pricing enquiry from client@example.com.", "Design partner introduction."], action: "Review leads" },
        { title: "Follow-ups", items: ["Send contract revision to Sarah.", "Ask Mike for metrics feedback.", "Book call with Emma."], action: "Open follow-ups" },
        { title: "Business Card Holder", items: ["Where met, company, lead status, and next note stay visible.", "No complex CRM setup required."], action: "Add card" },
      ]}
      quickSetup={[
        { title: "Add contact", description: "Save name, email, and company first.", action: "Add", icon: UserRoundPlus },
        { title: "Add where met", description: "Keep the memory attached to the card.", action: "Add note", icon: MessageCircle },
        { title: "Set lead status", description: "Mark cold, warm, or ready to act.", action: "Set status", icon: Users },
      ]}
    />
  )
}
