#!/usr/bin/env bash
# AGM — install prompts and documentation scaffold (no git clone).
set -euo pipefail

AGM_REF="${AGM_REF:-main}"
AGM_REPO="https://raw.githubusercontent.com/abx-git/agm/${AGM_REF}"

DOC_ROOT="docs/architecture"
TEMPLATE="arc42"
PROJECT="My Application"
AI_TOOL="cursor"
DOC_FOCUS=""
INSTALL_DOMAIN=0
INSTALL_FULL=0

usage() {
  cat <<'EOF'
Usage: agm-install.sh [options]

Install AGM files into the current repository via HTTPS (raw GitHub).
No git clone of agm required.

Default installs the golden path only (7 workflows + core roles).
Architect/Domain packs are opt-in.

Options:
  --doc-root PATH   Documentation root (default: docs/architecture/)
  --template NAME   arc42 | c4-light | adr-first | lean-service | custom
  --project NAME    Application / project label (metadata only)
  --ai-tool NAME    cursor | claude | copilot | generic
  --focus IDS       Comma-separated doc focus (see docs/reference/doc-extensions.md)
  --domain          Also install Domain/DDD scaffold + domain workflows
  --full            Install all workflows + Domain pack (Assistant Advanced)
  --agm-ref REF     Git ref on abx-git/agm (default: main)
  -h, --help        Show this help

Environment overrides: DOC_ROOT, TEMPLATE, PROJECT, AI_TOOL, DOC_FOCUS, AGM_REF,
  AGM_INSTALL_DOMAIN=1, AGM_INSTALL_FULL=1
EOF
}

focus_has() {
  local id="$1"
  [[ ",${DOC_FOCUS}," == *",${id},"* ]]
}

norm_doc_root() {
  local r="$1"
  r="${r%/}"
  [[ -n "$r" ]] || r="docs/architecture"
  echo "${r}/"
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --doc-root) DOC_ROOT="$2"; shift 2 ;;
    --template) TEMPLATE="$2"; shift 2 ;;
    --project) PROJECT="$2"; shift 2 ;;
    --ai-tool) AI_TOOL="$2"; shift 2 ;;
    --focus) DOC_FOCUS="$2"; shift 2 ;;
    --domain) INSTALL_DOMAIN=1; shift ;;
    --full) INSTALL_FULL=1; INSTALL_DOMAIN=1; shift ;;
    --agm-ref) AGM_REF="$2"; AGM_REPO="https://raw.githubusercontent.com/abx-git/agm/${AGM_REF}"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown option: $1" >&2; usage >&2; exit 1 ;;
  esac
done

if [[ "${AGM_INSTALL_FULL:-}" == "1" ]]; then
  INSTALL_FULL=1
  INSTALL_DOMAIN=1
fi
if [[ "${AGM_INSTALL_DOMAIN:-}" == "1" ]]; then
  INSTALL_DOMAIN=1
fi

DOC_ROOT="$(norm_doc_root "$DOC_ROOT")"

if ! command -v curl >/dev/null 2>&1; then
  echo "curl is required." >&2
  exit 1
fi

fetch() {
  local remote_path="$1"
  local dest="$2"
  mkdir -p "$(dirname "$dest")"
  if ! curl -fsSL "${AGM_REPO}/${remote_path}" -o "$dest"; then
    echo "Failed to download: ${AGM_REPO}/${remote_path}" >&2
    exit 1
  fi
}

PACK="golden"
if [[ "$INSTALL_FULL" -eq 1 ]]; then
  PACK="full"
elif [[ "$INSTALL_DOMAIN" -eq 1 ]]; then
  PACK="domain"
fi

echo "AGM install"
echo "  Project:   ${PROJECT}"
echo "  Doc root:  ${DOC_ROOT}"
echo "  Template:  ${TEMPLATE}"
echo "  AI tool:   ${AI_TOOL}"
echo "  Doc focus: ${DOC_FOCUS:-(none)}"
echo "  Pack:      ${PACK}"
echo "  Source:    ${AGM_REPO}"
echo

