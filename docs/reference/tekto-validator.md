# Tekto-Validator — integration guide

Public integration surface for the **Tekto-Validator** commercial enforcement engine.
The method (Markdown graph, templates, workflows) stays open; the validator ships as a
compiled binary with a proprietary license — see [tekto-validator/LICENSE](https://github.com/abx-git/tekto/blob/main/tekto-validator/LICENSE).

## What it does

Deterministic, rule-based checks on `git diff` — no LLM, sub-second target for hooks:

| Check | CLI flag | Status |
|-------|----------|--------|
| Contract compliance (`exports.md` / `imports.md`) | `--check contract` | **available** |
| Traceability (active `WRK-*.md` recommendations) | `tekto check` (trace) | **available** (open CLI) |
| Graph sync (`index.md`, `log.md`, work registry) | `tekto check` (graph) | **available** (open CLI) |

## Install

Obtain the binary for your platform from your license channel, then:

```bash
chmod +x tekto-validator
sudo mv tekto-validator /usr/local/bin/   # or ~/.local/bin
tekto-validator version
```

Development build (maintainers with Go 1.22+):

```bash
cd tekto-validator
go build -ldflags "-X github.com/abx-git/tekto/tekto-validator/internal/cli.Version=0.1.0" \
  -o tekto-validator ./cmd/tekto-validator
```

Cross-compile example:

```bash
make -C tekto-validator release   # darwin/linux amd64 + arm64
```

## CLI — Git hook (pre-commit)

```bash
./scripts/install-tekto-validator-hook.sh /usr/local/bin/tekto-validator
```

Or manually in `.git/hooks/pre-commit`:

```bash
#!/bin/sh
exec tekto-validator validate --repo "$(git rev-parse --show-toplevel)" --staged
```

Exit `0` = pass · `1` = violations (blocks commit).

## CLI — CI

**Open gate (all repos):** `npx -y @abx-hh/tekto check` — see [quickstart.md](../quickstart.md).

**Optional contract-on-diff (licensed binary):**

```yaml
- name: Tekto architecture validation
  run: |
    tekto-validator validate --repo . --arch docs/tekto --base origin/main --json > tekto-report.json
    tekto-validator validate --repo . --arch docs/tekto --base origin/main
```

`--json` emits a machine-readable report for dashboards and PR comments.

## MCP — Cursor / IDE

One binary, two modes. Register stdio MCP:

```json
{
  "mcpServers": {
    "tekto-validator": {
      "command": "/usr/local/bin/tekto-validator",
      "args": ["mcp"]
    }
  }
}
```

Open your **application repository** (where `docs/architecture/` lives).

### MCP tools

| Tool | Purpose |
|------|---------|
| `tekto_validate_diff` | Run checks against current git diff |
| `tekto_validator_status` | Version and check availability |

Example agent flow:

1. `tekto_validator_status`
2. `tekto_validate_diff` with `{ "staged": true }` before commit
3. `tekto_validate_diff` with `{ "checks": ["contract", "graph"] }` when graph check ships

## Product split

| Component | License | Distribution |
|-----------|---------|--------------|
| Tekto method (`docs/`, templates, `@abx-hh/tekto-cli`) | MIT | Public repo, npm |
| Tekto-Validator engine | Proprietary | Compiled binary |
| `@abx-hh/tekto-cli` MCP (workflows, context) | MIT | `tekto-mcp` — orchestration |
| `tekto-validator mcp` | Proprietary | Enforcement tools |

Recommended stack: **open `@abx-hh/tekto-cli`** for documentation workflows + **commercial `tekto-validator`** for hard gates.

## Related

- [ci-integrity.md](./ci-integrity.md) — Markdown link checker (complementary)
- [spec-driven-development.md](./spec-driven-development.md) — Tekto vs feature-centric SDD
- [tekto/README.md](../../tekto/README.md) — open CLI & MCP for graph operations
