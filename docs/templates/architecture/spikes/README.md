---
type: architecture-index
title: "Spikes"
description: "Timeboxed architecture/domain explorations (SPK register)"
resource: "repo://"
tags: [architecture, spikes]
timestamp: ""
---

# Spikes

Each spike is a **folder** under this directory: `YYYY-MM-DD-<slug>/`.

Typical contents:

- `index.md` — spike header (SPK id, goal, status)
- `notes.md` — ongoing write-up + Mermaid
- `boards/*.storm.json` — E2 boards (event storming, context map, …)

Register every spike in `../blueprint.md` ## Spike register (`SPK-NNN`).

Copy [`_template/`](./_template/) to start a new spike, or use **AGM Studio → Spike → New**.

Legacy flat files may still live in `../work/` (`WRK-*`); prefer spikes for new work.
