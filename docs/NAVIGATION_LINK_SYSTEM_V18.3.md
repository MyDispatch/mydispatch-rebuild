# 🔗 Navigation & Link System V18.3

## 🎯 ZWECK

Dieses Dokument definiert **systemweite Standards für Verlinkungen, Navigation und Routing**, um sicherzustellen, dass alle Links zuverlässig funktionieren und zu den korrekten Zielseiten führen.

**Stand:** 2025-01-21  
**Version:** V18.3  
**Status:** 🔴 BINDEND

---

## 📋 ROUTING-ARCHITEKTUR

### React Router DOM Setup

MyDispatch verwendet `react-router-dom` für clientseitiges Routing:

```tsx
import { Link, useNavigate, useLocation } from 'react-router-dom';
```

### Haupt-Routes-Struktur

```
/                          → Home (Marketing)
/pricing                   → Pricing Page
/unternehmer              → Entrepreneur Page
/kontakt                  → Contact Page
/docs                     → Documentation
/faq                      → FAQ Page
/auth                     → Authentication (Login/Register)

/dashboard                → Dashboard (Protected)
/auftraege                → Orders (Protected)
/kunden                   → Customers (Protected)
/fahrer                   → Drivers (Protected)
/fahrzeuge                → Vehicles (Protected)
/rechnungen               → Invoices (Protected)
/schichtzettel            → Shift Schedules (Protected)
/dokumente                → Documents (Protected)
/partner                  → Partners (Protected)
/statistiken              → Statistics (Protected)
/einstellungen            → Settings (Protected)

/driver/*                 → Driver App (Separate Module)
```

---

## 🔗 LINK-TYPEN & VERWENDUNG

### 1. Interne Links (React Router)

**IMMER verwenden für:**
- Navigation innerhalb der App
- Alle internen Seiten
- CTAs zu anderen App-Seiten

**Syntax:**
```tsx
import { Link } from 'react-router-dom';

// Standard Internal Link
<Link to="/pricing" className="...">
  Preise ansehen
</Link>

// Link mit State (z.B. nach Login redirect)
<Link to="/auth" state={{ from: '/dashboard' }}>
  Anmelden
</Link>

// Programmatisches Navigieren
const navigate = useNavigate();
navigate('/dashboard');
```

**VERBOTEN:**
```tsx
❌ <a href="/pricing">Preise</a>  // FALSCH - lädt Seite neu!
❌ window.location.href = '/pricing'  // FALSCH - lädt Seite neu!
```

---

### 2. Externe Links

**Verwenden für:**
- Links zu externen Websites
- Social Media Links
- Partner-Websites
- Dokumentation (extern)

**Syntax:**
```tsx
// Externe Links MÜSSEN target="_blank" und rel haben
<a 
  href="https://example.com" 
  target="_blank" 
  rel="noopener noreferrer"
  className="..."
>
  Externe Seite
</a>
```

**Sicherheit:**
- `target="_blank"` → Öffnet in neuem Tab
- `rel="noopener noreferrer"` → Verhindert Security Issues

---

### 3. Legal Links (AGB, Datenschutz, Impressum)

**Footer-Links:**
```tsx
// Footer.tsx
<footer>
  <nav className="flex gap-4">
    <Link to="/agb" className="hover:underline">
      AGB
    </Link>
    <Link to="/datenschutz" className="hover:underline">
      Datenschutz
    </Link>
    <Link to="/impressum" className="hover:underline">
      Impressum
    </Link>
  </nav>
</footer>
```

**Diese Seiten MÜSSEN existieren und erreichbar sein!**

---

## 🛡️ PROTECTED ROUTES (Auth-Guards)

### Implementierung

```tsx
// In App.tsx oder Routes-Config
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
}

// Usage
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

---

## 🔄 REDIRECTS & NAVIGATION

### Nach Login Redirect

```tsx
// Auth.tsx - Nach erfolgreichem Login
const navigate = useNavigate();
const location = useLocation();

