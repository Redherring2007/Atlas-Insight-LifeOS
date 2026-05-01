'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/ai-brain', label: 'AI Brain' },
  { href: '/persona', label: 'Persona' },
  { href: '/tasks', label: 'Tasks' },
  { href: '/calendar', label: 'Calendar' },
  { href: '/finance', label: 'Finance' },
  { href: '/teams', label: 'Teams' },
  { href: '/automations', label: 'Automations' },
  { href: '/connected-systems', label: 'Connected Systems' },
  { href: '/settings', label: 'Settings' },
]

export function SideNav() {
  const pathname = usePathname()

  return (
    <aside className="sticky top-0 h-screen w-64 shrink-0 border-r border-white/10 bg-[#0F1620]/95 px-5 py-6">
      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#8FA3B8]">Menu</p>
          <h2 className="mt-2 text-lg font-semibold text-[#EAF2F8]">ATLAS</h2>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-2xl px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-[#1B2B38] text-white' : 'text-[#B0C9E0] hover:bg-[#16202F] hover:text-white'}`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
