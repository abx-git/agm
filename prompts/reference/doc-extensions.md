# Documentation focus extensions

Selected in the [Assistant UI](https://abx-git.github.io/blueprint-pattern.github.io/) (form above all lifecycle tabs) or passed as `DOC_FOCUS` to `bp-install.sh`. Injected into **Build** (bootstrap), **Evolve** (refinement, maintenance, maintenance-diff-range), and install.

| ID | Label | Install | Bootstrap | Evolve |
|----|-------|---------|-----------|--------|
| `onboarding` | Onboarding & navigation | — | entry-point ## Onboarding; always-on link | Keep onboarding paths current |
| `operations` | Operations & incidents | full `ops/` | blueprint ops/ phase; entry-point ## Operations | Update ops/ on runtime/deploy/incident diffs |
| `persistence` | Persistence & data | — | data model sections; on-demand data stores | Sync schema/migration-related docs |
| `interfaces` | Integration contracts | core `interfaces/` | early interfaces/ priority | Always update exports/imports on API changes |
| `security` | Security & compliance | — | constraints, quality, risks | Update on auth/policy changes |
| `deployment` | Deployment & environments | `ops/environments.md`* | deployment + environments | Sync infra/config diffs |
| `observability` | Observability | `ops/troubleshooting.md`* | runtime + troubleshooting stub | Update logging/metrics/tracing docs |
| `decisions` | Architecture decisions | `decisions/` | ADR phase + entry-point index | Draft/update ADRs when decisions implied |
| `ecosystem` | Multi-service ecosystem | `ecosystem-index.md` stub | imports + ecosystem links | Update partner links |
| `domain-glossary` | Domain language & glossary | — | glossary + on-demand terms | Update terminology |

\*If `operations` is not selected, partial `ops/` files install for deployment/observability only.

Comma-separated IDs: `onboarding,operations,persistence`
