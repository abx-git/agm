#!/usr/bin/env python3
"""Extract session prompts from prompts/workflows/*.md into docs/assistant/workflows.json."""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WF_DIR = ROOT / "prompts" / "workflows"
OUT = ROOT / "docs" / "assistant" / "workflows.json"


def main() -> int:
    items = []
    for path in sorted(WF_DIR.glob("*.md")):
        if path.name == "ACTIVE.md":
            continue
        text = path.read_text(encoding="utf-8")
        role_m = re.search(r"\*\*Role\*\*\s*\|\s*`([^`]+)`", text)
        when_m = re.search(r"\*\*When\*\*\s*\|\s*(.+?)\s*\|", text)
        fresh_m = re.search(r"\*\*Fresh session\*\*\s*\|\s*\*\*(.+?)\*\*", text, re.I)
        block = re.search(r"## Session prompt\s+```\s*\n(.*?)```", text, re.S)
        prompt = block.group(1).strip() if block else ""
        anchors = sorted(set(re.findall(r"\[\[ANCHOR:([A-Z_]+)\]\]", prompt)))
        items.append(
            {
                "id": path.stem,
                "role": role_m.group(1) if role_m else "",
                "when": when_m.group(1).strip() if when_m else "",
                "freshChat": bool(fresh_m and "required" in fresh_m.group(1).lower()),
                "anchors": anchors,
                "prompt": prompt,
            }
        )

    OUT.write_text(json.dumps(items, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Wrote {len(items)} workflows to {OUT}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
