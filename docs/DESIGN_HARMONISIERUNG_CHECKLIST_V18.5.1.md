# DESIGN HARMONISIERUNG CHECKLIST V18.5.1

> **Version:** 18.5.1  
> **Letzte Aktualisierung:** 2025-10-23  
> **Status:** 🔴 VERPFLICHTEND FÜR ALLE DEPLOYMENTS  
> **Zweck:** Systematische Quality-Gates vor Go-Live

---

## 🎯 VERWENDUNG

**Wann verwenden?**
- ✅ VOR jedem Deployment (Staging/Production)
- ✅ NACH jeder neuen Seite
- ✅ NACH Design-System Änderungen
- ✅ BEI Code-Reviews

**Wie verwenden?**
1. Kopiere diese Checkliste
2. Gehe Punkt für Punkt durch
3. Hake ab ✅ wenn erfüllt
4. Dokumentiere Abweichungen mit Begründung
5. Erst deployen wenn ALLE kritischen Punkte ✅

---

## 📋 PRE-DEPLOYMENT CHECKLIST

### 🎨 DESIGN-SYSTEM COMPLIANCE (KRITISCH)

#### Header/Footer
- [ ] **Alle Header:** `bg-gradient-to-r from-primary via-primary to-primary/95`
- [ ] **Alle Footer:** `bg-gradient-to-t from-primary via-primary to-primary/95`
- [ ] **Header Height:** `h-14 sm:h-16` (responsive)
- [ ] **Footer Padding:** `py-3 sm:py-4`
- [ ] **Border:** `border-border/20` (subtil, nicht /50 oder solid!)
- [ ] **Shadow:** `shadow-lg` (Header), `backdrop-blur-sm` (Footer)

#### Logo
- [ ] **Klickbar:** onClick → / (Marketing), /dashboard (App), /master (Master)
- [ ] **Max-Width:** `max-w-[120px] sm:max-w-[160px] md:max-w-[180px]`
- [ ] **Hover-State:** `cursor-pointer hover:opacity-80 transition-opacity`
- [ ] **Object-Fit:** `object-contain` (KEIN object-cover bei Logos!)
- [ ] **Kein Overflow:** Logo NIEMALS > Container-Breite

#### Buttons
- [ ] **Marketing-Seiten:** MarketingButton verwenden (NICHT App-Button!)
- [ ] **App-Seiten:** App-Button verwenden (NICHT MarketingButton!)
- [ ] **Touch-Targets:** `min-h-[44px]` (Apple/Google Guidelines)
- [ ] **Hover-States:** Definiert (nicht disabled)
- [ ] **Icon-Only:** `aria-label` vorhanden (Accessibility!)

#### Text-Farben
- [ ] **Auf Primary BG:** `text-foreground` oder `text-foreground/70` (NICHT text-white!)
- [ ] **Auf Background BG:** `text-foreground` oder `text-muted-foreground`
- [ ] **Links:** `hover:text-foreground` (kontrast-sicher)
- [ ] **KEINE direkten Farben:** `text-white`, `text-black` verboten (außer auf Bildern)

#### Semantic Tokens
- [ ] **Colors:** Nur `text-foreground`, `bg-primary`, `border-border` etc.
- [ ] **KEINE Direct Colors:** `text-[#fff]`, `bg-[#000]` verboten
- [ ] **HSL-Format:** Alle Farben als `hsl(var(--token))`
- [ ] **Sidebar:** `bg-background` (NICHT Primary Gradient!)

---

### 📱 MOBILE-FIRST (KRITISCH)

#### Responsive Design
- [ ] **Breakpoints getestet:** 375px, 414px, 768px, 1024px, 1920px
- [ ] **Touch-Targets:** ≥ 44px (Buttons, Icons, Links)
- [ ] **Mobile-Navigation:** Funktional (Hamburger-Menu oder Bottom-Nav)
- [ ] **Kein Horizontal-Overflow:** Alle Seiten, alle Breakpoints
- [ ] **Responsive Images:** `object-contain` oder `object-cover` korrekt

