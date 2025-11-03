# Header/Footer/Sidebar Governance V28.1

## 🎯 Zweck
Dieses Dokument definiert die MANDATORY Standards für alle Header-, Footer- und Sidebar-Komponenten im MyDispatch-Projekt. Jede Abweichung muss dokumentiert und begründet werden.

---

## 📦 Design Token Standard

### MANDATORY: Einzige Token-Quelle
- **PFLICHT**: Nutze `designTokens` aus `src/config/design-tokens.ts`
- **VERBOTEN**: Import von `unified-design-tokens.ts` (DEPRECATED seit V28.1)
- **VERBOTEN**: Hardcoded Farben, Z-Index, Transitions

### Correct Usage
```typescript
import { designTokens } from '@/config/design-tokens';

// ✅ CORRECT
style={{
  color: designTokens.colors.slate[900],
  backgroundColor: designTokens.colors.white,
  zIndex: designTokens.zIndex.header,
}}

// ❌ WRONG
import { UNIFIED_DESIGN_TOKENS } from '@/lib/design-system/unified-design-tokens';
style={{
  color: '#323D5E',
  backgroundColor: 'white',
  zIndex: 30,
}}
```

---

## 📏 Spacing Standard

### Desktop
- **Horizontal Padding**: `px-8` (32px)
- **Vertical Padding**: `py-4` (16px) für Header, `py-3` (12px) für Footer

### Mobile
- **Horizontal Padding**: `px-4` (16px)
- **Vertical Padding**: `py-3` (12px)

### Correct Implementation
```tsx
// Header/Footer
<div className={cn(
  "h-full flex items-center",
  isMobile ? "px-4" : "px-8"
)}>

// ❌ WRONG: Inconsistent padding overrides
<div className="px-8 pl-10"> // pl-10 überschreibt px-8 links
```

---

## ⏱️ Transition Standard

### MANDATORY Duration
- **ALL Components**: `300ms`
- **Timing Function**: `cubic-bezier(0.4, 0, 0.2, 1)`

### Correct Implementation
```tsx
// Header, Footer, Sidebar
style={{
  transitionDuration: '300ms',
  transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
}}

// ❌ WRONG
style={{
  transitionDuration: '600ms', // Too slow
}}
```

**Warum 300ms?**
- Schnell genug für snappy UX
- Langsam genug für smooth visuals
- Synchron über alle Layout-Elemente

---

## 📊 Z-Index Hierarchie

### MANDATORY Z-Index Layers
Definiert in `designTokens.zIndex`:

| Layer | Value | Usage |
|-------|-------|-------|
| `modal` | 100 | Modals, Dialogs |
| `cookieConsent` | 60 | Cookie Banner |
| `mobileHeader` | 50 | Mobile Header |
| `sidebar` | 40 | App Sidebar |
| `header` | 30 | Desktop Header |
| `footer` | 20 | Footer |
| `content` | 10 | Main Content |
| `base` | 0 | Base Layer |

### Correct Implementation
```tsx
// Header
style={{
  zIndex: designTokens.zIndex.header,
}}

// Sidebar
style={{
  zIndex: designTokens.zIndex.sidebar,
}}

// ❌ WRONG
className="z-30" // Hardcoded z-index
style={{ zIndex: 30 }} // Magic number
```

---

## 🎨 Color System

### Slate Palette (Professional Minimalism)
- **Primary Text**: `slate[900]` (Headlines, Buttons)
- **Secondary Text**: `slate[600]` (Body Text)
- **Tertiary Text**: `slate[300]` (Labels, Muted)
- **Borders**: `slate[200]`
- **Background**: `white`, `slate[50]` (Canvas)

### Correct Implementation
```tsx
style={{
  color: designTokens.colors.slate[900],
  backgroundColor: designTokens.colors.white,
  borderColor: designTokens.colors.slate[200],
}}

// ❌ WRONG: V26.1 Beige/Dunkelblau Colors
style={{
  color: 'hsl(42, 49%, 78%)', // Beige - DEPRECATED
  backgroundColor: 'hsl(225, 31%, 28%)', // Dunkelblau - DEPRECATED
}}
```

---

## 🔘 Button Style Standard

### MANDATORY Button Styling
```tsx
className="h-11 px-8 font-semibold rounded-lg text-sm bg-slate-600 text-white border border-slate-600 shadow-sm hover:bg-slate-700 hover:shadow-md transition-all duration-300"
```

### Button Anatomy
- **Height**: `h-11` (44px - WCAG Touch Target)
- **Padding**: `px-8` (Desktop), `px-6` (Mobile)
- **Border**: `border border-slate-600` (Match background)
- **Shadow**: `shadow-sm` default, `hover:shadow-md` on hover
- **Transition**: `transition-all duration-300`

### VERBOTEN
```tsx
// ❌ NO scale transforms
hover:scale-[1.02]

// ❌ NO inconsistent heights
h-9, h-10, h-12

// ❌ NO custom hover effects without shadow
hover:bg-slate-700 // Missing hover:shadow-md
```

---

## 🖼️ Logo Component Standard

### MANDATORY: Unified Logo Usage
```tsx
import { Logo } from '@/components/shared/Logo';

// ✅ CORRECT: Always use Logo component
<div onClick={() => navigate('/')}>
  <Logo className="h-7 w-auto" />
</div>

// ❌ WRONG: Conditional rendering mit company.logo_url
{company?.logo_url ? (
  <img src={company.logo_url} alt="Logo" />
) : (
  <span>{company?.name}</span>
)}
```

**Warum?**
- Einheitliche Darstellung Desktop/Mobile
- Logo ist immer SVG-optimiert
- Einfacher zu warten

