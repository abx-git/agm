/** File System Access API: open, walk, write, IndexedDB handle persistence. */

export type FileMap = Map<string, string>

const IDB_NAME = 'agm-studio-fs'
const IDB_STORE = 'handles'
const IDB_KEY = 'architecture-folder'

function isInteresting(name: string): boolean {
  const lower = name.toLowerCase()
  return lower.endsWith('.storm.json') || lower.endsWith('.md')
}

function shouldSkipDir(name: string): boolean {
  return name === 'node_modules' || name === '.git' || name === 'dist' || name === '.cursor'
}

export function supportsDirectoryPicker(): boolean {
  return typeof window !== 'undefined' && typeof window.showDirectoryPicker === 'function'
}

export async function walkDirectoryHandle(
  dir: FileSystemDirectoryHandle,
  prefix: string,
  out: FileMap,
): Promise<void> {
  for await (const [name, handle] of dir.entries()) {
    if (handle.kind === 'directory') {
      if (shouldSkipDir(name)) continue
      const next = prefix ? `${prefix}/${name}` : name
      await walkDirectoryHandle(handle as FileSystemDirectoryHandle, next, out)
    } else if (handle.kind === 'file' && isInteresting(name)) {
      const path = prefix ? `${prefix}/${name}` : name
      const file = await (handle as FileSystemFileHandle).getFile()
      out.set(path.replace(/\\/g, '/'), await file.text())
    }
  }
}

export async function queryWriteAccess(handle: FileSystemDirectoryHandle): Promise<boolean> {
  if (!handle.queryPermission) return false
  try {
    const state = await handle.queryPermission({ mode: 'readwrite' })
    if (state === 'granted') return true
    if (handle.requestPermission) {
      const next = await handle.requestPermission({ mode: 'readwrite' })
      return next === 'granted'
    }
  } catch {
    return false
  }
  return false
}

export async function openArchitectureFolder(opts?: {
  mode?: 'read' | 'readwrite'
}): Promise<{
  handle: FileSystemDirectoryHandle
  label: string
  files: FileMap
  canWrite: boolean
} | null> {
  if (!supportsDirectoryPicker() || typeof window.showDirectoryPicker !== 'function') {
    return null
  }
  const mode = opts?.mode ?? 'readwrite'
  try {
    const handle = await window.showDirectoryPicker({ mode })
    const files: FileMap = new Map()
    await walkDirectoryHandle(handle, '', files)
    const canWrite = mode === 'readwrite' ? await queryWriteAccess(handle) : false
    await saveDirectoryHandle(handle)
    return { handle, label: handle.name, files, canWrite }
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') return null
    throw err
  }
}

export function openArchitectureFolderViaInput(): Promise<{
  handle: null
  label: string
  files: FileMap
  canWrite: false
} | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.setAttribute('webkitdirectory', '')
    input.setAttribute('directory', '')
    input.onchange = async () => {
      const list = input.files
      if (!list || list.length === 0) {
        resolve(null)
        return
      }
      const files: FileMap = new Map()
      let rootLabel = 'architecture'
      for (const file of Array.from(list)) {
        const rel = (file.webkitRelativePath || file.name).replace(/\\/g, '/')
        const parts = rel.split('/')
        if (parts.length > 1) rootLabel = parts[0]!
        const path = parts.slice(1).join('/') || parts[0]!
        if (!isInteresting(file.name)) continue
        if (parts.some((p) => shouldSkipDir(p))) continue
        files.set(path, await file.text())
      }
      resolve({ handle: null, label: rootLabel, files, canWrite: false })
    }
    input.click()
  })
}

export async function ensureDirPath(
  root: FileSystemDirectoryHandle,
  relativeDir: string,
): Promise<FileSystemDirectoryHandle> {
  const parts = relativeDir.split('/').filter(Boolean)
  let cur = root
  for (const part of parts) {
    cur = await cur.getDirectoryHandle(part, { create: true })
  }
  return cur
}

/** Resolve a relative directory; does not create unless create=true. */
export async function getDirectoryAtPath(
  root: FileSystemDirectoryHandle,
  relativeDir: string,
  opts?: { create?: boolean },
): Promise<FileSystemDirectoryHandle> {
  const create = opts?.create ?? false
  const parts = relativeDir.replace(/\\/g, '/').split('/').filter((p) => p && p !== '.')
  if (parts.length === 0) return root
  let cur = root
  for (const part of parts) {
    cur = await cur.getDirectoryHandle(part, { create })
  }
  return cur
}

export async function looksLikeGitRepo(dir: FileSystemDirectoryHandle): Promise<boolean> {
  try {
    await dir.getDirectoryHandle('.git')
    return true
  } catch {
    try {
      await dir.getFileHandle('.git')
      return true
    } catch {
      return false
    }
  }
}

export function normalizeRelPath(raw: string): string {
  return String(raw || '')
    .trim()
    .replace(/\\/g, '/')
    .replace(/^\/+|\/+$/g, '')
}

/**
 * Path used in prompts + under the selected folder on disk.
 * - Selected folder is a Git repo → path is the optional subfolder (relative to that repo).
 * - Otherwise → selected folder name + optional subfolder (e.g. docs + architecture → docs/architecture/).
 */
