#!/usr/bin/env bash
# Install a pre-commit hook that runs agm-validator on staged changes.
# Usage: ./scripts/install-agm-validator-hook.sh [/path/to/agm-validator]

set -euo pipefail

VALIDATOR="${1:-agm-validator}"
ROOT="$(git rev-parse --show-toplevel 2>/dev/null)" || {
  echo "error: not inside a git repository" >&2
  exit 1
}

if ! command -v "$VALIDATOR" >/dev/null 2>&1; then
  echo "error: agm-validator not found: $VALIDATOR" >&2
  echo "  pass absolute path: $0 /usr/local/bin/agm-validator" >&2
  exit 1
fi

HOOK="$ROOT/.git/hooks/pre-commit"
VALIDATOR_ABS="$(command -v "$VALIDATOR")"

cat >"$HOOK" <<EOF
#!/bin/sh
# Installed by agm/scripts/install-agm-validator-hook.sh
exec "$VALIDATOR_ABS" validate --repo "\$(git rev-parse --show-toplevel)" --staged
EOF

chmod +x "$HOOK"
echo "installed pre-commit hook -> $HOOK"
echo "test: agm-validator validate --staged"
