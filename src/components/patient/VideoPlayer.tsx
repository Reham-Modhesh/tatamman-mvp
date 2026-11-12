import { useEffect, useState } from 'react'
import { Captions, Pause, Play } from 'lucide-react'

interface Props {
  title: string
  durationMinutes?: number
}

/** Placeholder player standing in for an approved MoH video asset. */
export default function VideoPlayer({ title, durationMinutes = 3 }: Props) {
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!playing) return
    const t = window.setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          setPlaying(false)
          return 100
        }
        return p + 1
      })
    }, 120)
    return () => clearInterval(t)
  }, [playing])

  const totalSec = durationMinutes * 60
  const elapsed = Math.round((progress / 100) * totalSec)
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  return (
    <div className="overflow-hidden rounded-sh-btn bg-black/40 text-white ring-1 ring-sh-line/40">
      <button
        onClick={() => {
          if (progress >= 100) setProgress(0)
          setPlaying((p) => !p)
        }}
        className="relative grid aspect-video w-full place-items-center bg-linear-to-br from-[#0c3a20] via-[#0f121c] to-[#1d2a2f]"
        aria-label={playing ? 'إيقاف الفيديو' : 'تشغيل الفيديو'}
      >
        <div className="absolute inset-0 opacity-20 [background:radial-gradient(circle_at_30%_30%,white,transparent_45%)]" />
        <span className={`grid size-14 place-items-center rounded-full bg-white/90 text-[#2f7d52] shadow-lg transition ${playing ? 'scale-90 opacity-0' : ''}`}>
          <Play className="size-7 -scale-x-100" />
        </span>
        {playing && (
          <span className="absolute inset-x-0 bottom-3 mx-auto w-fit rounded bg-black/60 px-2 py-1 text-xs">معاينة: يُعرض هنا المقطع المعتمد «{title}»</span>
        )}
        <span className="absolute end-2 top-2 flex items-center gap-1 rounded bg-black/50 px-1.5 py-0.5 text-[10px]">
          <Captions className="size-3" />
          ترجمة نصية
        </span>
      </button>
      <div className="flex items-center gap-2 px-3 py-2 text-xs">
        <button onClick={() => setPlaying((p) => !p)} aria-label={playing ? 'إيقاف' : 'تشغيل'}>
          {playing ? <Pause className="size-4" /> : <Play className="size-4 -scale-x-100" />}
        </button>
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/20">
          <div className="h-full bg-sh-green" style={{ width: `${progress}%` }} />
        </div>
        <span dir="ltr" className="font-mono text-white/70">
          {fmt(elapsed)} / {fmt(totalSec)}
        </span>
      </div>
    </div>
  )
}
