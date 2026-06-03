# Blueprint Pattern — Prompt index

**Start here:** [Quick start guide (EN)](./docs/quick-start-guide.md) · [Kurzanleitung (DE)](./docs/anleitung.md) · [Gen AI challenges](./docs/gen-ai-challenges.md)

This file is a **file index** only. Session text lives under [`prompts/workflows/`](./prompts/workflows/).

| What you need | Where |
|---------------|--------|
| **Activate a workflow** (git checkout / script) | [prompts/README.md](./prompts/README.md) |
| **Core system prompt** (IDE rules) | [prompts/core/system-prompt.md](./prompts/core/system-prompt.md) |
| **Session prompts** (one per operation) | [prompts/workflows/](./prompts/workflows/) |
| **Active session** (current workflow) | [prompts/workflows/ACTIVE.md](./prompts/workflows/ACTIVE.md) |
| **Role steps** (`[SA:*]`) | [docs/templates/architecture/prompts/](./docs/templates/architecture/prompts/) |
| **Blueprint file format** | [prompts/reference/blueprint-format.md](./prompts/reference/blueprint-format.md) |
| **Base context setup** | [prompts/reference/base-context-setup.md](./prompts/reference/base-context-setup.md) |
| **CI link check** | [prompts/reference/ci-integrity.md](./prompts/reference/ci-integrity.md) |
| **Extensions & compaction** | [docs/blueprint-pattern-extensions.md](./docs/blueprint-pattern-extensions.md) |
| **Architecture Work guide** | [docs/architecture-work-guide.md](./docs/architecture-work-guide.md) |

---

## Quick activate

```bash
./scripts/bp-workflow.sh checkout maintenance
```

```bash
git checkout origin/workflow/maintenance -- prompts/workflows/ACTIVE.md .cursor/rules/blueprint-active-workflow.mdc
```

---

## Workflows at a glance

| ID | Role |
|----|------|
| `bootstrap-init` | bootstrap |
| `bootstrap-continue` | bootstrap |
| `refinement` | bootstrap |
| `maintenance` | maintenance |
| `architecture-work-query` | architecture-work |
| `architecture-work-analysis` | architecture-work |
| `architecture-work-design` | architecture-work |
| `architecture-work-continue` | architecture-work |
| `review-phase` | review |
| `review-milestone` | review |
| `review-maintenance` | review |

Details: [prompts/README.md](./prompts/README.md)

---

## Legacy section anchors

Older links may point here; content moved as follows:

| Former § | New location |
|----------|----------------|
| [§1 System prompt](#1-system-prompt) | [prompts/core/system-prompt.md](./prompts/core/system-prompt.md) |
| [§2 Blueprint format](#2-blueprint-file-format) | [prompts/reference/blueprint-format.md](./prompts/reference/blueprint-format.md) |
| [§3 Session-start](#3-session-start-prompts) | [bootstrap-continue](./prompts/workflows/bootstrap-continue.md), [maintenance](./prompts/workflows/maintenance.md) |
| [§4 Architecture Work](#4-architecture-work-prompts) | [prompts/workflows/architecture-work-*.md](./prompts/workflows/) |
| [§5 Review](#5-review-prompts) | [prompts/workflows/review-*.md](./prompts/workflows/) |
| [§6 Base context](#6-base-context-setup) | [prompts/reference/base-context-setup.md](./prompts/reference/base-context-setup.md) |

---

## 1. System prompt

See [prompts/core/system-prompt.md](./prompts/core/system-prompt.md).

## 2. Blueprint file format

See [prompts/reference/blueprint-format.md](./prompts/reference/blueprint-format.md).

## 3. Session-start prompts

See [prompts/workflows/bootstrap-continue.md](./prompts/workflows/bootstrap-continue.md) and [maintenance.md](./prompts/workflows/maintenance.md). Activate via [prompts/README.md](./prompts/README.md).

## 4. Architecture Work prompts

See [prompts/workflows/](./prompts/workflows/) files prefixed with `architecture-work-`.

## 5. Review prompts

See [prompts/workflows/review-*.md](./prompts/workflows/).

## 6. Base context setup

See [prompts/reference/base-context-setup.md](./prompts/reference/base-context-setup.md).

## Referential integrity — CI enforcement

See [prompts/reference/ci-integrity.md](./prompts/reference/ci-integrity.md).
