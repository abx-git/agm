import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import {
  parseBoardJson,
  serializeBoardJson,
  styleForType,
  newElementId,
  type BoardDocument,
  type BoardView,
  type StormElement,
} from '../lib/e2/storm'

const PALETTE = [
  'domainEvent',
  'command',
  'actor',
  'aggregate',
  'policy',
  'readModel',
  'externalSystem',
  'note',
  'hotspot',
] as const

interface Props {
  jsonText: string
  title?: string
  editable?: boolean
  onSave?: (json: string) => void | Promise<void>
}

function elementSize(el: StormElement) {
  const s = styleForType(el.type)
  return {
    w: el.width ?? s.defaultWidth,
    h: el.height ?? s.defaultHeight,
  }
}

function ConnectorLayer({ view }: { view: BoardView }) {
  const byId = new Map(view.elements.map((e) => [e.id, e]))
  return (
    <svg className="e2-connectors" width="4000" height="3000">
      {view.relations.map((rel) => {
        const a = byId.get(rel.sourceId)
        const b = byId.get(rel.targetId)
        if (!a || !b) return null
        const as = elementSize(a)
        const bs = elementSize(b)
        const x1 = a.x + as.w / 2
        const y1 = a.y + as.h / 2
        const x2 = b.x + bs.w / 2
        const y2 = b.y + bs.h / 2
        return (
          <g key={rel.id}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} className="e2-rel" />
            {rel.label && (
              <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 4} className="e2-rel-label">
                {rel.label}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

function Sticky({
  el,
  editable,
  selected,
  onSelect,
  onMove,
  onLabel,
}: {
  el: StormElement
  editable?: boolean
  selected?: boolean
  onSelect?: () => void
  onMove?: (x: number, y: number) => void
  onLabel?: (label: string) => void
}) {
  const style = styleForType(el.type)
  const { w, h } = elementSize(el)
  const radius = style.shape === 'pill' ? 999 : style.shape === 'rectangle' ? 4 : 10
  const rot = el.rotation ?? style.rotation ?? 0
  const drag = useRef<{ px: number; py: number; ox: number; oy: number } | null>(null)

  return (
    <div
      className={`e2-sticky${selected ? ' selected' : ''}`}
      style={{
        left: el.x,
        top: el.y,
        width: w,
        height: h,
        background: style.fill,
        borderColor: style.stroke,
        color: style.ink,
        borderRadius: radius,
        transform: rot ? `rotate(${rot}deg)` : undefined,
        cursor: editable ? 'grab' : undefined,
      }}
      title={`${style.label}: ${el.label}`}
      onPointerDown={(e) => {
        if (!editable) return
        e.stopPropagation()
        onSelect?.()
        ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
        drag.current = { px: e.clientX, py: e.clientY, ox: el.x, oy: el.y }
      }}
      onPointerMove={(e) => {
        if (!drag.current || !onMove) return
        const dx = e.clientX - drag.current.px
        const dy = e.clientY - drag.current.py
        onMove(drag.current.ox + dx, drag.current.oy + dy)
      }}
      onPointerUp={() => {
        drag.current = null
      }}
      onDoubleClick={(e) => {
        if (!editable || !onLabel) return
        e.stopPropagation()
        const next = window.prompt('Label', el.label)
        if (next != null) onLabel(next.trim() || el.label)
      }}
    >
      <span className="e2-sticky-type">{style.label}</span>
      <span className="e2-sticky-label">{el.label}</span>
    </div>
  )
}

export function E2Canvas({ jsonText, title, editable = false, onSave }: Props) {
  const initial = useMemo(() => parseBoardJson(jsonText), [jsonText])
  const [doc, setDoc] = useState<BoardDocument | null>(initial)
  const [viewId, setViewId] = useState<string | null>(null)
  const [pan, setPan] = useState({ x: 0, y: 0, zoom: 0.65 })
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [addType, setAddType] = useState<string>('domainEvent')
  const [dirty, setDirty] = useState(false)
  const panDrag = useRef<{ px: number; py: number; ox: number; oy: number } | null>(null)

  useEffect(() => {
    setDoc(parseBoardJson(jsonText))
    setDirty(false)
  }, [jsonText])

  const view = useMemo(() => {
    if (!doc) return null
    const id = viewId && doc.views.some((v) => v.id === viewId) ? viewId : doc.activeViewId
    return doc.views.find((v) => v.id === id) ?? doc.views[0] ?? null
  }, [doc, viewId])

  const updateView = (mutator: (v: BoardView) => BoardView) => {
    if (!doc || !view) return
    setDoc({
      ...doc,
      views: doc.views.map((v) => (v.id === view.id ? mutator(v) : v)),
    })
    setDirty(true)
  }

  const onPointerDown = useCallback(
    (e: ReactPointerEvent) => {
      if (e.button !== 0) return
      if ((e.target as HTMLElement).closest?.('.e2-sticky')) return
      ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
      panDrag.current = { px: e.clientX, py: e.clientY, ox: pan.x, oy: pan.y }
      setSelectedId(null)
    },
    [pan.x, pan.y],
  )

  const onPointerMove = useCallback((e: ReactPointerEvent) => {
    if (!panDrag.current) return
    const dx = e.clientX - panDrag.current.px
    const dy = e.clientY - panDrag.current.py
    setPan((p) => ({ ...p, x: panDrag.current!.ox + dx, y: panDrag.current!.oy + dy }))
  }, [])

  const onPointerUp = useCallback(() => {
    panDrag.current = null
  }, [])

  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setPan((p) => ({ ...p, zoom: Math.min(2.5, Math.max(0.25, p.zoom * delta)) }))
  }, [])

  const addSticky = () => {
    if (!view) return
    const style = styleForType(addType)
    const el: StormElement = {
      id: newElementId(),
      type: addType,
      label: style.label,
      x: 120 + view.elements.length * 24,
      y: 160 + view.elements.length * 16,
      width: style.defaultWidth,
      height: style.defaultHeight,
    }
    updateView((v) => ({ ...v, elements: [...v.elements, el] }))
    setSelectedId(el.id)
  }

  const download = () => {
    if (!doc) return
    const blob = new Blob([serializeBoardJson(doc)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${(title || doc.title || 'board').replace(/\s+/g, '-')}.storm.json`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const save = async () => {
    if (!doc || !onSave) return
    await onSave(serializeBoardJson(doc))
    setDirty(false)
  }

  if (!doc || !view) {
    return (
      <div className="e2-error">
        Could not parse E2 board snapshot (expected <code>format: event-storming-tool</code>, version 1
        or 2).
      </div>
    )
  }

  return (
    <div className="e2-shell">
      <div className="e2-toolbar">
        <strong>{title || doc.title}</strong>
        <div className="e2-view-tabs">
          {doc.views.map((v) => (
            <button
              key={v.id}
              type="button"
              className={v.id === view.id ? 'active' : ''}
              onClick={() => setViewId(v.id)}
            >
              {v.name}
            </button>
          ))}
        </div>
        {editable && (
          <div className="e2-edit-tools">
            <select value={addType} onChange={(e) => setAddType(e.target.value)}>
              {PALETTE.map((t) => (
                <option key={t} value={t}>
                  {styleForType(t).label}
                </option>
              ))}
            </select>
            <button type="button" className="btn" onClick={addSticky}>
              Add sticky
            </button>
            {selectedId && (
              <button
                type="button"
                className="btn"
                onClick={() =>
                  updateView((v) => ({
                    ...v,
                    elements: v.elements.filter((e) => e.id !== selectedId),
                  }))
                }
              >
                Delete
              </button>
            )}
            {onSave && (
              <button type="button" className="btn primary" disabled={!dirty} onClick={() => void save()}>
                Save board
              </button>
            )}
          </div>
        )}
        <button type="button" className="btn" onClick={download}>
          Download for E2
        </button>
        <span className="muted">
          {view.elements.length} elements · pan / zoom
          {editable ? ' · drag stickies · double-click label' : ' · read-only'}
          {dirty ? ' · unsaved' : ''}
        </span>
      </div>
      <div
        className="e2-viewport"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onWheel={onWheel}
      >
        <div
          className="e2-world"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${pan.zoom})`,
          }}
        >
          {view.swimlanes.map((lane) => (
            <div
              key={lane.id}
              className="e2-swimlane"
              style={{
                left: lane.x ?? 0,
                top: lane.y,
                width: lane.width ?? 4000,
                height: lane.height,
              }}
            >
              <span>{lane.name}</span>
            </div>
          ))}
          {view.boundedContexts.map((bc) => (
            <div
              key={bc.id}
              className="e2-bc"
              style={{
                left: bc.x,
                top: bc.y,
                width: bc.width,
                height: bc.height,
                borderColor: bc.color || '#94a3b8',
              }}
            >
              <span>{bc.name}</span>
            </div>
          ))}
          {view.timeline?.visible !== false && (
            <div className="e2-timeline" style={{ top: view.timeline.y }}>
              <span>{view.timeline.startLabel || 'Start'}</span>
              <span>{view.timeline.endLabel || 'End'}</span>
            </div>
          )}
          <ConnectorLayer view={view} />
          {view.elements.map((el) => (
            <Sticky
              key={el.id}
              el={el}
              editable={editable}
              selected={selectedId === el.id}
              onSelect={() => setSelectedId(el.id)}
              onMove={(x, y) =>
                updateView((v) => ({
                  ...v,
                  elements: v.elements.map((e) => (e.id === el.id ? { ...e, x, y } : e)),
                }))
              }
              onLabel={(label) =>
                updateView((v) => ({
                  ...v,
                  elements: v.elements.map((e) => (e.id === el.id ? { ...e, label } : e)),
                }))
              }
            />
          ))}
        </div>
      </div>
    </div>
  )
}
