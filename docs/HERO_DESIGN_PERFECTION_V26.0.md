# HERO DESIGN PERFECTION V26.0 - PREMIUM GLOW CONCEPT

**Status:** ✅ FINAL - PRODUCTION  
**Datum:** 26.10.2025  
**Version:** 1.0  

---

## 🎯 DESIGN-PHILOSOPHIE

Das Hero-Design basiert auf einem **Premium Glow Konzept** mit konsistenter Farbsprache und Tiefenwirkung durch subtile Leuchteffekte.

---

## 🎨 KERNPRINZIPIEN

### 1. Glow statt harte Borders
- **Box-Shadow** mit Farb-Glow statt einfache Borders
- **Inset-Shadow** für 3D-Tiefe
- **Radial Gradients** für weiche Leuchteffekte

### 2. Konsistente Farbsprache
- **Dunkelblau**: Primary Icons, Borders, Basis-Glow
- **Beige**: Highlight-Glow, Secondary Borders, Akzente
- **Grün (#22C55E)**: Nur für Status/Live-Badges (Ampelsystem)

### 3. Layered Shadows
```tsx
// Beispiel: Button mit mehrschichtigem Glow
boxShadow: `
  0 0 30px ${KERNFARBEN.beige}60,      // Äußerer Glow
  0 10px 40px rgba(0,0,0,0.3)          // Tiefenschatten
`
```

---

## 📐 ANWENDUNGSBEREICHE

### Background (Hero-Section)
```tsx
// Gradient Base
background: `linear-gradient(135deg, ${KERNFARBEN.dunkelblau} 0%, #3F4C70 50%, #4A5A85 100%)`

// Geometric Pattern Overlay (opacity-5)
<svg>
  <pattern stroke={KERNFARBEN.beige} strokeWidth="1" />
</svg>

// Drei animierte Glow-Orbs (mehrschichtig)
// Orb 1: Oben rechts
<div style={{
  background: `radial-gradient(circle, ${KERNFARBEN.beige}40 0%, transparent 70%)`,
  opacity: 0.15,
  animation: 'pulse 8s infinite'
}} />

// Orb 2: Unten links
<div style={{
  background: `radial-gradient(circle, ${KERNFARBEN.beige}40 0%, transparent 70%)`,
  opacity: 0.15,
  animation: 'pulse 6s infinite',
  animationDelay: '1s'
}} />

// Orb 3: Zentral (dunkelblau)
<div style={{
  background: `radial-gradient(circle, ${KERNFARBEN.dunkelblau}60 0%, transparent 70%)`,
  opacity: 0.10,
  animation: 'pulse 10s infinite',
  animationDelay: '2s'
}} />
```

### Premium Badge
```tsx
<div style={{
  backgroundColor: `${KERNFARBEN.beige}15`,
  border: '2px solid',
  borderColor: KERNFARBEN.beige,
  boxShadow: `0 0 20px ${KERNFARBEN.beige}40, 0 4px 12px rgba(0,0,0,0.1)`
}}>
  <div style={{
    backgroundColor: KERNFARBEN.beige,
    boxShadow: `0 0 8px ${KERNFARBEN.beige}80`  // Pulsierender Punkt
  }} />
</div>
```

### Hero Buttons
```tsx
// Primary (Beige)
style={{
  backgroundColor: KERNFARBEN.beige,
  color: KERNFARBEN.dunkelblau,
  borderColor: KERNFARBEN.dunkelblau,
  borderWidth: '2px',
  boxShadow: `0 0 30px ${KERNFARBEN.beige}60, 0 10px 40px rgba(0,0,0,0.3)`
}}

// Hover
boxShadow: `0 0 40px ${KERNFARBEN.beige}80, 0 20px 60px ${KERNFARBEN.beige}50`

// Secondary (Transparent)
style={{
  backgroundColor: `${KERNFARBEN.weiss}15`,
  color: KERNFARBEN.weiss,
  borderColor: KERNFARBEN.beige,
  borderWidth: '2px',
  boxShadow: `0 0 25px ${KERNFARBEN.beige}50, 0 8px 30px rgba(0,0,0,0.2)`
}}
```

### Trust Stats (2x2 Grid)
```tsx
<div style={{
  backgroundColor: `${KERNFARBEN.weiss}10`,
  border: '2px solid',
  borderColor: `${KERNFARBEN.beige}30`,
  boxShadow: `0 0 20px ${KERNFARBEN.beige}25, 0 8px 32px rgba(0,0,0,0.12)`
}}>
  {/* Icon Container */}
  <div style={{
    backgroundColor: `${KERNFARBEN.beige}20`,
    boxShadow: `0 0 12px ${KERNFARBEN.beige}30, inset 0 0 15px ${KERNFARBEN.beige}10`
  }}>
    <Icon style={{ color: KERNFARBEN.beige }} />
  </div>
</div>

// Hover
boxShadow: `0 0 30px ${KERNFARBEN.beige}35, 0 12px 40px rgba(0,0,0,0.15)`
```

### Dashboard Container
```tsx
<div style={{
  backgroundColor: KERNFARBEN.canvas,
  border: '3px solid',
  borderColor: `${KERNFARBEN.beige}40`,
  boxShadow: `
    0 0 60px ${KERNFARBEN.beige}30,           // Beige Glow
    0 25px 80px ${KERNFARBEN.dunkelblau}80,   // Dunkelblau Schatten
    0 40px 120px rgba(0,0,0,0.4)              // Tiefer Schatten
  `
}} />
```

### Dashboard Header Icon
```tsx
// WICHTIG: Blau mit beige Schrift!
<div style={{
  backgroundColor: KERNFARBEN.dunkelblau,
  boxShadow: `0 0 15px ${KERNFARBEN.dunkelblau}40, inset 0 0 20px ${KERNFARBEN.beige}10`
}}>
  <Icon style={{ color: KERNFARBEN.beige }} />
</div>
```

### KPI Cards (in Dashboard-Grafik)
```tsx
// Card
<div style={{
  backgroundColor: KERNFARBEN.weiss,
  border: '1px solid',
  borderColor: `${KERNFARBEN.dunkelblau}20`,  // oder beige für Alternierung
  boxShadow: `0 0 20px ${KERNFARBEN.dunkelblau}15, 0 8px 24px rgba(0,0,0,0.08)`
}}>
  {/* Icon */}
  <div style={{
    backgroundColor: `${KERNFARBEN.dunkelblau}15`,  // oder beige30
    boxShadow: `0 0 15px ${KERNFARBEN.dunkelblau}30, inset 0 0 20px ${KERNFARBEN.dunkelblau}10`
  }}>
    <Icon style={{ color: KERNFARBEN.dunkelblau }} />
  </div>
</div>
```

### Activity List
```tsx
<div style={{
  backgroundColor: KERNFARBEN.weiss,
  border: '1px solid',
  borderColor: `${KERNFARBEN.dunkelblau}20`,
  boxShadow: `0 0 25px ${KERNFARBEN.dunkelblau}12, 0 10px 30px rgba(0,0,0,0.08)`
}}>
  {/* Clock Icon */}
  <div style={{
    backgroundColor: `${KERNFARBEN.dunkelblau}10`,
    boxShadow: `0 0 12px ${KERNFARBEN.dunkelblau}25, inset 0 0 15px ${KERNFARBEN.dunkelblau}08`
  }}>
    <Clock style={{ color: KERNFARBEN.dunkelblau }} />
  </div>
</div>
```

---

## 🚦 STATUS-BADGES (AMPELSYSTEM)

**WICHTIG:** Live/Echtzeit-Badges verwenden Grün aus dem Ampelsystem mit **WEISSEM RAND**!

```tsx
// Live/Echtzeit Badge (GRÜN mit WEISSEM RAND)
<Badge style={{
  backgroundColor: '#22C55E',        // Grün (Status Success)
  color: KERNFARBEN.weiss,
  border: '2px solid',
  borderColor: KERNFARBEN.weiss,     // ✅ WEISSER RAND (SYSTEMVORGABE)
  boxShadow: '0 0 20px #22C55E40'    // Grüner Glow
}}>
  <span style={{
    backgroundColor: KERNFARBEN.weiss,
    boxShadow: `0 0 8px ${KERNFARBEN.weiss}` // Weißer pulsierender Punkt
  }} />
  Echtzeit
</Badge>
```

**REGELN:** 
1. Nur Status-Badges (Live, Aktiv, Online, Echtzeit) dürfen Grün verwenden
2. Alle Ampelsystem-Badges bekommen einen **2px weißen Rand** (keine grünen Ränder!)
3. Alle anderen Badges bleiben blau/beige

---

## ❌ VERBOTEN

1. **Harte 2px Borders** ohne Glow (außer bei Buttons nach Systemvorgabe)
2. **Einfache box-shadow** ohne Farb-Glow
3. **Graue Borders** im Hero-Bereich
4. **Status-Grün** außerhalb von Status-Badges
5. **Inkonsistente Glow-Stärken**

---

## ✅ CHECKLISTE

- [ ] Alle Borders haben Glow-Effekte
- [ ] Icons mit Inset-Shadow für 3D-Tiefe
- [ ] Background mit drei mehrschichtigen, animierten Glow-Orbs
- [ ] Dashboard-Icons: Blau mit beige Schrift
- [ ] Live/Status-Badges: Grün (#22C55E) mit **weißem 2px Rand**
- [ ] Hover verstärkt Glow (nicht nur opacity)
- [ ] Konsistente Farbsprache: Dunkelblau/Beige/Grün (Status)

---

## 🔗 SIEHE AUCH

- `docs/BUTTON_GUIDELINES.md` - Button 2px Border Systemvorgabe
- `docs/V26_ICON_BADGE_GUIDELINES.md` - Icon & Badge Standards
- `docs/PRICING_DESIGN_SYSTEM_V26.0.md` - Allgemeines Design System

---

**VERSION:** 1.0  
**STATUS:** PRODUCTION-LOCKED  
**ÄNDERUNGEN:** Nur mit Freigabe!
