import { useEffect } from 'react'
import { useStudioStore } from './store/studio-store'
import { ProjectBar, JourneyRail } from './components/ProjectBar'
import { WhatIsTektoPhase } from './components/WhatIsTektoPhase'
import { StarterPhase } from './components/StarterPhase'
import { ConnectPhase } from './components/ConnectPhase'
import { InstallPhase } from './components/InstallPhase'
import { SessionPhase } from './components/SessionPhase'
import { WorkspaceShell } from './components/WorkspaceShell'
import { ReviewsPanel } from './components/ReviewsPanel'
import { ComposePhase } from './components/ComposePhase'
import { NextStepBanner } from './components/NextStepBanner'
import { HelpDrawer } from './components/HelpDrawer'
import './App.css'

function formatReleaseTime(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(d)
}

function pagesDocsHref(): string {
  const base = import.meta.env.BASE_URL ?? './'
  return `${base}docs/index.html`
}

function SiteFooter() {
  const released = formatReleaseTime(__TEKTO_BUILD_TIME__)
  return (
    <footer className="studio-site-footer">
      <a href={pagesDocsHref()} className="studio-site-footer-link">
        Tekto docs (Pages)
      </a>
      <span aria-hidden="true"> · </span>
      <span>Released {released}</span>
      <span aria-hidden="true"> · </span>
      <span>© Andreas Bergmann, Hamburg, Germany</span>
    </footer>
  )
}

export default function App() {
  const phase = useStudioStore((s) => s.phase)
  const error = useStudioStore((s) => s.error)
  const toast = useStudioStore((s) => s.toast)
  const restoring = useStudioStore((s) => s.restoring)
  const tryRestoreFolder = useStudioStore((s) => s.tryRestoreFolder)

  useEffect(() => {
    void tryRestoreFolder()
  }, [tryRestoreFolder])

  const introPhase = phase === 'about' || phase === 'start'
  const showRail = !introPhase
  const wide = phase === 'architecture' || phase === 'review' || phase === 'compose'

  return (
    <div className={`studio${introPhase ? ' studio--starter' : ''}`}>
      <ProjectBar />
      {showRail && <JourneyRail />}
      {showRail && <NextStepBanner />}
      <HelpDrawer />
      {error && (
        <div className="studio-error" role="alert">
          {error}
        </div>
      )}
      {toast && (
        <div className="studio-toast" role="status">
          {toast}
        </div>
      )}
      {restoring && introPhase === false && phase === 'connect' && !error ? (
        <div className="studio-toast" role="status">
          Restoring folder…
        </div>
      ) : null}
      <div
        className={`studio-body${wide ? ' studio-body--wide' : ''}${introPhase ? ' studio-body--starter' : ''}`}
      >
        {phase === 'about' && <WhatIsTektoPhase />}
        {phase === 'start' && <StarterPhase />}
        {phase === 'connect' && <ConnectPhase />}
        {phase === 'install' && <InstallPhase />}
        {phase === 'architecture' && (
          <WorkspaceShell workspace="architecture" lead="Tekto docs in Git" />
        )}
        {phase === 'review' && <ReviewsPanel />}
        {phase === 'compose' && <ComposePhase />}
        {phase === 'session' && <SessionPhase />}
      </div>
      <SiteFooter />
    </div>
  )
}