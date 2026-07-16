# Install

**Canonical Day-1 path:** [Assistant UI → Build → Install](https://abx-git.github.io/agm.github.io/) → run the generated `agm-install.sh` at your **application repo root**.

Default install = **golden path** (7 workflows + core roles). Architect/Domain packs are opt-in.

| Pack | Flag | What you get |
|------|------|--------------|
| **golden** (default) | — | 7 workflows + bootstrap/maintenance/review roles |
| **domain** | `--domain` | + Domain/DDD scaffold, domain workflows, DDD refs |
| **full** | `--full` | + all Architect workflows + Domain pack |

---

## Primary — Assistant UI (`agm-install.sh`)

```bash
curl -fsSL https://raw.githubusercontent.com/abx-git/agm/main/scripts/agm-install.sh | bash -s -- \
  --project "my-app" --template arc42 --ai-tool cursor
```

With Advanced packs:

```bash
curl -fsSL https://raw.githubusercontent.com/abx-git/agm/main/scripts/agm-install.sh | bash -s -- \
  --project "my-app" --template arc42 --ai-tool cursor --full
```

**Optional — work outside Git** (local drafts per developer):

```bash
curl -fsSL https://raw.githubusercontent.com/abx-git/agm/main/scripts/agm-install.sh | bash -s -- \
  --project "my-app" --template arc42 --ai-tool cursor \
  --work-dir "$HOME/agm-work/my-app/work"
```

See [external-work.md](./external-work.md). Existing installs: `scripts/agm-work-link.sh` or `npx @abx-hh/agm-cli work-link --work-dir …`.

After install: copy **Adopt** → new chat (`bootstrap-adopt`).

---

## Alias — MCP / npm (`agm scaffold`)

Same golden-path scaffold from the npm bundle (no GitHub curl):

```bash
npx @abx-hh/agm-cli scaffold --project "my-app" --template arc42 --ai-tool cursor
# optional: --domain | --full
# optional: --work-dir "$HOME/agm-work/my-app/work"
```

Or MCP tool **`agm_scaffold`**. Then `agm_trigger_workflow` with `bootstrap-adopt`.

---

## Power-user only

| Tool | Role |
|------|------|
| **`agm install`** | Prints the curl one-liner — does not install |
| **`agm init`** | Three core files only (`always-on`, `blueprint`, `entry-point`) — repair / MCP-only core; not Day-1 |

```bash
agm init -y --app-name "my-app" --template arc42 --stack "TypeScript/Node"
```

Does **not** install: golden workflows, template chapters, Domain pack. Prefer `agm-install.sh` or `agm scaffold` for first setup.

---

## Prefer one path per repo

1. `agm-install.sh` → adopt → continue (typical / Assistant UI)
2. `agm scaffold` → MCP adopt (no GitHub)
3. `agm init` only to repair the three core files

Do not run `agm init --force` after a full adopt without backup.

---

## Upgrade (existing installation)

Refresh workflows and prompts **without** overwriting architecture docs: [upgrade.md](./upgrade.md)

```bash
curl -fsSL https://raw.githubusercontent.com/abx-git/agm/main/scripts/agm-upgrade.sh | bash
# or: npx @abx-hh/agm-cli upgrade
```

---

## See also

- [quickstart.md](../quickstart.md)
- [adopt-procedure.md](./adopt-procedure.md)
- [extended-workflows.md](./extended-workflows.md)
- [agm/README.md](../../agm/README.md)
