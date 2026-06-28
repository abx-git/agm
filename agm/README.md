# AGM — Architecture Graph Method CLI & MCP Server

Local CLI and MCP server for the [Architecture Graph Method](https://github.com/abx-git/blueprint-pattern).

**Default onboarding:** copy session prompts from the [Assistant UI](https://abx-git.github.io/blueprint-pattern.github.io/) or `prompts/workflows/` into a new chat — see [docs/quickstart.md](../docs/quickstart.md).

**Optional (IDE-native):** MCP `agm_trigger_workflow` loads the same prompt pack without copy-paste. Requires a private prompt pack (or future minimal public starter pack — see [docs/ROADMAP.md](../docs/ROADMAP.md)).

## Public vs private split

| Shipped publicly (`@agm/cli`) | Private (optional — full catalog) |
|-------------------------------|-----------------------------------|
| `data/workflows-catalog.json` — IDs, roles, steps, anchors | `prompts-pack/workflows-prompts.json` — all prompt bodies |
| `data/workflows-starter-prompts.json` — **golden path** prompts (8 workflows) | Overrides starter when installed |
| Graph CLI: `init`, `verify`, `status` | Distribute via private git, npm, or `~/.agm/prompts-pack/` |
| MCP without private pack: golden path via starter pack | Extended workflows (`domain-work-*`, dialog, analysis, …) |

The **method** (graph structure, phases, anchors, procedure steps) is public. **Full prompt engineering** for extended workflows stays in the optional private pack.

## Requirements

- Node.js 20+
- An application repository with AGM documentation under `docs/architecture/` (or your chosen doc root)
- **Starter pack** ships with `@agm/cli` — `agm_trigger_workflow` works for golden-path workflows out of the box
- **Optional:** full private prompt pack for extended workflows

## Install

### 1. Public CLI (development)

```bash
cd agm
npm install
npm run build
```

Use without global link (recommended on macOS):

```bash
alias agm='node /absolute/path/to/blueprint-pattern/agm/dist/cli.js'
```

### 2. Private prompt pack (maintainers)

From the pattern repository root:

```bash
node scripts/agm-split-prompts.mjs
```

This writes `agm/prompts-pack/workflows-prompts.json` (gitignored). For a global install:

```bash
mkdir -p ~/.agm/prompts-pack
cp agm/prompts-pack/workflows-prompts.json ~/.agm/prompts-pack/
```

Or set per project in `.agm/config.json`:

```json
{
  "promptsPath": "/path/to/private/prompts-pack"
}
```

Or environment variable:

```bash
export AGM_PROMPTS_PATH=~/.agm/prompts-pack
```

Verify:

```bash
node dist/cli.js prompts status
```

### 3. From npm (when published)

```bash
npm install -g @agm/cli
# Install workflows-prompts.json separately via your private channel
```

The public npm package **does not** include prompt bodies.

## CLI

### `agm install`

Print the golden-path `bp-install.sh` curl command (full scaffold — prompts, templates, workflows):

```bash
agm install --project "order-service" --template arc42
```

### `agm init`

Bootstrap **three core files only** (`always-on.md`, `blueprint.md`, `entry-point.md`). For first-time setup use **`agm install`** / `bp-install.sh` instead — see [docs/reference/install.md](../docs/reference/install.md).

- `context/always-on.md`
- `blueprint.md`
- `entry-point.md`

Also writes `.agm/config.json`.

```bash
agm init
agm init -y --app-name "order-service" --template arc42 --doc-root docs/architecture/ --stack "TypeScript/Node"
```

### `agm verify`

Link check over the Markdown graph → `[[ANCHOR:LINK_CHECK]]`.

```bash
agm verify
agm verify --json
```

### Other commands

```bash
agm status
agm workflows list       # catalog only — no prompts
agm prompts status       # private pack installed?
```

## MCP Server

### Register in Cursor

```json
{
  "mcpServers": {
    "agm": {
      "command": "node",
      "args": ["/absolute/path/to/blueprint-pattern/agm/dist/mcp-server.js"]
    }
  }
}
```

Open your **application repository** in Cursor (where `.agm/config.json` lives).

### MCP Tools

| Tool | Prompt pack required? |
|------|------------------------|
| `agm_get_graph_status` | No |
| `agm_load_context` | No |
| `agm_verify_links` | No |
| `agm_list_workflows` | No (catalog only) |
| `agm_prompt_pack_status` | No |
| `agm_register_work_item` | No |
| `agm_trigger_workflow` | **Starter** (golden path) or **full** private pack |

`agm_trigger_workflow` returns **two blocks**:

1. **Public metadata** (workflow ID, role, anchors, `instructionChars` — no prompt text)
2. **Agent instruction block** tagged `[[AGM_AGENT_INSTRUCTION:…]]` for the LLM only

### Example agent flow

1. `agm_prompt_pack_status` — expect `tier: "starter"` or `"full"`
2. `agm_load_context`
3. `agm_get_graph_status`
4. `agm_trigger_workflow` with `workflowId` + `parameters` (golden path IDs work with starter pack)
5. `agm_register_work_item`
6. `agm_verify_links`

## Project layout

```
agm/
├── data/
│   ├── workflows-catalog.json        # public metadata (no prompt field)
│   ├── workflows-starter-prompts.json # public golden-path prompts
│   └── anchors.json
├── prompts-pack/                # OPTIONAL full pack — gitignored JSON
│   ├── README.md
│   └── workflows-prompts.json   # generate via scripts/agm-split-prompts.mjs
├── src/
│   ├── cli.ts
│   ├── mcp-server.ts
│   ├── config/prompts-path.ts   # resolves private pack
│   ├── substitution/
│   ├── graph/
│   ├── workflows/
│   └── mcp/
└── dist/
```

## Sync workflow data (maintainers)

When `docs/assistant/workflows.json` changes:

```bash
node scripts/agm-split-prompts.mjs
cp docs/assistant/anchors.json agm/data/anchors.json
# Redistribute workflows-prompts.json via private channel only
```

## Design principles

1. **Public engine, optional full prompts** — starter pack covers golden path; extended workflows optional
2. **MCP optional** — copy-paste is the default; MCP triggers the same workflows for IDE-native agents
3. **Local-only graph ops** — `init`, `verify`, `git diff` on the filesystem
4. **Traceable** — `agm verify` enforces relative link integrity
