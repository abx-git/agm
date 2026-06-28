import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';
import type { AgmConfig } from '../types.js';
import { dataPath, packageRoot } from '../paths.js';
import { findProjectRoot } from './load.js';

const PROMPTS_FILE = 'workflows-prompts.json';
const STARTER_FILE = 'workflows-starter-prompts.json';

export type PromptPackTier = 'full' | 'starter' | 'none';

export class PromptPackNotFoundError extends Error {
  constructor() {
    super(
      'AGM prompt pack not found. The public starter pack should ship with @agm/cli. ' +
        'For all workflows, install workflows-prompts.json privately ' +
        '(see agm/prompts-pack/README.md). Set promptsPath in .agm/config.json or AGM_PROMPTS_PATH.'
    );
    this.name = 'PromptPackNotFoundError';
  }
}

/** Candidate directories that may contain workflows-prompts.json (full private pack). */
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

export function findPrivatePromptsFile(config: AgmConfig, cwd = process.cwd()): string | null {
  for (const dir of resolvePromptsDirectories(config, cwd)) {
    const file = join(dir, PROMPTS_FILE);
    if (existsSync(file)) return file;
    if (existsSync(dir) && dir.endsWith('.json')) {
      return dir;
    }
  }
  return null;
}

/** @deprecated Use findPrivatePromptsFile */
export function findPromptsFile(config: AgmConfig, cwd = process.cwd()): string | null {
  return findPrivatePromptsFile(config, cwd);
}

function loadStarterPromptMap(): Record<string, string> {
  const file = dataPath(STARTER_FILE);
  if (!existsSync(file)) return {};
  return JSON.parse(readFileSync(file, 'utf8')) as Record<string, string>;
}

let promptsCache: Record<string, string> | null = null;
let promptsCacheKey: string | null = null;

export function loadPromptMap(config: AgmConfig, cwd = process.cwd()): Record<string, string> {
  const privateFile = findPrivatePromptsFile(config, cwd);
  const cacheKey = privateFile ?? `starter:${dataPath(STARTER_FILE)}`;

  if (promptsCache && promptsCacheKey === cacheKey) {
    return promptsCache;
  }

  const starter = loadStarterPromptMap();
  let merged = { ...starter };

  if (privateFile) {
    const privateMap = JSON.parse(readFileSync(privateFile, 'utf8')) as Record<string, string>;
    merged = { ...starter, ...privateMap };
  }

  if (!Object.keys(merged).length) {
    throw new PromptPackNotFoundError();
  }

  promptsCache = merged;
  promptsCacheKey = cacheKey;
  return merged;
}

export function getPromptPackTier(config: AgmConfig, cwd = process.cwd()): PromptPackTier {
  if (findPrivatePromptsFile(config, cwd)) return 'full';
  if (Object.keys(loadStarterPromptMap()).length) return 'starter';
  return 'none';
}

export function isPromptPackInstalled(config: AgmConfig, cwd = process.cwd()): boolean {
  return getPromptPackTier(config, cwd) !== 'none';
}

export function starterWorkflowIds(): string[] {
  return Object.keys(loadStarterPromptMap());
}
