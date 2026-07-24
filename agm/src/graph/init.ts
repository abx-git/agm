import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { AgmConfig, TemplateId } from '../types.js';
import { docRootAbs, normDocRoot, resolvedTemplate } from '../config/load.js';
import { templatesPath } from '../paths.js';

interface TemplatePhase {
  phase: string;
  section: string;
  target: string;
}

const ARC42_PHASES: TemplatePhase[] = [
  { phase: '0', section: 'Bootstrap', target: 'blueprint.md' },
  { phase: '1', section: 'Introduction and Goals', target: 'arc42/introduction.md' },
  { phase: '2', section: 'Constraints', target: 'arc42/constraints.md' },
  { phase: '3', section: 'Context and Scope', target: 'arc42/context.md + interfaces/' },
  { phase: '4', section: 'Solution Strategy', target: 'arc42/solution-strategy.md' },
  { phase: '5', section: 'Building Block View', target: 'arc42/building-blocks.md' },
  { phase: '6', section: 'Runtime View', target: 'arc42/runtime.md' },
  { phase: '7', section: 'Deployment View', target: 'arc42/deployment.md' },
  { phase: '8', section: 'Cross-cutting Concepts', target: 'arc42/concepts.md' },
  { phase: '9', section: 'Architecture Decisions', target: 'arc42/decisions/' },
  { phase: '10', section: 'Quality Requirements', target: 'arc42/quality.md' },
  { phase: '11', section: 'Risks and Technical Debt', target: 'arc42/risks.md' },
  { phase: '12', section: 'Glossary', target: 'arc42/glossary.md' },
  { phase: '13', section: 'Operational Knowledge', target: 'ops/' },
  { phase: '14', section: 'Domain — Context map', target: 'domain/context-map.md' },
  { phase: '15', section: 'Domain — Subdomains', target: 'domain/subdomains.md' },
  { phase: '16', section: 'Domain — Event catalog', target: 'domain/events.md' },
  { phase: '17', section: 'Domain — Context models', target: 'domain/contexts/' },
];

const C4_LIGHT_PHASES: TemplatePhase[] = [
  { phase: '0', section: 'Bootstrap', target: 'blueprint.md' },
  { phase: '1', section: 'Context', target: 'c4-light/context.md' },
  { phase: '2', section: 'Containers', target: 'c4-light/containers.md' },
  { phase: '3', section: 'Components', target: 'c4-light/components.md' },
  { phase: '4', section: 'Decisions', target: 'c4-light/decisions/' },
  { phase: '5', section: 'Interfaces', target: 'interfaces/' },
  { phase: '6', section: 'Operations', target: 'ops/' },
  { phase: '7', section: 'Domain', target: 'domain/' },
];

const ADR_FIRST_PHASES: TemplatePhase[] = [
  { phase: '0', section: 'Bootstrap', target: 'blueprint.md' },
  { phase: '1', section: 'Context', target: 'adr-first/context.md' },
  { phase: '2', section: 'Views', target: 'adr-first/views.md' },
  { phase: '3', section: 'Decisions', target: 'adr-first/decisions/' },
  { phase: '4', section: 'Interfaces', target: 'interfaces/' },
  { phase: '5', section: 'Domain', target: 'domain/' },
];

const LEAN_SERVICE_PHASES: TemplatePhase[] = [
  { phase: '0', section: 'Bootstrap', target: 'blueprint.md' },
  { phase: '1', section: 'Overview', target: 'lean-service/overview.md' },
  { phase: '2', section: 'Runtime', target: 'lean-service/runtime.md' },
  { phase: '3', section: 'Decisions', target: 'lean-service/decisions/' },
  { phase: '4', section: 'Interfaces', target: 'interfaces/' },
  { phase: '5', section: 'Domain', target: 'domain/' },
];

function phasesForTemplate(template: TemplateId): TemplatePhase[] {
  switch (template) {
    case 'c4-light':
      return C4_LIGHT_PHASES;
    case 'adr-first':
      return ADR_FIRST_PHASES;
    case 'lean-service':
      return LEAN_SERVICE_PHASES;
    case 'custom':
      return [
        { phase: '0', section: 'Bootstrap', target: 'blueprint.md' },
        { phase: '1', section: 'Custom sections', target: 'custom/' },
      ];
    default:
      return ARC42_PHASES;
  }
}

