import { Activity, Bandage, Droplets, Gauge, Pill, Utensils } from 'lucide-react'
import type { DischargeNote, HomeCareCategory } from '../../types'
import AudioPlayer from './AudioPlayer'
import { Card, IconTile, SectionHeader } from './ui'

const CATEGORY_ICONS = {
  wound: Bandage,
  activity: Activity,
  diet: Utensils,
  hygiene: Droplets,
  pain: Pill,
  monitoring: Gauge,
} satisfies Record<HomeCareCategory, unknown>

export default function RecoveryPlan({ note }: { note: DischargeNote }) {
  const spoken = [
    'خطة التعليمات المنزلية',
    note.summaryAr,
    ...note.homeCare.flatMap((s) => [s.titleAr, ...s.itemsAr]),
    'علامات الخطر التي تستدعي التوجه للطوارئ فوراً',
    ...note.warningSignsAr,
  ].join('. ')

  return (
    <div className="space-y-5">
      <section className="space-y-3">
        <SectionHeader title="ملخص حالتك" />
        <Card className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {[note.diagnosis, ...note.procedures].map((c) => (
              <span key={c.code} className="rounded-full bg-sh-tile px-2.5 py-1 text-[12px] font-medium text-sh-green-text">
                {c.descriptionAr}
              </span>
            ))}
          </div>
          <p className="text-[14px] leading-7 text-sh-muted">{note.summaryAr}</p>
          <AudioPlayer text={spoken} label="استمع لخطتك كاملة" />
        </Card>
      </section>

      <section className="space-y-3">
        <SectionHeader title="خطة التعليمات المنزلية" />
        {/* List card with dividers, like "التقارير والمستندات" */}
        <div className="divide-y divide-sh-divider rounded-sh-card border border-sh-line bg-sh-card">
          {note.homeCare.map((section) => (
            <div key={section.titleAr} className="flex gap-3 p-4">
              <IconTile icon={CATEGORY_ICONS[section.category]} />
              <div className="min-w-0 flex-1">
                <h3 className="mb-1.5 text-[15px] font-semibold text-sh-text">{section.titleAr}</h3>
                <ul className="space-y-1">
                  {section.itemsAr.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[13px] leading-6 text-sh-muted">
                      <span className="mt-2.5 size-1 shrink-0 rounded-full bg-sh-green-text" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
