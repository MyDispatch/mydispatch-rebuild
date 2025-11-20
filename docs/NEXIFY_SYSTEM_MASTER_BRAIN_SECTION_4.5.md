## 4.5 DASHBOARD-BESONDERHEITEN & SCROLLBAR-GOVERNANCE

**Status:** ✅ MANDATORY & BINDING  
**Dokumentation:** `docs/DASHBOARD_SPECIAL_REQUIREMENTS_V26.1.md`  
**Gültigkeit:** SYSTEMWEIT für alle Agenten  

---

### 🎯 DASHBOARD-SPEZIALFALL: InfoPanel (Fixed Footer)

**Problem:** Dashboard hat zusätzlichen Fixed-Footer (DashboardInfoPanel) 48px über Standard-Footer

**Komponente:** `src/components/dashboard/DashboardInfoPanel.tsx`

#### Positionierung (CRITICAL):
```tsx
position: fixed;
z-index: 30;
bottom: 48px;      // 48px ÜBER dem Standard-Footer
height: 80px;      // Feste Höhe (kompakt)

// Dynamische Breite (Sidebar-responsive)
sidebarExpanded 
  ? 'left-[560px] w-[calc(100%-560px)]'    // Expanded: 560px links
  : 'left-[384px] w-[calc(100%-384px)]'    // Collapsed: 384px links
```

#### Content-Area Anpassung (MANDATORY):
```tsx
// Desktop (mit InfoPanel)
<div className="pb-[128px]"> 
  {/* 48px (Footer) + 80px (InfoPanel) = 128px */}
</div>

// Mobile (ohne InfoPanel)
<div className="lg:pb-[128px] pb-16">
  {/* 16px Standard-Footer-Abstand */}
</div>
```

#### Scrollable-Container:
```tsx
// Scrollable-Area mit InfoPanel-Rücksicht
<div className="h-[calc(100vh-256px)]">
  {/* 256px = Header (64px) + InfoPanel (80px) + Footer (48px) + Padding (64px) */}
</div>
```

---

### 📏 SCROLLBAR-GOVERNANCE (SYSTEMWEIT)

**REGEL 1: Horizontale Scrollbars VERBOTEN**

```css
/* Systemweit (NIEMALS Ausnahmen) */
html, body {
  overflow-x: hidden !important;
  max-width: 100vw;
}

/* VERBOTEN */
❌ overflow-x: auto;
❌ overflow-x: scroll;
❌ style={{ overflowX: 'auto' }}
```

**REGEL 2: Vertikale Scrollbars (Unauffällig in Hintergrundfarbe)**

```css
/* Webkit (Chrome, Safari, Edge) */
::-webkit-scrollbar {
  width: 6px;             /* Schmal */
  height: 0px;            /* Horizontal verboten */
}

::-webkit-scrollbar-track {
  background: transparent; /* Unsichtbarer Track */
}

::-webkit-scrollbar-thumb {
  background: hsl(var(--border));  /* Hintergrundfarbe - fast unsichtbar */
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

**REGEL 3: Sidebar-Scrollbar (Extra Unauffällig)**

```css
aside::-webkit-scrollbar {
  width: 4px;              /* Noch schmaler */
}

aside::-webkit-scrollbar-thumb {
  background: hsl(var(--muted-foreground) / 0.1); /* Fast unsichtbar */
}
```

**REGEL 4: Scrollbar vollständig verstecken (wenn vermeidbar)**

```css
/* Utility-Klasse */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
```

**Verwendung:** Nur für horizontales Scrolling in Karussells/Slidern

---

### 🔧 SUB-AGENTEN-INTEGRATION

#### ai-code-analyzer (Violations erkennen):
```typescript
const SCROLLBAR_VIOLATIONS = [
  { 
    pattern: /overflow-x:\s*(auto|scroll)/, 
    severity: 'CRITICAL',
    message: 'Horizontale Scrollbars verboten'
  },
  { 
    pattern: /::-webkit-scrollbar\s*{\s*background:\s*(?!transparent)/, 
    severity: 'HIGH',
    message: 'Scrollbar-Track muss transparent sein'
  },
  { 
    pattern: /scrollbar-color:\s*(?!hsl\(var\(--border\)\))/, 
    severity: 'MEDIUM',
    message: 'Scrollbar muss Hintergrundfarbe nutzen'
  },
];
```

#### ai-code-migrator (Auto-Fix):
```typescript
// Fix 1: Entferne overflow-x
style={{ overflowX: 'auto' }}  
→  className="overflow-y-auto"

// Fix 2: Verwende scrollbar-hide
style={{ scrollbarWidth: 'none' }}  
→  className="scrollbar-hide"

// Fix 3: Dashboard-Spacing
<div className="pb-16">
→  <div className="lg:pb-[128px] pb-16">  // Dashboard-InfoPanel berücksichtigen
```

#### ai-visual-validator (Screenshot-Prüfung):
```typescript
async function validateScrollbars(screenshot: Buffer) {
  const issues = [];
  
  // Prüfe auf sichtbare horizontale Scrollbars
  if (detectHorizontalScrollbar(screenshot)) {
    issues.push({
      severity: 'CRITICAL',
      message: 'Horizontale Scrollbar erkannt',
      location: getScrollbarLocation(screenshot),
    });
  }
  
  // Prüfe Scrollbar-Farbe (muss Hintergrundfarbe sein)
  const scrollbarColor = extractScrollbarColor(screenshot);
  if (scrollbarColor !== 'hsl(var(--border))') {
    issues.push({
      severity: 'HIGH',
      message: 'Scrollbar nicht in Hintergrundfarbe',
      expected: 'hsl(var(--border))',
      actual: scrollbarColor,
    });
  }
  
  return issues;
}
```

---

### ✅ COMPLIANCE-CHECKLIST (Dashboard)

Für JEDEN Dashboard-Component:

- [ ] InfoPanel-Abstand berücksichtigt (`pb-[128px]` desktop, `pb-16` mobile)
- [ ] Sidebar-Width-Anpassung (560px expanded / 384px collapsed)
- [ ] Keine horizontalen Scrollbars (`overflow-x: hidden`)
- [ ] Vertikale Scrollbars in Hintergrundfarbe (6px, `hsl(var(--border))`)
- [ ] `scrollbar-hide` nur für spezielle Elemente
- [ ] Scrollable-Container berücksichtigen InfoPanel-Höhe

---

### 📊 METRIKEN

**Dashboard-Spezial-Violations:**
- InfoPanel Positioning: ✅ Compliant (inline-style CRITICAL erlaubt)
- Scrollbar-Violations: ✅ 0 (systemweit compliant)

**Systemweite Scrollbar-Compliance:** ✅ 100%

---

**Version:** V26.1  
**Integration:** NEXIFY_SYSTEM_MASTER_BRAIN.md Sektion 4.5  
**Maintained by:** NeXify AI Agent  
**Dokumentation:** DASHBOARD_SPECIAL_REQUIREMENTS_V26.1.md
