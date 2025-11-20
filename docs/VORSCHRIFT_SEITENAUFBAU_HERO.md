# 🎯 VORSCHRIFT: Hero-Sektion Seitenaufbau V31.5

> **⚠️ KRITISCH:** Alle Hero-Bereiche MÜSSEN `backgroundVariant="3d-premium"` verwenden!  
> Siehe [HERO_BACKGROUND_STANDARD_V31.5.md](./HERO_BACKGROUND_STANDARD_V31.5.md) für Details.

---

## STRIKTE LAYOUT/PATTERN-VORGABE (PRE-BEREICH)

### 1. HERO-PFLICHT (MIT GRAFIK, EXAKT WIE HOME)

- **ALLE Seiten im Pre-Bereich VOR Login – außer /pricing und den Rechtsseiten – erhalten:**
  - Einen Hero-Bereich im exakt gleichen Aufbau, Qualität und mit gleichwertiger Grafik wie der Hero auf der Startseite (/).
  - Die Grafik muss angepasst auf das jeweilige Thema der Seite gestaltet sein (z.B. Features-Seite → Feature-Dashboard, Demo-Seite → Demo-Bezug etc.), aber IMMER auf gleichem Qualitätsniveau, Stil, Format und Responsiveness wie im Home-Hero.
  - Kontext: Die Rechtsseiten sowie /pricing sind davon explizit ausgenommen:
    - /pricing: Hier werden stattdessen die Tarifblöcke direkt im Hero-Bereich angezeigt.
    - Rechtsseiten: Keine Grafik, sondern Text-orientierter Hero wie Pricing, reduziert.

### 2. GRID-PFLICHT FÜR DIE INHALTSBEREICHE

- **ALLE Pre-Seiten (außer Rechtsseiten) bekommen einen individuellen, zur Seite passenden Grid-Inhaltsbereich.**
  - Der Grid ist abgestimmt auf das jeweilige Content-/Feature-Set der Seite.
  - Keine Wiederverwendung oder Copy-Paste von anderen Seiten-Grids, sondern dokumentiert, individuell und thematisch angepasst.
  - Feste Regel: Kein einziger Content-Bereich außerhalb von Hero darf ohne Grid-Struktur angelegt werden.

### 3. GRAFIK- & QUALITÄTS-VERPFLICHTUNG

- Für jede Seite ist VOR Implementation festgelegt, welches Grafik/Contentthema in den Hero kommt.
- Die Grafiken MÜSSEN selben Qualitätsanspruch (Auflösung, Stil, Vektorqualität, Performance, Farbschema) wie die Home-Grafik haben.
- Grafikquellen, Farbcodes, Responsive-Breakpoints, Format und Optimierungsstrategie sind DOKUMENTATIONSPFLICHTIG.

---

## 4. MASSIV VERSCHÄRFTE DOKUMENTATIONSPFLICHT (DOKU FIRST!)

### BEFORE IMPLEMENTATION:

- Für JEDE Seite:
  - Seitenname, Zielgruppe, Zielsetzung, Content Modules (Hero, Grid, Footer etc.)
  - Hero-Grafik-Spezifikation: Thema, Stil, Farbpalette, Quellen, Qualitätssicherung/Review-Prozess
  - Grid-Beschreibung: Aufbau, Anzahl/Art der Elemente, Besonderheiten zur Seite

- JEDER Page-/Hero-/Grid-Entwurf/Mock muss als Bild UND schriftliche Skizze im `/docs/PAGES_DESIGN_OVERVIEW.md` hinterlegt werden.
- Für JEDE Grafik:
  - Quelle (Designer/Tool/Library/Asset)
  - Verwendete SVG/PNG/Weitere Assets (inkl. Optimierung)
  - Akzeptanz (Reviewername, Datum, "Freigabe" vor Implementation)

### WHILE IMPLEMENTING:

- JEDER Commit enthält Dokumentationshinweis auf aktualisierte Stellen im Design- und Seiten-Dokumentationsbereich.
- Jede Änderung an Grafik, Grid, Hero wird SOFORT mit Screenshots, Changelog-Kommentar und Review/Reason dokumentiert.
- Es gibt KEIN "stilles" Austauschen oder Ergänzen, JEDE Änderung ist versionskontrolliert und dokumentiert.

### AFTER IMPLEMENTATION:

- Für jede Seite:
  - Screenshot Desktop, Tablet, Mobile nach Deployment in `/docs/PAGE_SCREENSHOTS/`
  - Umsetzung in `/docs/PAGE_IMPLEMENTATION_CHECKLIST.md` abgehakt
  - Reviewer bestätigt Erfüllung aller Hero-, Grafik-, Grid- und Dokumentationsregeln (mit Namen und Datum)

---

## SCHÄRFSTE ENFORCEMENT- & REVIEW-REGELN

- Pages ohne dokumentiertes und individuelles Hero/ Grafik/ Grid → VERBOTEN!
- Jede Grafik, die nicht geprüft wurde nach Qualität, Thema, Responsive → Ersetzen & REWORK-PFLICHT!
- Fehlende oder inkonsistente Dokumentation = HARD STOP des Deployments.
- Jeder Reviewer muss vor Freigabe ALLES abhaken und RATIFYIEREN: "✅ Vorgabe für Seite [xy] ausnahmslos erfüllt!" – Commit/PR ohne diese Review wird rejected.

---

## MASTER-CHECKLIST (Schritt für Schritt, jedes Teammitglied PFLICHT):

- [ ] Für jede Seite: individueller Hero und individuelle Hero-Grafik dokumentiert
- [ ] Grid-Aufbau, Elementeanzahl, Varianten sauber spezifiziert und dokumentiert
- [ ] Hero-, Grafik-, Grid-Design und Assets vor Implementierung im Doku-Repo
- [ ] Commit/Changelog jedes Mal mit Doku-Update
- [ ] Nach Fertigstellung: Screenshots aller Breakpoints & Review im Doku-Repo
- [ ] Reviewer-Haken für JEDE Vorschrift/Seite gesetzt

**Ohne 100% vollständige, PROJEKTWEITE Erfüllung dieser Vorschrift KEINE Freigabe!**

---

**Mit dieser Regel sind Aufbau/Konsistenz, Qualität und Nachvollziehbarkeit im Pre-Bereich maximal gesichert und dokumentationspflichtig!**
