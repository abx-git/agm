import { useStudioStore } from '../store/studio-store'

export function WhatIsTektoPhase() {
  const setPhase = useStudioStore((s) => s.setPhase)
  const goSetup = useStudioStore((s) => s.goSetup)
  const ready =
    Boolean(useStudioStore((s) => s.folderLabel)) &&
    useStudioStore((s) => s.installStatus) === 'ready'

  return (
    <div className="starter-page about-page">
      <div className="starter-hero">
        <p className="starter-brand">Tekto</p>
        <h1>Architektur in Git</h1>
        <p className="starter-lead">
          Steuerdatei, Evidence, Reviews — Artefakte, die bei Architektur-Arbeit entstehen. Studio
          bindet dein Repo; die KI läuft in deiner IDE.
        </p>
      </div>

      <section className="starter-section">
        <h2>Drei Artefakt-Arten</h2>
        <ul className="starter-list">
          <li>
            <strong>Dokumentation</strong> — steer, Kapitel, Regeln
          </li>
          <li>
            <strong>Reviews</strong> — findings &amp; threads (KI oder Menschen, via Git teilen)
          </li>
          <li>
            <strong>Analysen</strong> — work/, chapters/ (Ergebnisse von Architektur-Sessions)
          </li>
        </ul>
      </section>

      <div className="starter-cta starter-cta--footer">
        <button
          type="button"
          className="btn primary"
          onClick={() => (ready ? setPhase('project') : goSetup())}
        >
          {ready ? 'Projekt öffnen' : 'Setup starten'}
        </button>
        <button type="button" className="btn" onClick={() => setPhase('start')}>
          Zurück
        </button>
      </div>
    </div>
  )
}