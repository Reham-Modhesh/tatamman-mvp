import { useState } from 'react'
import { ArrowLeft, BadgeCheck, CalendarDays, ChevronRight, Hourglass, House, Phone, Sprout, User } from 'lucide-react'
import type { DischargeNote, KitState, MohContent } from '../../types'
import { formatDateTime } from '../../lib/format'
import { REVIEWER_ROLE_LABELS } from '../../lib/roles'
import FollowUpMeds from './FollowUpMeds'
import MediaHub from './MediaHub'
import PhoneFrame from './PhoneFrame'
import RecoveryPlan from './RecoveryPlan'
import RedFlagCard from './RedFlagCard'
import { Card, IconTile, SegmentedControl } from './ui'

export type Tab = 'plan' | 'learn' | 'schedule'

const TABS: { id: Tab; label: string }[] = [
  { id: 'plan', label: 'خطتي المنزلية' },
  { id: 'learn', label: 'التثقيف' },
  { id: 'schedule', label: 'المواعيد والأدوية' },
]

// RTL order, as in Sehhaty: الرئيسية is right-most. The service lives under ملفي.
const NAV = [
  { label: 'الرئيسية', icon: House },
  { label: 'المواعيد', icon: CalendarDays },
  { label: 'جودة الحياة', icon: Sprout },
  { label: 'ملفي', icon: User, active: true },
]

interface Props {
  note: DischargeNote
  kit: KitState
  content: MohContent[]
  initialTab?: Tab
}

export default function SehhatyApp({ note, kit, content, initialTab = 'plan' }: Props) {
  const [tab, setTab] = useState<Tab>(initialTab)
  const firstName = note.patient.nameAr.split(' ')[0]
  const published = kit.status === 'published'

  return (
    <PhoneFrame>
      {/* Inner-page header, as on Sehhaty's ملفي page: large bold title on the right, green link on the left. No divider. */}
      <header className="flex shrink-0 items-center justify-between gap-2 px-5 pb-4 pt-5">
        <div className="flex items-center gap-0.5">
          <button aria-label="رجوع" className="-ms-1.5 grid size-8 place-items-center text-sh-text">
            <ChevronRight className="size-7" strokeWidth={2.25} />
          </button>
          <h1 className="text-[28px] font-bold leading-none text-sh-text">تطمّن</h1>
        </div>
        <span className="inline-flex items-center gap-1 text-[14px] font-semibold text-sh-green-text underline underline-offset-4">
          <BadgeCheck className="size-[18px]" strokeWidth={2} />
          إحدى خدمات تطبيق صحتي
        </span>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto">
        <div className="space-y-6 px-5 pb-6 pt-1">
          {/* Service banner, styled like the التوأم الرقمي card */}
          <div className="relative -mx-1 overflow-hidden rounded-[10px] bg-sh-banner px-4 py-5">
            <svg aria-hidden viewBox="0 0 120 100" className="absolute -left-6 top-0 h-full text-sh-green/25" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M10 100C40 70 30 30 70 0" />
              <path d="M30 100C60 70 50 30 90 0" />
              <path d="M50 100C80 70 70 30 110 0" />
            </svg>
            <div className="relative max-w-[78%]">
              <div className="flex items-center gap-2 text-[17px] font-bold text-sh-text">
                مرحباً {firstName}
                <ArrowLeft className="size-5 text-sh-green-text" strokeWidth={2.25} />
              </div>
              <p className="mt-2 text-[14px] leading-6 text-sh-muted">خدمة تطمّن - الرعاية والتثقيف الصحي بعد الخروج</p>
            </div>
          </div>

          {!published && (
            <Card className="space-y-2 py-6 text-center">
              <span className="mx-auto mb-1 grid size-12 place-items-center rounded-full bg-sh-pill text-sh-muted">
                <Hourglass className="size-6" strokeWidth={1.75} />
              </span>
              <div className="text-[16px] font-bold text-sh-text">لا توجد خطة رعاية منشورة حتى الآن</div>
              <p className="text-[13px] leading-6 text-sh-muted">
                يراجع المثقف الصحي / الطبيب المعالج تعليمات خروجك حالياً، وستظهر خطتك هنا فور اعتمادها.
              </p>
              <span className="inline-block rounded-full bg-sh-pill px-3 py-1 text-xs font-medium text-sh-warn">بانتظار اعتماد الممارس الصحي</span>
            </Card>
          )}

          {published && (
            <>
              <Card className="flex items-center gap-3 py-3">
                <IconTile icon={BadgeCheck} />
                <div className="min-w-0 text-[13px]">
                  <div className="font-semibold text-sh-text">
                    اعتمدها {kit.approverRole && REVIEWER_ROLE_LABELS[kit.approverRole]} {kit.approvedBy}
                  </div>
                  <div className="text-sh-subtle">
                    {note.hospitalAr}
                    {kit.approvedAt && <> · {formatDateTime(kit.approvedAt)}</>}
                  </div>
                </div>
              </Card>

              <RedFlagCard signs={note.warningSignsAr} />

              <div className="sticky top-0 z-10 -mx-4 bg-sh-bg px-4 py-2">
                <SegmentedControl options={TABS} value={tab} onChange={setTab} />
              </div>

              {tab === 'plan' && <RecoveryPlan note={note} />}
              {tab === 'learn' && <MediaHub items={content} />}
              {tab === 'schedule' && <FollowUpMeds note={note} />}

              <Card className="flex items-center gap-3 py-3">
                <IconTile icon={Phone} />
                <span className="text-[13px] leading-5 text-sh-muted">
                  لأي استفسار طبي تواصل مع فريقك المعالج أو اتصل بمركز اتصال الصحة{' '}
                  <span dir="ltr" className="font-bold text-sh-text">937</span>
                </span>
              </Card>
            </>
          )}
        </div>
      </main>

      {/* Bottom navigation: grey outline icons, white labels; the active tab sits in a black pill in green */}
      <nav className="grid shrink-0 grid-cols-4 items-center gap-2 border-t border-sh-nav-line/60 bg-sh-bg px-3 pb-6 pt-2.5">
        {NAV.map(({ label, icon: Icon, active }) => (
          <span
            key={label}
            className={`flex flex-col items-center gap-1 rounded-full py-2 text-[12px] font-medium ${
              active ? 'bg-sh-nav-active text-sh-green-text' : 'text-sh-text'
            }`}
          >
            <Icon className={`size-[26px] ${active ? '' : 'text-sh-subtle'}`} strokeWidth={1.4} />
            {label}
          </span>
        ))}
      </nav>
    </PhoneFrame>
  )
}
