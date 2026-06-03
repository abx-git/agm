# Gen AI / LLM challenges and the Blueprint Pattern

Architecture work with large language models fails in predictable ways: context fills up, earlier instructions fade, answers sound authoritative but are wrong, and documentation drifts away from code. The Blueprint Pattern is a **documentation and session discipline** — not a magic model wrapper. It compiles architecture into a linked Markdown graph in the repository and splits agent work into clear operations (bootstrap, maintenance, review, and so on).

This document answers three questions for each common problem:

1. **What does the pattern do?** (mechanism in the repo)
2. **What can the organization fix?** (policy, ownership, rituals)
3. **What remains unsolvable?** (inherent LLM and static-doc limits)

Use the [Guide](./guide.md) for daily steps. Use **this document** for governance workshops, retrospectives, and setting expectations with leadership.

---

## How to read the tables

Each row is one **failure mode** you may already have seen in agent sessions. Three columns repeat everywhere:

| Column | Meaning |
|--------|---------|
| **Status** | How far the **pattern alone** goes (Mitigated / Partial / Awareness) |
| **Org.** | Whether **organizational measures** can materially improve outcomes (Yes / Partial / No) |
| **Measures** | Concrete examples — not an exhaustive policy catalog |

**Important:** “Mitigated” does not mean “safe to auto-merge.” It means the repository structure and prompts are designed for that risk. A mitigated row can still fail if nobody maintains the Blueprint or skips review.

---

## Legend (expanded)

### Pattern status

| Status | Meaning | Typical mistake |
|--------|---------|-----------------|
| **Mitigated** | The pattern ships a deliberate mechanism (graph, Blueprint, review mode, CI link check) | Assuming the mechanism runs itself without human maintenance |
| **Partial** | Works when people follow the process; no hard guarantee | Treating agent output as finished after one green `LINK_CHECK` |
| **Awareness** | Documented risk only; fix is outside the pattern file set | Expecting Markdown structure to replace security review or live ops data |

### Organizational lever

| Org. | Meaning | What “success” looks like |
|------|---------|---------------------------|
| **Yes** | Policies, roles, PR rules, capacity planning, or rituals can **materially** reduce incidence — **if enforced** | PR blocked without doc update; review calendar exists; owners named |
| **Partial** | Org measures **narrow** the problem but cannot close it without experts, tooling, or spot checks | Fewer hallucinations, but architect still validates interfaces quarterly |
| **No** | **Not eliminable** — only contained (smaller blast radius, human gates, observability) | Team accepts variance and budgets human review anyway |

---

## Summary: what org can fix vs. what stays unsolvable

### A — Strong organizational levers (Org. **Yes**)

Most rows here are not “AI problems” in the technical sense. They are **coordination failures**: documentation lives outside Git, nobody owns updates, reviews are skipped, or five people run five different session prompts. The Blueprint Pattern gives you files and workflows (`blueprint.md`, `ACTIVE.md`, review report-only mode). **Without organizational enforcement, those files become shelfware** — correct structure, stale or empty content.

If your retrospective sounds like “the agent forgot” or “we never updated the wiki,” start with section A before tuning prompts.

| Problem | Example organizational measures |
|---------|----------------------------------|
| Wiki rot | Architecture truth only in the repo; **PR rule**: API/schema/event changes require updates under `docs/architecture/` |
| Forgotten session start | Architecture ticket template includes workflow ID; optional commit of `ACTIVE.md` on shared branches |
| Mixed write + review | Written policy: verification happens in a **new** chat; reviewer is not the author of the draft pass |
| Wrong operation | Labels such as `bp-maintenance` vs. `bp-bootstrap-continue` on tickets |
| Parallel agents on one Blueprint | WIP limit of one doc-writing agent per application; doc changes on feature branches |
| One-shot bootstrap fantasy | Multi-quarter roadmap with **refinement** capacity (percent architect time), not a single sprint |
| Thin bootstrap | Definition of done: no `[x]` in Blueprint without named architect approval |
| ADR lag | Designs in `work/` must spawn an ADR PR before implementation funding |
| Ops knowledge in chat | Post-incident ritual: update `ops/pitfalls.md` or runbooks in the same sprint as the fix |
| Enterprise “never done” | Standing refinement backlog in architecture governance meeting |
| Monorepo / many services | Published matrix: service → `docs/architecture/` root → owner; CODEOWNERS enforced |
| No team RACI | Named architecture owner per system; escalation when exports/imports conflict |
| Review theater | Merge or release blocked on Review `FAIL`; TOP_RISKS read in architecture forum |
| Promotion without read | Two-step promotion: draft in `work/` → explicit approve → merge into arc42 |
| Inconsistent team usage | Mandatory onboarding (quick start); PR template checkbox for architecture impact |
| ACTIVE not shared | Team norm to commit ACTIVE + Cursor rule when running shared maintenance |
| Under-investment in review | Calendar events for milestone and quarterly reviews (same dignity as code review) |
| Large git diff maintenance | Small PR policy; agent receives scoped diff, not entire release branch |
| Secrets in prompts | Security training; redacted diffs; no credentials in chat or maintenance input |
| Stale graph (ongoing) | Same-PR rule: architectural code change and doc change ship together |

