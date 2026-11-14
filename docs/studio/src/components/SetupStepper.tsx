import { useStudioStore } from '../store/studio-store'
import { SETUP_STEPS, activeSetupStep, setupStepState, showSetupStepper } from '../lib/setup-flow'

export function SetupStepper() {
  const phase = useStudioStore((s) => s.phase)
  const folderLabel = useStudioStore((s) => s.folderLabel)
  const installStatus = useStudioStore((s) => s.installStatus)

  if (!showSetupStepper(folderLabel, installStatus, phase)) return null

  const active = activeSetupStep(folderLabel, phase)

  return (
    <div className="setup-stepper" aria-label="Setup progress">
      <p className="setup-stepper-lead">
        First-time setup — two steps, then Docs · Review · Composer · Ask AI unlock.
      </p>
      <ol className="setup-stepper-list">
        {SETUP_STEPS.map((step) => {
          const state = setupStepState(step.id, active)
          return (
            <li key={step.id} className={`setup-step setup-step--${state}`}>
              <span className="setup-step-label">{step.label}</span>
              <span className="setup-step-detail">{step.detail}</span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}