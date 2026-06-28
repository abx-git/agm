# Case studies

Real-world AGM applications. The in-repo [sample app](./examples/sample-app/) is the primary teaching example; additional studies are listed here as they are published.

To add yours: [CONTRIBUTING](../CONTRIBUTING.md) — Case Study template.

---

## Sample e-commerce ecosystem (in repository)

**Where:** [docs/examples/sample-app/](./examples/sample-app/)

**Shape:** Three services — `order-service`, `payment-service`, `notification-service` — each with `docs/architecture/`, cross-linked via `interfaces/imports.md` / `exports.md`.

**Template:** arc42 (teaching default)

**Golden path demo:** Install → adopt on one service → continue chapters → maintenance on payment resilience → domain context map for order bounded context.

**Takeaway:** Multi-service graphs traverse partner `entry-point.md` links deterministically — no monorepo-wide paste.

---

## Road TMS (transport management)

**Status:** Described in external ctx-eng materials — contribution welcome.

**Reported shape:** Multi-module Java/Kotlin system; arc42 graph co-located with services; maintenance-diff-range after release trains.

**If you have access:** Open a case study issue with anonymized `blueprint.md` phase excerpt and maintenance overhead metrics.

---

## E-commerce platform (production)

**Status:** Described in external ctx-eng materials — contribution welcome.

**Reported shape:** Microservices on Kubernetes; `lean-service` template on edge services; full arc42 on platform core; CI link check on every PR touching `docs/architecture/`.

---

## Drupal / CMS extension landscape

**Status:** Described in external ctx-eng materials — contribution welcome.

**Reported shape:** Module boundaries as bounded contexts; `domain/` for plugin ecosystem; heavy use of `architecture-work-query` before refactors.

---

## What makes a good case study

- Public repo or redacted excerpt (one service is enough)
- Template choice and why
- Bootstrap duration (sessions, calendar time)
- Maintenance habit (same-PR rule yes/no)
- What failed or was skipped (honesty helps adopters)
