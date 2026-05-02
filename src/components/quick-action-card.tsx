import type { LucideIcon } from 'lucide-react'
import { ActionRunner } from '@/components/action-runner'

interface QuickActionCardProps {
  title: string
  description: string
  action: string
  icon?: LucideIcon
  module?: string
}

export function QuickActionCard({ title, description, action, icon: Icon, module = 'Setup' }: QuickActionCardProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#101821]/88 p-4">
      <div className="flex items-start gap-3">
        {Icon ? (
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-[#D7B56D]">
            <Icon size={15} />
          </span>
        ) : null}
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          <p className="mt-1 text-sm leading-5 text-[#8FA3B8]">{description}</p>
          <ActionRunner module={module} label={action} intent={title} variant="primary" />
        </div>
      </div>
    </div>
  )
}
