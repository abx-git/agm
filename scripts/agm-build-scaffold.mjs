#!/usr/bin/env node
/**
 * Materialize agm/scaffold/ from the monorepo for npm publish (MCP-only install).
 * Run from repo root: node scripts/agm-build-scaffold.mjs
 *
 * Layout:
 *   doc-root/           — golden-path scaffold (default install)
 *   optional/domain/    — Domain/DDD pack (--domain / --full)
 *   optional/architect/ — Architect role + domain work template sibling bits
 */
import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'agm', 'scaffold');

const SHARED = [
  'docs/templates/architecture/index.md',
  'docs/templates/architecture/log.md',
  'docs/templates/architecture/context/always-on.md',
  'docs/templates/architecture/context/on-demand.md',
  'docs/templates/architecture/prompts/role-bootstrap.md',
  'docs/templates/architecture/prompts/role-maintenance.md',
  'docs/templates/architecture/prompts/role-review.md',
  'docs/templates/architecture/work/_template.md',
  'docs/templates/architecture/work/_template-review.md',
  'docs/templates/architecture/interfaces/exports.md',
  'docs/templates/architecture/interfaces/imports.md',
];

const PROMPTS = [
  ['prompts/core/system-prompt.md', 'prompts/core/system-prompt.md'],
  ['docs/reference/adopt-procedure.md', 'prompts/reference/adopt-procedure.md'],
  ['docs/reference/blueprint-format.md', 'prompts/reference/blueprint-format.md'],
  ['docs/reference/doc-extensions.md', 'prompts/reference/doc-extensions.md'],
];

const OPTIONAL_ARCHITECT = [
  [
    'docs/templates/architecture/prompts/role-architecture-work.md',
    'optional/architect/doc-root/prompts/role-architecture-work.md',
  ],
];

const OPTIONAL_DOMAIN = [
  [
    'docs/templates/architecture/prompts/role-domain-work.md',
    'optional/domain/doc-root/prompts/role-domain-work.md',
  ],
  [
    'docs/templates/architecture/work/_template-domain.md',
    'optional/domain/doc-root/work/_template-domain.md',
  ],
  ['docs/reference/ddd-guardrails.md', 'optional/domain/prompts/reference/ddd-guardrails.md'],
  [
    'docs/reference/ddd-work-report-formats.md',
    'optional/domain/prompts/reference/ddd-work-report-formats.md',
  ],
  'docs/templates/architecture/domain/README.md',
  'docs/templates/architecture/domain/context-map.md',
  'docs/templates/architecture/domain/subdomains.md',
  'docs/templates/architecture/domain/events.md',
  'docs/templates/architecture/domain/contexts/_template/model.md',
  'docs/templates/architecture/domain/contexts/_template/language.md',
];

const OPS = [
  'docs/templates/architecture/ops/pitfalls.md',
  'docs/templates/architecture/ops/environments.md',
  'docs/templates/architecture/ops/troubleshooting.md',
  'docs/templates/architecture/ops/runbooks/_template.md',
];

const TEMPLATES = {
  arc42: [
    'docs/templates/architecture/arc42/introduction.md',
    'docs/templates/architecture/arc42/constraints.md',
    'docs/templates/architecture/arc42/context.md',
    'docs/templates/architecture/arc42/solution-strategy.md',
    'docs/templates/architecture/arc42/building-blocks.md',
    'docs/templates/architecture/arc42/runtime.md',
    'docs/templates/architecture/arc42/deployment.md',
    'docs/templates/architecture/arc42/concepts.md',
    'docs/templates/architecture/arc42/quality.md',
    'docs/templates/architecture/arc42/risks.md',
    'docs/templates/architecture/arc42/glossary.md',
    'docs/templates/architecture/arc42/decisions/README.md',
  ],
  'c4-light': [
    'docs/templates/architecture/c4-light/context.md',
    'docs/templates/architecture/c4-light/containers.md',
    'docs/templates/architecture/c4-light/components.md',
    'docs/templates/architecture/c4-light/decisions/README.md',
    'docs/templates/architecture/c4-light/decisions/001-template.md',
  ],
  'adr-first': [
    'docs/templates/architecture/adr-first/context.md',
    'docs/templates/architecture/adr-first/views.md',
    'docs/templates/architecture/adr-first/decisions/README.md',
    'docs/templates/architecture/adr-first/decisions/001-template.md',
  ],
  'lean-service': [
    'docs/templates/architecture/lean-service/overview.md',
    'docs/templates/architecture/lean-service/runtime.md',
    'docs/templates/architecture/lean-service/decisions/README.md',
    'docs/templates/architecture/lean-service/decisions/001-template.md',
  ],
};

function copyIntoScaffold(srcRel, destRel) {
  const src = join(ROOT, srcRel);
  const dest = join(OUT, destRel);
  mkdirSync(dirname(dest), { recursive: true });
  cpSync(src, dest);
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

for (const src of SHARED) {
  const base = src.replace('docs/templates/architecture/', '');
  copyIntoScaffold(src, join('doc-root', base));
}

for (const [src, dest] of PROMPTS) {
  copyIntoScaffold(src, dest);
}

for (const [src, dest] of OPTIONAL_ARCHITECT) {
  copyIntoScaffold(src, dest);
}

for (const entry of OPTIONAL_DOMAIN) {
  if (Array.isArray(entry)) {
    copyIntoScaffold(entry[0], entry[1]);
    continue;
  }
  const base = entry.replace('docs/templates/architecture/domain/', '');
  copyIntoScaffold(entry, join('optional/domain/doc-root/domain', base));
}

for (const src of OPS) {
  const base = src.replace('docs/templates/architecture/ops/', '');
  copyIntoScaffold(src, join('doc-root', 'ops', base));
}

for (const [template, files] of Object.entries(TEMPLATES)) {
  for (const src of files) {
    const prefix = `docs/templates/architecture/${template}/`;
    const base = src.startsWith(prefix) ? src.slice(prefix.length) : src;
    copyIntoScaffold(src, join('templates', template, base));
  }
}

mkdirSync(join(OUT, 'prompts', 'workflows'), { recursive: true });
writeFileSync(
  join(OUT, 'prompts', 'workflows', 'README.md'),
  `# Workflows (MCP)

Golden-path session prompts ship compressed in \`@abx-hh/agm-cli\` (6 workflows).
Extended Architect/Domain prompts need the private pack or Assistant Advanced + \`agm scaffold --full\`.

Use:

- MCP tool \`agm_trigger_workflow\` (starter: adopt / continue / refine / sync / review)
- [AGM Assistant UI](https://abx-git.github.io/agm.github.io/)
`
);

console.log(`Scaffold written to ${OUT}`);
