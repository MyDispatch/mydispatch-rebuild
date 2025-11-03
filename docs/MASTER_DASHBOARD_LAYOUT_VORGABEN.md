# MASTER DASHBOARD LAYOUT VORGABEN V33.0

**Status:** ✅ FINAL - SYSTEMWEITE ARCHITEKTUR  
**Datum:** 2025-01-31  
**Version:** 33.0  

---

## 🎯 ZENTRALE LAYOUT-VORGABE

Alle Dashboard-Seiten MÜSSEN diesem Layout-Standard folgen:

```
┌─────────────┬───────────────────────────────────────┬─────────────────┐
│  AppSidebar │         Main Content Area             │ Schnellzugriff  │
│  (256/128)  │      (dynamisch, zentriert)           │   Sidebar       │
│             │                                        │   (320px)       │
│             │  ┌──────────────────────────────────┐ │                 │
│             │  │  Content mit Rundum-Padding      │ │  • Actions      │
│             │  │  (24px horizontal)               │ │  • Stats        │
│             │  │                                  │ │  • AI-Chat      │
│             │  └──────────────────────────────────┘ │                 │
└─────────────┴───────────────────────────────────────┴─────────────────┘
```

---

## 📐 LAYOUT-STRUKTUR (MANDATORY)

### 1. Main-Element Margins

```tsx
<main
  className={cn(
    "transition-[margin] duration-300",
    "pt-16 pb-32 px-6" // ✅ Header (64px) + Footer (128px) + Horizontal (24px)
  )}
  style={{
    marginLeft: sidebarExpanded ? '560px' : '384px', // ✅ AppSidebar + DashboardSidebar
    marginRight: '336px', // ✅ Schnellzugriff-Sidebar (320px + 16px Gap)
  }}
>
```

**WICHTIG:**
- ✅ `marginLeft`: Platz für linke Sidebars (AppSidebar + DashboardSidebar)
- ✅ `marginRight`: Platz für rechte Schnellzugriff-Sidebar (320px)
- ✅ `px-6`: Gleichmäßiger horizontaler Rundumabstand (24px)
- ✅ `pt-16`: Header-Offset (64px)
- ✅ `pb-32`: Footer + InfoPanel Offset (128px)

---

## 🎨 SCHNELLZUGRIFF-SIDEBAR (RECHTS)

### Position & Größe

```tsx
<aside className="fixed right-0 top-16 bottom-0 w-80 bg-slate-50 border-l border-slate-200 z-20 overflow-hidden hidden lg:flex flex-col">
```

**Specs:**
- Breite: **320px** (w-80)
- Position: **fixed right-0**
- Top-Offset: **64px** (Header)
- Bottom-Offset: **0** (bis Footer)
- Z-Index: **20** (über Content, unter Modals)

### Struktur (MANDATORY)

```tsx
<aside>
  {/* 1. Schnellzugriff Actions (flex-shrink-0) */}
  <div className="p-4 space-y-4 flex-shrink-0 bg-white border-b">
    <h3>Schnellzugriff</h3>
    <V28Button variant="primary" fullWidth>Aktion 1</V28Button>
    <V28Button variant="secondary" fullWidth>Aktion 2</V28Button>
    
    <Separator />
    
    <div className="space-y-2">
      <h4>Statistiken</h4>
      {/* Kompakte Stats */}
    </div>
  </div>

  {/* 2. AI-Chat Widget (flex-1, vollflächig) */}
  <div className="flex-1 p-4 overflow-hidden flex flex-col">
    <SidebarAIChat />
  </div>
</aside>
```

**WICHTIG:**
- ✅ Actions-Bereich: `flex-shrink-0` (feste Höhe)
- ✅ AI-Chat: `flex-1` (nimmt restlichen Platz)
- ✅ Gesamtes `<aside>`: `flex-col` + `overflow-hidden`

---

## 🤖 AI-CHAT WIDGET (SYSTEMWEIT)

### Komponente: `SidebarAIChat`

**Features:**
- ✅ Lovable AI Integration (google/gemini-2.5-flash)
- ✅ Streaming-Antworten (Token-by-Token)
- ✅ Kompaktes Design (320px Breite)
- ✅ Auto-Scroll-to-Bottom
- ✅ V28.1 Design System

