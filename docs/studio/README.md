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
| **4. Spike** | Create/open spike folders (`SPK-*`): notes, Mermaid, E2 boards |
| **5. Review** | Browse full graph: tree, search, Markdown, Mermaid, link graph, boards |

Click the **AGM Studio** brand anytime to return to **What is AGM**. From there, open **How Studio works**.

## Spikes

Each spike is a directory `spikes/YYYY-MM-DD-<slug>/` with `index.md`, `notes.md`, and `boards/*.storm.json`. Studio can create spikes, edit notes, and lean-edit Event Storming boards (download for full E2 when needed).

Legacy flat `work/` + `WRK-*` remain readable.

## Run locally

```bash
./scripts/open-studio.sh
```

## License

MIT — © Andreas Bergmann, Hamburg, Germany. You may redistribute with attribution; see the repo [`LICENSE`](../../LICENSE).
