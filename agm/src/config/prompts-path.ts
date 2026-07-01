import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';
import type { AgmConfig } from '../types.js';
import { dataPath, packageRoot } from '../paths.js';
import { findProjectRoot } from './load.js';
import {
  COMPRESSED_PROMPTS_FILE,
  loadCompressedPackFromFile,
  loadShippedCompressedPrompts,
} from '../prompts/compressed-pack.js';

const PROMPTS_FILE = 'workflows-prompts.json';
const STARTER_FILE = 'workflows-starter-prompts.json';

export type PromptPackTier = 'full' | 'starter' | 'none';
export type PromptPackFormat = 'compressed' | 'plaintext';

export class PromptPackNotFoundError extends Error {
  constructor() {
    super(
      'AGM prompt pack not found. Install @abx-hh/agm-cli (ships LLMLingua-2 compressed golden path) ' +
        'or add a private workflows-prompts.json / workflows-prompts-compressed.json ' +
        '(see agm/prompts-pack/README.md). Set promptsPath in .agm/config.json or AGM_PROMPTS_PATH.'
    );
    this.name = 'PromptPackNotFoundError';
  }
}

/** Candidate directories that may contain private prompt packs. */
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

function findPrivateFileInDirs(
  config: AgmConfig,
  filename: string,
  cwd = process.cwd()
): string | null {
  for (const dir of resolvePromptsDirectories(config, cwd)) {
    const file = join(dir, filename);
    if (existsSync(file)) return file;
    if (existsSync(dir) && dir.endsWith('.json')) {
      return dir;
    }
  }
  return null;
}

export function findPrivatePromptsFile(config: AgmConfig, cwd = process.cwd()): string | null {
  return findPrivateFileInDirs(config, PROMPTS_FILE, cwd);
}

export function findPrivateCompressedPromptsFile(
  config: AgmConfig,
  cwd = process.cwd()
): string | null {
  return findPrivateFileInDirs(config, COMPRESSED_PROMPTS_FILE, cwd);
}

/** @deprecated Use findPrivatePromptsFile */
export function findPromptsFile(config: AgmConfig, cwd = process.cwd()): string | null {
  return findPrivatePromptsFile(config, cwd);
}

function allowPlaintextStarter(): boolean {
  return (
    process.env.AGM_ALLOW_PLAINTEXT_PROMPTS === '1' ||
    process.env.NODE_ENV === 'development'
  );
}

function loadPlaintextStarterPromptMap(): Record<string, string> {
  const file = dataPath(STARTER_FILE);
  if (!existsSync(file)) return {};
  return JSON.parse(readFileSync(file, 'utf8')) as Record<string, string>;
}

let promptsCache: Record<string, string> | null = null;
let promptsCacheKey: string | null = null;
let formatCache: PromptPackFormat | null = null;

export function getPromptPackFormat(config: AgmConfig, cwd = process.cwd()): PromptPackFormat {
  if (formatCache) return formatCache;
  if (findPrivatePromptsFile(config, cwd)) return 'plaintext';
  if (
    findPrivateCompressedPromptsFile(config, cwd) ||
    Object.keys(loadShippedCompressedPrompts()).length
  ) {
    return 'compressed';
  }
  if (allowPlaintextStarter() && Object.keys(loadPlaintextStarterPromptMap()).length) {
    return 'plaintext';
  }
  return 'compressed';
}

export function loadPromptMap(config: AgmConfig, cwd = process.cwd()): Record<string, string> {
  const privatePlain = findPrivatePromptsFile(config, cwd);
  const privateCompressed = findPrivateCompressedPromptsFile(config, cwd);
  const cacheKey = [privatePlain, privateCompressed, dataPath(COMPRESSED_PROMPTS_FILE)].join('|');

  if (promptsCache && promptsCacheKey === cacheKey) {
    return promptsCache;
  }

  let merged: Record<string, string> = { ...loadShippedCompressedPrompts() };

  if (privateCompressed) {
    merged = { ...merged, ...loadCompressedPackFromFile(privateCompressed) };
  }

  if (privatePlain) {
    const privateMap = JSON.parse(readFileSync(privatePlain, 'utf8')) as Record<string, string>;
    merged = { ...merged, ...privateMap };
  } else if (!Object.keys(merged).length && allowPlaintextStarter()) {
    merged = loadPlaintextStarterPromptMap();
  }

  if (!Object.keys(merged).length) {
    throw new PromptPackNotFoundError();
  }

  promptsCache = merged;
  promptsCacheKey = cacheKey;
  formatCache = privatePlain
    ? 'plaintext'
    : privateCompressed || Object.keys(loadShippedCompressedPrompts()).length
      ? 'compressed'
      : 'plaintext';

  return merged;
}

export function getPromptPackTier(config: AgmConfig, cwd = process.cwd()): PromptPackTier {
  if (findPrivatePromptsFile(config, cwd) || findPrivateCompressedPromptsFile(config, cwd)) {
    return 'full';
  }
  if (
    Object.keys(loadShippedCompressedPrompts()).length ||
    (allowPlaintextStarter() && Object.keys(loadPlaintextStarterPromptMap()).length)
  ) {
    return 'starter';
  }
  return 'none';
}

export function isPromptPackInstalled(config: AgmConfig, cwd = process.cwd()): boolean {
  return getPromptPackTier(config, cwd) !== 'none';
}

export function starterWorkflowIds(): string[] {
  const compressed = loadShippedCompressedPrompts();
  if (Object.keys(compressed).length) {
    return Object.keys(compressed);
  }
  return Object.keys(loadPlaintextStarterPromptMap());
}
