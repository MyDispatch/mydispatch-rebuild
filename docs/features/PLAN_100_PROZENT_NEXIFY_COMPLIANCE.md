# Plan zur 100% NeXify WiKi-Compliance

**Erstellt:** 2025-11-09
**Aktueller Erfüllungsgrad:** 5% (1/20 Hauptvorgaben)
**Ziel:** 100% Compliance in 7 systematischen Phasen

---

## PHASE 1: KRITISCHE INFRASTRUKTUR (P0) - 4-6 Stunden

### 1.1 Knowledge Base Tabellen in Supabase erstellen
**Status:** ✅ Migration erstellt, ⏸️ Deployment ausstehend

**Aufgaben:**
- [x] Migration-Datei erstellt (`supabase/migrations/20251109_create_knowledge_base.sql`)
- [ ] Migration in Supabase ausführen (manuell via Supabase Dashboard oder CLI)
- [ ] RLS Policies validieren (`npm run check:rls`)
- [ ] Initial Data seeden (4 Known Issues aus NeXify WiKi)

**Deliverables:**
- 5 Tabellen: `component_registry`, `known_issues`, `code_snippets`, `recent_learnings`, `best_practices`
- RLS aktiviert auf allen Tabellen
- Policies für authenticated users (read) und service_role (write)

**Zeitaufwand:** 1-2 Stunden

---

### 1.2 Mandatory Scripts implementieren
**Status:** ❌ Nicht vorhanden

**Aufgaben:**
- [ ] `npm run validate:all` - Vollständige Validierung
  - TypeScript Check
  - ESLint
  - RLS Linter
  - Component Registry Check
  - Known Issues Check
- [ ] `npm run check:rls` - RLS-Linter
  - Alle Tabellen auf RLS prüfen
  - Policies validieren
  - Fehlende Policies melden
- [ ] `npm run master:workflow` - Master Workflow
  - Knowledge Base laden
  - Session initialisieren
  - Validierung durchführen
  - Status-Report ausgeben

**Deliverables:**
- 3 neue Scripts in `package.json`
- Validierungs-Scripts in `scripts/` Verzeichnis
- CI/CD-Integration

**Zeitaufwand:** 2-3 Stunden

---

### 1.3 Brain-Query Edge Function implementieren
**Status:** ❌ Nicht vorhanden

**Aufgaben:**
- [ ] Edge Function `brain-query` erstellen
- [ ] Session-Init-Logik implementieren
  - Recent Learnings laden (>= 5)
  - Critical Issues laden (Target: 0)
  - Components laden (>= 20)
  - Best Practices laden
- [ ] Erfolgs-Kriterien validieren
- [ ] Status-Report generieren

**Deliverables:**
- `supabase/functions/brain-query/index.ts`
- Auto-Load-Mechanismus bei Chat-Start

**Zeitaufwand:** 1-2 Stunden

---

## PHASE 2: COMPONENT REGISTRY AUFBAU (P1) - 3-4 Stunden

### 2.1 Alle existierenden Komponenten registrieren
**Status:** ❌ Nicht erfüllt

**Aufgaben:**
- [ ] Alle Komponenten in `src/components/` scannen
- [ ] Metadaten extrahieren (Props, Dependencies, Type)
- [ ] In `component_registry` Tabelle eintragen
- [ ] Validation-Script erstellen

**Deliverables:**
- >= 21 Komponenten registriert
- Automatisches Registry-Update bei neuen Komponenten

**Zeitaufwand:** 2-3 Stunden

---

### 2.2 Validation Layers integrieren
**Status:** ❌ Nicht erfüllt

**Aufgaben:**
- [ ] Pre-Component-Creation Check
  - Query component_registry
  - Prüfe ob Komponente bereits existiert
  - Verhindere Duplikate
- [ ] Pre-Function-Creation Check
  - Query code_snippets
  - Prüfe ob Pattern bereits existiert
  - Verhindere Hallucinations
- [ ] Pre-Migration Check
  - Query known_issues
  - Prüfe RLS Violations
  - Verhindere Security-Probleme

**Deliverables:**
- Zero-Hallucination Protocol aktiv
- Validation Layers in alle Workflows integriert

**Zeitaufwand:** 1-2 Stunden

