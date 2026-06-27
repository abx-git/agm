#!/usr/bin/env python3
"""Validate OKF YAML frontmatter on architecture Markdown files."""

from __future__ import annotations

import re
import sys
from pathlib import Path

FRONTMATTER = re.compile(r"^---\s*\n(.*?)\n---\s*\n", re.DOTALL)
TYPE_FIELD = re.compile(r"^type:\s*(.+?)\s*$", re.MULTILINE)

DEFAULT_PATHS = [
    "docs/templates/architecture",
]


def check_file(path: Path) -> tuple[bool, str]:
    text = path.read_text(encoding="utf-8")
    match = FRONTMATTER.match(text)
    if not match:
        return False, "missing YAML frontmatter bounded by ---"
    frontmatter = match.group(1)
    type_match = TYPE_FIELD.search(frontmatter)
    if not type_match:
        return False, "missing required field: type"
    value = type_match.group(1).strip().strip('"').strip("'")
    if not value:
        return False, "empty type field"
    return True, value


def collect_md_files(root: Path) -> list[Path]:
    return sorted(p for p in root.rglob("*.md") if p.is_file())


def main(argv: list[str]) -> int:
    repo = Path(__file__).resolve().parents[1]
    paths = [Path(p) for p in (argv[1:] if len(argv) > 1 else DEFAULT_PATHS)]
    errors: list[str] = []

    for rel in paths:
        root = rel if rel.is_absolute() else repo / rel
        if not root.exists():
            print(f"skip (missing): {root.relative_to(repo)}")
            continue
        for md in collect_md_files(root):
            ok, detail = check_file(md)
            rel_path = md.relative_to(repo)
            if ok:
                print(f"ok  {rel_path}  type={detail}")
            else:
                errors.append(f"{rel_path}: {detail}")

    if errors:
        print("\nOKF frontmatter check FAILED:", file=sys.stderr)
        for err in errors:
            print(f"  - {err}", file=sys.stderr)
        return 1

    print("\nOKF frontmatter check passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
