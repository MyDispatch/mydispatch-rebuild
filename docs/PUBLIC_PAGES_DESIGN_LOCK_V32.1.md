# PUBLIC PAGES DESIGN LOCK V32.1

> **STATUS:** 🔒 ABSOLUT GESPERRT - KEINE DESIGN/LAYOUT-ÄNDERUNGEN ERLAUBT  
> **GÜLTIG AB:** 2025-10-31  
> **DESIGN-SYSTEM:** V28 + V32.0 (Slate-Only)

---

## 🎯 ZWECK

Dieses Dokument definiert die **absolute Sperrung** aller öffentlichen Seiten (Pre-Login-Bereich) gegen Design- und Layout-Änderungen. Ab V32.1 ist das Design **FINAL und LOCKED**.

### 🌐 ERWEITERTE BEDEUTUNG:

**Das öffentliche Design ist das MASTER-DESIGN für das GESAMTE SYSTEM!**

- ✅ Öffentlicher Bereich = **QUELLE DER WAHRHEIT** für Design/Layout
- ✅ Header aus öffentlichem Bereich = **SYSTEMWEIT EINZIG ERLAUBT**
- ✅ Hero (V28HeroPremium) = **SYSTEMWEIT EINZIG ERLAUBT**
- ✅ Sidebar aus öffentlichem Bereich = **SYSTEMWEIT EINZIG ERLAUBT**
- ✅ Alle anderen Bereiche (Dashboard, Unternehmer-Landingpage, etc.) = **EXAKT IDENTISCH**

**Siehe:** [`docs/MASTER_DESIGN_SYSTEM_V32.1.md`](./MASTER_DESIGN_SYSTEM_V32.1.md) für vollständige systemweite Spezifikation.

---

## 🔒 GESPERRTE SEITEN (KOMPLETT)

### ✅ ALLE ÖFFENTLICHEN SEITEN SIND GESPERRT

| # | Seite | Route | Datei | Hero-Typ | Status |
|---|-------|-------|-------|----------|--------|
| 1 | **Home** | `/` | `src/pages/Home.tsx` | V28HeroPremium | 🔒 LOCKED |
| 2 | **Features** | `/features` | `src/pages/Features.tsx` | V28HeroPremium | 🔒 LOCKED |
| 3 | **Pricing** | `/pricing` | `src/pages/Pricing.tsx` | V28HeroPremium | 🔒 LOCKED |
| 4 | **About** | `/about` | `src/pages/About.tsx` | V28HeroPremium | 🔒 LOCKED |
| 5 | **Contact** | `/contact` | `src/pages/Contact.tsx` | V28HeroPremium | 🔒 LOCKED |
| 6 | **FAQ** | `/faq` | `src/pages/FAQ.tsx` | V28HeroPremium | 🔒 LOCKED |
| 7 | **Login** | `/login` | `src/pages/Login.tsx` | Auth-Form | 🔒 LOCKED |
| 8 | **Register** | `/register` | `src/pages/Register.tsx` | Auth-Form | 🔒 LOCKED |
| 9 | **Privacy** | `/privacy` | `src/pages/Privacy.tsx` | Legal-Layout | 🔒 LOCKED |
| 10 | **Terms** | `/terms` | `src/pages/Terms.tsx` | Legal-Layout | 🔒 LOCKED |
| 11 | **Imprint** | `/imprint` | `src/pages/Imprint.tsx` | Legal-Layout | 🔒 LOCKED |

---

## 🚨 ABSOLUTE VERBOTE (SYSTEMWEIT!)

### ❌ NIEMALS ERLAUBT (IM GESAMTEN SYSTEM):

#### 1. **Master-Komponenten-Änderungen** ⚠️ NEU - KRITISCH!
- **Header** aus öffentlichem Bereich ändern/ersetzen
  - Einziger erlaubter Header: `src/components/layout/Header.tsx`
  - Keine alternativen Header-Komponenten im gesamten System
  - Keine Dashboard-Header, Unternehmer-Header, etc.
- **Hero** ändern/ersetzen
  - Einzige erlaubte Hero: `V28HeroPremium`
  - Keine alternativen Hero-Komponenten
  - Keine alten Hero-Varianten (V28HeroWithLiveDashboard, HeroIpadShowcase, etc.)
- **Sidebar** aus öffentlichem Bereich ändern/ersetzen
  - Einzige erlaubte Sidebar: Sidebar aus öffentlichem Bereich
  - Keine alternativen Sidebar-Komponenten
  - Keine Dashboard-Sidebar (außer mit identischem Design aus öffentlichem Bereich)

#### 2. **Design-Änderungen**
- Hero-Varianten ändern (`variant`, `backgroundVariant`)
- Farben anpassen (nur `slate-50` bis `slate-900` erlaubt)
- Spacing ändern (Padding, Margins, Gaps)
- Typografie ändern (Font-Größen, Weights, Line-Heights)
- Animationen hinzufügen/entfernen/ändern
- Shadows, Borders, Border-Radius ändern

