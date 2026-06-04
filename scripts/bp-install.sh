#!/usr/bin/env bash
# Blueprint Pattern — install prompts and documentation scaffold (no git clone).
set -euo pipefail

BP_REF="${BP_REF:-main}"
BP_REPO="https://raw.githubusercontent.com/abx-git/blueprint-pattern/${BP_REF}"

DOC_ROOT="docs/architecture"
TEMPLATE="arc42"
PROJECT="My Application"
AI_TOOL="cursor"

usage() {
  cat <<'EOF'
Usage: bp-install.sh [options]

Install Blueprint Pattern files into the current repository via HTTPS (raw GitHub).
No git clone of blueprint-pattern required.

Options:
  --doc-root PATH   Documentation root (default: docs/architecture/)
  --template NAME   arc42 | c4-light | adr-first | lean-service | custom
  --project NAME    Application / project label (metadata only)
  --ai-tool NAME    cursor | claude | copilot | generic
  --bp-ref REF      Git ref on abx-git/blueprint-pattern (default: main)
  -h, --help        Show this help

Environment overrides: DOC_ROOT, TEMPLATE, PROJECT, AI_TOOL, BP_REF
EOF
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
    --bp-ref) BP_REF="$2"; BP_REPO="https://raw.githubusercontent.com/abx-git/blueprint-pattern/${BP_REF}"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown option: $1" >&2; usage >&2; exit 1 ;;
  esac
done

DOC_ROOT="$(norm_doc_root "$DOC_ROOT")"

if ! command -v curl >/dev/null 2>&1; then
  echo "curl is required." >&2
  exit 1
fi

fetch() {
  local remote_path="$1"
  local dest="$2"
  mkdir -p "$(dirname "$dest")"
  curl -fsSL "${BP_REPO}/${remote_path}" -o "$dest"
}

echo "Blueprint Pattern install"
echo "  Project:   ${PROJECT}"
echo "  Doc root:  ${DOC_ROOT}"
echo "  Template:  ${TEMPLATE}"
echo "  AI tool:   ${AI_TOOL}"
echo "  Source:    ${BP_REPO}"
echo

# --- Shared scaffold (from pattern templates) ---
SHARED=(
  "docs/templates/architecture/context/always-on.md|${DOC_ROOT}context/always-on.md"
  "docs/templates/architecture/context/on-demand.md|${DOC_ROOT}context/on-demand.md"
  "docs/templates/architecture/prompts/role-bootstrap.md|${DOC_ROOT}prompts/role-bootstrap.md"
  "docs/templates/architecture/prompts/role-maintenance.md|${DOC_ROOT}prompts/role-maintenance.md"
  "docs/templates/architecture/prompts/role-architecture-work.md|${DOC_ROOT}prompts/role-architecture-work.md"
  "docs/templates/architecture/prompts/role-review.md|${DOC_ROOT}prompts/role-review.md"
  "docs/templates/architecture/work/_template.md|${DOC_ROOT}work/_template.md"
  "docs/templates/architecture/work/_template-review.md|${DOC_ROOT}work/_template-review.md"
  "docs/templates/architecture/interfaces/exports.md|${DOC_ROOT}interfaces/exports.md"
  "docs/templates/architecture/interfaces/imports.md|${DOC_ROOT}interfaces/imports.md"
)

PROMPTS=(
  "prompts/core/system-prompt.md|prompts/core/system-prompt.md"
  "prompts/reference/adopt-procedure.md|prompts/reference/adopt-procedure.md"
  "prompts/reference/blueprint-format.md|prompts/reference/blueprint-format.md"
)

WORKFLOWS=(
  bootstrap-adopt bootstrap-continue bootstrap-init
  architecture-work-query architecture-work-analysis architecture-work-design architecture-work-continue
  maintenance maintenance-diff-range refinement
  review-phase review-milestone review-maintenance
)

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
      local pairs=(
        "introduction|Introduction and Goals"
        "constraints|Constraints"
        "context|Context and Scope"
        "solution-strategy|Solution Strategy"
        "building-blocks|Building Block View"
        "runtime|Runtime View"
        "deployment|Deployment View"
        "concepts|Cross-cutting Concepts"
        "quality|Quality Requirements"
        "risks|Risks and Technical Debt"
        "glossary|Glossary"
      )
      for pair in "${pairs[@]}"; do
        ch="${pair%%|*}"
        title="${pair##*|}"
        dest="${DOC_ROOT}arc42/${ch}.md"
        mkdir -p "$(dirname "$dest")"
        if [[ ! -f "$dest" ]]; then
          echo "  → ${dest} (stub)"
          printf '# %s\n\n<!-- Fill during Bootstrap — evidence only -->\n' "$title" > "$dest"
        fi
      done
      mkdir -p "${DOC_ROOT}arc42/decisions"
      if [[ ! -f "${DOC_ROOT}arc42/decisions/README.md" ]]; then
        echo "  → ${DOC_ROOT}arc42/decisions/README.md (stub)"
        printf '# Architecture decisions\n\n<!-- ADRs during Bootstrap -->\n' > "${DOC_ROOT}arc42/decisions/README.md"
      fi
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

