# steer.md and log.md

## steer.md

OKF `type: steer`. Sections:

- **Map** — relative links to chapters, reviews, rules
- **Now** — table: Owner | Task | Link (max 5 rows)

## log.md

One line per event:

`YYYY-MM-DD | type | path | note`

Configure in `.gitattributes`:

```gitattributes
docs/tekto/log.md merge=union
```

## Reviews

`reviews/<id>/findings.yaml`, optional `threads.yaml`, `report.md`

See `schemas/finding.schema.json` and `schemas/thread.schema.json`.