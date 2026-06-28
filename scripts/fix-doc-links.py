#!/usr/bin/env python3
"""Rewrite broken relative Markdown links under docs/ to resolvable paths."""
from __future__ import annotations

import os
import re
import sys
from pathlib import Path

LINK_RE = re.compile(r"\]\(([^)#]+)(\#[^)]*)?\)")

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"


def find_target(path_part: str) -> Path | None:
    p = Path(path_part.lstrip("./"))
    name = p.name

    if name == "guide.md":
        t = ROOT / "docs/guide.md"
        return t if t.exists() else None

    if "prompts/workflows" in path_part or path_part.startswith("../../prompts/workflows"):
        t = ROOT / "prompts/workflows" / name
        return t if t.exists() else None

    if "system-prompt" in path_part:
        t = ROOT / "prompts/core/system-prompt.md"
        return t if t.exists() else None

    if "templates/architecture" in path_part:
        idx = path_part.find("templates/architecture")
        t = ROOT / "docs" / path_part[idx:]
        return t if t.exists() else None

    # sample-app cross-service and src paths
    if "sample-app" in path_part or "-service/" in path_part or path_part.endswith(".ts"):
        suffix = path_part.replace("../", "")
        for hit in (ROOT / "docs/examples/sample-app").rglob(name):
            if hit.as_posix().endswith(suffix) or suffix in hit.as_posix():
                return hit
        parts = p.parts
        for n in range(len(parts), 0, -1):
            suffix = "/".join(parts[-n:])
            hits = [h for h in (ROOT / "docs/examples/sample-app").rglob("*") if h.as_posix().endswith(suffix)]
            if len(hits) == 1:
                return hits[0]

    if name == "ecosystem-index.md":
        t = ROOT / "docs/examples/sample-app/ecosystem-index.md"
        return t if t.exists() else None

    return None


def fix_file(md: Path) -> int:
    text = md.read_text(encoding="utf-8")
    changed = 0

    def repl(match: re.Match[str]) -> str:
        nonlocal changed
        path_part = match.group(1)
        anchor = match.group(2) or ""
        if path_part.startswith(("http://", "https://", "mailto:")):
            return match.group(0)
        resolved = (md.parent / path_part).resolve()
        if resolved.exists():
            return match.group(0)
        dest = find_target(path_part)
        if not dest or not dest.exists():
            return match.group(0)
        new_path = os.path.relpath(dest, md.parent).replace("\\", "/")
        changed += 1
        return f"]({new_path}{anchor})"

    new_text = LINK_RE.sub(repl, text)
    if new_text != text:
        md.write_text(new_text, encoding="utf-8")
    return changed


def main() -> int:
    total = 0
    for md in DOCS.rglob("*.md"):
        n = fix_file(md)
        if n:
            print(f"{md.relative_to(ROOT)}: {n} link(s)")
            total += n
    print(f"Total fixed: {total}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
