# MIGRATION ZU UNIFIED DESIGN SYSTEM V26.1

**Status:** 🔄 IN PROGRESS  
**Version:** 26.1  
**Datum:** 2025-10-26  
**Agent:** NeXify AI Development

---

## 🎯 ZWECK

Dieses Dokument beschreibt die Migration aller Komponenten zum **Unified Design System V26.1** für systemweite Konsistenz.

---

## ✅ MIGRATIONS-STATUS

### Abgeschlossen

- [x] `src/lib/design-system/unified-design-tokens.ts` - Erstellt
- [x] `docs/UNIFIED_DESIGN_SYSTEM_V26.1.md` - Dokumentiert
- [x] `src/components/dashboard/DashboardSidebar.tsx` - Migriert
- [x] `src/components/dashboard/DashboardInfoPanel.tsx` - In Progress

### Ausstehend

- [ ] `src/components/dashboard/CollapsibleDashboardSection.tsx`
- [ ] `src/components/dashboard/PremiumWeatherDisplay.tsx`
- [ ] `src/components/dashboard/PremiumTrafficDisplay.tsx`
- [ ] `src/components/dashboard/ActivityTimeline.tsx`
- [ ] `src/components/dashboard/ResourceStatusWidget.tsx`
- [ ] `src/components/dashboard/TrafficWidget.tsx`
- [ ] `src/components/dashboard/WeatherWidget.tsx`
- [ ] Alle anderen Dashboard-Komponenten
- [ ] Alle Form-Komponenten
- [ ] Alle Dialog-Komponenten
- [ ] Alle Card-Komponenten

---

## 📋 MIGRATIONS-CHECKLIST

Für jede Komponente:

### 1. Import hinzufügen

```typescript
import {
  UNIFIED_DESIGN_TOKENS,
  getCardStyle,
  getPanelStyle,
} from "@/lib/design-system/unified-design-tokens";
```

### 2. Border ersetzen

**Vorher:**

```typescript
className="border-2 border-primary/20"
// oder
style={{ border: '2px solid', borderColor: 'rgba(234, 222, 189, 0.2)' }}
```

**Nachher:**

```typescript
style={UNIFIED_DESIGN_TOKENS.border.styles.card_standard}
// oder
style={getCardStyle('standard')}
```

### 3. Radius ersetzen

**Vorher:**

```typescript
className="rounded-xl"
// oder
style={{ borderRadius: '12px' }}
```

**Nachher:**

```typescript
style={{ borderRadius: UNIFIED_DESIGN_TOKENS.radius.component.card }}
// oder im getCardStyle() enthalten
```

### 4. Shadow ersetzen

**Vorher:**

```typescript
className="shadow-lg"
// oder
style={{ boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
```

**Nachher:**

```typescript
style={{ boxShadow: UNIFIED_DESIGN_TOKENS.shadow.component.card_standard }}
// oder im getCardStyle() enthalten
```

### 5. Spacing ersetzen

**Vorher:**

```typescript
className="gap-4 p-4"
// oder
style={{ gap: '1rem', padding: '1rem' }}
```

**Nachher:**

```typescript
style={{
  gap: UNIFIED_DESIGN_TOKENS.spacing.component.gap_cards,
  padding: UNIFIED_DESIGN_TOKENS.spacing.component.card_padding
}}
```

### 6. Icons prüfen

```typescript
import { FileText } from "lucide-react"; // ✅ Korrekt gemäß ICON_MAPPING

// Statt verschiedene Icons für Aufträge:
// ❌ Document, File, Receipt
// ✅ FileText (UNIFIED_DESIGN_TOKENS.icons.booking)
```

---

## 🔄 MIGRATIONS-PATTERNS

### Pattern 1: Standard Card

**Vorher:**

```typescript
<div className="rounded-xl p-4 border-2 border-primary/20 shadow-md">
  Content
</div>
```

**Nachher:**

```typescript
<div style={getCardStyle('standard')}>
  Content
</div>
```

### Pattern 2: Hover Card

**Vorher:**

```typescript
<div
  className="rounded-xl p-4 border-2 border-primary/20 shadow-md hover:shadow-lg"
  onMouseEnter={(e) => {
    e.currentTarget.style.borderColor = 'rgba(234, 222, 189, 0.4)';
    e.currentTarget.style.boxShadow = '0 8px 24px rgba(234, 222, 189, 0.2)';
  }}
>
  Content
</div>
```

**Nachher:**

