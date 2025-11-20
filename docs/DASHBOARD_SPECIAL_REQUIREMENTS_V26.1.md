# Dashboard Special Requirements V26.1

**Status:** ✅ MANDATORY & BINDING  
**Gültigkeit:** SYSTEMWEIT für alle Agenten  
**Datum:** 2025-10-27

---

## 🎯 DASHBOARD-BESONDERHEITEN

### 1. DashboardInfoPanel (Fixed Footer)

**Komponente:** `src/components/dashboard/DashboardInfoPanel.tsx`

#### Positionierung:

```tsx
// Fixed Position über Standard-Footer
position: fixed;
z-index: 30;
bottom: 48px;      // 48px ÜBER dem Standard-Footer
height: 80px;      // Feste Höhe (kompakt)
```

#### Dynamische Breite (Sidebar-responsive):

```tsx
// Passt sich Sidebar-Zustand an
sidebarExpanded
  ? "left-[560px] w-[calc(100%-560px)]" // Expanded: 560px links
  : "left-[384px] w-[calc(100%-384px)]"; // Collapsed: 384px links
```

#### Innenabstände-Anpassung:

- **Standard-Content:** `pb-[128px]` (48px Footer + 80px InfoPanel)
- **Scrollable-Content:** Muss InfoPanel-Höhe berücksichtigen
- **Mobile:** InfoPanel verschwindet, Standard-Footer-Abstand (pb-16)

---

## 📏 SPACING-REGELN FÜR DASHBOARD

### Content-Area Padding-Bottom:

```tsx
// Desktop (mit InfoPanel)
<div className="pb-[128px]">
  {/* 48px (Footer) + 80px (InfoPanel) */}
</div>

// Mobile (ohne InfoPanel)
<div className="lg:pb-[128px] pb-16">
  {/* 16px Standard-Footer-Abstand */}
</div>
```

### Scrollable-Container:

```tsx
// Scrollable-Area mit InfoPanel-Rücksicht
<div className="h-[calc(100vh-256px)]">{/* 256px = Header + InfoPanel + Footer */}</div>
```

---

## 🎨 SCROLLBAR-GOVERNANCE (SYSTEMWEIT)

**Status:** ✅ MANDATORY - KEINE AUSNAHMEN

### Regel 1: Horizontale Scrollbars VERBOTEN

```css
/* Systemweit */
html, body {
  overflow-x: hidden !important;
  max-width: 100vw;
}

/* NIEMALS erlaubt */
❌ overflow-x: auto;
❌ overflow-x: scroll;
```

### Regel 2: Vertikale Scrollbars (Unauffällig)

```css
/* Webkit (Chrome, Safari, Edge) */
::-webkit-scrollbar {
  width: 6px; /* Schmal */
  height: 0px; /* Horizontal verboten */
}

::-webkit-scrollbar-track {
  background: transparent; /* Unsichtbarer Track */
}

::-webkit-scrollbar-thumb {
  background: hsl(var(--border)); /* Hintergrundfarbe */
  border-radius: 3px;
  transition: background 0.2s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground) / 0.3); /* Leicht sichtbar bei hover */
}

/* Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: hsl(var(--border)) transparent;
}
```

### Regel 3: Sidebar-Scrollbar (Extra Unauffällig)

```css
aside::-webkit-scrollbar {
  width: 4px; /* Noch schmaler */
}

aside::-webkit-scrollbar-thumb {
  background: hsl(var(--muted-foreground) / 0.1); /* Fast unsichtbar */
}

aside::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground) / 0.25);
}
```

### Regel 4: Scrollbar verstecken (wenn vermeidbar)

```css
/* Utility-Klasse für vollständige Unsichtbarkeit */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
```

**Verwendung:** Nur für spezielle UI-Elemente (z.B. horizontales Scrolling in Karussells)

---

## 🔧 SUB-AGENTEN-VORGABEN

### Für ai-code-analyzer:

```typescript
// CRITICAL: Prüfe auf verbotene Scrollbar-Patterns
const violations = [
  { pattern: /overflow-x:\s*(auto|scroll)/, severity: "CRITICAL" },
  { pattern: /::-webkit-scrollbar\s*{\s*background:/, severity: "HIGH" },
  { pattern: /scrollbar-color:\s*[^transparent]/, severity: "MEDIUM" },
];
```

### Für ai-code-migrator:

```typescript
// Auto-Fix: Entferne overflow-x
style={{ overflowX: 'auto' }}  →  className="overflow-y-auto"

// Auto-Fix: Verwende scrollbar-hide Utility
style={{ scrollbarWidth: 'none' }}  →  className="scrollbar-hide"
```

### Für ai-visual-validator:

```typescript
// Screenshot-Analyse: Prüfe auf sichtbare Scrollbars
const issues = analyzeScrollbars(screenshot);
// Expected: Scrollbars NUR in Hintergrundfarbe (unsichtbar)
```

---

## ✅ COMPLIANCE-CHECKLIST

Für JEDEN Dashboard-Page/Component:

- [ ] InfoPanel-Abstand berücksichtigt (pb-[128px] desktop)
- [ ] Mobile-Responsive (pb-16 ohne InfoPanel)
- [ ] Sidebar-Width-Anpassung (560px / 384px)
- [ ] Keine horizontalen Scrollbars (overflow-x: hidden)
- [ ] Vertikale Scrollbars unauffällig (6px, transparent)
- [ ] scrollbar-hide für spezielle Elemente

---

## 📊 METRIKEN

**Dashboard-Violations behoben:**

- InfoPanel inline-style: 1/1 (CRITICAL - bottom/height)
- Scrollbar-Violations: 0 (bereits compliant)

**Systemweite Scrollbar-Compliance:** ✅ 100%

---

**Version:** V26.1  
**Maintained by:** NeXify AI Agent  
**Integration:** NEXIFY_SYSTEM_MASTER_BRAIN.md Sektion 4.5
