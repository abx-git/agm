# Base context — always on

<!-- Copy to docs/architecture/context/always-on.md and wire into your AI tool (see docs/blueprint-pattern-extensions.md). -->

## System identity

**Application:** <App Name>  
**Domain:** <one sentence>  
**Stack:** <e.g. TypeScript / Node.js, PostgreSQL, Kafka>

## Blueprint

- **Path:** [docs/architecture/blueprint.md](../blueprint.md)
- **Entry:** [docs/architecture/entry-point.md](../entry-point.md)

## Documentation structure

```
docs/architecture/
├── blueprint.md, entry-point.md
├── context/          ← this file (+ on-demand.md)
├── arc42/              ← architecture sections
├── interfaces/         ← exports.md, imports.md
├── ops/                ← troubleshooting, runbooks (optional)
├── prompts/            ← role extensions (optional)
└── work/               ← questions, analyses, designs, reviews
```

## Source code map

| Service / module | Path |
|------------------|------|
| <name> | `<path>/` |

## Shell constraints

- <!-- e.g. Never run destructive commands without explicit user approval -->
- <!-- e.g. Use `npm run test` not raw jest -->

## Session protocol

1. For architecture work: read [blueprint.md](../blueprint.md) before acting.
2. Load the role prompt from [prompts/](../prompts/) when the user specifies a role.
3. Traverse the Markdown graph via links; do not scan the repo blindly.
4. Update Blueprint and session log before stopping.

## On-demand context

Read when the task needs domain or environment detail: [on-demand.md](./on-demand.md)
