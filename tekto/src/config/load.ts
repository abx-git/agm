import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import type { TektoConfig } from '../types.js';

const CONFIG_FILE = '.tekto/config.json';
const META_FILE = '.tekto-install-meta';

export function normDocRoot(raw: string): string {
  let r = String(raw || 'docs/tekto/').trim();
  if (!r) r = 'docs/tekto';
  r = r.replace(/\/+$/, '');
  return `${r}/`;
}

function parseMeta(content: string): Partial<TektoConfig> {
  const out: Partial<TektoConfig> = {};
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
      case 'ai_tool':
        out.aiTool = value as TektoConfig['aiTool'];
        break;
      default:
        break;
    }
  }
  return out;
}

export function findProjectRoot(startDir = process.cwd()): string {
  let dir = resolve(startDir);
  for (;;) {
    if (existsSync(join(dir, CONFIG_FILE)) || existsSync(join(dir, META_FILE))) {
      return dir;
    }
    const parent = resolve(dir, '..');
    if (parent === dir) return resolve(startDir);
    dir = parent;
  }
}

export function loadConfig(cwd = process.cwd()): TektoConfig {
  const root = findProjectRoot(cwd);
  const configPath = join(root, CONFIG_FILE);
  const metaPath = join(root, META_FILE);

  const defaults: TektoConfig = {
    appName: 'Application',
    docRoot: normDocRoot('docs/tekto/'),
    aiTool: 'cursor',
  };

  if (existsSync(metaPath)) {
    Object.assign(defaults, parseMeta(readFileSync(metaPath, 'utf8')));
  }

  if (existsSync(configPath)) {
    try {
      const parsed = JSON.parse(readFileSync(configPath, 'utf8')) as Partial<TektoConfig>;
      Object.assign(defaults, parsed);
      defaults.docRoot = normDocRoot(parsed.docRoot ?? defaults.docRoot);
    } catch {
      // ignore
    }
  }

  return defaults;
}

export function docRootAbs(config: TektoConfig, cwd = process.cwd()): string {
  const root = findProjectRoot(cwd);
  return join(root, config.docRoot.replace(/\/$/, ''));
}

export function configFilePath(cwd = process.cwd()): string {
  return join(findProjectRoot(cwd), CONFIG_FILE);
}

export function repoRoot(cwd = process.cwd()): string {
  return findProjectRoot(cwd);
}