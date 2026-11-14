import { useStudioStore } from '../store/studio-store'
import { supportsDirectoryPicker } from '../lib/fs-access'
import type { WorkspaceId } from '../types'
import { workspaceLabel } from '../lib/session-persist'

const COCKPIT: { id: WorkspaceId; hint: string }[] = [
  { id: 'architecture', hint: 'Browse docs' },
  { id: 'review', hint: 'Findings & threads' },
  { id: 'compose', hint: 'CLI export' },
  { id: 'session', hint: 'Copy prompts' },
]

export function JourneyRail() {
  const phase = useStudioStore((s) => s.phase)
  const setPhase = useStudioStore((s) => s.setPhase)
  const openSession = useStudioStore((s) => s.openSession)
  const goSetup = useStudioStore((s) => s.goSetup)
  const installStatus = useStudioStore((s) => s.installStatus)
  const index = useStudioStore((s) => s.index)
  const folderLabel = useStudioStore((s) => s.folderLabel)

  const ready = Boolean(folderLabel) && installStatus === 'ready'
  const setupActive = phase === 'connect' || phase === 'install'
  const setupHint = !folderLabel
    ? 'Choose folder'
    : installStatus !== 'ready'
      ? 'Write starter'
      : 'Project & folder'

  return (
    <nav className="journey-rail" aria-label="Tekto Studio">
      {ready ? (
        <>
          {COCKPIT.map((p) => {
            const locked = p.id === 'architecture' && !index && p.id !== phase
            return (
              <button
                key={p.id}
                type="button"
                className={`journey-chip${phase === p.id ? ' active' : ''}`}
                disabled={locked}
                onClick={() => {
                  if (p.id === 'session') {
                    openSession(installStatus === 'ready' ? 'continue' : 'adopt')
                  } else setPhase(p.id)
                }}
              >
                <span className="journey-chip-label">{workspaceLabel(p.id)}</span>
                <span className="journey-chip-hint">{p.hint}</span>
              </button>
            )
          })}
        </>
      ) : (
        <>
          <button
            type="button"
            className={`journey-chip${setupActive || phase === 'start' ? ' active' : ''}`}
            onClick={() => goSetup()}
          >
            <span className="journey-chip-label">Setup</span>
            <span className="journey-chip-hint">{setupHint}</span>
          </button>
          {COCKPIT.map((p) => (
            <button
              key={p.id}
              type="button"
              className="journey-chip"
              disabled
              title="Finish Setup first"
            >
              <span className="journey-chip-label">{workspaceLabel(p.id)}</span>
              <span className="journey-chip-hint">browse Tekto</span>
            </button>
          ))}
        </>
      )}
    </nav>
  )
}

export function ProjectBar() {
  const phase = useStudioStore((s) => s.phase)
  const goHome = useStudioStore((s) => s.goHome)
  const goSetup = useStudioStore((s) => s.goSetup)
  const helpOpen = useStudioStore((s) => s.helpOpen)
  const setHelpOpen = useStudioStore((s) => s.setHelpOpen)
  const openHelp = useStudioStore((s) => s.openHelp)
  const project = useStudioStore((s) => s.project)
  const folderLabel = useStudioStore((s) => s.folderLabel)
  const folderHint = useStudioStore((s) => s.folderHint)
  const canWrite = useStudioStore((s) => s.canWrite)
  const installStatus = useStudioStore((s) => s.installStatus)
  const connectFolder = useStudioStore((s) => s.connectFolder)
  const connectFolderFallback = useStudioStore((s) => s.connectFolderFallback)
  const refreshIndex = useStudioStore((s) => s.refreshIndex)
  const opening = useStudioStore((s) => s.opening)

  const title =
    phase === 'about'
      ? 'About'
      : phase === 'start'
        ? 'Start'
        : phase === 'connect'
          ? 'Connect'
          : phase === 'install'
            ? 'Install'
            : workspaceLabel(phase as WorkspaceId)

  return (
    <header className="project-bar">
      <div className="project-bar-left">
        <button type="button" className="brand-btn" onClick={() => goHome()}>
          Tekto Studio
        </button>
        <span className="project-bar-phase">{title}</span>
        {project.appName ? (
          <span className="project-bar-app" title={project.docRoot || 'docs/tekto/'}>
            {project.appName}
          </span>
        ) : null}
      </div>
      <div className="project-bar-right">
        {folderLabel ? (
          <span className="folder-label" title={folderHint ?? undefined}>
            {folderLabel}
            {canWrite ? '' : ' (read-only)'}
          </span>
        ) : null}
        {installStatus === 'ready' ? (
          <button type="button" className="btn subtle" onClick={() => void refreshIndex()}>
            Reload folder
          </button>
        ) : null}
        <button type="button" className="btn subtle" onClick={() => goSetup()}>
          Setup
        </button>
        <button type="button" className="btn subtle" onClick={() => openHelp('help-flow-map')}>
          Help
        </button>
        {!folderLabel &&
          (supportsDirectoryPicker() ? (
            <button type="button" className="btn primary" disabled={opening} onClick={() => void connectFolder()}>
              Connect folder
            </button>
          ) : (
            <button type="button" className="btn primary" disabled={opening} onClick={() => void connectFolderFallback()}>
              Open folder
            </button>
          ))}
        <button
          type="button"
          className="btn icon"
          aria-label="Toggle help drawer"
          onClick={() => setHelpOpen(!helpOpen)}
        >
          ?
        </button>
      </div>
    </header>
  )
}