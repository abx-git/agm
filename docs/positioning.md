# Tekto — positioning

## One sentence

**Tekto is team governance for architecture knowledge in Git** — not a replacement for your IDE, agent, or feature-spec tool.

## What Tekto is

| Layer | Role |
|-------|------|
| **Steer + log** | Single navigation file and audit trail (`docs/tekto/steer.md`, `log.md`) |
| **`interfaces/`** | Cross-service contracts (`exports.md` / `imports.md`) for multi-repo alignment |
| **Skills + aspects** | Repeatable agent loops (understand, decide, review, evolve) exported to Cursor, Claude, Copilot, Kiro |
| **`tekto check`** | Deterministic CI gate: links, evidence, graph sync, WRK trace, reviews |
| **Validator (optional)** | Commercial binary for **contract-on-diff** on `git diff` — see [reference/tekto-validator.md](./reference/tekto-validator.md) |

Leads and staff engineers use Tekto to keep **one traversable doc graph** that every AI session can load the same way.

## What Tekto is not

- **Not an IDE** — agents stay in Cursor, Claude Code, Copilot, etc.
- **Not a workflow catalog** — no long prompt library in-repo; copy-paste packets and skills instead.
- **Not feature SDD** — use Kiro/`.kiro/specs/` for scoped delivery; link outcomes into `steer.md` ## Now. See [reference/spec-driven-development.md](./reference/spec-driven-development.md).

## Multi-repo

Each service repo owns `docs/tekto/` and `interfaces/`. Partner APIs are linked by path or URL in `imports.md`; optional shared **contracts** repo + `tekto-validator` for drift. Details: [reference/multi-repo.md](./reference/multi-repo.md).

## Studio

**Tekto Studio** is a browser UI (local or [GitHub Pages](https://abx-git.github.io/agm.github.io/)): bind your repo, edit reviews, copy CLI commands. Static product docs: [/docs/](https://abx-git.github.io/agm.github.io/docs/). Scope: [studio/README.md](./studio/README.md).