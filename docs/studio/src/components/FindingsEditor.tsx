import { useEffect, useState } from 'react'
import type { TektoFinding } from '../lib/findings-yaml'
import {
  newFindingId,
  parseFindingsYaml,
  serializeFindingsYaml,
} from '../lib/findings-yaml'

const SEVERITIES: TektoFinding['severity'][] = ['low', 'medium', 'high', 'critical']
const STATUSES: TektoFinding['status'][] = ['open', 'addressed', 'wontfix']
const CONFIDENCE: NonNullable<TektoFinding['confidence']>[] = ['low', 'medium', 'high']

interface Props {
  path: string
  initialContent: string
  canWrite: boolean
  onSave: (relativePath: string, content: string) => Promise<boolean>
}

export function FindingsEditor({ path, initialContent, canWrite, onSave }: Props) {
  const [findings, setFindings] = useState<TektoFinding[]>(() => parseFindingsYaml(initialContent))
  const [selected, setSelected] = useState(0)
  const [rawMode, setRawMode] = useState(false)
  const [raw, setRaw] = useState(initialContent)

  useEffect(() => {
    setFindings(parseFindingsYaml(initialContent))
    setRaw(initialContent)
    setSelected(0)
  }, [initialContent, path])

  const current = findings[selected]

  const update = (patch: Partial<TektoFinding>) => {
    setFindings((prev) => prev.map((f, i) => (i === selected ? { ...f, ...patch } : f)))
  }

  const addFinding = () => {
    const id = newFindingId(findings)
    const next: TektoFinding = {
      id,
      aspect: 'context',
      severity: 'medium',
      claim: '',
      evidence: [''],
      confidence: 'medium',
      status: 'open',
    }
    setFindings((prev) => [...prev, next])
    setSelected(findings.length)
  }

  const removeFinding = () => {
    if (findings.length <= 1) return
    setFindings((prev) => prev.filter((_, i) => i !== selected))
    setSelected(Math.max(0, selected - 1))
  }

  const save = async () => {
    const body = rawMode ? raw : serializeFindingsYaml(findings)
    const ok = await onSave(path, body)
    if (ok && !rawMode) setRaw(body)
  }

  if (!current && !rawMode) {
    return (
      <div className="findings-editor">
        <p className="muted">No findings parsed.</p>
        <button type="button" className="btn" disabled={!canWrite} onClick={addFinding}>
          Add finding
        </button>
      </div>
    )
  }

  return (
    <div className="findings-editor">
      <div className="findings-editor-toolbar">
        <button type="button" className="btn" disabled={!canWrite} onClick={addFinding}>
          Add finding
        </button>
        <button type="button" className="btn" disabled={!canWrite || findings.length <= 1} onClick={removeFinding}>
          Remove
        </button>
        <button type="button" className="btn subtle" onClick={() => setRawMode((m) => !m)}>
          {rawMode ? 'Form' : 'Raw YAML'}
        </button>
        <button type="button" className="btn primary" disabled={!canWrite} onClick={() => void save()}>
          Save findings.yaml
        </button>
      </div>

      {rawMode ? (
        <textarea
          className="yaml-editor-text"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          rows={20}
          spellCheck={false}
        />
      ) : (
        <>
          <ul className="findings-tabs">
            {findings.map((f, i) => (
              <li key={f.id}>
                <button
                  type="button"
                  className={i === selected ? 'active' : ''}
                  onClick={() => setSelected(i)}
                >
                  {f.id}
                </button>
              </li>
            ))}
          </ul>

          {current && (
            <div className="findings-form">
              <label className="field">
                <span>ID</span>
                <input value={current.id} onChange={(e) => update({ id: e.target.value })} />
              </label>
              <label className="field">
                <span>Aspect</span>
                <input value={current.aspect} onChange={(e) => update({ aspect: e.target.value })} />
              </label>
              <label className="field">
                <span>Severity</span>
                <select
                  value={current.severity}
                  onChange={(e) => update({ severity: e.target.value as TektoFinding['severity'] })}
                >
                  {SEVERITIES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Status</span>
                <select
                  value={current.status}
                  onChange={(e) => update({ status: e.target.value as TektoFinding['status'] })}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Confidence</span>
                <select
                  value={current.confidence || 'medium'}
                  onChange={(e) =>
                    update({ confidence: e.target.value as TektoFinding['confidence'] })
                  }
                >
                  {CONFIDENCE.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Rule (optional)</span>
                <input value={current.rule || ''} onChange={(e) => update({ rule: e.target.value })} />
              </label>
              <label className="field field--full">
                <span>Claim</span>
                <textarea
                  rows={3}
                  value={current.claim}
                  onChange={(e) => update({ claim: e.target.value })}
                />
              </label>
              <label className="field field--full">
                <span>Evidence (one path per line)</span>
                <textarea
                  rows={4}
                  value={current.evidence.join('\n')}
                  onChange={(e) =>
                    update({
                      evidence: e.target.value
                        .split('\n')
                        .map((l) => l.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="src/foo.ts#L10&#10;docs/tekto/..."
                />
              </label>
            </div>
          )}
        </>
      )}
    </div>
  )
}