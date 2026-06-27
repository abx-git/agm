#!/usr/bin/env node
/**
 * Split docs/assistant/workflows.json into:
 *   agm/data/workflows-catalog.json  (public — no prompt field)
 *   agm/prompts-pack/workflows-prompts.json  (private — id → prompt)
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(root, 'docs/assistant/workflows.json');
const catalogDest = join(root, 'agm/data/workflows-catalog.json');
const promptsDest = join(root, 'agm/prompts-pack/workflows-prompts.json');

const workflows = JSON.parse(readFileSync(source, 'utf8'));
const catalog = [];
const prompts = {};

for (const w of workflows) {
  const { prompt, ...meta } = w;
  catalog.push(meta);
  if (prompt) prompts[w.id] = prompt;
}

mkdirSync(dirname(catalogDest), { recursive: true });
mkdirSync(dirname(promptsDest), { recursive: true });

writeFileSync(catalogDest, JSON.stringify(catalog, null, 2) + '\n');
writeFileSync(promptsDest, JSON.stringify(prompts, null, 2) + '\n');

console.log(`Catalog: ${catalog.length} workflows → ${catalogDest}`);
console.log(`Prompts: ${Object.keys(prompts).length} entries → ${promptsDest}`);
