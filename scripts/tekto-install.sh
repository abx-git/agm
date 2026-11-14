#!/usr/bin/env bash
set -euo pipefail
PROJECT="${1:-Application}"
DOC_ROOT="${DOC_ROOT:-docs/tekto/}"
AI_TOOL="${AI_TOOL:-cursor}"
npx -y @abx-hh/tekto init --project "$PROJECT" --doc-root "$DOC_ROOT" --ai-tool "$AI_TOOL" "${@:2}"