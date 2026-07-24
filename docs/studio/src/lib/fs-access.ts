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
  let cur = root
  for (const part of parts) {
    cur = await cur.getDirectoryHandle(part, { create })
  }
  return cur
}

export async function pathExists(
  root: FileSystemDirectoryHandle,
  relativeDir: string,
): Promise<boolean> {
  try {
    await getDirectoryAtPath(root, relativeDir, { create: false })
    return true
  } catch {
    return false
  }
}

async function looksLikeGitRepo(dir: FileSystemDirectoryHandle): Promise<boolean> {
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

async function looksLikeArchRoot(dir: FileSystemDirectoryHandle): Promise<boolean> {
  for (const name of ['blueprint.md', 'entry-point.md']) {
    try {
      await dir.getFileHandle(name)
      return true
    } catch {
      /* continue */
    }
  }
  try {
    await dir.getDirectoryHandle('context')
    return true
  } catch {
    return false
  }
}

const DOC_ROOT_CANDIDATES = [
  'docs/architecture',
  'docs/arch',
  'architecture',
  'docs/agm',
  'doc/architecture',
]

/** Prefer preferred if it exists; else first candidate that exists under the repo. */
export async function suggestDocRoot(
  repo: FileSystemDirectoryHandle,
  preferred?: string,
): Promise<string | null> {
  const pref = (preferred || '').replace(/\\/g, '/').replace(/^\/+|\/+$/g, '')
  if (pref && (await pathExists(repo, pref))) return `${pref}/`
  for (const c of DOC_ROOT_CANDIDATES) {
    if (await pathExists(repo, c)) return `${c}/`
  }
  return null
}

/**
 * Pick the Git/application repository root, resolve documentation folder from docRoot,
 * and return the architecture directory handle (what Studio indexes/writes).
 */
export async function openRepositoryWithDocRoot(opts: {
  mode?: 'read' | 'readwrite'
  preferredDocRoot?: string
}): Promise<{
  handle: FileSystemDirectoryHandle
  label: string
  files: FileMap
  canWrite: boolean
  docRoot: string
  repoName: string
  pickedArchDirectly: boolean
  hasGit: boolean
} | null> {
  if (!supportsDirectoryPicker() || typeof window.showDirectoryPicker !== 'function') {
    return null
  }
  const mode = opts?.mode ?? 'readwrite'
  try {
    const picked = await window.showDirectoryPicker({ mode })
    const canWrite = mode === 'readwrite' ? await queryWriteAccess(picked) : false
    const hasGit = await looksLikeGitRepo(picked)
    const isArch = await looksLikeArchRoot(picked)

    // User selected the architecture folder itself (legacy / shortcut)
    if (isArch && !hasGit) {
      const files: FileMap = new Map()
      await walkDirectoryHandle(picked, '', files)
      await saveDirectoryHandle(picked)
      const fallbackRoot = (opts.preferredDocRoot || 'docs/architecture/').replace(/\/?$/, '/')
      return {
        handle: picked,
        label: picked.name,
        files,
        canWrite,
        docRoot: fallbackRoot,
        repoName: picked.name,
        pickedArchDirectly: true,
        hasGit: false,
      }
    }

    const suggested =
      (await suggestDocRoot(picked, opts.preferredDocRoot)) ||
      (opts.preferredDocRoot || 'docs/architecture/').replace(/\/?$/, '/')
    const relative = suggested.replace(/\/+$/, '')

    let arch: FileSystemDirectoryHandle
    try {
      arch = await getDirectoryAtPath(picked, relative, { create: false })
    } catch {
      if (!canWrite) {
        throw new Error(
          `Documentation path "${suggested}" not found under ${picked.name}. Adjust the path or allow write access to create it.`,
        )
      }
      arch = await getDirectoryAtPath(picked, relative, { create: true })
    }

    const files: FileMap = new Map()
    await walkDirectoryHandle(arch, '', files)
    await saveDirectoryHandle(arch)
    return {
      handle: arch,
      label: `${picked.name} / ${suggested}`,
      files,
      canWrite,
      docRoot: suggested.endsWith('/') ? suggested : `${suggested}/`,
      repoName: picked.name,
      pickedArchDirectly: false,
      hasGit,
    }
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
