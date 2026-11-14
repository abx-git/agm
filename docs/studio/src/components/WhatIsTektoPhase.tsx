import { useStudioStore } from '../store/studio-store'

export function WhatIsTektoPhase() {
  const setPhase = useStudioStore((s) => s.setPhase)
  const goSetup = useStudioStore((s) => s.goSetup)
  const folderLabel = useStudioStore((s) => s.folderLabel)
  const installStatus = useStudioStore((s) => s.installStatus)
  const ready = Boolean(folderLabel) && installStatus === 'ready'

  return (
    <div className="starter-page about-page">
      <div className="starter-hero">
        <p className="starter-brand">Tekto</p>
        <h1>What is Tekto?</h1>
        <p className="starter-lead">
          A lightweight way to do architecture work with AI agents: evidence in Git, review aspects,
          steer.md for navigation, log.md for audit.
        </p>
      </div>

      <section className="starter-section">
        <h2>Studio</h2>
        <p className="about-prose">
          Tekto Studio binds your <code>docs/tekto/</code> folder, shows files, edits review threads,
          and copies prompts — it never calls an LLM itself.
        </p>
      </section>

      <section className="starter-section">
        <h2>CLI</h2>
        <p className="about-prose">
          <code>tekto init</code>, <code>export</code>, <code>check</code>, <code>packet</code> run in
          your app repo. MCP exposes the same data to agents.
        </p>
      </section>

      <section className="starter-section">
        <h2>Documentation on Pages</h2>
        <p className="about-prose">
          Quickstart, positioning, and reference ship with this site under{' '}
          <a href="./docs/index.html">docs/</a> (same build as Studio).
        </p>
      </section>

      <div className="starter-cta starter-cta--footer">
        <button type="button" className="btn primary" onClick={() => (ready ? setPhase('architecture') : goSetup())}>
          {ready ? 'Open Docs' : 'Start Setup'}
        </button>
        <a className="btn" href="./docs/index.html">
          Read docs
        </a>
        <button type="button" className="btn" onClick={() => setPhase('start')}>
          Back
        </button>
      </div>
    </div>
  )
}