**Takeaway for leads:** Section A is where ROI is highest. Policies are cheap relative to model fine-tuning; the pattern is the **artifact** your policies protect.

---

### B — Org helps, but does not “solve” (Org. **Partial**)

Here the organization can **reduce frequency and severity**, but experts and judgment remain mandatory. This is the largest realistic zone for mature teams: you are not fighting culture only (section A) nor physics of the model (section C), but **quality under uncertainty**.

| Problem | What org can do | Why it stays partial |
|---------|-----------------|----------------------|
| Context rot / drift | Cap session length; mandatory new chat after N phases or 30 turns | Degradation is gradual and inconsistent across models — no reliable alarm |
| Context window exhaustion | Scope tickets per module; phased bootstrap program | Hard token ceiling still ends sessions mid-phase |
| Architecture hallucination | Spot-checks; second reviewer on interface changes | Fluent wrong answers pass casual reading |
| Invented facts | PR rejects `work/` items without traceability rows | Rows can link to wrong or outdated sources |
| Semantic correctness vs. links | Milestone review; sample-based code audit | Link CI proves paths exist, not that the sentence is true |
| Self-review bias | Fresh session (pattern) plus second human on critical findings | Rubber-stamping culture defeats any process |
| Interface spec drift | Fund CI comparing OpenAPI/Proto to `exports.md` | Requires platform investment and ownership |
| Token cost | Budget owner; smaller scoped sessions | Cost approaches zero only if you stop using agents |
| Tool / model change | Regression “golden path” session after upgrade | Behavior shifts without changelog for your prompts |
| Diagram hallucination | DoD: diagrams validated in review | Visual bugs are easy to miss in diff view |
| False confidence from anchors | Training: `[[ANCHOR:LINK_CHECK]] pass` ≠ sign-off | Anchors are agent-reported unless you add parsers in CI |
| Duplication / WRK drift | Session-end checklist in maintenance role | Agent may skip registry update under time pressure |
| Over-engineering docs | Refinement goals tied to decisions and risks only | Subjective; needs architect steering |

**Takeaway:** Budget **architect time** for spot audits and milestone reviews. Policy alone cannot replace sampling the graph against code.

---

### C — Not solvable (Org. **No**) — only contain

Even with excellent organization, full Blueprint adoption, and strict PR rules, these limits remain. The mistake is to **promise** stakeholders that “AI plus Markdown” removes them. The honest stance is **contain**: smaller tasks, human gates, observability, and never auto-merging agent-generated architecture without review.

