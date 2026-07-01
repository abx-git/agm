#!/usr/bin/env python3
"""Check docs/ Markdown links for CI.

Runs markdown-link-check in one batch (fast). On failure, re-checks reported
dead links on disk — Linux CI often returns HTTP 400 for existing non-.md files.
"""
from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
CONFIG = ROOT / ".mlc-config.json"
FILE_RE = re.compile(r"ERROR: \d+ dead links? found in (.+?) !")
DEAD_RE = re.compile(r"\[✖\] ([^\s]+) → Status: (\d+)")
SKIP_SCHEMES = re.compile(r"^(https?:|mailto:|tel:|data:|#)", re.I)


def resolve_link(from_file: Path, href: str) -> Path | None:
    href = href.strip()
    if not href or SKIP_SCHEMES.match(href):
        return None
    path_part = href.split("#", 1)[0]
    if not path_part:
        return None
    return (from_file.parent / path_part).resolve()


def run_batch() -> tuple[int, str]:
    cmd = (
        "find docs -name '*.md' -print0 | "
        "xargs -0 npx --yes markdown-link-check -c .mlc-config.json -q"
    )
    proc = subprocess.run(
        ["bash", "-c", cmd],
        cwd=ROOT,
        capture_output=True,
        text=True,
    )
    return proc.returncode, proc.stdout + proc.stderr


def parse_failures(output: str) -> list[tuple[Path, str, str]]:
    failures: list[tuple[Path, str, str]] = []
    current_file: Path | None = None

    for line in output.splitlines():
        file_match = FILE_RE.search(line)
        if file_match:
            current_file = ROOT / file_match.group(1)
            continue
        dead_match = DEAD_RE.search(line)
        if dead_match and current_file:
            failures.append((current_file, dead_match.group(1), dead_match.group(2)))

    return failures


def filter_real_failures(failures: list[tuple[Path, str, str]]) -> list[str]:
    real: list[str] = []
    for md, link, status in failures:
        resolved = resolve_link(md, link)
        if resolved and resolved.exists():
            continue
        real.append(f"{md.relative_to(ROOT)} → {link} (Status: {status})")
    return real


def main() -> int:
    file_count = len(list(DOCS.rglob("*.md")))
    code, output = run_batch()
    if code == 0:
        print(f"PASS — {file_count} markdown file(s) checked")
        return 0

    real = filter_real_failures(parse_failures(output))
    if not real:
        print(f"PASS — {file_count} markdown file(s) checked (filesystem fallback)")
        return 0

    print(f"ERROR: {len(real)} dead link(s) in docs/")
    for line in real:
        print(f"  [✖] {line}")
    return 1


if __name__ == "__main__":
    sys.exit(main())
