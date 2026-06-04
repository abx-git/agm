# Typical dialog and prompt types

How a **human ↔ agent** collaboration looks across the **three lifecycle phases** — Build, Evolve, Work — and why **core**, **session prompt**, and **role** are separate.

**Procedure:** [Guide](./guide.md) · **Sample app:** [examples/sample-app](./examples/sample-app/)

---

## Lifecycle overview

| Phase | Human goal | Lead file | Example workflows |
|-------|------------|-----------|-------------------|
| **1 · Build** | Create doc graph iteratively | `blueprint.md` (construction plan) | adopt, bootstrap-continue, review-milestone |
| **2 · Evolve** | Deepen or sync with code | `entry-point.md` + chapters | refinement, maintenance |
| **3 · Work** | Use compiled graph | `work/` + WRK in blueprint | architecture-work-* |

---

## Part 1 — Three prompt types (why they exist)

| Type | Where | Who maintains | Changes | Purpose |
|------|-------|---------------|---------|---------|
| **Core prompt** | IDE rules + [prompts/core/system-prompt.md](../prompts/core/system-prompt.md) | Adopt once from pattern repo | Rarely | **Behavior:** scribe not architect; invariants; read order |
| **Session prompt** | [prompts/workflows/](../prompts/workflows/) | Per chat (Assistant UI) | Every session | **Task now:** bootstrap-adopt, maintenance, architecture-work-query, … |
| **Role** | `docs/architecture/prompts/role-*.md` | App repo (from templates) | Occasionally | **Procedure:** steps, classification, quality gates |

**Knowledge (not pasted into chat):** `always-on.md` (session context), `blueprint.md` (construction plan), `entry-point.md` (human navigation).

```text
Core (once) + session prompt (this chat) → agent → docs/architecture/ → update blueprint.md
```

### Why not one mega-prompt?

| Single prompt problem | Split solves it |
|----------------------|-----------------|
| Bootstrap + maintenance + review mixed | Review stays report-only in a fresh chat |
| Rules + today’s task + all steps | Less context rot; cheaper sessions |
| Same text when you only need maintenance | Workflow carries only what this chat needs |

### Workflow vs. role

| | Workflow | Role |
|--|----------|------|
| **You set** | `checkout <id>` | Nothing (agent loads from workflow) |
| **Content** | Short session contract | `[SA:STEPS]`, gates, STOP rules |
| **Example** | `architecture-work-query` vs. `-design` | Both use `role-architecture-work` |

Several workflows share one role when the **procedure** matches but the **goal** differs (`bootstrap-continue` vs. `refinement` → both `role-bootstrap`).

---

## Part 2 — Typical dialog (patterns, not mandatory wording)

Work happens in your **application repo** after running the install script (Assistant UI → Build → Install) — no git clone of blueprint-pattern.

### Phase 0 — One-time (human only)

