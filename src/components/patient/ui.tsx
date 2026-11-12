import type { ComponentProps, ReactNode } from 'react'
import { ChevronLeft, type LucideIcon } from 'lucide-react'

/** Shared building blocks that mirror Sehhaty's inner-page components (dark theme). */

export function SectionHeader({ title, action }: { title: string; action?: string }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-[18px] font-bold text-sh-text">{title}</h2>
      {action && (
        <span className="inline-flex items-center gap-1 text-[15px] font-bold text-sh-green-text underline underline-offset-4">
          {action}
          <ChevronLeft className="size-4" strokeWidth={2.5} />
        </span>
      )}
    </div>
  )
}

export function Card({ className = '', ...props }: ComponentProps<'div'>) {
  return <div className={`rounded-sh-card border border-sh-line bg-sh-card p-4 ${className}`} {...props} />
}

export function IconTile({ icon: Icon, className = '' }: { icon: LucideIcon; className?: string }) {
  return (
    <span className={`grid size-9 shrink-0 place-items-center rounded-sh-tile bg-sh-tile text-sh-green-text ${className}`}>
      <Icon className="size-[22px]" strokeWidth={1.6} />
    </span>
  )
}

export function PrimaryButton({ children, className = '', ...props }: ComponentProps<'button'> & { children: ReactNode }) {
  return (
    <button
      className={`flex w-full items-center justify-center gap-2 rounded-sh-btn bg-sh-green py-3 text-[15px] font-semibold text-white transition active:opacity-80 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string }[]
  value: T
  onChange: (id: T) => void
}) {
  return (
    <div role="tablist" className="grid gap-1 rounded-[12px] bg-sh-pill p-1" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
      {options.map((o) => {
        const active = o.id === value
        return (
          <button
            key={o.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.id)}
            className={`rounded-[10px] px-1 py-2.5 text-[13px] font-bold transition ${
              active ? 'bg-sh-segment-active text-sh-green-text' : 'bg-sh-segment text-sh-segment-text'
            }`}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
