#!/usr/bin/env bash
# Render maintenance-diff-range session prompt for CI (substitute DIFF_FROM / DIFF_TO).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WF="${ROOT}/prompts/workflows/maintenance-diff-range.md"
DOC_ROOT="docs/architecture/"
DIFF_FROM="origin/main"
DIFF_TO="HEAD"

usage() {
  cat <<'EOF'
Usage: render-maintenance-prompt.sh [options]

Output the maintenance-diff-range session prompt to stdout.

Options:
  --from REF     DIFF_FROM (default: origin/main)
  --to REF       DIFF_TO (default: HEAD)
  --doc-root P   Documentation root (default: docs/architecture/)
  -h, --help
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --from) DIFF_FROM="$2"; shift 2 ;;
    --to) DIFF_TO="$2"; shift 2 ;;
    --doc-root) DOC_ROOT="$2"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown option: $1" >&2; usage >&2; exit 1 ;;
  esac
done

DOC_ROOT="${DOC_ROOT%/}/"

if [[ ! -f "$WF" ]]; then
  echo "Workflow not found: $WF" >&2
  exit 1
fi

prompt="$(python3 - "$WF" <<'PY'
import re, sys
text = open(sys.argv[1], encoding="utf-8").read()
m = re.search(r"## Session prompt\s+```\s*\n(.*?)```", text, re.S)
print(m.group(1).strip() if m else "", end="")
PY
)"

if [[ -z "$prompt" ]]; then
  echo "Could not extract session prompt from $WF" >&2
  exit 1
fi

prompt="${prompt//<diff-from>/$DIFF_FROM}"
prompt="${prompt//<diff-to>/$DIFF_TO}"
prompt="${prompt//<doc-root>/$DOC_ROOT}"
prompt="${prompt//docs\/architecture\//$DOC_ROOT}"

printf '%s\n' "$prompt"
