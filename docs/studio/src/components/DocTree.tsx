import { useMemo } from 'react'
import type { DocNode } from '../types'

interface Props {
  docs: Map<string, DocNode>
  activePath: string | null
  typeFilter: string
  onSelect: (path: string) => void
}

interface TreeNode {
  name: string
  path?: string
  children: Map<string, TreeNode>
  doc?: DocNode
}

function buildTree(docs: Map<string, DocNode>, typeFilter: string): TreeNode {
  const root: TreeNode = { name: '', children: new Map() }
  for (const doc of docs.values()) {
    if (typeFilter) {
      const t = doc.meta?.type || (doc.kind === 'storm' ? 'e2-board-snapshot' : '')
      if (t !== typeFilter) continue
    }
    const parts = doc.path.split('/')
    let cur = root
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]!
      const isLeaf = i === parts.length - 1
      if (!cur.children.has(part)) {
        cur.children.set(part, { name: part, children: new Map() })
      }
      const next = cur.children.get(part)!
      if (isLeaf) {
        next.path = doc.path
        next.doc = doc
      }
      cur = next
    }
  }
  return root
}

function TreeBranch({
  node,
  depth,
  activePath,
  onSelect,
}: {
  node: TreeNode
  depth: number
  activePath: string | null
  onSelect: (path: string) => void
}) {
  const entries = [...node.children.entries()].sort(([a], [b]) => a.localeCompare(b))
  return (
    <ul className="doc-tree" style={{ paddingLeft: depth === 0 ? 0 : 12 }}>
      {entries.map(([name, child]) => {
        const isFile = Boolean(child.path)
        if (isFile) {
          const active = child.path === activePath
          const type = child.doc?.meta?.type || child.doc?.kind
          return (
            <li key={child.path}>
              <button
                type="button"
                className={active ? 'tree-file active' : 'tree-file'}
                onClick={() => child.path && onSelect(child.path)}
              >
                <span className="tree-name">{name}</span>
                {type && <span className="tree-type">{type}</span>}
              </button>
            </li>
          )
        }
        return (
          <li key={name} className="tree-dir">
            <div className="tree-dir-label">{name}/</div>
            <TreeBranch node={child} depth={depth + 1} activePath={activePath} onSelect={onSelect} />
          </li>
        )
      })}
    </ul>
  )
}

export function DocTree({ docs, activePath, typeFilter, onSelect }: Props) {
  const tree = useMemo(() => buildTree(docs, typeFilter), [docs, typeFilter])
  return (
    <div className="doc-tree-wrap">
      <TreeBranch node={tree} depth={0} activePath={activePath} onSelect={onSelect} />
    </div>
  )
}
