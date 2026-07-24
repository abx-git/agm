# Architecture Graph Method (AGM)

> **Architecture documentation is the API of AI conversation.**

AGM is a repo-local Markdown link graph, orchestrated by `blueprint.md`, maintained by agents via MCP. Living architecture docs — traversable by humans and AI, versioned with your code.

**Start here:** **[docs/quickstart.md](./docs/quickstart.md)** — the only mandatory read (~10 min).

Repository: [github.com/abx-git/agm](https://github.com/abx-git/agm)

---

## Golden path

| Step | Action |
|------|--------|
| Install | [Review Studio](https://abx-git.github.io/agm.github.io/) → `agm-install.sh` |
| Adopt | One chat → `bootstrap-adopt` |
| Continue | `bootstrap-continue` — next chapter |
| Maintain | `maintenance-diff-range` — sync on git diff |
| Review | Fresh chat → `review-maintenance` |

Default: copy session prompt from Assistant into a new chat. Optional: MCP `agm_trigger_workflow` (same golden prompts) — [agm/README.md](./agm/README.md).

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

## Day-1 vs Advanced

**Day-1:** Build · Evolve · Verify — six golden workflows.

**Advanced** (after a graph exists; install `--full`): Architect and Domain intents — see [docs/reference/extended-workflows.md](./docs/reference/extended-workflows.md).

---

## Further reading

| Document | Audience |
|----------|----------|
| [docs/guide.md](./docs/guide.md) | Practitioners — full procedure |
| [docs/ROADMAP.md](./docs/ROADMAP.md) | Consolidation progress |
| [docs/gen-ai-challenges.md](./docs/gen-ai-challenges.md) | Leads — governance |
| [docs/reference/spec-driven-development.md](./docs/reference/spec-driven-development.md) | AGM vs feature SDD (Kiro, …) |
| [docs/reference/agm-validator.md](./docs/reference/agm-validator.md) | Commercial enforcement engine (hook, CI, MCP) |
| [docs/case-studies.md](./docs/case-studies.md) | Real-world examples |
| [docs/examples/sample-app/](./docs/examples/sample-app/) | Multi-service example |

Local AGM Studio: `./scripts/open-studio.sh` → http://localhost:5173  
Legacy Assistant-only: `./scripts/open-assistant.sh` → http://localhost:8765

---

[MIT](./LICENSE) · [Contributing](./CONTRIBUTING.md)
