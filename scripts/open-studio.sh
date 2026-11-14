#!/usr/bin/env bash
# Start Tekto Studio (Vite) on localhost.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DIR="$ROOT/docs/studio"
PORT="${TEKTO_STUDIO_PORT:-${AGM_STUDIO_PORT:-5173}}"

cd "$DIR"

if [[ ! -d node_modules ]]; then
  echo "Installing studio dependencies…"
  npm install
fi

echo "Tekto Studio: http://localhost:${PORT}"
echo "Press Ctrl+C to stop."
if command -v open >/dev/null 2>&1; then
  (sleep 1.2 && open "http://localhost:${PORT}") &
fi
exec npx vite --port "$PORT" --host