export async function buildDocPromptPath(
  base: FileSystemDirectoryHandle,
  subpath: string,
): Promise<string> {
  const sub = normalizeRelPath(subpath)
  const isRepo = await looksLikeGitRepo(base)
  if (isRepo) {
    if (sub) return `${sub}/`
    // Docs live at the repo root (unusual) — prompts use ./ as the documentation root marker
    return './'
  }
  if (sub) return `${base.name}/${sub}/`
  return `${base.name}/`
}

/** Pick a folder only (step 1). Does not index or persist yet. */
export async function pickDirectory(opts?: {
  mode?: 'read' | 'readwrite'
}): Promise<{ handle: FileSystemDirectoryHandle; canWrite: boolean } | null> {
  if (!supportsDirectoryPicker() || typeof window.showDirectoryPicker !== 'function') {
    return null
  }
  const mode = opts?.mode ?? 'readwrite'
  try {
    const handle = await window.showDirectoryPicker({ mode })
    const canWrite = mode === 'readwrite' ? await queryWriteAccess(handle) : false
    return { handle, canWrite }
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') return null
    throw err
  }
}

/** Confirm: resolve optional subpath under base, index, persist docs handle. */
export async function confirmFolderBinding(opts: {
  base: FileSystemDirectoryHandle
  canWrite: boolean
  /** Subfolder under base (optional). */
  subpath: string
  /** Final path for prompts. */
  docRoot: string
}): Promise<{
  handle: FileSystemDirectoryHandle
  label: string
  files: FileMap
  canWrite: boolean
  docRoot: string
}> {
  const docRoot = (opts.docRoot || './').replace(/\\/g, '/').replace(/\/?$/, '/') || './'
  const isRepo = await looksLikeGitRepo(opts.base)
  let underBase = normalizeRelPath(opts.subpath)
  if (!underBase) {
    const d = normalizeRelPath(docRoot)
    if (d && d !== '.') {
      if (isRepo) underBase = d
      else if (d === opts.base.name) underBase = ''
      else if (d.startsWith(`${opts.base.name}/`)) underBase = d.slice(opts.base.name.length + 1)
      else underBase = d
    }
  }

  let docs: FileSystemDirectoryHandle = opts.base
  if (underBase) {
    try {
      docs = await getDirectoryAtPath(opts.base, underBase, { create: false })
    } catch {
      if (!opts.canWrite) {
        throw new Error(
          `Path "${underBase}" not found under ${opts.base.name}. Fix the path or allow write access to create it.`,
        )
      }
      docs = await getDirectoryAtPath(opts.base, underBase, { create: true })
    }
  }

  const files: FileMap = new Map()
  await walkDirectoryHandle(docs, '', files)
  await saveDirectoryHandle(docs)
  const label = underBase ? `${opts.base.name}/${underBase}` : opts.base.name
  return { handle: docs, label, files, canWrite: opts.canWrite, docRoot }
}

export async function writeTextFile(
  root: FileSystemDirectoryHandle,
  relativePath: string,
  content: string,
): Promise<void> {
  const norm = relativePath.replace(/\\/g, '/').replace(/^\/+/, '')
  const parts = norm.split('/')
  const fileName = parts.pop()!
  const dir = parts.length ? await ensureDirPath(root, parts.join('/')) : root
  const fileHandle = await dir.getFileHandle(fileName, { create: true })
  const writable = await fileHandle.createWritable()
  await writable.write(content)
  await writable.close()
}

export async function writeFileMap(
  root: FileSystemDirectoryHandle,
  files: Record<string, string>,
): Promise<string[]> {
  const written: string[] = []
  for (const [path, content] of Object.entries(files)) {
    await writeTextFile(root, path, content)
    written.push(path)
  }
  return written
}

function openIdb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, 1)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(IDB_STORE)) db.createObjectStore(IDB_STORE)
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export async function saveDirectoryHandle(handle: FileSystemDirectoryHandle): Promise<void> {
  try {
    const db = await openIdb()
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readwrite')
      tx.objectStore(IDB_STORE).put(handle, IDB_KEY)
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
    db.close()
  } catch {
    /* ignore — persistence is best-effort */
  }
}

export async function loadDirectoryHandle(): Promise<FileSystemDirectoryHandle | null> {
  try {
    const db = await openIdb()
    const handle = await new Promise<FileSystemDirectoryHandle | null>((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readonly')
      const req = tx.objectStore(IDB_STORE).get(IDB_KEY)
      req.onsuccess = () => resolve((req.result as FileSystemDirectoryHandle) || null)
      req.onerror = () => reject(req.error)
    })
    db.close()
    return handle
  } catch {
    return null
  }
}

export async function rehydrateFolder(handle: FileSystemDirectoryHandle): Promise<{
  files: FileMap
  canWrite: boolean
} | null> {
  try {
    if (handle.queryPermission) {
      const perm = await handle.queryPermission({ mode: 'read' })
      if (perm !== 'granted') {
        const next = handle.requestPermission
          ? await handle.requestPermission({ mode: 'read' })
          : perm
        if (next !== 'granted') return null
      }
    }
    const files: FileMap = new Map()
    await walkDirectoryHandle(handle, '', files)
    const canWrite = await queryWriteAccess(handle)
    return { files, canWrite }
  } catch {
    return null
  }
}
