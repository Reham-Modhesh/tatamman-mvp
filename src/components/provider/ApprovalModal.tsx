import { useState } from 'react'
import { Fingerprint, LoaderCircle, ShieldCheck, X } from 'lucide-react'
import type { DischargeNote, ReviewerRole } from '../../types'
import { REVIEWER_GROUP_LABEL, REVIEWER_ROLE_LABELS, reviewerFor } from '../../lib/roles'

const DEMO_OTP = '1234'

interface Props {
  note: DischargeNote
  contentCount: number
  onCancel: () => void
  onConfirm: (role: ReviewerRole) => void
}

export default function ApprovalModal({ note, contentCount, onCancel, onConfirm }: Props) {
  const [attested, setAttested] = useState(false)
  const [otp, setOtp] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [role, setRole] = useState<ReviewerRole>('health_educator')
  const reviewer = reviewerFor(note, role)
  const canSubmit = attested && otp === DEMO_OTP && !submitting

  const submit = () => {
    setSubmitting(true)
    window.setTimeout(() => onConfirm(role), 900)
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="approve-title">
      <div className="w-full max-w-md rounded-2xl bg-surface shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 id="approve-title" className="flex items-center gap-2 font-bold text-slate-900">
            <ShieldCheck className="size-5 text-teal-600" />
            توثيق {REVIEWER_GROUP_LABEL}
          </h2>
          <button onClick={onCancel} disabled={submitting} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600" aria-label="إغلاق">
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <fieldset>
            <legend className="mb-1.5 text-sm font-medium text-slate-700">صفة المراجِع</legend>
            <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
              {(Object.keys(REVIEWER_ROLE_LABELS) as ReviewerRole[]).map((r) => (
                <label
                  key={r}
                  className={`cursor-pointer rounded-lg py-2 text-center text-sm font-semibold transition ${
                    role === r ? 'bg-surface text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <input type="radio" name="reviewer-role" value={r} checked={role === r} onChange={() => setRole(r)} disabled={submitting} className="sr-only" />
                  {REVIEWER_ROLE_LABELS[r]}
                  {r === 'health_educator' && <span className="ms-1 text-[11px] font-normal text-slate-400">(افتراضي)</span>}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <div className="grid size-11 place-items-center rounded-full bg-teal-600 text-white">
              <Fingerprint className="size-6" />
            </div>
            <div className="text-sm">
              <div className="font-semibold text-slate-900">{reviewer.nameAr}</div>
              <div className="text-slate-500">
                {REVIEWER_ROLE_LABELS[role]} · {reviewer.specialtyAr}
              </div>
              <div dir="ltr" className="text-end font-mono text-xs text-slate-400">{reviewer.licenseNo}</div>
            </div>
          </div>

          <p className="text-sm text-slate-600">
            سيتم نشر خطة الرعاية و<strong>{contentCount}</strong> عناصر تثقيفية معتمدة إلى حساب{' '}
            <strong>{note.patient.nameAr}</strong> في تطبيق صحتي.
          </p>

          <label className="flex cursor-pointer items-start gap-3 rounded-xl p-3 ring-1 ring-slate-200 hover:bg-slate-50">
            <input type="checkbox" checked={attested} onChange={(e) => setAttested(e.target.checked)} className="mt-1 size-4 accent-teal-600" />
            <span className="text-sm text-slate-700">
              أقر بأنني راجعت ملخص الخروج والمحتوى المطابق، وأنه مناسب لحالة المريض وتعليمات الخروج.
            </span>
          </label>

          <div>
            <label htmlFor="otp" className="mb-1.5 block text-sm font-medium text-slate-700">
              رمز التحقق المرسل إلى جوالك المسجل
            </label>
            <input
              id="otp"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={4}
              dir="ltr"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="••••"
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-center font-mono text-xl tracking-[0.6em] outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
            />
            <p className="mt-1.5 text-xs text-slate-400">للعرض التجريبي استخدم الرمز {DEMO_OTP}</p>
          </div>
        </div>

        <div className="flex gap-2 border-t border-slate-100 px-5 py-4">
          <button
            onClick={submit}
            disabled={!canSubmit}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 font-semibold text-white transition hover:bg-teal-500 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {submitting ? <LoaderCircle className="size-5 animate-spin" /> : <ShieldCheck className="size-5" />}
            {submitting ? 'جارٍ النشر إلى صحتي…' : 'تأكيد الاعتماد والنشر'}
          </button>
          <button onClick={onCancel} disabled={submitting} className="rounded-xl px-4 py-2.5 font-medium text-slate-600 hover:bg-slate-100">
            إلغاء
          </button>
        </div>
      </div>
    </div>
  )
}
