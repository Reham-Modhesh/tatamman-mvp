import { useState } from 'react'
import { CalendarCheck, CalendarPlus, Clock, MapPin, Pill } from 'lucide-react'
import type { DischargeNote } from '../../types'
import { daysUntil, formatDate, formatTime, relativeDayLabel } from '../../lib/format'
import { Card, IconTile, PrimaryButton, SectionHeader } from './ui'

function toggleIn<T>(set: Set<T>, value: T) {
  const next = new Set(set)
  if (next.has(value)) next.delete(value)
  else next.add(value)
  return next
}

export default function FollowUpMeds({ note }: { note: DischargeNote }) {
  const [calendarAdded, setCalendarAdded] = useState<Set<string>>(new Set())
  const [reminders, setReminders] = useState<Set<string>>(() => new Set(note.medications.map((m) => m.name)))
  const appointments = [...note.followUp].sort((a, b) => a.date.localeCompare(b.date))

  return (
    <div className="space-y-5">
      <section className="space-y-3">
        <SectionHeader title="المواعيد القادمة" />
        {appointments.map((appt) => {
          const key = appt.clinicAr + appt.date
          const added = calendarAdded.has(key)
          return (
            <Card key={key} className="space-y-3">
              <div className="flex gap-3">
                <div className="flex w-14 shrink-0 flex-col items-center justify-center rounded-[10px] bg-sh-tile py-2 text-sh-green-text">
                  <span className="text-[20px] font-bold leading-none">{formatDate(appt.date, { day: 'numeric' })}</span>
                  <span className="mt-1 text-[11px]">{formatDate(appt.date, { month: 'short' })}</span>
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-[15px] font-semibold text-sh-text">{appt.clinicAr}</div>
                    <span className="shrink-0 rounded-full bg-sh-pill px-2 py-0.5 text-[11px] font-medium text-sh-green-text">
                      {relativeDayLabel(daysUntil(appt.date))}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[12px] text-sh-muted">
                    <Clock className="size-3.5" />
                    {formatDate(appt.date, { weekday: 'long' })} · {formatTime(appt.time)}
                  </div>
                  {appt.locationAr && (
                    <div className="flex items-center gap-1 text-[12px] text-sh-muted">
                      <MapPin className="size-3.5" />
                      {appt.locationAr}
                    </div>
                  )}
                </div>
              </div>
              {appt.notesAr && <div className="rounded-sh-btn bg-sh-raised px-3 py-2 text-[13px] text-sh-warn">{appt.notesAr}</div>}
              {added ? (
                <div className="flex items-center justify-center gap-2 rounded-sh-btn border border-sh-line py-3 text-[15px] font-semibold text-sh-green-text">
                  <CalendarCheck className="size-5" />
                  تمت الإضافة للتقويم
                </div>
              ) : (
                <PrimaryButton onClick={() => setCalendarAdded((s) => toggleIn(s, key))}>
                  <CalendarPlus className="size-5" strokeWidth={1.75} />
                  أضف إلى التقويم
                </PrimaryButton>
              )}
            </Card>
          )
        })}
      </section>

      <section className="space-y-3">
        <SectionHeader title="الأدوية والتذكيرات" />
        <div className="divide-y divide-sh-divider rounded-sh-card border border-sh-line bg-sh-card">
          {note.medications.map((med) => {
            const on = reminders.has(med.name)
            return (
              <div key={med.name} className="space-y-2 p-4">
                <div className="flex items-start gap-3">
                  <IconTile icon={Pill} />
                  <div className="min-w-0 flex-1">
                    <div className="text-[15px] font-semibold text-sh-text">
                      {med.nameAr} <span className="text-[13px] font-normal text-sh-subtle">{med.dose}</span>
                    </div>
                    <div className="text-[12px] text-sh-muted">
                      {med.frequencyAr} · لمدة {med.durationDays} يوماً
                    </div>
                  </div>
                  <button
                    role="switch"
                    aria-checked={on}
                    aria-label={`تذكير ${med.nameAr}`}
                    onClick={() => setReminders((s) => toggleIn(s, med.name))}
                    className={`relative mt-1 h-[26px] w-[44px] shrink-0 rounded-full transition ${on ? 'bg-sh-green' : 'bg-sh-segment'}`}
                  >
                    <span className={`absolute top-[3px] size-5 rounded-full bg-white shadow transition-all ${on ? 'start-[21px]' : 'start-[3px]'}`} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 ps-[52px]">
                  {med.times.map((t) => (
                    <span key={t} className={`rounded-full px-2.5 py-0.5 text-[12px] font-medium ${on ? 'bg-sh-tile text-sh-green-text' : 'bg-sh-pill text-sh-subtle'}`}>
                      {formatTime(t)}
                    </span>
                  ))}
                </div>
                {med.instructionsAr && <div className="ps-[52px] text-[12px] text-sh-subtle">{med.instructionsAr}</div>}
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
