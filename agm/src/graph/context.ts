import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { AgmConfig } from '../types.js';
import { docRootAbs } from '../config/load.js';

export interface LoadedContext {
  docRoot: string;
  alwaysOn: string;
  entryPoint: string;
  alwaysOnPath: string;
  entryPointPath: string;
}

export function loadContext(config: AgmConfig, cwd = process.cwd()): LoadedContext {
  const docRoot = docRootAbs(config, cwd);
  const alwaysOnPath = join(docRoot, 'context/always-on.md');
  const entryPointPath = join(docRoot, 'entry-point.md');

  if (!existsSync(alwaysOnPath)) {
    throw new Error(`always-on.md not found at ${alwaysOnPath}. Run agm init first.`);
  }
  if (!existsSync(entryPointPath)) {
    throw new Error(`entry-point.md not found at ${entryPointPath}. Run agm init first.`);
  }

  return {
    docRoot: config.docRoot,
    alwaysOn: readFileSync(alwaysOnPath, 'utf8'),
    entryPoint: readFileSync(entryPointPath, 'utf8'),
    alwaysOnPath: join(config.docRoot, 'context/always-on.md'),
    entryPointPath: join(config.docRoot, 'entry-point.md'),
  };
}
