import { existsSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { collectFiles } from './fs-doc.js';

export interface SubCheckResult {
  status: 'pass' | 'fail';
  errors: string[];
  warnings: string[];
}

function parseWorkRegistry(readme: string): Map<string, string> {
  const map = new Map<string, string>();
  for (const line of readme.split('\n')) {
    if (!line.trimStart().startsWith('| WRK-')) continue;
    const id = line.match(/^\|\s*(WRK-\d+)/)?.[1];
    const fileLink = line.match(/\[([^\]]+)\]\(([^)]+\.md)\)/);
    if (id && fileLink) map.set(id, fileLink[2]!);
  }
  return map;
}

function wrkIdFromFile(content: string, filename: string): string | null {
  const m = content.match(/\|\s*\*\*ID\*\*\s*\|\s*(WRK-\d+)\s*\|/);
  if (m) return m[1]!;
  const title = content.match(/^#\s+(WRK-\d+)/m);
  if (title) return title[1]!;
  const fromName = filename.match(/^(WRK-\d+)/);
  return fromName ? fromName[1]! : null;
}

export function checkGraphSync(docRoot: string, repoRoot: string): SubCheckResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const rel = (p: string) => relative(repoRoot, p);

  if (!existsSync(join(docRoot, 'index.md'))) {
    warnings.push('[graph] missing index.md');
  }

  const steerPath = join(docRoot, 'steer.md');
  if (existsSync(steerPath)) {
    const steer = readFileSync(steerPath, 'utf8');
    if (existsSync(join(docRoot, 'index.md')) && !/\]\(\.\/index\.md\)|\]\(index\.md\)/.test(steer)) {
      warnings.push('[graph] steer.md ## Map does not link index.md');
    }
    if (!/^##\s+Map/m.test(steer)) {
      warnings.push('[graph] steer.md missing ## Map section');
    }
  }

  const logPath = join(docRoot, 'log.md');
  if (existsSync(logPath)) {
    const log = readFileSync(logPath, 'utf8');
    if (!/^\s*\d{4}-\d{2}-\d{2}\s*\|/m.test(log) && log.includes('| type |')) {
      warnings.push('[graph] log.md has no dated entries yet');
    }
  }

  const workDir = join(docRoot, 'work');
  const readmePath = join(workDir, 'README.md');
  if (existsSync(workDir) && existsSync(readmePath)) {
    const readme = readFileSync(readmePath, 'utf8');
    const registry = parseWorkRegistry(readme);

    for (const [id, href] of registry) {
      const target = join(workDir, href.replace(/^\.\//, ''));
      if (!existsSync(target)) {
        errors.push(`[graph] work registry ${id} → missing file ${href}`);
      }
    }

    for (const md of collectFiles(workDir, '.md')) {
      const base = md.split('/').pop()!;
      if (base === 'README.md' || base.startsWith('_template')) continue;
      const content = readFileSync(md, 'utf8');
      const id = wrkIdFromFile(content, base);
      if (!id) continue;
      if (!registry.has(id)) {
        warnings.push(`[graph] ${rel(md)} (${id}) not listed in work/README.md`);
      }
    }

  }

  return { status: errors.length ? 'fail' : 'pass', errors, warnings };
}