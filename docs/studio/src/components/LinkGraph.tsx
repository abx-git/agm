import { useMemo, useState } from 'react'
import type { ArchitectureIndex } from '../types'

interface Props {
  index: ArchitectureIndex
  activePath: string | null
  onSelect: (path: string) => void
}

const W = 960
const H = 640

/** Force-directed-ish circular layout for the markdown link graph. */
export function LinkGraph({ index, activePath, onSelect }: Props) {
  const [hover, setHover] = useState<string | null>(null)

  const layout = useMemo(() => {
    const nodes = [...index.docs.values()].filter((d) => d.kind === 'markdown')
    const n = Math.max(nodes.length, 1)
    const cx = W / 2
    const cy = H / 2
    const r = Math.min(W, H) * 0.38
    const positions = new Map<string, { x: number; y: number; label: string; type: string }>()

    // Prefer entry-point / blueprint near center
    const priority = (p: string) => {
      if (p.endsWith('entry-point.md')) return 0
      if (p.endsWith('blueprint.md')) return 1
      if (p.endsWith('always-on.md')) return 2
      return 3
    }
    const sorted = [...nodes].sort((a, b) => priority(a.path) - priority(b.path) || a.path.localeCompare(b.path))

    sorted.forEach((doc, i) => {
      const angle = (2 * Math.PI * i) / n - Math.PI / 2
      const ring = priority(doc.path) <= 2 ? r * 0.35 : r
      positions.set(doc.path, {
        x: cx + Math.cos(angle) * ring,
        y: cy + Math.sin(angle) * ring,
        label: (doc.meta?.title as string) || doc.name,
        type: (doc.meta?.type as string) || 'doc',
      })
    })

    const edges = index.edges.filter((e) => positions.has(e.from))
    return { positions, edges }
  }, [index])

  return (
    <div className="link-graph">
      <p className="graph-hint">
        Nodes = OKF markdown docs · Edges = relative links · Red = missing target · Click a node to open
      </p>
      <svg viewBox={`0 0 ${W} ${H}`} className="graph-svg" role="img" aria-label="Architecture link graph">
        {layout.edges.map((e, i) => {
          const a = layout.positions.get(e.from)
          const b = layout.positions.get(e.to)
          if (!a) return null
          const bx = b?.x ?? a.x + 40
          const by = b?.y ?? a.y + 40
          const highlight =
            activePath === e.from || activePath === e.to || hover === e.from || hover === e.to
          return (
            <line
              key={`${e.from}->${e.to}-${i}`}
              x1={a.x}
              y1={a.y}
              x2={bx}
              y2={by}
              className={e.broken ? 'edge broken' : highlight ? 'edge hot' : 'edge'}
            />
          )
        })}
        {[...layout.positions.entries()].map(([path, p]) => {
          const active = path === activePath
          const hot = path === hover
          return (
            <g
              key={path}
              className={active ? 'node active' : hot ? 'node hot' : 'node'}
              transform={`translate(${p.x}, ${p.y})`}
              onMouseEnter={() => setHover(path)}
              onMouseLeave={() => setHover(null)}
              onClick={() => onSelect(path)}
              style={{ cursor: 'pointer' }}
            >
              <title>{`${p.label}\n${path}\n${p.type}`}</title>
              <circle r={active ? 14 : 10} />
              <text y={24} textAnchor="middle">
                {p.label.length > 28 ? p.label.slice(0, 26) + '…' : p.label}
              </text>
            </g>
          )
        })}
      </svg>
      <p className="graph-stats">
        {layout.positions.size} docs · {layout.edges.length} links ·{' '}
        {layout.edges.filter((e) => e.broken).length} broken
      </p>
    </div>
  )
}
