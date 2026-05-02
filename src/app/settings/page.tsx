import { ModulePage } from '@/components/module-page'
import { Building2, UserCircle, Users, Plug, Brain } from 'lucide-react'

export default function SettingsPage() {
  return (
    <ModulePage
      title="Settings"
      subtitle="Workspace, profile, access, permissions, integrations, and AI memory."
      primaryAction="Save Settings"
      privacy
      stats={[
        { label: "Workspace", value: "Business", detail: "active", icon: Building2 },
        { label: "Profile", value: "Ready", detail: "complete", icon: UserCircle },
        { label: "Access", value: "4", detail: "members", icon: Users },
        { label: "Integrations", value: "3", detail: "available", icon: Plug },
        { label: "AI memory", value: "On", detail: "permissioned", icon: Brain },
      ]}
      sections={[
        { title: "Workspace", items: ["Set workspace name and business defaults.", "Keep private space separate."], action: "Edit workspace" },
        { title: "Profile", items: ["Name, email, role, and notification basics."], action: "Edit profile" },
        { title: "Team Access", items: ["Manage roles and module permissions.", "AI Assistant included by default."], action: "Open teams" },
        { title: "Permissions", items: ["Tasks, calendar, contacts, finance overview, payments, and contracts."], action: "Review permissions" },
        { title: "Integrations", items: ["Connect only the systems you need."], action: "Manage integrations" },
        { title: "AI Memory", items: ["Learning context follows workspace permissions."], action: "Review memory" },
      ]}
      quickSetup={[
        { title: "Update profile", description: "Keep your identity and role current.", action: "Update", icon: UserCircle },
        { title: "Review access", description: "Check who can see each workspace area.", action: "Review", icon: Users },
        { title: "Tune AI memory", description: "Keep useful learning, remove noise.", action: "Tune", icon: Brain },
      ]}
    />
  )
}
