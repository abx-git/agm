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
        Choose a folder, optionally add a subfolder. That path is where Studio reads/writes docs and
        what Run prompts use.
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
        <h3>Folder</h3>
        <ol className="connect-steps">
          <li>Choose a folder (e.g. the repo root, or the docs folder itself).</li>
          <li>
            Optional: enter a subfolder under it. That path is used in prompts and as the docs
            location.
          </li>
        </ol>

        <label className="field connect-doc-root">
          <span>Subfolder (optional)</span>
          <input
            type="text"
            value={project.docRoot}
            onChange={(e) => setProject({ docRoot: e.target.value })}
            placeholder="docs/architecture/"
          />
          <span className="hint">
            Example: pick the Git repo, set <code>docs/architecture/</code>. Leave empty if the
            folder you pick <em>is</em> already the documentation root (prompts then use that
            folder&apos;s name).
          </span>
        </label>

        <button
          type="button"
          className="btn primary"
          disabled={opening || !supportsDirectoryPicker()}
          onClick={() => connectFolder()}
        >
          {opening ? 'Opening…' : folderLabel ? `Bound: ${folderLabel}` : 'Choose folder'}
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
            Prompt path: <strong>{project.docRoot}</strong>
            {' · '}
            Install: <strong>{installStatus}</strong>
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
