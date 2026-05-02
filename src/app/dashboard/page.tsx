import { AppShell } from '@/components/app-shell'
import { PageHeader } from '@/components/page-header'
import { QuickActionCard } from '@/components/quick-action-card'
import { SimpleCard } from '@/components/simple-card'
import { StatCard } from '@/components/stat-card'
import { Bot, CalendarDays, CircleDollarSign, Lightbulb, Plus, CheckSquare, SunMedium } from 'lucide-react'

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          subtitle="Your life and business command centre."
          action={<button className="inline-flex items-center gap-2 rounded-md bg-[#D7B56D] px-4 py-2.5 text-sm font-semibold text-[#070A0F] transition hover:bg-[#E4C67F]"><Plus size={16} />New Command</button>}
        />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard label="Today" value="4" detail="priorities" icon={SunMedium} />
          <StatCard label="Tasks" value="12" detail="3 due soon" icon={CheckSquare} />
          <StatCard label="Calendar" value="3" detail="meetings" icon={CalendarDays} />
          <StatCard label="Finance" value="2" detail="approvals" icon={CircleDollarSign} />
          <StatCard label="AI Brain" value="5" detail="signals" icon={Bot} />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <SimpleCard title="Today's Priorities">
            <div className="space-y-3">
              {['Review the ABC Corp contract before 2 PM.', 'Send the overdue invoice follow-up.', 'Confirm Sarah has what she needs for client prep.'].map((item) => (
                <div key={item} className="rounded-lg border border-white/8 bg-white/[0.025] p-3 text-sm text-[#DCE7F1]">{item}</div>
              ))}
            </div>
            <button className="mt-4 rounded-md border border-white/10 px-3 py-2 text-sm text-[#DCE7F1] transition hover:bg-white/[0.05]">Open Tasks</button>
          </SimpleCard>

          <SimpleCard title="Critical Alerts">
            <div className="space-y-3">
              {['One invoice is overdue by 5 days.', 'A contract revision needs approval.', 'Tomorrow has one calendar conflict.'].map((item) => (
                <div key={item} className="rounded-lg border border-white/8 bg-white/[0.025] p-3 text-sm text-[#DCE7F1]">{item}</div>
              ))}
            </div>
            <button className="mt-4 rounded-md border border-white/10 px-3 py-2 text-sm text-[#DCE7F1] transition hover:bg-white/[0.05]">Review Alerts</button>
          </SimpleCard>

          <SimpleCard title="Quick Actions">
            <div className="grid gap-3 sm:grid-cols-2">
              <QuickActionCard title="Create task" description="Capture the next action and owner." action="Add task" icon={CheckSquare} />
              <QuickActionCard title="Ask ATLAS" description="Get a short answer or decision draft." action="Ask now" icon={Bot} />
              <QuickActionCard title="Add event" description="Block time before the day fills up." action="Schedule" icon={CalendarDays} />
              <QuickActionCard title="Review payment" description="Approve or hold pending finance actions." action="Review" icon={CircleDollarSign} />
            </div>
          </SimpleCard>

          <SimpleCard title="Learning Signals">
            <div className="space-y-3">
              {['Best focus window today is 10:00 to 12:00.', 'Finance approvals usually wait until late afternoon.', 'Client replies are faster when sent before lunch.'].map((item) => (
                <div key={item} className="rounded-lg border border-white/8 bg-white/[0.025] p-3 text-sm text-[#DCE7F1]">{item}</div>
              ))}
            </div>
            <button className="mt-4 inline-flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 text-sm text-[#DCE7F1] transition hover:bg-white/[0.05]"><Lightbulb size={15} />Use Signal</button>
          </SimpleCard>
        </div>
      </div>
    </AppShell>
  )
}
