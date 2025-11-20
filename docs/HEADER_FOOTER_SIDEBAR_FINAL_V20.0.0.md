# HEADER/FOOTER/SIDEBAR FINAL SPECIFICATION V20.0.0

> **Status:** PRODUCTION LOCKED 🔒  
> **Datum:** 2025-01-26  
> **Priorität:** P-00 (HÖCHSTE)

---

## 🚨 KRITISCHE REGEL

**DIESE SPEZIFIKATION IST AB SOFORT UNVERÄNDERLICH!**

Alle Header, Footer und Sidebars im gesamten System MÜSSEN diese Spezifikation zu 100% einhalten.

**KEINE ABWEICHUNGEN ERLAUBT!**

---

## 📋 GOLDENE VORLAGEN

### 1. AuthHeader.tsx - DER STANDARD

```typescript
/* ALLE Header müssen diesem Design folgen */
<header
  className="fixed top-0 left-0 right-0 z-30 bg-background"
  style={{
    boxShadow: DESIGN_TOKENS.elevation.sm,
    borderBottom: `1px solid ${DESIGN_TOKENS.colors.border.DEFAULT}`,
  }}
>
  <div style={{ padding: `0 ${DESIGN_TOKENS.spacing.lg} 0 ${DESIGN_TOKENS.spacing.xl}` }}>
    <div className="flex items-center justify-between" style={{ height: '64px' }}>
      {/* Logo - STRIKTE max-width */}
      <img
        src={officialLogo}
        alt="MyDispatch - simply arrive"
        className="h-8 max-w-[120px] sm:max-w-[160px] md:max-w-[180px] object-contain drop-shadow-sm cursor-pointer hover:opacity-80"
        style={{
          transition: `opacity ${DESIGN_TOKENS.motion.duration.default} ${DESIGN_TOKENS.motion.timing.easeInOut}`,
        }}
      />

      {/* CTA Button */}
      <Button
        className="font-semibold rounded-lg"
        style={{
          backgroundColor: DESIGN_TOKENS.colors.kernfarben.dunkelblau,
          color: DESIGN_TOKENS.colors.kernfarben.beige,
          border: `1px solid ${DESIGN_TOKENS.colors.kernfarben.dunkelblau}`,
          height: '40px',
          padding: `0 ${DESIGN_TOKENS.spacing.xl}`,
          fontSize: '14px',
          boxShadow: DESIGN_TOKENS.elevation.sm,
        }}
      >
        Zur Startseite
      </Button>
    </div>
  </div>
</header>
```

**KEY EIGENSCHAFTEN:**

- ✅ `bg-background` (WEIß, KEIN Gradient!)
- ✅ `fixed top-0 left-0 right-0`
- ✅ `z-30`
- ✅ Height: `64px`
- ✅ Logo max-width: `120px/160px/180px` (responsive)
- ✅ Padding: `0 ${DESIGN_TOKENS.spacing.lg} 0 ${DESIGN_TOKENS.spacing.xl}`
- ✅ Button: Dunkelblau BG, Beige Text, `40px` height
- ✅ Shadow: `DESIGN_TOKENS.elevation.sm`
- ✅ Border: `1px solid ${DESIGN_TOKENS.colors.border.DEFAULT}`

---

### 2. AuthFooter.tsx - DER STANDARD

```typescript
/* ALLE Footer müssen diesem Design folgen */
<footer
  className="fixed bottom-0 left-0 right-0 z-20 bg-background"
  style={{
    borderTop: `1px solid ${DESIGN_TOKENS.colors.border.DEFAULT}`,
    padding: `${DESIGN_TOKENS.spacing.xs} 0`,
  }}
>
  <div className="container mx-auto" style={{ padding: `0 ${DESIGN_TOKENS.spacing.lg} 0 ${DESIGN_TOKENS.spacing.xl}` }}>
    {/* Mobile: Kompakt einspaltig */}
    <div className="sm:hidden flex flex-col items-center" style={{ gap: DESIGN_TOKENS.spacing.sm }}>
      <p style={{ fontSize: '10px', color: DESIGN_TOKENS.colors.text.secondary }}>
        © 2025 my-dispatch.de by RideHub Solutions
      </p>
      <div className="flex items-center" style={{ gap: DESIGN_TOKENS.spacing.md }}>
        {/* Legal Links */}
      </div>
    </div>

    {/* Desktop: Mehrspaltig */}
    <div className="hidden sm:flex items-center justify-between">
      {/* Left: Copyright + Made in Germany */}
      {/* Right: Legal Links */}
    </div>
  </div>
</footer>
```

**KEY EIGENSCHAFTEN:**

