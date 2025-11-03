# 📚 MyDispatch Dokumentation

> **Zentrale Anlaufstelle für alle Projekt-Dokumentationen**  
> **Version:** 18.5.0  
> **Letzte Aktualisierung:** 2025-01-26

---

## 🚀 Quick Start

Neu im Projekt? Starte hier:

1. [Setup Guide](./01-GETTING-STARTED/Setup.md) - Installation & Konfiguration
2. [Quick Reference](./01-GETTING-STARTED/Quick-Reference.md) - Die wichtigsten Commands
3. [Architecture Overview](./02-ARCHITECTURE/Overview.md) - System-Architektur verstehen

---

## 📁 Dokumentations-Struktur

### 🟢 01-GETTING-STARTED
**Für neue Entwickler und Quick Reference**

- [Setup.md](./01-GETTING-STARTED/Setup.md) - Installation, Dependencies, erste Schritte
- [Quick-Reference.md](./01-GETTING-STARTED/Quick-Reference.md) - Commands, Shortcuts, häufige Tasks

### 🔵 02-ARCHITECTURE
**System-Design und technische Architektur**

- [Overview.md](./02-ARCHITECTURE/Overview.md) - Gesamt-Architektur
- [Design-System.md](./02-ARCHITECTURE/Design-System.md) - UI/UX Design System (konsolidiert aus 10+ Docs)
- [Component-Library.md](./02-ARCHITECTURE/Component-Library.md) - Component Guidelines
- [Database-Schema.md](./02-ARCHITECTURE/Database-Schema.md) - Supabase Schema & RLS

### 🟡 03-DEVELOPMENT
**Entwicklungs-Guidelines und Best Practices**

- [Coding-Standards.md](./03-DEVELOPMENT/Coding-Standards.md) - Code Style & Conventions (konsolidiert aus 15+ Docs)
- [Testing.md](./03-DEVELOPMENT/Testing.md) - E2E, Unit Tests, Test Strategy
- [Deployment.md](./03-DEVELOPMENT/Deployment.md) - CI/CD, Production Deployment
- [Performance.md](./03-DEVELOPMENT/Performance.md) - Performance Optimierung

### 🔴 04-GOVERNANCE
**Legal, Security, Compliance**

- [Legal-Compliance.md](./04-GOVERNANCE/Legal-Compliance.md) - DSGVO, AI-Act, TMG
- [Security.md](./04-GOVERNANCE/Security.md) - Security Best Practices, RLS
- [Quality-Gates.md](./04-GOVERNANCE/Quality-Gates.md) - Automatische Quality Checks

### 🟣 05-ARCHIVE
**Alte Versionen und Legacy-Dokumentation**

- `v18.5.x/` - Archivierte Docs aus Version 18.5.x (~300 Docs)
- `v18.4.x/` - Archivierte Docs aus Version 18.4.x
- `deprecated/` - Veraltete Docs (nicht mehr relevant)

---

## 🔍 Dokumentation finden

### Nach Thema suchen

| Thema | Dokument |
|-------|----------|
| Design System | [02-ARCHITECTURE/Design-System.md](./02-ARCHITECTURE/Design-System.md) |
| Testing | [03-DEVELOPMENT/Testing.md](./03-DEVELOPMENT/Testing.md) |
| DSGVO | [04-GOVERNANCE/Legal-Compliance.md](./04-GOVERNANCE/Legal-Compliance.md) |
| Deployment | [03-DEVELOPMENT/Deployment.md](./03-DEVELOPMENT/Deployment.md) |
| Components | [02-ARCHITECTURE/Component-Library.md](./02-ARCHITECTURE/Component-Library.md) |

### Nach Rolle

**👨‍💻 Developer (Neue Teammitglieder):**
1. Setup.md
2. Coding-Standards.md
3. Component-Library.md

**🎨 Designer:**
1. Design-System.md
2. Component-Library.md

**🚀 DevOps:**
1. Deployment.md
2. Security.md

**⚖️ Legal/Compliance:**
1. Legal-Compliance.md
2. Quality-Gates.md

---

## 📝 Dokumentations-Prinzipien

### DRY (Don't Repeat Yourself)
- **Ein Thema = Ein Master-Doc**
- Keine Duplikate, keine redundanten Infos
- Verlinkungen statt Copy-Paste

### Up-to-Date
- Jedes Doc hat Versionsnummer
- Alte Versionen → Archive
- Regelmäßige Reviews (quartalsweise)

### Suchbar
- Klare Überschriften
- Inhaltsverzeichnisse in jedem Doc
- Konsistente Struktur

---

## 🔄 Migration V18.5.0 → V18.5.1

### Was wurde geändert?

**VORHER (V18.5.0):**
- 322 Dokumentations-Dateien
- 11.527 Überschriften
- Massive Redundanz
- Keine klare Struktur

**NACHHER (V18.5.1):**
- 13 Master-Dokumentationen
- Klare 5-Kategorien-Struktur
- ~300 Docs ins Archiv verschoben
- DRY-Prinzip durchgesetzt

### Alte Docs finden

Alle alten Docs (V18.5.0) wurden nach `05-ARCHIVE/v18.5.x/` verschoben und bleiben lesbar, aber sind nicht mehr aktiv gepflegt.

---

## 📊 Dokumentations-Status

| Kategorie | Docs | Status |
|-----------|------|--------|
| Getting Started | 2 | ✅ Complete |
| Architecture | 4 | 🚧 In Progress |
| Development | 4 | 🚧 In Progress |
| Governance | 3 | 🚧 In Progress |
| Archive | ~300 | 📦 Archiviert |

**Gesamt:** 13 aktive Master-Docs + ~300 archivierte

---

## 🆘 Hilfe & Support

**Fragen zur Dokumentation?**
- GitHub Issues mit Label `documentation`
- Team-Chat im `#docs` Channel

**Fehler gefunden?**
- Pull Request mit Korrektur
- Oder Issue erstellen

---

## 📚 Externe Ressourcen

- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Playwright Docs](https://playwright.dev)

---

**END OF README**

---

## 📝 Changelog

### V18.5.1 (2025-01-26)
- **BREAKING:** Dokumentations-Restrukturierung (322 → 13 Master-Docs)
- Neue 5-Kategorien-Struktur
- ~300 Docs archiviert
- Setup.md + Quick-Reference.md erstellt
- DRY-Prinzip implementiert
