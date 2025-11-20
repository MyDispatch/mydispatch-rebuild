# Master Dashboard Schema V1.0 - FINALE REFERENZ

**Status:** Production-Ready | **Datum:** 2025-01-31 | **Version:** 1.0.0

## ZWECK

Dieses Schema definiert die **finale, perfektionierte Dashboard-Struktur** für MyDispatch.  
**VERPFLICHTEND:** Alle zukünftigen Dashboards MÜSSEN diesem Schema folgen!

---

## LAYOUT-ARCHITEKTUR

### Container-Struktur

```tsx
<div className="flex gap-8 pt-8 px-4 min-h-[calc(100vh-64px)]">
  {/* Main Content (flex-1) */}
  <div className="flex-1 space-y-8 min-w-0 pr-6">{/* Content */}</div>

  {/* Visual Separator (w-8, Multi-Layer) */}
  <div className="hidden xl:block w-8 relative flex-shrink-0">
    <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent" />
    <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-slate-100/60 via-slate-50/40 to-transparent pointer-events-none blur-[2px]" />
    <div className="absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-slate-100/40 to-transparent pointer-events-none blur-[1px]" />
  </div>

  {/* Quick Actions Panel */}
  <aside className="hidden xl:flex xl:flex-col w-[360px] 2xl:w-[384px] sticky top-[88px] self-start h-[calc(100vh-112px)] flex-shrink-0">
    <div className="flex-1 space-y-6 overflow-y-auto scrollbar-hide pr-4">{/* Cards */}</div>
  </aside>
</div>
```

### Width-Berechnung (XL Breakpoint - 1280px)

```
Total Viewport: 1280px
├─ Container Padding: 32px (16px left + 16px right)
├─ Available: 1248px
    ├─ Main Content: flex-1 (~856px calculated)
    │   └─ Right Padding: 24px (pr-6)
    ├─ Separator: 32px (w-8, gap-8)
    └─ Quick Actions: 360px (fixed)
```

### 2XL Breakpoint (1536px+)

```
Total Viewport: 1536px
├─ Container Padding: 32px
├─ Available: 1504px
    ├─ Main Content: flex-1 (~1088px)
    ├─ Separator: 32px
    └─ Quick Actions: 384px (expanded)
```

---

## BUTTON-SYSTEM

### Quick Action Primary Variant

**Definition (src/components/ui/button.tsx):**

```tsx
"quick-action-primary": "bg-slate-700 text-white border border-slate-700 hover:bg-slate-800 hover:text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 font-medium"
```

**Verwendung:**

```tsx
<Button variant="quick-action-primary" size="sm" className="w-full justify-start gap-2.5">
  <Icon className="w-4 h-4" />
  Action Label
</Button>
```

**Eigenschaften:**

- ✅ Primary-filled (slate-700 Background)
- ✅ Weiße Schrift (text-white, auch beim Hover!)
- ✅ Scale-Effekt (1.02 → 0.98)
- ✅ Shadow-lg beim Hover
- ✅ Font-Medium für bessere Lesbarkeit

---

## SPACING-SYSTEM (4px Grid)

| Token     | Value | Usage                           |
| --------- | ----- | ------------------------------- |
| `gap-2.5` | 10px  | **Icon-Text Gap in Buttons**    |
| `gap-3`   | 12px  | List Item Spacing               |
| `gap-4`   | 16px  | **Card Padding (Einheitlich)**  |
| `gap-6`   | 24px  | **Card-to-Card Spacing**        |
| `gap-8`   | 32px  | **Main Layout Gap (Separator)** |

### Card Spacing (Einheitlich für alle Cards)

```tsx
<Card className="border-slate-300 shadow-lg bg-white hover:shadow-xl transition-all duration-200 rounded-xl">
  <CardHeader className="pb-4 pt-4 px-4 border-b-2 border-slate-300 bg-slate-50/80">
    <h3 className="text-base font-bold text-slate-900">Title</h3>
  </CardHeader>
  <CardContent className="pt-4 pb-4 px-4 space-y-3">{/* Content */}</CardContent>
</Card>
```

**Wichtig:**

- Padding: `p-4` (16px) auf **allen Seiten** (Header + Content)
- Border: `border-b-2` (2px Dicke) für stärkere Trennung
- Background: `bg-slate-50/80` (80% Opacity) für subtilen Effekt
- Shadow: `shadow-lg` Base + `hover:shadow-xl`
- Radius: `rounded-xl` (12px, moderne Optik)

---

## CONTEXT-SENSITIVE QUICK ACTIONS

### Config-Objekt (Top of Page Component)

