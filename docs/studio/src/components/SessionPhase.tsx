import { useEffect, useMemo, useState } from 'react'
import { useStudioStore } from '../store/studio-store'
import type { SessionIntent, WorkflowEntry } from '../types'
import { buildAdoptPrompt, copyText, personalizeWorkflowPrompt } from '../lib/personalize'
import { buildContextPack, formatContextPackBlock } from '../lib/context-pack'
import { HelpTip } from './HelpTip'
import workflowCatalog from '../catalog/workflows.json'
import adoptPromptBase from '../catalog/adopt-prompt.txt?raw'

type RunStep = SessionIntent

function aiLabel(tool: string): string {
  if (tool === 'cursor') return 'Cursor'
  if (tool === 'claude') return 'Claude'
  if (tool === 'copilot') return 'Copilot'
  if (tool === 'kiro') return 'Kiro'
  return 'your AI chat'
}

export function SessionPhase() {
  const project = useStudioStore((s) => s.project)
  const goSetup = useStudioStore((s) => s.goSetup)
  const leaveSession = useStudioStore((s) => s.leaveSession)
  const sessionIntent = useStudioStore((s) => s.sessionIntent)
  const folderLabel = useStudioStore((s) => s.folderLabel)
  const installStatus = useStudioStore((s) => s.installStatus)
  const index = useStudioStore((s) => s.index)
  const contextPins = useStudioStore((s) => s.contextPins)
  const showToast = useStudioStore((s) => s.showToast)

  const [step, setStep] = useState<RunStep>('continue')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    if (sessionIntent) setStep(sessionIntent)
  }, [sessionIntent])

  const tool = aiLabel(project.aiTool || 'cursor')
  const byId = (id: string) => (workflowCatalog as WorkflowEntry[]).find((w) => w.id === id)

  const activePath = useStudioStore((s) => s.activePath)
  const packBlock = useMemo(() => {
    if (!index) return ''
    const pack = buildContextPack({
      index,
      activePath,
      pins: contextPins,
      docFocus: [],
      includeOnDemand: false,
    })
    return formatContextPackBlock(pack, project)
  }, [index, contextPins, activePath, project])

  const adoptText = useMemo(
    () => buildAdoptPrompt(adoptPromptBase, project, packBlock),
    [project, packBlock]
  )

  const continueWf = byId('tekto-understand')
  const continueText = useMemo(() => {
    if (!continueWf) return adoptText
    return personalizeWorkflowPrompt(continueWf, project, {}, packBlock)
  }, [continueWf, project, packBlock, adoptText])

  const evolveWf = byId('tekto-evolve')
  const evolveText = evolveWf
    ? personalizeWorkflowPrompt(evolveWf, project, {}, packBlock)
    : 'Use skill evolve-sync with current git diff.'

  const verifyWf = byId('tekto-review-security')
  const verifyText = verifyWf
    ? personalizeWorkflowPrompt(verifyWf, project, {}, packBlock)
    : 'Run tekto packet aspect security in CLI; paste into fresh chat.'

  const aspectWf = byId('tekto-review-security')
  const aspectText = aspectWf
    ? personalizeWorkflowPrompt(aspectWf, project, {}, packBlock)
    : verifyText

  const copyOut = async (text: string) => {
    const ok = await copyText(text)
    showToast(ok ? `Copied — open ${tool}, new chat, paste` : 'Copy failed')
  }

  const primary = installStatus === 'ready' ? continueText : adoptText
  const stepText =
    step === 'adopt'
      ? adoptText
      : step === 'continue'
        ? continueText
        : step === 'evolve'
          ? evolveText
          : step === 'verify'
            ? verifyText
            : step === 'aspect'
              ? aspectText
              : primary

  if (!folderLabel) {
    return (
      <div className="phase-panel">
        <h2>Ask AI</h2>
        <p>Finish Setup first.</p>
        <button type="button" className="btn primary" onClick={() => goSetup()}>
          Go to Setup
        </button>
      </div>
    )
  }

  const steps: { id: RunStep; label: string }[] = [
    { id: 'continue', label: 'Continue (understand)' },
    { id: 'adopt', label: 'First fill' },
    { id: 'aspect', label: 'Review aspect' },
    { id: 'evolve', label: 'Sync from code' },
    { id: 'verify', label: 'Review / verify' },
  ]

  return (
    <div className="phase-panel run-phase">
      <h2>
        Ask AI{' '}
        <HelpTip label="Ask AI">
          <p>Copy a Tekto prompt into {tool}. Studio does not call an LLM.</p>
        </HelpTip>
      </h2>
      <div className="run-step-picker">
        {steps.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`btn${step === s.id ? ' active' : ''}`}
            onClick={() => setStep(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div className="run-prompt-preview">
        <pre>{stepText.slice(0, 4000)}</pre>
      </div>
      <div className="cmd-row">
        <button type="button" className="btn primary" onClick={() => void copyOut(stepText)}>
          Copy for {tool}
        </button>
        <button type="button" className="btn" onClick={() => leaveSession()}>
          Zurück zum Projekt
        </button>
      </div>
      {workflowCatalog.length > 1 && (
        <details className="run-more">
          <summary>All Tekto prompts</summary>
          <ul>
            {(workflowCatalog as WorkflowEntry[]).map((w) => (
              <li key={w.id}>
                <button
                  type="button"
                  className="linkish"
                  onClick={() => {
                    setSelectedId(w.id)
                    void copyOut(personalizeWorkflowPrompt(w, project, {}, packBlock))
                  }}
                >
                  {w.id}
                </button>
              </li>
            ))}
          </ul>
        </details>
      )}
      {selectedId ? <p className="muted">Copied: {selectedId}</p> : null}
    </div>
  )
}