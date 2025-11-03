# COMPONENT REGISTRY V28.1

## ✅ ACTIVE COMPONENTS

### Design System
- **shadcn/ui:** Button, Dialog, Input, Card, Badge, etc.
- **V28 Design System:** V28Button, V28AuthCard, V28Badge, V28IconBox

### CitiesPremiumSection (V28.6 NEW!)
- **Path:** `src/components/sections/CitiesPremiumSection.tsx`
- **Purpose:** Premium-Lokales-SEO Section mit WaveBackground + Floating Orbs
- **Props:**
  - `cities: string[]` - Array von Stadt-Namen
  - `maxVisible?: number` - Anzahl initial sichtbarer Städte (default: 30)
- **Features:**
  - WaveBackground (top + bottom)
  - Floating Orbs Animation
  - Gestaffelte Fade-In Animation (0.02s Delay)
  - Hover-Effekte auf jeder Stadt
  - "Alle anzeigen" Toggle-Functionality
  - Trust-Line mit `/contact` Link
- **Usage:** `<CitiesPremiumSection cities={cityKeywords} maxVisible={30} />`

### ScrollToTopButton (V28.6 NEW!)
- **Path:** `src/components/shared/ScrollToTopButton.tsx`
- **Purpose:** Scroll-to-Top Button (erscheint ab 500px Scroll)
- **Features:**
  - Smooth-Scroll zum Seitenanfang
  - Fade-In/Out Animation
  - Fixed Position (bottom-20 right-6)
  - ARIA Accessible
- **Usage:** `<ScrollToTopButton />` (Am Ende jeder langen Seite)

### Hero Components (V28)

#### V28HeroPremium
- **Path:** `src/components/hero/V28HeroPremium.tsx`
- **Purpose:** Premium Hero Section mit Gradient + Animated Background
- **Props:**
  - `title: string` - Main headline
  - `description: string` - Subheadline
  - `primaryCTA?: { label: string; onClick: () => void }` - Primary CTA button
  - `secondaryCTA?: { label: string; onClick: () => void }` - Secondary CTA button
  - `showBackground?: boolean` - Show animated gradient background (default: true)
  - `className?: string` - Additional CSS classes
- **Usage:** `<V28HeroPremium title="..." description="..." primaryCTA={{ label: "Start", onClick: () => {} }} />`
- **Features:**
  - Animated gradient background (V28HeroBackground)
  - Responsive typography (text-4xl → text-6xl)
  - V28Button integration
  - WCAG 2.1 AA compliant

### Design System Components (V28)

#### V28MarketingSection
- **Path:** `src/components/design-system/V28MarketingSection.tsx`
- **Purpose:** Section wrapper for marketing pages with consistent spacing
- **Props:**
  - `background?: 'white' | 'canvas'` - Background variant (default: 'white')
  - `title?: string` - Section title (H2)
  - `description?: string` - Section description (centered, max-w-3xl)
  - `children: ReactNode` - Section content
  - `className?: string` - Additional CSS classes
  - `id?: string` - Anchor ID for navigation
- **Usage:** `<V28MarketingSection background="canvas" title="Features" description="..."> {children} </V28MarketingSection>`
- **Features:**
  - Consistent padding (py-16 md:py-24)
  - Centered content (max-w-7xl mx-auto)
  - Typography: H2 (text-3xl md:text-4xl) + Description (text-lg)
  - Background variants: white / slate-50 (canvas)

### Chat Components (V28.3)

#### V28ChatWidget
- **Path:** `src/components/chat/V28ChatWidget.tsx`
- **Purpose:** Floating Chat-Button mit DSGVO-Consent (V28.3)
- **Dependencies:** `ChatInterface` (lazy-loaded)
- **Usage:** `<V28ChatWidget />`
- **Props:** `className?: string`
- **Features:**
  - DSGVO-Consent-Dialog vor Chat-Öffnung
  - localStorage-basierte Consent-Speicherung
  - Link zur Datenschutzerklärung
  - WCAG 2.1 AA konform

#### ChatInterface
- **Path:** `src/components/chat/ChatInterface.tsx`
- **Purpose:** AI-Chat-Interface mit SSE-Streaming
- **Backend:** Edge Function `ai-support-chat`
- **Features:**
  - Begrüßungsnachricht mit Emoji
  - Suggested Questions (Landing-Mode)
  - Markdown-Rendering (sanitized)
  - SSE-Streaming für Live-Antworten
- **Props:** `onClose: () => void`

### ⚠️ DEPRECATED COMPONENTS

