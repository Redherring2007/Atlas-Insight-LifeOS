'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Brain, CalendarDays, CheckSquare, Grid3X3, Home, Settings } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Home', mobileLabel: 'Home', icon: Home },
  { href: '/ask-atlas', label: 'Ask Atlas', mobileLabel: 'Ask', icon: Brain },
  { href: '/command-queue', label: 'Command Queue', mobileLabel: 'Queue', icon: CheckSquare },
  { href: '/calendar', label: 'Calendar', mobileLabel: 'Calendar', icon: CalendarDays },
  { href: '/modules', label: 'Modules', mobileLabel: 'Modules', icon: Grid3X3 },
  { href: '/settings', label: 'Settings', mobileLabel: 'Settings', icon: Settings },
]

export function SideNav() {
  const pathname = usePathname()
  const isActivePath = (href: string) => pathname === href || (href === '/dashboard' && pathname === '/')

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-white/10 bg-[#0F1620]/95 px-5 py-6 md:block">
        <div className="flex h-full flex-col justify-between">
          <div className="space-y-7">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#8FA3B8]">ATLAS LifeOS</p>
              <h2 className="mt-2 text-lg font-semibold text-[#EAF2F8]">Operational Intelligence</h2>
            </div>

            <nav className="space-y-2" aria-label="Primary navigation">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = isActivePath(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? 'bg-[#1B2B38] text-white shadow-[inset_0_0_0_1px_rgba(0,217,255,0.16)]'
                        : 'text-[#B0C9E0] hover:bg-[#16202F] hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs leading-5 text-[#B0C9E0]">
            <p className="font-semibold text-[#EAF2F8]">Complexity beneath.</p>
            <p className="mt-1">Clarity above.</p>
          </div>
        </div>
      </aside>

      <nav className="fixed inset-x-3 bottom-3 z-40 rounded-3xl border border-white/10 bg-[#0F1620]/95 px-2 py-2 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl md:hidden" aria-label="Mobile navigation">
        <div className="grid grid-cols-6 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = isActivePath(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[10px] font-medium transition ${
                  isActive ? 'bg-[#1B2B38] text-white' : 'text-[#B0C9E0]'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="leading-none">{item.mobileLabel}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
