# Blueprint — order-service

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

States: `[ ]` open · `[~]` in progress · `[x]` done · `[!]` blocked

## Architecture work

| ID | Title | Type | File | Status | Date |
|----|-------|------|------|--------|------|
| WRK-001 | Payment path when customer places order | question | [work/2026-05-10-order-payment-trace.md](./work/2026-05-10-order-payment-trace.md) | reviewed | 2026-05-10 |
| WRK-002 | Payment integration resilience | analysis | [work/2026-05-15-payment-resilience-analysis.md](./work/2026-05-15-payment-resilience-analysis.md) | reviewed | 2026-05-15 |
| WRK-003 | Circuit breaker for payment client | design | [work/2026-05-20-payment-circuit-breaker-design.md](./work/2026-05-20-payment-circuit-breaker-design.md) | draft | 2026-05-20 |

Types: `question` · `analysis` · `design`  
Status: `draft` · `reviewed` · `superseded`

## Guardrail findings

| File | Finding | Severity | Phase |
|------|---------|----------|-------|
| arc42/building-blocks.md | Direct coupling to payment client without circuit breaker | medium | 5 |
| arc42/runtime.md | Missing idempotency key on order creation | low | 6 |

## Session log

### 2026-05-05
- Completed: All arc42 sections for sample application
- Next: Run maintenance on git diff when source changes
