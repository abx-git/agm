import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { normDocRoot } from '../config/load.js';
import { packageRoot } from '../paths.js';
import { exportToolkit } from '../tekto/export.js';
import { writeAiToolRulesFromScaffold } from './scaffold-wiring.js';

export interface InitOptions {
  project: string;
  docRoot: string;
  aiTool: 'cursor' | 'claude' | 'copilot' | 'generic' | 'kiro';
  force?: boolean;
  cwd?: string;
}

export interface InitResult {
  docRoot: string;
  created: string[];
  skipped: string[];
}

function scaffoldPath(...segments: string[]): string {
  return join(packageRoot(), 'scaffold', ...segments);
}

function copyFile(src: string, dest: string, force: boolean, created: string[], skipped: string[], cwd: string): void {
  if (existsSync(dest) && !force) {
    skipped.push(relative(cwd, dest));
    return;
  }
  mkdirSync(dirname(dest), { recursive: true });
  cpSync(src, dest);
  created.push(relative(cwd, dest));
}

function copyTree(fromDir: string, toDir: string, force: boolean, created: string[], skipped: string[], cwd: string): void {
  if (!existsSync(fromDir)) return;
  for (const entry of readdirSync(fromDir)) {
    const src = join(fromDir, entry);
    const dest = join(toDir, entry);
    if (statSync(src).isDirectory()) {
      copyTree(src, dest, force, created, skipped, cwd);
    } else {
      copyFile(src, dest, force, created, skipped, cwd);
    }
  }
}

export function initTekto(options: InitOptions): InitResult {
  const cwd = options.cwd ?? process.cwd();
  const docRoot = normDocRoot(options.docRoot);
  const docRootAbs = join(cwd, docRoot.replace(/\/$/, ''));
  const force = Boolean(options.force);
  const created: string[] = [];
  const skipped: string[] = [];

  if (!existsSync(scaffoldPath('doc-root'))) {
    throw new Error('Scaffold missing — run from monorepo or reinstall @abx-hh/tekto');
  }

  copyTree(scaffoldPath('doc-root'), docRootAbs, force, created, skipped, cwd);

  const gitAttr = scaffoldPath('.gitattributes');
  if (existsSync(gitAttr)) {
    const dest = join(cwd, '.gitattributes');
    if (!existsSync(dest) || force) {
      const fragment = readGitAttributesFragment(gitAttr);
      appendGitAttributes(cwd, fragment, created);
    }
  }

  mkdirSync(join(cwd, '.tekto'), { recursive: true });
  const configPath = join(cwd, '.tekto/config.json');
  if (!existsSync(configPath) || force) {
    writeFileSync(
      configPath,
      JSON.stringify(
        {
          appName: options.project,
          docRoot,
          aiTool: options.aiTool,
        },
        null,
        2
      ) + '\n'
    );
    created.push(relative(cwd, configPath));
  }

  const metaPath = join(cwd, '.tekto-install-meta');
  writeFileSync(
    metaPath,
    `project=${options.project}\ndoc_root=${docRoot}\nai_tool=${options.aiTool}\n`
  );
  created.push(relative(cwd, metaPath));

  const docRootRule = docRoot.replace(/\/$/, '');
  writeAiToolRulesFromScaffold(options.aiTool, options.project, docRootRule, cwd, created);
  exportToolkit({
    aiTool: options.aiTool,
    cwd,
    force,
    docRoot: docRoot,
    created,
    skipped,
  });

  copyAspectsToAppRepo(cwd, docRootAbs, force, created, skipped);

  return { docRoot, created, skipped };
}

function readGitAttributesFragment(path: string): string {
  return readFileSync(path, 'utf8');
}

function appendGitAttributes(cwd: string, fragment: string, created: string[]): void {
  const dest = join(cwd, '.gitattributes');
  const existing = existsSync(dest) ? readFileSync(dest, 'utf8') : '';
  if (!existing.includes('merge=union')) {
    writeFileSync(dest, `${existing}${existing.endsWith('\n') || !existing ? '' : '\n'}${fragment}`);
    created.push('.gitattributes');
  }
}

function monorepoPacksRoot(cwd: string): string | null {
  const candidate = join(cwd, 'packs');
  if (existsSync(candidate)) return candidate;
  const pkg = join(packageRoot(), '..', 'packs');
  if (existsSync(pkg)) return pkg;
  return join(packageRoot(), 'packs');
}

function copyAspectsToAppRepo(
  cwd: string,
  docRootAbs: string,
  force: boolean,
  created: string[],
  skipped: string[]
): void {
  const packs = monorepoPacksRoot(cwd);
  if (!packs) return;
  const aspectsSrc = join(packs, 'aspects');
  const aspectsDest = join(docRootAbs, 'aspects');
  copyTree(aspectsSrc, aspectsDest, force, created, skipped, cwd);
}