---

## PHASE 3: SELF-LEARNING PROTOCOL (P1) - 2-3 Stunden

### 3.1 Recent Learnings System implementieren
**Status:** ❌ Nicht erfüllt

**Aufgaben:**
- [ ] Learning-Capture-Mechanismus
  - Nach jeder Aktion: Learning dokumentieren
  - Kategorie zuweisen (component, pattern, error, optimization, best_practice)
  - Impact bewerten (critical, high, medium, low)
- [ ] Learning-Application-Tracking
  - Markiere angewendete Learnings
  - Tracke Erfolgsrate
- [ ] Learning-Query-API
  - Abrufen relevanter Learnings vor Aktionen

**Deliverables:**
- >= 5 Recent Learnings in Datenbank
- Auto-Capture bei jeder Aktion

**Zeitaufwand:** 2-3 Stunden

---

## PHASE 4: DESIGN SYSTEM COMPLIANCE (P2) - 2-3 Stunden

### 4.1 Hardcodierte Farben eliminieren
**Status:** ⚠️ Teilweise erfüllt (noch 4 Vorkommen)

**Aufgaben:**
- [ ] Alle hardcodierten Farben finden (`text-[#xxx]`, `bg-[#xxx]`)
- [ ] Durch Design Tokens ersetzen
- [ ] Validierungs-Script erstellen

**Deliverables:**
- 0 hardcodierte Farben
- 100% Design Token Usage

**Zeitaufwand:** 1 Stunde

---

### 4.2 Touch-Targets optimieren
**Status:** ❌ Nicht erfüllt

**Aufgaben:**
- [ ] Alle interaktiven Elemente finden
- [ ] Touch-Targets auf >= 48px setzen
- [ ] Mobile-First-Validierung

**Deliverables:**
- 100% Touch-Targets >= 48px
- WCAG 2.1 AA konform

**Zeitaufwand:** 1-2 Stunden

---

## PHASE 5: LAYOUT FREEZE COMPLIANCE (P2) - 1-2 Stunden

### 5.1 Layout-Freeze-Kommentare einfügen
**Status:** ❌ Nicht erfüllt

**Aufgaben:**
- [ ] Layout-Freeze-Kommentare in alle geschützten Komponenten
- [ ] Dokumentation: Welche Komponenten sind geschützt?
- [ ] Validierungs-Script erstellen

**Deliverables:**
- Layout-Freeze-Kommentare in allen relevanten Komponenten
- Klare Dokumentation

**Zeitaufwand:** 1-2 Stunden

---

## PHASE 6: FEHLERDIAGNOSE & FIXES (P1) - 3-4 Stunden

### 6.1 Login-Redirect-Problem beheben
**Status:** ❌ Führt auf /master statt /dashboard

**Ursache:** User wird fälschlicherweise als `master` erkannt

**Aufgaben:**
- [ ] `user_roles` Tabelle in Supabase prüfen
- [ ] Falsche Rollen-Zuweisungen korrigieren
- [ ] Auth.tsx Logik validieren
- [ ] End-to-End-Test

**Deliverables:**
- Entrepreneur → /dashboard
- Master → /master
- 100% korrekte Redirects

**Zeitaufwand:** 1 Stunde

---

### 6.2 Pre-Login-Seiten-Fehler beheben
**Status:** ❌ Doppelter Install-Prompt, nicht mobile-optimiert

**Aufgaben:**
- [ ] Doppelten PWAInstallButton entfernen (App.tsx ODER V28HeroPremium.tsx)
- [ ] Doppelten V28CookieConsent entfernen (nur in einem Layout)
- [ ] Mobile-Optimierung der Landing-Page
- [ ] Login-Modal-Überlagerung beheben

**Deliverables:**
- 1 Install-Prompt
- 1 Cookie-Banner
- 100% mobile-optimiert
- Kein Login-Modal auf Landing-Page

**Zeitaufwand:** 2-3 Stunden

---

## PHASE 7: DEPLOYMENT & VALIDIERUNG (P0) - 1-2 Stunden

### 7.1 Finales Deployment
**Status:** ⏸️ Ausstehend