| Problem | Why it cannot be eliminated | What org can still do (contain) |
|---------|----------------------------|----------------------------------|
| **Non-determinism** | Same prompt produces different outputs across runs and model versions | Tight scope per session; mandatory human merge; no “doc bot” on main without review |
| **Residual hallucination** | Models optimize fluency; plausible fiction is a feature of the stack | Human gate before promotion to arc42; evidence links; distrust fluent gaps |
| **Context window hard limit** | Fixed context per request | More sessions; phased Blueprint; smaller bounded contexts |
| **CI green, wrong architecture** | Automation checks links and syntax, not meaning | Expert review; spec drift jobs; periodic audits |
| **Real-time production truth** | Markdown in Git is a snapshot | Observability stack; `ops/` links to dashboards and runbooks |
| **Security in generated docs** | Documentation does not perform threat modeling | Security review on sensitive changes; never treat arc42 as security sign-off |
| **Legal / compliance sign-off** | Regulated approval is a formal act with accountable humans | Map Blueprint artifacts into existing compliance records |
| **Organizational silos** | Culture may resist shared `exports.md` / partner links | Integration governance — **outcome uncertain** |
| **Replacing pairing / workshops** | Synthesis requires debate and trade-offs | Agent as scribe **after** workshop; minutes → `work/` |
| **Model version drift** | Providers change behavior silently | Regression sessions; refresh prompts and rules |
| **RAG drift** (if added on top) | Similarity ≠ architectural truth | Policy: no RAG for architecture navigation (pattern default) |

**Takeaway for executives:** Containment has a **cost** (people, time, tooling). That cost is the real bill for safe Gen AI architecture work — not the token line item alone.

---

## 1. Context and memory

LLM sessions are **stateless between chats** and **bounded within a chat**. Anything not in context is effectively unknown; anything pushed out by long threads is forgotten or distorted. Architecture questions span many files and services — the default agent behavior (read everything) collides with these limits quickly.

The pattern responds by **pre-compiling** knowledge into a graph and by **externalizing session state** to `blueprint.md` and the session log. That does not enlarge the model window; it reduces what must enter the window per task.

| Problem | Pattern response | Status | Org. | Organizational measures |
|---------|------------------|--------|------|-------------------------|
| **Context window exhaustion** | Traverse `docs/architecture/` via links; Architecture Work avoids broad source scans | Mitigated | Partial | Scope tickets per module; phased bootstrap in program backlog |
| **Context rot / drift** | Compaction triggers; resume prompt in session log | Partial | Partial | Time-box sessions; new chat after ≥2 phases, ≥15 files, or ≥30 turns |
| **Cold start** | `blueprint.md`, `always-on.md`, read order in core prompt | Mitigated | Partial | Named owner keeps Blueprint current; ticket requires ACTIVE workflow |
| **Lost task focus** | `ACTIVE.md` + role scoped to one operation | Partial | Yes | One workflow per ticket; architect rejects unrelated diffs in review |
| **Conflicting instructions** | Split core / ACTIVE / role files | Partial | Yes | Single maintained copy of IDE rules; change control when prompts change |
| **Re-read cost** | Link graph limits redundant full-file reloads | Partial | Partial | Style guide: link instead of copy; keep sections short |

**In practice — context rot:** Teams notice rot when the agent “forgets” to update `blueprint.md`, reintroduces deprecated APIs, or contradicts the core prompt. Compaction is a **hint**, not a hard stop. Organizationally, treat long sessions like long meetings: pause, write state to the Blueprint, start fresh. Technically, the pattern makes that pause cheap because the resume prompt is already in the log.

**In practice — cold start:** Cold start is “solved” only if someone **maintains** the Blueprint between sessions. If the last session log is three months old, the new chat starts cold in all but name. Assign an owner (often the system architect or a rotating doc maintainer).

---

## 2. Accuracy, hallucination, and trust

The dominant failure mode for architecture questions is **plausible invention**: services, queues, and integrations that match how systems “usually” look, but not yours. RAG and web search can add **retrieval drift** — relevant-sounding chunks that are not your system. The pattern’s bet is **deterministic graph traversal**: follow a link or it does not exist; no probability score.

That bet reduces hallucinated **navigation**; it does not eliminate wrong **sentences** inside a file an agent wrote. Link CI proves targets exist, not that the paragraph is true.

