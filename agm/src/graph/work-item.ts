import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { AgmConfig } from '../types.js';
import { docRootAbs } from '../config/load.js';

export interface RegisterWorkItemInput {
  title: string;
  track: 'architecture' | 'domain';
  type: string;
  file: string;
  status?: 'draft' | 'reviewed' | 'superseded';
  date?: string;
}

export interface RegisterReviewInput {
  phaseTarget: string;
  reviewed: string;
  verdict: 'PASS' | 'PASS WITH NOTES' | 'FAIL';
  report: string;
  findings: number;
}

function nextWrkId(content: string): string {
  const matches = [...content.matchAll(/WRK-(\d+)/g)];
  const max = matches.reduce((m, match) => Math.max(m, parseInt(match[1], 10)), 0);
  return `WRK-${String(max + 1).padStart(3, '0')}`;
}

function insertWorkRow(content: string, row: string): string {
  const heading = content.includes('## Work register') ? '## Work register' : '## Architecture work';
  const idx = content.indexOf(heading);
  if (idx < 0) {
    throw new Error('blueprint.md missing ## Work register section');
  }

  const after = content.slice(idx);
  const lines = after.split('\n');
  let insertAt = -1;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('|') && !lines[i].includes('ID') && !/^\|[\s-|]+\|$/.test(lines[i].replace(/\s/g, ''))) {
      insertAt = i;
      break;
    }
  }

  if (insertAt < 0) {
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('|') && lines[i].includes('ID')) {
        insertAt = i + 2;
        break;
      }
    }
  }

  if (insertAt < 0) throw new Error('Could not locate work register table in blueprint.md');

  lines.splice(insertAt, 0, row);
  return content.slice(0, idx) + lines.join('\n');
}

function insertReviewRow(content: string, row: string): string {
  const heading = '## Reviews';
  const idx = content.indexOf(heading);
  if (idx < 0) throw new Error('blueprint.md missing ## Reviews section');

  const after = content.slice(idx);
  const lines = after.split('\n');
  let insertAt = -1;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('|') && !lines[i].includes('Phase') && !/^\|[\s-|]+\|$/.test(lines[i].replace(/\s/g, ''))) {
      insertAt = i;
      break;
    }
  }

  if (insertAt < 0) {
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('|') && lines[i].includes('Phase')) {
        insertAt = i + 2;
        break;
      }
    }
  }

  if (insertAt < 0) throw new Error('Could not locate reviews table in blueprint.md');

  lines.splice(insertAt, 0, row);
  return content.slice(0, idx) + lines.join('\n');
}

export function registerWorkItem(
  config: AgmConfig,
  input: RegisterWorkItemInput,
  cwd = process.cwd()
): { wrkId: string; row: string } {
  const docRoot = docRootAbs(config, cwd);
  const blueprintPath = join(docRoot, 'blueprint.md');

  if (!existsSync(blueprintPath)) {
    throw new Error(`blueprint.md not found at ${blueprintPath}`);
  }

  let content = readFileSync(blueprintPath, 'utf8');
  const wrkId = nextWrkId(content);
  const date = input.date || new Date().toISOString().slice(0, 10);
  const status = input.status || 'draft';
  const row = `| ${wrkId} | ${input.track} | ${input.title} | ${input.type} | ${input.file} | ${status} | ${date} |`;

  content = insertWorkRow(content, row);
  writeFileSync(blueprintPath, content, 'utf8');

  return { wrkId, row };
}

export function registerReviewVerdict(
  config: AgmConfig,
  input: RegisterReviewInput,
  cwd = process.cwd()
): { row: string } {
  const docRoot = docRootAbs(config, cwd);
  const blueprintPath = join(docRoot, 'blueprint.md');

  if (!existsSync(blueprintPath)) {
    throw new Error(`blueprint.md not found at ${blueprintPath}`);
  }

  let content = readFileSync(blueprintPath, 'utf8');
  const row = `| ${input.phaseTarget} | ${input.reviewed} | ${input.verdict} | ${input.report} | ${input.findings} |`;

  content = insertReviewRow(content, row);
  writeFileSync(blueprintPath, content, 'utf8');

  return { row };
}
