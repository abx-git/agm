import { useStudioStore } from '../store/studio-store'
import { copyText } from '../lib/personalize'

const TOOLS = [
  { id: 'cursor', label: 'Cursor' },
  { id: 'claude', label: 'Claude Code' },
  { id: 'copilot', label: 'GitHub Copilot' },
  { id: 'kiro', label: 'Kiro' },
  { id: 'generic', label: 'Other (AGENTS.md)' },
] as const

export function ComposePhase() {
  const project = useStudioStore((s) => s.project)
  const showToast = useStudioStore((s) => s.showToast)
  const aiTool = (project.aiTool || 'cursor') as (typeof TOOLS)[number]['id']

  const initCmd = `npx @abx-hh/tekto init --project "${project.appName || 'Application'}" --doc-root "${project.docRoot || 'docs/tekto/'}" --ai-tool ${aiTool}`
  const exportCmd = `npx @abx-hh/tekto export --ai-tool ${aiTool}`
  const checkCmd = `npx @abx-hh/tekto check`

  const copy = async (text: string, label: string) => {
    const ok = await copyText(text)
    showToast(ok ? `Copied: ${label}` : 'Copy failed')
  }

  return (
    <div className="phase-panel">
      <h2>Composer — tool bundle</h2>
      <p className="lead">
        Run these in your <strong>application repo root</strong> (not the Tekto product repo). Studio
        only prepares commands — it does not run the CLI.
      </p>

      <div className="install-card">
        <h3>1. Init Tekto doc root</h3>
        <pre className="cmd-block">{initCmd}</pre>
        <button type="button" className="btn" onClick={() => void copy(initCmd, 'init')}>
          Copy init
        </button>
      </div>

      <div className="install-card">
        <h3>2. Export skills + rules</h3>
        <p className="hint">After changing packs or AI tool:</p>
        <pre className="cmd-block">{exportCmd}</pre>
        <button type="button" className="btn primary" onClick={() => void copy(exportCmd, 'export')}>
          Copy export
        </button>
      </div>

      <div className="install-card">
        <h3>3. Validate (CI)</h3>
        <pre className="cmd-block">{checkCmd}</pre>
        <button type="button" className="btn" onClick={() => void copy(checkCmd, 'check')}>
          Copy check
        </button>
      </div>

      <p className="hint">
        AI targets: <strong>Cursor</strong>, <strong>Claude</strong>, <strong>Copilot</strong>,{' '}
        <strong>Kiro</strong>, <strong>generic</strong> (AGENTS.md).
      </p>
    </div>
  )
}