# Blueprint Pattern — Leitfaden

Architektur-Dokumentation als **Markdown-Link-Graph** in `docs/architecture/`, mit KI-Agenten gepflegt, in Git versioniert. Kein RAG, kein externes Wiki.

**English:** [Guide](../guide.md) · **Beispiel:** [sample-app](../examples/sample-app/)

---

## Begriffe (einmal lesen)

| Begriff | Bedeutung |
|---------|-----------|
| **Graph** | Verlinkte Doku: `entry-point.md`, Template-Ordner (z. B. `arc42/`), `interfaces/`, `work/`, `ops/` |
| **`blueprint.md`** | **Backlog** der Doku-Arbeit: Phasen, WRK, Reviews, Session-Log — nicht die gesamte Architektur |
| **Blueprint Pattern** | Gesamtes Verfahren: Graph + Operationen + Agenten-Regeln |
| **Kernprompt** | Dauerhaftes Agenten-Verhalten → [prompts/core/system-prompt.md](../../prompts/core/system-prompt.md) |
| **Workflow** | Aufgabe dieses Chats → [ACTIVE.md](../../prompts/workflows/ACTIVE.md) via `bp-workflow.sh` |
| **Rolle** | Fachliche Schritte → `docs/architecture/prompts/role-*.md` (liest der Agent; du wählst nur den Workflow) |

```text
Kernregeln (einmal) + ACTIVE (pro Chat) → Agent → docs/architecture/ → blueprint.md aktualisieren
```

---

## Alltag: drei Dinge

| # | Was | Wo |
|---|-----|-----|
| 1 | Agenten-Regeln | `prompts/core/system-prompt.md` in IDE-Regeln |
| 2 | Architektur-Inhalt | `docs/architecture/` im App-Repo |
| 3 | Aktuelle Aufgabe | `./scripts/bp-workflow.sh checkout <id>` → `ACTIVE.md` |

---

## Operationen

| Ziel | Workflow | Neuer Chat |
|------|----------|------------|
| Doku anlegen | `bootstrap-init` | Ja |
| arc42 fortsetzen | `bootstrap-continue` | Ja |
| Bereich vertiefen | `refinement` | Ja |
| Nach Code-Änderung | `maintenance` (+ `git diff`) | Ja |
| Frage | `architecture-work-query` | Ja |
| Analyse | `architecture-work-analysis` | Ja |
| Entwurf | `architecture-work-design` | Ja |
| Offene WRK | `architecture-work-continue` | Ja |
| Prüfen (ohne Fix) | `review-phase` / `review-milestone` / `review-maintenance` | **Pflicht** |

```bash
./scripts/bp-workflow.sh list
./scripts/bp-workflow.sh checkout maintenance
```

Workflow-Dateien: [prompts/workflows/](../../prompts/workflows/). Optional: `ACTIVE.md` committen, damit das Team dieselbe Aufgabe nutzt.

---

## Einrichtung (einmal, ~30 Min.)

1. [docs/templates/architecture/](../../docs/templates/architecture/) → `docs/architecture/` in der App kopieren.
2. `docs/architecture/context/always-on.md` ausfüllen.
3. [Kernprompt](../../prompts/core/system-prompt.md) in Cursor / Claude / Copilot ([Tools](../../prompts/reference/base-context-setup.md)).
4. `checkout bootstrap-init` → neuer Chat → Agent legt `blueprint.md` an.
5. [CI Link-Check](../../prompts/reference/ci-integrity.md) im App-Repo aktivieren.

**Template** (in `entry-point.md`): `arc42` (Standard) · `c4-light` · `adr-first` · `lean-service` · `custom`.

---

## Jede Session

1. `checkout <workflow>`
2. Neuer Chat (Review nie im Schreib-Chat)
3. Am Ende `blueprint.md` und geänderte Dateien prüfen

**Compaction:** nach langen Sessions (≥2 Phasen, ≥15 Dateien, ≥30 Züge) neuen Chat; im Session-Log in `blueprint.md` weitermachen.

---

## Struktur in der App

```
docs/architecture/
├── blueprint.md      ← Fortschritt & Session-Log
├── entry-point.md
├── context/          ← always-on.md, on-demand.md
├── prompts/          ← role-*.md
├── work/             ← Fragen, Analysen, Designs, Reviews
├── interfaces/
├── ops/
└── arc42/            ← oder c4-light/, adr-first/, lean-service/
```

Architecture Work: nur **Links** traversieren; `work/YYYY-MM-DD-<slug>.md`; `WRK-NNN` in `blueprint.md`; arc42 verlinken, nicht duplizieren.

---

## Mechanismen (im Verfahren enthalten)

| Mechanismus | Zweck |
|-------------|--------|
| `always-on.md` | Stabile App-Fakten jede Session |
| Rollen | Gleiche Schritte pro Operation; Workflows variieren die Aufgabe |
| Review (neuer Chat, nur Bericht) | Erzeugen und Prüfen trennen |
| `ops/` | Runbooks und Pitfalls neben arc42 |
| Semantic Anchors | Session-Checkliste (`[[ANCHOR:LINK_CHECK]]`, …) |
| CI Link-Check | Kaputte relative Links scheitern im PR |

---

## Optional vertiefen

| Dokument | Wann |
|----------|------|
| [Gen AI challenges (EN)](../gen-ai-challenges.md) | LLM-Grenzen, Organisation |
| [Artikel Architekten](../article/de/blueprint-pattern-fuer-architekten.md) | Prinzipien |
| [Migration arc42-only](../migration-arc42-only.md) | Umbenennung bestehender Doku |
| [Blueprint-Format](../../prompts/reference/blueprint-format.md) | Schema `blueprint.md` |

---

**Merksatz:** Ein Kernprompt, ein ACTIVE pro Chat, ein Graph unter `docs/architecture/`, `blueprint.md` für den Stand.
