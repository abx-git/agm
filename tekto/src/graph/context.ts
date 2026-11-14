import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { TektoConfig } from '../types.js';
import { docRootAbs } from '../config/load.js';

export interface TektoContext {
  docRoot: string;
  steerPath: string;
  steer: string;
  logPath: string;
  logTail: string;
}

export function loadContext(config: TektoConfig, cwd = process.cwd()): TektoContext {
  const docRoot = docRootAbs(config, cwd);
  const steerPath = join(docRoot, 'steer.md');
  const logPath = join(docRoot, 'log.md');
  const steer = existsSync(steerPath) ? readFileSync(steerPath, 'utf8') : '';
  const logTail = existsSync(logPath)
    ? readFileSync(logPath, 'utf8').split('\n').slice(0, 40).join('\n')
    : '';
  return {
    docRoot,
    steerPath,
    steer,
    logPath,
    logTail,
  };
}