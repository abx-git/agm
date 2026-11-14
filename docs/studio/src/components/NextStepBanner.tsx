import { useStudioStore } from '../store/studio-store'

export function NextStepBanner() {
  const phase = useStudioStore((s) => s.phase)
  const folderLabel = useStudioStore((s) => s.folderLabel)
  const installStatus = useStudioStore((s) => s.installStatus)
  const goSetup = useStudioStore((s) => s.goSetup)
  const setPhase = useStudioStore((s) => s.setPhase)
  const openSession = useStudioStore((s) => s.openSession)
  const refreshIndex = useStudioStore((s) => s.refreshIndex)
  const index = useStudioStore((s) => s.index)

  const setupDone = Boolean(folderLabel) && installStatus === 'ready'

  let text: string
  let actionLabel: string | null = null
  let onAction: (() => void) | null = null

  if (!setupDone) {
    text = 'Connect docs/tekto (or your doc root) and write steer.md + log.md.'
    actionLabel = 'Continue Setup'
    onAction = () => goSetup()
  } else if (phase === 'session') {
    text = 'Copy packet → new AI chat → Reload folder after edits.'
    actionLabel = 'Reload folder'
    onAction = () => void refreshIndex()
  } else if (phase === 'review') {
    text = 'Browse findings and threads; run review-revise in a fresh chat.'
    actionLabel = 'Ask AI'
    onAction = () => openSession('verify')
  } else if (phase === 'architecture') {
    const hasChapter = Boolean(
      index &&
        [...index.docs.keys()].some(
          (p) => p.endsWith('.md') && !p.endsWith('steer.md') && !p.endsWith('log.md') && !p.endsWith('index.md')
        )
    )
    text = hasChapter
      ? 'Continue from steer.md ## Now or extend chapters.'
      : 'Start with understand skill or Ask AI · first fill.'
    actionLabel = hasChapter ? 'Ask AI · continue' : 'Ask AI · first fill'
    onAction = () => openSession(hasChapter ? 'continue' : 'adopt')
  } else {
    text = 'Open Docs to browse Tekto files.'
    actionLabel = 'Open Docs'
    onAction = () => setPhase('architecture')
  }

  return (
    <div className="next-step-banner" role="status">
      <span>{text}</span>
      {actionLabel && onAction ? (
        <button type="button" className="btn primary compact" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  )
}