# Maintenance in CI / pipelines

Use workflow **`maintenance-diff-range`** when the agent (or Cursor Cloud Agent) can run Git or a Git MCP tool in the checkout — not when you only have a static diff artifact.

## Parameters

| Parameter | Meaning | Examples |
|-----------|---------|----------|
| `DIFF_FROM` | Start of range | `origin/main`, `v1.2.0`, `${{ github.event.pull_request.base.sha }}` |
| `DIFF_TO` | End of range | `HEAD`, `main`, `${{ github.sha }}` |

Refs are passed through to `git diff` / MCP unchanged. Use full SHAs in CI when branches are shallow.

## Render prompt (shell)

From the application repository root after `bp-install.sh`:

```bash
DIFF_FROM="${DIFF_FROM:-origin/main}"
DIFF_TO="${DIFF_TO:-HEAD}"

./scripts/render-maintenance-prompt.sh \
  --from "$DIFF_FROM" \
  --to "$DIFF_TO" \
  --doc-root docs/architecture/ \
  > /tmp/bp-maintenance-prompt.txt
```

Feed `/tmp/bp-maintenance-prompt.txt` to your agent step (Cursor CLI, API, or manual chat).

## GitHub Actions (example)

```yaml
jobs:
  architecture-maintenance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Install AGM prompts
        run: |
          curl -fsSL https://raw.githubusercontent.com/abx-git/blueprint-pattern/main/scripts/bp-install.sh -o /tmp/bp-install.sh
          chmod +x /tmp/bp-install.sh
          /tmp/bp-install.sh --project "${{ github.repository }}" --template arc42 --ai-tool generic

      - name: Render maintenance prompt
        env:
          DIFF_FROM: ${{ github.event.pull_request.base.sha }}
          DIFF_TO: ${{ github.sha }}
        run: |
          ./scripts/render-maintenance-prompt.sh \
            --from "$DIFF_FROM" \
            --to "$DIFF_TO" \
            > maintenance-prompt.txt
          echo "Prompt written to maintenance-prompt.txt"

      # Replace with your agent invocation (Cursor, custom bot, etc.)
      - name: Run architecture agent
        run: |
          echo "Paste maintenance-prompt.txt into agent or wire your CLI here"
          wc -c maintenance-prompt.txt
```

## MCP vs shell

The session prompt tells the agent to prefer **Git MCP** when connected, otherwise **`git diff`**. No separate MCP configuration is required for local IDE sessions with shell access.

## Compare with `maintenance` (paste diff)

| Workflow | When |
|----------|------|
| `maintenance` | Human or bot already has the diff text |
| `maintenance-diff-range` | Agent must fetch diff from Git refs (pipelines, PR jobs) |

After maintenance, run **`review-maintenance`** in a **new** chat.