```typescript
<div
  style={getCardStyle('standard')}
  onMouseEnter={(e) => {
    Object.assign(e.currentTarget.style, getCardStyle('hover'));
  }}
  onMouseLeave={(e) => {
    Object.assign(e.currentTarget.style, getCardStyle('standard'));
  }}
>
  Content
</div>
```

### Pattern 3: Error/Status Card

**Vorher:**

```typescript
<div
  className="rounded-xl p-4 border-2 bg-red-50 border-red-400"
  style={{ boxShadow: '0 0 12px rgba(239, 68, 68, 0.2)' }}
>
  Content
</div>
```

**Nachher:**

```typescript
<div
  style={{
    ...getCardStyle('error'),
    backgroundColor: `${DESIGN_TOKENS_V26_1.colors.status_error}15`
  }}
>
  Content
</div>
```

### Pattern 4: Grid Layout

**Vorher:**

```typescript
<div className="grid grid-cols-2 gap-2">
  <div className="rounded-xl p-3">...</div>
  <div className="rounded-xl p-3">...</div>
</div>
```

**Nachher:**

```typescript
<div
  className="grid grid-cols-2"
  style={{ gap: UNIFIED_DESIGN_TOKENS.spacing.component.gap_cards }}
>
  <div style={{
    ...getCardStyle('standard'),
    borderRadius: UNIFIED_DESIGN_TOKENS.radius.component.card,
    padding: UNIFIED_DESIGN_TOKENS.spacing.component.card_padding_sm,
  }}>...</div>
  <div style={{
    ...getCardStyle('standard'),
    borderRadius: UNIFIED_DESIGN_TOKENS.radius.component.card,
    padding: UNIFIED_DESIGN_TOKENS.spacing.component.card_padding_sm,
  }}>...</div>
</div>
```

---

## 🔍 SUCHE & ERSETZE

### Finde alte Patterns

```bash
# Border
grep -r "border-2" src/components/
grep -r "border-\\[2px\\]" src/components/

# Radius
grep -r "rounded-xl" src/components/
grep -r "rounded-lg" src/components/

# Shadow
grep -r "shadow-md" src/components/
grep -r "shadow-lg" src/components/
grep -r "boxShadow:" src/components/

# Spacing
grep -r "gap-4" src/components/
grep -r "p-4" src/components/
```

---

## ⚠️ BEKANNTE PROBLEME

### Problem 1: Inline Styles vs. ClassName

**Lösung:** Bevorzuge `style={}` für Token-basiertes Design über `className`

### Problem 2: Mehrfache Border-Definitionen

**Lösung:** Verwende `...getCardStyle()` am Anfang, überschreibe nur spezifische Props

### Problem 3: Unterschiedliche Rundungen

**Lösung:** Alle Cards verwenden `UNIFIED_DESIGN_TOKENS.radius.component.card`

---

## 📊 FORTSCHRITT

| Kategorie | Abgeschlossen | Gesamt | %      |
| --------- | ------------- | ------ | ------ |
| Dashboard | 2             | 8      | 25%    |
| Forms     | 0             | 15     | 0%     |
| Dialogs   | 0             | 10     | 0%     |
| Cards     | 0             | 20     | 0%     |
| **Total** | **2**         | **53** | **4%** |

---

## 🚀 NÄCHSTE SCHRITTE

1. **Phase 1:** Dashboard-Komponenten (Priority High)
   - CollapsibleDashboardSection
   - PremiumWeatherDisplay
   - PremiumTrafficDisplay
   - ActivityTimeline
   - ResourceStatusWidget
   - TrafficWidget
   - WeatherWidget

2. **Phase 2:** Form-Komponenten (Priority High)
   - Alle Form-Komponenten in `src/components/forms/`

3. **Phase 3:** Dialog-Komponenten (Priority Medium)
   - Alle Dialog-Komponenten

4. **Phase 4:** Restliche Komponenten (Priority Low)
   - Cards, Widgets, etc.

---

## ✅ TESTING

Nach Migration jeder Komponente:

1. **Visuell:** Prüfe Border, Radius, Shadow, Spacing
2. **Hover:** Teste Hover-States
3. **Responsive:** Teste auf verschiedenen Bildschirmgrößen
4. **Konsistenz:** Vergleiche mit anderen migrierten Komponenten

---

**Status:** 🔄 IN PROGRESS (4% Complete)  
**Nächste Komponente:** `CollapsibleDashboardSection.tsx`
