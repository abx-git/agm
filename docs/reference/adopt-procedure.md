# Adoption procedure (agent reference)

Bundled into the standalone adoption prompt. **Preparation:** human runs the install script from the [Assistant UI](https://abx-git.github.io/agm.github.io/) (Build → Install). **Adoption session:** agent executes Phase B–C only.

## Phase 0 — Install (human, before first chat)

From the application repository root, install the scaffold **before** the first adoption chat.

**MCP-only (recommended with `@abx-hh/agm-cli`):**

```bash
npx @abx-hh/agm-cli scaffold --project "Order Service" --template arc42 --ai-tool cursor
```

**Assistant UI / curl (requires public agm raw GitHub):**

```bash
./agm-install.sh --project "Order Service" --doc-root docs/architecture/ --template arc42 --ai-tool cursor
```

Both install:

- `prompts/core/system-prompt.md`, `prompts/reference/` (reference docs; workflows via MCP — see `prompts/workflows/README.md`)
- `${docRoot}/` scaffold: context, role prompts, work templates, interfaces stubs, template folder
- AI tool rules (Cursor `.cursor/rules/`, `CLAUDE.md`, `.github/copilot-instructions.md`, or `AGENTS.md`)

Optional `--work-dir`: symlink `${docRoot}/work` to a path **outside** the Git repo so drafts stay local — [external-work.md](./external-work.md).

Do **not** create `blueprint.md` or `entry-point.md` in the install script — the adoption session owns those.

## Phase A — Verify scaffold (agent)

Confirm `${docRoot}/prompts/role-bootstrap.md` and `prompts/core/system-prompt.md` exist. If missing, stop and ask the human to run `agm scaffold` or the install script first.

Do not re-download, clone, or duplicate files already installed.

## Phase B — Configure

If the session prompt includes **Architecture documentation areas (bootstrap)**, extend `blueprint.md` with phase rows and stubs for each selected area (see [doc-extensions.md](./doc-extensions.md)). Do not skip areas the human selected.

If the session prompt includes an **Adoption parameters** block (with **File roles**), create three separate files under `${docRoot}/` — do not merge:

| File | Write |
|------|-------|
| `context/always-on.md` | Session context from parameters; interview only for gaps |
| `blueprint.md` | Construction plan: phase rows for selected template, initial `[ ]` / `[~]` states |
| `entry-point.md` | Overview stub, navigation table, links to template sections and source paths |

AI tool rules were written by the install script — remind the human only if rules are missing.

## Phase C — Bootstrap

Follow `${docRoot}/prompts/role-bootstrap.md`:

- Record template in `entry-point.md`.
- Populate `blueprint.md` phase table; mark first in-progress phase.
- Populate interfaces/ and the first high-value section from evidence only.
- Keep blueprint (plan/progress) and entry-point (navigation) in sync.
- Session log + required anchors at end.

## Lifecycle after Build (phase 1)

| Phase | Action |
|-------|--------|
| **1 · Build** (continue) | `bootstrap-continue` until phases done → `review-milestone` |
| **2 · Evolve** | `refinement`, `maintenance` (+ git diff) |
| **3 · Work** | `architecture-work-query`, `-analysis`, `-design`, `-continue` |
| **Review** (any phase) | `review-phase`, `review-maintenance` — report-only, new chat |

Session prompts: MCP `agm_trigger_workflow`, Assistant UI, or (if installed) `prompts/workflows/<id>.md`.

---

## Appendix A — Core prompt (installed to `prompts/core/system-prompt.md`)

See [system-prompt.md](../../prompts/core/system-prompt.md) in the pattern repository. The install script copies it; do not duplicate in the adoption chat unless the file is missing.

## Appendix B — Role prompt shape

Each `${docRoot}/prompts/role-*.md` file uses: `[SA:ROLE]`, `[SA:INPUTS]`, `[SA:STEPS]`, `[SA:QUALITY_GATES]`, `[SA:OUTPUT_CONTRACT]`, `[SA:STOP]`. Installed from `docs/templates/architecture/prompts/` by `agm-install.sh`.
