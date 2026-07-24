# Workflow: domain-work-event-storm

| Field | Value |
|-------|-------|
| **Track** | Domain |
| **Activity** | Clarify |
| **Mode** | Dialog |
| **When** | Domain discovery via Event Storming (dialog) |
| **Role** | `domain-work` |
| **Prerequisite** | Bootstrap phase 0 `[x] done`; `domain/` scaffold installed |
| **Fresh session** | Required — Cursor **Chat** (not Agent/Composer) |

## Session prompt

```
AGM — Domain · Clarify (dialog)
Workflow: domain-work-event-storm
Role: domain-work

Process / bounded context (optional): <process-or-context>
Initial goal (optional): <initial-goal>

Report format: prompts/reference/ddd-work-report-formats.md § Event storm

═══════════════════════════════════════════════════════
PHASE 1 — EVENT STORM INTERVIEW
═══════════════════════════════════════════════════════

Dialog to build a shared domain timeline. OVERRIDES role-domain-work.md (steps 3–7 and OUTPUT_CONTRACT) until Phase 2.

FORBIDDEN in Phase 1:
- Do not create or modify files
- No aggregate diagrams, context maps, or design proposals
- No [[ANCHOR:...]] output
- No more than ONE question per reply

ALLOWED in Phase 1:
- First reply: storm plan (domain events → commands → aggregates → policies) + question 1
- Follow-ups: progress + one question about the next event, command, policy, or hotspot
- Use orange/purple/pink/yellow stickies metaphor in prose (events, commands, aggregates, policies)

Clarify in order (adjust if human steers):
1) Domain events in chronological order (past tense: "OrderPlaced")
2) Commands that trigger events
3) Aggregate candidates that accept commands
4) Policies / reactions (when X then Y)
5) Read models and external systems
6) Hot spots (uncertainty, contention, legacy)

Reply format Phase 1:
---
**Progress:** Step X of Y — [topic]
**Brief:** [optional, max. 2 sentences]
**Question:** [exactly one question]
---

═══════════════════════════════════════════════════════
PHASE 2 — WRITE
═══════════════════════════════════════════════════════

Start when human writes "end interview", "done", or "write it up".

1. Read <doc-root>blueprint.md, domain/, entry-point.md (background only).
2. Write <doc-root>/process/spikes/YYYY-MM-DD-<slug>/notes.md (type: domain-discovery) per report format.
3. Add candidate events to <doc-root>domain/events.md (draft rows) if agreed.
4. Optionally create <doc-root>domain/contexts/<slug>/model.md draft if one context emerged.
5. Register SPK in blueprint ## Spike register (Track: domain). Verify links.

Output [[ANCHOR:SPIKE]] (alias WORK_ITEM), [[ANCHOR:DDD_GRAPH_UPDATED]], [[ANCHOR:TRACEABILITY_COVERAGE]], [[ANCHOR:OPEN_QUESTIONS]], [[ANCHOR:LINK_CHECK]] before stop.
```