| Problem | Pattern response | Status | Org. | Organizational measures |
|---------|------------------|--------|------|-------------------------|
| **Architecture hallucination** | `exports.md` / `imports.md`; evidence rule; graph-only traversal in Architecture Work | Partial | Partial | Interface changes require architect review; quarterly spot audits |
| **RAG / retrieval drift** | No embeddings for architecture navigation | Mitigated | Yes | Architecture guild policy: no ad-hoc RAG replacing the graph |
| **Invented facts** | `[[ANCHOR:ASSUMPTION]]`; traceability tables in `work/` | Partial | Partial | PR template rejects work items without trace rows |
| **Semantic correctness vs. links** | Review in fresh session (report-only) | Partial | Partial | Milestone review; random sample of claims vs. source |
| **Self-review bias** | Generator–evaluator separation | Partial | Partial | Reviewer ≠ author; critical findings need second architect |
| **Stale graph** | Maintenance triggered by `git diff` | Partial | Yes | Same-PR maintenance; SLA for stale phases in Blueprint |
| **Diagram hallucination** | Diagrams in Markdown with links to building blocks | Awareness | Partial | Review checklist: diagram validated against code paths |
| **Wrong cross-service story** | `imports.md` → partner `exports.md` only | Partial | Yes | Partner team owns exports; integration forum for gaps |

**In practice — stale graph:** Stale docs are worse than no docs: the agent answers confidently from fiction you once believed. Maintenance must be **habitual**, not a quarterly cleanup. The organizational fix (same PR as code) is stronger than any prompt wording.

**In practice — self-review:** A single session that writes arc42 and then “reviews” it will favor its own wording. The pattern forces a **new session** for review; the organization must forbid “just fix it in the same chat” and optionally require a different human to read FAIL findings.

---

## 3. Session and workflow discipline

Most tooling lets you open a blank chat. Without a task boundary, the model defaults to “helpful general assistant” — refactors, extra features, and mixed verification. The pattern’s workflows (`bootstrap-init`, `maintenance`, `review-phase`, …) are **session contracts**: what to read, what to output, when to stop.

| Problem | Pattern response | Status | Org. | Organizational measures |
|---------|------------------|--------|------|-------------------------|
| **Forgotten session start** | `ACTIVE.md`; `bp-workflow.sh checkout` | Mitigated | Yes | Ticket checklist; commit ACTIVE on shared tasks |
| **Mixed write + review** | Review workflows report-only; `role-review.md` STOP | Mitigated | Yes | Separate review ticket type; no “fix findings” in review chat |
| **Wrong operation** | Distinct workflow IDs per operation | Mitigated | Yes | Ticket labels and training on quick start table |
| **Parallel agents** | Documented sequential sessions per Blueprint | Awareness | Yes | One doc agent per app; branch per doc effort |
| **Workflow switching mid-session** | Core prompt: do not switch unless human asks | Partial | Yes | New ticket when operation changes mid-flight |
| **Compaction too late** | Heuristic thresholds in the [Guide](./guide.md) | Partial | Partial | Time-box (e.g. 90 minutes) for architecture sessions |

**In practice — parallel agents:** `blueprint.md` is a merge hotspot. Two chats updating phase state or WRK IDs will conflict like any shared config file. This is not fixable by better prompts; it is **WIP control** — same as avoiding two people editing migration scripts without coordination.

---

## 4. Documentation lifecycle

Architecture documentation fails over **months**, not minutes: bootstrap produces skeletons, teams mark phases done too early, ADRs never follow designs, runbooks stay in chat. The pattern makes lifecycle visible in the Blueprint (`[ ]`, `[~]`, `[x]`, WRK registry, Reviews table).

| Problem | Pattern response | Status | Org. | Organizational measures |
|---------|------------------|--------|------|-------------------------|
| **Wiki rot** | Docs as code beside source | Mitigated | Yes | Decommission parallel wiki as source of truth |
| **One-shot bootstrap fantasy** | Refinement operation; phased Blueprint | Partial | Yes | Multi-quarter program; refinement in capacity plan |
| **Thin bootstrap** | Visible phase states; guardrails | Partial | Yes | Forum sign-off before `[x]` |
| **Duplication** | Architecture Work links, does not copy arc42 | Mitigated | Yes | Review rejects duplicated paragraphs |
| **ADR lag** | Design workflow links ADR draft | Partial | Yes | Implementation blocked without ADR when impact flagged |
| **Ops knowledge in chat** | `ops/` layer (pitfalls, runbooks) | Partial | Yes | Incident process updates ops/ |
| **Interface spec drift** | Maintenance `[[ANCHOR:INTERFACE_IMPACT]]` | Awareness | Partial | Platform CI: machine-readable spec vs. `exports.md` |
| **WRK / registry drift** | WRK-NNN in `## Architecture work` | Partial | Yes | Maintenance checklist: registry matches `work/` files |

