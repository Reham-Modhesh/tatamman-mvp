import { CalendarCheck, ChevronLeft, ClipboardList, Hospital } from 'lucide-react'
import type { DischargeNote, KitState } from '../../types'
import { formatDate } from '../../lib/format'
import StatusBadge from '../shared/StatusBadge'
import SpecialtyIcon, { SPECIALTY_TONES } from '../shared/SpecialtyIcon'
import { SPECIALTY_LABELS } from '../../lib/roles'

interface Props {
  notes: DischargeNote[]
  kits: Record<string, KitState>
  selectedId: string
  onSelect: (id: string) => void
}

export default function CaseList({ notes, kits, selectedId, onSelect }: Props) {
  const pending = notes.filter((n) => kits[n.id].status === 'pending_review').length
  return (
    <aside className="space-y-4">
      <div className="rounded-2xl bg-linear-to-br from-[#0f766e] to-[#134e4a] p-4 text-white shadow-sm">
        <div className="flex items-center gap-2 text-sm text-teal-100">
          <Hospital className="size-4" />
          نظام السجل الصحي الإلكتروني (EHR)
        </div>
        <div className="mt-1 text-lg font-bold">ملخصات الخروج اليوم</div>
        <div className="mt-3 flex gap-3 text-sm">
          <div className="flex-1 rounded-xl bg-white/10 p-2.5">
            <div className="text-2xl font-bold">{notes.length}</div>
            <div className="text-teal-100">حالة خروج</div>
          </div>
          <div className="flex-1 rounded-xl bg-white/10 p-2.5">
            <div className="text-2xl font-bold">{pending}</div>
            <div className="text-teal-100">بانتظار الاعتماد</div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-surface shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3 text-sm font-semibold text-slate-700">
          <ClipboardList className="size-4 text-teal-600" />
          اختر سجل خروج المريض
        </div>
        <p className="px-4 pt-3 text-xs text-slate-500">3 ملخصات من تخصصات مختلفة لإظهار تعامل المحرك مع تقارير متنوعة.</p>
        <ul className="divide-y divide-slate-100">
          {notes.map((note) => {
            const active = note.id === selectedId
            return (
              <li key={note.id}>
                <button
                  onClick={() => onSelect(note.id)}
                  aria-current={active}
                  className={`flex w-full items-start gap-3 px-4 py-3.5 text-start transition ${
                    active ? 'bg-teal-50/70' : 'hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl ring-1 ring-inset ${
                      active ? 'bg-teal-600 text-white ring-teal-600' : SPECIALTY_TONES[note.specialty]
                    }`}
                  >
                    <SpecialtyIcon specialty={note.specialty} className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="font-semibold text-slate-900">{note.patient.nameAr}</div>
                    <div className="text-sm text-slate-600">{note.caseLabelAr}</div>
                    <span className={`inline-block rounded-md px-1.5 py-0.5 text-[11px] font-medium ring-1 ring-inset ${SPECIALTY_TONES[note.specialty]}`}>
                      {SPECIALTY_LABELS[note.specialty]}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <CalendarCheck className="size-3.5" />
                      خروج {formatDate(note.dischargeDate, { day: 'numeric', month: 'short' })} · {note.departmentAr}
                    </div>
                    <StatusBadge status={kits[note.id].status} className="mt-1" />
                  </div>
                  <ChevronLeft className={`mt-3 size-4 shrink-0 ${active ? 'text-teal-600' : 'text-slate-300'}`} />
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </aside>
  )
}
