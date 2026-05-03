'use client'

import { useMemo, useState } from 'react'
import { ActionRunner } from '@/components/action-runner'
import { AppShell } from '@/components/app-shell'
import { PageHeader } from '@/components/page-header'
import { SimpleCard } from '@/components/simple-card'
import { StatusPill, type StatusTone } from '@/components/status-pill'
import { Bell, Check, Clock3, Layers3, Sparkles, Zap } from 'lucide-react'

type InboxTag = 'email' | 'task' | 'approval' | 'ai' | 'finance' | 'calendar' | 'deal' | 'message'
type InboxGroup = 'Now' | 'Today' | 'Later'
type InboxPriority = 'urgent' | 'standard' | 'low'

interface InboxItem {
  id: string
  group: InboxGroup
  tag: InboxTag
  title: string
  context: string
  suggestedAction: string
  primaryAction: string
  secondaryAction: string
  priority: InboxPriority
  automation?: string
  state: 'demo' | 'setup required'
}

const tagTone: Record<InboxTag, StatusTone> = {
  email: 'blue',
  task: 'amber',
  approval: 'gold',
  ai: 'blue',
  finance: 'gold',
  calendar: 'purple',
  deal: 'green',
  message: 'grey',
}

const priorityTone: Record<InboxPriority, StatusTone> = {
  urgent: 'red',
  standard: 'gold',
  low: 'grey',
}

const moduleByTag: Record<InboxTag, string> = {
  email: 'Emails',
  task: 'Tasks',
  approval: 'Finance',
  ai: 'AI Brain',
  finance: 'Finance',
  calendar: 'Calendar',
  deal: 'Projects',
  message: 'Teams',
}

const demoItems: InboxItem[] = [
  {
    id: 'email-investor-reply',
    group: 'Now',
    tag: 'email',
    title: 'Investor email needs a reply',
    context: 'Thread is demo/local until email OAuth is connected.',
    suggestedAction: 'Draft a short reply for approval',
    primaryAction: 'Draft reply',
    secondaryAction: 'Review thread',
    priority: 'urgent',
    automation: 'Create follow-up task after draft approval.',
    state: 'setup required',
  },
  {
    id: 'finance-payment-approval',
    group: 'Now',
    tag: 'finance',
    title: 'Payment approval waiting',
    context: 'GBP 5,000 invoice is staged; no money moves without approval.',
    suggestedAction: 'Approve or hold payment intent',
    primaryAction: 'Approve payment',
    secondaryAction: 'Review invoice',
    priority: 'urgent',
    automation: 'Require approval above GBP 2,500.',
    state: 'demo',
  },
  {
    id: 'calendar-conflict',
    group: 'Now',
    tag: 'calendar',
    title: 'Calendar conflict at 3 PM',
    context: 'Private block hides details but protects the time.',
    suggestedAction: 'Schedule a clean focus block',
    primaryAction: 'Schedule',
    secondaryAction: 'Review conflict',
    priority: 'standard',
    automation: 'Offer reschedule when protected time overlaps meetings.',
    state: 'demo',
  },
  {
    id: 'task-contract-review',
    group: 'Today',
    tag: 'task',
    title: 'Contract review due today',
    context: 'Linked to ABC Corp deal and legal notes.',
    suggestedAction: 'Complete the review or assign owner',
    primaryAction: 'Complete',
    secondaryAction: 'Assign owner',
    priority: 'standard',
    state: 'demo',
  },
  {
    id: 'ai-pattern-detected',
    group: 'Today',
    tag: 'ai',
    title: 'ATLAS found a repeat pattern',
    context: 'Late invoices usually become tasks after two reminders.',
    suggestedAction: 'Approve rule creation',
    primaryAction: 'Approve rule',
    secondaryAction: 'Review signal',
    priority: 'standard',
    automation: 'ATLAS has identified this pattern. Approve to create rule.',
    state: 'demo',
  },
  {
    id: 'deal-next-step',
    group: 'Today',
    tag: 'deal',
    title: 'Deal needs movement',
    context: 'Design Studio proposal is waiting on one clear next step.',
    suggestedAction: 'Assign next action to owner',
    primaryAction: 'Assign',
    secondaryAction: 'Review deal',
    priority: 'standard',
    state: 'demo',
  },
  {
    id: 'project-message',
    group: 'Later',
    tag: 'message',
    title: 'Project message needs acknowledgement',
    context: 'Team message is demo/local until messaging backend exists.',
    suggestedAction: 'Review and respond when clear',
    primaryAction: 'Review message',
    secondaryAction: 'Create task',
    priority: 'low',
    state: 'setup required',
  },
  {
    id: 'automation-approval',
    group: 'Later',
    tag: 'approval',
    title: 'Automation awaiting approval',
    context: 'Draft rule will not run until you approve it.',
    suggestedAction: 'Approve only if the permission scope is right',
    primaryAction: 'Approve rule',
    secondaryAction: 'Review rule',
    priority: 'low',
    automation: 'Draft replies for recurring vendor requests.',
    state: 'demo',
  },
]

