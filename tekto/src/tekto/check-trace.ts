import { existsSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { collectFiles } from './fs-doc.js';

export interface SubCheckResult {
  status: 'pass' | 'fail';
  errors: string[];
  warnings: string[];
}

const ACTIVE_STATUS = new Set(['draft', 'in-progress', 'open', 'proposed', 'active']);
const MD_LINK = /\[[^\]]*\]\([^)]+\)/;

function sectionBody(content: string, heading: string): string {
  const re = new RegExp(`^##\\s+${heading}\\s*\\n([\\s\\S]*?)(?=^##\\s+|\\Z)`, 'im');
  const m = content.match(re);
  return m?.[1]?.trim() ?? '';
}

function parseWorkMeta(content: string): { id: string | null; status: string | null } {
  const id = content.match(/\|\s*\*\*ID\*\*\s*\|\s*(WRK-\d+)\s*\|/)?.[1] ?? null;
  const status = content.match(/\|\s*\*\*Status\*\*\s*\|\s*(\S+)\s*\|/)?.[1]?.toLowerCase() ?? null;
  return { id, status };
}

function traceabilityHasLink(body: string): boolean {
  if (!body) return false;
  const rows = body.split('\n').filter((l) => l.trim().startsWith('|') && !l.includes('---'));
  for (const row of rows) {
    if (MD_LINK.test(row)) return true;
  }
  return MD_LINK.test(body);
}

export function checkWorkTrace(docRoot: string, repoRoot: string): SubCheckResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const workDir = join(docRoot, 'work');
  if (!existsSync(workDir)) {
    return { status: 'pass', errors, warnings };
  }

  for (const md of collectFiles(workDir, '.md')) {
    const base = md.split('/').pop()!;
    if (base === 'README.md' || base.startsWith('_template')) continue;

    const content = readFileSync(md, 'utf8');
    const { id, status } = parseWorkMeta(content);
    if (!id || !status || !ACTIVE_STATUS.has(status)) continue;

    const rel = relative(repoRoot, md);
    const rec = sectionBody(content, 'Recommendations');
    const trace = sectionBody(content, 'Traceability');

    if (!rec) {
      errors.push(`[trace] ${rel} (${id}, ${status}): missing ## Recommendations`);
      continue;
    }

    if (!/none for this/i.test(rec) && rec.length > 0) {
      const lines = rec.split('\n').filter((l) => /^\d+\.\s+/.test(l.trim()));
      for (const line of lines) {
        if (!MD_LINK.test(line)) {
          warnings.push(`[trace] ${rel} (${id}): recommendation without link: ${line.trim().slice(0, 80)}`);
        }
      }
    }

    if (!traceabilityHasLink(trace)) {
      errors.push(`[trace] ${rel} (${id}, ${status}): ## Traceability needs at least one linked row`);
    }
  }

  return { status: errors.length ? 'fail' : 'pass', errors, warnings };
}