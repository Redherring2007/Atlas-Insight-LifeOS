import { ModulePage } from '@/components/module-page'
import { Network, Waves, LineChart, Blocks, Shield } from 'lucide-react'

export default function ConnectedSystemsPage() {
  return (
    <ModulePage
      title="Connected Systems"
      subtitle="Optional connected products that extend ATLAS without becoming main modules."
      primaryAction="Connect System"
      stats={[
        { label: "ATLAS Insight", value: "On", detail: "signals", icon: Network },
        { label: "Sargassum", value: "Ready", detail: "optional", icon: Waves },
        { label: "Trading Bot", value: "Ready", detail: "optional", icon: LineChart },
        { label: "Future Products", value: "Open", detail: "plugin-ready", icon: Blocks },
        { label: "Core OS", value: "Clean", detail: "unchanged", icon: Shield },
      ]}
      sections={[
        { title: "ATLAS Insight", items: ["External intelligence and risk signals can feed the command layer."], action: "Review link" },
        { title: "Sargassum System", items: ["Optional environmental tracking and routing connection."], action: "Connect when ready" },
        { title: "Trading Bot", items: ["Optional finance signal source with approval boundaries."], action: "Review option" },
        { title: "Future Products", items: ["New products can connect later without cluttering the main app."], action: "Add product" },
      ]}
      quickSetup={[
        { title: "Pick system", description: "Choose only what you actively use.", action: "Choose", icon: Network },
        { title: "Set scope", description: "Decide what data can flow into ATLAS.", action: "Set scope", icon: Shield },
        { title: "Connect later", description: "Leave optional systems off until needed.", action: "Save", icon: Blocks },
      ]}
    />
  )
}
