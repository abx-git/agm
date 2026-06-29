# Architecture Graph Method (AGM)

> **Architecture documentation is the API of AI conversation.**

AGM is a repo-local Markdown link graph, orchestrated by `blueprint.md`, maintained by agents via MCP. Living architecture docs — traversable by humans and AI, versioned with your code.

**Start here:** **[docs/quickstart.md](./docs/quickstart.md)** — the only mandatory read (~10 min).

Repository: [github.com/abx-git/blueprint-pattern](https://github.com/abx-git/blueprint-pattern) *(legacy repo name; method is AGM)*

---

## Golden path

| Step | Action |
|------|--------|
| Install | [Assistant UI](https://abx-git.github.io/agm.github.io/) → `bp-install.sh` |
| Adopt | One chat → `bootstrap-adopt` |
| Continue | `bootstrap-continue` — next chapter |
| Maintain | `maintenance-diff-range` — sync on git diff |
| Review | Fresh chat → `review-maintenance` |

Default: copy session prompt from Assistant into a new chat. Optional: MCP `agm_trigger_workflow` (same prompts) — [agm/README.md](./agm/README.md).

---

## Core insight

Agents fail on cross-cutting architecture (hallucinate or exhaust context). AGM **compiles** knowledge into linked Markdown and **traverses** it deterministically — not similarity search.

```text
Dump loop          →    Doc-driven context
────────────────        ────────────────────
Paste repo/history      always-on.md + blueprint.md
RAG / wiki search       Links from entry-point.md
Same chat review        Fresh Verify chat
```

---

## Your app (`docs/architecture/`)

| File | Purpose |
|------|---------|
| `context/always-on.md` | App identity, stack, source map — every session |
| `blueprint.md` | Construction plan, phase status, WRK register |
| `entry-point.md` | Agent navigation — links only |
| `index.md` + `log.md` | OKF per-folder index + change log |
| `interfaces/` | `exports.md` · `imports.md` — cross-service contracts |

Templates: [docs/templates/architecture/](./docs/templates/architecture/) · Agent rules: [prompts/core/system-prompt.md](./prompts/core/system-prompt.md)

---

## Tracks

**Build** · **Evolve** · **Architect** · **Domain** · **Verify** — one chat = one session = one workflow.

---

## Further reading

| Document | Audience |
|----------|----------|
| [docs/guide.md](./docs/guide.md) | Practitioners — full procedure |
| [docs/ROADMAP.md](./docs/ROADMAP.md) | Consolidation progress |
| [docs/gen-ai-challenges.md](./docs/gen-ai-challenges.md) | Leads — governance |
| [docs/reference/spec-driven-development.md](./docs/reference/spec-driven-development.md) | AGM vs feature SDD (Kiro, …) |
| [docs/case-studies.md](./docs/case-studies.md) | Real-world examples |
| [docs/examples/sample-app/](./docs/examples/sample-app/) | Multi-service example |

Local Assistant UI: `./scripts/open-assistant.sh` → http://localhost:8765

---

[MIT](./LICENSE) · [Contributing](./CONTRIBUTING.md)
