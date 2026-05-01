'use client'

import { Plug, Shield, Globe2, TrendingUp } from 'lucide-react'

interface ConnectedSystemCardProps {
  title: string
  status: 'connected' | 'available' | 'disabled'
  description: string
  category: string
}

export function ConnectedSystemCard({ title, description, category, status }: ConnectedSystemCardProps) {
  const statusColor = status === 'connected' ? 'text-[#4CFF3C]' : status === 'available' ? 'text-[#FFC857]' : 'text-[#8FA3B8]'
  const Icon = title.includes('Insight') ? Shield : title.includes('Trading') ? TrendingUp : title.includes('Sargassum') ? Globe2 : Plug

  return (
    <div className="rounded-3xl border border-white/10 bg-[#0F1620]/90 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.15)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/5 text-[#00AFFF]">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#EAF2F8]">{title}</p>
            <p className="mt-1 text-xs text-[#8FA3B8]">{category}</p>
          </div>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] ${statusColor}`}>{status}</span>
      </div>
      <p className="mt-4 text-sm leading-6 text-[#8FA3B8]">{description}</p>
    </div>
  )
}
