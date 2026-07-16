#!/usr/bin/env bash
# AGM — upgrade platform files without touching architecture documentation content.
set -euo pipefail

AGM_REF="${AGM_REF:-main}"
AGM_REPO="https://raw.githubusercontent.com/abx-git/agm/${AGM_REF}"
AGM_UPGRADE_URL="${AGM_UPGRADE_URL:-https://raw.githubusercontent.com/abx-git/agm/${AGM_REF}/scripts/agm-upgrade.sh}"

DOC_ROOT="docs/architecture/"
AI_TOOL="cursor"
PROJECT="My Application"
DOC_FOCUS=""
INSTALL_DOMAIN=0
INSTALL_FULL=0
ADD_MISSING=1

usage() {
  cat <<'EOF'
Usage: agm-upgrade.sh [options]

Refresh AGM platform files in an existing installation — workflows, prompts,
role files, IDE rules — without overwriting architecture documentation content.

Safe (never overwritten):
  blueprint.md, entry-point.md, always-on.md, template chapters (arc42/…),
  work/, interfaces/, ops/, domain/, index.md, log.md

Updated (always):
  prompts/core/, prompts/reference/, prompts/workflows/ (for installed pack)
  <doc-root>/prompts/role-*.md
  IDE wiring (.cursor/rules, CLAUDE.md, …)

Added only if missing (default):
  sources/, use-cases/, work/_template*.md, domain/ (with --domain|--full)

Reads defaults from .agm-install-meta when present.

Options:
  --doc-root PATH   Documentation root (default: from .agm-install-meta or docs/architecture/)
  --ai-tool NAME    cursor | claude | copilot | generic
  --project NAME    Application label (metadata)
  --domain          Upgrade/add Domain pack workflows and roles
  --full            Upgrade/add Architect + Domain packs
  --no-add-missing  Skip scaffolding missing folders (sources/, use-cases/, …)
  --agm-ref REF     Git ref on abx-git/agm (default: main)
  -h, --help        Show this help

Examples:
  curl -fsSL .../agm-upgrade.sh | bash
  curl -fsSL .../agm-upgrade.sh | bash -s -- --domain
EOF
}

norm_doc_root() {
  local r="$1"
  r="${r%/}"
  [[ -n "$r" ]] || r="docs/architecture"
  echo "${r}/"
}

read_meta() {
  local key="$1"
  local default="${2:-}"
  [[ -f .agm-install-meta ]] || { echo "$default"; return; }
  local val
  val="$(grep -E "^${key}=" .agm-install-meta 2>/dev/null | tail -1 | cut -d= -f2- || true)"
  echo "${val:-$default}"
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --doc-root) DOC_ROOT="$2"; shift 2 ;;
    --ai-tool) AI_TOOL="$2"; shift 2 ;;
    --project) PROJECT="$2"; shift 2 ;;
    --domain) INSTALL_DOMAIN=1; shift ;;
    --full) INSTALL_FULL=1; INSTALL_DOMAIN=1; shift ;;
    --no-add-missing) ADD_MISSING=0; shift ;;
    --agm-ref) AGM_REF="$2"; AGM_REPO="https://raw.githubusercontent.com/abx-git/agm/${AGM_REF}"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown option: $1" >&2; usage >&2; exit 1 ;;
  esac
done

if [[ "${AGM_INSTALL_FULL:-}" == "1" ]]; then INSTALL_FULL=1; INSTALL_DOMAIN=1; fi
if [[ "${AGM_INSTALL_DOMAIN:-}" == "1" ]]; then INSTALL_DOMAIN=1; fi

if [[ -f .agm-install-meta ]]; then
  DOC_ROOT="$(read_meta doc_root "$DOC_ROOT")"
  AI_TOOL="$(read_meta ai_tool "$AI_TOOL")"
  PROJECT="$(read_meta project "$PROJECT")"
  DOC_FOCUS="$(read_meta doc_focus "$DOC_FOCUS")"
  meta_pack="$(read_meta pack golden)"
  if [[ "$INSTALL_FULL" -eq 0 && "$INSTALL_DOMAIN" -eq 0 ]]; then
    case "$meta_pack" in
      full) INSTALL_FULL=1; INSTALL_DOMAIN=1 ;;
      domain) INSTALL_DOMAIN=1 ;;
    esac
  fi
fi

DOC_ROOT="$(norm_doc_root "$DOC_ROOT")"
DOC_FOCUS="$(echo "$DOC_FOCUS" | tr -d ' ')"

if ! command -v curl >/dev/null 2>&1; then
  echo "curl is required." >&2
  exit 1
fi

if [[ ! -f "${DOC_ROOT}blueprint.md" && ! -f prompts/core/system-prompt.md ]]; then
  echo "No AGM installation detected (missing ${DOC_ROOT}blueprint.md and prompts/core/system-prompt.md)." >&2
  echo "Run agm-install.sh first." >&2
  exit 1
