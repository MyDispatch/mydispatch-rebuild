# AI-Agent Layout Freeze Prompt V18.5.1

**Status:** ✅ PRODUCTION-READY  
**Zweck:** Automatischer Layout-Freeze-Check für AI-Agenten

---

## 🎯 PFLICHT-CHECK VOR JEDER ÄNDERUNG

```typescript
// ============================================
// V32.1: SYSTEMWEITE DESIGN-HIERARCHIE (NEU!)
// ============================================
// Öffentliches Design = MASTER-DESIGN für GESAMTES System!
// Header/Hero/Sidebar aus öffentlichem Bereich = SYSTEMWEIT EINZIG ERLAUBT

// VERPFLICHTEND vor JEDER Code-Änderung an JEDER Seite:

// V32.1: ALLE ÖFFENTLICHEN SEITEN GESPERRT
const publicPages = [
  "src/pages/Home.tsx",
  "src/pages/Features.tsx",
  "src/pages/Pricing.tsx",
  "src/pages/About.tsx",
  "src/pages/Contact.tsx",
  "src/pages/FAQ.tsx",
  "src/pages/Login.tsx",
  "src/pages/Register.tsx",
  "src/pages/Privacy.tsx",
  "src/pages/Terms.tsx",
  "src/pages/Imprint.tsx",
];

// V18.5: DASHBOARD-SEITEN GESPERRT
const dashboardPages = ["src/pages/Index.tsx", "src/pages/Auftraege.tsx"];

// V32.1: MASTER-KOMPONENTEN (SYSTEMWEIT!)
const masterComponents = {
  header: "src/components/layout/Header.tsx", // EINZIGER erlaubter Header
  hero: "V28HeroPremium", // EINZIGE erlaubte Hero
  sidebar: "src/components/layout/Sidebar.tsx", // EINZIGE erlaubte Sidebar
};

// Alle geschützten Seiten
const protectedFiles = [...publicPages, ...dashboardPages];

// Design/Layout Keywords (ERWEITERT für V32.1)
const masterKeywords = ["header", "hero", "sidebar"]; // KRITISCH!
const layoutKeywords = [
  "layout",
  "design",
  "color",
  "spacing",
  "padding",
  "margin",
  "grid",
  "flex",
  "position",
  "size",
  "width",
  "height",
  "font",
  "text",
  "background",
  "border",
  "shadow",
  "animation",
  "transition",
  "component",
  "variant",
  "style",
  "css",
  "tailwind",
  "className",
];

// CHECK 1: Geschützte Seiten + Design-Änderung
if (
  protectedFiles.some((f) => file.includes(f)) &&
  layoutKeywords.some((k) => changeType.toLowerCase().includes(k))
) {
  STOP_AND_WARN_USER();
  SHOW_LOCKED_PAGE_MESSAGE();
  SUGGEST_TECHNICAL_ALTERNATIVES();
  WAIT_FOR_EXPLICIT_APPROVAL();
  REQUIRE_DOCUMENTATION();
}

// CHECK 2: KRITISCH - Master-Komponenten (SYSTEMWEIT!)
if (masterKeywords.some((k) => changeType.toLowerCase().includes(k))) {
  STOP_IMMEDIATELY();
  SHOW_MASTER_DESIGN_WARNING();
  EXPLAIN_DESIGN_HIERARCHY();
  SUGGEST_CONTENT_CHANGES_ONLY();
  REQUIRE_PASCAL_APPROVAL();
}
```

---

## 🚨 WARNUNG (TEMPLATE)

### 🌐 MASTER DESIGN SYSTEM (V32.1) - KRITISCH!:

```
⚠️ MASTER DESIGN SYSTEM V32.1 GESCHÜTZT!

Das öffentliche Design ist das MASTER-DESIGN für das GESAMTE System.
Header, Hero und Sidebar aus dem öffentlichen Bereich sind SYSTEMWEIT EINZIG ERLAUBT.

❌ ABSOLUT VERBOTEN (SYSTEMWEIT):
- Alternative Header erstellen (DashboardHeader, UnternehmerHeader, etc.)
- Alternative Hero erstellen (DashboardHero, UnternehmerHero, etc.)
- Alternative Sidebar erstellen (DashboardSidebar, UnternehmerSidebar, etc.)
- Design-Änderungen an Master-Komponenten (Farben, Layout, Struktur)
- Abweichungen vom öffentlichen Design (auch im Dashboard, Unternehmer-Bereich, etc.)

✅ EINZIG ERLAUBT:
- Header: src/components/layout/Header.tsx (aus öffentlichem Bereich)
- Hero: V28HeroPremium (aus öffentlichem Bereich)
- Sidebar: src/components/layout/Sidebar.tsx (aus öffentlichem Bereich)

✅ NUR ERLAUBT (ohne Design-Änderung):
- Content anpassen (Texte, Navigation-Items)
- Technische Optimierungen (Performance, SEO, A11y)
- Funktionale Erweiterungen (mit identischem Design)

Siehe: docs/MASTER_DESIGN_SYSTEM_V32.1.md

Möchtest du Content-Anpassungen (ohne Design-Änderung) durchführen?
```

### 🌐 Für Öffentliche Seiten (V32.1):

```
⚠️ Die Seite [Dateiname] ist durch **DESIGN LOCK V32.1** absolut geschützt.
Design- und Layout-Änderungen sind NICHT erlaubt.

Diese Seite gehört zu den gesperrten öffentlichen Seiten:
✅ Home, Features, Pricing, About, Contact, FAQ
✅ Login, Register
✅ Privacy, Terms, Imprint

❌ VERBOTEN:
- Design-Änderungen (Farben, Spacing, Fonts, Komponenten)
- Layout-Änderungen (Hero, Sections, Grid-Struktur)
- Neue Features hinzufügen
- Komponenten austauschen
- Content ändern (ohne Freigabe)

✅ NUR ERLAUBT (Technische Optimierungen):
1. Performance verbessern (React.memo, Lazy Loading, Caching)
2. SEO optimieren (Meta-Tags, Schema.org, Open Graph)
3. Accessibility verbessern (ARIA, Keyboard-Navigation)
4. Security erhöhen (Input-Validation, XSS-Prevention)
5. Code refactoren (ohne UI-Änderung)
6. Error-Handling & Logging erweitern
7. Analytics & Monitoring hinzufügen

Möchtest du eine dieser technischen Optimierungen durchführen?
```

### 🏢 Für Dashboard-Seiten (V18.5):

```
⚠️ Die Seite [Dateiname] ist durch **Layout Freeze V18.5.1** geschützt.
Design-Änderungen sind nicht erlaubt.

**Erlaubt sind nur:**
1. Technische Optimierungen (Performance, SEO, A11y)
2. Datenoptimierungen (ohne UI-Änderung)
3. Code-Refactoring (Logik)

Möchtest du eine dieser Alternativen?
```

---

**VERSION:** V32.1 (Updated: 2025-10-31)  
**DATUM:** 2025-10-31  
**NEUE FEATURES:**

- Systemweite Master-Komponenten-Lock (Header/Hero/Sidebar)
- Öffentliches Design = MASTER für gesamtes System
- Design-Hierarchie enforcement
