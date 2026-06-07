# GitHub Copilot — Architecture Graph Method (AGM) Instructions

You maintain architecture documentation using the Architecture Graph Method (AGM).

## How to start

1. **Copy the system prompt** from [prompts/core/system-prompt.md](../prompts/core/system-prompt.md) into your Copilot rules.
2. **Activate a workflow:** [Guide](../docs/guide.md) — `./scripts/bp-workflow.sh checkout maintenance` or [maintenance.md](../prompts/workflows/maintenance.md).
3. **Role files** live in `docs/architecture/prompts/role-*.md` (copy from [templates](../docs/templates/architecture/prompts/)).

4. **Example:** use the full block from `prompts/workflows/maintenance.md` and paste your git diff where indicated.

## Core rules

- **Human-in-the-loop:** You are a scribe, not an autonomous architect. Every phase requires human review.
- **Read before write:** Read `context/always-on.md` and `blueprint.md` at session start.
- **Update before stop:** Update `blueprint.md` states and session log before stopping.
- **Relative links only:** No external references; use relative Markdown links.
- **Referential integrity:** Before outputting, verify all new/changed links resolve.

## Templates

arc42 is optional. Supported templates:

- `arc42` — 12-phase enterprise standard (default)
- `c4-light` — C4 model simplified
- `adr-first` — decisions-first
- `lean-service` — microservices (4 sections)
- `custom` — user-defined

Always state selected template in `entry-point.md`.

## Semantic anchors

- `[[ANCHOR:CHANGED_FILES]]` — files changed
- `[[ANCHOR:LINK_CHECK]]` — pass/fail
- `[[ANCHOR:VERDICT]]` — review verdict (PASS / PASS WITH NOTES / FAIL)
- `[[ANCHOR:OPEN_QUESTIONS]]` — unresolved points

## Where to find templates

- Core prompt: [prompts/core/system-prompt.md](../prompts/core/system-prompt.md)
- Procedure: [docs/guide.md](../docs/guide.md)
- Role prompts: [docs/templates/architecture/prompts/](../docs/templates/architecture/prompts/)
- Base context: `docs/architecture/context/always-on.md`
- Example: [docs/examples/sample-app/](../docs/examples/sample-app/)
