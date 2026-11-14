import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { packageRoot } from '../paths.js';

export interface ExportOptions {
  aiTool: 'cursor' | 'claude' | 'copilot' | 'generic' | 'kiro';
  cwd: string;
  force?: boolean;
  docRoot?: string;
  created: string[];
  skipped: string[];
}

function packsRoot(cwd: string): string {
  const monorepo = join(cwd, 'packs');
  if (existsSync(monorepo)) return monorepo;
  const bundled = join(packageRoot(), 'packs');
  if (existsSync(bundled)) return bundled;
  return join(packageRoot(), '..', 'packs');
}

function agentsText(packs: string): string {
  const agents = join(packs, 'AGENTS.md');
  if (existsSync(agents)) return readFileSync(agents, 'utf8');
  return '# Tekto\n\nRead docs/tekto/steer.md\n';
}

function copySkills(
  packs: string,
  destDir: string,
  force: boolean,
  cwd: string,
  created: string[],
  skipped: string[]
): void {
  const skillsSrc = join(packs, 'skills');
  if (!existsSync(skillsSrc)) return;
  for (const name of readdirSync(skillsSrc)) {
    const src = join(skillsSrc, name, 'SKILL.md');
    if (!existsSync(src)) continue;
    const dest = join(destDir, name, 'SKILL.md');
    if (existsSync(dest) && !force) {
      skipped.push(relative(cwd, dest));
      continue;
    }
    mkdirSync(dirname(dest), { recursive: true });
    cpSync(src, dest);
    created.push(relative(cwd, dest));
  }
}

function skillListMarkdown(packs: string): string {
  const skillsSrc = join(packs, 'skills');
  if (!existsSync(skillsSrc)) return '';
  const names = readdirSync(skillsSrc).filter((n) =>
    existsSync(join(skillsSrc, n, 'SKILL.md'))
  );
  return names.map((n) => `- \`${n}\` — see exported SKILL.md`).join('\n');
}

export function exportToolkit(opts: ExportOptions): void {
  const packs = packsRoot(opts.cwd);
  const docRoot = (opts.docRoot || 'docs/tekto/').replace(/\/+$/, '');
  const force = Boolean(opts.force);

  switch (opts.aiTool) {
    case 'cursor': {
      const skillsDest = join(opts.cwd, '.cursor', 'skills', 'tekto');
      copySkills(packs, skillsDest, force, opts.cwd, opts.created, opts.skipped);
      break;
    }
    case 'claude': {
      const dest = join(opts.cwd, 'CLAUDE.md');
      if (!existsSync(dest) || force) {
        writeFileSync(dest, agentsText(packs));
        opts.created.push(relative(opts.cwd, dest));
      }
      copySkills(packs, join(opts.cwd, '.claude', 'skills'), force, opts.cwd, opts.created, opts.skipped);
      break;
    }
    case 'copilot': {
      mkdirSync(join(opts.cwd, '.github'), { recursive: true });
      const instructions = join(opts.cwd, '.github', 'copilot-instructions.md');
      if (!existsSync(instructions) || force) {
        const body = [
          '# Tekto (architecture documentation)',
          '',
          `Start from \`${docRoot}/steer.md\`. Maintain \`${docRoot}/log.md\`.`,
          '',
          'Evidence links must resolve (`tekto check`).',
          'Author chat and review chat stay separate.',
          '',
          '## Skills',
          skillListMarkdown(packs),
          '',
          agentsText(packs),
        ].join('\n');
        writeFileSync(instructions, body);
        opts.created.push(relative(opts.cwd, instructions));
      }
      copySkills(
        packs,
        join(opts.cwd, '.github', 'skills', 'tekto'),
        force,
        opts.cwd,
        opts.created,
        opts.skipped
      );
      break;
    }
    case 'kiro': {
      const steeringDir = join(opts.cwd, '.kiro', 'steering');
      mkdirSync(steeringDir, { recursive: true });
      const steering = join(steeringDir, 'tekto.md');
      if (!existsSync(steering) || force) {
        const body = [
          '# Tekto + Kiro',
          '',
          `System architecture context lives in \`${docRoot}/\` (steer.md, chapters, reviews).`,
          'Feature specs stay under `.kiro/specs/` — link them from steer ## Now when relevant.',
          '',
          '## Review',
          '- Findings: `reviews/<id>/findings.yaml`',
          '- Use Tekto skills for aspect reviews; do not duplicate feature specs in arc chapters.',
          '',
          skillListMarkdown(packs),
        ].join('\n');
        writeFileSync(steering, body);
        opts.created.push(relative(opts.cwd, steering));
      }
      const agentsDest = join(opts.cwd, 'AGENTS.md');
      if (!existsSync(agentsDest) || force) {
        writeFileSync(agentsDest, agentsText(packs));
        opts.created.push(relative(opts.cwd, agentsDest));
      }
      copySkills(packs, join(opts.cwd, '.kiro', 'skills', 'tekto'), force, opts.cwd, opts.created, opts.skipped);
      break;
    }
    default: {
      const dest = join(opts.cwd, 'AGENTS.md');
      if (!existsSync(dest) || force) {
        writeFileSync(dest, agentsText(packs));
        opts.created.push(relative(opts.cwd, dest));
      }
    }
  }
}