#### 2. **Layout-Änderungen**
- Hero-Position/Größe ändern
- Section-Struktur ändern (PageShell, SectionLayout)
- Grid-Layouts ändern (Spalten, Rows, Gaps)
- Card-Strukturen ändern
- Component-Order ändern
- Responsive-Breakpoints ändern

#### 3. **Komponenten-Änderungen**
- V28-Komponenten durch andere ersetzen
- Neue UI-Komponenten hinzufügen
- Komponenten-Varianten ändern
- Props ändern (die visuellen Effekt haben)
- Custom CSS hinzufügen
- Inline-Styles hinzufügen

#### 4. **Content-Änderungen (ohne Freigabe)**
- Texte umformulieren
- Bilder austauschen
- Icons ändern
- CTAs ändern
- Meta-Descriptions ändern

---

## ✅ ERLAUBT (TECHNISCHE OPTIMIERUNGEN)

### ✅ NUR FOLGENDES IST ERLAUBT:

#### 1. **Performance-Optimierungen**
```typescript
// ✅ ERLAUBT
- React.memo() für teure Components
- useMemo() / useCallback() für Berechnungen
- Lazy Loading für Images/Components
- Code-Splitting
- Bundle-Size Optimierungen
- Caching (React Query, Service Worker)
```

#### 2. **SEO-Optimierungen**
```typescript
// ✅ ERLAUBT
- Meta-Tags optimieren (ohne Content-Änderung)
- Schema.org Structured Data
- Open Graph Tags
- Canonical URLs
- Sitemap Updates
- robots.txt Anpassungen
```

#### 3. **Accessibility-Verbesserungen**
```typescript
// ✅ ERLAUBT
- ARIA-Labels hinzufügen
- Keyboard-Navigation verbessern
- Screen-Reader Optimierungen
- Focus-Management
- Color-Contrast Fixes (nur wenn V32.0 konform)
- Alt-Texte für Bilder
```

#### 4. **Code-Qualität**
```typescript
// ✅ ERLAUBT
- Type-Safety verbessern (TypeScript)
- Error-Handling erweitern
- Logging hinzufügen
- Code-Refactoring (ohne UI-Änderung)
- Dead-Code entfernen
- Dependency-Updates
```

#### 5. **Security-Verbesserungen**
```typescript
// ✅ ERLAUBT
- Input-Validation (Zod)
- XSS-Prevention
- CSRF-Protection
- Content-Security-Policy
- Rate-Limiting
- SQL-Injection Prevention
```

#### 6. **Analytics & Monitoring**
```typescript
// ✅ ERLAUBT
- Analytics-Events hinzufügen
- Error-Tracking (Sentry)
- Performance-Monitoring
- User-Behavior Tracking
- A/B-Testing Vorbereitung (ohne UI-Änderung)
```

---

## 🛡️ ENFORCEMENT-STRATEGIE

### 1. **Code-Marker (VERPFLICHTEND)**

Alle gesperrten Seiten MÜSSEN folgenden Header haben:

```typescript
/* ==================================================================================
   ⚠️ LAYOUT FREEZE V32.1 - KEINE DESIGN/LAYOUT-ÄNDERUNGEN ERLAUBT!
   ==================================================================================
   DESIGN-SYSTEM: V28HeroPremium + V32.0 Slate-Only
   GESCHÜTZT: Hero, Sections, Grid-Layouts, Card-Struktur, Farben, Spacing
   ERLAUBT: Technische Optimierungen (Performance, SEO, A11y, Security)
   VERBOTEN: Design-Änderungen, neue Features, Layout-Anpassungen
   LETZTE FREIGABE: 2025-10-31
   ================================================================================== */
```

### 2. **Automatische Validation**

```bash
# MUSS vor jedem Commit laufen:
npm run validate:design-lock

# Prüft:
- Verbotene Komponenten (alte Hero-Varianten)
- Verbotene Farben (non-slate außer Status)
- Verbotene Inline-Styles
- Verbotene Custom-CSS
```

### 3. **AI-Agent Verhalten**

**BEI JEDER ANFRAGE ZU ÖFFENTLICHEN SEITEN:**

