# V28 Billing Toggle Spacing Vorgabe

**Datum:** 2025-01-30  
**Status:** ✅ DEFINIERT

---

## SPACING VORGABE: Billing Toggle Section

### Abstand nach unten (margin-bottom)
```tsx
<div className="flex justify-center mb-28 md:mb-36">
  <V28BillingToggle />
</div>
```

**Tailwind Classes:**
- Mobile: `mb-28` (7rem / ~2.8cm)
- Desktop: `md:mb-36` (9rem / ~3.6cm)

**Anwendungsbereich:**
- Home Pricing Section (`src/components/home/HomePricingSection.tsx`)
- Alle anderen Pricing Sections mit Billing Toggle

---

## Struktur-Vorgaben

### Container-Hierarchie
```tsx
<section className="py-12 md:py-16 lg:py-20 bg-white">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    {/* Billing Toggle */}
    <div className="flex justify-center mb-28 md:mb-36">
      <V28BillingToggle
        billingPeriod={billingPeriod}
        onToggle={setBillingPeriod}
        discountText="-20%"
      />
    </div>
    
    {/* Pricing Cards Grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-10 md:items-start">
      {/* Cards */}
    </div>
  </div>
</section>
```

### Wichtige Regeln
1. **Container:** `container mx-auto` für korrekte Zentrierung
2. **Flex Wrapper:** `flex justify-center` für horizontale Zentrierung
3. **Spacing:** `mb-28 md:mb-36` für visuell optimalen Abstand
4. **Kein `w-full` nötig:** Container definiert bereits die Breite

---

## Vergleich zu anderen Spacing-Werten

| Bereich | Mobile | Desktop | Verwendung |
|---------|--------|---------|------------|
| **Billing Toggle** | `mb-28` | `md:mb-36` | ✅ Nach Toggle, vor Pricing Cards |
| Title/Description | `mb-12` | `md:mb-16` | Nach Titel, vor Toggle |
| Section Padding | `py-12` | `md:py-16 lg:py-20` | Section Outer Spacing |

---

## Visuelle Balance

Der Abstand `mb-28 md:mb-36` schafft:
- ✅ Genügend visuelle Trennung zwischen Toggle und Cards
- ✅ Keine zu große Lücke (war bei mb-32 md:mb-40 zu viel)
- ✅ Harmonische Proportionen im Gesamt-Layout
- ✅ Responsive Skalierung (Mobile etwas kompakter)

---

**LAST UPDATE:** 2025-01-30  
**VERIFIZIERT:** Visuell getestet und vom User bestätigt
