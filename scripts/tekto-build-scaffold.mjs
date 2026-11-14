#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const packsSrc = join(root, 'packs');
const packsDest = join(root, 'tekto', 'packs');

if (existsSync(packsDest)) rmSync(packsDest, { recursive: true, force: true });
mkdirSync(packsDest, { recursive: true });
cpSync(packsSrc, packsDest, { recursive: true });
console.log('Copied packs → tekto/packs');