const handleLogin = async () => {
  await loginUser(email, password);
  
  // Redirect zu ursprünglicher Seite oder Dashboard
  const from = location.state?.from || '/dashboard';
  navigate(from, { replace: true });
};
```

### Nach Logout Redirect

```tsx
const handleLogout = async () => {
  await logoutUser();
  navigate('/auth', { replace: true });
};
```

### Programmatisches Navigieren

```tsx
const navigate = useNavigate();

// Einfache Navigation
navigate('/dashboard');

// Mit Replace (keine History)
navigate('/dashboard', { replace: true });

// Mit State
navigate('/auftraege', { 
  state: { 
    filter: 'active' 
  } 
});

// Zurück
navigate(-1);  // Go back
navigate(-2);  // Go back 2 steps
```

---

## 📱 MOBILE-BOTTOM-NAV Links

### Standard-Navigation (Mobile)

```tsx
// MobileBottomNav.tsx
const navItems = [
  { icon: Home, label: 'Home', path: '/dashboard' },
  { icon: ClipboardList, label: 'Aufträge', path: '/auftraege' },
  { icon: Users, label: 'Kunden', path: '/kunden' },
  { icon: Car, label: 'Fahrer', path: '/fahrer' },
  { icon: MoreHorizontal, label: 'Mehr', path: '/menu' },
];

<nav className="fixed bottom-0 left-0 right-0 z-50">
  {navItems.map((item) => (
    <Link 
      key={item.path}
      to={item.path}
      className={cn(
        "flex flex-col items-center min-h-[44px]",
        isActive(item.path) && "text-primary"
      )}
    >
      <item.icon className="h-5 w-5" />
      <span className="text-xs">{item.label}</span>
    </Link>
  ))}
</nav>
```

**KRITISCH:**
- Min-Height 44px für Touch-Targets!
- Active-State visuell hervorheben
- Alle Links müssen zu existierenden Seiten führen

---

## 🎯 CTA-BUTTONS & LINK-KONSISTENZ

### Pricing Page CTAs

```tsx
// Pricing.tsx - Tarif-Cards
<Button 
  asChild 
  className="w-full md:w-auto min-h-[44px]"
>
  <Link to="/auth">
    Jetzt starten
  </Link>
</Button>
```

### Marketing Page CTAs

```tsx
// Home.tsx - Hero Section
<div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
  <Button asChild size="lg" className="min-h-[44px]">
    <Link to="/auth">Kostenlos registrieren</Link>
  </Button>
  
  <Button asChild variant="outline" size="lg" className="min-h-[44px]">
    <Link to="/pricing">Preise ansehen</Link>
  </Button>
</div>
```

**REGEL:** ALLE CTAs MÜSSEN zu funktionalen Seiten führen!

---

## 🚨 404 FEHLERSEITE

### Implementierung

```tsx
// pages/NotFound.tsx
export function NotFound() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-lg text-muted-foreground">
          Seite nicht gefunden
        </p>
        <Button onClick={() => navigate('/dashboard')}>
          Zurück zum Dashboard
        </Button>
      </div>
    </div>
  );
}

