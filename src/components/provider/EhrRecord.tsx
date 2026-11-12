import { FileText, User } from 'lucide-react'
import type { DischargeNote } from '../../types'
import { formatDate } from '../../lib/format'
import { segmentText } from '../../lib/highlight'
import { ENTITY_STYLES } from '../../lib/entityStyles'

interface Props {
  note: DischargeNote
  highlight: boolean
}

export default function EhrRecord({ note, highlight }: Props) {
  const { patient } = note
  const segments = highlight ? segmentText(note.rawNoteEn, note.extractedEntities) : [{ text: note.rawNoteEn }]

  const facts = [
    ['رقم الهوية', patient.nationalIdMasked],
    ['العمر / الجنس', `${patient.age} سنة · ${patient.gender === 'male' ? 'ذكر' : 'أنثى'}`],
    ['رقم الزيارة', note.encounterId],
    ['التنويم', `${formatDate(note.admissionDate, { day: 'numeric', month: 'short' })} ← ${formatDate(note.dischargeDate, { day: 'numeric', month: 'short' })}`],
    ['القسم', note.departmentAr],
    ['الطبيب المعالج', note.attendingDoctor.nameAr],
    ['المثقف الصحي', note.healthEducator.nameAr],
  ]

  return (
    <section className="rounded-2xl border border-slate-200 bg-surface shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-teal-50 text-teal-700">
            <User className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{patient.nameAr}</h2>
            <p className="text-sm text-slate-500">{note.hospitalAr}</p>
          </div>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{note.caseLabelAr}</span>
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 px-5 py-4 text-sm sm:grid-cols-4">
        {facts.map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs text-slate-400">{label}</dt>
            <dd className="font-medium text-slate-800">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="px-5 pb-5">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <FileText className="size-4 text-slate-400" />
            ملخص الخروج الأصلي من السجل الصحي
          </div>
          {highlight && (
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(ENTITY_STYLES).map(([key, s]) => (
                <span key={key} className={`rounded px-1.5 py-0.5 text-[11px] ring-1 ring-inset ${s.chip}`}>
                  {s.label}
                </span>
              ))}
            </div>
          )}
        </div>
        <pre
          dir="ltr"
          className="max-h-72 overflow-auto whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-left font-mono text-[13px] leading-7 text-slate-700 ring-1 ring-inset ring-slate-200"
        >
          {segments.map((seg, i) =>
            seg.entity ? (
              <mark
                key={i}
                title={`${ENTITY_STYLES[seg.entity.type].label}: ${seg.entity.labelAr}`}
                className={`rounded px-0.5 ring-1 ring-inset transition-colors ${ENTITY_STYLES[seg.entity.type].mark}`}
              >
                {seg.text}
              </mark>
            ) : (
              <span key={i}>{seg.text}</span>
            ),
          )}
        </pre>
      </div>
    </section>
  )
}
