import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import type { TemplateId } from '../types.js';
import { normDocRoot } from '../config/load.js';
import { packageRoot } from '../paths.js';
import { writeAiToolRulesFromScaffold } from './scaffold-wiring.js';

export interface ScaffoldOptions {
  project: string;
  template: TemplateId;
  docRoot: string;
  aiTool: 'cursor' | 'claude' | 'copilot' | 'generic';
  docFocus?: string;
  /** Install Domain/DDD optional pack */
  domain?: boolean;
  /** Install Architect + Domain packs (Assistant Advanced) */
  full?: boolean;
  force?: boolean;
  cwd?: string;
}

export interface ScaffoldResult {
  docRoot: string;
  template: TemplateId;
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

function writeAiToolRules(
  aiTool: ScaffoldOptions['aiTool'],
  project: string,
  docRootRule: string,
  cwd: string,
  created: string[]
): void {
  writeAiToolRulesFromScaffold(aiTool, project, docRootRule, cwd, created);
}

export function installScaffold(options: ScaffoldOptions): ScaffoldResult {
  const cwd = options.cwd ?? process.cwd();
  const docRoot = normDocRoot(options.docRoot);
  const docRootAbs = join(cwd, docRoot.replace(/\/$/, ''));
  const force = Boolean(options.force);
  const created: string[] = [];
  const skipped: string[] = [];

  if (!existsSync(scaffoldPath())) {
    throw new Error('Scaffold bundle missing — reinstall @abx-hh/agm-cli or run from monorepo agm/scaffold');
  }

  copyTree(scaffoldPath('prompts'), join(cwd, 'prompts'), force, created, skipped, cwd);
  copyTree(scaffoldPath('doc-root'), docRootAbs, force, created, skipped, cwd);

  const wantDomain = Boolean(options.domain || options.full);
  const wantArchitect = Boolean(options.full || options.domain);
  if (wantArchitect) {
    copyTree(
      scaffoldPath('optional', 'architect', 'doc-root'),
      docRootAbs,
      force,
      created,
      skipped,
      cwd
    );
  }
  if (wantDomain) {
    copyTree(
      scaffoldPath('optional', 'domain', 'doc-root'),
      docRootAbs,
      force,
      created,
      skipped,
      cwd
    );
    copyTree(
      scaffoldPath('optional', 'domain', 'prompts'),
      join(cwd, 'prompts'),
      force,
      created,
      skipped,
      cwd
    );
  }

  const templateDir = scaffoldPath('templates', options.template);
  if (options.template === 'custom') {
    mkdirSync(join(docRootAbs, 'custom'), { recursive: true });
    created.push(relative(cwd, join(docRootAbs, 'custom')));
  } else if (existsSync(templateDir)) {
    copyTree(templateDir, join(docRootAbs, options.template), force, created, skipped, cwd);
  } else {
    throw new Error(`Unknown template in scaffold bundle: ${options.template}`);
  }

  const docRootRule = docRoot.replace(/\/$/, '');
  writeAiToolRules(options.aiTool, options.project, docRootRule, cwd, created);

  const metaPath = join(cwd, '.agm-install-meta');
  if (!existsSync(metaPath) || force) {
    writeFileSync(
      metaPath,
      [
        `project=${options.project}`,
        `doc_root=${docRoot}`,
        `template=${options.template}`,
        `ai_tool=${options.aiTool}`,
        `doc_focus=${options.docFocus ?? ''}`,
        `pack=${options.full ? 'full' : options.domain ? 'domain' : 'golden'}`,
        `installed=${new Date().toISOString()}`,
        `source=agm-scaffold`,
      ].join('\n') + '\n'
    );
    created.push(relative(cwd, metaPath));
  } else {
    skipped.push(relative(cwd, metaPath));
  }

  return { docRoot, template: options.template, created, skipped };
}
