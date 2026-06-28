# Advanced documentation templates

Default adopt choices: **`arc42`** (multi-module systems) or **`lean-service`** (single service). Record the selected template in `entry-point.md`.

These templates are supported but not shown first in the Assistant UI — use when the default pair does not fit.

---

## c4-light

**When:** C4 views are the primary documentation model; lighter than full arc42.

**Layout:** `c4-light/context.md`, `components.md`, `decisions/`

**From arc42:** Copy [templates/c4-light/](../templates/architecture/c4-light/) via install with `--template c4-light`. Remap existing C4 content from arc42 context/runtime sections.

---

## adr-first

**When:** Decision records drive the graph; views are secondary.

**Layout:** `adr-first/context.md`, `decisions/`, `views.md`

**From arc42:** Copy [templates/adr-first/](../templates/architecture/adr-first/). Migrate existing ADRs from `arc42/decisions/` if present.

---

## custom

**When:** Internal standard with its own folder name.

**Install:** `--template custom` plus a custom folder name in the Assistant UI. Create template stubs under `<doc-root>/<your-name>/` and align `blueprint.md` phase rows.

---

## Switching templates

1. Record rationale in `entry-point.md` ## Documentation template.
2. Update `blueprint.md` phase table to new paths — do not delete old sections until content is migrated and reviewed.
3. Run **Verify** in a fresh chat after migration.

See also [Upgrading](../guide.md#upgrading) in the guide (arc42-only wording migration).

---

## Example vocabulary (not AGM defaults)

Project-specific standards sometimes appear in **arc42 sample projects** only:

- PlantUML + C4-PlantUML diagrams
- Pugh decision matrices
- Six-part quality attribute scenarios (QAS)

Label these as **example vocabulary for arc42 projects** — not required by AGM.
