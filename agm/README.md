# AGM — Architecture Graph Method CLI & MCP Server

Installable **MCP server** and CLI for the Architecture Graph Method (AGM).

- **Users:** `npx @abx-hh/agm-cli agm-mcp` — golden-path workflows via **LLMLingua-2 compressed** prompts (procedure text not shipped in plaintext).
- **Maintainers:** [PUBLISHING.md](./PUBLISHING.md) — private monorepo → public npm / `abx-git/agm`.

**Onboarding without MCP:** [Assistant UI](https://abx-git.github.io/agm.github.io/) or copy-paste from installed `prompts/workflows/` — see [docs/quickstart.md](../docs/quickstart.md) in the pattern repo.

## Install MCP (Cursor, Claude Desktop, …)

```json
{
  "mcpServers": {
    "agm": {
      "command": "npx",
      "args": ["-y", "@abx-hh/agm-cli", "agm-mcp"]
    }
  }
}
```

Or merge [mcp-install.json](./mcp-install.json). In your **application repo**, run once:

```bash
npx @abx-hh/agm-cli scaffold --project "my-app" --template arc42
```

Then MCP `agm_trigger_workflow` or `bootstrap-adopt`.

### npm global (optional)

```bash
npm install -g @abx-hh/agm-cli
agm-mcp   # stdio MCP server
agm --help
```

## Public vs private

| Shipped in `@abx-hh/agm-cli` (npm) | Private (your monorepo / license) |
|-----------------------------|-----------------------------------|
| `workflows-catalog.json` — IDs, roles, steps | Plaintext `workflows-starter-prompts.json` |
| `workflows-prompts-compressed.json` — **LLMLingua-2** golden path | Full catalog prompts (compress or plaintext) |
| `scaffold/` — install bundle (system-prompt, roles, templates) | Full plaintext workflow catalog |
| Graph CLI: `init`, `scaffold`, `verify`, `status` | Maintainer `docs/`, compress scripts |

Compression uses [Microsoft LLMLingua-2](https://huggingface.co/spaces/microsoft/llmlingua-2). Compressed prompts are sent **directly to the LLM** — not human-readable procedure docs.

## Requirements

- Node.js 20+
- Application repo with AGM docs under `docs/architecture/` (or your doc root)

## CLI quick reference

```bash
agm scaffold         # install prompts + template stubs from npm (MCP-only)
agm install          # print bp-install.sh curl one-liner (legacy)
agm init             # three core files + .agm/config.json
agm verify           # link check → [[ANCHOR:LINK_CHECK]]
agm workflows list   # catalog metadata only
agm prompts status   # starter | full, compressed | plaintext
```

## MCP tools

| Tool | Prompt pack |
|------|-------------|
| `agm_scaffold` | — |
| `agm_get_graph_status` | — |
| `agm_load_context` | — |
| `agm_verify_links` | — |
| `agm_list_workflows` | catalog only |
| `agm_prompt_pack_status` | tier + format |
| `agm_register_work_item` | — |
| `agm_trigger_workflow` | **compressed** golden path (or private full pack) |

`agm_trigger_workflow` returns public metadata plus an `[[AGM_AGENT_INSTRUCTION:…]]` block for the model.

## Maintainer pipeline

```bash
node scripts/agm-split-prompts.mjs      # private monorepo root
cd agm && npm install && npm run compress-prompts && npm run build
npm publish --access public             # see PUBLISHING.md
```

## Layout

```
agm/
├── data/
│   ├── workflows-catalog.json
│   ├── workflows-prompts-compressed.json   # public npm
│   └── workflows-starter-prompts.json      # private monorepo only (not in npm)
├── prompts-pack/                           # gitignored — licensed full pack
├── mcp-install.json
├── PUBLISHING.md
└── src/
```

## Design

1. **Public engine, compressed prompts** — method graph + catalog public; session procedure obfuscated via LLMLingua-2
2. **MCP optional** — Assistant UI / copy-paste remain first-class
3. **Local graph ops** — verify, init, git diff on filesystem
4. **Full pack** — optional private `workflows-prompts-compressed.json` for extended workflows
