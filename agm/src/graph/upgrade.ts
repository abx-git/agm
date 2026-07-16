import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { normDocRoot } from '../config/load.js';
import { packageRoot } from '../paths.js';
import { writeAiToolRulesFromScaffold } from './scaffold-wiring.js';

export type InstallPack = 'golden' | 'domain' | 'full';

export interface UpgradeOptions {
  docRoot?: string;
  aiTool?: 'cursor' | 'claude' | 'copilot' | 'generic';
  project?: string;
  /** Add optional Domain pack files (workflows + roles) without touching architecture content */
  domain?: boolean;
  /** Add optional Architect + Domain packs */
  full?: boolean;
  /** Scaffold missing folders (sources/, use-cases/, templates) — never overwrite content */
  addMissing?: boolean;
  cwd?: string;
}

export interface UpgradeResult {
  docRoot: string;
  pack: InstallPack;
  updated: string[];
  added: string[];
  preservedNote: string;
}

const GOLDEN_WORKFLOWS = [
  'bootstrap-adopt',
  'bootstrap-continue',
  'refinement',
  'content-ingest',
  'maintenance-diff-range',
  'review-maintenance',
  'review-phase',
] as const;

const ARCHITECT_WORKFLOWS = [
  'bootstrap-init',
  'architecture-work-query',
  'architecture-work-analysis',
  'architecture-work-design',
  'architecture-work-continue',
  'architecture-work-interrogate',
  'architecture-work-sustainable-analysis',
  'architecture-work-sustainable-interrogate',
  'maintenance',
  'review-milestone',
] as const;

const DOMAIN_WORKFLOWS = [
  'domain-work-query',
  'domain-work-design',
  'domain-work-continue',
  'domain-work-event-storm',
  'domain-work-context-map',
  'domain-work-subdomain-classification',
  'domain-work-integration-review',
  'domain-work-tactical-review',
  'domain-work-language-audit',
] as const;

/** Never overwrite — architecture graph content lives here. */
const DOCROOT_PROTECTED = new Set([
  'blueprint.md',
  'entry-point.md',
  'index.md',
  'log.md',
  'ecosystem-index.md',
]);

const DOCROOT_PROTECTED_DIRS = new Set([
  'context',
  'interfaces',
  'arc42',
  'c4-light',
  'adr-first',
  'lean-service',
  'custom',
  'domain',
]);

function scaffoldPath(...segments: string[]): string {
  return join(packageRoot(), 'scaffold', ...segments);
}

function repoWorkflowsPath(): string {
  return join(packageRoot(), '..', 'prompts', 'workflows');
}

export function readInstallMeta(cwd: string): Record<string, string> {
  const path = join(cwd, '.agm-install-meta');
  if (!existsSync(path)) return {};
  const out: Record<string, string> = {};
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const m = line.match(/^([^=]+)=(.*)$/);
    if (m) out[m[1].trim()] = m[2].trim();
  }
  return out;
}

function resolvePack(options: UpgradeOptions, meta: Record<string, string>): InstallPack {
  if (options.full) return 'full';
  if (options.domain) return 'domain';
  const fromMeta = meta.pack as InstallPack | undefined;
  if (fromMeta === 'full' || fromMeta === 'domain' || fromMeta === 'golden') return fromMeta;
  return 'golden';
}

function workflowIdsForPack(pack: InstallPack): string[] {
  if (pack === 'full') {
    return [...GOLDEN_WORKFLOWS, ...ARCHITECT_WORKFLOWS, ...DOMAIN_WORKFLOWS];
  }
  if (pack === 'domain') {
    return [...GOLDEN_WORKFLOWS, ...DOMAIN_WORKFLOWS];
  }
  return [...GOLDEN_WORKFLOWS];
}

function copyForce(src: string, dest: string, updated: string[], cwd: string): void {
  if (!existsSync(src)) return;
  mkdirSync(dirname(dest), { recursive: true });
  cpSync(src, dest);
  updated.push(relative(cwd, dest));
}

function copyIfMissing(src: string, dest: string, added: string[], cwd: string): void {
  if (!existsSync(src) || existsSync(dest)) return;
  mkdirSync(dirname(dest), { recursive: true });
  cpSync(src, dest);
  added.push(relative(cwd, dest));
}