#### Mobile-Spezifika
- [ ] **Mobile Header:** Fixed positioning, z-index korrekt
- [ ] **Mobile Footer:** Fixed positioning, kein Content-Overlap
- [ ] **Mobile-Bottom-Nav:** Sticky, immer sichtbar, kein Scroll-Hide
- [ ] **Form-Inputs:** Große genug für Touch (min-h-[44px])
- [ ] **Modals:** Max-height für Mobile (max-h-[85vh])

#### Grid-Layouts
- [ ] **Mobile-First Classes:** `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
- [ ] **Gap-System:** `gap-2 sm:gap-4 lg:gap-6` (responsive)
- [ ] **Container-Padding:** `px-4 sm:px-6 lg:px-8` (consistent)

---

### ⚖️ RECHTLICHE COMPLIANCE (KRITISCH)

#### DSGVO (EU)
- [ ] **Datenschutz-Link:** Im Footer (IMMER sichtbar)
- [ ] **DSGVO-Hinweis:** Bei JEDEM Formular (Datensammlung)
- [ ] **Consent:** Cookie-Banner (falls Cookies verwendet)
- [ ] **Datenlöschung:** "Konto löschen" Option in Einstellungen
- [ ] **Datenexport:** "Daten exportieren" Option (DSGVO Art. 20)

#### AI Act (EU)
- [ ] **KI-Kennzeichnung:** Icon + Text bei JEDER KI-Antwort
- [ ] **AI-Disclosure:** "Powered by AI" sichtbar
- [ ] **Human-Oversight:** Disclaimer bei kritischen Entscheidungen

#### TMG (Deutschland)
- [ ] **Impressum:** Link im Footer
- [ ] **Datenschutz:** Link im Footer
- [ ] **AGB:** Link im Footer (bei kostenpflichtigen Services)
- [ ] **Kontakt:** Link im Footer

#### PBefG § 51 (Taxi/Mietwagen)
- [ ] **Aufbewahrungspflicht:** Auftragsdaten 10 Jahre (automatisch)
- [ ] **Nachweis-Export:** "Aufträge exportieren" für Behörden

#### Domain
- [ ] **Korrekte Domain:** my-dispatch.de (NICHT mydispatch.de oder andere!)
- [ ] **SSL-Zertifikat:** HTTPS (automatisch in Production)

---

### ⚡ PERFORMANCE (WICHTIG)

#### Ladezeiten
- [ ] **Initial Load:** < 3 Sekunden (Lighthouse)
- [ ] **Time to Interactive:** < 5 Sekunden
- [ ] **Largest Contentful Paint:** < 2.5 Sekunden

#### Optimierungen
- [ ] **React Query:** Für API-Calls verwendet
- [ ] **Memoization:** `useMemo`, `useCallback` bei aufwändigen Berechnungen
- [ ] **Code-Splitting:** `React.lazy()` für Routes
- [ ] **Lazy-Loading:** Bilder mit `loading="lazy"`
- [ ] **Skeleton-Screens:** Bei Loading-States

#### Bundle-Size
- [ ] **Chunk-Size:** < 500KB (gzipped)
- [ ] **Vendor-Chunk:** Separat (automatisch via Vite)
- [ ] **Tree-Shaking:** Keine unused Imports

---

### 🎨 UI/UX QUALITY (WICHTIG)

#### Konsistenz
- [ ] **Tab-System:** Vollfächig, keine Abrundungen zwischen Tabs
- [ ] **KPI-Cards:** Grid (1/2/4 cols), Icons, Hover-Effects
- [ ] **Search-Bar:** Icon links, Placeholder, responsive
- [ ] **Dialogs:** Max-width, Max-height, Scrollbar bei Overflow

#### Accessibility (WCAG 2.1 AA)
- [ ] **Kontrast-Ratio:** ≥ 4.5:1 (Text), ≥ 3:1 (UI-Elemente)
- [ ] **Alt-Texte:** Bei ALLEN Bildern
- [ ] **Aria-Labels:** Bei icon-only Buttons
- [ ] **Focus-States:** Sichtbar (nicht `:focus { outline: none; }`)
- [ ] **Keyboard-Navigation:** Funktional (Tab, Enter, Esc)

#### Animations
- [ ] **Smooth-Transitions:** `transition-all duration-300`
- [ ] **Hover-Effects:** Definiert (scale, opacity, bg-change)
- [ ] **Loading-Indicators:** Spinner oder Skeleton-Screens
- [ ] **KEINE excessive Animations:** Performance-Killer vermeiden

---

### 🧪 TESTING (WICHTIG)

#### Manual Testing
- [ ] **Screenshot-Validierung:** Home, Dashboard, Main-Pages
- [ ] **Mobile-Tests:** 375px, 768px, 1920px
- [ ] **Touch-Test:** Alle Buttons/Links auf Mobile
- [ ] **Navigation-Test:** Alle internen Links funktional
- [ ] **Form-Test:** Alle Formulare absendbar

#### Browser-Testing
- [ ] **Chrome/Edge:** ✅ Funktional
- [ ] **Firefox:** ✅ Funktional
- [ ] **Safari:** ✅ Funktional (besonders Mobile!)
- [ ] **Mobile-Browser:** iOS Safari, Chrome Android

#### Console-Logs
- [ ] **Keine Errors:** Console-Log sauber
- [ ] **Keine Warnings:** React Warnings behoben
- [ ] **Network-Errors:** Alle API-Calls erfolgreich

---

### 📊 CODE-QUALITY (OPTIONAL, ABER EMPFOHLEN)

#### Best Practices
- [ ] **Single Source of Truth:** Zentrale Daten-Quellen
- [ ] **Component-Reuse:** Keine Duplikate
- [ ] **Props-Validation:** TypeScript Interfaces
- [ ] **Error-Boundaries:** Um kritische Components

#### Naming-Conventions
- [ ] **Components:** PascalCase (`MarketingButton.tsx`)
- [ ] **Hooks:** camelCase + 'use' Prefix (`useAuth.ts`)
- [ ] **Utils:** camelCase (`formatCurrency.ts`)
- [ ] **Constants:** UPPER_SNAKE_CASE (`PRICING_TIERS.ts`)

#### Kommentare
- [ ] **Kritische Sections:** Mit Kommentaren erklärt
- [ ] **NIEMALS commented-out Code:** Löschen statt auskommentieren
- [ ] **TODOs:** Mit Issue-Nummern verlinkt

---

## 🚨 KRITISCHE ALARM-TRIGGER

**SOFORT STOPPEN & ESKALIEREN bei:**

### Sicherheit
- ❌ RLS-Policies fehlen (Supabase-Tables)
- ❌ API-Keys im Code (statt Secrets)
- ❌ Ungeschützte Admin-Routes

### Datenverlust
- ❌ Lösch-Operationen ohne Confirmation
- ❌ Überschreiben ohne Backup
- ❌ Migrationen ohne Rollback-Plan

### Legal
- ❌ DSGVO-Verstoß (fehlende Hinweise)
- ❌ AI Act Verstoß (fehlende KI-Kennzeichnung)
- ❌ Impressum/Datenschutz fehlt

### Performance
- ❌ > 3s Ladezeit (Initial Load)
- ❌ Memory-Leaks (steigender RAM-Verbrauch)
- ❌ Infinite-Loops (API-Calls ohne Ende)

### Mobile
- ❌ Touch-Targets < 44px
- ❌ Horizontal-Overflow
- ❌ Mobile-Navigation kaputt

### Breaking Changes
- ❌ Stripe-IDs ändern (bricht bestehende Abos!)
- ❌ Supabase-Schema ohne Migration
- ❌ API-Breaking-Changes ohne Versionierung

---

## ✅ DEPLOYMENT-FREIGABE

**Erst deployen wenn:**

### Kritische Punkte (100%)
- ✅ Alle KRITISCH-markierten Punkte erfüllt
- ✅ Keine Alarm-Trigger ausgelöst
- ✅ Screenshot-Validierung OK
- ✅ Mobile-Tests bestanden

### Wichtige Punkte (80%)
- ✅ Mindestens 80% der WICHTIG-markierten Punkte erfüllt
- ✅ Restliche 20% dokumentiert als "Known Issues"
- ✅ Timeline für Fixes definiert

### Optionale Punkte (50%)
- ✅ Nice-to-Have, aber nicht blockierend
- ✅ Können später nachgezogen werden

---

## 📝 DOKUMENTATION NACH DEPLOYMENT

### FEHLER_LOG aktualisieren
- Neue Fehler gefunden? → In F-XXX dokumentieren
- Root Cause analysiert? → In FEHLER_LOG eintragen
- Prävention definiert? → Checklist erweitern

### COMPONENT_LIBRARY aktualisieren
- Neue Components erstellt? → Dokumentieren
- Variants geändert? → Aktualisieren
- Breaking Changes? → Migrationsguide schreiben

### MASTER_INDEX aktualisieren
- Neue Docs erstellt? → Im Index registrieren
- Abhängigkeiten geändert? → Matrix updaten
- Version-Bump? → Changelog erweitern

---

## 🔄 KONTINUIERLICHE VERBESSERUNG

### Feedback-Loop
1. Deployment durchgeführt
2. Issues gesammelt (1 Woche)
3. Checklist erweitern (neue Punkte)
4. Team-Review (monatlich)

### Metrics-Tracking
- **Fehlerquote:** Anzahl Bugs pro Deployment (Ziel: < 3)
- **Checklist-Compliance:** % erfüllte Punkte (Ziel: > 95%)
- **Time-to-Fix:** Durchschnitt für Bug-Fixes (Ziel: < 2h)

---

## 🎓 QUICK-REFERENCE

### Top 5 häufigste Fehler (aus FEHLER_LOG)

1. **Fehlende Primary Gradient** → Header/Footer `from-primary via-primary to-primary/95`
2. **Logo nicht klickbar** → `onClick={() => navigate('/')}`
3. **Text-Farben falsch** → `text-foreground/70` auf Primary BG
4. **Touch-Targets zu klein** → `min-h-[44px]`
5. **DSGVO-Hinweis fehlt** → Bei jedem Formular!

### Top 3 Performance-Killer

1. **Keine Memoization** → `useMemo`, `useCallback` bei aufwändigen Berechnungen
2. **Kein Code-Splitting** → `React.lazy()` für Routes
3. **Keine React Query** → API-Calls cachen

### Top 3 Mobile-Fehler

1. **Horizontal-Overflow** → `overflow-x-hidden` auf `body`
2. **Touch-Targets zu klein** → Min 44x44px
3. **Fixed-Positioning kaputt** → `z-index` Hierarchie prüfen

---

## 🔗 VERWANDTE DOKUMENTE

- [FEHLER_LOG_V18.5.1.md](./FEHLER_LOG_V18.5.1.md) - Bekannte Fehler
- [COMPONENT_LIBRARY_V18.5.1.md](./COMPONENT_LIBRARY_V18.5.1.md) - Component-Referenz
- [DESIGN_SYSTEM_V18.5.0.md](./DESIGN_SYSTEM_V18.5.0.md) - Design-System
- [APP_PAGE_TEMPLATE_V18.5.1.md](./APP_PAGE_TEMPLATE_V18.5.1.md) - Seiten-Templates

---

**Version:** 18.5.1  
**Datum:** 2025-10-23  
**Status:** 🔴 VERPFLICHTEND FÜR ALLE DEPLOYMENTS
