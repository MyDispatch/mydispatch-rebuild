# LAYOUT FREEZE - QUICK REFERENCE V32.1

> **Für schnelle Checks während der Entwicklung**  
> **NEU in V32.1:** Öffentliches Design = MASTER-DESIGN (systemweit!)  
> **Siehe:** [`MASTER_DESIGN_SYSTEM_V32.1.md`](./MASTER_DESIGN_SYSTEM_V32.1.md)

## 🔒 GESCHÜTZTE SEITEN (LAYOUT FREEZE)

```yaml
# ============================================
# V32.1 - ALLE ÖFFENTLICHEN SEITEN GESPERRT
# ============================================
PUBLIC_PAGES_LOCKED:
  - src/pages/Home.tsx           # Home (Freigabe: 2025-10-31)
  - src/pages/Features.tsx       # Features (Freigabe: 2025-10-31)
  - src/pages/Pricing.tsx        # Pricing (Freigabe: 2025-10-31)
  - src/pages/About.tsx          # About (Freigabe: 2025-10-31)
  - src/pages/Contact.tsx        # Contact (Freigabe: 2025-10-31)
  - src/pages/FAQ.tsx            # FAQ (Freigabe: 2025-10-31)
  - src/pages/Login.tsx          # Login (Freigabe: 2025-10-31)
  - src/pages/Register.tsx       # Register (Freigabe: 2025-10-31)
  - src/pages/Auth.tsx           # Auth (Freigabe: 2025-01-30)
  - src/pages/Privacy.tsx        # Privacy (Freigabe: 2025-10-31)
  - src/pages/Terms.tsx          # Terms (Freigabe: 2025-10-31)
  - src/pages/Imprint.tsx        # Imprint (Freigabe: 2025-10-31)

# ============================================
# V28.1 - AUTH-KOMPONENTEN GESPERRT
# ============================================
AUTH_COMPONENTS_LOCKED:
  - src/components/layout/AuthPageLayout.tsx   # Auth Layout (Freigabe: 2025-01-30)
  - src/components/auth/AuthHeader.tsx         # Auth Header (Freigabe: 2025-01-30)
  - src/components/auth/AuthFooter.tsx         # Auth Footer (Freigabe: 2025-01-30)
  - src/components/design-system/V28AuthCard.tsx   # Auth Card (Freigabe: 2025-01-30)
  - src/components/design-system/V28AuthInput.tsx  # Auth Input (Freigabe: 2025-01-30)

# ============================================
# V18.5 - DASHBOARD-SEITEN GESPERRT
# ============================================
DASHBOARD_PAGES_LOCKED:
  - src/pages/Index.tsx          # Dashboard (Freigabe: 2025-01-26)
  - src/pages/Auftraege.tsx      # Aufträge (Freigabe: 2025-01-26)
```

**Code-Marker:** Beide Seiten haben jetzt den verpflichtenden Layout Freeze Header-Comment!

## ✅ SCHNELL-CHECK

```typescript
// VOR jeder Änderung an JEDER Seite:
const publicPages = [
  'Home.tsx', 'Features.tsx', 'Pricing.tsx', 'About.tsx', 'Contact.tsx',
  'FAQ.tsx', 'Login.tsx', 'Register.tsx', 'Auth.tsx', 'Privacy.tsx', 'Terms.tsx', 'Imprint.tsx'
];

const authComponents = [
  'AuthPageLayout.tsx', 'AuthHeader.tsx', 'AuthFooter.tsx',
  'V28AuthCard.tsx', 'V28AuthInput.tsx'
];

const dashboardPages = ['Index.tsx', 'Auftraege.tsx'];

const designKeywords = [
  'hero', 'layout', 'design', 'color', 'spacing', 'padding', 'margin',
  'grid', 'flex', 'position', 'size', 'font', 'text', 'background',
  'border', 'shadow', 'animation', 'component', 'variant'
];

const isPublicPage = publicPages.some(page => file.includes(page));
const isAuthComponent = authComponents.some(comp => file.includes(comp));
const isDashboardPage = dashboardPages.some(page => file.includes(page));
const isDesignChange = designKeywords.some(k => request.toLowerCase().includes(k));

if ((isPublicPage || isAuthComponent || isDashboardPage) && isDesignChange) {
  return STOP_AND_WARN();
}
```

