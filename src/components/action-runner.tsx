'use client'

import { FormEvent, useMemo, useState } from 'react'
import { X } from 'lucide-react'

type ActionKind = 'form' | 'api' | 'coming-soon'

interface ActionRunnerProps {
  module: string
  label: string
  intent?: string
  variant?: 'primary' | 'secondary'
  className?: string
  children?: React.ReactNode
}

interface ActionSpec {
  kind: ActionKind
  title: string
  summary: string
  submitLabel?: string
  fields?: Array<{ name: string; label: string; type?: string; placeholder?: string; required?: boolean }>
  storageKey?: string
  api?: { url: string; method?: 'GET' | 'POST'; body?: Record<string, unknown> }
  missing?: string[]
  approvalRequired?: boolean
}

const defaultMissing = ['Persistent database/API endpoint', 'Server-side validation', 'Audit log and permission checks']

function normalise(value: string) {
  return value.toLowerCase().replace(/&/g, 'and')
}

function getActionSpec(moduleName: string, label: string, intent?: string): ActionSpec {
  const moduleKey = normalise(moduleName)
  const text = normalise(`${label} ${intent ?? ''}`)

  if (moduleKey.includes('ai brain') || text.includes('ask atlas') || text.includes('draft') || text.includes('signal') || text.includes('memory')) {
    return {
      kind: 'api',
      title: label,
      summary: 'ATLAS prepares suggestions and drafts. Important actions stay pending until you approve them.',
      submitLabel: 'Prepare suggestion',
      fields: [
        { name: 'message', label: 'Request', placeholder: 'Ask ATLAS for a decision, draft, or summary', required: true },
        { name: 'context', label: 'Context', placeholder: 'Optional context, style notes, or linked record' },
      ],
      api: { url: '/api/ai', method: 'POST' },
      approvalRequired: true,
      missing: ['Real LLM provider key and prompt pipeline', 'Long-term memory writes from approved actions', 'Decision audit table integration'],
    }
  }

  if (moduleKey.includes('email') || text.includes('email') || text.includes('reply') || text.includes('triage')) {
    return {
      kind: 'api',
      title: label,
      summary: 'Email access requires user permission. This flow checks the current email API and shows what provider setup is still required.',
      submitLabel: text.includes('draft') ? 'Prepare draft' : 'Check email setup',
      fields: [
        { name: 'email', label: 'Email account', type: 'email', placeholder: 'you@example.com', required: true },
        { name: 'subject', label: 'Subject or thread', placeholder: 'Thread to read, draft, or triage' },
        { name: 'body', label: 'Style/context notes', placeholder: 'Preferred tone, previous decision, or reply context' },
      ],
      api: { url: '/api/email', method: 'POST', body: { action: text.includes('draft') ? 'send' : 'fetch' } },
      approvalRequired: true,
      missing: ['OAuth connection for Gmail/Outlook', 'Mailbox read scopes and token storage', 'Draft-only provider API integration before sending'],
    }
  }

  if (moduleKey.includes('team') || text.includes('team member') || text.includes('invite') || text.includes('owner') || text.includes('assign')) {
    return {
      kind: 'form',
      title: label,
      summary: 'Adds a team member setup record locally and keeps permissions explicit. Sending a real invite still needs an invite API.',
      submitLabel: 'Save team setup',
      storageKey: 'atlas.teamMembers',
      fields: [
        { name: 'name', label: 'Name', placeholder: 'Sarah Johnson', required: true },
        { name: 'email', label: 'Email', type: 'email', placeholder: 'sarah@company.com', required: true },
        { name: 'role', label: 'Role', placeholder: 'Admin, Member, Finance approver', required: true },
        { name: 'permissions', label: 'Permissions', placeholder: 'Tasks, Calendar, Contacts, Finance Overview' },
      ],
      missing: ['Invite delivery endpoint', 'Workspace membership persistence', 'Role-based server enforcement'],
    }
  }

  if (moduleKey.includes('contacts') || text.includes('contact') || text.includes('lead') || text.includes('follow-up')) {
    return {
      kind: 'form',
      title: label,
      summary: 'Creates a contact or lead setup record in this browser so the flow is testable while the API is connected.',
      submitLabel: 'Save contact',
      storageKey: 'atlas.contacts',
      fields: [
        { name: 'name', label: 'Name', placeholder: 'Emma Rodriguez', required: true },
        { name: 'email', label: 'Email', type: 'email', placeholder: 'emma@example.com' },
        { name: 'company', label: 'Company', placeholder: 'Design Studio' },
        { name: 'whereMet', label: 'Where met', placeholder: 'Referral, event, email, LinkedIn' },
        { name: 'leadStatus', label: 'Lead status', placeholder: 'Cold, warm, hot, customer' },
      ],
      missing: ['Contacts API route', 'Lead pipeline persistence', 'Record linking to tasks/emails/projects'],
    }
  }

  if (moduleKey.includes('tasks') || text.includes('task') || text.includes('nudge')) {
    return {
      kind: 'form',
      title: label,
      summary: 'Creates a task setup record locally. Assignment and routing are explicit so it can later connect to the task API.',
      submitLabel: 'Save task',
      storageKey: 'atlas.tasks',
      fields: [
        { name: 'title', label: 'Task', placeholder: 'Review ABC Corp contract', required: true },
        { name: 'owner', label: 'Owner', placeholder: 'You, Sarah, Finance team' },
        { name: 'dueDate', label: 'Due date', type: 'date' },
        { name: 'linkedRecord', label: 'Linked record', placeholder: 'Contact, email thread, deal, invoice' },
      ],
      missing: ['Tasks API route', 'Assignment notification workflow', 'Server-side record linking'],
    }
  }

  if (moduleKey.includes('calendar') || text.includes('event') || text.includes('focus') || text.includes('conflict')) {
    return {
      kind: 'api',
      title: label,
      summary: 'Creates a calendar setup event through the existing calendar API stub and clearly reports provider requirements.',
      submitLabel: 'Create setup event',
      fields: [
        { name: 'title', label: 'Title', placeholder: 'Focus block or meeting', required: true },
        { name: 'startTime', label: 'Start time', type: 'datetime-local', required: true },
        { name: 'endTime', label: 'End time', type: 'datetime-local' },
        { name: 'description', label: 'Description', placeholder: 'Purpose, attendees, or linked record' },
      ],
      api: { url: '/api/calendar', method: 'POST', body: { action: 'create-event' } },
      missing: ['Google/Microsoft calendar OAuth', 'Two-way sync', 'Conflict resolution persistence'],
    }
  }

  if (moduleKey.includes('finance') || text.includes('invoice') || text.includes('payment') || text.includes('approval') || text.includes('account')) {
    return {
      kind: 'api',
      title: label,
      summary: 'Finance actions are approval-first. This flow calls the current payments API stub and never executes money movement directly.',
      submitLabel: 'Prepare approval',
      fields: [
        { name: 'amount', label: 'Amount', type: 'number', placeholder: '5000', required: true },
        { name: 'currency', label: 'Currency', placeholder: 'GBP', required: true },
        { name: 'description', label: 'Description', placeholder: 'Invoice, account, contract, or payment reason' },
      ],
      api: { url: '/api/payments', method: 'POST', body: { action: 'create-payment-intent' } },
      approvalRequired: true,
      missing: ['Real Stripe/live banking credentials', 'Approval thresholds by user role', 'Invoice/account persistence'],
    }
  }

  if (moduleKey.includes('automations') || text.includes('rule') || text.includes('trigger')) {
    return {
      kind: 'form',
      title: label,
      summary: 'Creates a draft automation rule. Sensitive actions must require approval unless explicit automation permission is added.',
      submitLabel: 'Save draft rule',
      storageKey: 'atlas.automationRules',
      fields: [
        { name: 'trigger', label: 'Trigger', placeholder: 'Urgent email, overdue invoice, task completed', required: true },
        { name: 'action', label: 'Action', placeholder: 'Create task, draft reply, notify owner', required: true },
        { name: 'approval', label: 'Approval rule', placeholder: 'Always require approval, or threshold/role' },
      ],
      approvalRequired: true,
      missing: ['Automation execution worker', 'Permission policy engine', 'Run history and rollback log'],
    }
  }

  if (moduleKey.includes('connected systems') || text.includes('connect') || text.includes('integration') || text.includes('system')) {
    return {
      kind: 'coming-soon',
      title: label,
      summary: 'This is an integration planning flow, not an active connection. No external system will be connected from this button yet.',
      missing: ['OAuth/API credentials for the selected product', 'Data scope consent screen', 'Background sync and health checks'],
    }
  }

  if (moduleKey.includes('settings') || moduleKey.includes('persona') || moduleKey.includes('private')) {
    return {
      kind: 'form',
      title: label,
      summary: 'Saves a local setup preference while backend persistence is added.',
      submitLabel: 'Save setup',
      storageKey: 'atlas.setup',
      fields: [
        { name: 'name', label: 'Setting', placeholder: 'Preference, private item, or memory rule', required: true },
        { name: 'details', label: 'Details', placeholder: 'What should ATLAS remember or keep private?' },
      ],
      missing: ['Settings persistence API', 'Workspace permission audit', 'AI memory review API'],
    }
  }

  return {
    kind: 'coming-soon',
    title: label,
    summary: 'This action is not wired to a backend yet and is intentionally marked as coming soon.',
    missing: defaultMissing,
  }
}