1. [Assistant UI](https://abx-git.github.io/blueprint-pattern.github.io/) — OS, AI tool, project name, template, doc root → **Copy install script** → run at repo root.
2. Installs `prompts/`, `<doc-root>/` scaffold, and AI tool rules (`bp-install.sh` via HTTPS).

No agent chat yet.

---

### Session 1 — Create docs (`bootstrap-init`)

**You (terminal):** `checkout bootstrap-init`

**You (new chat):** Often nothing extra — Cursor reads `ACTIVE.md`. Optional:

> Bootstrap Blueprint Pattern documentation for this application. Prefer arc42 unless this is a single microservice.

**Agent (typical):**

> I read `always-on.md` and the repository layout. Proposed template: **arc42** — multiple modules and integrations visible. Creating `blueprint.md` (phase 0 in progress), `entry-point.md`, `interfaces/exports.md`, starting Introduction/Goals. Assumption: payment service is external — please confirm.

**You:** Confirm template and assumptions.

**Agent (end of session):**

> [[ANCHOR:TEMPLATE_SELECTED]] arc42  
> [[ANCHOR:CHANGED_FILES]] blueprint.md, entry-point.md, arc42/introduction.md, interfaces/exports.md  
> [[ANCHOR:PHASE_STATUS]] phase 0 [x], phase 1 [~]  
> [[ANCHOR:OPEN_QUESTIONS]] Notification: push or pull?  
> [[ANCHOR:LINK_CHECK]] pass  
> Session log updated. Next: `bootstrap-continue`.

**You:** Skim output; do not mark phases `[x]` if content is still thin.

---

### Session 2 — Continue (`bootstrap-continue`)

**You:** `checkout bootstrap-continue` → new chat. Optional: “Resume next open phase from blueprint.md.”

**Agent:** Works phases with evidence links; may suggest compaction after two phases.

**You (mid-session):** “Record the guardrail finding on order_service.ts in blueprint.md; no ADR yet.”

---

### Session 3 — Verify (`review-milestone`)

**New chat required** — not a follow-up in session 2.

**You:** `checkout review-milestone`

**Agent (report-only):**

> [[ANCHOR:REVIEW_SCOPE]] full `docs/architecture/` graph  
> [[ANCHOR:VERDICT]] PASS WITH NOTES  
> [[ANCHOR:FINDINGS]] major: runtime.md mentions retry; code only has timeout — missing link to payment_client.ts  
> Report: `work/2026-06-03-review-milestone.md`. **No files modified.**

**You:** Fix findings in a **later** write session (`bootstrap-continue` or `refinement`), not in the review chat.

---

### Day-to-day — Code changed (`maintenance`)

**You:** `checkout maintenance` → new chat → paste `git diff`.

**Agent:**

> [[ANCHOR:CHANGE_CLASSIFICATION]] API — orders endpoint  
> [[ANCHOR:CHANGED_DOCS]] arc42/building-blocks.md, interfaces/exports.md  
> [[ANCHOR:INTERFACE_IMPACT]] yes  
> [[ANCHOR:LINK_CHECK]] pass

**You:** Merge when code and docs align (team policy).

---

### Day-to-day — Architecture question (`architecture-work-query`)

**You:** `checkout architecture-work-query` → new chat:

> Question: How does order-service trigger notification after successful payment?

**Agent:** Traverses graph; writes `work/2026-06-03-order-notification-trace.md`; registers WRK-004 in `blueprint.md`.

---

### Occasional — Deepen (`refinement`)

**You:** `checkout refinement` → new chat:

> Goal: Extend arc42/runtime.md with retry and timeout for payment calls. Scope: order-service only.

Same **role** as `bootstrap-continue`; different **workflow** text (explicit scope).

---

### After maintenance — Verify (`review-maintenance`)

New chat; agent cross-checks only docs touched by last maintenance against the diff — report-only.

---

## Part 3 — Timeline

```text
Weeks 1–n (bootstrap)
  Human setup → bootstrap-init → bootstrap-continue (×n, compaction → new chat)
  → review-milestone (fresh chat) → fix findings in write sessions

Ongoing
  PR → maintenance (+ optional review-maintenance)
  Questions → architecture-work-*
  Milestones → review-milestone / review-phase
```

| Situation | Workflow | New chat? |
|-----------|----------|-----------|
| First docs | `bootstrap-init` | Yes |
| Continue arc42 | `bootstrap-continue` | Yes (recommended) |
| After code change | `maintenance` | Yes |
| Architecture question | `architecture-work-query` | Yes |
| Verify | `review-*` | **Required** |

---

## Part 4 — What you actually say

| Do | Don’t |
|----|-------|
| `checkout <workflow>` before the chat | Repeat the full core prompt |
| Paste **diff** for maintenance | Dictate entire arc42 in chat |
| **Fresh chat** for review | “Please fix findings” in review chat |
| Check **blueprint.md** after session | Memorize every `[SA:*]` section in roles |

**One line:** You choose the **workflow**; the agent loads **core** + **role** from rules and paths.

---

## Further reading

| Document | Content |
|----------|---------|
| [Guide](./guide.md) | Full procedure |
| [Gen AI challenges](./gen-ai-challenges.md) | LLM limits and governance |
| [Architects article](./article/blueprint-pattern-for-architects.md) | Principles and comparison |
