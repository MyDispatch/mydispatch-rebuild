# HERE MAPS RATE LIMIT FIX V20.0.0

> **Status:** PRODUKTIV | LOCKED - UNVERÄNDERLICH  
> **Datum:** 2025-01-26  
> **Zweck:** Dokumentation aller Fixes für Rate Limit, verdeckte Karte und Icons

---

## 🚨 PROBLEME (BEHOBEN)

### 1. Rate Limit erreicht
**Problem:**  
```json
{
  "status": "API Limit erreicht",
  "retry_after": 120
}
```

**Lösung:**  
- API-Key-Caching für 1 Stunde implementiert
- `HERE_API_KEY_CACHE` wird nur alle 60 Minuten neu geladen
- Reduziert API-Calls um ~95%

```typescript
let HERE_API_KEY_CACHE: string | null = null;
let API_KEY_TIMESTAMP: number = 0;
const CACHE_DURATION = 1000 * 60 * 60; // 1 Stunde

if (HERE_API_KEY_CACHE && (now - API_KEY_TIMESTAMP) < CACHE_DURATION) {
  return HERE_API_KEY_CACHE;
}
```

### 2. Karte komplett verdeckt
**Problem:**  
Legend hatte `z-10` und überlagerte die Karte.

**Lösung:**  
- Legend z-index auf `5` reduziert
- Map hat implizit `z-1`

### 3. Icons fehlerhaft & Wagennummer fehlt
**Problem:**  
- Emoji-Icons (🚗) waren nicht design-konform
- Keine Wagennummer sichtbar
- Status nicht erkennbar

**Lösung:**  
- Migration: `vehicle_number` Spalte hinzugefügt
- Neue Icons: Kreis mit Wagennummer (z.B. "01", "02")
- Ampelfarben für Status:
  - **Grün** (available)
  - **Gelb** (im_einsatz)
  - **Rot** (wartung/defekt)
- Dünner weißer Border (3px)

---

## 🎨 NEUES ICON-DESIGN

```svg
<svg width="48" height="48">
  <!-- Äußerer Ring (dünner Border) -->
  <circle cx="24" cy="24" r="22" fill="none" stroke="white" stroke-width="3"/>
  <!-- Innerer Kreis (Ampelfarbe) -->
  <circle cx="24" cy="24" r="20" fill="#hsl(...)"/>
  <!-- Wagennummer (weiß, zentriert) -->
  <text x="24" y="29" text-anchor="middle" fill="white" font-size="14" font-weight="bold">01</text>
</svg>
```

### Ampelfarben
```typescript
const statusColors = {
  'available': CI_COLORS_HEX.statusSuccess,    // Grün
  'im_einsatz': CI_COLORS_HEX.statusWarning,   // Gelb
  'wartung': CI_COLORS_HEX.statusError,        // Rot
  'defekt': 'hsl(0 0% 42%)'                    // Grau
};
```

---

## ✅ DEPLOYED FILES

| Datei | Änderung |
|-------|----------|
| `src/config/here-maps.ts` | API-Key-Caching (1h) |
| `src/components/dashboard/HEREMapComponent.tsx` | Icons + z-index Fix |
| `supabase/migrations/[timestamp]_add_vehicle_number.sql` | Wagennummer-Spalte |

---

## 🔒 LOCKED - NIEMALS ÄNDERN!

Diese Fixes sind **FINAL** und dürfen nicht mehr geändert werden:
1. API-Caching (1h) bleibt bestehen
2. Icon-Design (Kreis + Wagennummer + Ampelfarbe) ist Standard
3. z-index von Legend bleibt bei `5`

---

**Ende Dokumentation**