- ✅ `bg-background` (WEIß, KEIN Gradient!)
- ✅ `fixed bottom-0 left-0 right-0`
- ✅ `z-20`
- ✅ Padding: `${DESIGN_TOKENS.spacing.xs} 0`
- ✅ Border: `1px solid ${DESIGN_TOKENS.colors.border.DEFAULT}`
- ✅ Text: `DESIGN_TOKENS.colors.text.secondary` und `text.tertiary`
- ✅ Font-Size Mobile: `10px`, Desktop: `12px`
- ✅ Responsive: Mobile einspaltig, Desktop zweispaltig

---

### 3. AppSidebar.tsx - DER STANDARD

```typescript
/* ALLE Sidebars müssen diesem Design folgen */
<aside
  className={cn(
    "fixed left-0 top-0 h-full z-40 flex flex-col overflow-x-hidden",
    "bg-background border-r",
    "transition-[width]",
    expanded ? "w-60" : "w-[64px]"
  )}
  style={{
    borderColor: DESIGN_TOKENS.colors.border.DEFAULT,
    boxShadow: DESIGN_TOKENS.elevation.sm,
    transitionDuration: DESIGN_TOKENS.motion.duration.slow,
    transitionTimingFunction: DESIGN_TOKENS.motion.timing.easeInOut,
  }}
  onMouseEnter={handleMouseEnter}
  onMouseLeave={handleMouseLeave}
>
  {/* Toggle Indicator */}
  <div className="h-16 flex items-center justify-center">
    {!expanded && (
      <ChevronRight style={{ width: '20px', height: '20px' }} />
    )}
  </div>

  {/* Navigation Items - SCROLLBAR SICHTBAR */}
  <nav
    className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-visible"
    style={{
      padding: `${DESIGN_TOKENS.spacing.lg} ${DESIGN_TOKENS.spacing.md}`,
    }}
  >
    {/* Menu Items */}
  </nav>

  {/* Legal Section */}
  <div className={cn("transition-opacity", expanded ? "opacity-100" : "opacity-0")}>
    {/* Legal Links */}
  </div>
</aside>
```

**KEY EIGENSCHAFTEN:**

- ✅ `bg-background` (WEIß)
- ✅ `fixed left-0 top-0 h-full`
- ✅ `z-40`
- ✅ Width: `64px` collapsed, `240px` expanded
- ✅ Hover-Expansion mit `onMouseEnter/Leave`
- ✅ Border: `1px solid ${DESIGN_TOKENS.colors.border.DEFAULT}`
- ✅ Shadow: `DESIGN_TOKENS.elevation.sm`
- ✅ **SCROLLBAR SICHTBAR** via CSS-Klasse `scrollbar-visible`
- ✅ Icons: `20px x 20px` (konsistent)
- ✅ Active State: `bg: dunkelblau`, `text: beige`
- ✅ Hover State: `bg: beige/20`
- ✅ Transition: `slow` (300ms)

---

## 🎨 FARBSCHEMA (ZWINGEND)

### Header/Footer/Sidebar (EINHEITLICH)

| Element               | Farbe         | Token                                        |
| --------------------- | ------------- | -------------------------------------------- |
| Background            | Weiß          | `bg-background`                              |
| Text Primary          | Dunkelgrau    | `DESIGN_TOKENS.colors.text.primary`          |
| Text Secondary        | Hellgrau      | `DESIGN_TOKENS.colors.text.secondary`        |
| Text Tertiary         | Sehr Hellgrau | `DESIGN_TOKENS.colors.text.tertiary`         |
| Border                | Neutral       | `DESIGN_TOKENS.colors.border.DEFAULT`        |
| Button BG             | Dunkelblau    | `DESIGN_TOKENS.colors.kernfarben.dunkelblau` |
| Button Text           | Beige         | `DESIGN_TOKENS.colors.kernfarben.beige`      |
| Active BG (Sidebar)   | Dunkelblau    | `DESIGN_TOKENS.colors.kernfarben.dunkelblau` |
| Active Text (Sidebar) | Beige         | `DESIGN_TOKENS.colors.kernfarben.beige`      |
| Hover BG (Sidebar)    | Beige/20      | `${DESIGN_TOKENS.colors.kernfarben.beige}33` |

---

## 🔧 TECHNISCHE FIXES

### Problem 1: Gradient statt Weiß

**FALSCH:**

```typescript
background: `linear-gradient(...)`;
```

**RICHTIG:**

```typescript
className = "bg-background";
```

### Problem 2: Sidebar Scrollbar nicht sichtbar

**FALSCH:**

```typescript
className = "overflow-y-auto";
```

**RICHTIG:**

```typescript
className="overflow-y-auto scrollbar-visible"

/* In index.css */
.scrollbar-visible {
  scrollbar-width: thin;
  scrollbar-color: #E5E7EB transparent;
}

.scrollbar-visible::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-visible::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-visible::-webkit-scrollbar-thumb {
  background-color: #E5E7EB;
  border-radius: 3px;
}

.scrollbar-visible::-webkit-scrollbar-thumb:hover {
  background-color: #D1D5DB;
}
```

