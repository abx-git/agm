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

/**
 * 1) Pick a folder.
 * 2) Optional subdirectory under it (same string = prompt doc path).
 * Empty subdirectory → the picked folder is the documentation root; prompt path stays as given
 * (caller should pass the relative path they want in prompts, or the folder name).
 */
export async function openFolderWithOptionalSubpath(opts: {
  mode?: 'read' | 'readwrite'
  /** Relative subdirectory under the picked folder; also used as documentation path in prompts. */
  subpath?: string
}): Promise<{
  handle: FileSystemDirectoryHandle
  label: string
  files: FileMap
  canWrite: boolean
  /** Normalized path for prompts (trailing slash). */
  docRoot: string
  baseName: string
} | null> {
  if (!supportsDirectoryPicker() || typeof window.showDirectoryPicker !== 'function') {
    return null
  }
  const mode = opts?.mode ?? 'readwrite'
  try {
    const base = await window.showDirectoryPicker({ mode })
    const canWrite = mode === 'readwrite' ? await queryWriteAccess(base) : false
    const raw = String(opts?.subpath ?? '')
      .trim()
      .replace(/\\/g, '/')
      .replace(/^\/+|\/+$/g, '')

    let docs: FileSystemDirectoryHandle = base
    let docRoot: string
    let label: string

    if (raw) {
      docRoot = `${raw}/`
      try {
        docs = await getDirectoryAtPath(base, raw, { create: false })
      } catch {
        if (!canWrite) {
          throw new Error(
            `Subfolder "${raw}" not found under ${base.name}. Check the path or allow write access to create it.`,
          )
        }
        docs = await getDirectoryAtPath(base, raw, { create: true })
      }
      label = `${base.name}/${raw}`
    } else {
      // Picked folder is the documentation root; prompts use its name as a relative path.
      docRoot = `${base.name}/`
      label = base.name
    }

    const files: FileMap = new Map()
    await walkDirectoryHandle(docs, '', files)
    await saveDirectoryHandle(docs)
    return { handle: docs, label, files, canWrite, docRoot, baseName: base.name }
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') return null
    throw err
  }
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
