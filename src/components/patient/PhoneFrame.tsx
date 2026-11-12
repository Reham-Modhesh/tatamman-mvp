import type { ReactNode } from 'react'
import { BellOff, Signal, Wifi, Zap } from 'lucide-react'

/**
 * Smartphone mockup with standard 393×852 (19.5:9) proportions and a dynamic-island notch,
 * styled after Sehhaty's dark inner pages. Scales down to fit shorter screens.
 */
export default function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto max-w-full" style={{ width: 'clamp(320px, calc((100dvh - 8.5rem) * 393 / 852), 393px)' }}>
      {/* Hardware buttons */}
      <span aria-hidden className="absolute -left-[3px] top-[16%] h-8 w-[3px] rounded-l bg-[#475569]" />
      <span aria-hidden className="absolute -left-[3px] top-[23%] h-14 w-[3px] rounded-l bg-[#475569]" />
      <span aria-hidden className="absolute -left-[3px] top-[31%] h-14 w-[3px] rounded-l bg-[#475569]" />
      <span aria-hidden className="absolute -right-[3px] top-[26%] h-20 w-[3px] rounded-r bg-[#475569]" />

      <div className="rounded-[3.4rem] bg-black p-[10px] shadow-2xl shadow-black/30 ring-1 ring-[#475569]">
        <div className="relative flex flex-col overflow-hidden rounded-[2.8rem] bg-sh-bg" style={{ aspectRatio: '393 / 852' }}>
          {/* Status bar (always LTR like the OS) */}
          <div dir="ltr" className="relative flex h-[52px] shrink-0 items-center justify-between bg-sh-bg px-8 pt-2 text-[16px] font-semibold text-sh-text">
            <span className="flex items-center gap-1">
              10:18
              <BellOff className="size-4" strokeWidth={2.5} />
            </span>
            <span aria-hidden className="absolute left-1/2 top-2.5 h-[30px] w-[112px] -translate-x-1/2 rounded-full bg-black" />
            <span className="flex items-center gap-1.5">
              <Signal className="size-4" strokeWidth={2.5} />
              <Wifi className="size-4" strokeWidth={2.5} />
              <span aria-label="البطارية تشحن" className="flex items-center gap-px">
                <span className="grid h-[13px] w-[26px] place-items-center rounded-[4px] bg-[#5ac26f]">
                  <Zap className="size-[10px] fill-black text-black" strokeWidth={1} />
                </span>
                <span className="h-[5px] w-[2px] rounded-r-sm bg-sh-text/40" />
              </span>
            </span>
          </div>
          <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        </div>
      </div>
    </div>
  )
}
