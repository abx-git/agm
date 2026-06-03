# Adoption procedure (agent reference)

Used by workflow `bootstrap-adopt` and the standalone adoption prompt.

## Phase A — Scaffold (automated)

Run at application repository root:

```bash
git clone --depth 1 https://github.com/abx-git/blueprint-pattern.git /tmp/blueprint-pattern
mkdir -p docs/architecture scripts prompts .cursor/rules
cp -R /tmp/blueprint-pattern/docs/templates/architecture/* docs/architecture/
cp /tmp/blueprint-pattern/scripts/bp-workflow.sh scripts/
cp -R /tmp/blueprint-pattern/prompts/core prompts/
cp -R /tmp/blueprint-pattern/prompts/workflows prompts/
cp /tmp/blueprint-pattern/.cursor/rules/blueprint-*.mdc .cursor/rules/ 2>/dev/null || true
chmod +x scripts/bp-workflow.sh
rm -rf /tmp/blueprint-pattern
```

Expected layout:

```
docs/architecture/     templates + role prompts
prompts/core/          system-prompt.md
prompts/workflows/     session workflows
scripts/bp-workflow.sh workflow checkout
.cursor/rules/         optional Cursor rules (when copied)
```

## Phase B — Configure

1. Write `docs/architecture/context/always-on.md` from human input.
2. Ensure `prompts/core/system-prompt.md` is wired into IDE rules.

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
