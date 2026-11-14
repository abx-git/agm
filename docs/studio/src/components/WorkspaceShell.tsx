import { useStudioStore } from '../store/studio-store'
import type { WorkspaceId } from '../types'
import { workspaceLabel } from '../lib/session-persist'
import { WORKSPACE_HELP } from '../lib/help-content'
import { BrowseMode } from './BrowseMode'
import { HelpTip } from './HelpTip'

interface Props {
  workspace: Exclude<WorkspaceId, 'session' | 'review'>
  title?: string
  lead?: string
}

export function WorkspaceShell({ workspace, title, lead }: Props) {
  const index = useStudioStore((s) => s.index)
  const goSetup = useStudioStore((s) => s.goSetup)
  const openSession = useStudioStore((s) => s.openSession)
  const label = title || workspaceLabel(workspace)
  const help = WORKSPACE_HELP[workspace]

  if (!index) {
    return (
      <div className="phase-panel">
        <h2>{label}</h2>
        <p>Finish Setup, then Reload folder.</p>
        <button type="button" className="btn primary" onClick={() => goSetup()}>
          Go to Setup
        </button>
      </div>
    )
  }

  const hasChapter = [...index.docs.keys()].some(
    (p) => p.endsWith('.md') && !p.endsWith('steer.md') && !p.endsWith('log.md')
  )
  const askLabel = hasChapter ? 'Ask AI · continue' : 'Ask AI · first fill'
  const askIntent = hasChapter ? ('continue' as const) : ('adopt' as const)

  return (
    <div className="review-phase">
      <div className="review-toolbar">
        <div className="review-toolbar-text">
          <p className="review-toolbar-title">
            <strong>{label}</strong>
            <HelpTip label={help.title}>
              <p>{help.summary}</p>
              <ul>
                {help.tips.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </HelpTip>
            <span className="review-toolbar-meta">
              · {index.rootLabel} · {index.docs.size} files
              {lead ? ` — ${lead}` : ''}
            </span>
          </p>
        </div>
        <div className="cmd-row">
          <button type="button" className="btn primary" onClick={() => openSession(askIntent)}>
            {askLabel}
          </button>
        </div>
      </div>
      <BrowseMode workspaceFilter={workspace} embedded />
    </div>
  )
}