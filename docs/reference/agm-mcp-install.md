---
type: reference
title: "Install AGM MCP server"
description: "Install @abx-hh/agm-cli as MCP — LLMLingua-2 compressed golden path"
resource: "repo://"
tags: [agm, mcp, install]
timestamp: ""
---

# Install AGM MCP server

Public package **`@abx-hh/agm-cli`** — MCP server + CLI. Session prompts ship **LLMLingua-2 compressed** ([Microsoft LLMLingua-2](https://huggingface.co/spaces/microsoft/llmlingua-2)); full plaintext workflows live in the [blueprint-pattern](https://github.com/abx-git/blueprint-pattern) repo — npm publishes compressed golden path only.

## Cursor / Claude Desktop

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

## Prerequisites

1. **Application repository** with AGM docs (`agm init` or `bp-install.sh`)
2. Node.js 20+

## Verify

In the app repo:

```bash
npx @abx-hh/agm-cli prompts status
# Prompt pack: starter (compressed)
```

In the IDE, call MCP tool `agm_prompt_pack_status` → `"tier": "starter"`, `"format": "compressed"`.

## Extended workflows

Golden path only in the public npm package. Licensed users install a private pack:

```bash
mkdir -p ~/.agm/prompts-pack
cp workflows-prompts-compressed.json ~/.agm/prompts-pack/
```

See [agm/PUBLISHING.md](../../agm/PUBLISHING.md) (maintainers) and [agm/README.md](../../agm/README.md).

## Without MCP

[Assistant UI](https://abx-git.github.io/agm.github.io/) or copy-paste from `prompts/workflows/` — [quickstart.md](../quickstart.md).
