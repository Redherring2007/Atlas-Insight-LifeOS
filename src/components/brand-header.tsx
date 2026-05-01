interface BrandHeaderProps {
  userName: string
  workspaceLabel?: string
}

export function BrandHeader({ userName, workspaceLabel = 'Private command centre' }: BrandHeaderProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#111821]/90 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#8FA3B8]">ATLAS Life OS</p>
          <h1 className="mt-2 text-2xl font-semibold text-white">Welcome back, {userName}</h1>
        </div>
        <p className="text-xs text-[#8FA3B8]">{workspaceLabel}</p>
      </div>
    </div>
  )
}
