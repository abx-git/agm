#!/usr/bin/env bash
# Build docs/studio and push dist/ to the pages remote (agm.github.io main).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

REMOTE="${AGM_PAGES_REMOTE:-pages}"
BRANCH="${AGM_PAGES_BRANCH:-main}"

if ! git remote get-url "$REMOTE" >/dev/null 2>&1; then
  echo "Remote '$REMOTE' missing. Add it:" >&2
  echo "  git remote add pages https://github.com/abx-git/agm.github.io.git" >&2
  exit 1
fi

./scripts/sync-assistant-data.py

echo "Building AGM Review Studio…"
(
  cd docs/studio
  if [[ ! -d node_modules ]]; then
    npm install
  fi
  npm run build
)

SITE="${TMPDIR:-/tmp}/agm-studio-pages-$$"
rm -rf "$SITE"
mkdir -p "$SITE"
rsync -a docs/studio/dist/ "$SITE/"
# Legacy assistant URL: keep a redirect note at /assistant-legacy if needed; embed lives at /assistant/

cd "$SITE"
git init
git checkout -b "$BRANCH"
git add -A
git commit -m "Deploy AGM Review Studio"
git remote add origin "$(git -C "$ROOT" remote get-url "$REMOTE")"
echo "Pushing to ${REMOTE} ${BRANCH}…"
git push --force-with-lease origin "${BRANCH}"

echo "Done. Site: https://abx-git.github.io/agm.github.io/"