```tsx
import { useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import type { LucideIcon } from "lucide-react";

const [activeTab, setActiveTab] = useState("overview");
const { toast } = useToast();

const quickActionsMap: Record<
  string,
  Array<{ icon: LucideIcon; label: string; action: () => void }>
> = useMemo(
  () => ({
    overview: [
      {
        icon: IconComponent,
        label: "Action Name",
        action: () => toast({ title: "Action triggered" }),
      },
    ],
    quality: [
      {
        icon: PlayCircle,
        label: "Run Code Check",
        action: () => toast({ title: "Code Check läuft" }),
      },
    ],
    // ... weitere Tabs
  }),
  [toast]
);

const currentQuickActions = useMemo(
  () => quickActionsMap[activeTab] || quickActionsMap.overview,
  [activeTab, quickActionsMap]
);
```

### Dynamic Rendering in Quick Actions Card

```tsx
<Card>
  <CardHeader className="pb-4 pt-4 px-4 border-b-2 border-slate-300 bg-slate-50/80">
    <div className="flex items-center justify-between">
      <h3 className="text-base font-bold text-slate-900">Quick Actions</h3>
      <Badge variant="outline" className="text-xs font-normal">
        {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
      </Badge>
    </div>
  </CardHeader>
  <CardContent className="pt-4 pb-4 px-4 space-y-2">
    {currentQuickActions.map((action, idx) => (
      <Button
        key={idx}
        variant="quick-action-primary"
        size="sm"
        className="w-full justify-start gap-2.5"
        onClick={action.action}
        aria-label={`${action.label} ausführen`}
      >
        <action.icon className="w-4 h-4" />
        {action.label}
      </Button>
    ))}
  </CardContent>
</Card>
```

### Tab Integration

```tsx
<Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="quality">Quality</TabsTrigger>
    {/* ... */}
  </TabsList>
</Tabs>
```

---

## MOBILE FALLBACK (FAB + SHEET)

### Floating Action Button (Bottom-Right)

```tsx
{
  /* Mobile Quick Actions FAB (XL-Hidden) */
}
<div className="xl:hidden fixed bottom-6 right-6 z-50">
  <Sheet>
    <SheetTrigger asChild>
      <Button
        size="lg"
        aria-label="Quick Actions öffnen"
        className="h-14 w-14 rounded-full shadow-2xl bg-slate-700 hover:bg-slate-800 text-white border-2 border-white"
      >
        <Zap className="h-6 w-6" />
      </Button>
    </SheetTrigger>
    <SheetContent side="bottom" className="h-[70vh] rounded-t-2xl">
      <SheetHeader className="border-b border-slate-200 pb-4">
        <SheetTitle className="text-lg font-bold text-slate-900">Quick Actions</SheetTitle>
        <SheetDescription className="text-sm text-slate-600">
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Actions
        </SheetDescription>
      </SheetHeader>
      <div className="mt-6 space-y-2 pb-6">
        {currentQuickActions.map((action, idx) => (
          <Button
            key={idx}
            variant="quick-action-primary"
            size="sm"
            className="w-full justify-start gap-2.5"
            onClick={action.action}
            aria-label={`${action.label} ausführen`}
          >
            <action.icon className="w-4 h-4" />
            {action.label}
          </Button>
        ))}
      </div>
    </SheetContent>
  </Sheet>
</div>;
```

**Eigenschaften:**

- ✅ FAB Position: `fixed bottom-6 right-6 z-50`
- ✅ Nur Mobile: `xl:hidden` (Desktop versteckt)
- ✅ Sheet: Bottom-Slide-Up, `h-[70vh]` (70% Viewport Height)
- ✅ Rounded Top: `rounded-t-2xl` für moderne Optik
- ✅ Border-White: Hebt sich vom Hintergrund ab

---

## VISUAL SEPARATOR (MULTI-LAYER)

### 3-Layer-Depth-Effekt

```tsx
<div className="hidden xl:block w-8 relative flex-shrink-0">
  {/* Layer 1: Gradient Border (1px, centered) */}
  <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent" />

  {/* Layer 2: Left Shadow (blur-lg) */}
  <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-slate-100/60 via-slate-50/40 to-transparent pointer-events-none blur-[2px]" />

  {/* Layer 3: Right Shadow (blur-sm) */}
  <div className="absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-slate-100/40 to-transparent pointer-events-none blur-[1px]" />
</div>
```

**Technische Details:**

- **Container:** `w-8` (32px Breite) im `gap-8` des Flex-Containers
- **Layer 1 (Border):** 1px zentriert, Gradient von transparent → slate-300 → transparent
- **Layer 2 (Left Shadow):** 8px breit, blur-[2px], Gradient von left
- **Layer 3 (Right Shadow):** 6px breit, blur-[1px], Gradient von right
- **Effekt:** Deutliche 3D-Depth-Trennung zwischen Main und Sidebar

---

## QUICK ACTIONS PANEL (STRUKTUR)

### Aside Container