# Normalize comma-separated focus (no spaces)
DOC_FOCUS="$(echo "$DOC_FOCUS" | tr -d ' ')"

# --- Shared scaffold (golden path) ---
SHARED=(
  "docs/templates/architecture/index.md|${DOC_ROOT}index.md"
  "docs/templates/architecture/log.md|${DOC_ROOT}log.md"
  "docs/templates/architecture/context/always-on.md|${DOC_ROOT}context/always-on.md"
  "docs/templates/architecture/context/on-demand.md|${DOC_ROOT}context/on-demand.md"
  "docs/templates/architecture/prompts/role-bootstrap.md|${DOC_ROOT}prompts/role-bootstrap.md"
  "docs/templates/architecture/prompts/role-maintenance.md|${DOC_ROOT}prompts/role-maintenance.md"
  "docs/templates/architecture/prompts/role-review.md|${DOC_ROOT}prompts/role-review.md"
  "docs/templates/architecture/work/_template.md|${DOC_ROOT}work/_template.md"
  "docs/templates/architecture/work/_template-review.md|${DOC_ROOT}work/_template-review.md"
  "docs/templates/architecture/interfaces/exports.md|${DOC_ROOT}interfaces/exports.md"
  "docs/templates/architecture/interfaces/imports.md|${DOC_ROOT}interfaces/imports.md"
)

PROMPTS=(
  "prompts/core/system-prompt.md|prompts/core/system-prompt.md"
  "docs/reference/adopt-procedure.md|prompts/reference/adopt-procedure.md"
  "docs/reference/blueprint-format.md|prompts/reference/blueprint-format.md"
  "docs/reference/doc-extensions.md|prompts/reference/doc-extensions.md"
  "docs/reference/content-ingest.md|prompts/reference/content-ingest.md"
)

# Golden path — default install
WORKFLOWS=(
  bootstrap-adopt bootstrap-continue
  refinement content-ingest maintenance-diff-range
  review-maintenance review-phase
)

DOMAIN_WORKFLOWS=(
  domain-work-query domain-work-design domain-work-continue domain-work-event-storm
  domain-work-context-map domain-work-subdomain-classification domain-work-integration-review
  domain-work-tactical-review domain-work-language-audit
)

if [[ "$INSTALL_FULL" -eq 1 || "$INSTALL_DOMAIN" -eq 1 ]]; then
  SHARED+=(
    "docs/templates/architecture/prompts/role-architecture-work.md|${DOC_ROOT}prompts/role-architecture-work.md"
  )
fi

if [[ "$INSTALL_DOMAIN" -eq 1 ]]; then
  SHARED+=(
    "docs/templates/architecture/prompts/role-domain-work.md|${DOC_ROOT}prompts/role-domain-work.md"
    "docs/templates/architecture/work/_template-domain.md|${DOC_ROOT}work/_template-domain.md"
  )
  PROMPTS+=(
    "docs/reference/ddd-guardrails.md|prompts/reference/ddd-guardrails.md"
    "docs/reference/ddd-work-report-formats.md|prompts/reference/ddd-work-report-formats.md"
  )
fi

if [[ "$INSTALL_FULL" -eq 1 ]]; then
  WORKFLOWS+=(
    bootstrap-init
    architecture-work-query architecture-work-analysis architecture-work-design architecture-work-continue
    architecture-work-interrogate architecture-work-sustainable-analysis architecture-work-sustainable-interrogate
    maintenance review-milestone
  )
  WORKFLOWS+=("${DOMAIN_WORKFLOWS[@]}")
elif [[ "$INSTALL_DOMAIN" -eq 1 ]]; then
  WORKFLOWS+=("${DOMAIN_WORKFLOWS[@]}")
fi

for entry in "${SHARED[@]}" "${PROMPTS[@]}"; do
  remote="${entry%%|*}"
  dest="${entry##*|}"
  echo "  → ${dest}"
  fetch "$remote" "$dest"
done

for wf in "${WORKFLOWS[@]}"; do
  dest="prompts/workflows/${wf}.md"
  echo "  → ${dest}"
  fetch "prompts/workflows/${wf}.md" "$dest"
