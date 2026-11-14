#!/usr/bin/env node
import { Command } from 'commander';
import { appendFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadConfig, configFilePath, repoRoot } from './config/load.js';
import { initTekto } from './graph/scaffold.js';
import { exportToolkit } from './tekto/export.js';
import { runTektoCheck } from './tekto/check.js';
import { readSteerNow } from './tekto/steer.js';
import { buildPacket } from './tekto/packet.js';
import { docRootAbs } from './config/load.js';
import { formatLinkCheck, verifyLinks } from './graph/verify.js';
import type { TektoCheckName } from './tekto/check-options.js';
import { loadContext } from './graph/context.js';

const program = new Command();
program.name('tekto').description('Tekto — AI-supported architecture work').version('1.0.0');

program
  .command('init')
  .description('Initialize docs/tekto and tool bundle')
  .option('--project <name>', 'Application name', 'Application')
  .option('--doc-root <path>', 'Documentation root', 'docs/tekto/')
  .option('--ai-tool <name>', 'cursor | claude | copilot | kiro | generic', 'cursor')
  .option('-f, --force', 'Overwrite existing files')
  .action((opts) => {
    const result = initTekto({
      project: opts.project,
      docRoot: opts.docRoot,
      aiTool: opts.aiTool,
      force: Boolean(opts.force),
    });
    console.log(`Tekto initialized → ${result.docRoot}`);
    console.log(`Created ${result.created.length} file(s), skipped ${result.skipped.length}`);
    console.log('Next: open steer.md in your AI tool; run `tekto next` for ## Now rows.');
  });

program
  .command('export')
  .description('Write platform bundle (skills, rules) into repo')
  .option('--ai-tool <name>', 'cursor | claude | copilot | kiro | generic')
  .option('-f, --force', 'Overwrite')
  .action((opts) => {
    const config = loadConfig();
    const created: string[] = [];
    const skipped: string[] = [];
    const tool = (opts.aiTool as typeof config.aiTool) ?? config.aiTool;
    exportToolkit({
      aiTool: tool,
      cwd: process.cwd(),
      docRoot: config.docRoot,
      force: Boolean(opts.force),
      created,
      skipped,
    });
    console.log(`Export done: ${created.length} written, ${skipped.length} skipped`);
  });

program
  .command('check')
  .description('Core, graph sync, WRK trace, links, evidence, review threads')
  .option('--check <name>', 'core | graph | trace | contract (repeatable)', collectChecks, [])
  .option('--with-validator', 'Run tekto-validator contract check when installed')
  .action((opts: { check: TektoCheckName[]; withValidator?: boolean }) => {
    const config = loadConfig();
    const result = runTektoCheck(config, process.cwd(), {
      checks: opts.check.length ? opts.check : undefined,
      withValidator: Boolean(opts.withValidator),
    });
    for (const w of result.warnings) console.log(`warn: ${w}`);
    for (const e of result.errors) console.error(`error: ${e}`);
    if (result.checks) {
      const parts = Object.entries(result.checks)
        .map(([k, v]) => `${k}=${v}`)
        .join(' ');
      console.log(`[[ANCHOR:TEKTO_CHECK]] ${result.status} (${parts})`);
    }
    console.log(formatLinkCheck(verifyLinks(config)));
    process.exit(result.status === 'pass' ? 0 : 1);
  });

function collectChecks(value: string, prev: TektoCheckName[]): TektoCheckName[] {
  return [...prev, value as TektoCheckName];
}

program
  .command('next')
  .description('Print ## Now rows from steer.md')
  .action(() => {
    const config = loadConfig();
    const steerPath = join(docRootAbs(config), 'steer.md');
    const rows = readSteerNow(steerPath);
    if (!rows.length) {
      console.log('No ## Now rows (or missing steer.md).');
      return;
    }
    for (const r of rows) {
      console.log(`${r.owner}\t${r.task}\t${r.link}`);
    }
  });

program
  .command('packet')
  .description('Build copy-paste context packet')
  .argument('<kind>', 'aspect | revise | summarize')
  .argument('<target>', 'aspect id or review id')
  .action((kind, target) => {
    const config = loadConfig();
  const text = buildPacket(config, kind as 'aspect' | 'revise' | 'summarize', target);
    console.log(text);
  });

program
  .command('log')
  .description('Append a one-line log entry')
  .requiredOption('--type <type>', 'change type')
  .requiredOption('--path <path>', 'relative path')
  .requiredOption('--note <note>', 'short note')
  .action((opts) => {
    const config = loadConfig();
    const logPath = join(docRootAbs(config), 'log.md');
    const date = new Date().toISOString().slice(0, 10);
    const line = `${date} | ${opts.type} | ${opts.path} | ${opts.note}\n`;
    appendFileSync(logPath, line);
    console.log(`Appended to log.md`);
  });

program
  .command('context')
  .description('Print steer + log tail (debug)')
  .action(() => {
    const config = loadConfig();
    const ctx = loadContext(config);
    console.log(JSON.stringify(ctx, null, 2));
  });

program.parse();