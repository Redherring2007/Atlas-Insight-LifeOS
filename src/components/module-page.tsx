import type { LucideIcon } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { PageHeader } from '@/components/page-header'
import { QuickActionCard } from '@/components/quick-action-card'
import { SimpleCard } from '@/components/simple-card'
import { StatCard } from '@/components/stat-card'
import { PrivacyNote } from '@/components/privacy-note'
import { ActionRunner } from '@/components/action-runner'

export interface ModuleSection {
  title: string
  items: string[]
  action?: string
}

export interface ModulePageProps {
  title: string
  subtitle: string
  primaryAction: string
  stats: Array<{ label: string; value: string; detail?: string; icon?: LucideIcon }>
  sections: ModuleSection[]
  quickSetup: Array<{ title: string; description: string; action: string; icon?: LucideIcon }>
  privacy?: boolean
}

export function ModulePage({ title, subtitle, primaryAction, stats, sections, quickSetup, privacy = false }: ModulePageProps) {
  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title={title}
          subtitle={subtitle}
          action={<ActionRunner module={title} label={primaryAction} variant="primary" />}
        />

        {privacy ? <PrivacyNote /> : null}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {sections.map((section) => (
            <SimpleCard key={section.title} title={section.title}>
              <div className="space-y-3">
                {section.items.map((item) => (
                  <div key={item} className="flex items-start justify-between gap-4 rounded-lg border border-white/8 bg-white/[0.025] p-3">
                    <p className="text-sm leading-5 text-[#DCE7F1]">{item}</p>
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D7B56D]" />
                  </div>
                ))}
              </div>
              {section.action ? (
                <ActionRunner module={title} label={section.action} intent={section.title} />
              ) : null}
            </SimpleCard>
          ))}
        </div>

        <SimpleCard title="Start here">
          <div className="grid gap-3 md:grid-cols-3">
            {quickSetup.map((item) => (
              <QuickActionCard key={item.title} module={title} {...item} />
            ))}
          </div>
        </SimpleCard>
      </div>
    </AppShell>
  )
}