function copyTreeIfMissing(fromDir: string, toDir: string, added: string[], cwd: string): void {
  if (!existsSync(fromDir)) return;
  for (const entry of readdirSync(fromDir)) {
    const src = join(fromDir, entry);
    const dest = join(toDir, entry);
    if (statSync(src).isDirectory()) {
      if (!existsSync(dest)) mkdirSync(dest, { recursive: true });
      copyTreeIfMissing(src, dest, added, cwd);
    } else {
      copyIfMissing(src, dest, added, cwd);
    }
  }
}

function resolveWorkflowSource(cwd: string, workflowId: string): string | null {
  const inScaffold = join(scaffoldPath('prompts', 'workflows'), `${workflowId}.md`);
  if (existsSync(inScaffold)) return inScaffold;
  const inMonorepo = join(cwd, 'prompts', 'workflows', `${workflowId}.md`);
  if (existsSync(inMonorepo)) return inMonorepo;
  const bundled = join(repoWorkflowsPath(), `${workflowId}.md`);
  if (existsSync(bundled)) return bundled;
  return null;
}

function upgradeRepoPrompts(cwd: string, pack: InstallPack, updated: string[]): void {
  const promptsRoot = join(cwd, 'prompts');
  copyForce(scaffoldPath('prompts', 'core', 'system-prompt.md'), join(promptsRoot, 'core', 'system-prompt.md'), updated, cwd);

  const refDir = scaffoldPath('prompts', 'reference');
  if (existsSync(refDir)) {
    for (const name of readdirSync(refDir)) {
      if (!name.endsWith('.md')) continue;
      copyForce(join(refDir, name), join(promptsRoot, 'reference', name), updated, cwd);
    }
  }

  for (const wf of workflowIdsForPack(pack)) {
    const src = resolveWorkflowSource(cwd, wf);
    if (src) {
      copyForce(src, join(promptsRoot, 'workflows', `${wf}.md`), updated, cwd);
    }
  }

  if (pack === 'full' || pack === 'domain') {
    const domainRef = scaffoldPath('optional', 'domain', 'prompts', 'reference');
    if (existsSync(domainRef)) {
      for (const name of readdirSync(domainRef)) {
        if (!name.endsWith('.md')) continue;
        copyForce(join(domainRef, name), join(promptsRoot, 'reference', name), updated, cwd);
      }
    }
  }
}

function upgradeDocRootRoles(docRootAbs: string, pack: InstallPack, updated: string[], cwd: string): void {
  const rolesDir = join(docRootAbs, 'prompts');
  const goldenRoles = ['role-bootstrap.md', 'role-maintenance.md', 'role-review.md'];
  for (const role of goldenRoles) {
    const src = join(scaffoldPath('doc-root', 'prompts'), role);
    copyForce(src, join(rolesDir, role), updated, cwd);
  }
  if (pack === 'full' || pack === 'domain') {
    const arch = join(scaffoldPath('optional', 'architect', 'doc-root', 'prompts'), 'role-architecture-work.md');
    copyForce(arch, join(rolesDir, 'role-architecture-work.md'), updated, cwd);
  }
  if (pack === 'full' || pack === 'domain') {
    const domain = join(scaffoldPath('optional', 'domain', 'doc-root', 'prompts'), 'role-domain-work.md');
    copyForce(domain, join(rolesDir, 'role-domain-work.md'), updated, cwd);
  }
}

