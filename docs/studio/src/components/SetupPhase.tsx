import { useEffect, useState } from 'react'
import { useStudioStore } from '../store/studio-store'
import { supportsDirectoryPicker } from '../lib/fs-access'
import { copyText } from '../lib/personalize'

export function SetupPhase() {
  const project = useStudioStore((s) => s.project)
  const setProject = useStudioStore((s) => s.setProject)
  const setPhase = useStudioStore((s) => s.setPhase)
  const folderLabel = useStudioStore((s) => s.folderLabel)
  const pendingBaseName = useStudioStore((s) => s.pendingBaseName)
  const pendingSubpath = useStudioStore((s) => s.pendingSubpath)
  const pickBaseFolder = useStudioStore((s) => s.pickBaseFolder)
  const confirmConnect = useStudioStore((s) => s.confirmConnect)
  const clearPendingBase = useStudioStore((s) => s.clearPendingBase)
  const suggestDocRootForPending = useStudioStore((s) => s.suggestDocRootForPending)
  const connectFolderFallback = useStudioStore((s) => s.connectFolderFallback)
  const opening = useStudioStore((s) => s.opening)
  const installStatus = useStudioStore((s) => s.installStatus)
  const canWrite = useStudioStore((s) => s.canWrite)
  const writeStarterScaffold = useStudioStore((s) => s.writeStarterScaffold)
  const installing = useStudioStore((s) => s.installing)
  const showToast = useStudioStore((s) => s.showToast)

  const [subpath, setSubpath] = useState('')

  useEffect(() => {
    if (pendingBaseName) setSubpath(pendingSubpath)
  }, [pendingBaseName, pendingSubpath])

  const onSubpathChange = async (value: string) => {
    setSubpath(value)
    const suggested = await suggestDocRootForPending(value)
    if (suggested) setProject({ docRoot: suggested })
  }

  const pending = Boolean(pendingBaseName)
  const confirmed = Boolean(folderLabel) && !pending
  const ready = installStatus === 'ready'

  const exportCmd = `npx @abx-hh/tekto export --ai-tool ${project.aiTool || 'cursor'}`

  return (
    <div className="phase-panel setup-phase">
      <h1>Setup</h1>
      <p className="lead">
        Lokales Projekt wählen, KI-Tool festlegen, <code>steer.md</code> anlegen — danach eine
        Projekt-Ansicht für Dokumentation, Reviews und Analysen.
      </p>

      <section className="setup-section">
        <h2>Projekt &amp; KI</h2>
        <div className="form-grid">
          <label className="field">
            <span>Projektname</span>
            <input
              value={project.appName}
              onChange={(e) => setProject({ appName: e.target.value })}
              placeholder="z. B. Order Service"
            />
          </label>
          <label className="field">
            <span>Doc root (Prompts)</span>
            <input
              value={project.docRoot}
              onChange={(e) => setProject({ docRoot: e.target.value })}
              placeholder="docs/tekto/"
            />
          </label>
          <label className="field">
            <span>KI-Tool</span>
            <select value={project.aiTool} onChange={(e) => setProject({ aiTool: e.target.value })}>
              <option value="cursor">Cursor</option>
              <option value="claude">Claude Code</option>
              <option value="copilot">GitHub Copilot</option>
              <option value="kiro">Kiro</option>
              <option value="generic">Sonstiges</option>
            </select>
          </label>
        </div>
      </section>

      <section className="setup-section">
        <h2>Ordner</h2>
        {!pending && (
          <div className="connect-step-actions">
            <button
              type="button"
              className="btn primary"
              disabled={opening || !supportsDirectoryPicker()}
              onClick={() => pickBaseFolder()}
            >
              {opening ? 'Öffne…' : confirmed ? 'Ordner wechseln' : 'Ordner wählen'}
            </button>
            {!supportsDirectoryPicker() && (
              <button type="button" className="btn" disabled={opening} onClick={() => connectFolderFallback()}>
                Nur lesen
              </button>
            )}
          </div>
        )}
        {pending && pendingBaseName && (
          <div className="connect-pending">
            <p>
              Gewählt: <strong>{pendingBaseName}</strong>
            </p>
            <label className="field">
              <span>Unterordner (optional)</span>
              <input value={subpath} onChange={(e) => void onSubpathChange(e.target.value)} placeholder="docs/tekto" />
            </label>
            <div className="connect-step-actions">
              <button
                type="button"
                className="btn primary"
                disabled={opening || !project.docRoot.trim()}
                onClick={() => void confirmConnect(subpath, project.docRoot)}
              >
                Pfad bestätigen
              </button>
              <button type="button" className="btn" onClick={() => clearPendingBase()}>
                Abbrechen
              </button>
            </div>
          </div>
        )}
        {confirmed && (
          <p className="status-line">
            Gebunden: <strong>{folderLabel}</strong>
          </p>
        )}
      </section>

      <section className="setup-section">
        <h2>Tekto-Starter</h2>
        <p className="hint">Schreibt steer.md, log.md und leere Ordner in den gebundenen Pfad.</p>
        {!canWrite && confirmed && (
          <p className="warn">Schreibzugriff nötig — Ordner in Chrome/Edge erneut wählen.</p>
        )}
        <button
          type="button"
          className="btn primary"
          disabled={!confirmed || !canWrite || installing}
          onClick={() => void writeStarterScaffold()}
        >
          {installing ? 'Schreibe…' : ready ? 'Starter neu schreiben' : 'Starter schreiben'}
        </button>
      </section>

      <section className="setup-section setup-section--muted">
        <h2>CLI (App-Repo)</h2>
        <p className="hint">Skills in die IDE — optional nach Setup:</p>
        <pre className="cmd-block">{exportCmd}</pre>
        <button type="button" className="btn" onClick={() => void copyText(exportCmd).then((ok) => showToast(ok ? 'Kopiert' : 'Fehler'))}>
          Export-Befehl kopieren
        </button>
      </section>

      <div className="phase-actions phase-actions--solo">
        <button type="button" className="btn primary" disabled={!ready} onClick={() => setPhase('project')}>
          Projekt öffnen →
        </button>
      </div>
    </div>
  )
}