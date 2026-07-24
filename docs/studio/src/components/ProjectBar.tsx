import { useStudioStore } from '../store/studio-store'
import { supportsDirectoryPicker } from '../lib/fs-access'
import type { JourneyPhase } from '../types'

const PHASES: { id: JourneyPhase; label: string; hint: string }[] = [
  { id: 'connect', label: '1. Connect', hint: 'Project & folder' },
  { id: 'install', label: '2. Install', hint: 'Write starter' },
  { id: 'run', label: '3. Run', hint: 'Sessions' },
  { id: 'spike', label: '4. Process', hint: 'Spikes & reviews' },
  { id: 'review', label: '5. Review', hint: 'Browse graph' },
]

export function JourneyRail() {
  const phase = useStudioStore((s) => s.phase)
  const setPhase = useStudioStore((s) => s.setPhase)
  const installStatus = useStudioStore((s) => s.installStatus)
  const index = useStudioStore((s) => s.index)
  const folderLabel = useStudioStore((s) => s.folderLabel)

  return (
    <nav className="journey-rail" aria-label="AGM journey">
      {PHASES.map((p) => {
        const locked =
          (p.id === 'install' && !folderLabel) ||
          (p.id === 'run' && !folderLabel) ||
          (p.id === 'spike' && !folderLabel) ||
          (p.id === 'review' && !index)
        const done =
          (p.id === 'connect' && Boolean(folderLabel)) ||
          (p.id === 'install' && installStatus === 'ready')
        return (
          <button
            key={p.id}
            type="button"
            className={`journey-chip${phase === p.id ? ' active' : ''}${done ? ' done' : ''}`}
            disabled={locked && p.id !== phase}
            onClick={() => setPhase(p.id)}
          >
            <span className="journey-chip-label">{p.label}</span>
            <span className="journey-chip-hint">{p.hint}</span>
          </button>
        )
      })}
    </nav>
  )
}

export function ProjectBar() {
  const phase = useStudioStore((s) => s.phase)
  const setPhase = useStudioStore((s) => s.setPhase)
  const project = useStudioStore((s) => s.project)
  const folderLabel = useStudioStore((s) => s.folderLabel)
  const canWrite = useStudioStore((s) => s.canWrite)
  const installStatus = useStudioStore((s) => s.installStatus)
  const connectFolder = useStudioStore((s) => s.connectFolder)
  const connectFolderFallback = useStudioStore((s) => s.connectFolderFallback)
  const refreshIndex = useStudioStore((s) => s.refreshIndex)
  const opening = useStudioStore((s) => s.opening)

  return (
    <header className="project-bar">
      <button type="button" className="studio-brand studio-brand-btn" onClick={() => setPhase('about')}>
        <strong>AGM Studio</strong>
        <span className="studio-tag">
          {phase === 'about'
            ? 'what is AGM'
            : phase === 'start'
              ? 'how it works'
              : 'connect · install · run · spike · review'}
        </span>
      </button>
      <div className="project-meta">
        <span className="meta-pill">{project.appName || 'Unnamed project'}</span>
        <span className="meta-pill">{project.docRoot || 'Doc root pending'}</span>
        {folderLabel ? (
          <span className="meta-pill" title={folderLabel}>
            {folderLabel}
            {canWrite ? ' · write' : ' · read'}
            {installStatus !== 'unknown' ? ` · ${installStatus}` : ''}
          </span>
        ) : (
          <span className="meta-pill muted">No folder</span>
        )}
      </div>
      <div className="studio-actions">
        {phase !== 'start' && phase !== 'about' && (
          <button
            type="button"
            className="btn"
            disabled={opening}
            onClick={() => {
              setPhase('connect')
              if (supportsDirectoryPicker()) void connectFolder()
              else void connectFolderFallback()
            }}
          >
            {opening ? 'Opening…' : folderLabel ? 'Change folder' : 'Choose folder'}
          </button>
        )}
        {folderLabel && phase !== 'start' && phase !== 'about' && (
          <button type="button" className="btn" disabled={opening} onClick={() => refreshIndex()}>
            Refresh
          </button>
        )}
      </div>
    </header>
  )
}
