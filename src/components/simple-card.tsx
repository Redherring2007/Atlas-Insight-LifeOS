import type { ReactNode } from 'react'

interface SimpleCardProps {
  title?: string
  eyebrow?: string
  children: ReactNode
  className?: string
}

export function SimpleCard({ title, eyebrow, children, className = '' }: SimpleCardProps) {
  return (
    <section className={`rounded-lg border border-white/10 bg-[#101821]/88 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.22)] ${className}`}>
      {eyebrow ? <p className="mb-2 text-xs uppercase tracking-[0.24em] text-[#D7B56D]">{eyebrow}</p> : null}
      {title ? <h2 className="mb-4 text-base font-semibold text-white">{title}</h2> : null}
      {children}
    </section>
  )
}
