import {
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readlinkSync,
  readdirSync,
  renameSync,
  rmSync,
  writeFileSync,
  symlinkSync,
} from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { normDocRoot } from '../config/load.js';

export interface LinkExternalWorkOptions {
  cwd?: string;
  docRoot: string;
  workDir: string;
  force?: boolean;
}

export interface LinkExternalWorkResult {
  linkPath: string;
  workDirAbs: string;
  gitignoreUpdated: boolean;
  locationFile: string;
}

function ensureGitignore(cwd: string, pattern: string): boolean {
  const gi = join(cwd, '.gitignore');
  let content = existsSync(gi) ? readFileSync(gi, 'utf8') : '';
  const lines = content.split(/\r?\n/);
  if (lines.some((l) => l.trim() === pattern)) return false;
  if (content && !content.endsWith('\n')) content += '\n';
  content += `\n# AGM — local work directory (symlink target outside repo)\n${pattern}\n`;
  writeFileSync(gi, content, 'utf8');
  return true;
}

function writeWorkLocation(docRootAbs: string, workAbs: string): string {
  const dest = join(docRootAbs, 'work-location.md');
  const stamp = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
  writeFileSync(
    dest,
    `---
type: architecture-meta
title: "External work directory"
description: "Local work/ lives outside Git via symlink"
timestamp: "${stamp}"
---

# External work directory

Architecture / Domain work reports are written under [\`work/\`](./work/) as usual.
On this machine, \`work/\` is a **symlink** to a directory **outside** the Git repository:

\`\`\`
${workAbs}
\`\`\`

Each developer creates their own link (see AGM [external-work](https://github.com/abx-git/agm/blob/main/docs/reference/external-work.md)).

**Do not commit** draft work files. Promote shared conclusions into template sections or copy selected files into a real in-repo \`work/\` before merge.
`,
    'utf8'
  );
  return dest;
}

function moveDirContents(from: string, to: string): void {
  mkdirSync(to, { recursive: true });
  for (const name of readdirSync(from)) {
    const src = join(from, name);
    const dest = join(to, name);
    if (existsSync(dest)) {
      rmSync(src, { recursive: true, force: true });
      continue;
    }
    renameSync(src, dest);
  }
}

function recordMeta(cwd: string, docRoot: string, workAbs: string): void {
  const metaPath = join(cwd, '.agm-install-meta');
  let lines: string[] = [];
  if (existsSync(metaPath)) {
    lines = readFileSync(metaPath, 'utf8')
      .split('\n')
      .filter((l) => l && !l.startsWith('work_dir='));
  } else {
    lines = [`doc_root=${normDocRoot(docRoot)}`, 'source=agm-work-link'];
  }
  lines.push(`work_dir=${workAbs}`);
  writeFileSync(metaPath, lines.join('\n') + '\n', 'utf8');

  const agmDir = join(cwd, '.agm');
  mkdirSync(agmDir, { recursive: true });
  writeFileSync(join(agmDir, 'work-dir'), `${workAbs}\n`, 'utf8');

  const cfgPath = join(agmDir, 'config.json');
  if (existsSync(cfgPath)) {
    try {
      const raw = JSON.parse(readFileSync(cfgPath, 'utf8')) as Record<string, unknown>;
      raw.workDir = workAbs;
      raw.docRoot = raw.docRoot || normDocRoot(docRoot);
      writeFileSync(cfgPath, JSON.stringify(raw, null, 2) + '\n', 'utf8');
    } catch {
      /* leave broken config alone; work-dir file is enough */
    }
  }
}

/**
 * Make `${docRoot}/work` a symlink to an absolute directory outside the repo.
 * Moves an existing real work/ directory into the target first.
 */
export function linkExternalWorkDir(options: LinkExternalWorkOptions): LinkExternalWorkResult {
  const cwd = options.cwd ?? process.cwd();
  const docRoot = normDocRoot(options.docRoot);
  const docRootAbs = resolve(cwd, docRoot.replace(/\/$/, ''));
  const linkPath = join(docRootAbs, 'work');
  const workDirAbs = (
    isAbsolute(options.workDir) ? options.workDir : resolve(cwd, options.workDir)
  ).replace(/\/$/, '');
  const force = Boolean(options.force);

  mkdirSync(workDirAbs, { recursive: true });
  mkdirSync(docRootAbs, { recursive: true });

  if (existsSync(linkPath)) {
    const st = lstatSync(linkPath);
    if (st.isSymbolicLink()) {
      const current = readlinkSync(linkPath);
      const currentAbs = isAbsolute(current) ? current : resolve(dirname(linkPath), current);
      if (currentAbs === workDirAbs) {
        /* already correct */
      } else if (force) {
        rmSync(linkPath);
        symlinkSync(workDirAbs, linkPath);
      } else {
        throw new Error(
          `Existing symlink ${relative(cwd, linkPath)} → ${current}. Re-run with force to use ${workDirAbs}`
        );
      }
    } else if (st.isDirectory()) {
      moveDirContents(linkPath, workDirAbs);
      rmSync(linkPath, { recursive: true, force: true });
      symlinkSync(workDirAbs, linkPath);
    } else {
      throw new Error(`Refusing to replace non-directory ${relative(cwd, linkPath)}`);
    }
  } else {
    symlinkSync(workDirAbs, linkPath);
  }

  const pattern = `${docRoot}work`;
  const gi1 = ensureGitignore(cwd, pattern.replace(/\/$/, ''));
  const gi2 = ensureGitignore(cwd, `${docRoot}work/`);
  const gi3 = ensureGitignore(cwd, '.agm/work-dir');
  const locationFile = writeWorkLocation(docRootAbs, workDirAbs);
  recordMeta(cwd, docRoot, workDirAbs);

  return {
    linkPath: relative(cwd, linkPath),
    workDirAbs,
    gitignoreUpdated: gi1 || gi2 || gi3,
    locationFile: relative(cwd, locationFile),
  };
}
