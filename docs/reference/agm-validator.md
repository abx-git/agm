# AGM-Validator — integration guide

Public integration surface for the **AGM-Validator** commercial enforcement engine.
The method (Markdown graph, templates, workflows) stays open; the validator ships as a
compiled binary with a proprietary license — see [agm-validator/LICENSE](https://github.com/abx-git/blueprint-pattern/blob/main/agm-validator/LICENSE).

## What it does

Deterministic, rule-based checks on `git diff` — no LLM, sub-second target for hooks:

| Check | CLI flag | Status |
|-------|----------|--------|
| Contract compliance (`exports.md` / `imports.md`) | `--check contract` | **available** |
| Traceability (active `WRK-*.md` recommendations) | `--check trace` | planned |
| Graph sync (`index.md`, `log.md`, links) | `--check graph` | planned |

## Install

Obtain the binary for your platform from your license channel, then:

```bash
chmod +x agm-validator
sudo mv agm-validator /usr/local/bin/   # or ~/.local/bin
agm-validator version
```

Development build (maintainers with Go 1.22+):

```bash
cd agm-validator
go build -ldflags "-X github.com/abx-git/blueprint-pattern/agm-validator/internal/cli.Version=0.1.0" \
  -o agm-validator ./cmd/agm-validator
```

Cross-compile example:

```bash
make -C agm-validator release   # darwin/linux amd64 + arm64
```

## CLI — Git hook (pre-commit)

```bash
./scripts/install-agm-validator-hook.sh /usr/local/bin/agm-validator
```

Or manually in `.git/hooks/pre-commit`:

```bash
#!/bin/sh
exec agm-validator validate --repo "$(git rev-parse --show-toplevel)" --staged
```

Exit `0` = pass · `1` = violations (blocks commit).

## CLI — CI

```yaml
- name: AGM architecture validation
  run: |
    agm-validator validate --repo . --base origin/main --json > agm-report.json
    agm-validator validate --repo . --base origin/main
```

`--json` emits a machine-readable report for dashboards and PR comments.

## MCP — Cursor / IDE

One binary, two modes. Register stdio MCP:

```json
{
  "mcpServers": {
    "agm-validator": {
      "command": "/usr/local/bin/agm-validator",
      "args": ["mcp"]
    }
  }
}
```

Open your **application repository** (where `docs/architecture/` lives).

### MCP tools

| Tool | Purpose |
|------|---------|
| `agm_validate_diff` | Run checks against current git diff |
| `agm_validator_status` | Version and check availability |

Example agent flow:

1. `agm_validator_status`
2. `agm_validate_diff` with `{ "staged": true }` before commit
3. `agm_validate_diff` with `{ "checks": ["contract", "graph"] }` when graph check ships

## Product split

| Component | License | Distribution |
|-----------|---------|--------------|
| AGM method (`docs/`, templates, `@abx-hh/agm-cli`) | MIT | Public repo, npm |
| AGM-Validator engine | Proprietary | Compiled binary |
| `@abx-hh/agm-cli` MCP (workflows, context) | MIT | `agm-mcp` — orchestration |
| `agm-validator mcp` | Proprietary | Enforcement tools |

Recommended stack: **open `@abx-hh/agm-cli`** for documentation workflows + **commercial `agm-validator`** for hard gates.

## Related

- [ci-integrity.md](./ci-integrity.md) — Markdown link checker (complementary)
- [spec-driven-development.md](./spec-driven-development.md) — AGM vs feature-centric SDD
- [agm/README.md](../../agm/README.md) — open CLI & MCP for graph operations
