export type StatusTone = 'gold' | 'blue' | 'green' | 'amber' | 'red' | 'purple' | 'grey'

const toneClasses: Record<StatusTone, string> = {
  gold: 'border-[#D7B56D]/35 bg-[#D7B56D]/10 text-[#E7CC8A]',
  blue: 'border-[#4DA3FF]/25 bg-[#4DA3FF]/10 text-[#9DCBFF]',
  green: 'border-[#4BAE79]/30 bg-[#4BAE79]/10 text-[#9AD8B5]',
  amber: 'border-[#D99A3D]/30 bg-[#D99A3D]/10 text-[#E7B66D]',
  red: 'border-[#E05D5D]/30 bg-[#E05D5D]/10 text-[#F0A0A0]',
  purple: 'border-[#9B7CFF]/30 bg-[#9B7CFF]/10 text-[#C1B0FF]',
  grey: 'border-white/10 bg-white/[0.045] text-[#A8B5C3]',
}

interface StatusPillProps {
  label: string
  tone?: StatusTone
  className?: string
}

export function StatusPill({ label, tone = 'grey', className = '' }: StatusPillProps) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-1 text-[11px] font-medium leading-none ${toneClasses[tone]} ${className}`}>
      {label}
    </span>
  )
}
