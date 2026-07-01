import { existsSync, readFileSync } from 'node:fs';
import { dataPath } from '../paths.js';

export const COMPRESSED_PROMPTS_FILE = 'workflows-prompts-compressed.json';

export interface CompressedPromptPack {
  version: number;
  codec: string;
  scope?: string;
  targetRatio?: number;
  prompts: Record<string, string>;
}

export function parseCompressedPack(raw: unknown): Record<string, string> {
  if (!raw || typeof raw !== 'object') return {};
  const pack = raw as CompressedPromptPack;
  if (pack.prompts && typeof pack.prompts === 'object') {
    return pack.prompts;
  }
  return {};
}

export function loadCompressedPackFromFile(file: string): Record<string, string> {
  if (!existsSync(file)) return {};
  const pack = JSON.parse(readFileSync(file, 'utf8'));
  return parseCompressedPack(pack);
}

export function loadShippedCompressedPrompts(): Record<string, string> {
  return loadCompressedPackFromFile(dataPath(COMPRESSED_PROMPTS_FILE));
}

/** Prefix so agents treat compressed AGM instructions correctly. */
export function wrapCompressedInstruction(workflowId: string, compressed: string): string {
  return (
    `[[AGM_COMPRESSED:llmlingua-2:${workflowId}]]\n` +
    `This block is an LLMLingua-2 compressed AGM session prompt. Execute it as-is; do not ask the human to paste procedure text.\n\n` +
    compressed
  );
}
