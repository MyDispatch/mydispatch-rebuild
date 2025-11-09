# MyDispatch - Vollständige Optimierungs-To-Do-Liste

**Datum:** 2025-11-09  
**Projekt:** MyDispatch Rebuild  
**Analyst:** Manus AI Agent

---

## Executive Summary

Diese To-Do-Liste fasst alle notwendigen Arbeitspakete zusammen, um das MyDispatch-Projekt in den SOLL-Zustand zu überführen. Die Aufgaben basieren auf einer umfassenden IST-Analyse und den erweiterten Optimierungsaufträgen. Die Priorisierung erfolgt nach dem Schema: **P1 (Kritisch)**, **P2 (Hoch)**, **P3 (Mittel)**, **P4 (Niedrig)**.

Die Umsetzung erfolgt in logischen, aufeinander aufbauenden Phasen, beginnend mit der fundamentalen Design-Harmonisierung, gefolgt von Code-Qualität, Security und Performance-Optimierungen.

---

## Phase 1: Design-System & Layout-Harmonisierung (P1 - Kritisch)

**Ziel:** Ein visuell und strukturell konsistentes, modernes und vollständig responsives UI/UX-Fundament schaffen. Dies ist die Voraussetzung für alle weiteren technischen Optimierungen.

| Task ID | Aufgabe | Details | Priorität |
|---|---|---|---|
| **DS-01** | **Layout-Harmonisierung nach `/rechnungen`-Vorlage** | Alle Dashboard-Seiten (Aufträge, Fahrer, Kunden etc.) müssen exakt die Struktur, Abstände und Komponenten-Anordnung der `/rechnungen`-Seite übernehmen. | **P1** |
| **DS-02** | **Mobile-Responsiveness systemweit herstellen** | Jede Seite, Komponente und Ansicht muss auf mobilen Geräten (Smartphones, Tablets) perfekt funktionieren. Kein horizontales Scrollen, keine Überlappungen. | **P1** |
| **DS-03** | **Design-Token-System durchsetzen** | Alle hardcodierten Farben (z.B. `bg-[#...])` und Inline-Styles (ca. 300 Vorkommen) müssen durch das bestehende Tailwind-Token-System (`bg-primary`, `text-foreground` etc.) ersetzt werden. | **P1** |
| **DS-04** | **Layout-Fehler systemweit korrigieren** | Behebung aller Inkonsistenzen bei Abständen, Paddings, Grids und visuellen Hierarchien auf allen Seiten. | **P1** |
| **DS-05** | **Hauptseiten-Layouts anpassen** | `/dashboard` und `/einstellungen` dürfen eine eigene Struktur haben, müssen aber die gleiche Design-DNA (Komponenten, Abstände, Typografie) wie der Rest des Systems verwenden. | **P2** |

---

## Phase 2: Code-Qualität & Refactoring (P2 - Hoch)

**Ziel:** Die Codebasis wartbarer, robuster und verständlicher machen. Reduzierung technischer Schulden.

| Task ID | Aufgabe | Details | Priorität |
|---|---|---|---|
| **CQ-01** | **1.186 ESLint-Probleme beheben** | Systematische Behebung aller Linter-Fehler und -Warnungen. | **P2** |
| **CQ-02** | **414 `any`-Typen durch konkrete Typen ersetzen** | Erhöhung der Typsicherheit durch Definition passender TypeScript-Interfaces und -Typen. | **P2** |
| **CQ-03** | **Große Dateien refactoren** | Aufteilung von überlangen Dateien wie `form-fields-registry.ts` (1.7k Zeilen) und `Auftraege.tsx` (1.6k Zeilen) in kleinere, wartbare Module und Komponenten. | **P2** |
| **CQ-04** | **Duplikate analysieren & konsolidieren** | Prüfung von Komponenten mit identischen Namen (z.B. `EmptyState.tsx`, `ErrorBoundary.tsx`) und Zusammenführung zu einer einzigen Quelle (Single Source of Truth). | **P2** |
| **CQ-05** | **`console.log` & `console.error` entfernen** | Entfernung aller 169 `console.log` und 76 `console.error` Statements aus dem Production-Code. Ersetzen durch einen geeigneten Logger falls nötig. | **P2** |
| **CQ-06** | **Relative Imports konvertieren** | Umwandlung der 42 verbleibenden relativen Imports (`../`) in absolute Pfade (`@/`) zur Verbesserung der Konsistenz. | **P3** |
| **CQ-07** | **Potenziell ungenutzte Dateien entfernen** | Analyse und Löschung von Code-Leichen und nicht mehr importierten Komponenten. | **P3** |

---

## Phase 3: Security & Dependencies (P2 - Hoch)

**Ziel:** Sicherheitslücken schließen und das Projekt auf einem aktuellen, stabilen Stand halten.

| Task ID | Aufgabe | Details | Priorität |
|---|---|---|---|
| **SEC-01**| **5 Security-Vulnerabilities beheben** | `npm audit fix` ausführen und die `xlsx`-Bibliothek durch eine sichere Alternative wie `exceljs` ersetzen, um die High-Severity-Lücke zu schließen. | **P2** |
| **SEC-02**| **Veraltete Dependencies aktualisieren (Minor)** | Durchführung sicherer Minor-Updates für Pakete wie `@supabase/supabase-js` und `@tanstack/react-query`. | **P2** |
| **SEC-03**| **Veraltete Dependencies aktualisieren (Major)** | Geplante und getestete Migration von Major-Versionen, insbesondere `react` (18→19), `react-router-dom` (6→7) und `openai` (4→6). | **P3** |

---

## Phase 4: Performance-Optimierung (P3 - Mittel)

**Ziel:** Lade- und Interaktionszeiten für den Endnutzer spürbar verbessern.

| Task ID | Aufgabe | Details | Priorität |
|---|---|---|---|
| **PERF-01**| **Bundle-Größe reduzieren (Code Splitting)** | Reduzierung des über 1 MB großen Haupt-Chunks durch dynamische Imports (`React.lazy`) für große Bibliotheken (z.B. `recharts`, PDF/Excel-Export). | **P3** |
| **PERF-02**| **Caching-Strategien optimieren** | Überprüfung und Implementierung von Caching-Strategien für statische Assets und API-Antworten über Vercel. | **P3** |
| **PERF-03**| **Tree-Shaking-Optimierung prüfen** | Sicherstellen, dass ungenutzter Code während des Build-Prozesses effektiv entfernt wird. | **P4** |

---

## Phase 5: Backend & CI/CD (P3 - Mittel)

**Ziel:** Stabile, zuverlässige Backend-Prozesse und eine reibungslose Continuous Integration Pipeline sicherstellen.

| Task ID | Aufgabe | Details | Priorität |
|---|---|---|---|
| **BE-01** | **Edge Functions aufräumen** | Analyse der 51 nicht-deployten Edge Functions. Löschen von veralteten Funktionen und Deployment der relevanten. | **P3** |
| **CI-01** | **CI/CD Branch-Konfiguration anpassen** | Korrektur der GitHub Actions Workflows, sodass sie auf dem korrekten `master`-Branch laufen (statt `main`). | **P3** |
| **BE-02** | **Supabase-Integration prüfen** | Überprüfung der Datenbank-Queries auf Effizienz und korrekte Nutzung von Indizes. | **P4** |

---

## Phase 6: Finale Tests & Dokumentation (P1 - Kritisch)

**Ziel:** Die vollständige Funktionalität und Qualität des Systems nach der Optimierung sicherstellen und alle Änderungen nachvollziehbar dokumentieren.

| Task ID | Aufgabe | Details | Priorität |
|---|---|---|---|
| **TEST-01**| **End-to-End-Tests durchführen** | Vollständige Tests aller kritischen User-Flows: Login/Logout, Registrierung, Auftragserstellung, Rechnungsstellung, Navigation. | **P1** |
| **TEST-02**| **Funktionale Tests** | Technische Überprüfung aller APIs, Edge Functions, Datenbankzugriffe und Deployments. | **P1** |
| **TEST-03**| **Responsive-Tests** | Manuelle und automatisierte Tests der UI auf verschiedenen Geräten und Bildschirmgrößen (Desktop, Tablet, Mobile). | **P1** |
| **DOC-01** | **Änderungen dokumentieren** | Lückenlose Dokumentation aller durchgeführten Änderungen im NeXify WiKi-kompatiblen Format. | **P1** |
| **DOC-02** | **Abschlussbericht erstellen** | Erstellung eines finalen Statusberichts mit einer Übersicht aller Änderungen und dem erreichten SOLL-Zustand. | **P1** |

---
