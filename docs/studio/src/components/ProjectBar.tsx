import { useStudioStore } from '../store/studio-store'
import { supportsDirectoryPicker } from '../lib/fs-access'

function phaseTitle(phase: string): string {
  switch (phase) {
    case 'about':
      return 'Was ist Tekto?'
    case 'start':
      return 'Start'
    case 'setup':
      return 'Setup'
    case 'project':
      return 'Projekt'
    default:
      return 'Tekto Studio'
  }
}

export function ProjectBar() {
  const phase = useStudioStore((s) => s.phase)
  const goHome = useStudioStore((s) => s.goHome)
  const goSetup = useStudioStore((s) => s.goSetup)
  const setHelpOpen = useStudioStore((s) => s.setHelpOpen)
  const openHelp = useStudioStore((s) => s.openHelp)
  const helpOpen = useStudioStore((s) => s.helpOpen)
  const project = useStudioStore((s) => s.project)
  const folderLabel = useStudioStore((s) => s.folderLabel)
  const folderHint = useStudioStore((s) => s.folderHint)
  const canWrite = useStudioStore((s) => s.canWrite)
  const installStatus = useStudioStore((s) => s.installStatus)
  const refreshIndex = useStudioStore((s) => s.refreshIndex)

  return (
    <header className="project-bar">
      <div className="project-bar-left">
        <button type="button" className="brand-btn" onClick={() => goHome()}>
          Tekto Studio
        </button>
        <span className="project-bar-phase">{phaseTitle(phase)}</span>
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
            {canWrite ? '' : ' (nur lesen)'}
          </span>
        ) : null}
        {installStatus === 'ready' && phase === 'project' ? (
          <button type="button" className="btn subtle" onClick={() => void refreshIndex()}>
            Ordner neu laden
          </button>
        ) : null}
        {phase !== 'setup' && (
          <button type="button" className="btn subtle" onClick={() => goSetup()}>
            Setup
          </button>
        )}
        <button type="button" className="btn subtle" onClick={() => openHelp('help-flow-map')}>
          Hilfe
        </button>
        {!folderLabel && supportsDirectoryPicker() && (
          <button type="button" className="btn primary" onClick={() => goSetup()}>
            Projekt einrichten
          </button>
        )}
        <button
          type="button"
          className="btn icon"
          aria-label="Hilfe einblenden"
          onClick={() => setHelpOpen(!helpOpen)}
        >
          ?
        </button>
      </div>
    </header>
  )
}