```tsx
<aside className="hidden xl:flex xl:flex-col w-[360px] 2xl:w-[384px] sticky top-[88px] self-start h-[calc(100vh-112px)] flex-shrink-0">
  <div className="flex-1 space-y-6 overflow-y-auto scrollbar-hide pr-4">
    {/* Quick Actions Card */}
    {/* Recent Activity Card */}
    {/* System Status Card */}
  </div>
</aside>
```

**Eigenschaften:**

- **Width:** `w-[360px]` (XL) → `w-[384px]` (2XL)
- **Position:** `sticky top-[88px]` (Header 64px + Spacing 24px)
- **Height:** `h-[calc(100vh-112px)]` (Viewport - Header - Spacing)
- **Flex-Shrink-0:** Verhindert Compression durch flex-1 Main Content
- **Kein Left-Padding:** Panel direkt am Container-Rand (Separator hat Abstand)

### Scrollable Wrapper (WICHTIG!)

```tsx
<div className="flex-1 space-y-6 overflow-y-auto scrollbar-hide pr-4">
```

**Eigenschaften:**

- **flex-1:** Nimmt gesamten verfügbaren Platz im Aside
- **overflow-y-auto:** Scrollbar bei langem Content (mehr als 3 Cards)
- **scrollbar-hide:** Scrollbar unsichtbar (cleaner Look)
- **pr-4:** Right Padding (16px) für Scrollbar-Platz
- **space-y-6:** 24px Gap zwischen Cards

---

## ACCESSIBILITY

### ARIA Labels (MANDATORY)

```tsx
{/* FAB Button */}
<Button aria-label="Quick Actions öffnen" className="...">

{/* Quick Action Buttons */}
<Button aria-label={`${action.label} ausführen`} onClick={action.action}>
```

### Focus Management

```tsx
{/* Card Focus */}
<Card className="... focus-within:ring-2 focus-within:ring-slate-400">

{/* Button Focus */}
<Button className="... focus-visible:ring-2 focus-visible:ring-ring">
```

### Keyboard Navigation

- ✅ **Tab:** Navigation durch alle interaktiven Elemente
- ✅ **Enter/Space:** Aktiviert Buttons
- ✅ **Escape:** Schließt Sheet (mobile)
- ✅ **Focus Ring:** Sichtbar via `focus-visible:`

---

## PERFORMANCE

### Optimizations

```tsx
// Memoize Quick Actions Map (komplexe Actions mit Dependencies)
const quickActionsMap = useMemo(() => ({
  overview: [...],
  quality: [...],
}), [toast]);

// Memoize Current Quick Actions (Re-Render nur bei Tab-Wechsel)
const currentQuickActions = useMemo(
  () => quickActionsMap[activeTab] || quickActionsMap.overview,
  [activeTab, quickActionsMap]
);

// useCallback für Action-Handlers (bei komplexen Logiken)
const handleDeployment = useCallback(() => {
  toast({ title: 'Deployment gestartet' });
  // ... weitere Logik
}, [toast]);
```

---

## RESPONSIVE BREAKPOINTS

### Mobile (< 1280px)

```css
- Quick Actions Panel: hidden (xl:hidden)
- Main Content: Full-Width (flex-1, w-full)
- Separator: hidden (xl:block entfernt)
- FAB: Visible (xl:hidden entfernt auf FAB-Container)
- Sheet: Bottom-up (h-[70vh], side="bottom")
```

### Desktop XL (1280px - 1535px)

```css
- Quick Actions Panel: w-[360px] (visible)
- Main Content: flex-1 (~856px calculated)
- Separator: w-8 (32px, visible)
- FAB: Hidden (xl:hidden)
```

### Desktop 2XL (>= 1536px)

```css
- Quick Actions Panel: w-[384px] (expanded)
- Main Content: flex-1 (~1088px calculated)
- Separator: w-8 (32px, visible)
```

---

## COPY-PASTE TEMPLATE

### Minimal Dashboard Setup