---

## 📱 Mobile vs. Desktop Standards

### Mobile Header
- **Height**: `h-14` (56px)
- **Components**: Logo + Action Buttons
- **NO**: User Profile Card (zu groß)

### Desktop Header
- **Height**: `h-16` (64px)
- **Components**: Logo + Search + AI Button + User Profile + Logout
- **Sidebar-Adjustment**: `left` & `width` passen sich an Sidebar an

### Mobile Bottom Nav
- **Height**: `h-16` (64px)
- **Z-Index**: `designTokens.zIndex.mobileHeader`
- **Position**: `fixed bottom-0 left-0 right-0`

---

## 🧪 Testing Checklist

### Manual Tests
- [ ] **Desktop (1920x1080)**: Sidebar Hover → Header/Footer bewegen sich synchron (300ms)
- [ ] **Desktop**: Alle Paddings sind `px-8`
- [ ] **Mobile (375x667)**: Header/Footer haben `px-4`
- [ ] **Transitions**: Keine visuellen Ruckler beim Sidebar-Expand
- [ ] **Z-Index**: Keine Überlappungen zwischen Sidebar/Header/Footer

### Automated Tests
```bash
npm run test:e2e -- tests/e2e/header-footer-consistency.spec.ts
```

### Build Test
```bash
npm run build
# ✅ MUST: No warnings about UNIFIED_DESIGN_TOKENS
# ✅ MUST: No hardcoded z-index warnings
```

---

## 🚨 Common Mistakes

### 1. Spacing Override
```tsx
// ❌ WRONG
<div className="px-8 pl-10"> // pl-10 überschreibt px-8

// ✅ CORRECT
<div className="px-8">
```

### 2. Async Transitions
```tsx
// ❌ WRONG: Header 600ms, Sidebar 300ms
style={{ transitionDuration: '600ms' }}

// ✅ CORRECT: Beide 300ms
style={{ transitionDuration: '300ms' }}
```

### 3. Hardcoded Z-Index
```tsx
// ❌ WRONG
className="z-30"

// ✅ CORRECT
style={{ zIndex: designTokens.zIndex.header }}
```

### 4. Deprecated Tokens
```tsx
// ❌ WRONG
import { UNIFIED_DESIGN_TOKENS } from '@/lib/design-system/unified-design-tokens';

// ✅ CORRECT
import { designTokens } from '@/config/design-tokens';
```

---

## 📚 Reference Files

### Source of Truth
- `src/config/design-tokens.ts` - ALL design values
- `src/components/layout/Header.tsx` - Desktop Header reference
- `src/components/layout/Footer.tsx` - Desktop Footer reference
- `src/components/layout/AppSidebar.tsx` - Sidebar reference
- `src/components/layout/MobileHeader.tsx` - Mobile Header reference

### Documentation
- `docs/DESIGN_SYSTEM_UPDATE_V18.5.1.md` - Design history
- `docs/LAYOUT_SPACING_GUIDELINES.md` - Spacing rules

---

## 🔄 Migration Guide

### From V26.1 to V28.1

#### 1. Token Import
```tsx
// OLD (V26.1)
import { UNIFIED_DESIGN_TOKENS } from '@/lib/design-system/unified-design-tokens';

// NEW (V28.1)
import { designTokens } from '@/config/design-tokens';
```

#### 2. Color Migration
```tsx
// OLD
UNIFIED_DESIGN_TOKENS.colors.dunkelblau → designTokens.colors.slate[900]
UNIFIED_DESIGN_TOKENS.colors.beige → designTokens.colors.slate[100]

// NEW
style={{ color: designTokens.colors.slate[900] }}
```

#### 3. Z-Index Migration
```tsx
// OLD
className="z-30"

// NEW
style={{ zIndex: designTokens.zIndex.header }}
```

---

## ✅ Success Criteria

Nach erfolgreicher Implementierung MUSS gelten:

### Code Quality
- [ ] Keine Imports von `unified-design-tokens.ts`
- [ ] Alle Z-Index Werte aus `designTokens.zIndex`
- [ ] Alle Transitions sind 300ms
- [ ] Alle Paddings folgen dem Spacing Standard

### Visual Quality
- [ ] Sidebar Hover → Header/Footer bewegen sich synchron
- [ ] Keine visuellen Ruckler oder Sprünge
- [ ] Konsistente Farben über alle Komponenten
- [ ] Mobile und Desktop haben identische Logo-Darstellung

### Performance
- [ ] Build läuft ohne Warnungen
- [ ] Keine Console-Warnings über deprecated Tokens
- [ ] E2E Tests laufen durch

---

## 📅 Maintenance

### Weekly Review
- Prüfe neue PRs auf Einhaltung der Standards
- Valide Build-Output auf Warnings

### Quarterly Audit
- Review aller Header/Footer/Sidebar Komponenten
- Update dieser Dokumentation bei Änderungen

### Breaking Changes
Jede Änderung an diesem Standard MUSS:
1. In einem separaten PR dokumentiert werden
2. Ein Update dieser Dokumentation enthalten
3. Alle betroffenen Komponenten aktualisieren
4. E2E Tests updaten

---

**Version**: V28.1  
**Datum**: 2025-01-30  
**Status**: ✅ PRODUCTION READY  
**Letzte Änderung**: Vollständige Header/Footer/Sidebar Harmonisierung

---

## 🔗 Related Documents
- [Design System Update V18.5.1](./DESIGN_SYSTEM_UPDATE_V18.5.1.md)
- [Layout Spacing Guidelines](./LAYOUT_SPACING_GUIDELINES.md)
- [Component Registry](./COMPONENT_REGISTRY.md)
