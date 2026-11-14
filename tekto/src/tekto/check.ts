import { existsSync, readFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import type { TektoConfig, CheckResult } from '../types.js';
import { docRootAbs, repoRoot } from '../config/load.js';
import { verifyLinks } from '../graph/verify.js';
import { checkGraphSync } from './check-graph.js';
import { checkWorkTrace } from './check-trace.js';
import { runContractValidator } from './check-validator.js';
import { normalizeChecks, type RunCheckOptions } from './check-options.js';
import { collectFiles } from './fs-doc.js';

const EVIDENCE_RE = /(?:^|\n)evidence:\s*\n((?:\s+-\s+.+\n?)+)/gm;
const FRONTMATTER_TYPE = /^---\n[\s\S]*?\ntype:\s*(\S+)/m;

function hasOkfType(content: string): boolean {
  if (!content.startsWith('---')) return false;
  return FRONTMATTER_TYPE.test(content);
}

function resolveEvidencePath(root: string, ref: string): string | null {
  const cleaned = ref.replace(/#.*$/, '').trim();
  if (!cleaned) return null;
  const candidate = resolve(root, cleaned);
  return existsSync(candidate) ? candidate : null;
}

function parseFindingsYaml(content: string): Array<{ evidence?: string[]; status?: string; id?: string }> {
  const items: Array<{ evidence?: string[]; status?: string; id?: string }> = [];
  const blocks = content.split(/^\s*-\s+id:/m).slice(1);
  for (const block of blocks) {
    const id = block.match(/^[\s]*([^\n]+)/)?.[1]?.trim();
    const ev: string[] = [];
    const evMatch = block.match(/evidence:\s*\n((?:\s+-\s+.+\n?)+)/);
    if (evMatch) {
      for (const line of evMatch[1].split('\n')) {
        const m = line.match(/^\s*-\s+(.+)$/);
        if (m) ev.push(m[1].trim());
      }
    }
    const status = block.match(/status:\s*(\w+)/)?.[1];
    items.push({ id, evidence: ev, status });
  }
  return items;
}

function runCoreCheck(config: TektoConfig, cwd: string): Pick<CheckResult, 'errors' | 'warnings'> {
  const errors: string[] = [];
  const warnings: string[] = [];
  const root = repoRoot(cwd);
  const docRoot = docRootAbs(config, cwd);

  if (!existsSync(join(docRoot, 'steer.md'))) {
    errors.push('missing steer.md');
  }
  if (!existsSync(join(docRoot, 'log.md'))) {
    errors.push('missing log.md');
  }

  for (const md of collectFiles(docRoot, '.md')) {
    const rel = md.replace(docRoot + '/', '');
    if (rel === 'steer.md' || rel === 'log.md') continue;
    const content = readFileSync(md, 'utf8');
    if (!hasOkfType(content)) {
      warnings.push(`missing OKF type: ${rel}`);
    }
    let m: RegExpExecArray | null;
    EVIDENCE_RE.lastIndex = 0;
    while ((m = EVIDENCE_RE.exec(content)) !== null) {
      for (const line of m[1].split('\n')) {
        const item = line.match(/^\s*-\s+(.+)$/);
        if (!item) continue;
        if (!resolveEvidencePath(root, item[1])) {
          errors.push(`evidence not found (${rel}): ${item[1]}`);
        }
      }
    }
  }

  for (const yf of collectFiles(join(docRoot, 'reviews'), '.yaml')) {
    const content = readFileSync(yf, 'utf8');
    const findings = parseFindingsYaml(content);
    for (const f of findings) {
      for (const ev of f.evidence ?? []) {
        if (!resolveEvidencePath(root, ev)) {
          errors.push(`finding evidence not found: ${f.id ?? '?'} → ${ev}`);
        }
      }
    }
    const threadsPath = join(dirname(yf), 'threads.yaml');
    if (existsSync(threadsPath)) {
      const threads = readFileSync(threadsPath, 'utf8');
      if (/status:\s*open/m.test(threads)) {
        const report = join(dirname(yf), 'report.md');
        if (existsSync(report)) {
          errors.push(`review has open threads but report exists: ${dirname(yf)}`);
        }
      }
    }
  }

  return { errors, warnings };
}

export function runTektoCheck(
  config: TektoConfig,
  cwd = process.cwd(),
  options: RunCheckOptions = {}
): CheckResult {
  const checks = normalizeChecks(options.checks);
  const errors: string[] = [];
  const warnings: string[] = [];
  const checkStatus: NonNullable<CheckResult['checks']> = {};
  const root = repoRoot(cwd);
  const docRoot = docRootAbs(config, cwd);
  const docRootRel = config.docRoot.replace(/\/+$/, '');

  if (checks.includes('core')) {
    const core = runCoreCheck(config, cwd);
    errors.push(...core.errors);
    warnings.push(...core.warnings);
    checkStatus.core = core.errors.length ? 'fail' : 'pass';
  }

  const linkResult = verifyLinks(config, cwd);
  checkStatus.links = linkResult.status;
  if (linkResult.status === 'fail') {
    for (const b of linkResult.brokenLinks.slice(0, 20)) {
      errors.push(`broken link in ${b.file}: ${b.link}`);
    }
  }

  if (checks.includes('graph')) {
    const graph = checkGraphSync(docRoot, root);
    errors.push(...graph.errors);
    warnings.push(...graph.warnings);
    checkStatus.graph = graph.status;
  }

  if (checks.includes('trace')) {
    const trace = checkWorkTrace(docRoot, root);
    errors.push(...trace.errors);
    warnings.push(...trace.warnings);
    checkStatus.trace = trace.status;
  }

  if (options.withValidator || checks.includes('contract')) {
    const contract = runContractValidator(root, docRootRel);
    if (contract) {
      errors.push(...contract.errors);
      warnings.push(...contract.warnings);
      checkStatus.contract = contract.status;
    } else if (checks.includes('contract') || options.withValidator) {
      warnings.push('[contract] tekto-validator not on PATH (skipped)');
      checkStatus.contract = 'pass';
    }
  }

  const status = errors.length ? 'fail' : 'pass';
  return { status, errors, warnings, checks: checkStatus };
}