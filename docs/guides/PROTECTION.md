# 🛡️ MYDISPATCH REPOSITORY PROTECTION RULES

**Status:** ✅ AKTIV  
**Version:** 1.0.0  
**Datum:** 2025-01-31  
**Projekt:** MyDispatch - Taxi & Mietwagen Management System

---

## 🚨 KRITISCHE REGELN - NIEMALS VERLETZEN!

### 1. Design System V28.1 - IMMER VERWENDEN

**Regel:** Alle UI-Komponenten MÜSSEN aus dem V28.1 Design System stammen!

**Verboten:**

- ❌ Neue Custom Components ohne Registrierung
- ❌ Direkte shadcn/ui Components (außer als Basis für V28-Components)
- ❌ Inline-Styles außerhalb des Design Systems
- ❌ Hardcoded Colors (außer Design Tokens)

**Erlaubt:**

- ✅ V28Button, V28Badge, V28IconBox, etc.
- ✅ Design Tokens aus `tailwind.config.ts`
- ✅ Components aus `src/components/design-system/`
- ✅ Components aus `src/components/pricing/`

**Check:** Vor jeder Component-Erstellung → `docs/COMPONENT_REGISTRY_V28.1.md` prüfen!

---

### 2. Layout System - FROZEN

**Regel:** Das Layout-System ist FROZEN - keine Änderungen ohne explizite Genehmigung!

**Frozen Components:**

- `MainLayout.tsx` - Portal/Dashboard Layout
- `MarketingLayout.tsx` - Marketing-Seiten Layout
- `AppSidebar.tsx` - App-Navigation
- `DashboardSidebar.tsx` - Dashboard-Navigation
- `UnifiedHeader.tsx` - Marketing Header
- `UnifiedFooter.tsx` - Marketing Footer

**Verboten:**

- ❌ Layout-Struktur ändern
- ❌ Sidebar-Position ändern
- ❌ Header/Footer Struktur ändern
- ❌ Layout-Props ohne Genehmigung erweitern

**Erlaubt:**

- ✅ Content innerhalb von Layouts
- ✅ Bugfixes (mit Dokumentation)
- ✅ Performance-Optimierungen (mit Dokumentation)

---

### 3. Hero System V31.5 - MANDATORY

**Regel:** Alle Hero-Sections MÜSSEN `backgroundVariant="3d-premium"` verwenden!

**Verboten:**

- ❌ Andere backgroundVariants
- ❌ Custom Hero-Backgrounds ohne Genehmigung

**Erlaubt:**

- ✅ `backgroundVariant="3d-premium"` (Standard)
- ✅ Content-Anpassungen innerhalb der Hero

**Check:** `npm run validate:hero` vor jedem Commit!

---

### 4. Component Registry - MANDATORY CHECK

**Regel:** Vor JEDER neuen Component-Erstellung:

1. ✅ `docs/COMPONENT_REGISTRY_V28.1.md` prüfen
2. ✅ `filesExplorer.md` durchsuchen
3. ✅ Nur wenn NICHT existiert → neu erstellen
4. ✅ Sonst → bestehende Component verwenden/erweitern

**Verboten:**

- ❌ Duplikate erstellen
- ❌ Unregistrierte Components
- ❌ Components ohne Dokumentation

---

### 5. Knowledge Base - MANDATORY LOAD

**Regel:** Bei JEDEM Chat-Start:

1. ✅ `docs/NEXIFY_WIKI_V1.0.md` laden
2. ✅ `nexify-auto-load-context` Edge Function aufrufen
3. ✅ Success Criteria validieren
4. ✅ Bei Fehlern: Explizite Warnung

**Verboten:**

- ❌ Aktionen ohne Wiki-Load
- ❌ Hallucinated Functions erstellen
- ❌ Code aus dem Gedächtnis (ohne Validierung)

---

### 6. Code Quality Standards

**Regel:** Alle Code-Änderungen müssen:

1. ✅ TypeScript Strict Mode (wo möglich)
2. ✅ ESLint-Validierung bestehen
3. ✅ Prettier-Formatierung
4. ✅ Keine Console.logs in Production
5. ✅ Error Handling für alle async Operations

**Verboten:**

- ❌ `any` Types (außer Legacy-Code)
- ❌ Unbehandelte Promises
- ❌ Console.logs in Production-Code
- ❌ Inline Styles (außer Design Tokens)

---

### 7. Database Changes - MANDATORY REVIEW

**Regel:** Alle Database-Änderungen:

1. ✅ Migration-File erstellen
2. ✅ RLS aktivieren
3. ✅ Policies erstellen
4. ✅ Dokumentation

**Verboten:**

- ❌ Direkte DB-Änderungen ohne Migration
- ❌ Tables ohne RLS
- ❌ Policies ohne Testing

---

### 8. Performance - MANDATORY

**Regel:** Alle Code-Änderungen müssen:

1. ✅ Lazy Loading für Routes
2. ✅ Code Splitting
3. ✅ Image Optimization
4. ✅ Bundle Size Check

**Verboten:**

- ❌ Unnötige Re-Renders
- ❌ Große Bundle-Sizes ohne Begründung
- ❌ Unoptimierte Images

---

## 🔍 PRE-COMMIT CHECKS

**Automatisch (falls Husky aktiviert):**

```bash
npm run lint
npm run format:check
npm run type-check
npm run validate:hero
```

**Manuell (vor jedem Commit):**

1. ✅ Component Registry Check
2. ✅ Design System Compliance
3. ✅ Layout Freeze Check
4. ✅ Hero System Compliance
5. ✅ Knowledge Base Load

---

## 🚨 ERROR PREVENTION

### Hallucination Prevention

1. ✅ Component Registry Check
2. ✅ Code Snippet Check
3. ✅ Supabase Validation
4. ✅ Never Code from Memory

### Missing Context Prevention

1. ✅ Auto-Load bei Session-Start
2. ✅ Project Context Check
3. ✅ Global Knowledge Check

### Knowledge Loss Prevention

1. ✅ Self-Report nach Aktionen
2. ✅ Knowledge Base Update
3. ✅ Project History Update

---

## 📋 PROTECTION CHECKLIST

**Vor jeder Änderung:**

- [ ] Component Registry geprüft?
- [ ] Design System befolgt?
- [ ] Layout Freeze beachtet?
- [ ] Hero System befolgt?
- [ ] Knowledge Base geladen?
- [ ] Code Quality Standards erfüllt?
- [ ] Database Changes dokumentiert?
- [ ] Performance-Optimierungen geprüft?

---

## 🎯 SUCCESS CRITERIA

**Jede Änderung muss:**

- ✅ Design System V28.1 befolgen
- ✅ Layout Freeze respektieren
- ✅ Hero System V31.5 befolgen
- ✅ Component Registry aktualisieren
- ✅ Knowledge Base aktualisieren
- ✅ Code Quality Standards erfüllen
- ✅ Performance-Optimierungen berücksichtigen

---

**Pascal, diese Regeln schützen das Projekt vor fehlerhaften Eingriffen!** 🛡️
