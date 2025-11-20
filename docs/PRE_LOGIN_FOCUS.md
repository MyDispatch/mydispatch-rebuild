# 🎯 PRE-LOGIN FOKUS - MIGRATION STRATEGIE

**Datum:** 2025-10-28  
**Priorität:** ✅ AKTIV

---

## STRATEGIE-ÄNDERUNG

**ALTE Strategie:**
- Phase 1: Auth ✅
- Phase 2: Dashboard (50+ Komponenten)
- Phase 3-5: Rest

**NEUE Strategie:**
- ✅ **Fokus: "Vor Login" Bereich**
- ❌ **Dashboard: WARTEN bis explizit gefordert**

---

## PRE-LOGIN BEREICH (COMPLETED & LOCKED)

### ✅ AUTHENTICATION (Bereits abgeschlossen):
1. /auth - Login ✅
2. /auth - Registrierung (Tarif-Auswahl) ✅
3. /auth - Passwort zurücksetzen ✅

### ✅ ÖFFENTLICHE SEITEN (11 Seiten - V32.1 DESIGN-LOCKED):

#### ✅ CORE MARKETING (6 Seiten) - 🔒 FINAL:
1. **/ (Home)** - ✅ V28/V32.0 LOCKED (2025-10-31)
2. **/features (Features)** - ✅ V28/V32.0 LOCKED (2025-10-31)
3. **/pricing (Pricing)** - ✅ V28/V32.0 LOCKED (2025-10-31)
4. **/about (About)** - ✅ V28/V32.0 LOCKED (2025-10-31)
5. **/contact (Contact)** - ✅ V28/V32.0 LOCKED (2025-10-31)
6. **/faq (FAQ)** - ✅ V28/V32.0 LOCKED (2025-10-31)

#### ✅ AUTH PAGES (2 Seiten) - 🔒 FINAL:
7. **/login (Login)** - ✅ V28/V32.0 LOCKED (2025-10-31)
8. **/register (Register)** - ✅ V28/V32.0 LOCKED (2025-10-31)

#### ✅ LEGAL PAGES (3 Seiten) - 🔒 FINAL:
9. **/privacy (Privacy Policy)** - ✅ V28/V32.0 LOCKED (2025-10-31)
10. **/terms (Terms of Service)** - ✅ V28/V32.0 LOCKED (2025-10-31)
11. **/imprint (Impressum)** - ✅ V28/V32.0 LOCKED (2025-10-31)

---

### 🔒 DESIGN LOCK V32.1 (2025-10-31):

**ALLE öffentlichen Seiten sind ABSOLUT GESPERRT gegen Design-/Layout-Änderungen!**

#### Design-System (FINAL):
- Hero-Komponente: `V28HeroPremium` (einzige erlaubte Hero)
- Background: `3d-premium` oder `flat` (FINAL)
- Farben: `slate-50` bis `slate-900` (Ausnahme: Status-Indicators)
- Layout: `PageShell` + `SectionLayout` (FINAL)
- Komponenten: Nur V28-Komponenten (LOCKED)

#### ❌ ABSOLUT VERBOTEN:
- Design-Änderungen (Farben, Spacing, Fonts, Komponenten)
- Layout-Änderungen (Hero, Sections, Grid-Struktur)
- Neue UI-Features hinzufügen
- Komponenten austauschen oder erweitern
- Content ändern (ohne explizite Freigabe)
- Animationen hinzufügen/ändern
- Typografie ändern

#### ✅ NUR ERLAUBT (Technische Optimierungen):
- Performance-Optimierungen (React.memo, Lazy Loading, Caching)
- SEO-Optimierungen (Meta-Tags, Schema.org, Open Graph)
- Accessibility-Verbesserungen (ARIA, Keyboard-Navigation)
- Security-Improvements (Input-Validation, XSS-Prevention)
- Code-Refactoring (ohne UI-Änderung)
- Error-Handling & Logging erweitern
- Analytics & Monitoring hinzufügen

#### 📋 Dokumentation:
- **`docs/PUBLIC_PAGES_DESIGN_LOCK_V32.1.md`** - VOLLSTÄNDIGE Spezifikation
- `docs/DESIGN_SYSTEM_LOCK.md` - Design-System V32.0
- `docs/HERO_LOCK_FINAL_V32.0.md` - Hero-System
- `docs/COLOR_EXCEPTIONS.md` - Farb-Ausnahmen
- `docs/LAYOUT_FREEZE_PROTECTION_V18.5.1.md` - Allgemeine Regeln

---

## DASHBOARD BEREICH (WARTEN)

**Status:** 🔒 GESPERRT bis vollständige Fertigstellung aller öffentlichen Seiten (vor Login)

**KRITISCHE REGEL:**
❌ Dashboard-Migration (50+ Komponenten) erfolgt ERST nach 100% Fertigstellung von:
- ✅ /auth (Login, Registrierung, Passwort zurücksetzen)
- ⚠️ / (Home) - Marketing-Seite
- ⚠️ /pricing - Tarif-Übersicht
- ⚠️ /features - Feature-Liste
- ⚠️ /contact - Kontakt-Formular
- ⚠️ Header - Marketing-Header
- ⚠️ Footer - Marketing-Footer

**Betroffene Bereiche (GESPERRT):**
- Dashboard-Komponenten (50+)
- Sidebar
- Widgets
- Tabellen
- Dialoge
- Alle /dashboard/* Routen

**Action:** ABSOLUT KEINE Änderungen bis User explizit sagt "Dashboard-Migration starten"

---

## AKTUELLE AUFGABEN (SESSION 2025-10-28)

### ✅ ABGESCHLOSSEN (Session):
1. Tarif-Karten in /auth korrigiert ✅
   - Umrandung & Badge wie Pricing
   - Fleet Add-On attraktive Card-Darstellung
   - Professional Icon generiert (v2)
   
2. Form-Felder ergänzt ✅
   - Anrede (Herr/Frau/Divers)
   - Titel (Dr./Prof./etc.)
   
3. Tab-Buttons Styling ✅
   - V28.1 Buttons-Farben angewendet

### 📋 NÄCHSTE PHASE (Dokumentiert, wartend auf Start):
**ALLE öffentlichen Seiten V28.1-konform machen**
- Plan: `docs/PRE_LOGIN_PAGES_COMPLETE_PLAN.md`
- Umfang: 10 Seiten (Core Marketing + Legal)
- Status: 📝 DOKUMENTIERT FÜR SPÄTER

---

**LAST UPDATE:** 2025-10-28
