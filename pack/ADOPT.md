# Blueprint Pattern — adoption kit

Unpack this archive at the **root of your application repository**. It adds:

```
docs/architecture/     documentation templates (fill always-on.md first)
prompts/               session workflows + core agent prompt
scripts/bp-workflow.sh activate a workflow per session
ide/cursor/            optional Cursor rules (copy to .cursor/rules/)
```

## Part 1 — Create documentation

1. **Unpack** at your app repo root (creates the folders above).
2. **Configure** — edit `docs/architecture/context/always-on.md`; copy `ide/cursor/*.mdc` to `.cursor/rules/`; ensure `prompts/core/system-prompt.md` is referenced in your IDE.
3. **First session** — `./scripts/bp-workflow.sh checkout bootstrap-init` → new agent chat.
4. **Follow-up sessions** — `checkout bootstrap-continue` until bootstrap phases in `blueprint.md` are done.
5. **Close** — `checkout review-milestone` (new chat, report-only).

## Part 2 — Use documentation

| Intent | Workflow |
|--------|----------|
| After code change | `maintenance` |
| Architecture question | `architecture-work-query` |
| Analysis | `architecture-work-analysis` |
| Design proposal | `architecture-work-design` |
| Open work items | `architecture-work-continue` |
| Deepen a section | `refinement` |
| Review | `review-maintenance` |

Each session: `checkout <id>` → new chat → review agent output and `blueprint.md`.

Full guide: https://github.com/abx-git/blueprint-pattern/blob/main/docs/guide.md
