# AGM Studio

Unified static app for the Architecture Graph Method.

Live: https://abx-git.github.io/agm.github.io/

## Journey

| Step | What you do |
|------|-------------|
| **About** | What AGM is (method, not the Studio UI alone) |
| **Start** | What you need + URL-only cockpit loop |
| **1. Connect** | Project name, template, bind local architecture folder (write) |
| **2. Install** | Write Day-1 starter into the bound folder (browser only) |
| **3. Run** | Copy session prompt → paste into Cursor / AI chat on the same repo |
| **4. Process** | Spikes (`process/spikes/`, SPK) and reviews (`process/reviews/`, REV) |
| **5. Review** | Browse full graph: tree, search, Markdown, Mermaid, link graph, boards |

Click the **AGM Studio** brand anytime to return to **What is AGM**. From there, open **How Studio works**.

## Spikes & reviews

Lifecycle artifacts live under `process/` (not durable chapters):

- Spike: `process/spikes/YYYY-MM-DD-<slug>/` with `index.md`, `notes.md`, `boards/*.storm.json`
- Review: `process/reviews/YYYY-MM-DD-<slug>/` with `index.md`, `report.md`, `findings.md`

Legacy top-level `spikes/` + `work/` + `WRK-*` remain readable.

## Run locally

```bash
./scripts/open-studio.sh
```

## License

MIT — © Andreas Bergmann, Hamburg, Germany. You may redistribute with attribution; see the repo [`LICENSE`](../../LICENSE).
