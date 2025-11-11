# 🧭 Dokumentationspflege-Policy (Ohne Jira)
Status: ✅ Production-Ready
Version: 1.1.0
Datum: 2025-11-10
Autor: Engineering

## Zusammenfassung
Diese Policy verankert die fortlaufende Pflege der Dokumentation ohne Jira. Änderungen werden repository‑nativ erfasst und nachvollziehbar dokumentiert (Metadaten, doppelte Changelogs, Master‑Index, Conventional Commits). Die Policy gilt repository‑weit und ist verbindlich für alle Rollen.

## Details
1) Regelmäßige Aktualisierung
- Projekt- und Fachdokumente werden bei jeder relevanten Code-, Architektur- oder Prozessänderung sofort aktualisiert.
- Betroffene Dateien müssen konsistent sein (Quellen, Referenzen, Versionen).

2) Struktur & Formate einhalten
- Vorlagen und Struktur gemäß `docs/README.md` und bestehenden Master-Dokumenten verwenden.
- MD-2024-Template nutzen (Titel, Status, Version, Datum, Zusammenfassung, Validierung, Referenzen).

3) Qualitätskontrollen
- Vollständigkeit: alle betroffenen Abschnitte aktualisiert.
- Richtigkeit: Inhalte stimmen mit Code/Prozess überein.
- Konsistenz: Cross-Referenzen und Indizes gepflegt (z. B. `docs/MASTER_INDEX_V18.5.1.md`).
- Validierung: Bei Bedarf Doc-Validation aus `docs/DOKUMENTATIONS_SYSTEM_ANALYSE_V18.5.1.md` nutzen.

4) Änderungen dokumentieren
- Änderungen und Entscheidungen werden direkt im betroffenen Dokument nachvollziehbar vermerkt (Versionserhöhung + Changelog-Eintrag).
- Relevante Referenzen (Code-Pfade, andere Docs) ergänzen.

5) Versionierung & Archivierung
- Semantische Versionierung beibehalten.
- Changelogs pflegen: `CHANGELOG.md` (Root) und `docs/CHANGELOG.md`.
- Archivierung älterer Versionen in `docs/archive/` mit Datumsstempel.

## Ohne Jira: Audit-Trail und Nachvollziehbarkeit
Da keine Jira-Einträge erfolgen, wird die Nachvollziehbarkeit über repository‑native Mechanismen sichergestellt:
- Dokumenten-Metadaten in jedem Markdown (Status, Version, Datum, Autor).
- Changelogs: `CHANGELOG.md` (Root) + `docs/CHANGELOG.md` mit klaren Einträgen.
- Git: Commit-Messages im Conventional-Commits-Format und PR-Beschreibungen.
- Pfad-Referenzen: betroffene Dateien/Ordner im Dokument explizit verlinken.
- Indizes: relevante Dokumente im `docs/MASTER_INDEX_V18.5.1.md` registrieren.

Beispiel Conventional Commit:
`docs: add DOCUMENTATION_MAINTENANCE_POLICY v1.1.0 (no Jira flow)`

## MD-2024 Template (Kurzform)
```
# [Dokumenttitel]
Status: [Draft|Production-Ready]
Version: [x.y.z]
Datum: [YYYY-MM-DD]
Autor: [Name]

## Zusammenfassung
[Kurze Beschreibung der Änderung / Entscheidung]

## Details
[Technische / prozessuale Details]

## Validierung
[Prüfschritte, Metriken, Testergebnisse, ggf. Doc-Validation Output]

## Referenzen
- [Dateipfade, Spezifikationen, verwandte Dokumente]
```

## Maschinenlesbar
```json
{
  "documentation_policy": {
    "no_jira": true,
    "update_required_on_change": true,
    "templates": ["MD-2024"],
    "audit_trail": {
      "docs_metadata": true,
      "root_changelog": "CHANGELOG.md",
      "docs_changelog": "docs/CHANGELOG.md",
      "git_conventional_commits": true,
      "pr_descriptions": true,
      "master_index": "docs/MASTER_INDEX_V18.5.1.md"
    },
    "quality_controls": {
      "completeness": true,
      "accuracy": true,
      "consistency": true,
      "doc_validation_supported": true
    },
    "archiving": {
      "path": "docs/archive/",
      "timestamped_versions": true
    }
  }
}
```

## Validierung
- Policy ist MD‑2024-konform und repository‑weit verlinkt.
- Cross‑References: `docs/README.md` (Link), `docs/MASTER_INDEX_V18.5.1.md` (Registrierung), `docs/CHANGELOG.md` + Root `CHANGELOG.md` (Einträge).
- Keine Geheimnisse, rein prozessuale Inhalte.

## Referenzen
- `docs/README.md` – Dokumentationshub & Strukturen
- `docs/DOKUMENTATIONS_SYSTEM_ANALYSE_V18.5.1.md` – Doc‑Validation & Konsolidierung
- `docs/MASTER_INDEX_V18.5.1.md` – Single Source of Truth für Docs
- `CHANGELOG.md`, `docs/CHANGELOG.md` – Änderungen & Versionen
- `docs/archive/` – Archivierungsort

