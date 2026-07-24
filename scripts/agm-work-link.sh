#!/usr/bin/env bash
# AGM — link docs/.../spikes (preferred) or work/ to a directory outside the Git repository.
# Safe to re-run. Does not delete existing content.
set -euo pipefail

DOC_ROOT="docs/architecture/"
WORK_DIR=""
FORCE=0
LINK_NAME="process/spikes"

usage() {
  cat <<'EOF'
Usage: agm-work-link.sh --work-dir PATH [options]

Point <doc-root>/process/spikes (preferred) or <doc-root>/work at a local directory
outside the application Git repo so each developer can prepare AGM spikes
without committing drafts.

Options:
  --work-dir PATH   Absolute or relative path for real spike files (required)
  --doc-root PATH   Documentation root (default: docs/architecture/ or .agm-install-meta)
  --legacy-work     Symlink work/ instead of process/spikes (older graphs)
  --force           Replace an existing symlink that points elsewhere
  -h, --help        Show this help

Example:
  ./agm-work-link.sh --work-dir "$HOME/agm-work/my-app/spikes"
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
    echo "# AGM — local spikes/work directory (symlink target outside repo)"
    echo "$pattern"
  } >> "$gi"
  echo "  + ${gi} ← ${pattern}"
}

write_work_location() {
  local doc_root="$1"
  local work_abs="$2"
  local link_name="$3"
  local dest="${doc_root}work-location.md"
  cat > "$dest" <<EOF
---
type: architecture-meta
title: "External ${link_name} directory"
description: "Local ${link_name}/ lives outside Git via symlink"
timestamp: "$(date -u +%Y-%m-%dT%H:%MZ)"
---

# External ${link_name} directory

Architecture / Domain spikes (or legacy work reports) are written under [\`${link_name}/\`](./${link_name}/) as usual.
On this machine, \`${link_name}/\` is a **symlink** to a directory **outside** the Git repository:

\`\`\`
${work_abs}
\`\`\`

Each developer creates their own link (see AGM docs \`docs/reference/external-work.md\`).

**Do not commit** draft spike files. Promote shared conclusions into template sections or copy selected folders into a real in-repo \`${link_name}/\` before merge.
EOF
  echo "  → ${dest}"
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --work-dir) WORK_DIR="$2"; shift 2 ;;
    --doc-root) DOC_ROOT="$2"; shift 2 ;;
    --legacy-work) LINK_NAME="work"; shift ;;
    --force) FORCE=1; shift ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown option: $1"; usage; exit 1 ;;
  esac
done

if [[ -z "$WORK_DIR" ]]; then
  usage
  exit 1
fi

if [[ -f .agm-install-meta ]]; then
  DOC_ROOT="$(norm_doc_root "$(read_meta doc_root "$DOC_ROOT")")"
else
  DOC_ROOT="$(norm_doc_root "$DOC_ROOT")"
fi

LINK_PATH="${DOC_ROOT}${LINK_NAME}"
TARGET="$(abs_path "$WORK_DIR")"

echo "AGM work-link"
echo "  Doc root:  ${DOC_ROOT}"
echo "  Link:      ${LINK_PATH} → ${TARGET}"

mkdir -p "$DOC_ROOT"
mkdir -p "$(dirname "$LINK_PATH")"

if [[ -L "$LINK_PATH" ]]; then
  current="$(readlink "$LINK_PATH" || true)"
  if [[ "$current" == "$TARGET" ]]; then
    echo "  · Symlink already correct"
  elif [[ "$FORCE" -eq 1 ]]; then
    rm "$LINK_PATH"
    ln -s "$TARGET" "$LINK_PATH"
    echo "  → Replaced symlink"
  else
    echo "ERROR: ${LINK_PATH} is a symlink to ${current}."
    echo "       Pass --force to retarget, or remove it manually."
    exit 1
  fi
elif [[ -d "$LINK_PATH" ]]; then
  echo "  Moving existing ${LINK_NAME}/ contents into external directory…"
  # shellcheck disable=SC2086
  shopt -s dotglob nullglob
  for item in "${LINK_PATH}"/*; do
    base="$(basename "$item")"
    if [[ -e "${TARGET}/${base}" ]]; then
      echo "  · skip ${base} (already in target)"
    else
      mv "$item" "$TARGET/"
      echo "  → moved ${base}"
    fi
  done
  shopt -u dotglob nullglob
  rmdir "$LINK_PATH" 2>/dev/null || {
    echo "ERROR: could not replace ${LINK_PATH} (not empty after move)."
    exit 1
  }
  ln -s "$TARGET" "$LINK_PATH"
  echo "  → Created symlink"
elif [[ -e "$LINK_PATH" ]]; then
  echo "ERROR: ${LINK_PATH} exists and is not a directory or symlink."
  exit 1
else
  ln -s "$TARGET" "$LINK_PATH"
  echo "  → Created symlink"
fi

# Seed template if empty spikes target
if [[ "$LINK_NAME" == "spikes" && ! -f "${TARGET}/README.md" ]]; then
  mkdir -p "${TARGET}/_template/boards"
  if [[ -f "${DOC_ROOT}../" ]]; then :; fi
fi

ensure_gitignore "${DOC_ROOT}${LINK_NAME}/"
write_work_location "$DOC_ROOT" "$TARGET" "$LINK_NAME"

echo "Done."
