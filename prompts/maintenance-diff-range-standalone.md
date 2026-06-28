# AGM — Maintenance (git diff range)

Copy the session block below into an agent chat or CI step. The agent resolves the diff between **DIFF_FROM** and **DIFF_TO** via Git MCP or `git diff` — no pasted diff.

**Workflow file:** [prompts/workflows/maintenance-diff-range.md](./workflows/maintenance-diff-range.md)  
**Pipeline guide:** [docs/reference/maintenance-pipeline.md](../docs/reference/maintenance-pipeline.md)

Substitute `<diff-from>` and `<diff-to>` (or set `DIFF_FROM` / `DIFF_TO` in the shell) before sending the prompt.

---

## Session prompt

```
AGM — Maintenance (git diff range).
Workflow: maintenance-diff-range
Role: maintenance

## Diff range (substitute before run — pipeline: env DIFF_FROM / DIFF_TO)
DIFF_FROM=<diff-from>
DIFF_TO=<diff-to>

Instructions:
1. Read docs/architecture/context/always-on.md → docs/architecture/blueprint.md → docs/architecture/prompts/role-maintenance.md.
2. Obtain the code diff between DIFF_FROM and DIFF_TO yourself — do not ask the human to paste it:
   a) If a Git MCP server is connected, use its diff/compare tool with the same refs.
   b) Otherwise run at repository root: git diff ${DIFF_FROM}..${DIFF_TO}
   c) If the range is a PR merge base, use three-dot when appropriate: git diff ${DIFF_FROM}...${DIFF_TO}
3. If the diff is empty, stop and report; do not update architecture docs.
4. Classify changes and update only architecture docs impacted by this diff.

Output [[ANCHOR:CHANGE_CLASSIFICATION]], [[ANCHOR:CHANGED_DOCS]], [[ANCHOR:INTERFACE_IMPACT]], [[ANCHOR:OPEN_QUESTIONS]], [[ANCHOR:LINK_CHECK]] before stop.
```
