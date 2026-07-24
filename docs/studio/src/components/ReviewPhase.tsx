import { useStudioStore } from '../store/studio-store'
import { BrowseMode } from './BrowseMode'

/** Review = Browse stack bound to the connected folder. */
export function ReviewPhase() {
  const index = useStudioStore((s) => s.index)
  const setPhase = useStudioStore((s) => s.setPhase)
  const refreshIndex = useStudioStore((s) => s.refreshIndex)
  const opening = useStudioStore((s) => s.opening)

  if (!index) {
    return (
      <div className="phase-panel">
        <h2>Review</h2>
        <p>No architecture index yet. Connect a folder and install (or refresh after the agent writes files).</p>
        <div className="cmd-row">
          <button type="button" className="btn primary" onClick={() => setPhase('connect')}>
            Go to Connect
          </button>
          <button type="button" className="btn" onClick={() => setPhase('run')}>
            Back to Run
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="review-phase">
      <div className="review-toolbar">
        <p>
          Reviewing <strong>{index.rootLabel}</strong> · {index.docs.size} files — same folder as Connect.
        </p>
        <div className="cmd-row">
          <button type="button" className="btn" disabled={opening} onClick={() => refreshIndex()}>
            Refresh from folder
          </button>
          <button type="button" className="btn" onClick={() => setPhase('run')}>
            Back to Run
          </button>
        </div>
      </div>
      <BrowseMode embedded />
    </div>
  )
}