**Edge Function:** `dashboard-ai-assistant`
- Model: `google/gemini-2.5-flash`
- System-Prompt: MyDispatch-spezifisch
- Rate-Limit & Payment-Error Handling

**Verwendung:**
```tsx
import { SidebarAIChat } from '@/components/dashboard/SidebarAIChat';

<div className="flex-1 p-4 overflow-hidden flex flex-col">
  <SidebarAIChat />
</div>
```

---

## 📋 RESPONSIVE-VERHALTEN

### Desktop (lg+)
- ✅ AppSidebar: 256px (expanded) / 128px (collapsed)
- ✅ DashboardSidebar: 384px (optional, seiten-spezifisch)
- ✅ Schnellzugriff-Sidebar: 320px (rechts)
- ✅ Main-Content: Dynamisch zwischen den Sidebars

### Tablet/Mobile (< lg)
- ✅ Alle Sidebars versteckt
- ✅ Main-Content: `marginLeft: 0`, `marginRight: 0`
- ✅ Content: `pt-14 pb-16` (Mobile Header + Footer)

```tsx
// Mobile View Override
{isMobile && (
  <main className="pt-14 pb-16 px-4">
    {/* Content ohne Sidebars */}
  </main>
)}
```

---

## ❌ VERBOTEN

### NIEMALS VERWENDEN:
- ❌ `QuickActionsOverlay` (alter floating Overlay)
- ❌ `PageHeaderWithKPIs` mit `quickActions` Prop
- ❌ Schnellzugriff in Header/Content-Bereich
- ❌ Main-Element ohne `marginRight` (überlappte Sidebar!)
- ❌ Sidebar ohne `overflow-hidden` (scroll-probleme!)

---

## 🔍 BETROFFENE SEITEN (MIGRATION)

**✅ Migriert (V33.0):**
1. `/rechnungen` - Rechnungen.tsx

**⚠️ TO-DO (10 Seiten):**
1. `/auftraege` - Auftraege.tsx
2. `/fahrer` - Fahrer.tsx
3. `/fahrzeuge` - Fahrzeuge.tsx
4. `/kunden` - Kunden.tsx
5. `/disposition` - Disposition.tsx
6. `/statistiken` - Statistiken.tsx
7. `/schichtzettel` - Schichtzettel.tsx
8: `/einstellungen` - Einstellungen.tsx
9. `/kommunikation` - Kommunikation.tsx
10. `/dokumente` - Dokumente.tsx

**Migration-Checklist pro Seite:**
- [ ] Main-Element: `marginLeft` + `marginRight` + `px-6`
- [ ] Schnellzugriff-Sidebar: rechts, 320px, flex-col
- [ ] AI-Chat-Widget: `SidebarAIChat` integriert
- [ ] Mobile-Anpassung: Sidebars versteckt
- [ ] Remove: `QuickActionsOverlay` + `PageHeaderWithKPIs.quickActions`

---

## 🎯 SUCCESS CRITERIA

Nach Migration JEDER Seite:

✅ **Layout:**
- Main-Content: Links + Rechts Abstand zu Sidebars
- Gleichmäßige Rundumabstände (24px horizontal)
- Schnellzugriff-Sidebar: Rechts, 320px, fixed

✅ **AI-Chat:**
- Vollflächig in Schnellzugriff-Sidebar
- Streaming-Antworten funktionieren
- Rate-Limit & Payment-Errors werden angezeigt

✅ **Responsive:**
- Desktop: Alle Sidebars sichtbar
- Mobile: Sidebars versteckt, Content Full-Width

✅ **Design:**
- V28.1 Design System (Slate-Palette)
- Konsistente Spacings (pt-16, pb-32, px-6)
- Keine Überlappungen oder Scroll-Probleme

---

## 🔗 SIEHE AUCH

- `docs/LAYOUT_SPACING_GUIDELINES.md` - Footer-Spacing Vorgaben
- `docs/BUTTON_GUIDELINES.md` - V28Button System
- `docs/V26_COMPONENT_LIBRARY.md` - Komponenten-Dokumentation
- `src/components/dashboard/SidebarAIChat.tsx` - AI-Chat Komponente
- `supabase/functions/dashboard-ai-assistant/index.ts` - Edge Function

---

**VERSION:** 33.0  
**STATUS:** PRODUCTION-READY  
**ÄNDERUNGEN:** Nur mit Freigabe!
