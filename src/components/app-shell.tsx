'use client'

import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, type ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import {
  Bot,
  CalendarDays,
  CircleDollarSign,
  Contact,
  FileSignature,
  Home,
  Lock,
  Mail,
  Network,
  Settings,
  Shield,
  Sparkles,
  CheckSquare,
  Users,
  Workflow,
  Inbox,
} from 'lucide-react'

type NavItem = {
  href: string
  label: string
  icon: LucideIcon
  aliases?: string[]
  tier?: 'primary'
}

const navItems: NavItem[] = [
  { href: '/inbox', label: 'Inbox Zero', icon: Inbox, tier: 'primary' },
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/ai-brain', label: 'AI Brain', icon: Sparkles, aliases: ['/brain'] },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/calendar', label: 'Calendar', icon: CalendarDays },
  { href: '/contacts', label: 'Contacts', icon: Contact },
  { href: '/finance', label: 'Finance', icon: CircleDollarSign },
  { href: '/projects', label: 'Deals & Contracts', icon: FileSignature },
  { href: '/emails', label: 'Emails', icon: Mail },
  { href: '/teams', label: 'Teams', icon: Users, aliases: ['/team'] },
  { href: '/automations', label: 'Automations', icon: Workflow },
  { href: '/connected-systems', label: 'Connected Systems', icon: Network },
  { href: '/private', label: 'Private', icon: Lock },
  { href: '/settings', label: 'Settings', icon: Settings },
]

function isActive(pathname: string, href: string, aliases: string[] = []) {
  return pathname === href || pathname.startsWith(`${href}/`) || aliases.includes(pathname)
}

export function AppShell({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [router, status])

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070A0F] text-sm text-[#B8C7D6]">
        Loading ATLAS...
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#070A0F] text-[#EAF2F8]">
      <div className="mx-auto flex min-h-screen w-full">
        <aside className="hidden h-screen w-64 shrink-0 border-r border-white/10 bg-[#0B1118]/95 px-3 py-4 md:sticky md:top-0 md:block">
          <Link href="/dashboard" className="mb-5 flex items-center gap-3 rounded-lg px-3 py-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-[#D7B56D]">
              <Shield size={17} />
            </span>
            <span>
              <span className="block text-sm font-semibold text-white">ATLAS</span>
              <span className="block text-xs text-[#7F8FA1]">LifeOS</span>
            </span>
          </Link>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(pathname, item.href, item.aliases)
              const primary = item.tier === 'primary'

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                    primary && active
                      ? 'border border-[#D7B56D]/35 bg-[#D7B56D]/[0.12] text-white shadow-[0_0_28px_rgba(215,181,109,0.16)]'
                      : primary
                        ? 'border border-[#D7B56D]/15 bg-[#D7B56D]/[0.07] text-[#E7CC8A] hover:border-[#D7B56D]/25 hover:bg-[#D7B56D]/10'
                        : active
                          ? 'border border-white/10 bg-white/[0.07] text-white'
                          : 'text-[#A8B5C3] hover:bg-white/[0.04] hover:text-white'
                  }`}
                >
                  <Icon size={16} className={active || primary ? 'text-[#D7B56D]' : 'text-[#718195]'} />
                  <span className="truncate">{item.label}</span>
                  {primary ? (
                    <span className={`ml-auto rounded-full border px-1.5 py-0.5 text-[10px] font-semibold ${active ? 'border-[#D7B56D]/35 bg-[#D7B56D]/15 text-[#F1DDA4]' : 'border-white/10 bg-white/[0.04] text-[#9AA8B7]'}`}>
                      7
                    </span>
                  ) : null}
                </Link>
              )
            })}
          </nav>

          <div className="absolute bottom-4 left-3 right-3 rounded-lg border border-white/10 bg-white/[0.03] p-3">
            <div className="flex items-center gap-2 text-xs font-medium text-white">
              <Bot size={14} className="text-[#D7B56D]" />
              AI Assistant included
            </div>
            <p className="mt-1 text-xs leading-5 text-[#7F8FA1]">Context follows workspace permissions.</p>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-white/10 bg-[#070A0F]/90 px-4 py-3 backdrop-blur md:hidden">
            <div className="flex items-center justify-between">
              <Link href="/dashboard" className="text-sm font-semibold text-white">ATLAS LifeOS</Link>
              <select
                value={navItems.find((item) => isActive(pathname, item.href, item.aliases))?.href ?? '/inbox'}
                onChange={(event) => router.push(event.target.value)}
                className="max-w-[190px] rounded-lg border border-white/10 bg-[#101821] px-3 py-2 text-sm text-white outline-none"
              >
                {navItems.map((item) => (
                  <option key={item.href} value={item.href}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </header>

          <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
