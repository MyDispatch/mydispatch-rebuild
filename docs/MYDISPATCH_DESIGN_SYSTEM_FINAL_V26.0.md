# 🎨 MyDispatch Design System V26.1 - FINAL SPECIFICATION

**Status:** ✅ SYSTEMWEITE VORGABE  
**Datum:** 2025-10-26  
**Compliance:** 100% V26.1 Design Token basiert  
**Hero-Qualität:** PRODUCTION-READY & FÜHREND

---

## 🎯 DESIGN-PHILOSOPHIE

### Corporate Identity (CI)
MyDispatch nutzt ein **professionelles Premium-Design** mit folgenden Kernfarben:

- **Primary (Dunkelblau):** `#323D5E` - Seriosität, Vertrauen, Stabilität
- **Secondary (Beige/Gold):** `#EADEBD` - Eleganz, Wärme, Hochwertigkeit
- **Canvas:** `#F8F9FB` - Heller Hintergrund für Inhalte
- **White:** `#FFFFFF` - Reine Weiß-Flächen

---

## 🎨 KERNFARBEN (MANDATORY)

```typescript
export const KERNFARBEN = {
  // Core Brand Colors
  dunkelblau: '#323D5E',      // Primary - Seriös & Vertrauenswürdig
  beige: '#EADEBD',           // Secondary - Warm & Einladend
  weiss: '#FFFFFF',           // Pure White
  canvas: '#F8F9FB',          // Light Background
  
  // Text Colors
  text_primary: '#323D5E',    // Haupttext (Dunkelblau)
  text_secondary: '#64748B',  // Sekundärtext (Grau)
  text_tertiary: '#94A3B8',   // Tertiärtext (Hellgrau)
  
  // Border Colors
  border_neutral: '#E2E8F0',
  border_neutral_soft: '#F1F5F9',
} as const;
```

**KRITISCH:** Alle Farben müssen aus `KERNFARBEN` stammen. Keine direkten Hex-Codes in Komponenten!

---

## 🧩 HERO DESIGN SYSTEM (V26.0 STANDARD)

### Hero-Struktur
Das Hero-Design von MyDispatch folgt diesem Aufbau:

```
[Background mit Glow Orbs & Patterns]
├── Premium Badge (Live-Indikator)
├── Headline (Display)
├── Subheadline (Heading 2)
├── Description (Body Large)
├── CTA Buttons (Primary & Secondary)
├── Trust Stats (2x2 Grid)
└── Dashboard Preview (Rechte Spalte)
    ├── Dashboard Header
    ├── KPI Cards (4x Grid)
    └── Activity List (3 Items)
```

### 1. Background & Atmosphere

**Gradient:**
```css
background: linear-gradient(135deg, #323D5E 0%, #3F4C70 50%, #4A5A85 100%)
```

**Glow Orbs (3 Schichten):**
- Top Right: `rgba(234, 222, 189, 0.25)` - 800px, 8s pulse
- Bottom Left: `rgba(234, 222, 189, 0.25)` - 600px, 6s pulse (1s delay)
- Center: `rgba(50, 61, 94, 0.37)` - 500px, 10s pulse (2s delay)

**Patterns:**
- Grid Pattern: 60x60px, 1.5px stroke, 7% opacity
- Dot Pattern: 30x30px, 2px dots, 7% opacity
- Diagonal Lines: 40x40px, 2px lines, 3% opacity (45° rotation)

### 2. Premium Badge

**Style:**
```css
backgroundColor: rgba(234, 222, 189, 0.08)
border: 2px solid #EADEBD
boxShadow: 0 0 20px rgba(234, 222, 189, 0.25), 0 4px 12px rgba(0,0,0,0.1)
```

**Elements:**
- Pulsing Dot (Beige, 8px Glow)
- Text: 14px, Semibold, Beige

### 3. Typography Hierarchy

