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
        <h1>Zwei Phasen</h1>
        <ol className="starter-list starter-list--numbered">
          <li>
            <strong>Setup</strong> — lokales Projekt, KI-Tool, <code>steer.md</code>
          </li>
          <li>
            <strong>Projekt</strong> — navigieren in Dokumentation, Reviews, Analysen (alles in Git, für
            Team und KI sichtbar)
          </li>
        </ol>
        <div className="starter-cta">
          <button
            type="button"
            className="btn primary"
            onClick={() => (ready ? setPhase('project') : goSetup())}
          >
            {ready ? 'Projekt öffnen' : 'Setup starten'}
          </button>
          <button type="button" className="btn" onClick={() => setPhase('about')}>
            Was ist Tekto?
          </button>
        </div>
      </div>

      {!supportsDirectoryPicker() && (
        <p className="starter-note">Für Schreibzugriff: Chrome, Edge oder Brave.</p>
      )}
    </div>
  )
}