import { mkdirSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

export type AiTool = 'cursor' | 'claude' | 'copilot' | 'generic' | 'kiro';

function writeCursorRules(docRootRule: string, cwd: string, updated: string[]): void {
  mkdirSync(join(cwd, '.cursor', 'rules'), { recursive: true });
  const rule = join(cwd, '.cursor/rules/tekto.mdc');
  writeFileSync(
    rule,
    `---
description: Tekto — architecture documentation with evidence
alwaysApply: true
---

Start every architecture session from \`${docRootRule}/steer.md\`.
Maintain \`${docRootRule}/log.md\` (one line per change).
Use Tekto skills under \`.cursor/skills/tekto/\` or MCP \`tekto_get_packet\`.
Author chat and review chat stay separate.
`
  );
  updated.push(relative(cwd, rule));
}

export function writeAiToolRulesFromScaffold(
  aiTool: AiTool,
  project: string,
  docRootRule: string,
  cwd: string,
  updated: string[]
): void {
  switch (aiTool) {
    case 'cursor':
      writeCursorRules(docRootRule, cwd, updated);
      break;
    case 'claude': {
      const p = join(cwd, 'CLAUDE.md');
      writeFileSync(
        p,
        `# ${project} — Tekto\n\nRead \`${docRootRule}/steer.md\` first.\n\nSkills: \`.claude/skills/\`\n`
      );
      updated.push(relative(cwd, p));
      break;
    }
    case 'copilot': {
      mkdirSync(join(cwd, '.github'), { recursive: true });
      const p = join(cwd, '.github/copilot-instructions.md');
      writeFileSync(
        p,
        `# Tekto\n\nRead \`${docRootRule}/steer.md\`. Run \`tekto export --ai-tool copilot\` after skill updates.\n`
      );
      updated.push(relative(cwd, p));
      break;
    }
    case 'kiro': {
      const dir = join(cwd, '.kiro/steering');
      mkdirSync(dir, { recursive: true });
      const p = join(dir, 'tekto.md');
      writeFileSync(
        p,
        `# Tekto + Kiro\n\nArchitecture: \`${docRootRule}/steer.md\`. Feature specs: \`.kiro/specs/\`.\n`
      );
      updated.push(relative(cwd, p));
      break;
    }
    default:
      break;
  }
}