**Headline:**
- Size: 5xl → 8xl (responsive)
- Font: Inter, Bold
- Color: Beige (#EADEBD)
- Line Height: 1.1
- Tracking: Tight

**Subheadline:**
- Size: 2xl → 4xl (responsive)
- Font: Inter, Medium
- Color: rgba(255, 255, 255, 0.94)
- Line Height: Snug

**Description:**
- Size: lg → 2xl (responsive)
- Font: Inter, Regular
- Color: rgba(255, 255, 255, 0.8)
- Line Height: Relaxed

### 4. CTA Buttons

**Primary Button:**
```css
backgroundColor: rgba(234, 222, 189, 0.13)
color: #EADEBD
border: 2px solid rgba(234, 222, 189, 0.37)
boxShadow: 0 0 20px rgba(234, 222, 189, 0.19)

hover:
  backgroundColor: rgba(234, 222, 189, 0.25)
  borderColor: rgba(234, 222, 189, 0.62)
  boxShadow: 0 0 30px rgba(234, 222, 189, 0.31)
```

**Secondary Button:**
```css
backgroundColor: rgba(255, 255, 255, 0.06)
color: #FFFFFF
border: 2px solid rgba(255, 255, 255, 0.13)
boxShadow: 0 0 15px rgba(255, 255, 255, 0.06)

hover:
  backgroundColor: rgba(255, 255, 255, 0.13)
  borderColor: rgba(255, 255, 255, 0.25)
  boxShadow: 0 0 20px rgba(255, 255, 255, 0.12)
```

### 5. Trust Stats (2x2 Grid)

**Container:**
```css
backgroundColor: rgba(255, 255, 255, 0.06)
border: 2px solid rgba(234, 222, 189, 0.19)
boxShadow: 0 0 20px rgba(234, 222, 189, 0.15), 0 8px 32px rgba(0,0,0,0.12)

hover:
  backgroundColor: rgba(255, 255, 255, 0.13)
  borderColor: rgba(234, 222, 189, 0.31)
  boxShadow: 0 0 30px rgba(234, 222, 189, 0.21), 0 12px 40px rgba(0,0,0,0.15)
```

**Icon Container:**
```css
backgroundColor: rgba(234, 222, 189, 0.13)
boxShadow: 0 0 12px rgba(234, 222, 189, 0.19), inset 0 0 15px rgba(234, 222, 189, 0.06)
```

### 6. Dashboard Preview

**Container:**
```css
backgroundColor: #F8F9FB (canvas)
border: 3px solid rgba(234, 222, 189, 0.25)
boxShadow: 0 0 60px rgba(234, 222, 189, 0.19), 0 25px 80px rgba(50, 61, 94, 0.5), 0 40px 120px rgba(0,0,0,0.4)
```

**Header:**
```css
backgroundColor: rgba(255, 255, 255, 0.98)
borderBottom: rgba(229, 231, 235, 0.5)
boxShadow: 0 0 20px rgba(50, 61, 94, 0.05)
```

**Icon Box (Dunkelblau mit Beige Icon):**
```css
backgroundColor: #323D5E
iconColor: #EADEBD
padding: 12px
borderRadius: 12px
boxShadow: 0 0 15px rgba(234, 222, 189, 0.19), inset 0 0 15px rgba(234, 222, 189, 0.06)
```

**KPI Card:**
```css
backgroundColor: #FFFFFF
border: 2px solid rgba(229, 231, 235, 0.5)
boxShadow: 0 0 15px rgba(50, 61, 94, 0.05)

hover:
  borderColor: rgba(234, 222, 189, 0.37)
  boxShadow: 0 0 20px rgba(234, 222, 189, 0.12)
```

**Performance Badge (+12%, +8%):**
```css
backgroundColor: rgba(234, 222, 189, 0.15)
color: #323D5E (Dunkelblau)
border: 2px solid rgba(234, 222, 189, 0.3)
```

**Activity List Item:**
```css
backgroundColor: rgba(50, 61, 94, 0.03)
border: 2px solid rgba(229, 231, 235, 0.5)

hover:
  backgroundColor: rgba(234, 222, 189, 0.06)
  borderColor: rgba(234, 222, 189, 0.19)
```

---

## 📐 SPACING & LAYOUT

### Container
- Max Width: 1280px (7xl)
- Padding: px-4 sm:px-6 lg:px-8
- Section Spacing: py-20 md:py-28

### Grid Systems
- 2 Columns: `grid-cols-1 lg:grid-cols-2`
- 4 Columns (KPIs): `grid-cols-2 lg:grid-cols-4`
- Gap: gap-4 lg:gap-6

---

## ✅ MANDATORY RULES

### DO's ✅
1. **Immer KERNFARBEN verwenden** - Keine direkten Hex-Codes
2. **rgba() für Transparenzen** - NIEMALS Hex + Alpha (z.B. `#EADEBD40`)
3. **V26-Komponenten nutzen** - V26Button, V26IconBox, V26MarketingCard
4. **Icon-System:** Dunkelblau Background + Beige Icon
5. **Ampel-System:** NUR für Status-Badges (Live, Bestätigt, etc.)
6. **Performance-Badges:** Beige Background + Dunkelblau Text
7. **Responsive Typography:** Fluid clamp() oder Responsive Classes

### DON'Ts ❌
1. ❌ Direkte Hex-Codes (außer in KERNFARBEN-Konstante)
2. ❌ Hex + Alpha Transparenzen (z.B. `#22C55E40`)
3. ❌ Status-Farben außerhalb von Ampel-System
4. ❌ Links mit Unterstreichung
5. ❌ Native `<button>` statt V26Button
6. ❌ Inline Hover-Effekte (onMouseEnter/Leave) - CSS bevorzugen

---

## 🚀 COMPONENT LIBRARY

### Core Components
- `V26Button` - Primary & Secondary Buttons
- `V26IconBox` - Icon Container (Dunkelblau + Beige)
- `V26MarketingCard` - Marketing Cards
- `V26MarketingSection` - Section Wrapper
- `V26FeatureListItem` - Feature List mit Check-Icon
- `V26BillingToggle` - Billing Period Toggle
- `V26Badge` - Standardisiertes Badge

### Hero Components (NEU)
- `HeroBackgroundOrbs` - Background mit Glow Orbs & Patterns
- `HeroPremiumBadge` - Premium Badge mit Live-Dot
- `HeroTrustStats` - Trust Stats Grid (2x2)
- `DashboardContainer` - Dashboard Preview Container
- `DashboardKPICard` - KPI Card für Dashboard
- `DashboardActivityItem` - Activity List Item

### Templates (NEU)
- `HeroTemplate` - Komplettes Hero (Left + Right Column)
- `DashboardPreviewTemplate` - Dashboard Mockup

---

## 📊 QUALITY GATES

### Pre-Commit Checks
- [ ] Keine direkten Hex-Codes (außer KERNFARBEN)
- [ ] Keine Hex + Alpha Transparenzen
- [ ] Alle Buttons sind V26Button
- [ ] Alle Icons nutzen V26IconBox oder haben korrektes Color-System
- [ ] Status-Badges nutzen Ampel-System korrekt
- [ ] Performance-Badges haben Beige Background
- [ ] Links haben keine Unterstreichung
- [ ] Responsive Typography implementiert

### Testing
```bash
npm run test:visual     # Visual Regression Tests
npm run test:component  # Component Tests
npm run test:a11y       # Accessibility Tests
```

---

**Version:** V26.1 FINAL  
**Status:** ✅ SYSTEMWEITE VORGABE  
**Zertifiziert:** Senior Projektleiter & Systemarchitekt  
**Datum:** 2025-10-26  
**Hero-Status:** PRODUCTION-READY - Qualitätsstandard für gesamte Plattform
