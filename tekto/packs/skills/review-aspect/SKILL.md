---
name: tekto-review-aspect
description: Einen Tekto-Prüfaspekt durchgehen und findings.yaml mit Belegen füllen.
---

# Prüfen — Aspekt (Tekto)

1. Lade den Aspekt aus `packs/aspects/` oder `docs/tekto/aspects/`.
2. Beantworte jede Frage nur mit belegten Aussagen.
3. Schreibe `docs/tekto/reviews/<review-id>/findings.yaml` (Schema: Tekto finding).
4. Pro Befund: `id`, `aspect`, `severity`, `claim`, `evidence[]`, optional `rule`, `confidence`, `status: open`.
5. `log.md` aktualisieren; `steer.md` ## Now den nächsten Aspekt zeigen.

Autor-Chat: kein Review desselben Inhalts im selben Chat.