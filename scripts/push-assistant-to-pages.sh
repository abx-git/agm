#!/usr/bin/env bash
# Deprecated: use ./scripts/push-studio-to-pages.sh
# Kept so existing docs/CI mentions still work — forwards to Studio deploy.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
echo "Note: Assistant-only deploy is replaced by AGM Review Studio."
echo "Forwarding to push-studio-to-pages.sh …"
exec "$ROOT/scripts/push-studio-to-pages.sh"
