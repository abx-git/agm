# Blueprint Pattern — Kurzanleitung

> **Ziel:** Architektur-Doku im Repo, die ein KI-Agent **über Links** lesen und pflegen kann — ohne RAG, ohne externes Wiki.

**English:** [Quick start guide](./quick-start-guide.md)

Wenn dir zu viele Begriffe im Weg sind: **lies nur diese Seite**. Alles andere ist Vertiefung.

---

## Übersicht (das Wichtigste)

Du brauchst im Alltag **nur drei Dinge**:

| # | Was | Wo | Wie oft |
|---|-----|-----|---------|
| 1 | **Regeln für den Agenten** | `prompts/core/system-prompt.md` → in Cursor/Claude/Copilot | **Einmal** einrichten |
| 2 | **Dokumentation der App** | `docs/architecture/` (vor allem `blueprint.md`) | Laufend, versioniert in Git |
| 3 | **Aktuelle Aufgabe** | `prompts/workflows/ACTIVE.md` | **Pro Chat-Session** wechseln |

Alles Weitere (Rollen, arc42, Workflows, Branches) dient nur dazu, **Aufgabe 3** vorzubereiten — du musst die Konzepte nicht einzeln lernen.

```text
  Einmal                    Jede Session
  ──────                    ────────────
  Regeln (Kernprompt)  +    ACTIVE.md (was soll der Agent jetzt tun?)
         │                           │
         └───────────┬───────────────┘
                     ▼
              Agent arbeitet in docs/architecture/
                     │
                     ▼
              blueprint.md wird aktualisiert (Fortschritt, Log)
```

---

## Die fünf Aufgaben (Operationen)

So arbeitest du **in der Praxis** — nicht mehr Konzepte als diese Tabelle:

| Du willst … | Workflow-ID | Kurz |
|-------------|-------------|------|
| Doku **neu anlegen** | `bootstrap-init` | Erstes Mal |
| Doku **weiterschreiben** (arc42) | `bootstrap-continue` | Nächste offene Phase |
| Einzelne Kapitel **vertiefen** | `refinement` | z. B. nur Runtime |
| Doku nach **Code-Änderung** anpassen | `maintenance` | Mit `git diff` |
| **Frage / Analyse / Entwurf** | `architecture-work-*` | Ergebnis in `work/` |
| Doku **prüfen** (ohne Fix) | `review-*` | **Neuer** Chat |

Review immer in einer **frischen Session** — der Agent soll nur prüfen, nicht gleichzeitig schreiben.

---

## Einmal einrichten (ca. 30 Minuten)

1. **Kernprompt** aus [prompts/core/system-prompt.md](../prompts/core/system-prompt.md) in die IDE-Regeln kopieren (Cursor: `.cursor/rules/` — siehe [Base Context](../prompts/reference/base-context-setup.md)).
2. **Vorlagen** aus [docs/templates/architecture/](../docs/templates/architecture/) nach `docs/architecture/` in **deinem App-Repo** kopieren.
3. **`context/always-on.md`** ausfüllen (App-Name, wichtige Pfade).
4. Workflow aktivieren und Agent starten:

```bash
./scripts/bp-workflow.sh checkout bootstrap-init
```

Dann neuen Chat öffnen — der Agent liest `ACTIVE.md` und legt `blueprint.md` an.

---

## Jede weitere Session (3 Schritte)

1. **Workflow wählen** (eine Zeile):

```bash
./scripts/bp-workflow.sh checkout maintenance
```

Alternativ ohne Script: Inhalt aus [prompts/workflows/maintenance.md](../prompts/workflows/maintenance.md) in den Chat kopieren.

2. **Neuen Chat** starten (bei Review Pflicht).

3. Am Ende kurz prüfen: Hat der Agent `blueprint.md` und betroffene Dateien aktualisiert?

Workflows auflisten:

```bash
./scripts/bp-workflow.sh list
```

---

## Git checkout (optional)

Nur wenn du den aktiven Workflow **per Git** im Team teilen willst:

```bash
git fetch origin
git checkout origin/workflow/maintenance -- prompts/workflows/ACTIVE.md .cursor/rules/blueprint-active-workflow.mdc
```

Branches `workflow/*` erzeugen: `./scripts/setup-workflow-branches.sh` (einmalig, dann push).

Für den Einstieg reicht das **Script** — Git-Branches sind optional.

---

## Was liegt wo? (ein Ordner)

Alles Wichtige steckt unter **`docs/architecture/`** in deiner Anwendung:

| Datei/Ordner | Bedeutung |
|--------------|-----------|
| `blueprint.md` | Fortschritt, offene Arbeit, Session-Log |
| `entry-point.md` | Einstieg in die Doku (Übersicht) |
| `arc42/` (o. ä.) | Architektur-Kapitel (Template wählbar) |
| `interfaces/` | Schnittstellen rein/raus |
| `work/` | Fragen, Analysen, Designs, Review-Berichte |
| `prompts/role-*.md` | Detail-Schritte pro Aufgabentyp (vom Agenten gelesen) |

Im **Pattern-Repo** (dieses Repository) liegen die **Vorlagen** und die **Session-Texte** unter `prompts/workflows/`.

---

## Was du bewusst weglassen kannst

| Thema | Erst lesen wenn … |
|-------|-------------------|
| arc42 vs. c4-light vs. lean-service | du Bootstrap startest |
| Extensions, Compaction, Ops | System größer wird |
| Semantic Anchors (`[[ANCHOR:…]]`) | du CI/Automatisierung baust |
| [PROMPT.md](../PROMPT.md), [prompts/README.md](../prompts/README.md) | du Dateien einzeln suchst |

---

## Vertiefung

| Dokument | Inhalt |
|----------|--------|
| [Gen AI challenges (EN)](./gen-ai-challenges.md) | LLM-Probleme: Pattern vs. **Organisation** vs. **nicht lösbar** |
| [Artikel für Architekten (DE)](./article/de/blueprint-pattern-fuer-architekten.md) | Methode, Prinzipien |
| [Beispiel-App](./examples/sample-app/) | Fertiges `docs/architecture/` |
| [Architecture Work Guide](./architecture-work-guide.md) | Query / Analysis / Design |
| [prompts/README.md](../prompts/README.md) | Alle Workflow-IDs + Git-Details (EN) |

---

## Merksatz

**Ein Prompt für Verhalten, ein ACTIVE für die Aufgabe, ein Blueprint für den Stand** — der Rest ist Struktur in Markdown.
