---
type: reference
title: Install Tekto MCP server
description: Slim MCP surface for @abx-hh/tekto — no workflow catalog
timestamp: ""
---

# Install Tekto MCP server

Public package **`@abx-hh/tekto`** exposes CLI + MCP from one install. Prefer this **slim** server over legacy AGM workflow MCPs.

## Cursor / Claude Desktop

```json
{
  "mcpServers": {
    "tekto": {
      "command": "npx",
      "args": ["-y", "@abx-hh/tekto", "tekto-mcp"]
    }
  }
}
```

Run from the **application repository root** (where `.tekto/config.json` or `.tekto-install-meta` lives).

## Prerequisites

1. Node.js 20+
2. One-time init in the app repo:

```bash
npx @abx-hh/tekto init --project "my-app" --ai-tool cursor
```

## Recommended tools

| Tool | When to use |
|------|-------------|
| `tekto_load_context` | Start of session — steer + related docs |
| `tekto_next` | Read ## Now |
| `tekto_get_packet` | Build aspect / revise / summarize prompt |
| `tekto_check` | Validate before PR |
| `tekto_record_finding` | Append structured finding during review |
| `tekto_init` | Bootstrap another repo from the agent |

Avoid wiring old **workflow catalog** or **prompt pack status** tools — they are not part of Tekto 1.0.

## Verify

In the app repo:

```bash
npx @abx-hh/tekto check
```

In the IDE: invoke MCP `tekto_check` and confirm JSON `status: "pass"`.

## Optional: Tekto-Validator MCP

Commercial **contract-on-diff** uses a separate binary — [tekto-validator.md](./tekto-validator.md). Open-source projects usually stop at `tekto_check`.

## Without MCP

Use [quickstart.md](../quickstart.md) commands and [Tekto Studio](../studio/README.md) to copy packets.