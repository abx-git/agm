import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import type { LinkCheckResult } from '../types.js';
import { docRootAbs } from '../config/load.js';
import type { AgmConfig } from '../types.js';

const LINK_RE = /\[([^\]]*)\]\(([^)]+)\)/g;
const ANCHOR_RE = /\[\[ANCHOR:([A-Z_]+)\]\]/g;

const SKIP_SCHEMES = /^(https?:|mailto:|tel:|data:|#)/i;

function collectMarkdownFiles(dir: string): string[] {
  const out: string[] = [];
  if (!existsSync(dir)) return out;

  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (entry === 'node_modules' || entry === '.git') continue;
      out.push(...collectMarkdownFiles(full));
    } else if (entry.endsWith('.md')) {
      out.push(full);
    }
  }
  return out;
}

function resolveLink(fromFile: string, href: string): string | null {
  const trimmed = href.trim();
  if (!trimmed || SKIP_SCHEMES.test(trimmed)) return null;
  if (trimmed.startsWith('<') && trimmed.endsWith('>')) {
    return resolveLink(fromFile, trimmed.slice(1, -1));
  }
  const [pathPart] = trimmed.split('#');
  if (!pathPart) return null;
  return resolve(dirname(fromFile), pathPart);
}

export function verifyLinks(config: AgmConfig, cwd = process.cwd()): LinkCheckResult {
  const docRoot = docRootAbs(config, cwd);
  const files = collectMarkdownFiles(docRoot);
  const brokenLinks: LinkCheckResult['brokenLinks'] = [];

  for (const file of files) {
    const content = readFileSync(file, 'utf8');
    let match: RegExpExecArray | null;
    LINK_RE.lastIndex = 0;
    while ((match = LINK_RE.exec(content)) !== null) {
      const href = match[2];
      const resolved = resolveLink(file, href);
      if (!resolved) continue;
      if (!existsSync(resolved)) {
        brokenLinks.push({
          file: file.replace(docRoot + '/', ''),
          link: href,
          resolved: resolved.replace(docRoot + '/', ''),
        });
      }
    }
  }

  return {
    status: brokenLinks.length === 0 ? 'pass' : 'fail',
    brokenLinks,
    filesChecked: files.length,
  };
}

export function findAnchorsInFile(filePath: string): string[] {
  const content = readFileSync(filePath, 'utf8');
  const anchors: string[] = [];
  let match: RegExpExecArray | null;
  ANCHOR_RE.lastIndex = 0;
  while ((match = ANCHOR_RE.exec(content)) !== null) {
    anchors.push(match[1]);
  }
  return anchors;
}

export function formatLinkCheck(result: LinkCheckResult): string {
  if (result.status === 'pass') {
    return `[[ANCHOR:LINK_CHECK]] pass (${result.filesChecked} files checked)`;
  }
  const paths = result.brokenLinks.map((b) => `${b.file} → ${b.link}`).join('; ');
  return `[[ANCHOR:LINK_CHECK]] fail — broken: ${paths}`;
}
