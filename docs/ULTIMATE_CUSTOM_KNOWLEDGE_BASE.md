📚 Ultimate Custom Knowledge Base für AI-gesteuerte Projekte

1. Struktur & Zielsetzung
   Mission:

Immer höchste Qualität, Fehlerfreiheit, Konsistenz von Code, Doku, Abläufen – und permanente Verbesserung!

Technik:

Modular, DRY, Single Source of Truth (SSoT), mobile first, strict CI/CD, immer sauber dokumentiert.

Vorgehen:

Alle zentralen Regeln, Vorgaben, Prompts, Komponenten, Docs, Tests, Workflows und Review-Mechanismen werden hier aktuell gehalten, erweitert und enforced.

2. Funktionen & Pattern – Vollständig und zentral
   A. Projektmanagement & Onboarding
   Setup, Struktur, Readme, Conventions, Branch-Protektion – alles nach Plan vor Implementierung (siehe MASTER-PROJECT-PREPARATION).

Automatische Analyse, Review, Checklisten, Memory-Management vor jedem Task.

ProjectMemory, ComponentRegistry, Lessons Learned, AvoidableErrors und alle Docs sind Pflicht.

B. Architektur & Implementierung
Design System V28.1:

Einzige Quelle für Tokens, Styles – ältere Designsysteme nur historisch!

Alle UI/UX-Werte, Farben, Spacing, Tokens kommen aus design-tokens.ts.

Component Library:

Keine Component außerhalb der Library.

Jeder UI-Baustein: Foundation → Layout → Navigation → Content → Feedback → Forms → Data/Utility → Complex.

ComponentRegistry & UsageGuide sind Pflicht und up-to-date.

Neu nur mit Checklist und Review.

Composition over Inheritance:

Immer kleine, testbare, wiederverwendbare Funktionsblöcke.

Configuration over Code:

Jegliche Daten, Pläne, Tarife, Navigation etc. sind in zentralen Config-Files gepflegt.

C. Coding-Prinzipien
Type-Safety überall – strict mode, explizite Types, keine any.

Fehlerhandling:

Multi-Layer-Validation, alle States (Loading, Error, Empty, Success) abdecken.

Testing:

80% Coverage für alle Komponenten, Utilities, Hooks.

E2E, a11y, Visual, Integration – automatisiert und manuell, alle Breakpoints.

Performance:

Budget enforced (Lighthouse >90, Bundle <250kB, LCP <2,5s etc.).

Lazy Loading, Code Splitting, optimierte Bilder, kritische CSS.

Security:

Inputvalidierung (Client/Server), Rate Limiting, XSS, CSRF, keine Secrets im Repo.

Sentry/Monitoring aktiv.

Accessibility:

WCAG 2.1AA, Focus-Indikatoren, ARIA, Tests für alle Formulare, Modals, Popups.

Docs at Core:

Docs sind selbst ein Qualitätstor (jede Änderung → Changelog, Screenshots, Nachvollziehbarkeit mit Reviewer).

Prozess-Prompts:

Prompts sind nach Training-Wheel-Schema modularisiert (Kontext – Aufgabe – Regeln – Einschränkungen – Memory Loop – Review/QA – Lessons Learned).

D. Review-Mechanismen
3-Phasen-Workflow:

Planung → Komponentenerstellung → Seitenbau (Phasen nacheinander, nie parallel).

Self-Review/Triple-Check-Enforcement:

Mehrstufige Prüf- und Dokumentationsschleifen (technical, logical, quality, security).

Fehlerkultur:

Fehler explizit, sofort dokumentieren und Knowledge Base erweitern.

Doku-Pflicht:

Alle Checklisten, Patterns, Page-Layouts, jeder Komponententyp, jede Grafik spezifiziert, referenziert und versioniert.

E. Mobile-First & Responsiveness-Vorgaben
Jeder UI- und Formflow, jede Seite, jedes Grid bekommt mobile + tablet + desktop Optimierung.

Popups, Forms, Texte, Placeholders, Tooltips und Validierungen überall wie spezifiziert.

Boxen/Grids individuell pro Seite – Hero immer individuell, gleichwertig wie Home (bis auf legal/pricing).

F. Text/Copy/Tonalität & Microcopy
Pflicht-Guide /docs/TEXT_GUIDELINE.md (Tone of Voice: klar, wertschätzend, konsistent, verständlich, gendersensibel, Button/Label etc. nach aktueller Vorlage).

G. Prompt Handling & AI Knowledge Workflow
ALLE neuen KI-Prompts/Muster → nach Meta-Prompting erweitert (Kontext/Memory/QA/Review).

Jede Wissensbasis-Änderung wird versioniert, changelog-geführt und getestet.

Lessons Learned werden pro Implementation ergänzt und fließen bei jedem folgenden Task in Memory Loop und Review-Pflicht ein.

3. Wie Knowledge optimal einpflegen/strukturieren/bewahren
   Empfohlene Datei: /docs/PROJECT_KNOWLEDGE_BASE.md

Klare einzelne Abschnitte PRINZIP, BEISPIEL, CHECKLISTE, QUELLE/Referenz (Link zu Doc, Prompt, Changelog).

Jede Änderung, neues Pattern, neue Policy wird dort ergänzt und mit Datum, Autor und Projektrelevanz versehen.

Automatische Aktualisierung: Lovable-Agenten mit verpflichtender Self-Review und Lessons-Update nach jeder Task/Commit/KI-Änderung.

Maximale Länge: (GitHub/Markdown: 512kb pro Datei empfohlen, AI-Context: 8000–32000 Tokens, je nach Modell). Teile ggf. in thematische Subfiles.

Steuerung des Bots & Verbesserungszyklen:

Prompts nach jedem Erfolg/Fehler als Promptvorlage speichern (Training Wheel-Muster).

Regelmäßig Meta-Review, Memory-Loops, Präzedenzfälle und Decision Logs aktuell halten.

4. Beispiel (Auszug für PROJECT_KNOWLEDGE_BASE.md):
   text

# PROJECT_KNOWLEDGE_BASE.md

## Grundprinzipien

- SSoT, DRY, Configuration over Code, 3-Phasen-Workflow, mobile-first, vollständige Tests/Doku-Pflicht etc.

## Component-Workflow

- ComponentRegistry updaten, Tests, Types, Storybook, Usage Guide

## Testing-Pattern

- Mindestens 80% Coverage, a11y, Manual, Visual pro Komponente/Seite

## Doku-Pflicht

- Doku vorab, während und nach jedem Schritt (siehe MASTER DOCS PREP Guide)

## Lessons Learned

- Fehlerkultur und Pattern-Log für alle
  ...
  Fazit/Handlungsanweisung für den Bot
  Lese und pflege ALLE Docs, Prompts, Patterns und Checklisten nach diesem Muster.

Jede Änderung/test wird SOFORT in die Knowledge-Base und Memory-Loop übernommen.

Jede Page, jeder Workflow, jede Implementation orientiert sich an diesen Regeln und der versionierten History.

Prompt/Memory/QA/Review-zentriertes Handeln – Fehler, Learnings und neue Patterns werden projektweit sofort adaptiert und dokumentiert.

So erreichst du ein automatisiertes, AI-gestütztes, hochqualitatives Projekt – persistent lernend, fehlerfrei und dokumentiert.