**In practice — thin bootstrap:** Empty arc42 files create a false sense of compliance. The organization must treat bootstrap as **beginning**, not graduation. Refinement sprints should target risk areas (payments, PII, multi-tenant boundaries), not “fill all twelve sections equally.”

**In practice — ADR lag:** `work/` is intentionally draft space. Without promotion rules, decisions stay negotiable forever. Tie ADR merge to funding or sprint acceptance for `[ADR_IMPACT]` items.

---

## 5. Scale and complexity

On large systems, no honest method finishes documentation in one pass. Context limits force **bounded contexts**; team boundaries force **ownership**. The pattern supports phased Blueprint rows; it does not choose your bounded contexts for you.

| Problem | Pattern response | Status | Org. | Organizational measures |
|---------|------------------|--------|------|-------------------------|
| **Monolith / huge repo bootstrap** | Phased bootstrap per domain | Partial | Yes | Program with named owner per domain |
| **Enterprise never “done”** | Refinement as normal operations | Partial | Yes | OKR on freshness; standing refinement backlog |
| **Monorepo many services** | Custom template or multiple doc roots | Awareness | Yes | Published architecture matrix (service → docs → owner) |
| **Large git diff maintenance** | Classify impact; update only touched docs | Awareness | Yes | PR size limits; split refactors from semantic API changes |

**In practice — enterprise scale:** Field experience on very large core systems shows **continuous refinement** matters more than bootstrap perfection. Organizationally, that means architecture time is **capacity**, not a one-time project line.

---

## 6. Human-in-the-loop and governance

The core prompt states the agent is a **scribe, not an architect**. That is a norm, not a technical control. Governance turns the norm into **accountability**: who may mark a phase done, who approves ADRs, who accepts review verdicts.

| Problem | Pattern response | Status | Org. | Organizational measures |
|---------|------------------|--------|------|-------------------------|
| **Autonomous architect** | Scribe mode; human review in guides | Mitigated | Yes | Named approver for ADRs and phase `[x]` |
| **False confidence from anchors** | Structured session output | Awareness | Partial | Training: anchors are not CI unless you build parsers |
| **No team RACI** | Owner in `always-on.md` / team policy | Awareness | Yes | Published RACI; CODEOWNERS on `docs/architecture/` |
| **Review theater** | Verdict and findings in Blueprint | Partial | Yes | FAIL blocks merge or release train |
| **Promotion without read** | Human review before arc42 promotion | Awareness | Yes | Formal promote step from `work/` |

**In practice — false confidence:** `[[ANCHOR:LINK_CHECK]] pass` is valuable as a **session checklist**. It is dangerous as a **merge criterion** without human reading. Teach teams the difference in onboarding.

---

## 7. Tooling, CI, and environment

Mechanical checks catch **broken links** early. They do not catch **wrong architecture**. Tooling choices (Cursor vs. Copilot vs. Claude) and model upgrades change behavior without semver for your prompts.

| Problem | Pattern response | Status | Org. | Organizational measures |
|---------|------------------|--------|------|-------------------------|
| **Broken links only in chat** | Optional CI workflow + `.mlc-config.json` | Mitigated | Yes | Required check on all application repos |
| **CI does not validate truth** | Link check only by default | Awareness | No* | Fund audits and spec drift jobs (*contain*) |
| **Tool-specific behavior** | Tool mapping in base context setup | Partial | Partial | Standardize primary agent tool per team where possible |
| **Model version drift** | Version-agnostic Markdown process | Awareness | No | Regression playbook after provider upgrade |
| **Vendor pattern repo stale** | Submodule / vendor copy of pattern | Awareness | Partial | Quarterly pin review of blueprint-pattern version |
| **Secrets in prompts** | Not addressed in pattern | Awareness | Yes | DLP policy; redacted diffs for maintenance |

**In practice — CI:** Enabling link check is Org. **Yes** and high leverage. Expecting CI to replace architects is Org. **No** — add human and semantic tooling on top.

---

## 8. Cost, quality, and team adoption

Adoption fails when only enthusiasts use the graph and others still ask questions in Slack. Cost spikes when every question rescans the repo. The pattern lowers **repeat** cost; it does not eliminate first-time compilation.