fi

fetch() {
  local remote_path="$1"
  local dest="$2"
  mkdir -p "$(dirname "$dest")"
  curl -fsSL "${AGM_REPO}/${remote_path}" -o "$dest"
}

fetch_force() {
  local remote_path="$1"
  local dest="$2"
  echo "  ↻ ${dest}"
  fetch "$remote_path" "$dest"
}

fetch_if_missing() {
  local remote_path="$1"
  local dest="$2"
  if [[ -f "$dest" ]]; then
    echo "  · ${dest} (kept)"
    return
  fi
  echo "  + ${dest}"
  fetch "$remote_path" "$dest"
}

PACK="golden"
if [[ "$INSTALL_FULL" -eq 1 ]]; then PACK="full"
elif [[ "$INSTALL_DOMAIN" -eq 1 ]]; then PACK="domain"
fi

GOLDEN_WORKFLOWS=(
  bootstrap-adopt bootstrap-continue refinement content-ingest
  maintenance-diff-range review-maintenance review-phase
)
ARCHITECT_WORKFLOWS=(
  bootstrap-init
  architecture-work-query architecture-work-analysis architecture-work-design
  architecture-work-continue architecture-work-interrogate
  architecture-work-sustainable-analysis architecture-work-sustainable-interrogate
  maintenance review-milestone
)
DOMAIN_WORKFLOWS=(
  domain-work-query domain-work-design domain-work-continue domain-work-event-storm
  domain-work-context-map domain-work-subdomain-classification domain-work-integration-review
  domain-work-tactical-review domain-work-language-audit
)

WORKFLOWS=("${GOLDEN_WORKFLOWS[@]}")
if [[ "$INSTALL_FULL" -eq 1 ]]; then
  WORKFLOWS+=("${ARCHITECT_WORKFLOWS[@]}" "${DOMAIN_WORKFLOWS[@]}")
elif [[ "$INSTALL_DOMAIN" -eq 1 ]]; then
  WORKFLOWS+=("${DOMAIN_WORKFLOWS[@]}")
fi

PROMPTS_REF=(
  adopt-procedure.md blueprint-format.md doc-extensions.md content-ingest.md
)

ROLE_FILES=(
  "docs/templates/architecture/prompts/role-bootstrap.md|${DOC_ROOT}prompts/role-bootstrap.md"
  "docs/templates/architecture/prompts/role-maintenance.md|${DOC_ROOT}prompts/role-maintenance.md"
  "docs/templates/architecture/prompts/role-review.md|${DOC_ROOT}prompts/role-review.md"
)

if [[ "$INSTALL_FULL" -eq 1 || "$INSTALL_DOMAIN" -eq 1 ]]; then
  ROLE_FILES+=(
    "docs/templates/architecture/prompts/role-architecture-work.md|${DOC_ROOT}prompts/role-architecture-work.md"
  )
fi
if [[ "$INSTALL_DOMAIN" -eq 1 ]]; then
  ROLE_FILES+=(
    "docs/templates/architecture/prompts/role-domain-work.md|${DOC_ROOT}prompts/role-domain-work.md"
  )
  PROMPTS_REF+=(ddd-guardrails.md ddd-work-report-formats.md)
fi

echo "AGM upgrade (platform only — architecture content preserved)"
echo "  Project:   ${PROJECT}"
echo "  Doc root:  ${DOC_ROOT}"
echo "  Pack:      ${PACK}"
echo "  Source:    ${AGM_REPO}"
echo

echo "Updating prompts/ …"
fetch_force "prompts/core/system-prompt.md" "prompts/core/system-prompt.md"
for ref in "${PROMPTS_REF[@]}"; do
  fetch_force "docs/reference/${ref}" "prompts/reference/${ref}"
done
for wf in "${WORKFLOWS[@]}"; do
  fetch_force "prompts/workflows/${wf}.md" "prompts/workflows/${wf}.md"
done

echo "Updating role prompts …"
for entry in "${ROLE_FILES[@]}"; do
  remote="${entry%%|*}"
  dest="${entry##*|}"
  fetch_force "$remote" "$dest"
done

