import { useState } from 'react'
import type { KitState, ReviewerRole, View } from './types'
import { dischargeNotes, mohContent } from './data'
import { defaultSelection } from './lib/matching'
import { reviewerFor } from './lib/roles'
import { useTheme } from './lib/theme'
import SimulatorBar from './components/SimulatorBar'
import ProviderPortal from './components/provider/ProviderPortal'
import PatientView from './components/patient/PatientView'

/** The first case (gallbladder) opens already published so the demo starts on the full patient experience. */
const PREPUBLISHED_ID = dischargeNotes[0].id

function initialKits(): Record<string, KitState> {
  return Object.fromEntries(
    dischargeNotes.map((note): [string, KitState] => {
      const selectedContentIds = defaultSelection(note, mohContent)
      if (note.id !== PREPUBLISHED_ID) return [note.id, { status: 'pending_review', selectedContentIds }]
      return [
        note.id,
        {
          status: 'published',
          selectedContentIds,
          approvedAt: new Date(Date.now() - 2 * 3_600_000).toISOString(),
          approvedBy: note.healthEducator.nameAr,
          approverRole: 'health_educator',
        },
      ]
    }),
  )
}

export default function App() {
  const [view, setView] = useState<View>('patient')
  const [selectedId, setSelectedId] = useState(dischargeNotes[0].id)
  const [kits, setKits] = useState(initialKits)
  const { theme, toggle: toggleTheme } = useTheme()

  const updateKit = (noteId: string, update: (kit: KitState) => KitState) =>
    setKits((all) => ({ ...all, [noteId]: update(all[noteId]) }))

  const switchView = (next: View) => {
    setView(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleContent = (noteId: string, contentId: string) => {
    // Items without a verified official source can never be published.
    if (!mohContent.find((c) => c.id === contentId)?.sourceRef) return
    updateKit(noteId, (kit) => ({
      ...kit,
      selectedContentIds: kit.selectedContentIds.includes(contentId)
        ? kit.selectedContentIds.filter((id) => id !== contentId)
        : [...kit.selectedContentIds, contentId],
    }))
  }

  const publish = (noteId: string, role: ReviewerRole) => {
    const note = dischargeNotes.find((n) => n.id === noteId)
    if (!note) return
    const reviewer = reviewerFor(note, role)
    updateKit(noteId, (kit) => ({ ...kit, status: 'published', approvedAt: new Date().toISOString(), approvedBy: reviewer.nameAr, approverRole: role }))
  }

  const revoke = (noteId: string) =>
    updateKit(noteId, (kit) => ({ ...kit, status: 'pending_review', approvedAt: undefined, approvedBy: undefined, approverRole: undefined }))

  return (
    <div className="min-h-screen">
      <SimulatorBar view={view} onChange={switchView} theme={theme} onToggleTheme={toggleTheme} />
      {view === 'provider' ? (
        <ProviderPortal
          notes={dischargeNotes}
          library={mohContent}
          kits={kits}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onToggleContent={toggleContent}
          onPublish={publish}
          onRevoke={revoke}
          onOpenPatientView={() => switchView('patient')}
        />
      ) : (
        <PatientView
          note={dischargeNotes.find((n) => n.id === selectedId) ?? dischargeNotes[0]}
          kit={kits[selectedId]}
          library={mohContent}
        />
      )}
    </div>
  )
}
