#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync, cpSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const arch = join(root, 'docs/architecture');
const tekto = join(root, 'docs/tekto');

if (existsSync(arch) && !existsSync(tekto)) {
  renameSync(arch, tekto);
  console.log('Renamed docs/architecture → docs/tekto');
}

const entry = join(tekto, 'entry-point.md');
const blueprint = join(tekto, 'blueprint.md');
const steer = join(tekto, 'steer.md');

if (!existsSync(steer) && (existsSync(entry) || existsSync(blueprint))) {
  const parts = ['---\ntype: steer\ntitle: Steer\ntimestamp: ""\n---\n\n# steer\n\n## Map\n'];
  if (existsSync(entry)) parts.push(readFileSync(entry, 'utf8').replace(/^---[\s\S]*?---\n?/, ''));
  parts.push('\n## Now\n\n| Owner | Task | Link |\n|-------|------|------|\n| — | Review migrated checklist | ./index.md |\n');
  writeFileSync(steer, parts.join('\n'));
  console.log('Wrote steer.md — review and trim');
}

mkdirSync(join(root, '.tekto'), { recursive: true });
writeFileSync(
  join(root, '.tekto/config.json'),
  JSON.stringify({ appName: 'Application', docRoot: 'docs/tekto/', aiTool: 'cursor' }, null, 2) + '\n'
);
writeFileSync(join(root, '.tekto-install-meta'), `project=Application\ndoc_root=docs/tekto/\nai_tool=cursor\n`);
console.log('Wrote .tekto/config.json — run tekto export && tekto check');