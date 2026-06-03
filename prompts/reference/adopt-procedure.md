# Adoption procedure (agent reference)

Used by workflow `bootstrap-adopt` and the standalone adoption prompt.  
Human-facing summary: [ADOPT.md](../../pack/ADOPT.md).

## Phase A — Scaffold (automated)

Run at application repository root:

```bash
curl -fsSL -o /tmp/blueprint-pattern-adopt.zip \
  https://github.com/abx-git/blueprint-pattern/releases/latest/download/blueprint-pattern-adopt.zip
unzip -o /tmp/blueprint-pattern-adopt.zip -d .
chmod +x scripts/bp-workflow.sh
```

Expected layout:

```
docs/architecture/     templates + role prompts
prompts/core/          system-prompt.md
prompts/workflows/     session workflows
scripts/bp-workflow.sh workflow checkout
ide/cursor/            optional Cursor rules
ADOPT.md
```

## Phase B — Configure

1. Write `docs/architecture/context/always-on.md` from human input.
2. Copy `ide/cursor/*.mdc` → `.cursor/rules/` when applicable.
3. Ensure `prompts/core/system-prompt.md` is wired into IDE rules.

## Phase C — Bootstrap

Follow `docs/architecture/prompts/role-bootstrap.md`:

- Select documentation template (record in entry-point.md).
- Create `blueprint.md` with phase states.
- Create entry-point, interfaces, first populated section.
- Session log + anchors at end.

## After adoption

| Next step | Workflow |
|-----------|----------|
| Continue documentation | `bootstrap-continue` |
| Close bootstrap | `review-milestone` |
| Day-to-day use | `maintenance`, `architecture-work-*`, `review-*` |

Activate workflows: `./scripts/bp-workflow.sh checkout <id>`
