/** Minimal E2 board types for read-only rendering (Board Snapshot v2). */

export type ElementType = string

export interface StormElement {
  id: string
  type: ElementType
  label: string
  x: number
  y: number
  description?: string
  width?: number
  height?: number
  rotation?: number
  swimlaneId?: string
  boundedContextId?: string
  metadata?: Record<string, unknown>
}

export interface StormRelation {
  id: string
  type: string
  sourceId: string
  targetId: string
  label?: string
}

export interface ContextRelation {
  id: string
  type: string
  sourceContextId: string
  targetContextId: string
  label?: string
}

export interface BoundedContext {
  id: string
  name: string
  x: number
  y: number
  width: number
  height: number
  color?: string
}

export interface Swimlane {
  id: string
  name: string
  y: number
  height: number
  x?: number
  width?: number
}

export interface Timeline {
  y: number
  startLabel?: string
  endLabel?: string
  visible?: boolean
}

export interface Viewport {
  x: number
  y: number
  zoom: number
}

export interface BoardView {
  id: string
  name: string
  modelingMode?: string
  workshopFormat?: string
  elements: StormElement[]
  relations: StormRelation[]
  contextRelations: ContextRelation[]
  swimlanes: Swimlane[]
  boundedContexts: BoundedContext[]
  timeline: Timeline
  viewport: Viewport
}

export interface BoardDocument {
  title: string
  glossary: { term: string; definition: string }[]
  activeViewId: string
  views: BoardView[]
}

export const EXPORT_FORMAT = 'event-storming-tool'
export const DEFAULT_VIEWPORT: Viewport = { x: 0, y: 0, zoom: 1 }
export const DEFAULT_TIMELINE: Timeline = { y: 400, startLabel: 'Start', endLabel: 'End', visible: true }

export interface ElementStyle {
  label: string
  fill: string
  stroke: string
  ink: string
  defaultWidth: number
  defaultHeight: number
  shape: 'rounded' | 'rectangle' | 'pill' | 'wide'
  rotation?: number
}

const FALLBACK_STYLE: ElementStyle = {
  label: 'Element',
  fill: '#f1f5f9',
  stroke: '#cbd5e1',
  ink: '#0f172a',
  defaultWidth: 140,
  defaultHeight: 64,
  shape: 'rounded',
}

export const ELEMENT_STYLES: Record<string, ElementStyle> = {
  domainEvent: { label: 'Domain Event', fill: '#ffedd5', stroke: '#fdba74', ink: '#7c2d12', defaultWidth: 160, defaultHeight: 72, shape: 'rounded' },
  command: { label: 'Command', fill: '#dbeafe', stroke: '#93c5fd', ink: '#1e3a8a', defaultWidth: 150, defaultHeight: 68, shape: 'rounded' },
  actor: { label: 'Actor', fill: '#fef9c3', stroke: '#fcd34d', ink: '#713f12', defaultWidth: 110, defaultHeight: 48, shape: 'pill' },
  aggregate: { label: 'Aggregate', fill: '#fef08a', stroke: '#facc15', ink: '#713f12', defaultWidth: 140, defaultHeight: 80, shape: 'rectangle' },
  policy: { label: 'Policy', fill: '#fae8ff', stroke: '#e879f9', ink: '#6b21a8', defaultWidth: 170, defaultHeight: 72, shape: 'rounded' },
  readModel: { label: 'Read Model', fill: '#dcfce7', stroke: '#86efac', ink: '#064e3b', defaultWidth: 150, defaultHeight: 68, shape: 'rounded' },
  externalSystem: { label: 'External', fill: '#fce7f3', stroke: '#f9a8d4', ink: '#9d174d', defaultWidth: 160, defaultHeight: 72, shape: 'rectangle' },
  ui: { label: 'UI', fill: '#f1f5f9', stroke: '#cbd5e1', ink: '#0f172a', defaultWidth: 130, defaultHeight: 60, shape: 'rounded' },
  note: { label: 'Note', fill: '#faf6ef', stroke: '#d6d0c4', ink: '#44403c', defaultWidth: 160, defaultHeight: 100, shape: 'rounded' },
  hotspot: { label: 'Hotspot', fill: '#fee2e2', stroke: '#fca5a5', ink: '#7f1d1d', defaultWidth: 120, defaultHeight: 120, shape: 'rectangle', rotation: 45 },
  pivotalEvent: { label: 'Pivotal', fill: '#fef3c7', stroke: '#fcd34d', ink: '#7c2d12', defaultWidth: 280, defaultHeight: 48, shape: 'wide' },
  entity: { label: 'Entity', fill: '#ccfbf1', stroke: '#5eead4', ink: '#134e4a', defaultWidth: 150, defaultHeight: 72, shape: 'rounded' },
  valueObject: { label: 'VO', fill: '#cffafe', stroke: '#67e8f9', ink: '#164e63', defaultWidth: 140, defaultHeight: 64, shape: 'rounded' },
  domainService: { label: 'Service', fill: '#e0e7ff', stroke: '#a5b4fc', ink: '#312e81', defaultWidth: 170, defaultHeight: 72, shape: 'rounded' },
  link: { label: 'Link', fill: '#f0f9ff', stroke: '#7dd3fc', ink: '#0c4a6e', defaultWidth: 150, defaultHeight: 56, shape: 'pill' },
  processStart: { label: 'Start', fill: '#d1fae5', stroke: '#34d399', ink: '#064e3b', defaultWidth: 88, defaultHeight: 88, shape: 'pill' },
  processEnd: { label: 'End', fill: '#e2e8f0', stroke: '#64748b', ink: '#0f172a', defaultWidth: 88, defaultHeight: 88, shape: 'pill' },
  processActivity: { label: 'Activity', fill: '#dbeafe', stroke: '#93c5fd', ink: '#1e3a8a', defaultWidth: 170, defaultHeight: 80, shape: 'rounded' },
  processGateway: { label: 'Gateway', fill: '#fef3c7', stroke: '#fbbf24', ink: '#78350f', defaultWidth: 100, defaultHeight: 100, shape: 'rectangle' },
  rule: { label: 'Rule', fill: '#fde68a', stroke: '#fbbf24', ink: '#78350f', defaultWidth: 180, defaultHeight: 80, shape: 'rounded' },
  example: { label: 'Example', fill: '#bbf7d0', stroke: '#86efac', ink: '#14532d', defaultWidth: 170, defaultHeight: 90, shape: 'rounded' },
}

