import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import type { AgmConfig, TemplateId } from '../types.js';

const CONFIG_FILE = '.agm/config.json';
const META_FILE = '.agm-install-meta';
/** @deprecated Pre-rename install marker; still detected for existing app repos. */
const LEGACY_META_FILE = '.bp-install-meta';

export function normDocRoot(raw: string): string {
  let r = String(raw || 'docs/architecture/').trim();
  if (!r) r = 'docs/architecture';
  r = r.replace(/\/+$/, '');
  return `${r}/`;
}

export function resolvedTemplate(config: AgmConfig): string {
  if (config.template === 'custom') {
    return config.customTemplate || 'custom';
  }
  return config.template || 'arc42';
}

function parseMeta(content: string): Partial<AgmConfig> {
  const out: Partial<AgmConfig> = {};
  for (const line of content.split('\n')) {
    const [key, ...rest] = line.split('=');
    const value = rest.join('=').trim();
    if (!key || !value) continue;
    switch (key) {
      case 'project':
        out.appName = value;
        break;
      case 'doc_root':
        out.docRoot = normDocRoot(value);
        break;
      case 'work_dir':
        out.workDir = value;
        break;
      case 'template':
        out.template = value as TemplateId;
        break;
      case 'doc_focus':
        out.docFocus = value ? value.split(',').filter(Boolean) : [];
        break;
      default:
        break;
    }
  }
  return out;
}

function resolveMetaPath(root: string): string | null {
  const primary = join(root, META_FILE);
  if (existsSync(primary)) return primary;
  const legacy = join(root, LEGACY_META_FILE);
  if (existsSync(legacy)) return legacy;
  return null;
}

export function findProjectRoot(startDir = process.cwd()): string {
  let dir = resolve(startDir);
  for (;;) {
    if (existsSync(join(dir, CONFIG_FILE)) || resolveMetaPath(dir)) {
      return dir;
    }
    const parent = resolve(dir, '..');
    if (parent === dir) return resolve(startDir);
    dir = parent;
  }
}

export function loadConfig(cwd = process.cwd()): AgmConfig {
  const root = findProjectRoot(cwd);
  const configPath = join(root, CONFIG_FILE);
  const workDirFile = join(root, '.agm', 'work-dir');

  const localWorkDir = existsSync(workDirFile)
    ? readFileSync(workDirFile, 'utf8').trim() || undefined
    : undefined;

  if (existsSync(configPath)) {
    const raw = JSON.parse(readFileSync(configPath, 'utf8')) as AgmConfig;
    return {
      ...raw,
      docRoot: normDocRoot(raw.docRoot),
      workDir: raw.workDir || localWorkDir,
    };
  }

  const metaPath = resolveMetaPath(root);
  if (metaPath) {
    const meta = parseMeta(readFileSync(metaPath, 'utf8'));
    return {
      appName: meta.appName || 'My Application',
      template: (meta.template as TemplateId) || 'arc42',
      docRoot: normDocRoot(meta.docRoot || 'docs/architecture/'),
      workDir: meta.workDir || localWorkDir,
      stack: '',
      docFocus: meta.docFocus || [],
    };
  }

  return {
    appName: 'My Application',
    template: 'arc42',
    docRoot: normDocRoot('docs/architecture/'),
    workDir: localWorkDir,
    stack: '',
  };
}

export function configFilePath(cwd = process.cwd()): string {
  return join(findProjectRoot(cwd), CONFIG_FILE);
}

export function docRootAbs(config: AgmConfig, cwd = process.cwd()): string {
  const root = findProjectRoot(cwd);
  return resolve(root, config.docRoot.replace(/\/$/, ''));
}
