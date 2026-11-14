#!/usr/bin/env node
import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dirname ?? '.', '..');
const sampleRoot = join(root, 'docs/examples/sample-app');

function mergeSteer(tektoDir, name) {
  const entry = join(tektoDir, 'entry-point.md');
  const blueprint = join(tektoDir, 'blueprint.md');
  const steer = join(tektoDir, 'steer.md');
  if (existsSync(steer)) return;
  const parts = [
    '---',
    'type: steer',
    `title: Steer — ${name}`,
    'timestamp: ""',
    '---',
    '',
    `# steer — ${name}`,
    '',
    '## Map',
    '',
  ];
  if (existsSync(entry)) {
    const body = readFileSync(entry, 'utf8').replace(/^---[\s\S]*?---\n?/, '');
    parts.push(body.trim(), '');
  }
  parts.push(
    '## Now',
    '',
    '| Owner | Task | Link |',
    '|-------|------|------|',
    '| — | Continue Tekto docs | [index.md](./index.md) |',
    ''
  );
  writeFileSync(steer, parts.join('\n'));
  if (existsSync(entry)) rmSync(entry);
  if (existsSync(blueprint)) rmSync(blueprint);
}

for (const svc of ['order-service', 'payment-service', 'notification-service']) {
  const arch = join(sampleRoot, svc, 'docs/architecture');
  const tekto = join(sampleRoot, svc, 'docs/tekto');
  if (!existsSync(arch)) continue;
  if (existsSync(tekto)) rmSync(tekto, { recursive: true, force: true });
  renameSync(arch, tekto);
  mergeSteer(tekto, svc);
  const prompts = join(tekto, 'prompts');
  if (existsSync(prompts)) rmSync(prompts, { recursive: true, force: true });
  const ctx = join(tekto, 'context');
  if (existsSync(ctx)) rmSync(ctx, { recursive: true, force: true });
  console.log(`Migrated ${svc} → docs/tekto/`);
}

const logPath = join(sampleRoot, 'order-service/docs/tekto/log.md');
if (!existsSync(logPath)) {
  writeFileSync(
    logPath,
    '---\ntype: log\ntitle: Change log\ntimestamp: ""\n---\n\n# log\n\n2026-11-14 | migrate | steer.md | sample-app AGM→Tekto\n'
  );
}

console.log('Done. Run tekto check in each service root if needed.');