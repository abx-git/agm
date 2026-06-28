#!/usr/bin/env node
/**
 * Split docs/assistant/workflows.json into:
 *   agm/data/workflows-catalog.json           (public — no prompt field)
 *   agm/data/workflows-starter-prompts.json   (public — golden path prompts)
 *   agm/prompts-pack/workflows-prompts.json (private — full id → prompt)
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(root, 'docs/assistant/workflows.json');
const catalogDest = join(root, 'agm/data/workflows-catalog.json');
const starterDest = join(root, 'agm/data/workflows-starter-prompts.json');
const promptsDest = join(root, 'agm/prompts-pack/workflows-prompts.json');

/** Golden path — shipped publicly for MCP without private pack. */
const STARTER_WORKFLOW_IDS = new Set([
  'bootstrap-adopt',
  'bootstrap-continue',
  'refinement',
  'maintenance-diff-range',
  'review-maintenance',
  'review-phase',
  'architecture-work-query',
  'architecture-work-design',
]);

const workflows = JSON.parse(readFileSync(source, 'utf8'));
const catalog = [];
const prompts = {};
const starterPrompts = {};

for (const w of workflows) {
  const { prompt, ...meta } = w;
  catalog.push(meta);
  if (prompt) {
    prompts[w.id] = prompt;
    if (STARTER_WORKFLOW_IDS.has(w.id)) {
      starterPrompts[w.id] = prompt;
    }
  }
}

mkdirSync(dirname(catalogDest), { recursive: true });
mkdirSync(dirname(promptsDest), { recursive: true });

writeFileSync(catalogDest, JSON.stringify(catalog, null, 2) + '\n');
writeFileSync(starterDest, JSON.stringify(starterPrompts, null, 2) + '\n');
writeFileSync(promptsDest, JSON.stringify(prompts, null, 2) + '\n');

console.log(`Catalog: ${catalog.length} workflows → ${catalogDest}`);
console.log(
  `Starter: ${Object.keys(starterPrompts).length} workflows → ${starterDest}`
);
console.log(`Prompts: ${Object.keys(prompts).length} entries → ${promptsDest}`);