```typescript
function beforeAnyChange(file: string, changeType: string) {
  const publicPages = [
    'Home.tsx', 'Features.tsx', 'Pricing.tsx', 'About.tsx',
    'Contact.tsx', 'FAQ.tsx', 'Login.tsx', 'Register.tsx',
    'Privacy.tsx', 'Terms.tsx', 'Imprint.tsx'
  ];
  
  const designKeywords = [
    'hero', 'layout', 'design', 'color', 'spacing', 'padding',
    'margin', 'grid', 'flex', 'position', 'size', 'width',
    'height', 'font', 'text', 'background', 'border', 'shadow',
    'animation', 'transition', 'transform', 'component', 'variant'
  ];
  
  if (publicPages.some(page => file.includes(page))) {
    if (designKeywords.some(keyword => changeType.toLowerCase().includes(keyword))) {
      return STOP_AND_WARN(
        `⚠️ Die Seite ${file} ist durch Layout Freeze V32.1 geschützt.\n` +
        `Design-/Layout-Änderungen sind NICHT erlaubt.\n\n` +
        `Erlaubt sind nur:\n` +
        `- Performance-Optimierungen\n` +
        `- SEO-Verbesserungen\n` +
        `- Accessibility-Fixes\n` +
        `- Security-Improvements\n` +
        `- Code-Refactoring (ohne UI-Änderung)\n\n` +
        `Möchtest du eine dieser technischen Optimierungen durchführen?`
      );
    }
  }
  
  return PROCEED();
}
```

### 4. **Review-Checklist (VOR JEDEM PR)**

```yaml
DESIGN LOCK COMPLIANCE CHECK:
  - [ ] Keine Änderungen an Hero-Komponenten
  - [ ] Keine Farb-Änderungen (außer Status-Indicators)
  - [ ] Keine Layout-Änderungen
  - [ ] Keine neuen UI-Komponenten
  - [ ] Keine Spacing-Anpassungen
  - [ ] npm run validate:design-lock → 0 Errors
  - [ ] Nur technische Optimierungen durchgeführt
  - [ ] Code-Marker vorhanden
  - [ ] Dokumentation aktualisiert
```

---

## 🚨 NOTFALL-PROZEDUR

### **NUR bei kritischen Production-Bugs:**

1. **Eskalation an Pascal**
   - Bug-Beschreibung mit Screenshot
   - Impact-Assessment (Severity, User-Affected)
   - Vorgeschlagene Fix-Strategie

2. **Minimale Änderung**
   - Nur das absolut Notwendige ändern
   - Visuell identisch bleiben
   - Keine "Verbesserungen" einbauen

3. **Dokumentation**
   - Changelog-Entry erstellen
   - Known-Issue dokumentieren
   - Prevention-Strategy definieren

4. **Review & Rollback-Plan**
   - Sofortige Code-Review
   - Rollback-Ready
   - Monitoring aktivieren

---

## 📊 ERFOLGS-METRIKEN V32.1

### ✅ MUSS GELTEN:

```bash
✅ npm run build                      # Erfolgreich
✅ npm run validate:design-lock       # 0 kritische Errors
✅ npm run test:e2e                   # Alle Tests bestanden
✅ Lighthouse Score                   # >90 auf allen Seiten
✅ WCAG 2.1 AA Compliance            # 100%
✅ Bundle Size                        # <1.5MB
✅ First Contentful Paint            # <1.2s
✅ Time to Interactive               # <2.5s
```

### 📈 MONITORING:

```typescript
// Automatisches Monitoring (täglich):
- Design-System Compliance: 100%
- Slate-Only Colors: 95%+ (Status-Indicators Ausnahme)
- V28-Components Only: 100%
- Zero Custom CSS: 100%
- Zero Inline-Styles: 95%+ (3D-Background Ausnahme)
```

---

## 🔄 LIFECYCLE

### **Eine Seite wird GESPERRT wenn:**
1. Design ist final (V28 + V32.0 konform)
2. Alle Tests sind grün
3. Performance-Metriken erfüllt (>90 Lighthouse)
4. Accessibility-Metriken erfüllt (WCAG AA)
5. Pascal hat explizit freigegeben

### **Eine Seite wird ENTSPERRT wenn:**
1. **NIEMALS** (außer Notfall mit Pascal-Freigabe)
2. Redesign-Projekt mit vollständiger Dokumentation
3. Breaking-Change im Design-System

---

## 📚 REFERENZEN

### Verwandte Dokumentation:
- [`docs/DESIGN_SYSTEM_LOCK.md`](./DESIGN_SYSTEM_LOCK.md) - V32.0 Design-System
- [`docs/HERO_LOCK_FINAL_V32.0.md`](./HERO_LOCK_FINAL_V32.0.md) - Hero-System
- [`docs/COLOR_EXCEPTIONS.md`](./COLOR_EXCEPTIONS.md) - Farb-Ausnahmen
- [`docs/LAYOUT_FREEZE_PROTECTION_V18.5.1.md`](./LAYOUT_FREEZE_PROTECTION_V18.5.1.md) - Allgemeine Layout-Freeze Regeln
- [`docs/PRE_LOGIN_FOCUS.md`](./PRE_LOGIN_FOCUS.md) - Pre-Login Strategie

### Validation Scripts:
- [`scripts/validate-design-lock.ts`](../scripts/validate-design-lock.ts) - Automatische Validierung

---

**VERSION:** V32.1  
**STATUS:** 🔒 ABSOLUT GESPERRT  
**NÄCHSTE REVIEW:** Nur bei kritischem Bug oder Redesign-Projekt  
**VERANTWORTLICH:** Pascal (Product Owner)
