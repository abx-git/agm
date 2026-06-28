# Install: `bp-install.sh` vs `agm init`

Two entry points — different scope. **Golden path adopters use `bp-install.sh` only.**

| Tool | Scope | When |
|------|-------|------|
| **`bp-install.sh`** | Full scaffold: prompts, workflows, templates, domain/, IDE rules | **First-time setup** — golden path |
| **`agm init`** | Three core files only: `always-on.md`, `blueprint.md`, `entry-point.md` + `.agm/config.json` | MCP-only bootstrap on an **existing** repo; re-init core files |

---

## Golden path — `bp-install.sh`

Run at your **application repository root** (where `.git` lives).

**Assistant UI (recommended):** [Build → Install](https://abx-git.github.io/agm.github.io/) — generates a script for your OS, template, and doc root.

**One-liner:**

```bash
curl -fsSL https://raw.githubusercontent.com/abx-git/blueprint-pattern/main/scripts/bp-install.sh | bash -s -- \
  --project "my-app" --template arc42 --ai-tool cursor
```

**CLI helper (prints the same command):**

```bash
agm install --project "my-app" --template arc42
```

After install: copy **Adopt** prompt → new chat (`bootstrap-adopt`). The agent creates evidence-based content; install does **not** pre-fill `blueprint.md` construction plan beyond stubs.

---

## Minimal — `agm init`

For developers who already have prompts/workflows (or use MCP only) and need the three orchestration files:

```bash
cd my-app
agm init -y --app-name "my-app" --template arc42 --stack "TypeScript/Node"
```

Creates:

- `<doc-root>/context/always-on.md`
- `<doc-root>/blueprint.md` (phase table skeleton)
- `<doc-root>/entry-point.md`
- `.agm/config.json`

Does **not** install: `prompts/workflows/`, template chapter stubs, `domain/`, role prompts, CI rules.

**Next after `agm init`:** run `bp-install.sh` if you need the full scaffold, or paste `bootstrap-adopt` if prompts are already present.

---

## Aligning outputs

Both tools write compatible `blueprint.md`, `entry-point.md`, and `always-on.md` shapes. Prefer **one path per repo**:

1. `bp-install.sh` → adopt → continue (typical)
2. `agm init` → `bp-install.sh` only if prompts missing (install skips existing files where noted)

Do not run `agm init --force` after a full adopt without backup — it overwrites core files only, not template chapters.

---

## See also

- [quickstart.md](../quickstart.md)
- [adopt-procedure.md](./adopt-procedure.md)
- [agm/README.md](../../agm/README.md)