export function styleForType(type: string): ElementStyle {
  return ELEMENT_STYLES[type] ?? { ...FALLBACK_STYLE, label: type }
}

function normalizeView(raw: Partial<BoardView> & { id?: string; name?: string }, index: number): BoardView {
  return {
    id: raw.id?.trim() || `view-${index + 1}`,
    name: raw.name?.trim() || `View ${index + 1}`,
    modelingMode: raw.modelingMode,
    workshopFormat: raw.workshopFormat,
    elements: Array.isArray(raw.elements) ? raw.elements : [],
    relations: Array.isArray(raw.relations) ? raw.relations : [],
    contextRelations: Array.isArray(raw.contextRelations) ? raw.contextRelations : [],
    swimlanes: Array.isArray(raw.swimlanes) ? raw.swimlanes : [],
    boundedContexts: Array.isArray(raw.boundedContexts) ? raw.boundedContexts : [],
    timeline: raw.timeline ? { ...DEFAULT_TIMELINE, ...raw.timeline } : { ...DEFAULT_TIMELINE },
    viewport: raw.viewport ? { ...DEFAULT_VIEWPORT, ...raw.viewport } : { ...DEFAULT_VIEWPORT },
  }
}

export function parseBoardJson(text: string): BoardDocument | null {
  let raw: unknown
  try {
    raw = JSON.parse(text)
  } catch {
    return null
  }
  if (!raw || typeof raw !== 'object') return null
  const d = raw as Record<string, unknown>
  if (d.format !== EXPORT_FORMAT) return null

  const version = d.version
  if (version === 1) {
    const view = normalizeView(
      {
        id: 'view-1',
        name: 'Board',
        modelingMode: d.modelingMode as string | undefined,
        workshopFormat: d.workshopFormat as string | undefined,
        elements: d.elements as StormElement[],
        relations: d.relations as StormRelation[],
        contextRelations: d.contextRelations as ContextRelation[],
        swimlanes: d.swimlanes as Swimlane[],
        boundedContexts: d.boundedContexts as BoundedContext[],
        timeline: d.timeline as Timeline,
        viewport: d.viewport as Viewport,
      },
      0,
    )
    return {
      title: String(d.title ?? 'Board'),
      glossary: Array.isArray(d.glossary) ? (d.glossary as BoardDocument['glossary']) : [],
      activeViewId: view.id,
      views: [view],
    }
  }

  if (version !== 2) return null
  const viewsRaw = Array.isArray(d.views) ? d.views : []
  const views = viewsRaw.map((v, i) => normalizeView(v as BoardView, i))
  if (views.length === 0) return null
  const activeViewId =
    typeof d.activeViewId === 'string' && views.some((v) => v.id === d.activeViewId)
      ? d.activeViewId
      : views[0]!.id

  return {
    title: String(d.title ?? 'Board'),
    glossary: Array.isArray(d.glossary) ? (d.glossary as BoardDocument['glossary']) : [],
    activeViewId,
    views,
  }
}

export function isLikelyStormJson(text: string): boolean {
  return text.includes('"event-storming-tool"') && text.includes('"format"')
}

export function serializeBoardJson(doc: BoardDocument): string {
  return JSON.stringify(
    {
      $schema: 'https://abx-git.github.io/E2/schemas/board-snapshot-v2.schema.json',
      format: EXPORT_FORMAT,
      version: 2,
      exportedAt: new Date().toISOString(),
      title: doc.title,
      glossary: doc.glossary,
      workshopMode: false,
      activeViewId: doc.activeViewId,
      views: doc.views,
    },
    null,
    2,
  )
}

export function newElementId(): string {
  return `el-${Math.random().toString(36).slice(2, 10)}`
}
