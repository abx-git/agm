import { useStudioStore } from '../store/studio-store'

export function InstallPhase() {
  const setPhase = useStudioStore((s) => s.setPhase)
  const folderLabel = useStudioStore((s) => s.folderLabel)
  const project = useStudioStore((s) => s.project)
  const canWrite = useStudioStore((s) => s.canWrite)
  const installStatus = useStudioStore((s) => s.installStatus)
  const writeStarterScaffold = useStudioStore((s) => s.writeStarterScaffold)
  const installing = useStudioStore((s) => s.installing)

  if (!folderLabel) {
    return (
      <div className="phase-panel">
        <h2>Setup — starter</h2>
        <p>Choose a folder in Setup first.</p>
        <button type="button" className="btn primary" onClick={() => setPhase('connect')}>
          Choose folder
        </button>
      </div>
    )
  }

  return (
    <div className="phase-panel install-phase">
      <h2>Setup — write starter</h2>
      <p className="lead">
        {installStatus === 'ready'
          ? 'steer.md and log.md are present. Open Docs, or rewrite the starter.'
          : 'Writes steer.md, log.md, and folder stubs under your doc root.'}
      </p>

      <div className="install-card">
        <p>
          Into <code>{folderLabel}</code>: <strong>steer.md</strong>, <strong>log.md</strong>, chapters/,
          reviews/, rules/. Then use <strong>Composer</strong> for <code>tekto export</code> in the app
          repo ({project.docRoot || 'docs/tekto/'}).
        </p>
        {!canWrite && (
          <p className="warn">
            Write permission required — reconnect folder in Chrome / Edge / Brave.
          </p>
        )}
        <button
          type="button"
          className="btn primary"
          disabled={!canWrite || installing}
          onClick={() => writeStarterScaffold()}
        >
          {installing
            ? 'Writing…'
            : installStatus === 'ready'
              ? 'Rewrite Tekto starter'
              : 'Write Tekto starter'}
        </button>
      </div>

      <div className="phase-actions">
        <button type="button" className="btn" onClick={() => setPhase('connect')}>
          Back
        </button>
        <button
          type="button"
          className="btn primary"
          onClick={() => setPhase('compose')}
          disabled={installStatus === 'missing'}
        >
          Open Composer
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => setPhase('architecture')}
          disabled={installStatus === 'missing'}
        >
          Open Docs
        </button>
      </div>
    </div>
  )
}