if [[ "$ADD_MISSING" -eq 1 ]]; then
  echo "Adding missing scaffold (if any) …"
  fetch_if_missing "docs/templates/architecture/sources/index.md" "${DOC_ROOT}sources/index.md"
  fetch_if_missing "docs/templates/architecture/sources/log.md" "${DOC_ROOT}sources/log.md"
  fetch_if_missing "docs/templates/architecture/sources/_template.md" "${DOC_ROOT}sources/_template.md"
  fetch_if_missing "docs/templates/architecture/use-cases/index.md" "${DOC_ROOT}use-cases/index.md"
  fetch_if_missing "docs/templates/architecture/use-cases/_template.md" "${DOC_ROOT}use-cases/_template.md"
  fetch_if_missing "docs/templates/architecture/work/_template.md" "${DOC_ROOT}work/_template.md"
  fetch_if_missing "docs/templates/architecture/work/_template-review.md" "${DOC_ROOT}work/_template-review.md"
  if [[ "$INSTALL_DOMAIN" -eq 1 ]]; then
    fetch_if_missing "docs/templates/architecture/work/_template-domain.md" "${DOC_ROOT}work/_template-domain.md"
    for f in README.md context-map.md subdomains.md events.md contexts/_template/model.md contexts/_template/language.md; do
      fetch_if_missing "docs/templates/architecture/domain/${f}" "${DOC_ROOT}domain/${f}"
    done
  fi
fi

DOC_ROOT_RULE="${DOC_ROOT%/}"

write_cursor_rules() {
  mkdir -p .cursor/rules
  cat > .cursor/rules/agm.mdc <<EOF
---
description: AGM — core system prompt
alwaysApply: true
---

Follow the AGM core prompt in [prompts/core/system-prompt.md](../../prompts/core/system-prompt.md).

Human-in-the-loop scribe only. Read order: always-on.md → blueprint.md → role prompt.
Paths: \`${DOC_ROOT_RULE}/\` · Workflows: MCP \`agm_trigger_workflow\` or Assistant UI.
Output semantic anchors before stopping.

OKF: every architecture artifact needs YAML frontmatter with mandatory \`type\`; maintain \`index.md\` and \`log.md\`.
EOF
  cat > .cursor/rules/agm-context.mdc <<EOF
---
description: AGM — context and governance
alwaysApply: true
---

# Architecture Graph Method (AGM) — Context Rules

1. Read \`${DOC_ROOT_RULE}/context/always-on.md\`
2. Read \`${DOC_ROOT_RULE}/blueprint.md\`
3. Load \`${DOC_ROOT_RULE}/prompts/role-<role>.md\` from the session prompt or MCP workflow

Invariants: relative Markdown links only; human-in-the-loop; traceable claims; OKF frontmatter with mandatory type; index.md and log.md at each level.
On stop: update \`blueprint.md\`, \`log.md\`, OKF timestamps, [[ANCHOR:LINK_CHECK]].
EOF
  echo "  ↻ .cursor/rules/agm.mdc"
}

case "$AI_TOOL" in
  cursor) write_cursor_rules ;;
  claude)
    cat > CLAUDE.md <<EOF
# ${PROJECT} — Architecture Graph Method (AGM)

Follow [prompts/core/system-prompt.md](prompts/core/system-prompt.md).

Each session: read \`${DOC_ROOT_RULE}/context/always-on.md\` → \`${DOC_ROOT_RULE}/blueprint.md\` → role prompt via MCP \`agm_trigger_workflow\`.
EOF
    echo "  ↻ CLAUDE.md"
    ;;
  copilot)
    mkdir -p .github
    cat > .github/copilot-instructions.md <<EOF
# Architecture Graph Method (AGM)

Follow [prompts/core/system-prompt.md](../prompts/core/system-prompt.md).

Read \`${DOC_ROOT_RULE}/context/always-on.md\` and \`${DOC_ROOT_RULE}/blueprint.md\` at session start.
Use MCP \`agm_trigger_workflow\` or the Assistant UI for session prompts.
EOF
    echo "  ↻ .github/copilot-instructions.md"
    ;;
  generic|*)
    cat > AGENTS.md <<EOF
# AGM — ${PROJECT}

Core rules: [prompts/core/system-prompt.md](prompts/core/system-prompt.md)
Documentation: \`${DOC_ROOT_RULE}/\`
Workflows: MCP \`agm_trigger_workflow\` or AGM Assistant UI.
EOF
    echo "  ↻ AGENTS.md"
    ;;
esac

INSTALLED_LINE=""
if [[ -f .agm-install-meta ]]; then
  INSTALLED_LINE="installed=$(grep -E '^installed=' .agm-install-meta | tail -1 | cut -d= -f2- || true)"
fi

cat > .agm-install-meta <<EOF
project=${PROJECT}
doc_root=${DOC_ROOT}
template=$(read_meta template arc42)
ai_tool=${AI_TOOL}
doc_focus=${DOC_FOCUS}
pack=${PACK}
${INSTALLED_LINE}
upgraded=$(date -u +%Y-%m-%dT%H:%MZ)
agm_ref=${AGM_REF}
source=agm-upgrade
EOF

echo
echo "Done. Architecture documentation was not modified."
echo "  New workflows (e.g. content-ingest) are in prompts/workflows/."
echo "  Optional: link sources/ or use-cases/ from entry-point.md in a Continue session."
echo "  MCP users: update @abx-hh/agm-cli for compressed starter prompts."
echo "  Docs: docs/reference/upgrade.md"