### Problem 3: Icons inkonsistent

**FALSCH:**

```typescript
<Icon className="h-5 w-5" />
<Icon className="h-4 w-4" />
```

**RICHTIG:**

```typescript
<Icon style={{ width: '20px', height: '20px' }} />
/* IMMER 20px x 20px für Sidebar/Header Icons */
```

---

## 📦 BETROFFENE DATEIEN (MIGRATION PFLICHT)

### ✅ BEREITS KORREKT (REFERENZ)

- `src/components/auth/AuthHeader.tsx` ⭐ MASTER
- `src/components/auth/AuthFooter.tsx` ⭐ MASTER

### 🔄 MUSS MIGRIERT WERDEN

- `src/components/layout/Header.tsx` ❌ Gradient → Weiß
- `src/components/layout/Footer.tsx` ❌ Gradient → Weiß
- `src/components/layout/MarketingLayout.tsx` ❌ Custom Header/Footer → AuthHeader/Footer
- `src/components/layout/AppSidebar.tsx` ⚠️ Scrollbar + Icons fixen

---

## ✅ MIGRATIONS-CHECKLIST

### Phase 1: CSS-Klasse hinzufügen

- [ ] `.scrollbar-visible` in `src/index.css` hinzufügen

### Phase 2: Komponenten migrieren

- [ ] `Header.tsx` → AuthHeader-Style (bg-background, kein Gradient)
- [ ] `Footer.tsx` → AuthFooter-Style (bg-background, kein Gradient)
- [ ] `AppSidebar.tsx` → Scrollbar + Icons fixen
- [ ] `MarketingLayout.tsx` → Inline Header/Footer entfernen, AuthHeader/Footer importieren

### Phase 3: Verifizierung

- [ ] Alle Seiten visuell testen (Marketing, Auth, Dashboard)
- [ ] Scrollbar in Sidebar sichtbar
- [ ] Icons überall 20px x 20px
- [ ] Keine Gradients mehr in Header/Footer
- [ ] Logo overflow verhindert

---

## 🚨 VERBOTEN (BLACKLIST)

### ❌ NIEMALS VERWENDEN

1. **Gradients in Header/Footer:**

   ```typescript
   ❌ background: `linear-gradient(...)`
   ❌ className="bg-gradient-to-r from-primary ..."
   ```

2. **Direkte Farben:**

   ```typescript
   ❌ text-white, bg-black, text-[#fff]
   ```

3. **Logo ohne max-width:**

   ```typescript
   ❌ className="h-8" // FEHLT max-w
   ✅ className="h-8 max-w-[120px] sm:max-w-[160px] md:max-w-[180px]"
   ```

4. **Icons ohne feste Größe:**

   ```typescript
   ❌ <Icon className="h-5 w-5" />
   ✅ <Icon style={{ width: '20px', height: '20px' }} />
   ```

5. **Custom Header/Footer in Layouts:**
   ```typescript
   ❌ <header>Custom...</header>
   ✅ <AuthHeader />
   ```

---

## 📝 VERWENDUNG IN LAYOUTS

### Marketing Pages

```typescript
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthFooter } from "@/components/auth/AuthFooter";
import { AppSidebar } from "@/components/layout/AppSidebar";

// Verwende AuthHeader/Footer, NICHT custom Header/Footer!
```

### Dashboard Pages

```typescript
import { MainLayout } from "@/components/layout/MainLayout";

// MainLayout MUSS intern Header/Footer im AuthHeader-Style verwenden
```

### Auth Pages

```typescript
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthFooter } from "@/components/auth/AuthFooter";

// Diese sind bereits korrekt!
```

---

## 🔒 LOCK-DOWN REGEL

**AB SOFORT GILT:**

Diese Spezifikation ist **UNVERÄNDERLICH** und **SYSTEMWEIT VERBINDLICH**.

Jede Abweichung führt zu:

- ❌ CI-Compliance-Verstoß
- ❌ Design-System-Verstoß
- ❌ Sofortiger Rollback

**Diese Spezifikation darf niemals wieder geändert werden!**

---

## 📚 VERWANDTE DOKUMENTE

- `DESIGN_TOKENS` - Zentrale Token-Definitionen
- `PRICING_DESIGN_SYSTEM_V26.0.md` - Marketing Page Standards
- `SPRINT_42_CI_COMPLIANCE_REPORT.md` - CI-Compliance Regeln

---

**ENDE DER SPEZIFIKATION**

**Status:** 🔒 LOCKED - UNVERÄNDERLICH - SYSTEMWEIT VERBINDLICH
