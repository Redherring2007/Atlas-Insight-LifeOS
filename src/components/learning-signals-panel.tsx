'use client'

import { Activity, CheckCircle2, BarChart3 } from 'lucide-react'

const signals = [
  { id: '1', label: 'Task patterns identified', value: '12' },
  { id: '2', label: 'Communication preferences updated', value: '4' },
  { id: '3', label: 'Decision patterns detected', value: '2' },
]

export function LearningSignalsPanel() {
  return (
    <section className="rounded-3xl border border-white/10 bg-[#121C28]/80 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#00D9FF]">Learning Signals</p>
          <h3 className="mt-2 text-2xl font-semibold text-[#EAF2F8]">Auto-learning AI Brain</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8FA3B8]">Every action feeds the brain: tasks, calendar, finance, approvals, and decisions.</p>
        </div>
        <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#8FA3B8]">
          <Activity className="h-5 w-5 text-[#00D9FF]" />
          <span>Use these learning signals to calibrate the system.</span>
        </div>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {signals.map((signal) => (
          <div key={signal.id} className="rounded-3xl border border-white/10 bg-[#0F1620]/90 p-5">
            <div className="flex items-center gap-3 text-[#4CFF3C]">
              <CheckCircle2 className="h-5 w-5" />
              <p className="text-sm uppercase tracking-[0.3em] text-[#8FA3B8]">Signal</p>
            </div>
            <p className="mt-4 text-3xl font-semibold text-[#EAF2F8]">{signal.value}</p>
            <p className="mt-2 text-sm text-[#8FA3B8]">{signal.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
