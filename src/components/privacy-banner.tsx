import { ShieldCheck } from 'lucide-react'

export function PrivacyBanner() {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#0F1620]/90 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.18)] backdrop-blur-xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3 text-[#00D9FF]">
          <ShieldCheck className="h-6 w-6" />
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-[#8FA3B8]">Privacy</p>
            <p className="text-lg font-semibold text-[#EAF2F8]">Your personal layer is private.</p>
          </div>
        </div>
        <p className="max-w-2xl text-sm leading-6 text-[#8FA3B8]">Your employer cannot see personal finances, private calendar, personal AI questions, or private decisions. Personal context is only visible to you.</p>
      </div>
    </div>
  )
}
