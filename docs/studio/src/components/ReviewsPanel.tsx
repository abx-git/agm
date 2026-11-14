import { useMemo, useState } from 'react'
import { useStudioStore } from '../store/studio-store'
import { DocViewer } from './DocViewer'
import { FindingsEditor } from './FindingsEditor'
import { HelpTip } from './HelpTip'

export function ReviewsPanel() {
  const canWrite = useStudioStore((s) => s.canWrite)
  const reviews = useStudioStore((s) => s.reviews)
  const index = useStudioStore((s) => s.index)
  const activeSpikePath = useStudioStore((s) => s.activeSpikePath)
  const setActiveSpikePath = useStudioStore((s) => s.setActiveSpikePath)
  const activePath = useStudioStore((s) => s.activePath)
  const setActivePath = useStudioStore((s) => s.setActivePath)
  const createReview = useStudioStore((s) => s.createReview)
  const saveSpikeFile = useStudioStore((s) => s.saveSpikeFile)
  const openSession = useStudioStore((s) => s.openSession)

  const [showCreate, setShowCreate] = useState(false)
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [yamlDraft, setYamlDraft] = useState('')

  const isReviewFolder = Boolean(activeSpikePath?.includes('/reviews/'))
  const reviewFiles = useMemo(() => {
    if (!index || !activeSpikePath || !isReviewFolder) return []
    return [...index.docs.values()]
      .filter((d) => d.path === activeSpikePath || d.path.startsWith(activeSpikePath + '/'))
      .sort((a, b) => a.path.localeCompare(b.path))
  }, [index, activeSpikePath, isReviewFolder])

  const activeDoc = index && activePath ? index.docs.get(activePath) : null
  const threadsPath = activeSpikePath ? `${activeSpikePath}/threads.yaml` : ''
  const isThreads = activePath === threadsPath
  const findingsPath = activeSpikePath ? `${activeSpikePath}/findings.yaml` : ''
  const isFindings = activePath === findingsPath

  const openThreads = () => {
    if (!threadsPath || !index) return
    setActivePath(threadsPath)
    const content = index.docs.get(threadsPath)?.content ?? 'threads: []\n'
    setYamlDraft(content)
  }

  return (
    <div className="reviews-panel spike-phase">
      <aside className="spike-sidebar">
        <div className="spike-sidebar-head">
          <h2>
            Review{' '}
            <HelpTip label="Review">
              <p>Tekto reviews live under <code>reviews/&lt;id&gt;/</code> with findings.yaml and threads.yaml.</p>
              <p>Use Ask AI → Review aspect, or <code>tekto packet revise &lt;id&gt;</code> in a fresh chat.</p>
            </HelpTip>
          </h2>
          <button
            type="button"
            className="btn"
            disabled={!canWrite}
            onClick={() => setShowCreate(true)}
          >
            New review
          </button>
        </div>

        <ul className="spike-list">
          {reviews.length === 0 && <li className="muted">No reviews yet.</li>}
          {reviews.map((r) => (
            <li key={r.path}>
              <button
                type="button"
                className={activeSpikePath === r.path ? 'active' : ''}
                onClick={() => {
                  setActiveSpikePath(r.path)
                  setActivePath(`${r.path}/findings.yaml`)
                }}
              >
                <span className="spike-id">{r.id}</span>
                <span className="spike-title">{r.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <section className="spike-main">
        {showCreate && (
          <div className="spike-create-dialog">
            <h3>New review</h3>
            <label className="field">
              <span>Title</span>
              <input value={title} onChange={(e) => setTitle(e.target.value)} />
            </label>
            <label className="field">
              <span>Slug (optional)</span>
              <input value={slug} onChange={(e) => setSlug(e.target.value)} />
            </label>
            <div className="cmd-row">
              <button
                type="button"
                className="btn primary"
                disabled={!title.trim() || !canWrite}
                onClick={async () => {
                  const folder = await createReview({ title: title.trim(), slug })
                  if (folder) {
                    setShowCreate(false)
                    setTitle('')
                    setSlug('')
                  }
                }}
              >
                Create
              </button>
              <button type="button" className="btn" onClick={() => setShowCreate(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {!showCreate && !isReviewFolder && (
          <div className="phase-panel">
            <h2>Tekto review workflow</h2>
            <ol className="reviews-howto reviews-howto--main">
              <li>Create a review folder (findings.yaml + threads.yaml).</li>
              <li>Ask AI → Review aspect — paste packet into a new chat.</li>
              <li>Edit threads here; run review-revise / review-summarize in another chat.</li>
            </ol>
            <button type="button" className="btn primary" onClick={() => openSession('aspect')}>
              Ask AI · review aspect
            </button>
          </div>
        )}

        {isReviewFolder && activeSpikePath && (
          <div className="spike-workspace">
            <div className="spike-files">
              <h3>{activeSpikePath.split('/').pop()}</h3>
              <ul>
                <li>
                  <button type="button" className={activePath === findingsPath ? 'active' : ''} onClick={() => setActivePath(findingsPath)}>
                    findings.yaml
                  </button>
                </li>
                <li>
                  <button type="button" className={isThreads ? 'active' : ''} onClick={openThreads}>
                    threads.yaml
                  </button>
                </li>
                {reviewFiles
                  .filter((f) => f.path.endsWith('report.md'))
                  .map((f) => (
                    <li key={f.path}>
                      <button
                        type="button"
                        className={activePath === f.path ? 'active' : ''}
                        onClick={() => setActivePath(f.path)}
                      >
                        report.md
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
            <div className="spike-doc">
              {isThreads ? (
                <div className="yaml-editor">
                  <textarea
                    className="yaml-editor-text"
                    value={yamlDraft}
                    onChange={(e) => setYamlDraft(e.target.value)}
                    rows={18}
                    spellCheck={false}
                  />
                  <button
                    type="button"
                    className="btn primary"
                    disabled={!canWrite}
                    onClick={() => void saveSpikeFile(threadsPath, yamlDraft)}
                  >
                    Save threads.yaml
                  </button>
                </div>
              ) : isFindings && activeDoc ? (
                <FindingsEditor
                  path={findingsPath}
                  initialContent={activeDoc.content}
                  canWrite={canWrite}
                  onSave={saveSpikeFile}
                />
              ) : activeDoc?.path.endsWith('.yaml') ? (
                <pre className="yaml-raw">{activeDoc.content}</pre>
              ) : activeDoc ? (
                <DocViewer
                  doc={activeDoc}
                  allDocs={index!.docs}
                  onNavigate={(p) => setActivePath(p)}
                  onOpenStorm={() => undefined}
                  onPinPath={() => undefined}
                />
              ) : (
                <p className="muted">Select findings, threads, or report.</p>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  )
}