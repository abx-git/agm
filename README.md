# Blueprint Pattern

> Architecture documentation as a traversable Markdown graph — built for AI agents, maintained by them, versioned with your code.

The **Blueprint Pattern** is a documentation pattern, not a product. It turns your repository into a traversable Markdown link network that AI agents can navigate without embeddings, vector databases, or external services.

---

## Read first

| Document | Audience | Purpose |
|----------|----------|---------|
| [**Blueprint Pattern for Architects**](./docs/article/blueprint-pattern-for-architects.md) | Software architects | Full method: problem, principles, workflow, roles |
| [Blueprint Pattern für Architekten (DE)](./docs/article/de/blueprint-pattern-fuer-architekten.md) | Deutsche Kurzfassung | Kompakte Übersicht auf Deutsch |
| [**PROMPT.md**](./PROMPT.md) | Developers & agents | System prompt, Blueprint format, session prompts |
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
│   ├── entry-point.md             ← arc42 / C4 overview
│   ├── work/                        ← questions, analyses, designs (Architecture Work)
│   ├── interfaces/
│   │   ├── exports.md             ← APIs, events, services (unique IDs)
│   │   └── imports.md             ← links to partner exports.md files
│   └── arc42/
│       ├── context.md
│       ├── building-blocks.md
│       ├── runtime.md
│       ├── decisions/
│       └── …
```

Plain Markdown. Relative links only. No build step. No lock-in.

---

## Four operations

| Operation | When | What happens |
|-----------|------|--------------|
| **Bootstrap** | Once, no Blueprint yet | Agent creates Blueprint, works through arc42 phases |
| **Refinement** | On demand | Targeted deepening of specific sections |
| **Maintenance** | On `git diff` | Update only affected Markdown files |
| **Architecture Work** | After Bootstrap | Answer questions, run analyses, produce designs → `work/` |

---

## Quick start

1. Copy the [system prompt](./PROMPT.md#1-system-prompt) into your AI assistant (Cursor rules, `CLAUDE.md`, Copilot instructions)
2. Run: *"Bootstrap Blueprint Pattern documentation for this application"*
3. In later sessions: *"Continue Blueprint Pattern documentation — read the Blueprint and resume"*
4. Add the [CI link checker](./.github/workflows/blueprint-pattern-integrity.yml) to enforce referential integrity

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
