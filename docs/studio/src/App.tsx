import { useEffect } from 'react'
import { useStudioStore } from './store/studio-store'
import { ProjectBar, JourneyRail } from './components/ProjectBar'
import { StarterPhase } from './components/StarterPhase'
import { ConnectPhase } from './components/ConnectPhase'
import { InstallPhase } from './components/InstallPhase'
import { RunPhase } from './components/RunPhase'
import { SpikePhase } from './components/SpikePhase'
import { ReviewPhase } from './components/ReviewPhase'
import './App.css'

export default function App() {
  const phase = useStudioStore((s) => s.phase)
  const error = useStudioStore((s) => s.error)
  const toast = useStudioStore((s) => s.toast)
  const tryRestoreFolder = useStudioStore((s) => s.tryRestoreFolder)

  useEffect(() => {
    void tryRestoreFolder()
  }, [tryRestoreFolder])

  const showRail = phase !== 'start'

  return (
    <div className={`studio${phase === 'start' ? ' studio--starter' : ''}`}>
      <ProjectBar />
      {showRail && <JourneyRail />}
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
      <div
        className={`studio-body${phase === 'review' || phase === 'spike' ? ' studio-body--wide' : ''}${phase === 'start' ? ' studio-body--starter' : ''}`}
      >
        {phase === 'start' && <StarterPhase />}
        {phase === 'connect' && <ConnectPhase />}
        {phase === 'install' && <InstallPhase />}
        {phase === 'run' && <RunPhase />}
        {phase === 'spike' && <SpikePhase />}
        {phase === 'review' && <ReviewPhase />}
      </div>
    </div>
  )
}
