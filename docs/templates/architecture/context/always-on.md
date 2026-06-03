# Base context — always on

<!-- Copy to docs/architecture/context/always-on.md -->

## System identity

**Application:** <App Name>  
**Domain:** <one sentence>  
**Stack:** <e.g. TypeScript / Node.js>

## Blueprint

- **Path:** [blueprint.md](../blueprint.md)
- **Entry:** [entry-point.md](../entry-point.md)
- **Template:** <!-- arc42 | c4-light | adr-first | lean-service | custom -->

## Documentation structure

```
docs/architecture/
├── blueprint.md, entry-point.md
├── context/          ← this file
├── prompts/          ← role-*.md
├── interfaces/
├── work/
└── <template>/       ← arc42 | c4-light | adr-first | lean-service
```

## Source code map

| Module | Path |
|--------|------|
| — | — |

## Shell constraints

- Human-in-the-loop: propose changes; user approves architectural decisions.

## Session protocol

1. Read [always-on.md](./always-on.md) → [blueprint.md](../blueprint.md) → `prompts/role-<role>.md`.
2. If no role: request bootstrap | maintenance | architecture-work | review.
3. Traverse Markdown links; verify [[ANCHOR:LINK_CHECK]] before stop.
4. Output [[ANCHOR:CHANGED_FILES]] and [[ANCHOR:OPEN_QUESTIONS]].

## On-demand

[on-demand.md](./on-demand.md)