# --- AI tool wiring ---
DOC_ROOT_RULE="${DOC_ROOT%/}"

write_cursor_rules() {
  mkdir -p .cursor/rules
  cat > .cursor/rules/blueprint-pattern.mdc <<EOF
---
description: Blueprint Pattern — core system prompt
alwaysApply: true
---

Follow the Blueprint Pattern core prompt in [prompts/core/system-prompt.md](../../prompts/core/system-prompt.md).

Human-in-the-loop scribe only. Read order: always-on.md → blueprint.md → role prompt.
Paths: \`${DOC_ROOT_RULE}/\` · Session prompts: paste from Assistant UI or \`prompts/workflows/\`.
Output semantic anchors before stopping.
EOF

  cat > .cursor/rules/blueprint-context.mdc <<EOF
---
description: Blueprint Pattern — context and governance
alwaysApply: true
---

# Blueprint Pattern — Context Rules

1. Read \`${DOC_ROOT_RULE}/context/always-on.md\`
2. Read \`${DOC_ROOT_RULE}/blueprint.md\`
3. Load \`${DOC_ROOT_RULE}/prompts/role-<role>.md\` from the session prompt

Invariants: relative Markdown links only; human-in-the-loop; traceable claims.
On stop: update \`blueprint.md\`, session log, [[ANCHOR:LINK_CHECK]].
EOF
  echo "  → .cursor/rules/blueprint-pattern.mdc"
  echo "  → .cursor/rules/blueprint-context.mdc"
}

write_claude() {
  cat > CLAUDE.md <<EOF
# ${PROJECT} — Blueprint Pattern

Follow [prompts/core/system-prompt.md](prompts/core/system-prompt.md).

Each session: read \`${DOC_ROOT_RULE}/context/always-on.md\` → \`${DOC_ROOT_RULE}/blueprint.md\` → role prompt from the pasted workflow.
EOF
  echo "  → CLAUDE.md"
}

write_copilot() {
  mkdir -p .github
  cat > .github/copilot-instructions.md <<EOF
# Blueprint Pattern

Follow [prompts/core/system-prompt.md](../prompts/core/system-prompt.md).

Read \`${DOC_ROOT_RULE}/context/always-on.md\` and \`${DOC_ROOT_RULE}/blueprint.md\` at session start.
Paste workflow prompts from the Assistant UI or \`prompts/workflows/\`.
EOF
  echo "  → .github/copilot-instructions.md"
}

write_generic() {
  cat > AGENTS.md <<EOF
# Blueprint Pattern — ${PROJECT}

Core rules: [prompts/core/system-prompt.md](prompts/core/system-prompt.md)
Documentation: \`${DOC_ROOT_RULE}/\`
Session prompts: \`prompts/workflows/\` or Blueprint Pattern Assistant UI.
EOF
  echo "  → AGENTS.md"
}

case "$AI_TOOL" in
  cursor) write_cursor_rules ;;
  claude) write_claude ;;
  copilot) write_copilot ;;
  generic|*) write_generic ;;
esac

cat > .bp-install-meta <<EOF
project=${PROJECT}
doc_root=${DOC_ROOT}
template=${TEMPLATE}
ai_tool=${AI_TOOL}
installed=$(date -u +%Y-%m-%dT%H:%MZ)
bp_ref=${BP_REF}
EOF

echo
echo "Done. Next:"
echo "  1. Open Blueprint Pattern Assistant → Build → Adopt (copy session prompt)."
echo "  2. New chat in this repo — agent creates blueprint.md, entry-point.md, first section."
echo "  3. Do not re-run install if ${DOC_ROOT}blueprint.md already exists."