#### ❌ V28TaxiDashboardPreview (DEPRECATED V28.6)
- **Status:** ❌ DEPRECATED seit 2025-01-30
- **Location:** `src/components/hero/V28TaxiDashboardPreview.tsx`
- **Grund:** Design-Entscheidung - V28DashboardPreview ist Standard für ALLE Hero-Sektionen
- **Migration:** Nutze `V28DashboardPreview` für Hero-Sektionen
- **DO NOT USE:**
  ```typescript
  // ❌ DEPRECATED:
  import { V28TaxiDashboardPreview } from '@/components/hero/V28TaxiDashboardPreview';
  <V28TaxiDashboardPreview variant="support" />
  ```
- **STATTDESSEN:**
  ```typescript
  // ✅ CORRECT:
  import { V28DashboardPreview } from '@/components/home';
  <V28DashboardPreview title="my-dispatch.de/page" animationDelay="0.4s" />
  ```
- **Migration History:**
  - Contact.tsx (2025-01-30): Line 22 + Line 101 - Migrated to V28DashboardPreview
  - All other pages never used V28TaxiDashboardPreview

---

### Hero Components (V28.3)

#### V28DashboardPreview (STANDARD für ALLE Hero-Sektionen)
- **Path:** `src/components/home/V28DashboardPreview.tsx`
- **Purpose:** Premium Dashboard-Preview für Hero-Sektionen (V28.1 Standard)
- **Usage:** `<V28DashboardPreview title="my-dispatch.de/page" animationDelay="0.4s" />`
- **Props:**
  - `title?: string` - Browser-Tab-Title (z.B. "my-dispatch.de/features")
  - `animationDelay?: string` - CSS animation-delay (default: "0s")
  - `className?: string` - Additional CSS classes
- **Features:**
  - Browser-Mockup mit macOS Verkehrsampeln
  - Thematisch anpassbare Dashboard-Inhalte
  - KPIs, Activities, Chart
  - Responsive & GPU-beschleunigt
- **Variants:** Generic (Home), GPS-Focus (Features), Demo-Focus (Demo), Support-Focus (Contact), FAQ-Center (FAQ), Hilfe-Center (Docs), Company-Story (About)
- **RULE:** ✅ IMMER für Hero-Sektionen auf Pre-Login-Seiten nutzen!
- **Used On:** Home, Features, Contact, Demo, FAQ, Docs, About (7/8 pages)

#### V28iPadMockup (V28.5 Update)
- **Path:** `src/components/hero/V28iPadMockup.tsx`
- **Purpose:** Premium 3D-Tilted iPad Pro 12.9" Frame (V28.5)
- **Usage:** `<V28iPadMockup tiltDirection="left">{children}</V28iPadMockup>`
- **Props:** 
  - `children: ReactNode`
  - `className?: string`
  - `tiltDirection?: 'left' | 'right'` (Default: 'left')
- **Features:**
  - 3D-Transform: rotateY(-8deg) / rotateY(8deg) (left/right tilt)
  - Realistic iPad Frame (Home Button, Camera)
  - 3 Glow-Layers für maximale Tiefe
  - Hover-Scale-Effekt (scale-[1.03])
  - GPU-Beschleunigung (willChange, backfaceVisibility)
  - ARIA-Labels (role="img", aria-label)
  - Gestochenscharfe Bildqualität

#### V28TaxiDashboardPreview
- **Path:** `src/components/hero/V28TaxiDashboardPreview.tsx`
- **Purpose:** Taxi-authentisches Dashboard (V28.3)
- **Usage:** `<V28TaxiDashboardPreview variant="ipad" />`
- **Props:** `variant?: 'dashboard' | 'compact' | 'support' | 'mobile' | 'fleet' | 'ipad', animationDelay?: string`
- **Features:**
  - Standard: MIT Browser-Mockup
  - iPad-Variante: OHNE Browser-Mockup (nur Dashboard-Content)
  - KPIs: Fahrten, Umsatz, Fahrer, Fahrzeuge
  - Activities: Live-Fahrt, Abgeschlossen, Geplant

### Dashboard Components (V32.5 NEW!)

#### UniversalQuickActionsPanel
- **Path:** `src/components/dashboard/UniversalQuickActionsPanel.tsx`
- **Purpose:** Einheitliches Quick Actions Panel für alle Dashboards (V32.5)
- **Usage:** `<UniversalQuickActionsPanel quickActions={[...]} recentActivities={[...]} contextWidget={{...}} />`
- **Props:**
  - `quickActions: Array<{ icon, label, action, tooltip?, variant? }>` - Primäre Aktionen
  - `recentActivities?: Array<{ icon, iconColor?, title, time }>` - Letzte Aktivitäten
  - `contextWidget: { title, icon, content }` - Kontext-spezifisches Widget
  - `maxHeight?: string` - Default: calc(100vh - 200px)
  - `compact?: boolean` - Mobile-optimiert
