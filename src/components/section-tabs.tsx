'use client'

interface SectionTabsProps<T extends string> {
  tabs: Array<{ id: T; label: string }>
  activeTab: T
  onChange: (tab: T) => void
}

export function SectionTabs<T extends string>({ tabs, activeTab, onChange }: SectionTabsProps<T>) {
  return (
    <div className="flex gap-1 overflow-x-auto rounded-lg border border-white/10 bg-white/[0.03] p-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`whitespace-nowrap rounded-md px-3 py-2 text-sm transition ${
            activeTab === tab.id ? 'bg-white/[0.09] text-white' : 'text-[#A8B5C3] hover:bg-white/[0.04] hover:text-white'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
