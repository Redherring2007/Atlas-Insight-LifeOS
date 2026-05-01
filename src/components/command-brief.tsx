export function CommandBrief() {
  return (
    <section className="rounded-3xl border border-white/10 bg-[#111821]/90 p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-white">Today</h3>
        <span className="text-sm text-[#8FA3B8]">4 items</span>
      </div>
      <div className="mt-4 space-y-3 text-sm text-[#B0C9E0]">
        <div className="flex justify-between rounded-2xl bg-[#0D1520]/90 p-3">
          <span>Review contract</span>
          <span className="text-[#8FA3B8]">Today</span>
        </div>
        <div className="flex justify-between rounded-2xl bg-[#0D1520]/90 p-3">
          <span>Check finance overview</span>
          <span className="text-[#8FA3B8]">This afternoon</span>
        </div>
        <div className="flex justify-between rounded-2xl bg-[#0D1520]/90 p-3">
          <span>Confirm team update</span>
          <span className="text-[#8FA3B8]">Before end of day</span>
        </div>
      </div>
    </section>
  )
}
