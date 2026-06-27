import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type {
  AgmConfig,
  BlueprintPhase,
  GraphStatus,
  GuardrailFinding,
  PhaseState,
  WorkRegisterItem,
} from '../types.js';
import { docRootAbs, resolvedTemplate } from '../config/load.js';

function parsePhaseState(raw: string): PhaseState | null {
  if (raw.includes('[x]')) return 'done';
  if (raw.includes('[~]')) return 'in_progress';
  if (raw.includes('[!]')) return 'blocked';
  if (raw.includes('[ ]')) return 'open';
  return null;
}

function parseStatusTable(content: string): BlueprintPhase[] {
  const phases: BlueprintPhase[] = [];
  const statusIdx = content.indexOf('## Status');
  if (statusIdx < 0) return phases;

  const after = content.slice(statusIdx);
  const lines = after.split('\n');
  let inTable = false;

  for (const line of lines) {
    if (line.startsWith('|') && line.includes('Phase')) {
      inTable = true;
      continue;
    }
    if (!inTable) continue;
    if (!line.startsWith('|')) break;
    if (/^\|[\s-|]+\|$/.test(line.replace(/\s/g, ''))) continue;

    const cols = line
      .split('|')
      .map((c) => c.trim())
      .filter((_, i, arr) => i > 0 && i < arr.length - 1);
    if (cols.length < 4) continue;

    const state = parsePhaseState(cols[3] || '');
    if (!state) continue;

    phases.push({
      phase: cols[0],
      section: cols[1],
      targetFile: cols[2],
      state,
      lastUpdated: cols[4] || '—',
    });
  }

  return phases;
}

function parseWorkRegister(content: string): WorkRegisterItem[] {
  const items: WorkRegisterItem[] = [];
  const wrkIdx = content.search(/## (Work register|Architecture work)/);
  if (wrkIdx < 0) return items;

  const after = content.slice(wrkIdx);
  const lines = after.split('\n');
  let inTable = false;

  for (const line of lines) {
    if (line.startsWith('|') && (line.includes('ID') || line.includes('WRK'))) {
      inTable = true;
      continue;
    }
    if (!inTable) continue;
    if (!line.startsWith('|')) break;
    if (/^\|[\s-|]+\|$/.test(line.replace(/\s/g, ''))) continue;
    if (line.includes('WRK') === false && !line.match(/\|\s*WRK-/)) continue;
    if (line.includes('—')) continue;

    const cols = line
      .split('|')
      .map((c) => c.trim())
      .filter((_, i, arr) => i > 0 && i < arr.length - 1);
    if (cols.length < 6) continue;

    items.push({
      id: cols[0],
      track: cols[1],
      title: cols[2],
      type: cols[3],
      file: cols[4],
      status: cols[5],
      date: cols[6] || '',
    });
  }

  return items;
}

function parseGuardrails(content: string): GuardrailFinding[] {
  const findings: GuardrailFinding[] = [];
  const idx = content.indexOf('## Guardrail findings');
  if (idx < 0) return findings;

  const after = content.slice(idx);
  const lines = after.split('\n');
  let inTable = false;

  for (const line of lines) {
    if (line.startsWith('|') && line.includes('Finding')) {
      inTable = true;
      continue;
    }
    if (!inTable) continue;
    if (!line.startsWith('|')) break;
    if (/^\|[\s-|]+\|$/.test(line.replace(/\s/g, ''))) continue;
    if (line.includes('—')) continue;

    const cols = line
      .split('|')
      .map((c) => c.trim())
      .filter((_, i, arr) => i > 0 && i < arr.length - 1);
    if (cols.length < 4) continue;

    findings.push({
      file: cols[0],
      finding: cols[1],
      severity: cols[2],
      source: cols[3],
    });
  }

  return findings;
}

export function getGraphStatus(config: AgmConfig, cwd = process.cwd()): GraphStatus {
  const docRoot = docRootAbs(config, cwd);
  const blueprintPath = join(docRoot, 'blueprint.md');

  if (!existsSync(blueprintPath)) {
    throw new Error(`blueprint.md not found at ${blueprintPath}. Run agm init first.`);
  }

  const content = readFileSync(blueprintPath, 'utf8');
  const phases = parseStatusTable(content);
  const workItems = parseWorkRegister(content);
  const guardrails = parseGuardrails(content);

  return {
    docRoot: config.docRoot,
    template: resolvedTemplate(config),
    openPhases: phases.filter((p) => p.state === 'open' || p.state === 'blocked'),
    inProgressPhases: phases.filter((p) => p.state === 'in_progress'),
    activeWorkItems: workItems.filter((w) => w.status === 'draft'),
    guardrailFindings: guardrails,
  };
}
