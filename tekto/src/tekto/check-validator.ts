import { spawnSync } from 'node:child_process';
import type { SubCheckResult } from './check-graph.js';

const BINARIES = ['tekto-validator', 'agm-validator'];

function findValidator(): string | null {
  for (const name of BINARIES) {
    const which = spawnSync('sh', ['-c', `command -v ${name}`], { encoding: 'utf8' });
    if (which.status === 0 && which.stdout.trim()) return which.stdout.trim();
  }
  return null;
}

export function runContractValidator(repoRoot: string, docRootRel: string): SubCheckResult | null {
  const bin = findValidator();
  if (!bin) return null;

  const archRoot = docRootRel.replace(/\/+$/, '');
  const run = spawnSync(
    bin,
    ['validate', '--repo', repoRoot, '--arch', archRoot, '--check', 'contract', '--quiet'],
    { encoding: 'utf8' }
  );

  const errors: string[] = [];
  const warnings: string[] = [];
  const out = `${run.stdout}\n${run.stderr}`.trim();

  if (run.status !== 0 && out) {
    for (const line of out.split('\n')) {
      if (line.trim()) errors.push(`[contract] ${line.trim()}`);
    }
  }
  if (run.status !== 0 && !out) {
    errors.push(`[contract] ${bin} failed (exit ${run.status})`);
  }
  if (run.error) {
    warnings.push(`[contract] could not run ${bin}: ${run.error.message}`);
  }

  return { status: errors.length ? 'fail' : 'pass', errors, warnings };
}