| Problem | Pattern response | Status | Org. | Organizational measures |
|---------|------------------|--------|------|-------------------------|
| **Token cost** | Graph traversal; compaction | Partial | Partial | Budget owner; smaller tickets; incremental refinement |
| **Inconsistent team usage** | Git-versioned docs | Partial | Yes | Engineering handbook chapter; PR template |
| **ACTIVE not shared** | Script / git checkout of ACTIVE | Partial | Yes | Team agreement for shared maintenance branches |
| **Over-engineering docs** | Guardrails; targeted refinement | Partial | Yes | Refinement tied to decisions and risks |
| **Under-investment in review** | Review workflows and types | Partial | Yes | Scheduled reviews in team calendar |

**In practice — adoption:** Treat the quick start as **mandatory** for anyone running architecture agents, same as secure coding training. One champion is not enough for a system with twenty contributors.

---

## 9. Outside the pattern (hard limits)

These items belong in risk registers and executive briefings, not in sales claims for “AI architecture.”

| Problem | Org. | Organizational measures | Solvable? |
|---------|------|-------------------------|-----------|
| **Non-determinism** | No | Smaller blast radius; mandatory human merge | **No** — variance remains |
| **Security vulnerabilities in generated text** | Partial | Security review on sensitive areas | **No** with docs alone |
| **Legal / compliance sign-off** | Partial | Map artifacts to compliance records | **No** without formal signatory |
| **Real-time production truth** | No | Observability; dashboards linked from ops/ | **No** in static Markdown |
| **Organizational silos** | Partial | Integration governance, shared interfaces forum | **Often no** — culture |
| **Substitution for pairing / workshops** | No | Agent after workshop; capture in `work/` | **No** — human synthesis required |

**Pairing and workshops:** The pattern accelerates **capture** after humans decide. It does not replace conflict resolution, political trade-offs, or novel design invention. Use workshops for decisions; use agents to draft structured docs and trace links.

**Silos:** If two teams refuse to maintain `exports.md` / `imports.md`, no graph pattern fixes incentives. Executive sponsorship may help; outcomes are organizational, not documentary.

---

## Decision guide for leads

```text
                    Can we fix it with org policy?
                              │
              ┌───────────────┴───────────────┐
             Yes                           No
              │                             │
     PR rules, RACI, reviews,          Contain only:
     capacity, checklists              non-determinism,
              │                        model limits, live truth
              ▼                             │
     Still need pattern +            Invest in tooling +
     human review for truth          expert review anyway
```

1. **Org. Yes** — Write policy and ownership first (low cost). Adopt Blueprint structure as the artifact those policies protect. Do not wait for a perfect prompt.
2. **Org. Partial** — Combine policy, pattern, and **sampling** (spot audits, milestone review). Do not trust automation or anchors alone.
3. **Org. No** — Set expectations with leadership: contain risk, budget experts and observability, never auto-merge agent architecture.

**Anti-pattern:** Buying more model capacity while section A rows remain unfixed — you pay tokens to rediscover the same governance gaps every sprint.

---

## Quick reference: mechanisms → problems

| Mechanism | Primary problems targeted | Org. dependency |
|-----------|---------------------------|-----------------|
| `always-on.md` | Cold start, forgotten session context | Owner maintains it when the system changes |
| Roles + workflows | Wrong behavior mix, scope creep | `bp-workflow.sh checkout` per session |
| Compaction | Context rot, long sessions | New chat when thresholds hit |
| Review (fresh chat) | Self-review bias, unchecked claims | Review scheduled like code review |
| `ops/` | Ops knowledge trapped in chat / tickets | Incident process writes to `ops/` |

---

## How to use this document

1. **Governance workshop (90 min):** Walk sections A, B, and C. Assign an owner and a date for every **Org. Yes** row you accept. Mark **Org. No** items in the risk register as “contain only.”
2. **Sprint retrospective:** When an agent session fails, classify it: missing policy (A), needed expert time (B), or accepted LLM limit (C). Fix category A before tweaking prompts.
3. **Onboarding:** Give new architects the [Guide](./guide.md) first; give leads this document second.
4. **Do not outsource:** Anything in section C to the agent without human review — regardless of `LINK_CHECK` or model brand.

For day-to-day operation, use the [Guide](./guide.md).
