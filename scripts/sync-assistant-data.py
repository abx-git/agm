#!/usr/bin/env python3
"""Extract session prompts from prompts/workflows/*.md into docs/assistant/workflows.json."""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WF_DIR = ROOT / "prompts" / "workflows"
OUT = ROOT / "docs" / "assistant" / "workflows.json"
ADOPT_SRC = ROOT / "prompts" / "adopt-standalone.md"
ADOPT_PROC = ROOT / "prompts" / "reference" / "adopt-procedure.md"
ADOPT_OUT = ROOT / "docs" / "assistant" / "adopt-prompt.txt"

ROLE_GROUPS = {
    "bootstrap": "Bootstrap",
    "maintenance": "Maintenance",
    "architecture-work": "Architecture work",
    "review": "Review",
}


def table_field(text: str, name: str) -> str:
    m = re.search(rf"\*\*{re.escape(name)}\*\*\s*\|\s*(.+?)\s*\|", text)
    return m.group(1).strip() if m else ""


def parse_steps(prompt: str) -> list[str]:
    steps: list[str] = []
    in_instructions = False
    for line in prompt.splitlines():
        if re.match(r"^Instructions:\s*$", line.strip()):
            in_instructions = True
            continue
        if in_instructions:
            if re.match(r"^Output\s+\[\[ANCHOR:", line.strip()):
                break
            m = re.match(r"^\d+\.\s+(.+)$", line.strip())
            if m:
                steps.append(re.sub(r"\s+", " ", m.group(1)).strip())
            elif line.strip() and steps:
                steps[-1] = f"{steps[-1]} {line.strip()}"
    if steps:
        return steps

    body: list[str] = []
    skip_prefixes = ("AGM", "Blueprint Pattern", "Workflow:", "Role:", "Output ")
    for line in prompt.splitlines():
        stripped = line.strip()
        if not stripped:
            continue
        if any(stripped.startswith(p) for p in skip_prefixes):
            continue
        if stripped.startswith("Instructions:"):
            break
        if re.match(r"^[A-Za-z].+:\s*$", stripped) and "<" not in stripped:
            continue
        body.append(stripped)
    return body


def parse_placeholders(prompt: str) -> list[str]:
    return sorted(set(re.findall(r"<([^>]+)>", prompt)))


def fresh_chat_value(text: str) -> tuple[bool, str]:
    raw = table_field(text, "Fresh session")
    if not raw:
        return False, ""
    lower = raw.lower()
    required = "required" in lower
    return required, raw


def main() -> int:
    items = []
    for path in sorted(WF_DIR.glob("*.md")):
        if path.name == "ACTIVE.md":
            continue
        text = path.read_text(encoding="utf-8")
        role = table_field(text, "Role").strip("`")
        when = table_field(text, "When")
        prerequisite = table_field(text, "Prerequisite")
        fresh_chat, fresh_note = fresh_chat_value(text)
        block = re.search(r"## Session prompt\s+```\s*\n(.*?)```", text, re.S)
        prompt = block.group(1).strip() if block else ""
        anchors = sorted(set(re.findall(r"\[\[ANCHOR:([A-Z_]+)\]\]", prompt)))
        steps = parse_steps(prompt)
        placeholders = parse_placeholders(prompt)

        items.append(
            {
                "id": path.stem,
                "role": role,
                "group": ROLE_GROUPS.get(role, role),
                "when": when,
                "prerequisite": prerequisite,
                "freshChat": fresh_chat,
                "freshNote": fresh_note,
                "anchors": anchors,
                "steps": steps,
                "placeholders": placeholders,
                "prompt": prompt,
            }
        )

    OUT.write_text(json.dumps(items, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Wrote {len(items)} workflows to {OUT}")

    if ADOPT_SRC.is_file():
        text = ADOPT_SRC.read_text(encoding="utf-8")
        block = re.search(r"## Session prompt\s+```\s*\n(.*?)```", text, re.S)
        prompt = block.group(1).strip() if block else text.strip()
        if ADOPT_PROC.is_file():
            procedure = ADOPT_PROC.read_text(encoding="utf-8").strip()
            prompt = f"{prompt}\n\n---\n\n{procedure}"
        ADOPT_OUT.write_text(prompt + "\n", encoding="utf-8")
        print(f"Wrote adoption prompt to {ADOPT_OUT}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
