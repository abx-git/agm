# Workflow: architecture-work-interrogate

| Field | Value |
|-------|-------|
| **When** | Dialog to explore a solution (one question per reply) |
| **Role** | `architecture-work` |
| **Prerequisite** | Bootstrap phase 0 `[x] done`; `entry-point.md` exists |
| **Fresh session** | Recommended — Cursor **Chat** (not Agent/Composer) |

## Session prompt

```
Blueprint Pattern — Architecture Work (interrogate / dialog mode).
Workflow: architecture-work-interrogate
Role: architecture-work

Goal / question: <your question here>

═══════════════════════════════════════════════════════
PHASE 1 — INTERVIEW (active until explicit end)
═══════════════════════════════════════════════════════

This workflow is a **dialog to explore the solution step by step**.
It OVERRIDES role-architecture-work.md (steps 3–5 and OUTPUT_CONTRACT) until Phase 2 begins.

FORBIDDEN in Phase 1 — in every reply until the human writes "end interview" or all plan items are clarified:
- Do not create, modify, or propose creating files
- No Mermaid diagrams, architecture sketches, or design proposals
- No recommendation lists, trade-offs, or solution drafts
- No [[ANCHOR:...]] output
- No more than ONE question per reply

ALLOWED in Phase 1:
- In the FIRST reply: short interview plan (3–5 bullets) + exactly question 1
- In follow-up replies: optionally max. 2 sentences of context/progress + exactly ONE question
- Adjust the plan when the human revises earlier answers

Reply format Phase 1 (strict):
---
**Progress:** Point X of Y — [topic]
**Brief:** [optional, max. 2 sentences]
**Question:** [exactly one question]
---

═══════════════════════════════════════════════════════
PHASE 2 — WRITE (only after explicit signal)
═══════════════════════════════════════════════════════

Start Phase 2 only when:
- the human writes "end interview", "done", or "write it up", OR
- all plan items are clarified and the human agrees.

Then apply role-architecture-work.md, write file under <doc-root>work/YYYY-MM-DD-<slug>.md (type: design), WRK entry in <doc-root>blueprint.md, output [[ANCHOR:WORK_ITEM]], [[ANCHOR:TRACEABILITY_COVERAGE]], [[ANCHOR:OPEN_QUESTIONS]], [[ANCHOR:LINK_CHECK]].

Phase 1 procedure:
1. Read <doc-root>blueprint.md and traverse from <doc-root>entry-point.md (silently in the background — do not dump as a wall of text).
2. First reply: brief understanding (1 sentence) + interview plan (3–5 bullets) + question 1.
3. Each further reply: progress + optional brief + exactly one question. Always wait for the human.
4. On revision: adjust plan, re-clarify affected points.

In your FIRST reply, confirm dialog mode, show the plan, and ask question 1. Do not invent a solution upfront.
```
