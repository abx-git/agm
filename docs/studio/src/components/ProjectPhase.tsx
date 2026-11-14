import { useMemo } from 'react'
import { useStudioStore } from '../store/studio-store'
import type { ArtifactKind } from '../lib/artifacts'
import {
  ARTIFACT_HINTS,
  ARTIFACT_LABELS,
  buildReviewShareText,
  filterDocsByArtifact,
} from '../lib/artifacts'
import { BrowseMode } from './BrowseMode'
import { ReviewsPanel } from './ReviewsPanel'
import { SessionPhase } from './SessionPhase'
import { copyText } from '../lib/personalize'

const KINDS: ArtifactKind[] = ['documentation', 'reviews', 'analyses']

export function ProjectPhase() {
  const index = useStudioStore((s) => s.index)
  const artifactKind = useStudioStore((s) => s.artifactKind)
  const setArtifactKind = useStudioStore((s) => s.setArtifactKind)
  const activePath = useStudioStore((s) => s.activePath)
  const activeSpikePath = useStudioStore((s) => s.activeSpikePath)
  const project = useStudioStore((s) => s.project)
  const aiDrawerOpen = useStudioStore((s) => s.aiDrawerOpen)
  const setAiDrawerOpen = useStudioStore((s) => s.setAiDrawerOpen)
  const openSession = useStudioStore((s) => s.openSession)
  const showToast = useStudioStore((s) => s.showToast)
  const folderLabel = useStudioStore((s) => s.folderLabel)

  const filteredCount = useMemo(() => {
    if (!index) return 0
    return filterDocsByArtifact(index.docs, artifactKind).size
  }, [index, artifactKind])

  const shareReview = async () => {
    const folder = activeSpikePath || (activePath?.includes('/reviews/') ? activePath.split('/findings')[0] : '')
    if (!folder) {
      showToast('Review-Ordner wählen')
      return
    }
    const text = buildReviewShareText(folder, project.appName || folderLabel || 'Projekt')
    const ok = await copyText(text)
    showToast(ok ? 'Team-Text kopiert (in PR/Chat einfügen)' : 'Kopieren fehlgeschlagen')
  }

  return (
    <div className="project-phase">
      <header className="project-phase-head">
        <div className="artifact-tabs" role="tablist" aria-label="Artefakte">
          {KINDS.map((k) => (
            <button
              key={k}
              type="button"
              role="tab"
              className={artifactKind === k ? 'active' : ''}
              aria-selected={artifactKind === k}
              onClick={() => setArtifactKind(k)}
            >
              <span className="artifact-tab-label">{ARTIFACT_LABELS[k]}</span>
              <span className="artifact-tab-hint">{ARTIFACT_HINTS[k]}</span>
            </button>
          ))}
        </div>
        <div className="project-phase-actions">
          <button type="button" className="btn" onClick={() => openSession('aspect')}>
            Prompt für KI
          </button>
          {artifactKind === 'reviews' && (
            <button type="button" className="btn" onClick={() => void shareReview()}>
              Für Team teilen
            </button>
          )}
          <button type="button" className="btn subtle" onClick={() => setAiDrawerOpen(!aiDrawerOpen)}>
            {aiDrawerOpen ? 'KI-Panel zu' : 'KI-Panel'}
          </button>
        </div>
      </header>

      <p className="project-phase-meta muted">
        {index ? `${filteredCount} Dateien · Git = sichtbar für Menschen mit Repo-Zugriff` : 'Kein Index'}
      </p>

      <div className={`project-phase-body${aiDrawerOpen ? ' project-phase-body--split' : ''}`}>
        <div className="project-phase-main">
          {artifactKind === 'reviews' ? (
            <ReviewsPanel />
          ) : (
            <BrowseMode embedded artifactFilter={artifactKind} />
          )}
        </div>
        {aiDrawerOpen && (
          <aside className="project-ai-drawer" aria-label="KI-Prompts">
            <SessionPhase />
          </aside>
        )}
      </div>
    </div>
  )
}