function readStoredItems(key: string) {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(window.localStorage.getItem(key) || '[]')
  } catch {
    return []
  }
}

export function ActionRunner({ module, label, intent, variant = 'secondary', className, children }: ActionRunnerProps) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState('')
  const [result, setResult] = useState('')
  const spec = useMemo(() => getActionSpec(module, label, intent), [module, label, intent])

  const baseClass = variant === 'primary'
    ? 'rounded-md bg-[#D7B56D] px-4 py-2.5 text-sm font-semibold text-[#070A0F] transition hover:bg-[#E4C67F]'
    : 'rounded-md border border-white/10 px-3 py-2 text-sm text-[#DCE7F1] transition hover:bg-white/[0.05]'

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('Working...')
    setResult('')

    const formData = new FormData(event.currentTarget)
    const payload = Object.fromEntries(formData.entries())

    if (spec.kind === 'form' && spec.storageKey) {
      const items = readStoredItems(spec.storageKey)
      const next = [{ id: `${Date.now()}`, module, action: label, ...payload }, ...items]
      window.localStorage.setItem(spec.storageKey, JSON.stringify(next.slice(0, 25)))
      setStatus('Saved setup locally.')
      setResult('This flow is working in the browser. The missing backend items below are still required before team-wide operation.')
      return
    }

    if (spec.kind === 'api' && spec.api) {
      try {
        const response = await fetch(spec.api.url, {
          method: spec.api.method ?? 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: spec.api.method === 'GET' ? undefined : JSON.stringify({ ...(spec.api.body ?? {}), ...payload }),
        })
        const json = await response.json()
        setStatus(response.ok ? 'API responded.' : 'API returned an error.')
        setResult(JSON.stringify(json, null, 2))
      } catch (error) {
        setStatus('API request failed.')
        setResult(error instanceof Error ? error.message : 'Unknown error')
      }
    }
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className ?? baseClass}>{children ?? label}</button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-white/10 bg-[#0B1118] p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[#D7B56D]">{module}</p>
                <h2 className="mt-2 text-xl font-semibold text-white">{spec.title}</h2>
                <p className="mt-2 text-sm leading-6 text-[#A8B5C3]">{spec.summary}</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="rounded-md border border-white/10 p-2 text-[#A8B5C3] hover:text-white"><X size={16} /></button>
            </div>
            {spec.approvalRequired ? <div className="mt-4 rounded-lg border border-[#D7B56D]/25 bg-[#D7B56D]/10 p-3 text-sm text-[#EAF2F8]">Approval required before execution. ATLAS may prepare drafts, suggestions, or payment intents, but final action stays with an authorised user.</div> : null}
            {spec.kind === 'coming-soon' ? (
              <div className="mt-5 rounded-lg border border-white/10 bg-white/[0.03] p-4"><p className="text-sm font-semibold text-white">Coming soon</p><p className="mt-2 text-sm leading-6 text-[#A8B5C3]">This button is intentionally not pretending to be live.</p></div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                {spec.fields?.map((field) => (
                  <label key={field.name} className="block text-sm text-[#AEBBCC]">{field.label}<input name={field.name} type={field.type ?? 'text'} required={field.required} placeholder={field.placeholder} className="mt-2 w-full rounded-md border border-white/10 bg-[#070A0F] px-3 py-2 text-sm text-white outline-none focus:border-[#D7B56D]/60" /></label>
                ))}
                <button type="submit" className="rounded-md bg-[#D7B56D] px-4 py-2.5 text-sm font-semibold text-[#070A0F] transition hover:bg-[#E4C67F]">{spec.submitLabel ?? 'Continue'}</button>
              </form>
            )}
            {status ? <div className="mt-5 rounded-lg border border-white/10 bg-white/[0.03] p-4"><p className="text-sm font-semibold text-white">{status}</p>{result ? <pre className="mt-3 max-h-56 overflow-auto whitespace-pre-wrap text-xs leading-5 text-[#A8B5C3]">{result}</pre> : null}</div> : null}
            {spec.missing?.length ? <div className="mt-5 rounded-lg border border-white/10 bg-white/[0.03] p-4"><p className="text-sm font-semibold text-white">Still needed for production</p><ul className="mt-3 space-y-2 text-sm text-[#A8B5C3]">{spec.missing.map((item) => <li key={item}>- {item}</li>)}</ul></div> : null}
          </div>
        </div>
      ) : null}
    </>
  )
}
