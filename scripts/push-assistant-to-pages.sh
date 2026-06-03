#!/usr/bin/env bash
# Push docs/assistant/ to the pages remote (blueprint-pattern.github.io main).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

REMOTE="${BP_PAGES_REMOTE:-pages}"
BRANCH="${BP_PAGES_BRANCH:-main}"

if ! git remote get-url "$REMOTE" >/dev/null 2>&1; then
  echo "Remote '$REMOTE' missing. Add it:" >&2
  echo "  git remote add pages https://github.com/abx-git/blueprint-pattern.github.io.git" >&2
  exit 1
fi

./scripts/sync-assistant-data.py

SPLIT_BRANCH="assistant-deploy-$$"
git subtree split --prefix=docs/assistant -b "$SPLIT_BRANCH"

cleanup() {
  git branch -D "$SPLIT_BRANCH" 2>/dev/null || true
}
trap cleanup EXIT

echo "Pushing to ${REMOTE} ${BRANCH} (contents of docs/assistant/ at repo root)…"
git push "$REMOTE" "${SPLIT_BRANCH}:${BRANCH}"

echo "Done. Site: https://abx-git.github.io/blueprint-pattern.github.io/"
