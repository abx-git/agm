import { useStudioStore } from '../store/studio-store'
import { supportsDirectoryPicker } from '../lib/fs-access'

export function StarterPhase() {
  const setPhase = useStudioStore((s) => s.setPhase)
  const folderLabel = useStudioStore((s) => s.folderLabel)

  return (
    <div className="starter-page">
      <div className="starter-hero">
        <p className="starter-brand">AGM Studio</p>
        <h1>One URL. Your architecture folder. Your AI chat.</h1>
        <p className="starter-lead">
          Open this page, bind a local folder, let Studio write the starter graph, run sessions by
          pasting prompts into Cursor (or similar), then spike and review here — nothing to download.
        </p>
        <div className="starter-cta">
          <button
            type="button"
            className="btn primary"
            onClick={() => setPhase(folderLabel ? 'run' : 'connect')}
          >
            {folderLabel ? 'Continue journey' : 'Get started'}
          </button>
          <button type="button" className="btn" onClick={() => setPhase('about')}>
            What is AGM?
          </button>
          {folderLabel && (
            <button type="button" className="btn" onClick={() => setPhase('connect')}>
              Project settings
            </button>
          )}
        </div>
      </div>

      <section className="starter-section" aria-labelledby="starter-before">
        <h2 id="starter-before">What you need</h2>
        <ul className="starter-list">
          <li>
            <strong>This page</strong> in Chrome, Edge, or Brave (write access to a folder).
          </li>
          <li>
            <strong>A local folder</strong> — usually <code>docs/architecture</code> (empty is fine).
          </li>
          <li>
            <strong>An AI chat on the same repo</strong> — Cursor, Claude, or Copilot — only to run
            the prompts Studio copies for you.
          </li>
        </ul>
        {!supportsDirectoryPicker() && (
          <p className="starter-note">
            This browser cannot grant folder write access. Use Chrome, Edge, or Brave for the full
            Studio journey.
          </p>
        )}
      </section>

      <section className="starter-section" aria-labelledby="starter-flow">
        <h2 id="starter-flow">The journey</h2>
        <ol className="starter-flow">
          <li>
            <span className="starter-flow-step">Connect</span>
            <span className="starter-flow-body">
              Name the project and bind the architecture folder with edit permission.
            </span>
          </li>
          <li>
            <span className="starter-flow-step">Install</span>
            <span className="starter-flow-body">
              One click writes the AGM starter into that folder (browser only).
            </span>
          </li>
          <li>
            <span className="starter-flow-step">Run</span>
            <span className="starter-flow-body">
              Copy a session prompt → paste into a new AI chat on the repo. The agent writes docs;
              Studio does not run the model.
            </span>
          </li>
          <li>
            <span className="starter-flow-step">Spike</span>
            <span className="starter-flow-body">
              Create spikes, edit notes, lean-edit Event Storming boards in Studio.
            </span>
          </li>
          <li>
            <span className="starter-flow-step">Review</span>
            <span className="starter-flow-body">
              Browse the Markdown graph, Mermaid, and boards.
            </span>
          </li>
        </ol>
      </section>

      <section className="starter-section starter-diagram" aria-labelledby="starter-loop">
        <h2 id="starter-loop">The loop</h2>
        <div
          className="starter-loop"
          role="img"
          aria-label="Studio binds folder; AI chat writes docs; Studio reviews"
        >
          <div className="starter-loop-node">
            <strong>AGM Studio</strong>
            <span>URL · install · spike · review</span>
          </div>
          <div className="starter-loop-arrow" aria-hidden="true">
            ↔
          </div>
          <div className="starter-loop-node">
            <strong>Local folder</strong>
            <span>docs/architecture</span>
          </div>
          <div className="starter-loop-arrow" aria-hidden="true">
            ↔
          </div>
          <div className="starter-loop-node">
            <strong>AI chat</strong>
            <span>paste prompt from Run</span>
          </div>
        </div>
        <p className="starter-section-lead">
          Docs never leave your machine for Studio. No AGM CLI install for this path.
        </p>
      </section>

      <div className="starter-cta starter-cta--footer">
        <button type="button" className="btn" onClick={() => setPhase('about')}>
          What is AGM?
        </button>
        <button
          type="button"
          className="btn primary"
          onClick={() => setPhase(folderLabel ? 'run' : 'connect')}
        >
          {folderLabel ? 'Continue journey' : 'Get started — Connect'}
        </button>
      </div>
    </div>
  )
}
