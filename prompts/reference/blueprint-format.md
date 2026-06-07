# Blueprint file format

The agent creates this file during Bootstrap. It is the **construction plan** for the documentation graph: which sections exist, where they live, and their completion state. It is not a substitute for template chapter content (arc42, etc.) — that lives in the linked target files and in `entry-point.md`.

Phase rows depend on the selected template (`arc42`, `c4-light`, `adr-first`, `lean-service`, `custom`). The table below shows the **arc42** default; see [README § Template selection](../../README.md#template-selection).

**Path:** `docs/architecture/blueprint.md`

```markdown
# Blueprint — <App Name>

## Documentation template

Selected template: arc42
Rationale: <!-- recorded at bootstrap; also in entry-point.md -->

## Status

| Phase | Section                    | Target file                        | State          | Last updated |
|-------|----------------------------|------------------------------------|----------------|--------------|
| 0     | Bootstrap                  | blueprint.md                       | [x] done       | YYYY-MM-DD   |
| 1     | Introduction and Goals     | arc42/introduction.md              | [~] in progress| YYYY-MM-DD   |
| 2     | Constraints                | arc42/constraints.md               | [ ] open       | —            |
| 3     | Context and Scope          | arc42/context.md + interfaces/     | [ ] open       | —            |
| 4     | Solution Strategy          | arc42/solution-strategy.md         | [ ] open       | —            |
| 5     | Building Block View        | arc42/building-blocks.md           | [ ] open       | —            |
| 6     | Runtime View               | arc42/runtime.md                   | [ ] open       | —            |
| 7     | Deployment View            | arc42/deployment.md                | [ ] open       | —            |
| 8     | Cross-cutting Concepts     | arc42/concepts.md                  | [ ] open       | —            |
| 9     | Architecture Decisions     | arc42/decisions/                   | [ ] open       | —            |
| 10    | Quality Requirements       | arc42/quality.md                   | [ ] open       | —            |
| 11    | Risks and Technical Debt   | arc42/risks.md                     | [ ] open       | —            |
| 12    | Glossary                   | arc42/glossary.md                  | [ ] open       | —            |
| 13    | Operational Knowledge      | ops/                               | [ ] open       | —            |

States: `[ ]` open · `[~]` in progress · `[x]` done · `[!]` blocked

## Architecture work

| ID | Title | Type | File | Status | Date |
|----|-------|------|------|--------|------|
| —  | —     | —    | —    | —      | —    |

Types: `question` · `analysis` · `design`  
Status: `draft` · `reviewed` · `superseded`

## Reviews

| Phase / target | Reviewed | Verdict | Report | Findings |
|----------------|----------|---------|--------|----------|
| —              | —        | —       | —      | —        |

Verdict: `PASS` · `PASS WITH NOTES` · `FAIL`

## Guardrail findings

| File | Finding | Severity | Source |
|------|---------|----------|--------|
| —    | —       | —        | —      |

Source: `Guardrail (Phase N)` · `Review (YYYY-MM-DD)`

## Session log

### YYYY-MM-DD — Session N
- Completed: …
- Key decisions: …
- Open assumptions: …
- Compaction trigger: … (if applicable)
- Next: …
- Resume prompt: "Continue AGM. Workflow: …. Read blueprint.md. …"
```
