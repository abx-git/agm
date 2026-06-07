# Workflow: architecture-work-sustainable-analysis

| Field | Value |
|-------|-------|
| **When** | Sustainable software analysis — structure, drift, technical debt |
| **Role** | `architecture-work` |
| **Prerequisite** | Bootstrap phase 0 `[x] done`; `entry-point.md` and source map in `always-on.md` |
| **Fresh session** | Recommended |

## Session prompt

```
Blueprint Pattern — Architecture Work (sustainable analysis).
Workflow: architecture-work-sustainable-analysis
Role: architecture-work

Method: sustainable software architecture
(architecture drift, modularity, layering, coupling, technical debt, domain alignment, maintainability)

Scope: <modules, services, packages, or repository paths>
Focus dimensions: <focus-dimensions>
Source paths (optional): <source-paths>
Compare to documented architecture: <compare-documentation>

═══════════════════════════════════════════════════════
PHASE 1 — CLARIFICATION (only if parameters are incomplete)
═══════════════════════════════════════════════════════

Start Phase 1 when Scope is `<clarify-with-user>`, or you cannot determine analysis
boundaries from the graph and inputs alone.

Phase 1 OVERRIDES role-architecture-work.md (steps 3–5 and OUTPUT_CONTRACT) until Phase 2 begins.

FORBIDDEN in Phase 1:
- Do not create or modify files
- No full analysis, recommendations, or [[ANCHOR:...]] output
- No more than ONE question per reply

ALLOWED in Phase 1:
- First reply: short clarification plan (3–5 bullets) + exactly question 1
- Follow-ups: max. 2 sentences context + exactly ONE question
- Adjust plan when the human revises earlier answers

Reply format Phase 1:
---
**Progress:** Point X of Y — [topic]
**Brief:** [optional, max. 2 sentences]
**Question:** [exactly one question]
---

Skip Phase 1 when Scope and Focus dimensions are concrete — proceed directly to Phase 2.

═══════════════════════════════════════════════════════
PHASE 2 — ANALYSIS (write)
═══════════════════════════════════════════════════════

Start Phase 2 when parameters are clear, or when the human writes "end interview", "done", or "write it up".

Instructions:
1. Read <doc-root>blueprint.md, traverse from <doc-root>entry-point.md, and read <doc-root>context/always-on.md (source map).
2. Inspect source under Scope and Source paths — follow links from the graph first; extend to code only where evidence is needed.
3. If Compare to documented architecture is yes: contrast intended structure (<template> sections, building blocks, interfaces) with observed code structure; record drift explicitly.
4. Produce docs/architecture/work/YYYY-MM-DD-<slug>.md (type: analysis) using this structure:
   - Context & scope
   - Intended vs actual architecture (drift) — skip subsection if compare=no and no docs exist
   - Structural quality (modularity, boundaries, package/module layout)
   - Layering & dependencies (violations, cycles, wrong-direction deps)
   - Coupling & cohesion (hotspots, god modules, inappropriate cross-cutting)
   - Technical debt (categorized findings with severity: critical / major / minor)
   - Domain & naming (ubiquitous language, bounded contexts if applicable)
   - Maintainability & changeability (extension points, test seams, change cost)
   - Recommendations (prioritized, sized: quick win / medium / strategic)
   - Traceability (every major claim → doc link or source path)
5. Limit analysis to Focus dimensions when not `<unspecified>`; mention omitted dimensions briefly in Context.
6. Link to existing guardrail findings in blueprint.md; add new guardrail candidates in Recommendations.
7. Register in <doc-root>blueprint.md (WRK-NNN). Verify relative links.

Output [[ANCHOR:WORK_ITEM]], [[ANCHOR:TRACEABILITY_COVERAGE]], [[ANCHOR:OPEN_QUESTIONS]], [[ANCHOR:LINK_CHECK]] before stop.
```
