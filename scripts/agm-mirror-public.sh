#!/usr/bin/env bash
# Mirror agm/ package to a public sibling repo (abx-git/agm) without private prompt sources.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TARGET="${AGM_PUBLIC_REPO:-$ROOT/../agm}"

if [[ ! -d "$TARGET/.git" ]]; then
  echo "Public repo not found at $TARGET" >&2
  echo "  git clone https://github.com/abx-git/agm.git $TARGET" >&2
  exit 1
fi

echo "Syncing agm package to $TARGET …"
rsync -a --delete \
  --exclude node_modules \
  --exclude dist \
  --exclude prompts-pack \
  --exclude 'data/workflows-starter-prompts.json' \
  "$ROOT/agm/" "$TARGET/"

cd "$TARGET"
npm run build 2>/dev/null || (npm install && npm run build)
git add -A
git status --short
echo "Review and commit in $TARGET, then: git push"
