import { normDocRoot } from '../config/load.js';

/** Replace docs/architecture paths and <doc-root> tokens. Ported from docs/assistant/app.js */
export function substituteDocRoot(text: string, docRoot: string): string {
  const norm = normDocRoot(docRoot);
  const noSlash = norm.replace(/\/$/, '');
  return text
    .replace(/docs\/architecture\//g, norm)
    .replace(/docs\/architecture(?![/\w])/g, noSlash)
    .replace(/<doc-root>\//g, norm)
    .replace(/<doc-root>/g, noSlash);
}
