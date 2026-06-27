#!/usr/bin/env node
import { Command } from 'commander';
import { input, select, confirm } from '@inquirer/prompts';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { loadConfig, configFilePath, normDocRoot, docRootAbs } from './config/load.js';
import { join } from 'node:path';
import { initGraph } from './graph/init.js';
import { formatLinkCheck, verifyLinks } from './graph/verify.js';
import { getGraphStatus } from './graph/status.js';
import {
  findPromptsFile,
  isPromptPackInstalled,
  resolvePromptsDirectories,
} from './config/prompts-path.js';
import { listWorkflowIds, loadWorkflowCatalog } from './workflows/loader.js';
import type { AgmConfig, TemplateId } from './types.js';

const program = new Command();

program.name('agm').description('Architecture Graph Method — local CLI').version('0.1.0');

program
  .command('init')
  .description('Bootstrap always-on.md, blueprint.md, and entry-point.md')
  .option('-y, --yes', 'Skip prompts and use defaults')
  .option('-f, --force', 'Overwrite existing core files')
  .option('--app-name <name>', 'Application name')
  .option('--template <id>', 'Documentation template')
  .option('--doc-root <path>', 'Documentation root')
  .option('--stack <stack>', 'Technology stack')
  .action(async (opts) => {
    let config: AgmConfig;

    if (opts.yes && opts.appName) {
      config = {
        appName: opts.appName,
        template: (opts.template as TemplateId) || 'arc42',
        docRoot: normDocRoot(opts.docRoot || 'docs/architecture/'),
        stack: opts.stack || '',
      };
    } else {
      const appName =
        opts.appName ||
        (await input({
          message: 'Application name',
          default: 'My Application',
        }));

      const template =
        opts.template ||
        (await select({
          message: 'Documentation template',
          choices: [
            { name: 'arc42', value: 'arc42' },
            { name: 'c4-light', value: 'c4-light' },
            { name: 'adr-first', value: 'adr-first' },
            { name: 'lean-service', value: 'lean-service' },
            { name: 'custom', value: 'custom' },
          ],
          default: 'arc42',
        }));

      let customTemplate: string | undefined;
      if (template === 'custom') {
        customTemplate = await input({
          message: 'Custom template folder name',
          default: 'custom',
        });
      }

      const docRoot = normDocRoot(
        opts.docRoot ||
          (await input({
            message: 'Documentation root',
            default: 'docs/architecture/',
          }))
      );

      const stack =
        opts.stack ||
        (await input({
          message: 'Stack (optional)',
          default: '',
        }));

      const purpose = await input({
        message: 'Purpose / domain (optional)',
        default: '',
      });

      config = {
        appName,
        template: template as TemplateId,
        customTemplate,
        docRoot,
        stack,
        purpose: purpose || undefined,
      };
    }

    const cfgPath = configFilePath();
    mkdirSync(dirname(cfgPath), { recursive: true });
    writeFileSync(cfgPath, JSON.stringify(config, null, 2) + '\n', 'utf8');

    const blueprintExists = existsSync(join(docRootAbs(config), 'blueprint.md'));

    if (blueprintExists && !opts.force) {
      const proceed = await confirm({
        message: 'blueprint.md already exists. Skip core file creation?',
        default: true,
      });
      if (proceed) {
        console.log(`Config written to ${cfgPath}`);
        console.log('Existing graph files preserved. Use --force to overwrite.');
        return;
      }
    }

    const result = initGraph(config, process.cwd(), Boolean(opts.force));
    console.log(`Config: ${cfgPath}`);
    console.log(`Doc root: ${result.docRoot}`);
    if (result.created.length) {
      console.log('Created:');
      for (const f of result.created) console.log(`  ${f}`);
    }
    if (result.skipped.length) {
      console.log('Skipped (already exist):');
      for (const f of result.skipped) console.log(`  ${f}`);
    }
    console.log('\nNext: register the AGM MCP server in Cursor (see agm/README.md).');
  });

program
  .command('verify')
  .description('Validate relative Markdown links in the architecture graph')
  .option('--json', 'Output JSON')
  .action((opts) => {
    const config = loadConfig();
    const result = verifyLinks(config);

    if (opts.json) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log(formatLinkCheck(result));
      if (result.brokenLinks.length) {
        console.log('\nBroken links:');
        for (const b of result.brokenLinks) {
          console.log(`  ${b.file}: ${b.link} → ${b.resolved}`);
        }
      }
      console.log(`\nFiles checked: ${result.filesChecked}`);
    }

    process.exit(result.status === 'pass' ? 0 : 1);
  });

program
  .command('status')
  .description('Print graph status from blueprint.md')
  .option('--json', 'Output JSON')
  .action((opts) => {
    const config = loadConfig();
    const status = getGraphStatus(config);
    if (opts.json) {
      console.log(JSON.stringify(status, null, 2));
    } else {
      console.log(`Template: ${status.template}`);
      console.log(`Doc root: ${status.docRoot}`);
      console.log(`Open phases: ${status.openPhases.length}`);
      console.log(`In progress: ${status.inProgressPhases.length}`);
      console.log(`Active WRK (draft): ${status.activeWorkItems.length}`);
      console.log(`Guardrail findings: ${status.guardrailFindings.length}`);
    }
  });

const workflowsCmd = program.command('workflows').description('Workflow catalog');

workflowsCmd
  .command('list')
  .description('List workflow IDs (catalog only — no prompt text)')
  .action(() => {
    const workflows = loadWorkflowCatalog();
    for (const w of workflows) {
      console.log(`${w.id}\t${w.group}\t${w.when}`);
    }
  });

const promptsCmd = program.command('prompts').description('Private prompt pack');

promptsCmd
  .command('status')
  .description('Check whether workflows-prompts.json is installed')
  .action(() => {
    const config = loadConfig();
    const installed = isPromptPackInstalled(config);
    console.log(installed ? 'Prompt pack: installed' : 'Prompt pack: NOT installed');
    const file = findPromptsFile(config);
    if (file) console.log(`  File: ${file}`);
    console.log('  Searched:');
    for (const d of resolvePromptsDirectories(config)) {
      console.log(`    - ${d}`);
    }
    if (!installed) {
      process.exit(1);
    }
  });

workflowsCmd
  .command('ids')
  .description('Print workflow IDs only')
  .action(() => {
    for (const id of listWorkflowIds()) console.log(id);
  });

program.parse();
