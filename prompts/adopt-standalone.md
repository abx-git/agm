# Blueprint Pattern — standalone adoption prompt

1. **Install** — [Assistant UI](https://abx-git.github.io/blueprint-pattern.github.io/) Build → configure OS, AI tool, template, doc root → copy and run the generated `bp-install.sh` (no git clone).
2. **Adopt** — copy the adoption prompt below into a new agent chat at your application repository root.

Starts **lifecycle phase 1 · Build**: agent writes `always-on.md`, `blueprint.md` (construction plan), `entry-point.md`, and the first evidence-based section (scaffold already installed).

---

## Session prompt

```
Blueprint Pattern — Adopt (standalone session).
Workflow: bootstrap-adopt
Role: bootstrap

Adopt the Blueprint Pattern into this application repository. The human has already run `bp-install.sh`. Execute Phase B–C in prompts/reference/adopt-procedure.md (bundled below).

Prerequisites: install script completed; application repository open in the IDE; human available for a short interview.

Instructions:
1. If docs/architecture/blueprint.md already exists, stop and tell the human to paste the bootstrap-continue session prompt in a new chat instead.
2. Verify Phase A in adopt-procedure.md: docs/architecture/prompts/role-bootstrap.md and prompts/core/system-prompt.md must exist. If missing, stop — ask the human to run the install script.
3. If an **Adoption parameters** block is present (with **File roles**), create always-on.md, blueprint.md, and entry-point.md as separate files; interview only for missing facts.
4. Bootstrap: follow docs/architecture/prompts/role-bootstrap.md — construction plan in blueprint.md, navigation in entry-point.md, first evidence-based template section.
5. Verify relative links. Append a session log entry to blueprint.md.

Output [[ANCHOR:CHANGED_FILES]], [[ANCHOR:TEMPLATE_SELECTED]], [[ANCHOR:PHASE_STATUS]], [[ANCHOR:OPEN_QUESTIONS]], [[ANCHOR:LINK_CHECK]] before stop.
```

---

## Scaffold procedure (include when pasting — or agent reads adopt-procedure.md from repo)

See [prompts/reference/adopt-procedure.md](./reference/adopt-procedure.md) in the pattern repository. The Assistant UI copies prompt + procedure in one block.
