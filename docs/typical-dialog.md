# Typical dialogs (golden path)

Three sample **human ↔ agent** sessions after [install](../scripts/bp-install.sh). Not mandatory wording — patterns only.

**Procedure:** [quickstart.md](./quickstart.md) · **Sample app:** [examples/sample-app](./examples/sample-app/)

---

## Three prompt layers

| Layer | Where | Purpose |
|-------|-------|---------|
| **Core** | IDE rules + `prompts/core/system-prompt.md` | Behavior every session |
| **Session** | Assistant UI → copy into chat | This chat’s task (Track + workflow) |
| **Role** | `<doc-root>/prompts/role-*.md` | Step-by-step procedure |

Knowledge the agent reads (not pasted): `always-on.md`, `blueprint.md`, `entry-point.md`.

---

## Dialog 1 — Build: adopt and continue

**Once (human):** Assistant UI → copy install script → run at app repo root.

**Session A — `bootstrap-adopt` (new chat):**

> Agent: Install verified. Creating `blueprint.md`, `entry-point.md`, `always-on.md`. First section: arc42 introduction from source evidence. Assumption: payment is external — confirm?

> You: Confirm. Use arc42.

> Agent: `[[ANCHOR:CHANGED_FILES]]` … `[[ANCHOR:LINK_CHECK]] pass`. Next: `bootstrap-continue`.

**Session B — `bootstrap-continue` (new chat):**

> You: (paste prompt — optional: “next open phase from blueprint.md”)

> Agent: Phase 2 context view populated from `src/`. Session log updated.

**You:** Skim output; do not mark phases `[x]` until content is evidence-backed.

---

## Dialog 2 — Evolve + Verify: sync and review

**After a merged PR (new chat) — `maintenance-diff-range`:**

> You: DIFF_FROM=`origin/main`, DIFF_TO=`HEAD`

> Agent: `[[ANCHOR:CHANGE_CLASSIFICATION]]` API change on orders endpoint. Updated `interfaces/exports.md`, arc42 building blocks. `[[ANCHOR:LINK_CHECK]] pass`

**Fresh chat — `review-maintenance`:**

> Agent: Report-only. VERDICT: PASS WITH NOTES — runtime.md mentions retry; code shows timeout only. Report in `work/2026-06-03-review-maintenance.md`. **No files modified.**

> You: Fix findings in a **later** write session (`refinement` or `bootstrap-continue`), not in this chat.

---

## Dialog 3 — Architect: question on the graph

**New chat — `architecture-work-query`:**

> You: Question: How does order-service trigger notification after successful payment?

> Agent: Traverses `entry-point.md` → `interfaces/imports.md` → payment exports. Writes `work/2026-06-03-order-notification-trace.md`; registers WRK-004 in `blueprint.md`.

---

## Rules of thumb

| Do | Don’t |
|----|-------|
| New chat per workflow | Verify in the same chat as write/sync |
| Paste git range or use MCP for maintenance | Paste entire repo into chat |
| Check `blueprint.md` after every session | Memorize every role section |

Extended workflows and dialog-mode interviews: [reference/extended-workflows.md](./reference/extended-workflows.md).

Further reading: [guide.md](./guide.md) · [gen-ai-challenges.md](./gen-ai-challenges.md)
