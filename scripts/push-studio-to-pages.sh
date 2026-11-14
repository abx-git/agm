#!/usr/bin/env bash
# Build docs/studio and push dist/ to the Pages remote (agm.github.io main).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

REMOTE="${TEKTO_PAGES_REMOTE:-${AGM_PAGES_REMOTE:-pages}}"
BRANCH="${TEKTO_PAGES_BRANCH:-${AGM_PAGES_BRANCH:-main}}"
EXPECTED_PAGES_URL="${TEKTO_PAGES_REPO_URL:-${AGM_PAGES_REPO_URL:-https://github.com/abx-git/agm.github.io.git}}"

if ! git remote get-url "$REMOTE" >/dev/null 2>&1; then
  echo "Remote '$REMOTE' missing. Adding agm.github.io…" >&2
  git remote add "$REMOTE" "$EXPECTED_PAGES_URL"
fi

REMOTE_URL="$(git remote get-url "$REMOTE")"
case "$REMOTE_URL" in
  *agm.github.io*|*tekto.github.io*) ;;
  *blueprint-pattern.github.io*)
    echo "Updating pages remote to $EXPECTED_PAGES_URL" >&2
    git remote set-url "$REMOTE" "$EXPECTED_PAGES_URL"
    ;;
  *)
    echo "Warning: remote '$REMOTE' is $REMOTE_URL (expected *.github.io pages repo)." >&2
    ;;
esac

echo "Building Tekto Studio…"
(
  cd docs/studio
  if [[ ! -d node_modules ]]; then
    npm install
  fi
  npm run build:pages
)

SITE="${TMPDIR:-/tmp}/tekto-studio-pages-$$"
rm -rf "$SITE"
mkdir -p "$SITE"
rsync -a docs/studio/dist/ "$SITE/"
touch "$SITE/.nojekyll"

cd "$SITE"
git init
git checkout -b "$BRANCH"
git add -A
git commit -m "Deploy Tekto Studio"
git remote add origin "$(git -C "$ROOT" remote get-url "$REMOTE")"
echo "Pushing to ${REMOTE} ${BRANCH}…"
git push --force-with-lease origin "${BRANCH}"

echo "Done. Site: https://abx-git.github.io/agm.github.io/"
echo "See docs/studio/GITHUB-PAGES-SETUP.md for Pages build on agm.github.io."