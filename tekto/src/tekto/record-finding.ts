import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import type { TektoConfig } from '../types.js';
import { docRootAbs } from '../config/load.js';

export interface FindingInput {
  id: string;
  aspect: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  claim: string;
  evidence: string[];
  rule?: string;
  confidence?: 'low' | 'medium' | 'high';
  status?: 'open' | 'addressed' | 'wontfix';
}

function reviewDir(docRoot: string, reviewId: string): string {
  return join(docRoot, 'reviews', reviewId);
}

function appendFindingYaml(existing: string, f: FindingInput): string {
  const block = [
    `- id: ${f.id}`,
    `  aspect: ${f.aspect}`,
    `  severity: ${f.severity}`,
    `  claim: "${f.claim.replace(/"/g, '\\"')}"`,
    `  evidence:`,
    ...f.evidence.map((e) => `    - ${e}`),
    f.rule ? `  rule: ${f.rule}` : '',
    `  confidence: ${f.confidence ?? 'medium'}`,
    `  status: ${f.status ?? 'open'}`,
  ]
    .filter(Boolean)
    .join('\n');
  const trimmed = existing.trim();
  if (!trimmed) return `${block}\n`;
  return `${trimmed}\n${block}\n`;
}

export function recordFinding(
  config: TektoConfig,
  reviewId: string,
  finding: FindingInput,
  cwd = process.cwd()
): string {
  const docRoot = docRootAbs(config, cwd);
  const dir = reviewDir(docRoot, reviewId);
  mkdirSync(dir, { recursive: true });
  const path = join(dir, 'findings.yaml');
  const prev = existsSync(path) ? readFileSync(path, 'utf8') : '';
  const next = appendFindingYaml(prev, finding);
  writeFileSync(path, next);
  return path;
}