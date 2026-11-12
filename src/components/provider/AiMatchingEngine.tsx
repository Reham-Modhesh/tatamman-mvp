import { BrainCircuit, Circle, CircleCheck, LoaderCircle, RotateCcw, ShieldCheck } from 'lucide-react'
import type { DischargeNote } from '../../types'
import type { ContentMatch } from '../../lib/matching'
import { CONTENT_TYPE_LABELS, ENTITY_STYLES } from '../../lib/entityStyles'
import ContentTypeIcon from '../shared/ContentTypeIcon'
import SourceBadge from '../shared/SourceBadge'

export const ANALYSIS_STEPS = [
  'قراءة ملخص الخروج من السجل الصحي الإلكتروني',
  'استخراج التشخيص والإجراءات والأدوية (ترميز ICD-10 / CPT)',
  'مطابقة الرموز مع مكتبة المحتوى المعتمد من وزارة الصحة',
  'تجهيز الحزمة التثقيفية لمراجعة الطبيب',
]
export const ANALYSIS_DONE = ANALYSIS_STEPS.length

interface Props {
  note: DischargeNote
  stage: number
  matches: ContentMatch[]
  librarySize: number
  selectedIds: string[]
  locked: boolean
  onToggle: (contentId: string) => void
  onRerun: () => void
}

export default function AiMatchingEngine({ note, stage, matches, librarySize, selectedIds, locked, onToggle, onRerun }: Props) {
  const running = stage < ANALYSIS_DONE

  return (
    <section className="rounded-2xl border border-violet-200 bg-surface shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-violet-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-violet-100 text-violet-700">
            <BrainCircuit className="size-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">محرك المطابقة الذكي</h2>
            <p className="text-sm text-slate-500">استخراج ومطابقة فقط · بدون توليد نصوص</p>
          </div>
        </div>
        <button
          onClick={onRerun}
          disabled={running || locked}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-violet-700 ring-1 ring-violet-200 transition hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RotateCcw className="size-4" />
          إعادة التحليل
        </button>
      </div>

      <div className="space-y-5 p-5">
        <div className="flex gap-3 rounded-xl bg-violet-50 p-3 text-sm text-violet-900">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-violet-600" />
          <div className="space-y-1">
            <p className="font-semibold">
              الذكاء الاصطناعي يقوم بتحليل نص تقرير الخروج واستخلاص التشخيص (ICD-10) لربطه بمحتوى معتمد مسبقاً دون توليد نصوص جديدة.
            </p>
            <p className="text-violet-800/80">
              مصدر المحتوى: منصة التوعية الصحية - وزارة الصحة السعودية. أي عنصر بلا رابط مصدر رسمي موثّق يُستبعد تلقائياً ولا يمكن نشره.
            </p>
          </div>
        </div>

        <ol className="space-y-2.5">
          {ANALYSIS_STEPS.map((label, i) => {
            const state = i < stage ? 'done' : i === stage ? 'active' : 'pending'
            return (
              <li key={label} className="flex items-center gap-3 text-sm">
                {state === 'done' && <CircleCheck className="size-5 text-emerald-500" />}
                {state === 'active' && <LoaderCircle className="size-5 animate-spin text-violet-500" />}
                {state === 'pending' && <Circle className="size-5 text-slate-300" />}
                <span className={state === 'pending' ? 'text-slate-400' : 'text-slate-700'}>{label}</span>
              </li>
            )
          })}
        </ol>

        {stage >= 2 && (
          <div className="animate-[fadeIn_.4s_ease]">
            <h3 className="mb-2 text-sm font-semibold text-slate-700">الكيانات المستخرجة من الملخص</h3>
            <div className="flex flex-wrap gap-2">
              {note.extractedEntities.map((e) => (
                <span
                  key={e.evidence}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs ring-1 ring-inset ${ENTITY_STYLES[e.type].chip}`}
                >
                  <span className="font-semibold">{ENTITY_STYLES[e.type].label}:</span>
                  {e.labelAr}
                  {e.code && (
                    <span dir="ltr" className="rounded bg-surface/70 px-1 font-mono text-[11px]">
                      {e.code}
                    </span>
                  )}
                  {e.code === note.diagnosis.code && note.diagnosis.category && (
                    <span dir="ltr" className="rounded bg-surface/70 px-1 font-mono text-[11px]" title={note.diagnosis.categoryDescriptionEn}>
                      ICD-10 {note.diagnosis.category}
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        )}

        {stage >= 3 && (
          <div className="animate-[fadeIn_.4s_ease]">
            <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-sm font-semibold text-slate-700">المحتوى المعتمد المطابق</h3>
              <span className="text-xs text-slate-500">
                تطابق {matches.length} من أصل {librarySize} عنصراً · {matches.filter((m) => m.verified).length} بمصدر رسمي موثّق
              </span>
            </div>
            <ul className="space-y-2">
              {matches.map(({ content, matchedCodes, verified }) => {
                const checked = verified && selectedIds.includes(content.id)
                const disabled = locked || !verified
                return (
                  <li key={content.id}>
                    <label
                      className={`flex cursor-pointer items-start gap-3 rounded-xl p-3 ring-1 ring-inset transition ${
                        checked ? 'bg-teal-50/60 ring-teal-200' : verified ? 'bg-slate-50 ring-slate-200 opacity-70' : 'bg-amber-50/40 ring-amber-200'
                      } ${disabled ? 'cursor-default' : 'hover:ring-teal-300'}`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={disabled}
                        onChange={() => onToggle(content.id)}
                        className="mt-1 size-4 accent-teal-600"
                      />
                      <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-surface text-teal-700 ring-1 ring-slate-200">
                        <ContentTypeIcon type={content.type} className="size-4.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className={`font-medium ${verified ? 'text-slate-900' : 'text-slate-500 line-through decoration-slate-300'}`}>{content.titleAr}</div>
                        {content.sourceRef && (
                          <div dir="ltr" className="mt-0.5 text-end text-[11px] text-slate-400" title={content.sourceRef.sectionPathAr.join(' › ')}>
                            {content.sourceRef.pageTitle}
                          </div>
                        )}
                        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                          <span>{CONTENT_TYPE_LABELS[content.type]}</span>
                          <span>·</span>
                          <span>{content.categoryAr}</span>
                          <span>·</span>
                          <span dir="ltr" className="font-mono">{content.libraryId}</span>
                        </div>
                        <SourceBadge content={content} className="mt-1.5" />
                        {!verified && <p className="mt-1 text-[11px] text-amber-700">مستبعد تلقائياً: لا توجد صفحة رسمية على منصة التوعية الصحية لهذا العنصر.</p>}
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        {matchedCodes.map((code) => (
                          <span key={code} dir="ltr" className="rounded bg-violet-100 px-1.5 py-0.5 font-mono text-[11px] text-violet-700">
                            {code}
                          </span>
                        ))}
                      </div>
                    </label>
                  </li>
                )
              })}
            </ul>
            {!locked && <p className="mt-2 text-xs text-slate-500">يمكن للمثقف الصحي / الطبيب المعالج استبعاد أي عنصر غير مناسب لحالة المريض قبل الاعتماد.</p>}
          </div>
        )}
      </div>
    </section>
  )
}
