import type { MohContent } from '../../types'
import { CONTENT_TYPE_LABELS } from '../../lib/entityStyles'
import ContentTypeIcon from '../shared/ContentTypeIcon'
import SourceBadge from '../shared/SourceBadge'
import AudioPlayer from './AudioPlayer'
import ChecklistCard from './ChecklistCard'
import InfographicCard from './InfographicCard'
import VideoPlayer from './VideoPlayer'
import { SectionHeader } from './ui'

/** Spoken version of an item: built only from the approved fields, never generated. */
function spokenText(c: MohContent) {
  const parts = [c.titleAr, c.bodyAr]
  if (c.checklistAr) parts.push(...c.checklistAr)
  if (c.stepsAr) parts.push(...c.stepsAr.map((s) => `${s.titleAr}: ${s.textAr}`))
  return parts.join('. ')
}

export default function MediaHub({ items }: { items: MohContent[] }) {
  return (
    <section className="space-y-3">
      <SectionHeader title="المحتوى التثقيفي" />
      <p className="text-[13px] text-sh-subtle">محتوى معتمد اختاره فريقك الصحي خصيصاً لحالتك.</p>
      {items.map((c) => (
        <article key={c.id} className="overflow-hidden rounded-sh-card border border-sh-line bg-sh-card">
          {c.type === 'video' && (
            <div className="p-2 pb-0">
              <VideoPlayer title={c.titleAr} durationMinutes={c.durationMinutes} />
            </div>
          )}
          <div className="space-y-3 p-4">
            <header className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-sh-tile text-sh-green-text">
                <ContentTypeIcon type={c.type} className="size-5" strokeWidth={1.75} />
              </span>
              <div className="min-w-0">
                <div className="text-[12px] text-sh-subtle">
                  {CONTENT_TYPE_LABELS[c.type]} · {c.categoryAr}
                  {c.durationMinutes ? ` · ${c.durationMinutes} دقائق` : ''}
                </div>
                <h3 className="text-[15px] font-bold leading-snug text-sh-text">{c.titleAr}</h3>
              </div>
            </header>
            <p className="text-[14px] leading-7 text-sh-muted">{c.bodyAr}</p>
            {c.checklistAr && <ChecklistCard items={c.checklistAr} />}
            {c.stepsAr && <InfographicCard steps={c.stepsAr} />}
            {c.type !== 'video' && <AudioPlayer text={spokenText(c)} label="استمع لهذا المحتوى" />}
            <SourceBadge content={c} tone="dark" />
          </div>
        </article>
      ))}
    </section>
  )
}
