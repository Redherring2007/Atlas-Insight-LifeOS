import { ModulePage } from '@/components/module-page'
import { SlidersHorizontal, Target, Shield, CheckCircle2, Brain } from 'lucide-react'

export default function PersonaPage() {
  return (
    <ModulePage
      title="Persona"
      subtitle="A simple preference layer for how ATLAS works with you."
      primaryAction="Update Persona"
      privacy
      stats={[
        { label: "Tone", value: "Calm", detail: "default", icon: SlidersHorizontal },
        { label: "Focus", value: "Business", detail: "active", icon: Target },
        { label: "Privacy", value: "Strict", detail: "private first", icon: Shield },
        { label: "Decisions", value: "Concise", detail: "preferred", icon: CheckCircle2 },
        { label: "Memory", value: "On", detail: "reviewable", icon: Brain },
      ]}
      sections={[
        { title: "Work Style", items: ["Show short next steps.", "Keep dashboards calm and actionable."], action: "Edit style" },
        { title: "Decision Preferences", items: ["Prefer concise recommendations.", "Ask approval before sensitive actions."], action: "Edit decisions" },
        { title: "Privacy Defaults", items: ["Personal data is private to the user.", "Business data follows workspace permissions."], action: "Review privacy" },
        { title: "AI Memory", items: ["Remember useful patterns.", "Keep memory reviewable and permissioned."], action: "Review memory" },
      ]}
      quickSetup={[
        { title: "Set tone", description: "Choose how direct ATLAS should be.", action: "Set tone", icon: SlidersHorizontal },
        { title: "Set focus", description: "Choose business or private context.", action: "Set focus", icon: Target },
        { title: "Review memory", description: "Keep only helpful patterns.", action: "Review", icon: Brain },
      ]}
    />
  )
}
