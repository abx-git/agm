# Blueprint Pattern

> Architecture documentation as a traversable Markdown graph — built for AI agents, maintained by them, versioned with your code.

**Repository:** [github.com/abx-git/blueprint-pattern](https://github.com/abx-git/blueprint-pattern)

The **Blueprint Pattern** is a documentation pattern, not a product. It turns your repository into a traversable Markdown link network that AI agents can navigate without embeddings, vector databases, or external services.

---

## Read first

| Document | Audience | Purpose |
|----------|----------|---------|
| [**Quick start guide (EN)**](./docs/quick-start-guide.md) | Everyone | **Start here** — overview + daily use (3 concepts) |
| [Kurzanleitung (DE)](./docs/anleitung.md) | Everyone | Same guide in German |
| [**Gen AI challenges**](./docs/gen-ai-challenges.md) | Architects & leads | LLM problems — mitigated, partial, or awareness only |
| [**Blueprint Pattern for Architects**](./docs/article/blueprint-pattern-for-architects.md) | Software architects | Full method: problem, principles, workflow, roles |
| [Blueprint Pattern für Architekten (DE)](./docs/article/de/blueprint-pattern-fuer-architekten.md) | Methode auf Deutsch | Nach der Kurzanleitung |
| [**PROMPT.md**](./PROMPT.md) | Developers & agents | File index (advanced) |
| [**prompts/**](./prompts/README.md) | Developers & agents | Workflow IDs + git checkout (advanced) |
| [Migration (arc42-only)](./docs/migration-arc42-only.md) | Existing adopters | Optional templates, no breaking change |
| [**Extensions**](./docs/blueprint-pattern-extensions.md) | Architects & leads | Base context, roles, compaction, review, ops layer |
| [**Architecture Work Guide**](./docs/architecture-work-guide.md) | Architects | Query, analysis, design using the graph |
| [**Sample application**](./docs/examples/sample-app/) | Everyone | Runnable example with complete `docs/architecture/` |

---

## The problem in one sentence

AI coding agents excel at single files but struggle with architecture — they hallucinate cross-service connections or burn context scanning raw source.

The Blueprint Pattern **compiles** architectural knowledge once into an explicit Markdown graph and keeps it current via `git diff`.

---

## What it looks like

```
my-app/
├── docs/architecture/
│   ├── blueprint.md                 ← persistent work file across agent sessions
│   ├── entry-point.md               ← arc42 / C4 overview
│   ├── context/                     ← always-on + on-demand base context (Extension 1)
│   ├── prompts/                     ← role-bootstrap, maintenance, review, … (Extension 2)
│   ├── work/                        ← questions, analyses, designs, reviews
│   ├── interfaces/
│   │   ├── exports.md               ← APIs, events, services (unique IDs)
│   │   └── imports.md               ← links to partner exports.md files
│   ├── ops/                         ← troubleshooting, runbooks (Extension 5)
│   ├── arc42/                       ← template: arc42 (optional)
│   ├── c4-light/                    ← template: c4-light
│   ├── adr-first/                   ← template: adr-first
│   └── lean-service/                ← template: lean-service
```

Plain Markdown. Relative links only. No build step. No lock-in.

---

## Template selection

**arc42 is optional.** Choose a documentation template at Bootstrap and record it in `entry-point.md`:

| Template | When to use | Layout |
|----------|-------------|--------|
| `arc42` | Enterprise systems, full architecture description (default) | `arc42/` (12 sections) |
| `c4-light` | C4-focused teams, minimal prose | `c4-light/` (context, containers, components) |
| `adr-first` | Decision-driven architecture | `adr-first/` (decisions primary, views secondary) |
| `lean-service` | Single microservice, small scope | `lean-service/` (overview, runtime, decisions) |
| `custom` | Existing doc structure | Your paths; define phases in `blueprint.md` |

Copy starter files from [`docs/templates/architecture/`](./docs/templates/architecture/).  
Migrating from arc42-only wording: [migration guide](./docs/migration-arc42-only.md).

If you use **arc42**, attribute [arc42](https://arc42.org) (Starke, Hruschka, CC BY-SA 4.0) and [C4](https://c4model.com/) (Simon Brown) in `entry-point.md` where applicable.

---

## Operations

| Operation | When | What happens |
|-----------|------|--------------|
| **Bootstrap** | Once, no Blueprint yet | Agent creates Blueprint, works through arc42 phases (+ optional ops/) |
| **Refinement** | On demand | Targeted deepening of specific sections |
| **Maintenance** | On `git diff` | Update only affected Markdown files |
| **Architecture Work** | After Bootstrap | Answer questions, run analyses, produce designs → `work/` |
| **Review** | After generation (fresh session) | Verify docs against source; report only → `work/` + `## Reviews` |

Copy templates from [`docs/templates/architecture/`](./docs/templates/architecture/). See [Extensions](./docs/blueprint-pattern-extensions.md).

---

## Quick start

**Simple path:** [Quick start guide](./docs/quick-start-guide.md) — overview, five operations, three steps per session.

**Short version:** (1) Copy [core system prompt](./prompts/core/system-prompt.md) into IDE rules · (2) `./scripts/bp-workflow.sh checkout bootstrap-init` · (3) New chat — agent reads [ACTIVE.md](./prompts/workflows/ACTIVE.md).

See the [sample application](./docs/examples/sample-app/) for a complete reference implementation.

---

## Design constraints

- **Scale:** Proven on very large, core enterprise systems — scope Bootstrap per domain or module; expect **continuous Refinement**, not a one-time documentation sprint
- **Mid-sized apps** (~10k–100k LOC) are the easiest starting point for a first Bootstrap
- Designed for **sequential, single-agent** sessions — parallel writes to the Blueprint will conflict

See [field experience](./AUTHORS.md#field-experience) in AUTHORS.md.

---

## Status

Early-stage pattern. [Contributions](./CONTRIBUTING.md) and [case studies](./.github/ISSUE_TEMPLATE/case-study.md) welcome.

---

## Author

**[Andreas Bergmann](./AUTHORS.md)** — Software Architect, Hamburg.  
I explore pragmatic architecture patterns and agent-friendly workflows; this project is work in progress with deliberate room to evolve.

---

## License

[MIT](./LICENSE)
