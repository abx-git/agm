# Blueprint Pattern — Extensions

Derived from field experience with the DRDP Context Engineering framework. These extensions address gaps when comparing the Blueprint Pattern (architecture documentation graph) with a full-lifecycle AI-assisted development system in production.

**Implementation:** Copy templates from [`docs/templates/architecture/`](./templates/architecture/) during Bootstrap. Details in [PROMPT.md](../PROMPT.md).

---

## Overview

The Blueprint Pattern solves architecture documentation well. In production, four systemic challenges emerge:

| Challenge | Extension |
|-----------|-----------|
| Cold start every session | [1. Automatic Base Context](#extension-1-automatic-base-context) |
| One role for all tasks | [2. Specialized Agent Roles](#extension-2-specialized-agent-roles) |
| Context degradation in long sessions | [3. Compaction Strategy](#extension-3-compaction-strategy) |
| Same agent writes and judges output | [4. Generator–Evaluator Separation](#extension-4-generatorevaluator-separation) |
| No home for runbooks / pitfalls | [5. Operational Knowledge Layer](#extension-5-operational-knowledge-layer) |

**Recommended order:** 1 → 3 → 2 → 4 → 5

---

## Extension 1: Automatic Base Context

**Problem:** Every session depends on the user remembering the session-start prompt.

**Mechanism:** `docs/architecture/context/always-on.md` (injected automatically) + `on-demand.md` (read when needed).

| File | Content |
|------|---------|
| `always-on.md` | App identity, Blueprint path, doc layout, source map, shell constraints, session protocol |
| `on-demand.md` | Domain concepts, pitfalls, environment map |

**Tool mapping:**

| Tool | Mechanism | Path |
|------|-----------|------|
| Cursor | Rules (always apply) | `.cursor/rules/blueprint-context.mdc` → links to `always-on.md` |
| Claude Code | `CLAUDE.md` | Append summary + link |
| Amazon Q | Rules | `.amazonq/rules/blueprint-context.md` |
| GitHub Copilot | Instructions | `.github/copilot-instructions.md` |

The [system prompt](../PROMPT.md#1-system-prompt) defines **behavior**; base context defines **knowledge**.

---

## Extension 2: Specialized Agent Roles

**Problem:** One “expert architect” prompt cannot optimize Bootstrap, Maintenance, Architecture Work, and Review at once.

**Mechanism:** Role files in `docs/architecture/prompts/` augment the base prompt per operation:

- `role-bootstrap.md`
- `role-maintenance.md`
- `role-architecture-work.md`
- `role-review.md`

Session-start prompts specify `Role: [bootstrap | maintenance | architecture-work | review]`.

---

## Extension 3: Compaction Strategy

**Problem:** Long sessions suffer context rot.

**Mechanism:** Agent monitors triggers and recommends a session break with a resume prompt in the Blueprint session log.

| Trigger | Threshold |
|---------|-----------|
| arc42 phases completed | ≥ 2 |
| Source files read | ≥ 15 |
| Conversation turns | ≥ 30 |
| Topic switches | ≥ 3 |
| Referential integrity errors in sequence | ≥ 2 |

See [PROMPT.md § Compaction](../PROMPT.md#1-system-prompt).

---

## Extension 4: Generator–Evaluator Separation

**Problem:** Referential integrity does not catch wrong claims; self-review is biased.

**Mechanism:** **Review** as a separate operation in a **fresh session** using `role-review.md`. Output: `work/YYYY-MM-DD-review-<slug>.md`. Register in `blueprint.md` → `## Reviews`. Do not fix — report only.

Workflow: `Bootstrap → Review → Fix → Continue`

Guardrail findings gain a **Source** column: `Guardrail (Phase N)` vs `Review (YYYY-MM-DD)`.

---

## Extension 5: Operational Knowledge Layer

**Problem:** Troubleshooting, pitfalls, and runbooks have no arc42 home.

**Mechanism:** `docs/architecture/ops/` parallel to `arc42/`:

```
ops/
├── troubleshooting.md    ← decision trees
├── pitfalls.md           ← structured warnings
├── environments.md
└── runbooks/
```

Blueprint **Phase 13 — Operational Knowledge**. Linked from `entry-point.md`. Maintained during Maintenance; seeded during Bootstrap from CI/Terraform/Docker when relevant.

---

## Priority summary

| Extension | Impact | Effort | Dependency |
|-----------|--------|--------|--------------|
| 1. Base context | High | Low | None |
| 3. Compaction | Medium | Low | None |
| 2. Roles | High | Medium | None |
| 4. Review | High | Medium | Extension 2 |
| 5. Ops layer | Medium | Medium | Partial Bootstrap |