**Aufgaben:**
- [ ] Alle Änderungen committen
- [ ] Build-Test durchführen
- [ ] Deploy Hook triggern
- [ ] Live-Site validieren

**Deliverables:**
- Alle heutigen Änderungen live
- Build erfolgreich
- Keine Errors

**Zeitaufwand:** 30 Minuten

---

### 7.2 100% Compliance Validierung
**Status:** ❌ Nicht durchgeführt

**Aufgaben:**
- [ ] `npm run validate:all` ausführen
- [ ] Alle Checklisten-Punkte prüfen
- [ ] Compliance-Report erstellen
- [ ] Dokumentation aktualisieren

**Deliverables:**
- 100% NeXify WiKi-Compliance
- Vollständiger Compliance-Report
- Aktualisierte Dokumentation

**Zeitaufwand:** 1 Stunde

---

## ZUSAMMENFASSUNG

### Gesamtzeitaufwand: 17-25 Stunden

**Phasen-Übersicht:**
1. ✅ **Phase 1: Kritische Infrastruktur** - 4-6h (P0)
2. ✅ **Phase 2: Component Registry** - 3-4h (P1)
3. ✅ **Phase 3: Self-Learning Protocol** - 2-3h (P1)
4. ✅ **Phase 4: Design System Compliance** - 2-3h (P2)
5. ✅ **Phase 5: Layout Freeze Compliance** - 1-2h (P2)
6. ✅ **Phase 6: Fehlerdiagnose & Fixes** - 3-4h (P1)
7. ✅ **Phase 7: Deployment & Validierung** - 1-2h (P0)

### Priorisierung:

**Sofort (P0):**
1. Knowledge Base Tabellen deployen (1h)
2. Login-Redirect beheben (1h)
3. Pre-Login-Seiten-Fehler beheben (2-3h)
4. Finales Deployment (30min)

**Danach (P1):**
5. Mandatory Scripts (2-3h)
6. Component Registry (3-4h)
7. Self-Learning Protocol (2-3h)

**Später (P2):**
8. Design System Compliance (2-3h)
9. Layout Freeze Compliance (1-2h)

### Meilensteine:

**Meilenstein 1: Funktionsfähig (P0 abgeschlossen) - 4-5h**
- Knowledge Base deployed
- Login-Redirect funktioniert
- Pre-Login-Seiten fehlerfrei
- Live-Site produktionsreif

**Meilenstein 2: NeXify-Grundlagen (P1 abgeschlossen) - 12-15h**
- Mandatory Scripts funktionieren
- Component Registry aufgebaut
- Self-Learning Protocol aktiv
- Zero-Hallucination Protocol implementiert

**Meilenstein 3: 100% Compliance (P2 abgeschlossen) - 17-25h**
- Design System 100% konform
- Layout Freeze dokumentiert
- Alle Validierungen bestanden
- Vollständige Dokumentation

---

## NÄCHSTE SCHRITTE (SOFORT)

1. **Knowledge Base Migration deployen**
   - Supabase Dashboard öffnen
   - SQL Editor öffnen
   - `supabase/migrations/20251109_create_knowledge_base.sql` ausführen
   - Validieren: `SELECT * FROM component_registry LIMIT 1;`

2. **Login-Redirect beheben**
   - Supabase Dashboard → Database → user_roles
   - Falsche Rollen-Zuweisungen korrigieren
   - Test: Login als Entrepreneur → sollte zu /dashboard führen

3. **Pre-Login-Seiten-Fehler beheben**
   - PWAInstallButton aus App.tsx entfernen (behalten in V28HeroPremium.tsx)
   - V28CookieConsent aus AuthPageLayout.tsx und MarketingLayoutNew.tsx entfernen (behalten in MarketingLayout.tsx)
   - Mobile-Optimierung testen

4. **Deployment**
   - `git add -A && git commit -m "fix: P0 Fixes - Login-Redirect, Pre-Login-Fehler"`
   - `git push origin master`
   - Deploy Hook triggern: `curl -X POST '<DEPLOY_HOOK_URL>'`
   - Live-Site testen

---

**FAZIT:** Mit diesem systematischen Plan erreichen wir 100% NeXify WiKi-Compliance in 17-25 Stunden, aufgeteilt in 7 klare Phasen mit messbaren Meilensteinen.
