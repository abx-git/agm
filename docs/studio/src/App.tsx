import { useEffect } from 'react'
import { useStudioStore } from './store/studio-store'
import { ProjectBar } from './components/ProjectBar'
import { WhatIsTektoPhase } from './components/WhatIsTektoPhase'
import { StarterPhase } from './components/StarterPhase'
import { SetupPhase } from './components/SetupPhase'
import { ProjectPhase } from './components/ProjectPhase'
import { HelpDrawer } from './components/HelpDrawer'
import './App.css'

function formatReleaseTime(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return new Intl.DateTimeFormat('de-DE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
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
        Tekto-Doku (Pages)
      </a>
      <span aria-hidden="true"> · </span>
      <span>Build {released}</span>
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
  const wide = phase === 'project' || phase === 'setup'

  return (
    <div className={`studio${introPhase ? ' studio--starter' : ''}`}>
      <ProjectBar />
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
      {restoring && phase === 'setup' && !error ? (
        <div className="studio-toast" role="status">
          Ordner wird wiederhergestellt…
        </div>
      ) : null}
      <div
        className={`studio-body${wide ? ' studio-body--wide' : ''}${introPhase ? ' studio-body--starter' : ''}`}
      >
        {phase === 'about' && <WhatIsTektoPhase />}
        {phase === 'start' && <StarterPhase />}
        {phase === 'setup' && <SetupPhase />}
        {phase === 'project' && <ProjectPhase />}
      </div>
      <SiteFooter />
    </div>
  )
}