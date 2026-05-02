'use client'

import { type FormEvent, useMemo, useState } from 'react'
import { AppShell } from '@/components/app-shell'
import { PageHeader } from '@/components/page-header'
import { PrivacyNote } from '@/components/privacy-note'
import { QuickActionCard } from '@/components/quick-action-card'
import { SectionTabs } from '@/components/section-tabs'
import { SimpleCard } from '@/components/simple-card'
import { StatCard } from '@/components/stat-card'
import { BadgeCheck, CalendarDays, CircleDollarSign, FileSignature, Mail, Plus, Shield, CheckSquare, ToggleLeft, Users } from 'lucide-react'

const initialMembers = [
  { name: 'Sarah Johnson', email: 'sarah@company.com', role: 'Admin', access: 'Tasks, Calendar, Finance Overview' },
  { name: 'Mike Chen', email: 'mike@company.com', role: 'Member', access: 'Tasks, Contacts' },
  { name: 'Emma Rodriguez', email: 'emma@company.com', role: 'Member', access: 'Calendar, Contracts' },
]

const accessToggles = ['Tasks', 'Calendar', 'Contacts', 'Finance Overview', 'Payments', 'Contracts']

export default function TeamsPage() {
  const [activeTab, setActiveTab] = useState<'members' | 'invite' | 'permissions'>('members')
  const [members, setMembers] = useState(initialMembers)
  const [inviteStatus, setInviteStatus] = useState('')
  const [permissionStatus, setPermissionStatus] = useState('')
  const [enabledAccess, setEnabledAccess] = useState<Record<string, boolean>>({
    Tasks: true,
    Calendar: true,
    Contacts: false,
    'Finance Overview': false,
    Payments: false,
    Contracts: false,
  })
  const [financePermissions, setFinancePermissions] = useState<Record<string, boolean>>({
    'View only': true,
    'Suggest actions': false,
    'Execute with approval': false,
    'Require approval above amount': true,
  })

  const financeEnabled = useMemo(
    () => enabledAccess['Finance Overview'] || enabledAccess.Payments || enabledAccess.Contracts,
    [enabledAccess]
  )

  const toggleAccess = (item: string) => {
    setEnabledAccess((current) => ({ ...current, [item]: !current[item] }))
    setPermissionStatus('')
  }

  const toggleFinancePermission = (item: string) => {
    setFinancePermissions((current) => ({ ...current, [item]: !current[item] }))
    setPermissionStatus('')
  }

  const handleSavePermissions = () => {
    const selectedAccess = Object.entries(enabledAccess)
      .filter(([, enabled]) => enabled)
      .map(([name]) => name)
    const selectedFinance = Object.entries(financePermissions)
      .filter(([, enabled]) => enabled)
      .map(([name]) => name)

    window.localStorage.setItem(
      'atlas.teamPermissions',
      JSON.stringify({
        access: selectedAccess,
        finance: financeEnabled ? selectedFinance : [],
        aiAssistant: 'included by default; context limited by permissions',
        savedAt: new Date().toISOString(),
      })
    )
    setPermissionStatus('Permissions saved locally. Server-side role enforcement and invite delivery still need the workspace API.')
  }

  const handleInvite = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const member = {
      name: String(formData.get('name') || ''),
      email: String(formData.get('email') || ''),
      role: String(formData.get('role') || 'Member'),
      access: Object.entries(enabledAccess).filter(([, enabled]) => enabled).map(([name]) => name).join(', ') || 'No access selected',
    }
    setMembers((current) => {
      const next = [member, ...current]
      window.localStorage.setItem('atlas.teamMembers', JSON.stringify(next))
      return next
    })
    setInviteStatus('Team member setup saved locally. Real invite email delivery still needs the workspace invite API.')
    event.currentTarget.reset()
    setActiveTab('members')
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title="Teams"
          subtitle="Invite people, choose simple access, and keep AI context limited by permissions."
          action={<button type="button" onClick={() => setActiveTab('invite')} className="inline-flex items-center gap-2 rounded-md bg-[#D7B56D] px-4 py-2.5 text-sm font-semibold text-[#070A0F] transition hover:bg-[#E4C67F]"><Plus size={16} />Add Team Member</button>}
        />

        <PrivacyNote />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Team Members" value={String(members.length)} detail="active" icon={Users} />
          <StatCard label="Open Invites" value="1" detail="pending" icon={Mail} />
          <StatCard label="Approval Roles" value="2" detail="finance" icon={BadgeCheck} />
          <StatCard label="AI Assistant" value="Included" detail="permissioned" icon={Shield} />
        </div>

        <SectionTabs
          activeTab={activeTab}
          onChange={setActiveTab}
          tabs={[
            { id: 'members', label: 'Team Members' },
            { id: 'invite', label: 'Add Member' },
            { id: 'permissions', label: 'Access' },
          ]}
        />

        {activeTab === 'members' ? (
          <SimpleCard title="Team Members">
            <div className="grid gap-3 md:grid-cols-3">
              {members.map((member) => (
                <div key={member.email} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-white">{member.name}</h3>
                      <p className="mt-1 text-sm text-[#8FA3B8]">{member.email}</p>
                    </div>
                    <span className="rounded-md border border-white/10 px-2 py-1 text-xs text-[#D7B56D]">{member.role}</span>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-[#B8C7D6]">{member.access}</p>
                </div>
              ))}
            </div>
          </SimpleCard>
        ) : null}

        {activeTab === 'invite' ? (
          <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <SimpleCard title="Add Team Member">
              <form onSubmit={handleInvite} className="space-y-5">
                <div className="grid gap-4 md:grid-cols-3">
                  {['Name', 'Email', 'Role'].map((label) => (
                    <label key={label} className="text-sm text-[#AEBBCC]">
                      {label}
                      <input className="mt-2 w-full rounded-md border border-white/10 bg-[#0B1118] px-3 py-2 text-sm text-white outline-none focus:border-[#D7B56D]/60" name={label.toLowerCase()} required={label !== 'Role'} placeholder={label} />
                    </label>
                  ))}
                </div>
                <div className="mt-5 rounded-lg border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white"><Shield size={15} className="text-[#D7B56D]" />AI Assistant included by default.</div>
                  <p className="mt-1 text-sm leading-6 text-[#8FA3B8]">Context is limited by permissions.</p>
                </div>
                <button type="submit" className="rounded-md bg-[#D7B56D] px-4 py-2.5 text-sm font-semibold text-[#070A0F] transition hover:bg-[#E4C67F]">Save Team Setup</button>
                {inviteStatus ? <p className="text-sm text-[#8FA3B8]">{inviteStatus}</p> : null}
              </form>
            </SimpleCard>

            <SimpleCard title="Start here">
              <div className="space-y-3">
                <QuickActionCard module="Teams" title="Add team member" description="Start with name, email, and role." action="Add" icon={Users} />
                <QuickActionCard module="Teams" title="Choose access" description="Turn on only the areas they need." action="Choose" icon={ToggleLeft} />
                <QuickActionCard module="Teams" title="Send invite" description="Invite after permissions are clear." action="Send" icon={Mail} />
              </div>
            </SimpleCard>
          </div>
        ) : null}

        {activeTab === 'permissions' ? (
          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <SimpleCard title="Access Toggles">
              <div className="grid gap-3 sm:grid-cols-2">
                {accessToggles.map((item) => {
                  const active = enabledAccess[item]
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleAccess(item)}
                      className={(active ? 'border-[#D7B56D]/40 bg-[#D7B56D]/10 text-white' : 'border-white/10 bg-white/[0.025] text-[#AEBBCC]') + ' flex items-center justify-between rounded-lg border p-3 text-left text-sm transition'}
                    >
                      <span>{item}</span>
                      <span className="text-xs">{active ? 'On' : 'Off'}</span>
                    </button>
                  )
                })}
              </div>
            </SimpleCard>

            <SimpleCard title="Financial Permissions">
              {financeEnabled ? (
                <div className="space-y-3">
                  {['View only', 'Suggest actions', 'Execute with approval', 'Require approval above amount'].map((item) => (
                    <label key={item} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.025] p-3 text-sm text-[#DCE7F1]">
                      <span>{item}</span>
                      <input
                        type="checkbox"
                        checked={financePermissions[item]}
                        onChange={() => toggleFinancePermission(item)}
                        className="h-4 w-4 accent-[#D7B56D]"
                      />
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-sm leading-6 text-[#8FA3B8]">Turn on Finance Overview, Payments, or Contracts to set financial permission details.</p>
              )}
              <div className="mt-4">
                <button type="button" onClick={handleSavePermissions} className="rounded-md bg-[#D7B56D] px-4 py-2.5 text-sm font-semibold text-[#070A0F] transition hover:bg-[#E4C67F]">Save Permissions</button>
                {permissionStatus ? <p className="mt-3 text-sm leading-6 text-[#8FA3B8]">{permissionStatus}</p> : null}
              </div>
            </SimpleCard>
          </div>
        ) : null}

        <SimpleCard title="Simple setup">
          <div className="grid gap-3 md:grid-cols-3">
            <QuickActionCard module="Teams" title="Tasks" description="Let members see assigned work." action="Enable" icon={CheckSquare} />
            <QuickActionCard module="Teams" title="Calendar" description="Share only business scheduling context." action="Enable" icon={CalendarDays} />
            <QuickActionCard module="Teams" title="Finance" description="Start with overview before payments." action="Review" icon={CircleDollarSign} />
            <QuickActionCard module="Teams" title="Contracts" description="Grant contract access deliberately." action="Review" icon={FileSignature} />
          </div>
        </SimpleCard>
      </div>
    </AppShell>
  )
}
