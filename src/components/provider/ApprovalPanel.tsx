import { useState } from 'react'
import { ArrowLeft, CalendarDays, CircleCheck, Clock, HeartPulse, Library, ListTodo, Pill, RotateCcw, Send, Smartphone, TriangleAlert } from 'lucide-react'
import type { DischargeNote, KitState, ReviewerRole } from '../../types'
import { REVIEWER_GROUP_LABEL, REVIEWER_ROLE_LABELS } from '../../lib/roles'
import { formatDateTime } from '../../lib/format'
import { STATUS_LABELS } from '../shared/StatusBadge'
import ApprovalModal from './ApprovalModal'

interface Props {
  note: DischargeNote
  kit: KitState
  analysisDone: boolean
  onPublish: (role: ReviewerRole) => void
  onRevoke: () => void
  onOpenPatientView: () => void
}

export default function ApprovalPanel({ note, kit, analysisDone, onPublish, onRevoke, onOpenPatientView }: Props) {
  const [confirming, setConfirming] = useState(false)
  const published = kit.status === 'published'
  const count = kit.selectedContentIds.length
  const canApprove = analysisDone && count > 0 && !published

  const kitItems = [
    { icon: TriangleAlert, label: 'علامات الخطر والطوارئ', value: note.warningSignsAr.length, tone: 'text-rose-600' },
    { icon: ListTodo, label: 'أقسام التعليمات المنزلية', value: note.homeCare.length, tone: 'text-teal-600' },
    { icon: Library, label: 'محتوى تثقيفي معتمد', value: count, tone: 'text-violet-600' },
    { icon: Pill, label: 'أدوية الخروج', value: note.medications.length, tone: 'text-sky-600' },
    { icon: CalendarDays, label: 'مواعيد المتابعة', value: note.followUp.length, tone: 'text-emerald-600' },
  ]

  return (
    <section className="rounded-2xl border border-slate-200 bg-surface shadow-sm lg:sticky lg:top-24">
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="flex items-center gap-2 font-bold text-slate-900">
          <HeartPulse className="size-5 text-teal-600" />
          الاعتماد البشري
        </h2>
        <p className="mt-0.5 text-sm font-medium text-teal-700">المراجِع: {REVIEWER_GROUP_LABEL}</p>
        <p className="mt-0.5 text-sm text-slate-500">لا يصل أي محتوى للمريض قبل الاعتماد البشري</p>
      </div>

      <div className="space-y-5 p-5">
        <ol className="relative space-y-4 border-s-2 border-slate-100 ps-5">
          <li className="relative">
            <span className={`absolute -start-[1.95rem] top-0 grid size-6 place-items-center rounded-full ring-4 ring-surface ${published ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-white'}`}>
              {published ? <CircleCheck className="size-4" /> : <Clock className="size-4" />}
            </span>
            <div className={`text-sm font-semibold ${published ? 'text-slate-400 line-through decoration-slate-300' : 'text-amber-700'}`}>
              {STATUS_LABELS.pending_review}
            </div>
          </li>
          <li className="relative">
            <span className={`absolute -start-[1.95rem] top-0 grid size-6 place-items-center rounded-full ring-4 ring-surface ${published ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
              <Send className="size-3.5" />
            </span>
            <div className={`text-sm font-semibold ${published ? 'text-emerald-700' : 'text-slate-400'}`}>{STATUS_LABELS.published}</div>
            {published && kit.approvedAt && (
              <div className="mt-0.5 text-xs text-slate-500">
                بواسطة {kit.approverRole && `${REVIEWER_ROLE_LABELS[kit.approverRole]}: `}
                {kit.approvedBy} · {formatDateTime(kit.approvedAt)}
              </div>
            )}
          </li>
        </ol>

        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-700">محتويات الحزمة المرسلة لملف المريض</h3>
          <ul className="divide-y divide-slate-100 rounded-xl ring-1 ring-slate-200">
            {kitItems.map(({ icon: Icon, label, value, tone }) => (
              <li key={label} className="flex items-center gap-3 px-3 py-2 text-sm">
                <Icon className={`size-4 ${tone}`} />
                <span className="flex-1 text-slate-600">{label}</span>
                <span className="font-semibold text-slate-900">{value}</span>
              </li>
            ))}
          </ul>
        </div>

        {published ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-800 ring-1 ring-emerald-200">
              <CircleCheck className="size-5 shrink-0" />
              وصلت الحزمة إلى ملف المريض في صحتي مع إشعار فوري.
            </div>
            <button
              onClick={onOpenPatientView}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 font-semibold text-white transition hover:bg-teal-500"
            >
              <Smartphone className="size-5" />
              عرض ما يراه المريض في صحتي
              <ArrowLeft className="size-4" />
            </button>
            <button
              onClick={onRevoke}
              className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm text-slate-500 transition hover:bg-slate-100"
            >
              <RotateCcw className="size-4" />
              سحب النشر (لإعادة العرض التجريبي)
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <button
              onClick={() => setConfirming(true)}
              disabled={!canApprove}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-l from-teal-600 to-emerald-600 px-4 py-3.5 text-base font-bold text-white shadow-sm transition hover:from-teal-700 hover:to-emerald-700 disabled:cursor-not-allowed disabled:from-slate-300 disabled:to-slate-300"
            >
              <Send className="size-5" />
              اعتماد ونشر للتثقيف الصحي
            </button>
            {!analysisDone && <p className="text-center text-xs text-slate-400">بانتظار اكتمال التحليل…</p>}
            {analysisDone && count === 0 && <p className="text-center text-xs text-rose-500">اختر عنصراً تثقيفياً واحداً على الأقل</p>}
          </div>
        )}
      </div>

      {confirming && (
        <ApprovalModal
          note={note}
          contentCount={count}
          onCancel={() => setConfirming(false)}
          onConfirm={(role) => {
            setConfirming(false)
            onPublish(role)
          }}
        />
      )}
    </section>
  )
}