function buildStatusTable(template: TemplateId, customName?: string): string {
  const t = template === 'custom' ? customName || 'custom' : template;
  const phases = phasesForTemplate(template).map((p) => ({
    ...p,
    target: p.target.replace(/arc42\//g, `${t}/`).replace(/c4-light\//g, `${t}/`).replace(/adr-first\//g, `${t}/`).replace(/lean-service\//g, `${t}/`),
  }));

  const today = new Date().toISOString().slice(0, 10);
  const rows = phases.map((p, i) => {
    const state = i === 0 ? '[x] done' : '[ ] open';
    const updated = i === 0 ? today : '—';
    return `| ${p.phase.padEnd(5)} | ${p.section.padEnd(26)} | ${p.target.padEnd(34)} | ${state.padEnd(14)} | ${updated.padEnd(12)} |`;
  });

  return [
    '## Status',
    '',
    '| Phase | Section                    | Target file                        | State          | Last updated |',
    '|-------|----------------------------|------------------------------------|----------------|--------------|',
    ...rows,
    '',
    'States: `[ ]` open · `[~]` in progress · `[x]` done · `[!]` blocked',
    '',
  ].join('\n');
}

function buildAlwaysOn(config: AgmConfig): string {
  const templatePath = templatesPath('context/always-on.md');
  let content = '';
  if (existsSync(templatePath)) {
    content = readFileSync(templatePath, 'utf8');
  }

  if (!content) {
    content = `# Base context — always on

## System identity

**Application:** <App Name>
**Domain:** <one sentence>
**Stack:** <e.g. TypeScript / Node.js>
`;
  }

  const template = resolvedTemplate(config);
  const docRootDisplay = config.docRoot.replace(/\/$/, '');

  return content
    .replace(/<App Name>/g, config.appName)
    .replace(/<one sentence>/g, config.purpose || '<one sentence>')
    .replace(/<e.g. TypeScript \/ Node.js>/g, config.stack || '<stack>')
    .replace(/<!-- arc42 \| c4-light \| adr-first \| lean-service \| custom -->/, template)
    .replace(/docs\/architecture\//g, config.docRoot)
    .replace(/docs\/architecture/g, docRootDisplay)
    .replace(/<template>/g, template);
}

function buildBlueprint(config: AgmConfig): string {
  const template = resolvedTemplate(config);
  const today = new Date().toISOString().slice(0, 10);

  return [
    `# Blueprint — ${config.appName}`,
    '',
    '## Documentation template',
    '',
    `Selected template: ${template}`,
    `Rationale: Initial bootstrap via agm init on ${today}.`,
    '',
    buildStatusTable(config.template, config.customTemplate),
    '## Work register',
    '',
    '| ID | Track | Title | Type | File | Status | Date |',
    '|----|-------|-------|------|------|--------|------|',
    '| —  | —     | —     | —    | —    | —      | —    |',
    '',
    '**Track:** `architecture` · `domain`',
    '**Types (architecture):** `question` · `analysis` · `design`',
    '**Types (domain):** `domain-question` · `domain-discovery` · `domain-analysis` · `domain-design`',
    '**Status:** `draft` · `reviewed` · `superseded`',
    '',
    '## Reviews',
    '',
    '| Phase / target | Reviewed | Verdict | Report | Findings |',
    '|----------------|----------|---------|--------|----------|',
    '| —              | —        | —       | —      | —        |',
    '',
    'Verdict: `PASS` · `PASS WITH NOTES` · `FAIL`',
    '',
    '## Guardrail findings',
    '',
    '| File | Finding | Severity | Source |',
    '|------|---------|----------|--------|',
    '| —    | —       | —        | —      |',
    '',
    '## Session log',
    '',
    `### ${today} — Session 1`,
    '- Completed: agm init — core graph files created',
    `- Key decisions: template=${template}, docRoot=${config.docRoot}`,
    '- Next: Continue building via AGM Studio Run → Continue building (or MCP workflow bootstrap-continue)',
    `- Resume prompt: "Continue AGM (Build · Continue). Read ${config.docRoot}blueprint.md."`,
    '',
  ].join('\n');
}

function buildEntryPoint(config: AgmConfig): string {
  const template = resolvedTemplate(config);
  const docRoot = normDocRoot(config.docRoot);

  return [
    `# ${config.appName} — Architecture Entry Point`,
    '',
    '## Documentation template',
    '',
    `Selected template: ${template}`,
    `Rationale: Bootstrapped via agm init.`,
    '',
    '## Purpose',
    '',
    config.purpose || `<!-- One paragraph: what ${config.appName} does -->`,
    '',
    '## Navigation',
    '',
    '| Section | File |',
    '|---------|------|',
    '| Blueprint (progress) | [blueprint.md](./blueprint.md) |',
    '| Base context | [context/always-on.md](./context/always-on.md) |',
    `| Template (${template}) | [${template}/](./${template}/) |`,
    '| Interface exports | [interfaces/exports.md](./interfaces/exports.md) |',
    '| Interface imports | [interfaces/imports.md](./interfaces/imports.md) |',
    '| Architecture Work | [work/README.md](./work/README.md) |',
    '| Domain | [domain/context-map.md](./domain/context-map.md) |',
    '',
    '## Source code',
    '',
    '| Component | Source |',
    '|-----------|--------|',
    config.sourceRoot
      ? `| Primary | [${config.sourceRoot}](../../${config.sourceRoot}) |`
      : '| — | — |',
    '',
    `<!-- Agent-maintained graph index. Doc root: ${docRoot} -->`,
    '',
  ].join('\n');
}

export interface InitResult {
  created: string[];
  skipped: string[];
  docRoot: string;
}

export function initGraph(config: AgmConfig, cwd = process.cwd(), force = false): InitResult {
  const docRoot = docRootAbs(config, cwd);
  const created: string[] = [];
  const skipped: string[] = [];

  const files: Array<{ rel: string; content: string }> = [
    { rel: 'context/always-on.md', content: buildAlwaysOn(config) },
    { rel: 'blueprint.md', content: buildBlueprint(config) },
    { rel: 'entry-point.md', content: buildEntryPoint(config) },
  ];

  for (const { rel, content } of files) {
    const dest = join(docRoot, rel);
    mkdirSync(join(dest, '..'), { recursive: true });
    if (existsSync(dest) && !force) {
      skipped.push(rel);
      continue;
    }
    writeFileSync(dest, content, 'utf8');
    created.push(rel);
  }

  return { created, skipped, docRoot: config.docRoot };
}
