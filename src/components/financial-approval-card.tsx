'use client'

import { CheckCircle2, XCircle } from 'lucide-react'

export function FinancialApprovalCard() {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#121C28]/80 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#00D9FF]">Approval required</p>
          <h3 className="mt-2 text-2xl font-semibold text-[#EAF2F8]">AED 12,000 transfer</h3>
          <p className="mt-2 text-sm leading-6 text-[#8FA3B8]">Requested by: Team Member. Financial actions can be viewed, suggested, or executed only when approved.</p>
        </div>
        <div className="rounded-3xl bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-[#4CFF3C]">Pending approval</div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-3xl bg-[#0F1620]/90 p-4">
          <p className="text-sm text-[#8FA3B8]">Status</p>
          <p className="mt-2 text-lg font-semibold text-[#EAF2F8]">Requires approval</p>
        </div>
        <div className="rounded-3xl bg-[#0F1620]/90 p-4">
          <p className="text-sm text-[#8FA3B8]">Approval rule</p>
          <p className="mt-2 text-lg font-semibold text-[#EAF2F8]">Must be approved by finance lead</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button className="inline-flex items-center gap-2 rounded-full bg-[#00AFFF] px-5 py-3 text-sm font-semibold text-[#070B10] transition hover:bg-[#00D9FF]">
          <CheckCircle2 className="h-4 w-4" /> Approve
        </button>
        <button className="inline-flex items-center gap-2 rounded-full border border-[#4CFF3C]/20 bg-white/5 px-5 py-3 text-sm font-semibold text-[#EAF2F8] transition hover:border-[#FF3B3B] hover:text-[#FF3B3B]">
          <XCircle className="h-4 w-4" /> Reject
        </button>
      </div>
    </div>
  )
}
