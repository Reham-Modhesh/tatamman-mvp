import { Hospital, Moon, Smartphone, Sun } from 'lucide-react'
import type { View } from '../types'
import type { Theme } from '../lib/theme'

interface Props {
  view: View
  onChange: (view: View) => void
  theme: Theme
  onToggleTheme: () => void
}

const TABS = [
  { id: 'patient', label: 'تطبيق صحتي - واجهة المريض', short: 'تطبيق صحتي', icon: Smartphone },
  { id: 'provider', label: 'بوابة المستشفى / اعتماد المثقف الصحي', short: 'بوابة المستشفى', icon: Hospital },
] as const

export default function SimulatorBar({ view, onChange, theme, onToggleTheme }: Props) {
  const dark = theme === 'dark'

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-surface/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div>
          <div className="text-lg font-bold leading-tight text-slate-900">تطمّن</div>
          <div className="text-xs text-slate-500">وحدة مدمجة داخل تطبيق صحتي</div>
        </div>

        <div className="flex items-center gap-2">
          <nav role="tablist" aria-label="تبديل العرض" className="flex gap-1 rounded-xl bg-slate-100 p-1">
            {TABS.map((tab) => {
              const active = view === tab.id
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => onChange(tab.id)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition sm:px-4 ${
                    active ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  <tab.icon className="size-4" />
                  <span className="hidden md:inline">{tab.label}</span>
                  <span className="md:hidden">{tab.short}</span>
                </button>
              )
            })}
          </nav>

          <button
            onClick={onToggleTheme}
            aria-label={dark ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الداكن'}
            title={dark ? 'الوضع الفاتح' : 'الوضع الداكن'}
            className="grid size-10 place-items-center rounded-xl text-slate-600 ring-1 ring-slate-200 transition hover:bg-slate-100 hover:text-slate-900"
          >
            {dark ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </button>
        </div>
      </div>
    </header>
  )
}
