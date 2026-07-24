#!/usr/bin/env bash
# Start AGM Assistant only (static UI) on localhost.
# Prefer ./scripts/open-studio.sh for Review Studio (Workflows + Browse).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DIR="$ROOT/docs/assistant"
PORT="${AGM_ASSISTANT_PORT:-8765}"

if ! command -v python3 >/dev/null 2>&1; then
  echo "python3 is required to serve docs/assistant (browser blocks file:// fetch)." >&2
  exit 1
fi

cd "$DIR"
echo "AGM Assistant (legacy): http://localhost:${PORT}"
echo "Tip: ./scripts/open-studio.sh for Review Studio (Workflows + Browse)."
echo "Press Ctrl+C to stop."
if command -v open >/dev/null 2>&1; then
  (sleep 0.4 && open "http://localhost:${PORT}") &
fi
exec python3 -m http.server "$PORT"
