#!/usr/bin/env bash
# Create or update git branches workflow/<id> with ACTIVE.md + Cursor rule per workflow.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Not a git repository." >&2
  exit 1
fi

BASE_BRANCH="${1:-$(git symbolic-ref -q HEAD 2>/dev/null | sed 's|^refs/heads/||' || echo main)}"
CHECKOUT_SCRIPT="$ROOT/scripts/bp-workflow.sh"

if [[ ! -x "$CHECKOUT_SCRIPT" ]]; then
  chmod +x "$CHECKOUT_SCRIPT"
fi

echo "Base branch: ${BASE_BRANCH}"
echo "Creating workflow/* branches..."

while IFS= read -r id; do
  branch="workflow/${id}"
  echo "  → ${branch}"
  git checkout -B "$branch" "$BASE_BRANCH"
  "$CHECKOUT_SCRIPT" checkout "$id"
  git add prompts/workflows/ACTIVE.md .cursor/rules/blueprint-active-workflow.mdc
  if git diff --cached --quiet; then
    echo "    (no changes, skip commit)"
  elif git config user.email >/dev/null 2>&1 && git config user.name >/dev/null 2>&1; then
    git commit -m "workflow: activate ${id}"
  else
    echo "    (staged; commit skipped — set git user.name and user.email)"
  fi
done < <("$CHECKOUT_SCRIPT" list)

git checkout "$BASE_BRANCH"
"$CHECKOUT_SCRIPT" clear
git add prompts/workflows/ACTIVE.md .cursor/rules/blueprint-active-workflow.mdc 2>/dev/null || true
if ! git diff --cached --quiet 2>/dev/null; then
  if git config user.email >/dev/null 2>&1 && git config user.name >/dev/null 2>&1; then
    git commit -m "workflow: reset ACTIVE stub on ${BASE_BRANCH}" || true
  fi
fi

echo "Done. Push with: git push origin 'workflow/*'"
