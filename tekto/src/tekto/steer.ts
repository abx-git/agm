import { readFileSync, existsSync } from 'node:fs';
import type { SteerNowRow } from '../types.js';

export function parseSteerNow(steerContent: string): SteerNowRow[] {
  const lines = steerContent.split('\n');
  const nowIdx = lines.findIndex((l) => /^##\s+Now\s*$/i.test(l.trim()));
  if (nowIdx < 0) return [];

  const rows: SteerNowRow[] = [];
  for (let i = nowIdx + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('## ')) break;
    if (!line.startsWith('|') || line.includes('---') || line.toLowerCase().includes('owner')) continue;
    const cells = line
      .split('|')
      .map((c) => c.trim())
      .filter(Boolean);
    if (cells.length >= 3) {
      rows.push({ owner: cells[0], task: cells[1], link: cells[2] });
    }
  }
  return rows.slice(0, 5);
}

export function readSteerNow(steerPath: string): SteerNowRow[] {
  if (!existsSync(steerPath)) return [];
  return parseSteerNow(readFileSync(steerPath, 'utf8'));
}