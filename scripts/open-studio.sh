#!/usr/bin/env bash
# Start AGM Review Studio (Vite) on localhost.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DIR="$ROOT/docs/studio"
PORT="${AGM_STUDIO_PORT:-5173}"

cd "$DIR"

if [[ ! -d node_modules ]]; then
  echo "Installing studio dependencies…"
  npm install
fi

# Keep workflow catalog + embedded assistant in sync
python3 "$ROOT/scripts/sync-assistant-data.py"

echo "AGM Review Studio: http://localhost:${PORT}"
echo "Press Ctrl+C to stop."
if command -v open >/dev/null 2>&1; then
  (sleep 1.2 && open "http://localhost:${PORT}") &
fi
exec npx vite --port "$PORT" --host
