import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';
import type { AgmConfig } from '../types.js';
import { packageRoot } from '../paths.js';
import { findProjectRoot } from './load.js';

const PROMPTS_FILE = 'workflows-prompts.json';

export class PromptPackNotFoundError extends Error {
  constructor() {
    super(
      'AGM prompt pack not found. Install workflows-prompts.json privately ' +
        '(see agm/prompts-pack/README.md). Set promptsPath in .agm/config.json or AGM_PROMPTS_PATH.'
    );
    this.name = 'PromptPackNotFoundError';
  }
}

/** Candidate directories that may contain workflows-prompts.json */
export function resolvePromptsDirectories(config: AgmConfig, cwd = process.cwd()): string[] {
  const candidates: string[] = [];

  if (config.promptsPath) {
    candidates.push(resolve(config.promptsPath));
  }

  const envPath = process.env.AGM_PROMPTS_PATH?.trim();
  if (envPath) {
    candidates.push(resolve(envPath));
  }

  candidates.push(join(homedir(), '.agm', 'prompts-pack'));
  candidates.push(join(packageRoot(), 'prompts-pack'));

  const projectRoot = findProjectRoot(cwd);
  candidates.push(join(projectRoot, '.agm', 'prompts-pack'));

  return [...new Set(candidates)];
}

export function findPromptsFile(config: AgmConfig, cwd = process.cwd()): string | null {
  for (const dir of resolvePromptsDirectories(config, cwd)) {
    const file = join(dir, PROMPTS_FILE);
    if (existsSync(file)) return file;
    if (existsSync(dir) && dir.endsWith('.json')) {
      return dir;
    }
  }
  return null;
}

let promptsCache: Record<string, string> | null = null;
let promptsCachePath: string | null = null;

export function loadPromptMap(config: AgmConfig, cwd = process.cwd()): Record<string, string> {
  const file = findPromptsFile(config, cwd);
  if (!file) {
    throw new PromptPackNotFoundError();
  }
  if (promptsCache && promptsCachePath === file) {
    return promptsCache;
  }
  promptsCache = JSON.parse(readFileSync(file, 'utf8')) as Record<string, string>;
  promptsCachePath = file;
  return promptsCache;
}

export function isPromptPackInstalled(config: AgmConfig, cwd = process.cwd()): boolean {
  return findPromptsFile(config, cwd) !== null;
}
