# 🧭 Dokumentationspflege-Policy (Ohne Jira)
Status: Production-Ready  
Version: 1.1.0  
Datum: 2025-11-10  
Autor: Team MyDispatch

## Zusammenfassung
Die Pflege der Dokumentation erfolgt Repository-nativ ohne Jira. Änderungen werden zeitnah, konsistent und nachvollziehbar nach MD-2024 dokumentiert.

## Details
1) Regelmäßige Aktualisierung: Jede relevante Code-/Architektur-/Prozessänderung sofort dokumentieren.  
2) Struktur & Formate: Vorlagen gemäß `docs/README.md` und MD-2024 nutzen.  
3) Qualitätskontrollen: Vollständigkeit, Richtigkeit, Konsistenz, optional Doc-Validation.  
4) Änderungen dokumentieren: Versionserhöhung, Changelog-Eintrag, Referenzen ergänzen.  
5) Versionierung & Archivierung: Semver, Changelogs (Root & Docs), Archivierung unter `docs/archive/`.

## Validierung
- Audit-Trail: Metadaten, doppelte Changelogs, Conventional Commits, PR-Beschreibungen, Master-Index.

## Referenzen
- `docs/README.md`
- `docs/MASTER_INDEX_V18.5.1.md`
- `CHANGELOG.md`, `docs/CHANGELOG.md`
- `docs/archive/`

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

