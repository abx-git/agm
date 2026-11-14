import { existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

export function collectFiles(dir: string, ext: string): string[] {
  const out: string[] = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry === 'node_modules' || entry === '.git') continue;
      out.push(...collectFiles(full, ext));
    } else if (entry.endsWith(ext)) {
      out.push(full);
    }
  }
  return out;
}