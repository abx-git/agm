import { useStudioStore } from '../store/studio-store'
import { supportsDirectoryPicker } from '../lib/fs-access'

export function StarterPhase() {
  const setPhase = useStudioStore((s) => s.setPhase)
  const goSetup = useStudioStore((s) => s.goSetup)
  const folderLabel = useStudioStore((s) => s.folderLabel)
  const installStatus = useStudioStore((s) => s.installStatus)
  const ready = Boolean(folderLabel) && installStatus === 'ready'

  return (
    <div className="starter-page">
      <div className="starter-hero">
        <p className="starter-brand">Tekto Studio</p>
        <h1>Architecture work with AI</h1>
        <p className="starter-lead">
          <strong>Two setup steps:</strong> bind your <code>docs/tekto/</code> folder, then write
          steer.md + log.md. After that, Docs · Review · Composer · Ask AI unlock.
        </p>
        <div className="starter-cta">
          <button
            type="button"
            className="btn primary"
            onClick={() => (ready ? setPhase('architecture') : goSetup())}
          >
            {ready ? 'Open Docs' : folderLabel ? 'Continue Setup' : 'Start Setup'}
          </button>
          <button type="button" className="btn" onClick={() => setPhase('about')}>
            What is Tekto?
          </button>
        </div>
      </div>

      <section className="starter-section">
        <h2>What you need</h2>
        <ul className="starter-list">
          <li>Chrome, Edge, or Brave (folder write access)</li>
          <li>Local <code>docs/tekto/</code> in your app repo</li>
          <li>Cursor, Claude Code, or Copilot on the same repo</li>
        </ul>
        {!supportsDirectoryPicker() && (
          <p className="starter-note">Use Chromium for full write access.</p>
        )}
      </section>
    </div>
  )
}