```tsx
import { useState, useMemo } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Zap, PlayCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { LucideIcon } from "lucide-react";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();

  // Quick Actions Config
  const quickActionsMap: Record<
    string,
    Array<{ icon: LucideIcon; label: string; action: () => void }>
  > = useMemo(
    () => ({
      overview: [
        { icon: PlayCircle, label: "Action 1", action: () => toast({ title: "Action 1" }) },
      ],
    }),
    [toast]
  );

  const currentQuickActions = useMemo(
    () => quickActionsMap[activeTab] || quickActionsMap.overview,
    [activeTab, quickActionsMap]
  );

  return (
    <div className="flex gap-8 pt-8 px-4 min-h-[calc(100vh-64px)]">
      {/* Main Content */}
      <div className="flex-1 space-y-8 min-w-0 pr-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">{/* Your Content */}</TabsContent>
        </Tabs>
      </div>

      {/* Separator (Multi-Layer) */}
      <div className="hidden xl:block w-8 relative flex-shrink-0">
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent" />
        <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-slate-100/60 via-slate-50/40 to-transparent pointer-events-none blur-[2px]" />
        <div className="absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-slate-100/40 to-transparent pointer-events-none blur-[1px]" />
      </div>

      {/* Quick Actions Panel */}
      <aside className="hidden xl:flex xl:flex-col w-[360px] 2xl:w-[384px] sticky top-[88px] self-start h-[calc(100vh-112px)] flex-shrink-0">
        <div className="flex-1 space-y-6 overflow-y-auto scrollbar-hide pr-4">
          <Card className="border-slate-300 shadow-lg bg-white hover:shadow-xl transition-all duration-200 rounded-xl">
            <CardHeader className="pb-4 pt-4 px-4 border-b-2 border-slate-300 bg-slate-50/80">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">Quick Actions</h3>
                <Badge variant="outline" className="text-xs font-normal">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4 pb-4 px-4 space-y-2">
              {currentQuickActions.map((action, idx) => (
                <Button
                  key={idx}
                  variant="quick-action-primary"
                  size="sm"
                  className="w-full justify-start gap-2.5"
                  onClick={action.action}
                  aria-label={`${action.label} ausführen`}
                >
                  <action.icon className="w-4 h-4" />
                  {action.label}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </aside>

      {/* Mobile FAB */}
      <div className="xl:hidden fixed bottom-6 right-6 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="lg"
              aria-label="Quick Actions öffnen"
              className="h-14 w-14 rounded-full shadow-2xl bg-slate-700 hover:bg-slate-800 text-white border-2 border-white"
            >
              <Zap className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[70vh] rounded-t-2xl">
            <SheetHeader className="border-b border-slate-200 pb-4">
              <SheetTitle className="text-lg font-bold text-slate-900">Quick Actions</SheetTitle>
              <SheetDescription className="text-sm text-slate-600">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Actions
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-2 pb-6">
              {currentQuickActions.map((action, idx) => (
                <Button
                  key={idx}
                  variant="quick-action-primary"
                  size="sm"
                  className="w-full justify-start gap-2.5"
                  onClick={action.action}
                  aria-label={`${action.label} ausführen`}
                >
                  <action.icon className="w-4 h-4" />
                  {action.label}
                </Button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
```

---

## VERSION HISTORY

### V1.0.0 (2025-01-31) - PRODUCTION-READY

**Features:**

- ✅ Multi-Layer Visual Separator (3 Layers)
- ✅ Quick Action Primary Button Variant
- ✅ Context-Sensitive Quick Actions (Dynamic per Tab)
- ✅ Mobile FAB + Sheet Fallback
- ✅ Unified Spacing System (4px Grid)
- ✅ Accessibility (ARIA Labels, Focus Management)
- ✅ Performance Optimizations (useMemo)
- ✅ Responsive Design (3 Breakpoints)

**Resolved Issues:**

- ✅ Freier Raum rechts (Panel nutzt optimale Breite)
- ✅ Quick Actions am Container-Rand (kein pl-6)
- ✅ Buttons: Primary-filled mit weißer Schrift
- ✅ Context-Sensitive Actions (ändern sich pro Tab)
- ✅ Mobile-friendly (FAB + Sheet)

---

## RELATED DOCS

- `docs/PROJECT_MEMORY.md` - System State & Projekt-Historie
- `docs/DASHBOARD_STANDARDS.md` - Dashboard Layout Standards
- `src/components/ui/button.tsx` - Button System
- `src/pages/Master.tsx` - Referenz-Implementation

---

## MAINTENANCE

**Last Updated:** 2025-01-31  
**Maintained by:** NeXify AI Agent (Claude 4.5 Sonnet)  
**Status:** ✅ PRODUCTION-READY - FINALE VERSION

**Änderungen an diesem Schema:**

- Nur bei Breaking Changes oder System-weiten Verbesserungen
- Alle Minor-Anpassungen werden in `PROJECT_MEMORY.md` dokumentiert
- Dieses Schema ist die **Quelle der Wahrheit** für alle Dashboard-Layouts

---

**🎉 FINALE BEMERKUNG:**

Dieses Schema vereint **alle Best Practices** für moderne Dashboard-Architektur:

- ✅ Präzise Layout-Berechnung
- ✅ Multi-Layer Separator (3D-Effekt)
- ✅ Context-Sensitive Quick Actions
- ✅ Mobile-First Approach
- ✅ Unified Spacing System
- ✅ Performance-Optimierungen
- ✅ Accessibility-Compliant
- ✅ Production-Ready

**Nutze dieses Schema für ALLE zukünftigen Dashboards!** 🚀
