#!/usr/bin/env bash
# Activate a Blueprint Pattern workflow (session prompt + Cursor rule).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WORKFLOWS_DIR="$ROOT/prompts/workflows"
ACTIVE_FILE="$WORKFLOWS_DIR/ACTIVE.md"
RULES_FILE="$ROOT/.cursor/rules/blueprint-active-workflow.mdc"

list_workflows() {
  find "$WORKFLOWS_DIR" -maxdepth 1 -name '*.md' -type f \
    ! -name 'ACTIVE.md' \
    -exec basename {} .md \; \
    | sort
}

usage() {
  cat <<EOF
Usage: $(basename "$0") <command> [workflow-id]

Commands:
  list              List workflow IDs
  checkout <id>     Set ACTIVE.md and blueprint-active-workflow.mdc
  show              Print active workflow id (if detectable)
  clear             Reset to stub ACTIVE (no workflow)

Examples:
  $(basename "$0") checkout maintenance
  $(basename "$0") checkout architecture-work-query

Procedure: docs/guide.md
EOF
}

extract_session_prompt() {
  local src="$1"
  awk '/^## Session prompt$/{flag=1; next} flag && /^```$/{if(++n==1) next; if(n==2) exit} flag' "$src"
}

write_rules_mdc() {
  local id="$1"
  cat >"$RULES_FILE" <<EOF
---
description: Blueprint Pattern — active workflow (${id})
alwaysApply: true
---

# Active workflow: ${id}

Follow the session prompt in [prompts/workflows/ACTIVE.md](../../prompts/workflows/ACTIVE.md).

Core behavior: [prompts/core/system-prompt.md](../../prompts/core/system-prompt.md)  
Governance: [blueprint-context.mdc](./blueprint-context.mdc)

Do not switch workflow mid-session unless the human requests it.
EOF
}

write_active_from_workflow() {
  local id="$1"
  local src="$WORKFLOWS_DIR/${id}.md"
  if [[ ! -f "$src" ]]; then
    echo "Unknown workflow: ${id}" >&2
    echo "Available:" >&2
    list_workflows | sed 's/^/  - /' >&2
    exit 1
  fi

  local body
  body="$(extract_session_prompt "$src")"
  if [[ -z "${body// }" ]]; then
    echo "Could not extract session prompt from ${src}" >&2
    exit 1
  fi

  cat >"$ACTIVE_FILE" <<EOF
# Active workflow: ${id}

> Set by \`scripts/bp-workflow.sh checkout ${id}\`. Source: [${id}.md](./${id}.md)

\`\`\`
${body}
\`\`\`
EOF

  write_rules_mdc "$id"
  echo "Active workflow: ${id}"
  echo "  ACTIVE.md     → ${ACTIVE_FILE}"
  echo "  Cursor rule   → ${RULES_FILE}"
}

clear_active() {
  cat >"$ACTIVE_FILE" <<'EOF'
# Active workflow

No workflow is active.

Run: `./scripts/bp-workflow.sh checkout <workflow-id>`
EOF

  cat >"$RULES_FILE" <<'EOF'
---
description: Blueprint Pattern — no active workflow
alwaysApply: false
---

Select a workflow: see [docs/guide.md](../../docs/guide.md).
Run `./scripts/bp-workflow.sh checkout <id>`.
EOF

  echo "Cleared active workflow."
}

show_active() {
  if [[ -f "$ACTIVE_FILE" ]] && grep -q '^# Active workflow: ' "$ACTIVE_FILE"; then
    sed -n '1p' "$ACTIVE_FILE"
  else
    echo "No active workflow detected."
  fi
}

cmd="${1:-}"
case "$cmd" in
  list) list_workflows ;;
  checkout)
    [[ $# -ge 2 ]] || { usage; exit 1; }
    write_active_from_workflow "$2"
    ;;
  show) show_active ;;
  clear) clear_active ;;
  ''|-h|--help) usage ;;
  *)
    echo "Unknown command: $cmd" >&2
    usage
    exit 1
    ;;
esac
