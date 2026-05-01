'use client'

import Link from 'next/link'

interface ModuleCardProps {
  title: string
  description: string
  href: string
}

export function ModuleCard({ title, description, href }: ModuleCardProps) {
  return (
    <Link href={href} className="block rounded-3xl border border-white/10 bg-[#111821]/90 p-4 transition hover:border-white/20 hover:bg-[#16202F]">
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#B0C9E0]">{description}</p>
    </Link>
  )
}
