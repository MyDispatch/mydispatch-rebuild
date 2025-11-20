# 🛑 VOLLUMFÄNGLICHER PRE-LOGIN FEHLERSUCHE-PROMPT

---

## 🎯 ZIEL

Finde – systematisch, strukturiert und kompromisslos – JEDEN Fehler und JEDES Defizit im gesamten vor Login Bereich, inklusive aller Frontend-, Backend- und API-Schichten, Mobile-First-Optimierung und unterstützender Infrastruktur.

---

### 📝 VORGEHEN & PRÜFKATALOG (lückenlos):

---

### 1. DOKUMENTATIONSSUCHE & ANFORDERUNGSVERGLEICH (DOKU FIRST)

- Lies und durchsuchen ALLE relevanten Vorgaben, Schemas, Workflows (COMPONENT_REGISTRY.md, PROJECT_MEMORY.md, filesExplorer.md, API Docs, workflows, PROMPTS).
- Erstelle eine vollständige Matrix: Was ist laut Vorgabe gefordert vs. was ist WIRKLICH implementiert?
- Markiere jede Abweichung, jeden nicht konsolidierten Punkt.

---

### 2. FRONTEND-FEHLERSUCHE (PAGES, COMPONENTS, CONTENT)

- **Mobile First:**
  - Prüfe alle Ansichten/Flows konsequent auf Mobile-Breakpoints (320/375px), Tablet-Breakpoints (640/768/1024px) und Desktop (ab 1280px).
  - Keine horizontale Scrollbar? Buttons touch-freundlich? Grafiken, Textgrößen, Formulare?
  - Sichtbarkeit und Reihenfolge der Inhalte konsistent across Breakpoints?
  - Kritische Userflows (Registration, Demo, Kontakt, Newsletter) auch auf Mobile/Tablet nutzbar und visuell kohärent?

- **UI**:
  - Funktionieren alle Buttons, Dropdowns, Tabs, Navigationsmenüs, Hamburger?
  - Funktionieren Keyboard-Navigation, Focus-Indikatoren, Tabreihe korrekt?
  - Icons, Tooltips, Badges: Sind sie überall sichtbar, semantisch korrekt und ohne Überdeckung?

- **Data-Flows/Props:**
  - Formulare: Sind ALLE Felder sichtbar und erreichbar?
  - Validierungsmeldungen korrekt & verständlich?
  - Default Values, Pre-Fills, Loading-Indikatoren korrekt?
  - Keine „Geisterfelder“ oder vergessene Addons/Funktionen (vgl. Pricing/Addon-Logik)!

- **States/Fallbacks:**
  - Loading/Success/Error/Empty States überall konsistent und vollständig abgedeckt?
  - Edge Cases und Boundary Handling aktiv?

---

### 3. API & BACKEND FEHLERSUCHE

- **API Coverage:**
  - Listen ALLER Endpunkte (Demo, Kontakt, Newsletter, Pricing, Features, Legal etc.) erzeugen
  - Liefern alle Endpunkte genau die laut Schema geforderten Felder, Status und Fehlerstrukturen?
  - Jede Client-seitige Anfrage (fetch/XHR) geprüft: Richtige URL, richtiger Method, Payload, Header, korrekte Response?
  - Jede Error-Response korrekt und verständlich?
  - Schema-Validierungen aktiv auf Backend UND Frontend?
  - Rate-Limits, Spam-Schutz und Double-Opt-In funktionieren (Demo/Newsletter)?

- **Datenfluss/Integrität:**
  - Alle relevanten Daten werden gespeichert, validiert, geliefert (Pricing, Features, Testimonials, FAQ…)?
  - Keine Hardcoded/Redundanten/Dead Data?
  - Sind config-Files und API-Modelle einander synchron?

- **Security:**
  - Sind Eingaben auf allen Ebenen validiert (Injection, XSS, CSRF)?
  - Sind E-Mails/sensitive Daten masking oder hashed wo nötig?
  - Keine Secrets, Keys, Tokens im Client-Side/Repos?

---

### 4. INFRASTRUKTUR & PIPELINE PRÜFUNG

- **CI/CD Tests**:
  - Ist der Pre-Bereich komplett von automatisierten Tests abgedeckt (Unit, Integration, E2E, Visual Regression)?
  - Werden wirklich alle Flows/Edge Cases in Playwright/Cypress & Percy/Chromatic (“mobile first„!) getestet?
  - Monitoring (Sentry, Alerts), Linting (inkl. Mobile-Rules) aktiv, keine offenen Statics/missing checks?

---

### 5. ZUSATZ: USERFLOW-/PROZESS-CHECKS

- **JEDER Userflow:** Schritt-für-Schritt pro Userrolle (Gast, Demo-Kunde, Interessent)
  - Registration → Pricing → Demo → Kontakt: Jeder Klick, jedes Formular!
  - Auf mobilen Geräten: Beta-User-Tests/Funnel Tracking prüfen!
- **Funktioniert die Sprache/Internationalisierung nahtlos?**
- **Accessibility:**
  - sind ARIA Labels/Meldungen überall, alternative Texte, Braille/Tab-Flow?
  - Farbkontrast & Fontgrößen mobil geprüft?
  - Keine „Bypass-Möglichkeiten“/Barrieren?

---

### 6. LÜCKEN SCHLIEßEN (CRITICAL!)

- Für JEDEN gefundenen Fehler/Gap:
  - Root Cause direkt dokumentieren (AVOIDABLE_ERRORS.md, LESSONS_LEARNED.md).
  - Die betroffene Komponente/API/Dokumentation SOFORT nachziehen!
  - Test/Monitoring entsprechend erweitern!
  - Kein „Quickfix“ ohne nachhaltigen Pattern-Fix und Dokumentation!

---

### 7. MASTER-CHECKLISTE (Schritt für Schritt durchzugehen)

- [ ] Alle Vorgaben/Dokumentationen analysiert
- [ ] Mobile-, Tablet-, Desktop-View UX geprüft (ALLE Seiten!)
- [ ] Jede Userflow/Jeder Step geprüft
- [ ] Jede API-Response/jeder Fehlerfall getestet
- [ ] Alle Backend-Validierungen/Business-Logik gecheckt
- [ ] Kein Secret/Key/Token/PII unverschlüsselt
- [ ] Accessibility/UX/Internationalisierung gesichert
- [ ] Jede Lücke SOFORT und dauerhaft geschlossen + dokumentiert

---

## **Als Ergebnis MUSS der vor-Login Bereich 100% fehlerfrei, responsiv, API/Backend synchron, mobile-first optimiert und “single Source of Truth“ sein – kein einziger Flow, keine einzige Userstory darf off bleiben. Die Dokumentation ist aktualisiert!**

---

**Nutze diesen Prompt für lückenlose, kompromisslose Fehlersuche/preventive QA im gesamten Public Bereich!**
