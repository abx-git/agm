import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { loadConfig } from '../config/load.js';
import {
  findPromptsFile,
  isPromptPackInstalled,
  resolvePromptsDirectories,
} from '../config/prompts-path.js';
import { loadContext } from '../graph/context.js';
import { getGraphStatus } from '../graph/status.js';
import { formatLinkCheck, verifyLinks } from '../graph/verify.js';
import { registerReviewVerdict, registerWorkItem } from '../graph/work-item.js';
import { listWorkflowIds, loadWorkflowCatalog } from '../workflows/loader.js';
import { toPublicTriggerResult, triggerWorkflow } from '../workflows/trigger.js';

export function registerAgmTools(server: McpServer): void {
  server.tool(
    'agm_get_graph_status',
    'Read blueprint.md and return open phases, in-progress phases, active WRK items (draft), and guardrail findings.',
    {},
    async () => {
      const config = loadConfig();
      const status = getGraphStatus(config);
      return {
        content: [{ type: 'text', text: JSON.stringify(status, null, 2) }],
      };
    }
  );

  server.tool(
    'agm_load_context',
    'Read always-on.md and entry-point.md to provide repository layout and session context for the LLM.',
    {},
    async () => {
      const config = loadConfig();
      const ctx = loadContext(config);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                docRoot: ctx.docRoot,
                alwaysOnPath: ctx.alwaysOnPath,
                entryPointPath: ctx.entryPointPath,
                alwaysOn: ctx.alwaysOn,
                entryPoint: ctx.entryPoint,
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  server.tool(
    'agm_prompt_pack_status',
    'Check whether the private AGM prompt pack is installed (no prompt content returned).',
    {},
    async () => {
      const config = loadConfig();
      const installed = isPromptPackInstalled(config);
      const file = findPromptsFile(config);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                installed,
                promptsFile: file,
                searchedDirectories: resolvePromptsDirectories(config),
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  server.tool(
    'agm_trigger_workflow',
    'Trigger an AGM workflow by ID. Requires private prompt pack. Returns public metadata plus agent-only instruction in a separate block.',
    {
      workflowId: z
        .string()
        .describe('Workflow ID from workflows-catalog.json (e.g. architecture-work-analysis)'),
      goal: z.string().optional().describe('Explicit user goal appended to the workflow context'),
      parameters: z
        .record(z.union([z.string(), z.boolean()]))
        .optional()
        .describe('Workflow-specific parameters (slug, scope, question, diffFrom, etc.)'),
      diffFrom: z.string().optional().describe('Git ref for maintenance-diff-range (DIFF_FROM)'),
      diffTo: z.string().optional().describe('Git ref for maintenance-diff-range (DIFF_TO, default HEAD)'),
    },
    async ({ workflowId, goal, parameters, diffFrom, diffTo }) => {
      const config = loadConfig();
      const result = triggerWorkflow(config, {
        workflowId,
        goal,
        parameters,
        diffFrom: diffFrom || (parameters?.diffFrom as string | undefined),
        diffTo: diffTo || (parameters?.diffTo as string | undefined),
      });

      const publicMeta = toPublicTriggerResult(result);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(publicMeta, null, 2),
          },
          {
            type: 'text',
            text: `[[AGM_AGENT_INSTRUCTION:${result.workflowId}]]\n${result.agentInstruction}`,
          },
        ],
      };
    }
  );

  server.tool(
    'agm_register_work_item',
    'Append a WRK-NNN entry to blueprint.md work register, or log a review verdict in ## Reviews.',
    {
      mode: z.enum(['work_item', 'review']).describe('Register type: work_item or review verdict'),
      title: z.string().optional().describe('Work item title (work_item mode)'),
      track: z.enum(['architecture', 'domain']).optional().describe('WRK track'),
      type: z.string().optional().describe('Work item type (question, analysis, design, domain-*)'),
      file: z.string().optional().describe('Relative path to work/ file'),
      status: z.enum(['draft', 'reviewed', 'superseded']).optional(),
      phaseTarget: z.string().optional().describe('Review phase target (review mode)'),
      reviewed: z.string().optional().describe('Review date YYYY-MM-DD'),
      verdict: z.enum(['PASS', 'PASS WITH NOTES', 'FAIL']).optional(),
      report: z.string().optional().describe('Path to review report'),
      findings: z.number().optional().describe('Number of findings'),
    },
    async (args) => {
      const config = loadConfig();

      if (args.mode === 'review') {
        if (!args.phaseTarget || !args.reviewed || !args.verdict || !args.report) {
          throw new Error('review mode requires phaseTarget, reviewed, verdict, report');
        }
        const result = registerReviewVerdict(config, {
          phaseTarget: args.phaseTarget,
          reviewed: args.reviewed,
          verdict: args.verdict,
          report: args.report,
          findings: args.findings ?? 0,
        });
        return {
          content: [{ type: 'text', text: JSON.stringify({ mode: 'review', ...result }, null, 2) }],
        };
      }

      if (!args.title || !args.track || !args.type || !args.file) {
        throw new Error('work_item mode requires title, track, type, file');
      }

      const result = registerWorkItem(config, {
        title: args.title,
        track: args.track,
        type: args.type,
        file: args.file,
        status: args.status,
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ mode: 'work_item', ...result, anchor: '[[ANCHOR:WORK_ITEM]]' }, null, 2),
          },
        ],
      };
    }
  );

  server.tool(
    'agm_verify_links',
    'Run local link verification over the architecture Markdown graph. Returns LINK_CHECK result.',
    {},
    async () => {
      const config = loadConfig();
      const result = verifyLinks(config);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ ...result, anchor: formatLinkCheck(result) }, null, 2),
          },
        ],
      };
    }
  );

  server.tool(
    'agm_list_workflows',
    'List available AGM workflow IDs and public metadata (catalog only — no prompt text).',
    {
      group: z.string().optional().describe('Filter by workflow group (e.g. Architecture work)'),
    },
    async ({ group }) => {
      let workflows = loadWorkflowCatalog();
      if (group) {
        workflows = workflows.filter((w) => w.group.toLowerCase().includes(group.toLowerCase()));
      }
      const summary = workflows.map((w) => ({
        id: w.id,
        role: w.role,
        group: w.group,
        when: w.when,
        anchors: w.anchors,
        steps: w.steps,
        freshChat: w.freshChat,
      }));
      return {
        content: [{ type: 'text', text: JSON.stringify({ workflows: summary, ids: listWorkflowIds() }, null, 2) }],
      };
    }
  );
}
