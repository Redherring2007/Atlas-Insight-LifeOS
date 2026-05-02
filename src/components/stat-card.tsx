import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string
  detail?: string
  icon?: LucideIcon
}

export function StatCard({ label, value, detail, icon: Icon }: StatCardProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#101821]/88 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-[#AEBBCC]">{label}</p>
        {Icon ? <Icon size={16} className="text-[#D7B56D]" /> : null}
      </div>
      <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
      {detail ? <p className="mt-1 text-xs text-[#7F8FA1]">{detail}</p> : null}
    </div>
  )
}
