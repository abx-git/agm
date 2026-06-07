# Blueprint — order-service

## Documentation template

Selected template: arc42  
Rationale: Full sample for arc42 + interface contracts; see [entry-point.md](./entry-point.md#documentation-template).

## Status

| Phase | arc42 section              | Target file                        | State   | Last updated |
|-------|----------------------------|------------------------------------|---------|--------------|
| 0     | Bootstrap                  | blueprint.md                       | [x] done | 2026-05-01   |
| 1     | Introduction and Goals     | arc42/introduction.md              | [x] done | 2026-05-01   |
| 2     | Constraints                | arc42/constraints.md               | [x] done | 2026-05-01   |
| 3     | Context and Scope          | arc42/context.md + interfaces/     | [x] done | 2026-05-02   |
| 4     | Solution Strategy          | arc42/solution-strategy.md         | [x] done | 2026-05-02   |
| 5     | Building Block View        | arc42/building-blocks.md           | [x] done | 2026-05-03   |
| 6     | Runtime View               | arc42/runtime.md                   | [x] done | 2026-05-03   |
| 7     | Deployment View            | arc42/deployment.md                | [x] done | 2026-05-04   |
| 8     | Cross-cutting Concepts     | arc42/concepts.md                  | [x] done | 2026-05-04   |
| 9     | Architecture Decisions     | arc42/decisions/                   | [x] done | 2026-05-05   |
| 10    | Quality Requirements       | arc42/quality.md                   | [x] done | 2026-05-05   |
| 11    | Risks and Technical Debt   | arc42/risks.md                     | [x] done | 2026-05-05   |
| 12    | Glossary                   | arc42/glossary.md                  | [x] done | 2026-05-05   |
| 13    | Operational Knowledge      | ops/                               | [x] done | 2026-06-01   |
| 14    | Domain — Context map       | domain/context-map.md              | [x] done | 2026-06-02   |
| 15    | Domain — Subdomains        | domain/subdomains.md               | [x] done | 2026-06-02   |
| 16    | Domain — Event catalog     | domain/events.md                   | [x] done | 2026-06-02   |
| 17    | Domain — Order context     | domain/contexts/order/             | [x] done | 2026-06-02   |

States: `[ ]` open · `[~]` in progress · `[x]` done · `[!]` blocked

## Work register

| ID | Track | Title | Type | File | Status | Date |
|----|-------|-------|------|------|--------|------|
| WRK-001 | architecture | Payment path when customer places order | question | [work/2026-05-10-order-payment-trace.md](./work/2026-05-10-order-payment-trace.md) | reviewed | 2026-05-10 |
| WRK-002 | architecture | Payment integration resilience | analysis | [work/2026-05-15-payment-resilience-analysis.md](./work/2026-05-15-payment-resilience-analysis.md) | reviewed | 2026-05-15 |
| WRK-003 | architecture | Circuit breaker for payment client | design | [work/2026-05-20-payment-circuit-breaker-design.md](./work/2026-05-20-payment-circuit-breaker-design.md) | draft | 2026-05-20 |

Types (architecture): `question` · `analysis` · `design`  
Types (domain): `domain-question` · `domain-discovery` · `domain-analysis` · `domain-design`  
Status: `draft` · `reviewed` · `superseded`

## Reviews

| Phase / target | Reviewed | Verdict | Report | Findings |
|----------------|----------|---------|--------|----------|
| 5 — Building Blocks | 2026-05-21 | PASS WITH NOTES | [work/2026-05-21-review-building-blocks.md](./work/2026-05-21-review-building-blocks.md) | 2 |

## Guardrail findings

| File | Finding | Severity | Source |
|------|---------|----------|--------|
| arc42/building-blocks.md | Direct coupling to payment client without circuit breaker | medium | Guardrail (Phase 5) |
| arc42/runtime.md | Missing idempotency key on order creation | low | Guardrail (Phase 6) |

## Session log

### 2026-06-01 — Session 4
- Completed: Extensions sample — context/, prompts/, ops/, review example
- Key decisions: Phase 13 ops/ populated for sample
- Next: Run maintenance on git diff when source changes
- Resume prompt: "Continue AGM. Role: maintenance. Read blueprint.md."

### 2026-05-05 — Session 1
- Completed: All arc42 sections for sample application
- Next: Architecture Work and Reviews
