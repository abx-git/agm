# Publishing `@abx-hh/agm-cli` (public MCP + CLI)

The **method** (docs, graph structure, catalog metadata) can stay in a private monorepo.  
Ship to users via **public npm** and/or a **public GitHub mirror** `abx-git/agm`.

## What is public vs private

| Artifact | Visibility | Contents |
|----------|------------|----------|
| `@abx-hh/agm-cli` on npm | **Public** | MCP, CLI, catalog, compressed prompts, **`scaffold/` install bundle** |
| `blueprint-pattern` monorepo | **Private** | Plaintext prompts, full procedure docs, `workflows-starter-prompts.json`, split scripts |
| Full prompt pack | **Licensed / private channel** | `workflows-prompts-compressed.json` or plaintext JSON |

Plaintext session prompts are **never** published. Agents receive [LLMLingua-2](https://huggingface.co/spaces/microsoft/llmlingua-2) compressed instructions that models parse directly.

## Maintainer pipeline

From the private monorepo root:

```bash
# 1. Regenerate catalog + plaintext starter (private git only)
node scripts/agm-split-prompts.mjs

# 2. Refresh scaffold bundle + compress golden path
cd agm && npm run build-scaffold && npm run compress-prompts

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

Published under npm org **`@abx-hh`** (`abx-hh` on npmjs.com).

### CI (GitHub Actions)

`.github/workflows/publish-agm-npm.yml` — manual `workflow_dispatch` with `dry_run: false`.

**`NPM_TOKEN` must bypass 2FA** — otherwise CI fails with `EOTP`:

1. [npmjs.com](https://www.npmjs.com/) → **Access Tokens** → **Generate New Token** → **Granular Access Token**
2. **Packages and scopes:** `@abx-hh` — **Read and write**
3. Enable **Bypass two-factor authentication (2FA)** (required for automation)
4. Copy token → GitHub repo **Settings → Secrets → Actions** → `NPM_TOKEN`
5. **Actions → Publish @abx-hh/agm-cli to npm** → `dry_run: false` → Run workflow

Do not use a token that only works with `npm login` + `--otp`; OTP cannot be supplied in CI.

## Public GitHub mirror (`abx-git/agm`)

Users install MCP via `npx @abx-hh/agm-cli agm-mcp`. A slim public repo is optional documentation + issues.

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
      "args": ["-y", "@abx-hh/agm-cli", "agm-mcp"]
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