function isCompletionAction(action: string) {
  return action.toLowerCase().includes('complete')
}

export default function InboxZeroPage() {
  const [items, setItems] = useState(demoItems)
  const [focusMode, setFocusMode] = useState(false)
  const [notice, setNotice] = useState('Demo/local data shown. Live integrations are not implied.')

  const visibleItems = useMemo(() => {
    const filtered = focusMode ? items.filter((item) => item.priority === 'urgent') : items
    return filtered.slice(0, 7)
  }, [focusMode, items])

  const groupedItems = useMemo(() => {
    return (['Now', 'Today', 'Later'] as InboxGroup[]).map((group) => ({
      group,
      items: visibleItems.filter((item) => item.group === group),
    }))
  }, [visibleItems])

  const completeItem = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id))
    setNotice('Item completed and removed from Inbox Zero.')
  }

  const snoozeItem = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id))
    setNotice('Item snoozed in demo mode. Backend snooze persistence is still needed.')
  }

  const dismissItem = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id))
    setNotice('Item dismissed from this local view.')
  }

  const clearCompleted = () => {
    setNotice('Completed items are already removed instantly in this demo flow.')
  }

  const snoozeLowPriority = () => {
    setItems((current) => current.filter((item) => item.priority !== 'low'))
    setNotice('Low priority items snoozed from this local view.')
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title="Inbox Zero"
          subtitle="Clear what needs your attention across life and business"
          action={<ActionRunner module="AI Brain" label="Ask Atlas" intent="Inbox Zero command" variant="primary" />}
        />

        <section className="rounded-lg border border-[#D7B56D]/25 bg-[#101821]/[0.92] p-4 shadow-[0_0_55px_rgba(215,181,109,0.10)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-[#D7B56D]/25 bg-[#D7B56D]/10 text-[#E7CC8A]">
                <Sparkles size={17} />
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xs uppercase tracking-[0.22em] text-[#D7B56D]">ATLAS recommends this action</p>
                  <StatusPill label="Primary decision queue" tone="blue" />
                </div>
                <h2 className="mt-2 text-base font-semibold text-white">Start with the urgent email and payment approval.</h2>
                <p className="mt-1 text-sm leading-6 text-[#8FA3B8]">Grouped by Now, Today, and Later so the next decision is obvious.</p>
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-3 lg:w-auto">
              <button type="button" onClick={clearCompleted} className="inline-flex items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.035] px-3 py-2 text-sm text-[#DCE7F1] transition hover:bg-white/[0.06]"><Check size={14} />Clear completed</button>
              <button type="button" onClick={() => setFocusMode((current) => !current)} className={`inline-flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm transition ${focusMode ? 'border-[#D7B56D]/35 bg-[#D7B56D]/[0.12] text-[#E7CC8A]' : 'border-white/10 bg-white/[0.035] text-[#DCE7F1] hover:bg-white/[0.06]'}`}><Zap size={14} />Focus mode</button>
              <button type="button" onClick={snoozeLowPriority} className="inline-flex items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.035] px-3 py-2 text-sm text-[#DCE7F1] transition hover:bg-white/[0.06]"><Clock3 size={14} />Snooze low</button>
            </div>
          </div>
          <p className="mt-4 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-[#A8B5C3]">{notice}</p>
        </section>

        <div className="grid gap-3 sm:grid-cols-3">
          <SimpleCard className="p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-[#A8B5C3]">Attention items</span>
              <StatusPill label={String(items.length)} tone="gold" />
            </div>
          </SimpleCard>
          <SimpleCard className="p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-[#A8B5C3]">Urgent now</span>
              <StatusPill label={String(items.filter((item) => item.priority === 'urgent').length)} tone="red" />
            </div>
          </SimpleCard>
          <SimpleCard className="p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-[#A8B5C3]">Automation ideas</span>
              <StatusPill label={String(items.filter((item) => item.automation).length)} tone="blue" />
            </div>
          </SimpleCard>
        </div>

        <div className="space-y-5">
          {groupedItems.map(({ group, items: groupItems }) => (
            <SimpleCard key={group} title={group} eyebrow={group === 'Now' ? 'Decision first' : undefined}>
              {groupItems.length ? (
                <div className="space-y-3">
                  {groupItems.map((item) => {
                    const moduleName = moduleByTag[item.tag]
                    return (
                      <article key={item.id} className="rounded-lg border border-white/10 bg-white/[0.025] p-4 transition hover:border-white/15 hover:bg-white/[0.04]">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <StatusPill label={item.tag} tone={tagTone[item.tag]} />
                              <StatusPill label={item.priority} tone={priorityTone[item.priority]} />
                              <StatusPill label={item.state} tone={item.state === 'demo' ? 'grey' : 'amber'} />
                            </div>
                            <h3 className="mt-3 text-base font-semibold text-white">{item.title}</h3>
                            <p className="mt-1 text-sm leading-6 text-[#8FA3B8]">{item.context}</p>
                            <div className="mt-3 rounded-md border border-[#4DA3FF]/20 bg-[#4DA3FF]/[0.08] px-3 py-2 text-sm text-[#B8D7FF]">
                              ATLAS recommends this action: {item.suggestedAction}
                            </div>
                            {item.automation ? (
                              <div className="mt-2 flex items-start gap-2 text-sm text-[#A8B5C3]">
                                <Layers3 size={14} className="mt-1 shrink-0 text-[#D7B56D]" />
                                <span>{item.automation}</span>
                              </div>
                            ) : null}
                          </div>
                          <div className="flex shrink-0 flex-wrap gap-2 lg:max-w-[280px] lg:justify-end">
                            {isCompletionAction(item.primaryAction) ? (
                              <button type="button" onClick={() => completeItem(item.id)} className="rounded-md bg-[#D7B56D] px-3 py-2 text-sm font-semibold text-[#070A0F] transition hover:bg-[#E4C67F]">
                                {item.primaryAction}
                              </button>
                            ) : (
                              <ActionRunner module={moduleName} label={item.primaryAction} intent={item.title} variant="primary" />
                            )}
                            <ActionRunner module={moduleName} label={item.secondaryAction} intent={item.title} />
                            <button type="button" onClick={() => snoozeItem(item.id)} className="rounded-md border border-white/10 px-3 py-2 text-sm text-[#DCE7F1] transition hover:bg-white/[0.05]">
                              Snooze
                            </button>
                            <button type="button" onClick={() => dismissItem(item.id)} className="rounded-md border border-white/10 px-3 py-2 text-sm text-[#A8B5C3] transition hover:bg-white/[0.05]">
                              Dismiss
                            </button>
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>
              ) : (
                <div className="rounded-lg border border-white/10 bg-white/[0.025] p-4 text-sm text-[#8FA3B8]">
                  Nothing waiting here.
                </div>
              )}
            </SimpleCard>
          ))}
        </div>

        <div className="fixed bottom-5 right-5 z-30 hidden md:block">
          <ActionRunner module="AI Brain" label="Ask Atlas" intent="Inbox Zero floating command" className="inline-flex items-center gap-2 rounded-full border border-[#D7B56D]/30 bg-[#D7B56D]/[0.12] px-4 py-3 text-sm font-semibold text-[#E7CC8A] shadow-[0_0_38px_rgba(215,181,109,0.18)] transition hover:border-[#D7B56D]/45 hover:bg-[#D7B56D]/[0.18]">
            <Bell size={15} />Ask Atlas
          </ActionRunner>
        </div>

        <section className="rounded-lg border border-white/10 bg-white/[0.025] p-4 text-sm leading-6 text-[#8FA3B8]">
          Inbox Zero currently uses safe demo/local data from emails, tasks, finance approvals, calendar conflicts, deals, messages, AI suggestions, and automations. Live integrations must be connected before ATLAS reads external systems.
        </section>
      </div>
    </AppShell>
  )
}