// In Routes-Config
<Route path="*" element={<NotFound />} />
```

---

## ✅ LINK-VALIDIERUNGS-CHECKLIST

### Vor jeder Implementierung prüfen:

- [ ] **Interne Links:** Verwenden `<Link to="/path">`?
- [ ] **Externe Links:** Haben `target="_blank"` und `rel="noopener noreferrer"`?
- [ ] **Protected Routes:** Auth-Guards implementiert?
- [ ] **CTAs:** Führen zu existierenden Seiten?
- [ ] **Mobile-Nav:** Alle 5 Items verlinkt?
- [ ] **Footer:** AGB/Datenschutz/Impressum verlinkt?
- [ ] **404 Page:** Fehlerseite vorhanden?
- [ ] **Redirects:** Nach Login/Logout funktional?
- [ ] **Deep Links:** Direkte Links zu Unterseiten funktionieren?
- [ ] **Touch-Targets:** Alle Links ≥44px Höhe?

---

## 🔍 ACTIVE-STATE-DETECTION

### useLocation für Active-State

```tsx
import { useLocation, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to}
      className={cn(
        "px-4 py-2 rounded-lg transition-colors",
        isActive 
          ? "bg-primary text-primary-foreground" 
          : "hover:bg-muted"
      )}
    >
      {children}
    </Link>
  );
}
```

---

## 📊 NAVIGATION-PATTERNS

### Breadcrumbs

```tsx
// components/Breadcrumbs.tsx
export function Breadcrumbs({ items }: { items: { label: string; path?: string }[] }) {
  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2">
          {item.path ? (
            <Link to={item.path} className="hover:text-foreground">
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground">{item.label}</span>
          )}
          {idx < items.length - 1 && <ChevronRight className="h-4 w-4" />}
        </div>
      ))}
    </nav>
  );
}
```

### Sidebar Navigation

```tsx
// AppSidebar.tsx
const sidebarItems = [
  { icon: Home, label: 'Dashboard', path: '/dashboard', section: 'HAUPTBEREICH' },
  { icon: ClipboardList, label: 'Aufträge', path: '/auftraege', section: 'HAUPTBEREICH' },
  // ... mehr Items
];

<nav className="space-y-6">
  {sections.map((section) => (
    <div key={section}>
      <h3 className="text-xs font-semibold mb-2">{section}</h3>
      <div className="space-y-1">
        {sidebarItems
          .filter(item => item.section === section)
          .map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg",
                isActive(item.path) && "bg-muted text-primary"
              )}
            >
              <item.icon className="h-5 w-5" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
      </div>
    </div>
  ))}
</nav>
```

---

## 🎨 RESPONSIVE LINK-STYLING

### Touch-Optimierte Links (Mobile-First)

```tsx
// Mobile → Tablet → Desktop
<Link 
  to="/path"
  className={cn(
    // Mobile (< 768px)
    "min-h-[44px] px-4 py-2 text-sm",
    
    // Tablet (768px - 1023px)
    "md:min-h-[48px] md:px-6 md:py-2.5 md:text-base",
    
    // Desktop (≥ 1024px)
    "lg:px-8 lg:py-3 lg:text-lg",
    
    // States
    "hover:bg-muted active:bg-muted/80 transition-colors"
  )}
>
  Link Text
</Link>
```

---

## 🚀 BEST PRACTICES

### DO ✅
- Verwende `<Link>` für interne Navigation
- Setze `target="_blank"` und `rel` für externe Links
- Implementiere Auth-Guards für protected Routes
- Zeige Active-State für aktuelle Route
- Touch-Targets ≥44px
- 404 Page für ungültige Routes
- Redirects nach Login/Logout

### DON'T ❌
- Keine `<a href>` für interne Links
- Keine fehlenden `rel` Attribute bei externen Links
- Keine ungeschützten Protected Routes
- Keine CTAs zu nicht-existierenden Seiten
- Keine zu kleinen Touch-Targets
- Keine fehlende 404 Behandlung
- Keine Hard-Reloads mit `window.location`

---

## 📞 SUPPORT & DEBUGGING

### Häufige Link-Probleme

**Problem:** Link lädt Seite neu statt clientseitig zu navigieren
```tsx
❌ <a href="/path">Link</a>
✅ <Link to="/path">Link</Link>
```

**Problem:** Protected Route nicht geschützt
```tsx
❌ <Route path="/dashboard" element={<Dashboard />} />
✅ <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
```

**Problem:** Externe Links ohne Security
```tsx
❌ <a href="https://example.com">Link</a>
✅ <a href="https://example.com" target="_blank" rel="noopener noreferrer">Link</a>
```

---

**VERSION:** V18.3  
**LETZTE AKTUALISIERUNG:** 2025-01-21  
**STATUS:** 🔴 BINDEND