done

# --- Template-specific folders ---
install_template_files() {
  local t="$1"
  case "$t" in
    c4-light)
      local files=(context.md containers.md components.md decisions/README.md)
      for f in "${files[@]}"; do
        dest="${DOC_ROOT}c4-light/${f}"
        echo "  → ${dest}"
        fetch "docs/templates/architecture/c4-light/${f}" "$dest"
      done
      fetch "docs/templates/architecture/c4-light/decisions/001-template.md" "${DOC_ROOT}c4-light/decisions/001-template.md"
      ;;
    adr-first)
      local files=(context.md views.md decisions/README.md)
      for f in "${files[@]}"; do
        dest="${DOC_ROOT}adr-first/${f}"
        echo "  → ${dest}"
        fetch "docs/templates/architecture/adr-first/${f}" "$dest"
      done
      fetch "docs/templates/architecture/adr-first/decisions/001-template.md" "${DOC_ROOT}adr-first/decisions/001-template.md"
      ;;
    lean-service)
      local files=(overview.md runtime.md decisions/README.md)
      for f in "${files[@]}"; do
        dest="${DOC_ROOT}lean-service/${f}"
        echo "  → ${dest}"
        fetch "docs/templates/architecture/lean-service/${f}" "$dest"
      done
      fetch "docs/templates/architecture/lean-service/decisions/001-template.md" "${DOC_ROOT}lean-service/decisions/001-template.md"
      ;;
    arc42)
      local files=(
        introduction constraints context solution-strategy building-blocks
        runtime deployment concepts quality risks glossary
      )
      for f in "${files[@]}"; do
        dest="${DOC_ROOT}arc42/${f}.md"
        echo "  → ${dest}"
        fetch "docs/templates/architecture/arc42/${f}.md" "$dest"
      done
      fetch "docs/templates/architecture/arc42/decisions/README.md" "${DOC_ROOT}arc42/decisions/README.md"
      ;;
    custom)
      mkdir -p "${DOC_ROOT}${TEMPLATE}"
      echo "  → ${DOC_ROOT}${TEMPLATE}/ (empty — define phases in blueprint.md)"
      ;;
    *)
      echo "Unknown template: ${t}" >&2
      exit 1
      ;;
  esac
}

install_template_files "$TEMPLATE"

install_ops_file() {
  local file="$1"
  local dest="${DOC_ROOT}ops/${file}"
  echo "  → ${dest}"
  fetch "docs/templates/architecture/ops/${file}" "$dest"
}

install_focus_extensions() {
  [[ -n "$DOC_FOCUS" ]] || return 0
  if focus_has operations; then
    echo "Installing ops/ (operations focus)…"
    install_ops_file "pitfalls.md"
    install_ops_file "environments.md"
    install_ops_file "troubleshooting.md"
    install_ops_file "runbooks/_template.md"
  else
    if focus_has deployment; then
      echo "  → ${DOC_ROOT}ops/environments.md (deployment focus)"
      fetch "docs/templates/architecture/ops/environments.md" "${DOC_ROOT}ops/environments.md"
    fi
    if focus_has observability; then
      echo "  → ${DOC_ROOT}ops/troubleshooting.md (observability focus)"
      fetch "docs/templates/architecture/ops/troubleshooting.md" "${DOC_ROOT}ops/troubleshooting.md"
    fi
  fi
  if focus_has ecosystem; then
    dest="${DOC_ROOT}ecosystem-index.md"
    if [[ ! -f "$dest" ]]; then
      echo "  → ${dest} (ecosystem stub)"
      printf '# Ecosystem index\n\n<!-- Partner services: link to partner entry-point.md and exports.md -->\n\n| Service | Entry | Exports |\n|---------|-------|--------|\n| — | — | — |\n' > "$dest"
    fi
  fi
  if focus_has external-sources; then
    echo "Installing sources/ (external-sources focus)…"
    for f in index.md log.md _template.md; do
      dest="${DOC_ROOT}sources/${f}"
      echo "  → ${dest}"
      fetch "docs/templates/architecture/sources/${f}" "$dest"
    done
  fi
  if focus_has use-cases; then
    echo "Installing use-cases/ (use-cases focus)…"
    for f in index.md _template.md; do
      dest="${DOC_ROOT}use-cases/${f}"
      echo "  → ${dest}"
      fetch "docs/templates/architecture/use-cases/${f}" "$dest"
    done
  fi
}