function addMissingScaffold(docRootAbs: string, pack: InstallPack, added: string[], cwd: string): void {
  copyIfMissing(
    join(scaffoldPath('doc-root', 'sources', 'index.md')),
    join(docRootAbs, 'sources', 'index.md'),
    added,
    cwd
  );
  copyIfMissing(
    join(scaffoldPath('doc-root', 'sources', 'log.md')),
    join(docRootAbs, 'sources', 'log.md'),
    added,
    cwd
  );
  copyIfMissing(
    join(scaffoldPath('doc-root', 'sources', '_template.md')),
    join(docRootAbs, 'sources', '_template.md'),
    added,
    cwd
  );
  copyIfMissing(
    join(scaffoldPath('doc-root', 'use-cases', 'index.md')),
    join(docRootAbs, 'use-cases', 'index.md'),
    added,
    cwd
  );
  copyIfMissing(
    join(scaffoldPath('doc-root', 'use-cases', '_template.md')),
    join(docRootAbs, 'use-cases', '_template.md'),
    added,
    cwd
  );
  copyIfMissing(
    join(scaffoldPath('doc-root', 'work', '_template.md')),
    join(docRootAbs, 'work', '_template.md'),
    added,
    cwd
  );
  copyIfMissing(
    join(scaffoldPath('doc-root', 'work', '_template-review.md')),
    join(docRootAbs, 'work', '_template-review.md'),
    added,
    cwd
  );

  if (pack === 'full' || pack === 'domain') {
    copyTreeIfMissing(
      join(scaffoldPath('optional', 'domain', 'doc-root', 'domain')),
      join(docRootAbs, 'domain'),
      added,
      cwd
    );
    copyIfMissing(
      join(scaffoldPath('optional', 'domain', 'doc-root', 'work', '_template-domain.md')),
      join(docRootAbs, 'work', '_template-domain.md'),
      added,
      cwd
    );
  }
}

function touchInstallMeta(
  cwd: string,
  meta: Record<string, string>,
  pack: InstallPack,
  docRoot: string,
  aiTool: string,
  project: string
): void {
  const lines = [
    `project=${meta.project || project}`,
    `doc_root=${docRoot}`,
    `template=${meta.template || 'arc42'}`,
    `ai_tool=${meta.ai_tool || aiTool}`,
    `doc_focus=${meta.doc_focus || ''}`,
    `pack=${pack}`,
    `installed=${meta.installed || ''}`,
    `upgraded=${new Date().toISOString()}`,
    `source=${meta.source || 'agm-upgrade'}`,
  ];
  if (meta.agm_ref) lines.push(`agm_ref=${meta.agm_ref}`);
  writeFileSync(join(cwd, '.agm-install-meta'), lines.filter(Boolean).join('\n') + '\n');
}

export function upgradeAgm(options: UpgradeOptions = {}): UpgradeResult {
  const cwd = options.cwd ?? process.cwd();
  const meta = readInstallMeta(cwd);
  const pack = resolvePack(options, meta);
  const docRoot = normDocRoot(options.docRoot ?? meta.doc_root ?? 'docs/architecture/');
  const docRootAbs = join(cwd, docRoot.replace(/\/$/, ''));
  const aiTool = (options.aiTool ?? meta.ai_tool ?? 'cursor') as UpgradeOptions['aiTool'];
  const project = options.project ?? meta.project ?? 'My Application';

  if (!existsSync(scaffoldPath())) {
    throw new Error('Scaffold bundle missing — reinstall @abx-hh/agm-cli');
  }

  const updated: string[] = [];
  const added: string[] = [];

  upgradeRepoPrompts(cwd, pack, updated);
  upgradeDocRootRoles(docRootAbs, pack, updated, cwd);

  if (options.addMissing !== false) {
    addMissingScaffold(docRootAbs, pack, added, cwd);
  }

  const docRootRule = docRoot.replace(/\/$/, '');
  writeAiToolRulesFromScaffold(aiTool ?? 'cursor', project, docRootRule, cwd, updated);

  touchInstallMeta(cwd, meta, pack, docRoot, aiTool ?? 'cursor', project);
  updated.push(relative(cwd, join(cwd, '.agm-install-meta')));

  const preservedNote =
    'Architecture content preserved: blueprint.md, entry-point.md, always-on.md, template chapters, work/, interfaces/, ops/, domain/.';

  return { docRoot, pack, updated, added, preservedNote };
}

/** Guard for tooling — document which doc-root paths must never be overwritten on upgrade. */
export function isProtectedDocRootPath(relPath: string): boolean {
  const base = relPath.replace(/\\/g, '/').split('/').pop() ?? relPath;
  if (DOCROOT_PROTECTED.has(base)) return true;
  const top = relPath.replace(/\\/g, '/').split('/')[0];
  if (DOCROOT_PROTECTED_DIRS.has(top)) return true;
  if (top === 'work' && !base.startsWith('_template')) return true;
  if (top === 'ops' && !base.startsWith('_template')) return true;
  return false;
}

export { GOLDEN_WORKFLOWS, ARCHITECT_WORKFLOWS, DOMAIN_WORKFLOWS };
