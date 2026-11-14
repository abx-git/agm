import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { loadConfig } from '../config/load.js';
import { loadContext } from '../graph/context.js';
import { readSteerNow } from '../tekto/steer.js';
import { buildPacket } from '../tekto/packet.js';
import { runTektoCheck } from '../tekto/check.js';
import { docRootAbs } from '../config/load.js';
import { join } from 'node:path';
import { initTekto } from '../graph/scaffold.js';
import { recordFinding } from '../tekto/record-finding.js';

export function registerTektoTools(server: McpServer): void {
  server.tool(
    'tekto_next',
    'Read steer.md ## Now rows (max 5).',
    {},
    async () => {
      const config = loadConfig();
      const rows = readSteerNow(join(docRootAbs(config), 'steer.md'));
      return { content: [{ type: 'text', text: JSON.stringify(rows, null, 2) }] };
    }
  );

  server.tool(
    'tekto_load_context',
    'Read steer.md and recent log lines.',
    {},
    async () => {
      const config = loadConfig();
      const ctx = loadContext(config);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              { docRoot: ctx.docRoot, steer: ctx.steer, logTail: ctx.logTail },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  server.tool(
    'tekto_get_packet',
    'Build aspect, revise, or summarize packet for a new agent chat.',
    {
      kind: z.enum(['aspect', 'revise', 'summarize']),
      target: z.string(),
    },
    async ({ kind, target }) => {
      const config = loadConfig();
      const text = buildPacket(config, kind, target);
      return { content: [{ type: 'text', text }] };
    }
  );

  server.tool(
    'tekto_check',
    'Run Tekto validation (core, graph, trace, links, evidence, reviews).',
    {
      withValidator: z.boolean().optional(),
    },
    async (opts) => {
      const config = loadConfig();
      const result = runTektoCheck(config, process.cwd(), {
        withValidator: Boolean(opts.withValidator),
      });
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    'tekto_record_finding',
    'Append a finding to reviews/<id>/findings.yaml',
    {
      reviewId: z.string(),
      id: z.string(),
      aspect: z.string(),
      severity: z.enum(['low', 'medium', 'high', 'critical']),
      claim: z.string(),
      evidence: z.array(z.string()).min(1),
      rule: z.string().optional(),
      confidence: z.enum(['low', 'medium', 'high']).optional(),
      status: z.enum(['open', 'addressed', 'wontfix']).optional(),
    },
    async (opts) => {
      const config = loadConfig();
      const path = recordFinding(config, opts.reviewId, {
        id: opts.id,
        aspect: opts.aspect,
        severity: opts.severity,
        claim: opts.claim,
        evidence: opts.evidence,
        rule: opts.rule,
        confidence: opts.confidence,
        status: opts.status,
      });
      return { content: [{ type: 'text', text: JSON.stringify({ path }, null, 2) }] };
    }
  );

  server.tool(
    'tekto_init',
    'Initialize Tekto scaffold in the current repo.',
    {
      project: z.string().optional(),
      docRoot: z.string().optional(),
      aiTool: z.enum(['cursor', 'claude', 'copilot', 'kiro', 'generic']).optional(),
      force: z.boolean().optional(),
    },
    async (opts) => {
      const result = initTekto({
        project: opts.project ?? 'Application',
        docRoot: opts.docRoot ?? 'docs/tekto/',
        aiTool: opts.aiTool ?? 'cursor',
        force: Boolean(opts.force),
      });
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }
  );
}