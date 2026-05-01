'use client'

interface DashboardPanelsProps {
  workspaceType: 'business' | 'private'
}

export function DashboardPanels({ workspaceType }: DashboardPanelsProps) {
  const summaryItems = workspaceType === 'business'
    ? [
      { label: 'Urgent tasks', value: '3' },
      { label: 'Meetings today', value: '1' },
      { label: 'Overdue invoices', value: '2' },
    ]
    : [
      { label: 'Tasks due', value: '2' },
      { label: 'Personal check-ins', value: '1' },
      { label: 'Focus blocks', value: '3' },
    ]

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-white/10 bg-[#111821]/90 p-5">
        <h3 className="text-sm uppercase tracking-[0.3em] text-[#8FA3B8]">Overview</h3>
        <div className="mt-4 space-y-3 text-sm text-[#B0C9E0]">
          {summaryItems.map((item) => (
            <div key={item.label} className="flex justify-between rounded-2xl bg-[#0D1520]/90 p-3">
              <span>{item.label}</span>
              <span className="font-semibold text-white">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#111821]/90 p-5">
        <h3 className="text-sm uppercase tracking-[0.3em] text-[#8FA3B8]">Status</h3>
        <div className="mt-4 space-y-3 text-sm text-[#B0C9E0]">
          <div className="rounded-2xl bg-[#0D1520]/90 p-3">
            <p>Workspace type: {workspaceType}</p>
          </div>
          <div className="rounded-2xl bg-[#0D1520]/90 p-3">
            <p>Current view: Summary</p>
          </div>
        </div>
      </div>
    </div>
  )
}
