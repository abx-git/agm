#!/usr/bin/env bash
# AGM — link docs/.../work to a directory outside the Git repository.
# Safe to re-run. Does not delete work content.
set -euo pipefail

DOC_ROOT="docs/architecture/"
WORK_DIR=""
FORCE=0

usage() {
  cat <<'EOF'
Usage: agm-work-link.sh --work-dir PATH [options]

Point <doc-root>/work at a local directory outside the application Git repo
so each developer can prepare AGM work items without committing drafts.

Options:
  --work-dir PATH   Absolute or relative path for real work files (required)
  --doc-root PATH   Documentation root (default: docs/architecture/ or .agm-install-meta)
  --force           Replace an existing symlink that points elsewhere
  -h, --help        Show this help

Example:
  ./agm-work-link.sh --work-dir "$HOME/agm-work/my-app/work"
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

abs_path() {
  local p="$1"
  if [[ "$p" != /* ]]; then
    p="$(pwd)/${p#./}"
  fi
  mkdir -p "$p"
  (cd "$p" && pwd)
}

ensure_gitignore() {
  local pattern="$1"
  local gi=".gitignore"
  if [[ -f "$gi" ]] && grep -qxF "$pattern" "$gi" 2>/dev/null; then
    echo "  · ${gi} already ignores ${pattern}"
    return
  fi
  {
    echo ""
    echo "# AGM — local work directory (symlink target outside repo)"
    echo "$pattern"
  } >> "$gi"
  echo "  + ${gi} ← ${pattern}"
}

write_work_location() {
  local doc_root="$1"
  local work_abs="$2"
  local dest="${doc_root}work-location.md"
  cat > "$dest" <<EOF
---
type: architecture-meta
title: "External work directory"
description: "Local work/ lives outside Git via symlink"
timestamp: "$(date -u +%Y-%m-%dT%H:%MZ)"
---

# External work directory

Architecture / Domain work reports are written under [\`work/\`](./work/) as usual.
On this machine, \`work/\` is a **symlink** to a directory **outside** the Git repository:

\`\`\`
${work_abs}
\`\`\`

Each developer creates their own link (see [external-work](../../prompts/reference/external-work.md) if installed, or AGM docs \`docs/reference/external-work.md\`).

**Do not commit** draft work files. Promote shared conclusions into template sections or copy selected files into a real in-repo \`work/\` before merge.
EOF
  echo "  → ${dest}"
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --work-dir) WORK_DIR="$2"; shift 2 ;;
    --doc-root) DOC_ROOT="$2"; shift 2 ;;
    --force) FORCE=1; shift ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown option: $1" >&2; usage >&2; exit 1 ;;
  esac
done

if [[ -z "$WORK_DIR" ]]; then
  echo "--work-dir is required." >&2
  usage >&2
  exit 1
fi

if [[ -f .agm-install-meta ]]; then
  DOC_ROOT="$(read_meta doc_root "$DOC_ROOT")"
fi
DOC_ROOT="$(norm_doc_root "$DOC_ROOT")"
LINK_PATH="${DOC_ROOT}work"
WORK_ABS="$(abs_path "$WORK_DIR")"
WORK_ABS="${WORK_ABS%/}"

echo "AGM external work link"
echo "  Doc root:  ${DOC_ROOT}"
echo "  Link:      ${LINK_PATH}"
echo "  Target:    ${WORK_ABS}"
echo

mkdir -p "$WORK_ABS"

if [[ -L "$LINK_PATH" ]]; then
  current="$(readlink "$LINK_PATH" || true)"
  if [[ "$current" == "$WORK_ABS" ]]; then
    echo "  · symlink already correct"
  elif [[ "$FORCE" -eq 1 ]]; then
    rm -f "$LINK_PATH"
    ln -sfn "$WORK_ABS" "$LINK_PATH"
    echo "  ↻ symlink replaced → ${WORK_ABS}"
  else
    echo "Existing symlink ${LINK_PATH} → ${current}" >&2
    echo "Re-run with --force to point at ${WORK_ABS}" >&2
    exit 1
  fi
elif [[ -d "$LINK_PATH" ]]; then
  echo "  Moving existing work/ contents into external directory…"
  # Move everything including hidden files except . and ..
  shopt -s dotglob nullglob
  for item in "$LINK_PATH"/*; do
    base="$(basename "$item")"
    dest="${WORK_ABS}/${base}"
    if [[ -e "$dest" ]]; then
      echo "  · keep existing ${dest}"
      rm -rf "$item"
    else
      mv "$item" "$dest"
      echo "  → moved ${base}"
    fi
  done
  shopt -u dotglob nullglob
  rmdir "$LINK_PATH" 2>/dev/null || rm -rf "$LINK_PATH"
  ln -sfn "$WORK_ABS" "$LINK_PATH"
  echo "  → symlink ${LINK_PATH} → ${WORK_ABS}"
elif [[ -e "$LINK_PATH" ]]; then
  echo "Refusing to replace non-directory ${LINK_PATH}" >&2
  exit 1
else
  mkdir -p "$(dirname "$LINK_PATH")"
  ln -sfn "$WORK_ABS" "$LINK_PATH"
  echo "  → symlink ${LINK_PATH} → ${WORK_ABS}"
fi

ensure_gitignore "${LINK_PATH%/}"
# Also ignore trailing-slash form used by some tools
ensure_gitignore "${DOC_ROOT}work/"
ensure_gitignore ".agm/work-dir"
write_work_location "$DOC_ROOT" "$WORK_ABS"

# Record in install meta (machine-local path — ok; gitignore work symlink)
if [[ -f .agm-install-meta ]]; then
  if grep -qE '^work_dir=' .agm-install-meta 2>/dev/null; then
    # portable in-place replace
    tmp="$(mktemp)"
    grep -vE '^work_dir=' .agm-install-meta > "$tmp"
    echo "work_dir=${WORK_ABS}" >> "$tmp"
    mv "$tmp" .agm-install-meta
  else
    echo "work_dir=${WORK_ABS}" >> .agm-install-meta
  fi
  echo "  → .agm-install-meta work_dir="
else
  cat > .agm-install-meta <<EOF
doc_root=${DOC_ROOT}
work_dir=${WORK_ABS}
source=agm-work-link
EOF
  echo "  → .agm-install-meta (created)"
fi

mkdir -p .agm
if [[ -f .agm/config.json ]]; then
  # light touch: write sibling local file to avoid breaking JSON without jq
  echo "$WORK_ABS" > .agm/work-dir
else
  printf '{\n  "docRoot": "%s",\n  "workDir": "%s"\n}\n' "${DOC_ROOT}" "$WORK_ABS" > .agm/config.json
fi
echo "  → .agm/work-dir"

# Ensure templates exist in external dir when empty of templates
if [[ ! -f "${WORK_ABS}/_template.md" ]]; then
  echo "  Tip: copy work templates from AGM install, or re-run agm-install / agm scaffold,"
  echo "       then re-run this script so templates land in the external directory."
fi

echo
echo "Done. Agents keep writing to ${LINK_PATH}/… (resolves outside Git)."
echo "Docs: docs/reference/external-work.md"
