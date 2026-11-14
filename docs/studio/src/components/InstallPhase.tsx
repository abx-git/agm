import { useStudioStore } from '../store/studio-store'

export function InstallPhase() {
  const setPhase = useStudioStore((s) => s.setPhase)
  const folderLabel = useStudioStore((s) => s.folderLabel)
  const canWrite = useStudioStore((s) => s.canWrite)
  const installStatus = useStudioStore((s) => s.installStatus)
  const writeStarterScaffold = useStudioStore((s) => s.writeStarterScaffold)
  const installing = useStudioStore((s) => s.installing)

  if (!folderLabel) {
    return (
      <div className="phase-panel">
        <h2>Step 2 — Starter</h2>
        <p className="lead">Choose a folder first (step 1).</p>
        <div className="phase-actions phase-actions--solo">
          <button type="button" className="btn primary" onClick={() => setPhase('connect')}>
            Back to step 1 — Folder
          </button>
        </div>
      </div>
    )
  }

  const ready = installStatus === 'ready'

  return (
    <div className="phase-panel install-phase">
      <h2>Step 2 — Write starter</h2>
      <p className="lead">
        {ready
          ? 'Starter files are in place. Open Docs to browse steer.md, or rewrite the starter.'
          : 'Creates steer.md, log.md, and empty chapters/ · reviews/ · rules/ in the bound folder.'}
      </p>

      <div className="install-card">
        <p className="install-card-target">
          Target: <code>{folderLabel}</code>
        </p>
        {!canWrite && (
          <p className="warn">
            Write permission required — in step 1, reconnect the folder in Chrome / Edge / Brave.
          </p>
        )}
        {!ready && (
          <button
            type="button"
            className="btn primary btn--block"
            disabled={!canWrite || installing}
            onClick={() => void writeStarterScaffold()}
          >
            {installing ? 'Writing…' : 'Write Tekto starter'}
          </button>
        )}
        {ready && (
          <>
            <p className="install-success">Setup complete — workspaces are available in the bar above.</p>
            <button
              type="button"
              className="btn primary btn--block"
              onClick={() => setPhase('architecture')}
            >
              Open Docs
            </button>
            <button
              type="button"
              className="btn subtle btn--block"
              disabled={!canWrite || installing}
              onClick={() => void writeStarterScaffold()}
            >
              {installing ? 'Writing…' : 'Rewrite starter files'}
            </button>
          </>
        )}
      </div>

      <div className="phase-actions">
        <button type="button" className="btn" onClick={() => setPhase('connect')}>
          ← Step 1 — Folder
        </button>
      </div>
    </div>
  )
}