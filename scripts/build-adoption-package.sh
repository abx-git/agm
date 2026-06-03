#!/usr/bin/env bash
# Build a zip adoption kit — unpack at application repository root.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VERSION="${1:-dev}"
DIST="$ROOT/dist"
STAGING="$(mktemp -d)"

cleanup() { rm -rf "$STAGING"; }
trap cleanup EXIT

echo "Building adoption kit (version: ${VERSION})…"

mkdir -p \
  "$STAGING/docs/architecture" \
  "$STAGING/prompts/core" \
  "$STAGING/prompts/workflows" \
  "$STAGING/scripts" \
  "$STAGING/ide/cursor"

cp -R "$ROOT/docs/templates/architecture/"* "$STAGING/docs/architecture/"
cp "$ROOT/prompts/core/system-prompt.md" "$STAGING/prompts/core/"
cp "$ROOT/prompts/workflows/"*.md "$STAGING/prompts/workflows/"
cp "$ROOT/scripts/bp-workflow.sh" "$STAGING/scripts/"
cp "$ROOT/pack/ADOPT.md" "$STAGING/ADOPT.md"
mkdir -p "$STAGING/prompts/reference"
cp "$ROOT/prompts/reference/adopt-procedure.md" "$STAGING/prompts/reference/"

for f in "$ROOT/.cursor/rules/blueprint-"*.mdc; do
  [[ -f "$f" ]] && cp "$f" "$STAGING/ide/cursor/"
done

chmod +x "$STAGING/scripts/bp-workflow.sh"

mkdir -p "$DIST"
ZIP_VERSIONED="$DIST/blueprint-pattern-adopt-${VERSION}.zip"
ZIP_LATEST="$DIST/blueprint-pattern-adopt.zip"

(
  cd "$STAGING"
  zip -rq "$ZIP_VERSIONED" .
  cp "$ZIP_VERSIONED" "$ZIP_LATEST"
)

echo "Wrote:"
echo "  $ZIP_VERSIONED"
echo "  $ZIP_LATEST"
echo ""
echo "Adopters: unzip at application repository root, then read ADOPT.md"
