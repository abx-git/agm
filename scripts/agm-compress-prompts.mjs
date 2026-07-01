#!/usr/bin/env node
/**
 * Compress AGM workflow prompts with LLMLingua-2 for public distribution.
 * Compressed prompts are fed directly to LLMs (not decompressed at runtime).
 *
 * Input:  agm/data/workflows-starter-prompts.json (golden path)
 *         agm/prompts-pack/workflows-prompts.json (optional full pack)
 * Output: agm/data/workflows-prompts-compressed.json (public — npm)
 *         agm/prompts-pack/workflows-prompts-compressed.json (private channel)
 *
 * Requires: npm install in agm/ (includes @axiomantic/llmlingua-2 devDependency)
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const agmRoot = join(root, 'agm');
const starterSrc = join(root, 'agm/data/workflows-starter-prompts.json');
const fullSrc = join(root, 'agm/prompts-pack/workflows-prompts.json');
const publicDest = join(root, 'agm/data/workflows-prompts-compressed.json');
const privateDest = join(root, 'agm/prompts-pack/workflows-prompts-compressed.json');

const TARGET_RATIO = Number(process.env.AGM_COMPRESS_RATIO || '0.5');

async function loadLingua() {
  try {
    const entry = join(agmRoot, 'node_modules/@axiomantic/llmlingua-2/dist/index.js');
    const mod = await import(pathToFileURL(entry).href);
    const engine = mod.default ?? mod.LLMLingua2Wrapper;
    if (typeof engine?.compress === 'function') {
      return engine;
    }
    if (typeof mod.LLMLingua2Wrapper === 'function') {
      return new mod.LLMLingua2Wrapper();
    }
    throw new Error('LLMLingua2Wrapper not found in package export');
  } catch (err) {
    console.error(
      'Missing @axiomantic/llmlingua-2. Run: cd agm && npm install --legacy-peer-deps',
      err instanceof Error ? err.message : err
    );
    process.exit(1);
  }
}

async function compressMap(lingua, prompts, label) {
  const out = {};
  const stats = [];
  const ids = Object.keys(prompts);
  for (const id of ids) {
    const original = prompts[id];
    const { compressed } = await lingua.compress(original, { targetRatio: TARGET_RATIO });
    out[id] = compressed;
    stats.push({
      id,
      originalChars: original.length,
      compressedChars: compressed.length,
      ratio: (compressed.length / original.length).toFixed(3),
    });
    console.log(
      `  [${label}] ${id}: ${original.length} → ${compressed.length} chars (${stats.at(-1).ratio})`
    );
  }
  return { prompts: out, stats };
}

function writePack(dest, prompts, scope) {
  mkdirSync(dirname(dest), { recursive: true });
  const pack = {
    version: 1,
    codec: 'llmlingua-2',
    scope,
    targetRatio: TARGET_RATIO,
    note:
      'LLM-ready compressed session prompts. Do not decompress for agents — models parse compressed text per Microsoft LLMLingua-2.',
    generatedAt: new Date().toISOString(),
    prompts,
  };
  writeFileSync(dest, JSON.stringify(pack, null, 2) + '\n');
  return pack;
}

async function main() {
  if (!existsSync(starterSrc)) {
    console.error(`Missing ${starterSrc}. Run: node scripts/agm-split-prompts.mjs`);
    process.exit(1);
  }

  const starter = JSON.parse(readFileSync(starterSrc, 'utf8'));
  const lingua = await loadLingua();

  console.log(`Compressing golden-path prompts (targetRatio=${TARGET_RATIO})…`);
  const { prompts: publicPrompts } = await compressMap(lingua, starter, 'public');
  writePack(publicDest, publicPrompts, 'starter');
  console.log(`Public pack → ${publicDest} (${Object.keys(publicPrompts).length} workflows)`);

  if (existsSync(fullSrc)) {
    const full = JSON.parse(readFileSync(fullSrc, 'utf8'));
    console.log(`Compressing full private catalog…`);
    const { prompts: privatePrompts } = await compressMap(lingua, full, 'full');
    writePack(privateDest, privatePrompts, 'full');
    console.log(`Private pack → ${privateDest} (${Object.keys(privatePrompts).length} workflows)`);
  } else {
    console.log(`Skip full pack (no ${fullSrc})`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