- **Features:**
  - 3-Card-System (Quick Actions + Recent Activity + Context Widget)
  - Scroll-fähig mit scrollbar-hide
  - Responsive spacing (space-y-4)
  - Max-Height für Viewport-Optimierung

#### Context Widgets (V32.5 NEW!)

##### SystemStatusWidget
- **Path:** `src/components/dashboard/context-widgets/SystemStatusWidget.tsx`
- **Purpose:** API/DB/Backend Status Anzeige
- **Usage:** `<SystemStatusWidget />`
- **Features:** Online/Offline Badges, Letztes Update Timestamp
- **Used On:** Master, Einstellungen

##### QuickStatsWidget
- **Path:** `src/components/dashboard/context-widgets/QuickStatsWidget.tsx`
- **Purpose:** Flexible Stats-Anzeige (1-3 Stats)
- **Usage:** `<QuickStatsWidget stats={[{ label, value, icon }]} />`
- **Features:** Icon-Support, Responsive Grid
- **Used On:** Aufträge, Kunden, Fahrer, Rechnungen

##### ShortcutsWidget
- **Path:** `src/components/dashboard/context-widgets/ShortcutsWidget.tsx`
- **Purpose:** Link-Liste mit Icons
- **Usage:** `<ShortcutsWidget shortcuts={[{ label, href, icon }]} />`
- **Features:** Hover-Effekte, Keyboard-Navigation
- **Used On:** Office, Kommunikation

##### UpcomingEventsWidget
- **Path:** `src/components/dashboard/context-widgets/UpcomingEventsWidget.tsx`
- **Purpose:** Nächste 3 Events mit Timestamps
- **Usage:** `<UpcomingEventsWidget events={[{ title, time, icon }]} />`
- **Features:** Relative Zeit-Anzeige, Icon-Support
- **Used On:** Schichtzettel, Statistiken

### Hooks

#### useQuickActionsPanel (V32.5 NEW!)
- **Path:** `src/hooks/use-quick-actions-panel.tsx`
- **Purpose:** Context Hook für Quick Actions Panel Config (Cross-Component Communication)
- **Returns:** `{ config, setConfig }`
- **Usage:**
  ```typescript
  // Parent (MainLayout):
  const { config } = useQuickActionsPanel();
  
  // Child (Dashboard Page):
  const { setConfig } = useQuickActionsPanel();
  useEffect(() => {
    setConfig({ enabled: true, quickActions: [...], ... });
    return () => setConfig(null); // Cleanup
  }, [dependencies]);
  ```
- **Provider:** `<QuickActionsPanelProvider>` in App.tsx
- **Features:**
  - Child-to-Parent Communication
  - Automatic Cleanup via useEffect return
  - Type-safe Config Interface

#### useIntersectionObserver
- **Path:** `src/hooks/use-intersection-observer.ts`
- **Purpose:** Trigger animations when elements enter viewport
- **Returns:** `{ ref, isVisible }`
- **Options:** `threshold`, `rootMargin`, `triggerOnce`
- **Usage:** Scroll-triggered staggered animations

## ⚠️ DEPRECATED COMPONENTS

### ❌ DashboardInfoBoard.tsx (DEPRECATED V32.0)
- **Status:** ❌ ARCHIVED seit 2025-01-31
- **Location (Code):** `src/components/dashboard/DashboardInfoBoard.tsx` (existiert noch als File)
- **Location (Docs):** `docs/archive/deprecated/dashboardinfoboard/`
- **Grund:** Design-Entscheidung - 2 Sidebars (AppSidebar + DashboardSidebar) reichen für Übersichtlichkeit
- **Migration:** Nutze `DashboardSidebar` für area-spezifische Navigation & Quick Actions
- **DO NOT USE:**
  ```typescript
  // ❌ DEPRECATED:
  import { DashboardInfoBoard } from '@/components/dashboard/DashboardInfoBoard';
  <DashboardInfoBoard area="dashboard" sidebarExpanded={...} />
  ```
- **STATTDESSEN:**
  ```typescript
  // ✅ CORRECT:
  import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
  <DashboardSidebar sidebarExpanded={...} />
  ```

### ⚠️ V26 Components (22+ Components)
22+ V26-Components - **ESLint blocks new imports**

See `docs/V28_MIGRATION_GUIDE.md` for migration paths.

**Last Updated:** 2025-01-31 (V32.1)
