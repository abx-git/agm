import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { TektoConfig } from '../types.js';
import { docRootAbs } from '../config/load.js';
import { loadContext } from '../graph/context.js';

export type PacketKind = 'aspect' | 'revise' | 'summarize';

export function buildPacket(
  config: TektoConfig,
  kind: PacketKind,
  target: string,
  cwd = process.cwd()
): string {
  const ctx = loadContext(config, cwd);
  const docRoot = docRootAbs(config, cwd);
  const parts: string[] = [
    '# Tekto packet',
    '',
    `Kind: ${kind}`,
    `Target: ${target}`,
    '',
    '## steer.md',
    ctx.steer,
    '',
    '## log (tail)',
    ctx.logTail,
    '',
  ];

  if (kind === 'aspect') {
    const aspectPath = join(docRoot, 'aspects', `${target}.yaml`);
    const packPath = join(cwd, 'packs', 'aspects', `${target}.yaml`);
    const path = existsSync(aspectPath) ? aspectPath : packPath;
    if (existsSync(path)) {
      parts.push('## aspect', readFileSync(path, 'utf8'), '');
    }
    parts.push('Use skill: tekto-review-aspect. Write findings.yaml under reviews/<id>/');
  }

  if (kind === 'revise' || kind === 'summarize') {
    const reviewDir = join(docRoot, 'reviews', target);
    for (const file of ['findings.yaml', 'threads.yaml']) {
      const p = join(reviewDir, file);
      if (existsSync(p)) {
        parts.push(`## ${file}`, readFileSync(p, 'utf8'), '');
      }
    }
    parts.push(kind === 'revise' ? 'Use skill: tekto-review-revise' : 'Use skill: tekto-review-summarize');
  }

  return parts.join('\n');
}