## ❌ ABSOLUT VERBOTEN (SYSTEMWEIT!)

### ⚠️ Master-Komponenten (NEU - V32.1):
- **Header** ändern (nur Header aus öffentlichem Bereich erlaubt)
- **Hero** ändern (nur V28HeroPremium erlaubt)
- **Sidebar** ändern (nur Sidebar aus öffentlichem Bereich erlaubt)
- Alternative Header/Hero/Sidebar erstellen
- Dashboard-Header, Unternehmer-Header, etc. erstellen

### Design & Layout:
- Hero-Komponenten ändern (V28HeroPremium ist FINAL)
- Farben ändern (nur slate-50 bis slate-900)
- Spacing ändern (Padding, Margins, Gaps)
- Grid-Strukturen ändern
- Component-Varianten ändern
- Animationen hinzufügen/ändern
- Typografie ändern

### Komponenten:
- Neue UI-Komponenten hinzufügen
- Alte Komponenten zurückbringen
- Custom CSS hinzufügen
- Inline-Styles hinzufügen

### Content (ohne Freigabe):
- Texte umformulieren
- Bilder austauschen
- Icons ändern
- CTAs ändern

## ✅ NUR ERLAUBT

### Technische Optimierungen:
- Performance (React.memo, useMemo, Lazy Loading)
- SEO (Meta-Tags, Schema.org, Open Graph)
- Accessibility (ARIA, Keyboard-Navigation)
- Security (Input-Validation, XSS-Prevention)
- Code-Refactoring (ohne UI-Änderung)
- Error-Handling & Logging
- Analytics & Monitoring

## 🚨 WENN USER DESIGN/LAYOUT WILL

```
⚠️ MASTER DESIGN SYSTEM V32.1 GESCHÜTZT!

Das öffentliche Design ist das MASTER-DESIGN für das GESAMTE System.
Alle Bereiche (Dashboard, Unternehmer-Landingpage, etc.) MÜSSEN identisch sein.

⚠️ Diese Seite/Komponente ist durch DESIGN LOCK V32.1 geschützt.
Design- und Layout-Änderungen sind NICHT erlaubt.

Alle öffentlichen Seiten (Home, Features, Pricing, About, Contact, FAQ,
Login, Register, Privacy, Terms, Imprint) sind FINAL und GESPERRT.

✅ ERLAUBT sind nur technische Optimierungen:
- Performance-Verbesserungen
- SEO-Optimierungen
- Accessibility-Fixes
- Security-Improvements
- Code-Refactoring (ohne UI-Änderung)

❌ NICHT erlaubt:
- Design-Änderungen (Farben, Spacing, Fonts)
- Layout-Änderungen (Hero, Grid, Sections)
- Neue Features hinzufügen
- Komponenten austauschen

Möchtest du eine der erlaubten technischen Optimierungen durchführen?
```

## 📖 FULL DOCS

### V32.1 - Öffentliche Seiten:
- `docs/PUBLIC_PAGES_DESIGN_LOCK_V32.1.md` - VOLLSTÄNDIGE Spezifikation
- `docs/DESIGN_SYSTEM_LOCK.md` - Design-System V32.0
- `docs/HERO_LOCK_FINAL_V32.0.md` - Hero-System
- `docs/COLOR_EXCEPTIONS.md` - Farb-Ausnahmen

### V18.5 - Dashboard-Seiten:
- `docs/LAYOUT_FREEZE_PROTECTION_V18.5.1.md` - Allgemeine Regeln
- `docs/AI_AGENT_LAYOUT_FREEZE_PROMPT_V18.5.1.md` - AI-Agent Verhalten
