import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Package root (agm/) — works from dist/ at runtime. */
export function packageRoot(): string {
  return resolve(__dirname, '..');
}

export function dataPath(...segments: string[]): string {
  return join(packageRoot(), 'data', ...segments);
}

export function templatesPath(...segments: string[]): string {
  return join(packageRoot(), 'templates', ...segments);
}
