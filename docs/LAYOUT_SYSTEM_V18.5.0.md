# LAYOUT-SYSTEM V18.5.0 - VOLLSTÄNDIGE SPEZIFIKATION

> **Basis:** Production-Code aus `/src/components/layout/`  
> **Status:** ✅ PRODUKTIV - Systemweite Layout-Architektur  
> **Datum:** 2025-01-15

---

## 📋 INHALTSVERZEICHNIS

1. [Layout-Architektur](#layout-architektur)
2. [Header-System](#header-system)
3. [Sidebar-System](#sidebar-system)
4. [Footer-System](#footer-system)
5. [Content-Container](#content-container)
6. [Responsive Verhalten](#responsive-verhalten)
7. [Layout-Wrapper](#layout-wrapper)

---

## 🏗️ LAYOUT-ARCHITEKTUR

### **Haupt-Layout-Struktur**

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│  AppSidebar (64px / 240px)                                       │
│  - Fixed Left                                                    │
│  - Hover-Expand                                                  │
│  - Z-Index: 40                                                   │
│                                                                   │
├──────┬────────────────────────────────────────────────────────────┤
│      │                                                            │
│      │  Header (60px)                                             │
│      │  - Fixed Top                                               │
│      │  - Dynamic Width (calc(100% - sidebar))                    │
│      │  - Z-Index: 30                                             │
│      │                                                            │
│  S   ├────────────────────────────────────────────────────────────┤
│  I   │                                                            │
│  D   │  Main Content                                              │
│  E   │  - Padding: px-4 sm:px-6 lg:px-8 py-6 sm:py-8            │
│  B   │  - Margin-Left: 64px → 240px (transition)                 │
│  A   │  - Min-Height: calc(100vh - 60px - 48px)                  │
│  R   │                                                            │
│      │                                                            │
│      │                                                            │
│      ├────────────────────────────────────────────────────────────┤
│      │                                                            │
│      │  Footer (48px, expandable to 80px)                        │
│      │  - Fixed Bottom                                            │
│      │  - Dynamic Width (calc(100% - sidebar))                    │
│      │  - Z-Index: 20                                             │
│      │                                                            │
└──────┴────────────────────────────────────────────────────────────┘
```

### **Layout-Komponenten-Hierarchie**

```typescript
<MainLayout>
  <AppSidebar 
    expanded={sidebarExpanded} 
    setExpanded={setSidebarExpanded} 
  />
  
  <div className="flex-1 overflow-x-hidden">
    <Header sidebarExpanded={sidebarExpanded} />
    
    <main className="min-h-[calc(100vh-60px-48px)]">
      {children}
    </main>
    
    <Footer sidebarExpanded={sidebarExpanded} />
  </div>
</MainLayout>
```

---

## 📱 HEADER-SYSTEM

### **Header-Spezifikation**

**File:** `src/components/layout/Header.tsx`

### **Struktur**

```typescript
interface HeaderProps {
  sidebarExpanded: boolean;
}

export function Header({ sidebarExpanded }: HeaderProps) {
  const { user, profile, company, signOut } = useAuth();
  const { permissions } = useAccountType();
  const navigate = useNavigate();

  return (
    <header 
      className="fixed top-0 right-0 z-30 bg-gradient-to-r from-primary via-primary to-primary/95 shadow-lg transition-[left,width] duration-300 ease-in-out border-b border-border/20" 
      style={{ 
        left: sidebarExpanded ? '240px' : '64px',
        width: sidebarExpanded ? 'calc(100% - 240px)' : 'calc(100% - 64px)'
      }}
    >
      <div className="px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Company */}
          {permissions.canAccessMasterDashboard ? (
            <img src={officialLogo} alt="MyDispatch" className="h-8 max-w-[160px]" />
          ) : (
            company?.logo_url ? (
              <img src={company.logo_url} alt={company.name} className="h-8 max-w-[160px]" />
            ) : (
              <span className="text-xl sm:text-2xl font-bold text-foreground">
                {company?.name || 'MyDispatch'}
              </span>
            )
          )}
          
          {user && (
            <div className="flex items-center gap-1.5">
              {/* Search Button */}
              <Button variant="ghost" size="sm" onClick={openSearch}>
                <Search className="h-4 w-4" />
              </Button>
              
              {/* AI Support */}
              <Button variant="ghost" size="sm" onClick={() => navigate('/kommunikation')}>
                <Bot className="h-4 w-4" />
              </Button>
              
              {/* User Info (Desktop) */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-background/10 rounded-lg">
                <User className="h-4 w-4" />
                <span className="font-medium">{profile?.first_name || user.email}</span>
              </div>
              
              {/* Logout */}
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Abmelden</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
```

### **Header-Eigenschaften**

```css
/* Positionierung */
position: fixed;
top: 0;
right: 0;
z-index: 30;

/* Höhe */
height: 60px; /* h-16 */

/* Hintergrund */
background: linear-gradient(to right, hsl(var(--primary)), hsl(var(--primary)), hsl(var(--primary) / 0.95));
border-bottom: 1px solid hsl(var(--border) / 0.2);
box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

/* Dynamische Breite */
left: 64px → 240px (transition: 300ms)
width: calc(100% - 64px) → calc(100% - 240px)

/* Padding */
padding-left: 24px;
padding-right: 24px;

/* Mobile */
@media (max-width: 768px) {
  left: 0;
  width: 100%;
}
```

### **Header-Komponenten**

#### **1. Logo-Bereich**
```typescript
// Master-Dashboard: MyDispatch-Logo
<img 
  src={officialLogo} 
  alt="MyDispatch - simply arrive" 
  width="140" height="37"
  className="h-8 max-w-[160px] object-contain drop-shadow-sm"
/>

// Interner Bereich: Company-Logo ODER Unternehmensname
company?.logo_url ? (
  <img 
    src={company.logo_url} 
    alt={company.name}
    width="149" height="40"
    className="h-8 max-w-[160px] object-contain drop-shadow-sm"
  />
) : (
  <span className="text-xl sm:text-2xl font-bold text-foreground tracking-tight drop-shadow-sm">
    {company?.name || 'MyDispatch'}
  </span>
)
```

#### **2. Aktions-Buttons**
```typescript
// Search (Global)
<Button
  variant="ghost"
  size="sm"
  onClick={openSearch}
  className="text-foreground hover:bg-foreground/10 hover:scale-105"
  title="Suche (Cmd+K / Strg+K)"
>
  <Search className="h-4 w-4" />
</Button>

// AI-Support
<Button
  variant="ghost"
  size="sm"
  onClick={() => navigate('/kommunikation')}
  className="text-foreground hover:bg-foreground/10 hover:scale-105"
  title="AI-Support & Fahrtenplanung"
>
  <Bot className="h-4 w-4" />
</Button>

// User Info (Desktop only)
<div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-background/10 rounded-lg text-sm text-foreground backdrop-blur-sm">
  <User className="h-4 w-4" />
  <span className="font-medium">{profile?.first_name || user.email}</span>
</div>

// Logout
<Button
  variant="ghost"
  size="sm"
  onClick={signOut}
  className="text-foreground hover:bg-destructive/20 hover:text-destructive transition-all"
>
  <LogOut className="h-4 w-4 sm:mr-2" />
  <span className="hidden sm:inline">Abmelden</span>
</Button>
```

### **Global Search Integration**

```typescript
// Trigger Global Search via Custom Event
const openSearch = () => {
  const event = new CustomEvent('open-global-search');
  window.dispatchEvent(event);
};

// In Search Component (z.B. GlobalSearchDialog.tsx)
useEffect(() => {
  const handleOpenSearch = () => setIsOpen(true);
  window.addEventListener('open-global-search', handleOpenSearch);
  return () => window.removeEventListener('open-global-search', handleOpenSearch);
}, []);
```

---

## 🎛️ SIDEBAR-SYSTEM

### **Sidebar-Spezifikation**

**File:** `src/components/layout/AppSidebar.tsx`

### **Struktur**

```typescript
interface AppSidebarProps {
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
}

export function AppSidebar({ expanded, setExpanded }: AppSidebarProps) {
  const { company, user } = useAuth();
  const { accountType } = useAccountType();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Hover-Handler mit Debounce
  const handleMouseEnter = useCallback(() => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
    }
    setExpanded(true);
  }, [setExpanded]);

  const handleMouseLeave = useCallback(() => {
    leaveTimeoutRef.current = setTimeout(() => {
      setExpanded(false);
    }, 200);
  }, [setExpanded]);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full bg-background z-40 flex flex-col shadow-sm",
        "transition-[width] duration-300 ease-in-out",
        expanded ? "w-60" : "w-[64px]"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Logo Area */}
      <div className="h-16 flex items-center justify-center">
        {expanded ? (
          <div className="flex items-center gap-2 px-4 animate-fade-in">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70">
              <span className="text-xs font-bold text-primary-foreground">MD</span>
            </div>
            <span className="text-base font-bold text-foreground">MyDispatch</span>
          </div>
        ) : (
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/70">
            <span className="text-sm font-bold text-primary-foreground">MD</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 flex flex-col justify-evenly overflow-hidden">
        {visibleSections.map((section) => (
          <div key={section.label}>
            {expanded && (
              <h3 className="text-[10px] font-semibold text-muted-foreground uppercase">
                {section.label}
              </h3>
            )}
            <div className="space-y-2">
              {section.items.map((item) => (
                <NavLink to={item.url} className={navLinkClasses}>
                  <item.icon className="h-5 w-5" />
                  {expanded && <span>{item.title}</span>}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      {expanded && (
        <div className="px-4 py-3 border-t border-border/50">
          {accountType === 'master' ? (
            <button onClick={() => navigate('/master')}>
              Master-Account
            </button>
          ) : (
            <p className="text-[10px] text-muted-foreground">
              Hover zum Minimieren
            </p>
          )}
        </div>
      )}
    </aside>
  );
}
```

### **Sidebar-Eigenschaften**

```css
/* Positionierung */
position: fixed;
left: 0;
top: 0;
height: 100vh;
z-index: 40;

/* Breite (Dynamisch) */
width: 64px;  /* Collapsed */
width: 240px; /* Expanded */
transition: width 300ms ease-in-out;

/* Hintergrund */
background: hsl(var(--background));
box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);

/* Layout */
display: flex;
flex-direction: column;
```

### **Menü-Struktur**

```typescript
const menuStructure: MenuSection[] = [
  {
    label: 'HAUPTBEREICH',
    items: [
      { title: 'Dashboard', url: '/dashboard', icon: Home },
      { title: 'Aufträge', url: '/auftraege', icon: FileText }
    ]
  },
  {
    label: 'VERWALTUNG',
    items: [
      { title: 'Kunden', url: '/kunden', icon: Users },
      { title: 'Fahrer & Fahrzeuge', url: '/fahrer', icon: Users },
      { title: 'Schichten & Zeiten', url: '/schichtzettel', icon: Calendar },
      { title: 'Finanzen', url: '/rechnungen', icon: Receipt },
      { title: 'Kostenstellen', url: '/kostenstellen', icon: Euro },
      { title: 'Dokumente & Ablauf', url: '/dokumente', icon: FolderOpen }
    ]
  },
  {
    label: 'GESCHÄFT',
    items: [
      { title: 'Partner-Netzwerk', url: '/partner', icon: Handshake, requiredTariff: 'Business' },
      { title: 'Statistiken & Reports', url: '/statistiken', icon: TrendingUp, requiredTariff: 'Business' },
      { title: 'Landingpage-Editor', url: '/landingpage-konfigurator', icon: Building2, requiredTariff: 'Business' }
    ]
  },
  {
    label: 'SYSTEM',
    items: [
      { title: 'Kommunikation', url: '/kommunikation', icon: MessageSquare },
      { title: 'Einstellungen', url: '/einstellungen', icon: Settings }
    ]
  }
];
```

### **Navigation-Item States**

```typescript
// Active State
const isActive = location.pathname === item.url;

// NavLink Styling
const navLinkClasses = cn(
  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium",
  "transition-all duration-200 relative",
  isActive 
    ? "bg-primary text-foreground shadow-sm font-semibold" 
    : "text-muted-foreground hover:bg-muted hover:text-foreground",
  !expanded && "justify-center px-0 w-full"
);
```

### **Tariff-Gating (Business+)**

```typescript
// Gesperrte Features für Starter-Nutzer
const showUpgradeTooltip = isBusinessFeature && !hasBusinessAccess;

if (showUpgradeTooltip) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-help opacity-60">
            {menuItem}
            <Lock className="h-4 w-4 ml-auto text-muted-foreground" />
          </div>
        </TooltipTrigger>
        <TooltipContent side="right">
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <Sparkles className="h-4 w-4 text-foreground" />
              <div>
                <p className="font-semibold text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground">
                  Dieses Feature ist im Business-Tarif verfügbar
                </p>
              </div>
            </div>
            <Button size="sm" onClick={() => navigate('/einstellungen?tab=abonnement')}>
              <Crown className="h-4 w-4 mr-1.5" />
              Jetzt upgraden
            </Button>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
```

---

## 📄 FOOTER-SYSTEM

### **Footer-Spezifikation**

**File:** `src/components/layout/Footer.tsx`

### **Struktur**

```typescript
interface FooterProps {
  sidebarExpanded: boolean;
}

export function Footer({ sidebarExpanded }: FooterProps) {
  return (
    <footer 
      className="fixed bottom-0 right-0 z-20 bg-gradient-to-t from-background to-background/95 border-t border-border/50 transition-all duration-300 hover:py-8 py-3 overflow-hidden group backdrop-blur-sm" 
      style={{ 
        left: sidebarExpanded ? '240px' : '64px',
        width: sidebarExpanded ? 'calc(100% - 240px)' : 'calc(100% - 64px)'
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
          {/* Copyright */}
          <div className="text-center sm:text-left font-medium">
            © {new Date().getFullYear()} MyDispatch • Made in Germany
          </div>
          
          {/* Links (Hover-Expand) */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 opacity-0 group-hover:opacity-100 transition-all duration-300 max-h-0 group-hover:max-h-24">
            <Link to="/impressum" className="hover:text-primary hover:scale-105 transition-all">
              Impressum
            </Link>
            <Link to="/datenschutz" className="hover:text-primary hover:scale-105 transition-all">
              Datenschutz
            </Link>
            <Link to="/agb" className="hover:text-primary hover:scale-105 transition-all">
              AGB
            </Link>
            <Link to="/nexify-support" className="hover:text-primary hover:scale-105 transition-all">
              NeXify Support
            </Link>
            
            {/* Öffnungszeiten (Desktop) */}
            <div className="hidden lg:flex">
              <OpeningHours compact showIcon />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
```

### **Footer-Eigenschaften**

```css
/* Positionierung */
position: fixed;
bottom: 0;
right: 0;
z-index: 20;

/* Höhe */
height: 48px;        /* py-3 (12px * 2 = 24px) + content */
height: 80px;        /* hover:py-8 (32px * 2 = 64px) + content */
transition: padding 300ms ease-in-out;

/* Hintergrund */
background: linear-gradient(to top, hsl(var(--background)), hsl(var(--background) / 0.95));
border-top: 1px solid hsl(var(--border) / 0.5);
backdrop-filter: blur(4px);

/* Dynamische Breite */
left: 64px → 240px (transition: 300ms)
width: calc(100% - 64px) → calc(100% - 240px)

/* Mobile */
@media (max-width: 768px) {
  left: 0;
  width: 100%;
}
```

### **Hover-Expand-Mechanik**

```css
/* Normal State */
.footer-links {
  opacity: 0;
  max-height: 0;
  transition: all 300ms ease-in-out;
}

/* Hover State */
.footer:hover .footer-links {
  opacity: 1;
  max-height: 96px; /* 24rem → max-h-24 */
}
```

---

## 📦 CONTENT-CONTAINER

### **Main Content Area**

```typescript
<main 
  className={cn(
    "min-h-[calc(100vh-60px-48px)]", // Header + Footer
    "transition-[margin] duration-300 ease-in-out",
    sidebarExpanded ? "ml-60" : "ml-[64px]"
  )}
>
  {children}
</main>
```

### **DashboardLayout Wrapper**

```typescript
export function DashboardLayout({ children, title, description, canonical }: DashboardLayoutProps) {
  return (
    <>
      <SEOHead title={title} description={description} canonical={canonical} />
      
      <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Breadcrumbs />
        {children}
      </div>
    </>
  );
}
```

### **StandardPageLayout Wrapper**

```typescript
export function StandardPageLayout({ children, title, actions }: StandardPageLayoutProps) {
  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">{title}</h1>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
}
```

---

## 📱 RESPONSIVE VERHALTEN

### **Mobile-Anpassungen**

```css
/* Sidebar: Komplett ausgeblendet */
@media (max-width: 768px) {
  .app-sidebar {
    display: none;
  }
}

/* Header: Full-Width */
@media (max-width: 768px) {
  .header {
    left: 0 !important;
    width: 100% !important;
  }
}

/* Footer: Full-Width */
@media (max-width: 768px) {
  .footer {
    left: 0 !important;
    width: 100% !important;
  }
}

/* Main Content: Kein Margin-Left */
@media (max-width: 768px) {
  main {
    margin-left: 0 !important;
  }
}
```

### **Mobile-Navigation Alternative**

```typescript
// Hamburger-Menu für Mobile
{isMobile && (
  <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
    <SheetTrigger asChild>
      <Button variant="ghost" size="sm">
        <Menu className="h-5 w-5" />
      </Button>
    </SheetTrigger>
    <SheetContent side="left" className="w-60">
      <nav className="space-y-4">
        {menuStructure.map((section) => (
          <div key={section.label}>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
              {section.label}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => (
                <Link
                  to={item.url}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </SheetContent>
  </Sheet>
)}
```

---

## 🎨 LAYOUT-WRAPPER

### **MainLayout (Root)**

```typescript
export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const { isMobile } = useDeviceType();

  // Mobile: Keine Sidebar
  if (isMobile) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header sidebarExpanded={false} />
        <main className="flex-1 pt-16 pb-12">
          {children}
        </main>
        <Footer sidebarExpanded={false} />
      </div>
    );
  }

  // Desktop: Mit Sidebar
  return (
    <div className="min-h-screen flex bg-background overflow-x-hidden max-w-full">
      <AppSidebar expanded={sidebarExpanded} setExpanded={setSidebarExpanded} />
      
      <div 
        className={cn(
          "flex-1 overflow-x-hidden",
          "transition-[margin] duration-300 ease-in-out",
          sidebarExpanded ? "ml-60" : "ml-[64px]"
        )}
      >
        <Header sidebarExpanded={sidebarExpanded} />
        
        <main className="min-h-[calc(100vh-60px-48px)] pt-16 pb-12">
          {children}
        </main>
        
        <Footer sidebarExpanded={sidebarExpanded} />
      </div>
    </div>
  );
}
```

### **MarketingLayout (Öffentlich)**

```typescript
export function MarketingLayout({ children, currentPage }: MarketingLayoutProps) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isMobile } = useDeviceType();

  // Mobile: Sheet-Navigation
  if (isMobile) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <header className="h-16 fixed top-0 left-0 right-0 z-30 bg-primary border-b border-border/20">
          <div className="flex items-center justify-between px-4 h-full">
            <img src={officialLogo} alt="MyDispatch" className="h-8" />
            
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                {/* Mobile Navigation */}
              </SheetContent>
            </Sheet>
          </div>
        </header>
        
        <main className="flex-1 pt-16">
          {children}
        </main>
        
        <footer className="border-t border-border/20 py-6">
          {/* Footer Content */}
        </footer>
      </div>
    );
  }

  // Desktop: Hover-Sidebar
  return (
    <div className="min-h-screen flex bg-background">
      <aside 
        className={cn(
          "fixed left-0 top-0 h-full z-40 bg-background border-r border-border/20",
          "transition-[width] duration-300 ease-in-out",
          sidebarExpanded ? "w-60" : "w-[64px]"
        )}
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
      >
        {/* Marketing Navigation */}
      </aside>
      
      <div className="flex-1" style={{ marginLeft: sidebarExpanded ? '240px' : '64px' }}>
        <header className="h-16 fixed top-0 right-0 z-30 bg-primary">
          {/* Header Content */}
        </header>
        
        <main className="pt-16">
          {children}
        </main>
        
        <footer className="fixed bottom-0 right-0 z-20">
          {/* Footer Content */}
        </footer>
      </div>
    </div>
  );
}
```

---

## ✅ ZUSAMMENFASSUNG

### **Layout-Komponenten**

| Komponente | Höhe/Breite | Position | Z-Index | Transition |
|------------|-------------|----------|---------|------------|
| **AppSidebar** | 64px / 240px | Fixed Left | 40 | 300ms |
| **Header** | 60px | Fixed Top | 30 | 300ms |
| **Footer** | 48px / 80px | Fixed Bottom | 20 | 300ms |
| **Main Content** | calc(100vh - 108px) | Relative | - | 300ms |

### **Responsive Breakpoints**

- **Mobile (<768px):** Keine Sidebar, Hamburger-Menu, Full-Width Header/Footer
- **Tablet (768px-1024px):** Collapsed Sidebar (64px), adaptive Grids
- **Desktop (>1024px):** Hover-Expand Sidebar (64px → 240px)

### **Key Features**

✅ **Hover-Expand Sidebar** (Debounced, 200ms)  
✅ **Dynamic Header/Footer Width** (calc-based)  
✅ **Smooth Transitions** (300ms ease-in-out)  
✅ **Mobile-First Responsive** (Stack → Grid)  
✅ **Tariff-Gating UI** (Lock-Icon, Upgrade-Tooltip)  
✅ **Global Search Integration** (Custom Event)  
✅ **Breadcrumbs Support** (DashboardLayout)  
✅ **SEO-optimiert** (SEOHead Component)  

---

**Version:** V18.5.0  
**Letztes Update:** 2025-01-15  
**Status:** ✅ PRODUKTIV
