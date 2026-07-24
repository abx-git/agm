import { useStudioStore } from '../store/studio-store'
import { supportsDirectoryPicker } from '../lib/fs-access'

export function ConnectPhase() {
  const project = useStudioStore((s) => s.project)
  const setProject = useStudioStore((s) => s.setProject)
  const setPhase = useStudioStore((s) => s.setPhase)
  const folderLabel = useStudioStore((s) => s.folderLabel)
  const connectFolder = useStudioStore((s) => s.connectFolder)
  const connectFolderFallback = useStudioStore((s) => s.connectFolderFallback)
  const opening = useStudioStore((s) => s.opening)
  const installStatus = useStudioStore((s) => s.installStatus)

  const continueNext = () => {
    if (!folderLabel) return
    setPhase(installStatus === 'ready' ? 'run' : 'install')
  }

  return (
    <div className="phase-panel connect-phase">
      <h2>Connect your project</h2>
      <p className="lead">
        Name the application, pick a documentation template, then bind the local folder where the
        architecture graph lives (or will be created) — typically <code>docs/architecture</code>.
      </p>

      <div className="form-grid">
        <label className="field">
          <span>Project name</span>
          <input
            type="text"
            value={project.appName}
            onChange={(e) => setProject({ appName: e.target.value })}
            placeholder="e.g. Order Service"
            required
          />
        </label>

        <label className="field">
          <span>Documentation template</span>
          <select
            value={project.template}
            onChange={(e) => setProject({ template: e.target.value })}
          >
            <option value="arc42">arc42 (default)</option>
            <option value="lean-service">lean-service</option>
            <option value="c4-light">c4-light</option>
            <option value="adr-first">adr-first</option>
            <option value="custom">custom</option>
          </select>
        </label>

        {project.template === 'custom' && (
          <label className="field">
            <span>Custom template name</span>
            <input
              type="text"
              value={project.customTemplate}
              onChange={(e) => setProject({ customTemplate: e.target.value })}
              placeholder="e.g. internal-standard"
            />
          </label>
        )}

        <label className="field">
          <span>Documentation root (relative to repo)</span>
          <input
            type="text"
            value={project.docRoot}
            onChange={(e) => setProject({ docRoot: e.target.value })}
          />
        </label>

        <label className="field">
          <span>AI chat (for Run prompts)</span>
          <select value={project.aiTool} onChange={(e) => setProject({ aiTool: e.target.value })}>
            <option value="cursor">Cursor</option>
            <option value="claude">Claude</option>
            <option value="copilot">Copilot / VS Code</option>
            <option value="generic">Other</option>
          </select>
        </label>

        <label className="field">
          <span>Purpose / domain (optional)</span>
          <input
            type="text"
            value={project.purpose}
            onChange={(e) => setProject({ purpose: e.target.value })}
            placeholder="One sentence"
          />
        </label>

        <label className="field">
          <span>Stack (optional)</span>
          <input
            type="text"
            value={project.stack}
            onChange={(e) => setProject({ stack: e.target.value })}
            placeholder="e.g. TypeScript / Node.js"
          />
        </label>
      </div>

      <div className="connect-folder-block">
        <h3>Architecture folder</h3>
        <p className="hint">
          {supportsDirectoryPicker()
            ? 'Allow edit access so Studio can install the starter and save spikes in this folder.'
            : 'This browser cannot grant write access. Use Chrome, Edge, or Brave.'}
        </p>
        <button
          type="button"
          className="btn primary"
          disabled={opening || !supportsDirectoryPicker()}
          onClick={() => connectFolder()}
        >
          {opening ? 'Opening…' : folderLabel ? `Bound: ${folderLabel}` : 'Choose architecture folder'}
        </button>
        {!supportsDirectoryPicker() && (
          <button
            type="button"
            className="btn"
            disabled={opening}
            onClick={() => connectFolderFallback()}
            style={{ marginLeft: '0.5rem' }}
          >
            Open read-only (limited)
          </button>
        )}
        {folderLabel && (
          <p className="status-line">
            Detected install status: <strong>{installStatus}</strong>
          </p>
        )}
      </div>

      <div className="phase-actions">
        <button type="button" className="btn primary" disabled={!folderLabel} onClick={continueNext}>
          Continue
        </button>
      </div>
    </div>
  )
}
