# Gen AI / LLM challenges and AGM

AGM is **documentation and session discipline** — not a magic model wrapper. It compiles architecture into a linked Markdown graph and splits agent work into bounded sessions (bootstrap, maintenance, review, …).

**Daily operation:** [quickstart.md](./quickstart.md) · [guide.md](./guide.md)

**Row-by-row failure modes:** [reference/gen-ai-governance.md](./reference/gen-ai-governance.md) (governance workshops, retrospectives, leadership)

---

## How to read the summary

Each failure mode has three lenses:

| Lens | Question |
|------|----------|
| **Pattern** | What mechanism does AGM provide? (Mitigated / Partial / Awareness) |
| **Org.** | Can policy and rituals materially help? (Yes / Partial / No) |
| **Contain** | What stays unsolvable even with good org? |

“Mitigated” ≠ safe to auto-merge. Mechanisms need human maintenance and review.

---

## A — Strong organizational levers (Org. **Yes**)

Coordination failures: wiki rot, skipped reviews, parallel agents on one blueprint, no same-PR doc rule.

| Problem | Example measures |
|---------|------------------|
| Wiki rot | Architecture truth only in repo; PR rule for API/schema changes → `docs/architecture/` |
| Mixed write + review | Verify always in a **new chat**; reviewer ≠ author |
| Thin bootstrap | No `[x]` in blueprint without named architect approval |
| Stale graph | Same-PR rule: architectural code + doc ship together |
| Review theater | Merge blocked on Verify `FAIL` |
| Secrets in prompts | Redacted diffs; security training |

Full list and workshop script: [gen-ai-governance.md § Summary A–C](./reference/gen-ai-governance.md).

**Takeaway:** Section A is highest ROI — policies protect the graph artifact.

---

## B — Org helps, does not solve (Org. **Partial**)

| Problem | Why partial |
|---------|-------------|
| Context rot | Compaction helps; degradation is gradual across models |
| Hallucination | Graph traversal reduces navigation fiction; sentences still need spot-checks |
| Interface drift | `exports.md` helps; spec-vs-code jobs need platform investment |
| Self-review bias | Fresh Verify chat helps; culture can rubber-stamp |

**Takeaway:** Budget architect time for spot audits and milestone reviews.

---

## C — Not solvable (Org. **No**) — contain only

| Problem | Contain with |
|---------|--------------|
| Non-determinism | Tight scope; human merge; no doc bot on main without review |
| Residual hallucination | Evidence links; distrust fluent gaps |
| Context window limit | More sessions; phased blueprint |
| CI green, wrong meaning | Expert review; periodic audits |
| Live production truth | Observability; `ops/` links to dashboards |
| Security / compliance sign-off | Formal human gates — docs are not sign-off |

**Takeaway for executives:** Containment has a real cost (people, time, tooling) — not tokens alone.

---

## Workshop checklist (90 min)

1. Walk sections A–C in [gen-ai-governance.md](./reference/gen-ai-governance.md).
2. Assign owner + date for every **Org. Yes** row you accept.
3. Mark **Org. No** items in the risk register as “contain only.”
4. Onboarding order: quickstart → guide → this summary → governance detail for leads.

Do not outsource section C to the agent without human review — regardless of `LINK_CHECK` or model brand.

---

## Related

| Document | Audience |
|----------|----------|
| [quickstart.md](./quickstart.md) | What AGM does not solve (5 bullets) |
| [reference/gen-ai-governance.md](./reference/gen-ai-governance.md) | Full problem tables (sections 1–8) |
| [case-studies.md](./case-studies.md) | Real adoption stories |