install_focus_extensions

install_domain_scaffold() {
  echo "Installing domain/ (DDD scaffold)…"
  local domain_files=(
    "README.md"
    "context-map.md"
    "subdomains.md"
    "events.md"
    "contexts/_template/model.md"
    "contexts/_template/language.md"
  )
  for f in "${domain_files[@]}"; do
    dest="${DOC_ROOT}domain/${f}"
    echo "  → ${dest}"
    fetch "docs/templates/architecture/domain/${f}" "$dest"
  done
}

if [[ "$INSTALL_DOMAIN" -eq 1 ]]; then
  install_domain_scaffold
fi

# --- AI tool wiring ---
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
Paths: \`${DOC_ROOT_RULE}/\` · Session prompts: paste from Assistant UI or \`prompts/workflows/\`.
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
3. Load \`${DOC_ROOT_RULE}/prompts/role-<role>.md\` from the session prompt

Invariants: relative Markdown links only; human-in-the-loop; traceable claims; OKF frontmatter with mandatory type; index.md and log.md at each level.
On stop: update \`blueprint.md\`, \`log.md\`, OKF timestamps, [[ANCHOR:LINK_CHECK]].
EOF
  echo "  → .cursor/rules/agm.mdc"
  echo "  → .cursor/rules/agm-context.mdc"
}

write_claude() {
  cat > CLAUDE.md <<EOF
# ${PROJECT} — Architecture Graph Method (AGM)

Follow [prompts/core/system-prompt.md](prompts/core/system-prompt.md).

Each session: read \`${DOC_ROOT_RULE}/context/always-on.md\` → \`${DOC_ROOT_RULE}/blueprint.md\` → role prompt from the pasted workflow.
EOF
  echo "  → CLAUDE.md"
}

write_copilot() {
  mkdir -p .github
  cat > .github/copilot-instructions.md <<EOF
# Architecture Graph Method (AGM)

Follow [prompts/core/system-prompt.md](../prompts/core/system-prompt.md).

Read \`${DOC_ROOT_RULE}/context/always-on.md\` and \`${DOC_ROOT_RULE}/blueprint.md\` at session start.
Paste workflow prompts from the Assistant UI or \`prompts/workflows/\`.
EOF
  echo "  → .github/copilot-instructions.md"
}

write_generic() {
  cat > AGENTS.md <<EOF
# AGM — ${PROJECT}

Core rules: [prompts/core/system-prompt.md](prompts/core/system-prompt.md)
Documentation: \`${DOC_ROOT_RULE}/\`
Session prompts: \`prompts/workflows/\` or AGM Assistant UI.
EOF
  echo "  → AGENTS.md"
}

case "$AI_TOOL" in
  cursor) write_cursor_rules ;;
  claude) write_claude ;;
  copilot) write_copilot ;;
  generic|*) write_generic ;;
esac

cat > .agm-install-meta <<EOF
project=${PROJECT}
doc_root=${DOC_ROOT}
template=${TEMPLATE}
ai_tool=${AI_TOOL}
doc_focus=${DOC_FOCUS}
pack=${PACK}
installed=$(date -u +%Y-%m-%dT%H:%MZ)
agm_ref=${AGM_REF}
EOF

echo
echo "Done. Next:"
echo "  1. Open AGM Assistant → Build → Adopt (copy session prompt)."
echo "  2. New chat in this repo — agent creates blueprint.md, entry-point.md, first section."
echo "  3. Do not re-run install if ${DOC_ROOT}blueprint.md already exists — use agm-upgrade.sh instead."
if [[ "$INSTALL_FULL" -eq 0 ]]; then
  echo "  Tip: re-run with --domain or --full for Architect/Domain packs (Assistant Advanced)."
fi
