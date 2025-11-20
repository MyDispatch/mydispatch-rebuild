# 📚 SHARED KNOWLEDGE BASE V18.5.1

**Status:** Production-Ready  
**Letzte Aktualisierung:** 2025-10-24  
**Verantwortlich:** NeXify AI Development Agent  
**Klassifizierung:** Intern

---

## 📊 ZWECK

Diese Shared Knowledge Base (SKB) ist die **zentrale Single Source of Truth** für MyDispatch.

**VERPFLICHTEND:** VOR jeder Code-Änderung konsultieren!

---

## 🏗️ MOBILE-FIRST ARCHITEKTUR

### Breakpoints

```typescript
sm:  640px   md:  768px   lg:  1024px   xl:  1280px   2xl: 1536px
```

### Grid-Patterns

```tsx
// HERO-GRID (Marketing)
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">

// DASHBOARD-GRID (KPIs)
<DashboardGrid variant="kpis" gap="md">

// MOBILE-GRID-LAYOUT (Listen)
<MobileGridLayout searchPlaceholder="..." filters={...}>
```

### Touch-Targets

```css
min-h-[44px]  /* Minimum Touch-Target */
```

---

## 🎨 DESIGN-SYSTEM

### CI-Farben

```typescript
// ✅ RICHTIG: Semantic Tokens
className = "bg-primary text-foreground";

// ❌ FALSCH: Direkte Farben
className = "bg-[#EADEBD] text-white"; // VERBOTEN!
```

---

## 🔒 RECHTLICHE COMPLIANCE

### DSGVO (bei Formularen)

```tsx
<div className="text-xs text-muted-foreground mt-4 p-3 bg-muted/50 rounded-lg">
  <p>🔒 Ihre Daten werden verschlüsselt übertragen...</p>
</div>
```

### Footer-Links (VERPFLICHTEND)

```tsx
<Link to="/impressum">Impressum</Link>
<Link to="/datenschutz">Datenschutz</Link>
<Link to="/agb">AGB</Link>
```

---

## ⚙️ PERFORMANCE

### React Query (VERPFLICHTEND)

```typescript
const { data } = useQuery({
  queryKey: ["bookings"],
  queryFn: async () => {
    /* ... */
  },
});
```

---

## 🚫 ANTI-PATTERNS

❌ Desktop-First  
❌ Direkte Farben  
❌ Touch-Targets < 44px  
❌ Supabase ohne React Query

---

**Version:** 18.5.1 | **Status:** 🟢 PRODUCTION-READY
