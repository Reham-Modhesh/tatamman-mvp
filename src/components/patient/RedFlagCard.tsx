import { useState } from 'react'
import { Ambulance, CircleCheck, TriangleAlert } from 'lucide-react'
import { SectionHeader } from './ui'

type Answer = 'yes' | 'no' | null

/** Emergency signs, styled after Sehhaty's "أسعفني" section, with a guided yes/no check. */
export default function RedFlagCard({ signs }: { signs: string[] }) {
  const [answer, setAnswer] = useState<Answer>(null)

  return (
    <section className="space-y-3" aria-labelledby="red-flags">
      <SectionHeader title="علامات الخطر والطوارئ" />
      <div className="space-y-3 rounded-sh-card border border-sh-danger/80 bg-sh-danger/[0.07] p-4">
        <p id="red-flags" className="text-[14px] text-sh-text">
          توجّه للطوارئ فوراً إذا ظهرت أي من هذه العلامات:
        </p>
        <ul className="divide-y divide-sh-danger/20">
          {signs.map((s) => (
            <li key={s} className="flex items-start gap-2.5 py-2 text-[14px] text-sh-text">
              <TriangleAlert className="mt-0.5 size-4 shrink-0 text-sh-danger" />
              {s}
            </li>
          ))}
        </ul>

        {answer === null && (
          <div className="space-y-2 pt-1">
            <p className="text-[14px] font-bold text-sh-text">هل تعاني من أي من هذه الأعراض الآن؟</p>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setAnswer('yes')} className="rounded-sh-btn bg-sh-danger py-2.5 text-[15px] font-semibold text-white">
                نعم
              </button>
              <button onClick={() => setAnswer('no')} className="rounded-sh-btn border border-sh-line py-2.5 text-[15px] font-semibold text-sh-text">
                لا
              </button>
            </div>
          </div>
        )}

        {answer === 'yes' && (
          <div className="space-y-2 pt-1">
            <p className="text-[14px] font-bold text-sh-text">توجّه فوراً لأقرب قسم طوارئ أو اطلب الإسعاف</p>
            <a href="tel:997" className="flex items-center justify-center gap-2 rounded-sh-btn bg-sh-danger py-3 text-[15px] font-semibold text-white">
              <Ambulance className="size-5" />
              اطلب الإسعاف (<span dir="ltr">997</span>)
            </a>
            <button onClick={() => setAnswer(null)} className="w-full text-center text-[13px] text-sh-subtle underline">
              رجوع
            </button>
          </div>
        )}

        {answer === 'no' && (
          <div className="flex items-start gap-2 pt-1 text-[14px] text-sh-text">
            <CircleCheck className="mt-0.5 size-5 shrink-0 text-sh-green-text" />
            <div>
              الحمد لله على سلامتك. تابع خطتك المنزلية وراجع هذه العلامات يومياً.{' '}
              <button onClick={() => setAnswer(null)} className="text-[13px] text-sh-green-text underline">
                تغيير الإجابة
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
