# Blueprint Pattern — standalone adoption prompt

Copy everything below the line into a new agent chat at your application repository root.  
The agent **writes** the folder structure, configuration, and first documentation — no download, no checkout script.

---

## Session prompt

```
Blueprint Pattern — Adopt (standalone session).
Workflow: bootstrap-adopt
Role: bootstrap

Adopt the Blueprint Pattern into this application repository. Execute this session like a setup script: write the documentation scaffold, configure application context, then run bootstrap.

Prerequisites: application repository open in the IDE; human available for a short interview.

Instructions:
1. If docs/architecture/blueprint.md already exists, stop and tell the human to paste the bootstrap-continue session prompt in a new chat instead.
2. Execute Phase A–C in prompts/reference/adopt-procedure.md (bundled below if not in repo): write all files directly — no git clone, zip, curl, or bp-workflow.sh.
3. Interview the human briefly. Write docs/architecture/context/always-on.md.
4. Remind the human to install prompts/core/system-prompt.md in IDE rules (once).
5. Bootstrap: follow docs/architecture/prompts/role-bootstrap.md — template selection, blueprint.md, entry-point.md, interfaces/, first evidence-based section.
6. Verify relative links. Append a session log entry to blueprint.md.

Output [[ANCHOR:CHANGED_FILES]], [[ANCHOR:TEMPLATE_SELECTED]], [[ANCHOR:PHASE_STATUS]], [[ANCHOR:OPEN_QUESTIONS]], [[ANCHOR:LINK_CHECK]] before stop.
```

---

## Scaffold procedure (include when pasting — or agent reads adopt-procedure.md from repo)

See [prompts/reference/adopt-procedure.md](./reference/adopt-procedure.md) in the pattern repository. The Assistant UI copies prompt + procedure in one block.
