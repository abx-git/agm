import { execSync } from 'node:child_process';
import { findProjectRoot } from '../config/load.js';

export function fetchGitDiff(diffFrom: string, diffTo = 'HEAD', threeDot = false): string {
  const root = findProjectRoot();
  const range = threeDot ? `${diffFrom}...${diffTo}` : `${diffFrom}..${diffTo}`;
  try {
    return execSync(`git diff ${range}`, {
      cwd: root,
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`git diff failed for ${range}: ${message}`);
  }
}
