# Publishing `@agm/cli` (public MCP + CLI)

The **method** (docs, graph structure, catalog metadata) can stay in a private monorepo.  
Ship to users via **public npm** and/or a **public GitHub mirror** `abx-git/agm`.

## What is public vs private

| Artifact | Visibility | Contents |
|----------|------------|----------|
| `@agm/cli` on npm | **Public** | MCP server, CLI, `workflows-catalog.json`, **LLMLingua-2 compressed** golden-path prompts |
| `blueprint-pattern` monorepo | **Private** | Plaintext prompts, full procedure docs, `workflows-starter-prompts.json`, split scripts |
| Full prompt pack | **Licensed / private channel** | `workflows-prompts-compressed.json` or plaintext JSON |

Plaintext session prompts are **never** published. Agents receive [LLMLingua-2](https://huggingface.co/spaces/microsoft/llmlingua-2) compressed instructions that models parse directly.

## Maintainer pipeline

From the private monorepo root:

```bash
# 1. Regenerate catalog + plaintext starter (private git only)
node scripts/agm-split-prompts.mjs

# 2. Compress golden path (and full pack if workflows-prompts.json exists)
cd agm && npm install && npm run compress-prompts

# 3. Build TypeScript
npm run build

# 4. Smoke test
node dist/cli.js prompts status
```

Commit **`agm/data/workflows-prompts-compressed.json`** — this is the only prompt bodies file in the public package.

## npm publish

```bash
cd agm
npm login
npm publish --access public
```

Requires npm org `@agm` (create at npmjs.com) or publish as unscoped `agm-cli`.

### CI (optional)

`.github/workflows/publish-agm-npm.yml` — manual `workflow_dispatch` with `NPM_TOKEN` secret.

## Public GitHub mirror (`abx-git/agm`)

Users install MCP via `npx @agm/cli agm-mcp`. A slim public repo is optional documentation + issues.

```bash
./scripts/agm-mirror-public.sh   # rsync agm/ → sibling clone abx-git/agm
```

Or create `abx-git/agm` on GitHub and push only:

- `agm/` package contents (no `prompts-pack/`, no `workflows-starter-prompts.json`)
- `mcp-install.json`
- `PUBLISHING.md` (this file)

## User install (Cursor / Claude Desktop)

Copy from `agm/mcp-install.json`:

```json
{
  "mcpServers": {
    "agm": {
      "command": "npx",
      "args": ["-y", "@agm/cli", "agm-mcp"]
    }
  }
}
```

Open an **application repository** with `.agm/config.json` (from `agm init` or `bp-install.sh`).

## Full catalog for licensed users

Distribute **only** `workflows-prompts-compressed.json` (preferred) or plaintext `workflows-prompts.json` via private channel:

```bash
mkdir -p ~/.agm/prompts-pack
cp agm/prompts-pack/workflows-prompts-compressed.json ~/.agm/prompts-pack/
```

Or set `AGM_PROMPTS_PATH` / `.agm/config.json` → `promptsPath`.

## Security note

LLMLingua-2 compression is **obfuscation**, not encryption. It deters casual copying of procedure text from npm tarballs; determined reverse-engineering is still possible. Keep canonical plaintext prompts in the private repo only.
