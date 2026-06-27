#!/usr/bin/env python3
"""One-shot helper: inject Track / Activity / Mode into prompts/workflows/*.md headers."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WF_DIR = ROOT / "prompts" / "workflows"

META: dict[str, dict[str, str]] = {
    "bootstrap-adopt": {"track": "Build", "activity": "Communicate", "mode": "Direct", "head": "AGM — Build · Adopt"},
    "bootstrap-init": {"track": "Build", "activity": "Communicate", "mode": "Direct", "head": "AGM — Build · Init"},
    "bootstrap-continue": {"track": "Build", "activity": "Communicate", "mode": "Direct", "head": "AGM — Build · Continue"},
    "refinement": {"track": "Evolve", "activity": "Communicate", "mode": "Direct", "head": "AGM — Evolve · Refine"},
    "maintenance": {"track": "Evolve", "activity": "Sync", "mode": "Direct", "head": "AGM — Evolve · Sync"},
    "maintenance-diff-range": {"track": "Evolve", "activity": "Sync", "mode": "Direct", "head": "AGM — Evolve · Sync (git range)"},
    "architecture-work-query": {"track": "Architect", "activity": "Clarify", "mode": "Direct", "head": "AGM — Architect · Clarify"},
    "architecture-work-interrogate": {"track": "Architect", "activity": "Clarify", "mode": "Dialog", "head": "AGM — Architect · Clarify (dialog)"},
    "architecture-work-analysis": {"track": "Architect", "activity": "Evaluate", "mode": "Direct", "head": "AGM — Architect · Evaluate"},
    "architecture-work-sustainable-analysis": {"track": "Architect", "activity": "Evaluate", "mode": "Direct", "head": "AGM — Architect · Evaluate (sustainable)"},
    "architecture-work-sustainable-interrogate": {"track": "Architect", "activity": "Evaluate", "mode": "Dialog", "head": "AGM — Architect · Evaluate (dialog)"},
    "architecture-work-design": {"track": "Architect", "activity": "Design", "mode": "Direct", "head": "AGM — Architect · Design"},
    "architecture-work-continue": {"track": "Architect", "activity": "Continue", "mode": "Direct", "head": "AGM — Architect · Continue"},
    "domain-work-query": {"track": "Domain", "activity": "Clarify", "mode": "Direct", "head": "AGM — Domain · Clarify"},
    "domain-work-event-storm": {"track": "Domain", "activity": "Clarify", "mode": "Dialog", "head": "AGM — Domain · Clarify (dialog)"},
    "domain-work-context-map": {"track": "Domain", "activity": "Design", "mode": "Direct", "head": "AGM — Domain · Design"},
    "domain-work-design": {"track": "Domain", "activity": "Design", "mode": "Direct", "head": "AGM — Domain · Design"},
    "domain-work-subdomain-classification": {"track": "Domain", "activity": "Clarify", "mode": "Direct", "head": "AGM — Domain · Clarify"},
    "domain-work-integration-review": {"track": "Domain", "activity": "Evaluate", "mode": "Direct", "head": "AGM — Domain · Evaluate"},
    "domain-work-tactical-review": {"track": "Domain", "activity": "Evaluate", "mode": "Direct", "head": "AGM — Domain · Evaluate"},
    "domain-work-language-audit": {"track": "Domain", "activity": "Evaluate", "mode": "Direct", "head": "AGM — Domain · Evaluate"},
    "domain-work-continue": {"track": "Domain", "activity": "Continue", "mode": "Direct", "head": "AGM — Domain · Continue"},
    "review-phase": {"track": "Verify", "activity": "Evaluate", "mode": "Direct", "head": "AGM — Verify · Evaluate"},
    "review-milestone": {"track": "Verify", "activity": "Evaluate", "mode": "Direct", "head": "AGM — Verify · Evaluate (milestone)"},
    "review-maintenance": {"track": "Verify", "activity": "Evaluate", "mode": "Direct", "head": "AGM — Verify · Evaluate (post-sync)"},
}

TABLE_ROW = "| **{name}** | {value} |"


STANDARD_FIELDS = ("Track", "Activity", "Mode", "When", "Role", "Prerequisite", "Fresh session")


def parse_table_rows(table: str) -> dict[str, str]:
    rows: dict[str, str] = {}
    for m in re.finditer(r"\| \*\*([^*]+)\*\* \| (.+?) \|", table):
        rows[m.group(1).strip()] = m.group(2).strip()
    return rows


def build_table(rows: dict[str, str]) -> str:
    lines = ["| Field | Value |", "|-------|-------|"]
    seen: set[str] = set()
    for name in STANDARD_FIELDS:
        if name in rows:
            lines.append(TABLE_ROW.format(name=name, value=rows[name]))
            seen.add(name)
    for name, value in rows.items():
        if name not in seen:
            lines.append(TABLE_ROW.format(name=name, value=value))
    return "\n".join(lines) + "\n"


def main() -> int:
    for path in sorted(WF_DIR.glob("*.md")):
        if path.name == "ACTIVE.md":
            continue
        wid = path.stem
        if wid not in META:
            print(f"skip (no meta): {wid}")
            continue
        m = META[wid]
        text = path.read_text(encoding="utf-8")

        table_m = re.search(r"(\| Field \| Value \|\n(?:\|[-| ]+\|\n(?:\|[^\n]+\|\n)+))", text)
        if not table_m:
            print(f"skip (no table): {wid}")
            continue
        rows = parse_table_rows(table_m.group(1))
        for key in ("Track", "Activity", "Mode"):
            rows[key] = m[key.lower()]
        table = build_table(rows)
        text = text[: table_m.start(1)] + table + text[table_m.end(1) :]

        # normalize Role row for refinement
        text = re.sub(
            r"\| \*\*Role\*\* \| `bootstrap` \(same role file; scoped steps\) \|",
            "| **Role** | `bootstrap` |",
            text,
        )

        block = re.search(r"(## Session prompt\s+```\s*\n)(.*?)(```)", text, re.S)
        if block:
            prompt = block.group(2)
            prompt = re.sub(r"^AGM —[^\n]*\n", m["head"] + "\n", prompt, count=1)
            text = text[: block.start(2)] + prompt + text[block.end(2) :]

        path.write_text(text, encoding="utf-8")
        print(f"updated: {wid}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
