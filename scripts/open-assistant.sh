#!/usr/bin/env bash
# Start Blueprint Pattern Assistant (static UI) on localhost.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DIR="$ROOT/docs/assistant"
PORT="${BP_ASSISTANT_PORT:-8765}"

if ! command -v python3 >/dev/null 2>&1; then
  echo "python3 is required to serve docs/assistant (browser blocks file:// fetch)." >&2
  exit 1
fi

cd "$DIR"
echo "Blueprint Pattern Assistant: http://localhost:${PORT}"
echo "Press Ctrl+C to stop."
if command -v open >/dev/null 2>&1; then
  (sleep 0.4 && open "http://localhost:${PORT}") &
fi
exec python3 -m http.server "$PORT"
