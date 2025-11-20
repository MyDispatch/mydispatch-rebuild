# MyDispatch Währungs-Richtlinien (SYSTEMWEIT)

**Status:** ✅ FINAL - NIEMALS ÄNDERN!  
**Datum:** 26.10.2025  
**Version:** 1.0

---

## 🎯 ABSOLUTE REGEL: KEINE DOLLAR-ZEICHEN

### ✅ ERLAUBT (AUSSCHLIESSLICH!)

1. **Euro-Zeichen (€)**
   - Verwendung: ALLE Preisangaben systemweit
   - Format: `99 €` oder `99€` (mit/ohne Leerzeichen nach Kontext)
   - Beispiel: `"49 €/Monat"`, `"Starter: 0€"`

2. **Textbasierte Preise**
   - Verwendung: Wenn kein Währungssymbol nötig
   - Beispiel: `"kostenlos"`, `"individuell"`

---

## ❌ VERBOTENE ZEICHEN

### NIEMALS VERWENDEN:

- ❌ `$` (Dollar-Zeichen)
- ❌ `USD` (US-Dollar-Währungskürzel)
- ❌ Jede andere Nicht-Euro-Währung
- ❌ **Icons mit Dollar-Zeichen** (z.B. Lucide `Receipt`-Icon zeigt oft $)
- ❌ **Grafiken mit Dollar-Symbolen**

**BEGRÜNDUNG:**

- MyDispatch ist eine deutsche Software für den deutschen/europäischen Markt
- Alle Preise werden in Euro berechnet und angezeigt
- Dollar-Zeichen verwirren deutsche Nutzer und sind CI-inkonsistent
- **AUCH ICONS/GRAFIKEN DÜRFEN KEINE DOLLAR-ZEICHEN ENTHALTEN**

---

## 📋 IMPLEMENTIERUNGSREGELN

### Preisformatierung in Code

```tsx
// ✅ KORREKT - Euro-Zeichen
<span>49 €/Monat</span>
<span>{price.toFixed(2)} €</span>

// ❌ FALSCH - Dollar-Zeichen
<span>$49/month</span>
<span>${price.toFixed(2)}</span>
```

### Icons und Grafiken

```tsx
// ✅ KORREKT - Icon ohne Dollar-Zeichen
import { FileText } from "lucide-react";
<FileText className="h-5 w-5" />;

// ❌ FALSCH - Receipt-Icon zeigt Dollar-Zeichen
import { Receipt } from "lucide-react";
<Receipt className="h-5 w-5" />;
```

**EMPFOHLENE ICONS FÜR RECHNUNGSWESEN:**

- `FileText` - Allgemeine Dokumente/Rechnungen
- `File` - Einfaches Dokument
- `Scroll` - Formelle Dokumente
- `CreditCard` - Zahlungen (KEIN Dollar-Symbol)

```typescript
// ✅ KORREKT
const TARIFF = {
  name: "Starter",
  priceMonthly: 0,
  priceMonthlyFormatted: "0 €",
  priceYearly: 0,
  priceYearlyFormatted: "0 €",
};

// ❌ FALSCH
const TARIFF = {
  name: "Starter",
  priceMonthly: 0,
  priceMonthlyFormatted: "$0",
  priceYearly: 0,
  priceYearlyFormatted: "$0",
};
```

---

## 🔍 BETROFFENE BEREICHE

### Geprüfte & Korrigierte Bereiche (26.10.2025)

✅ `src/lib/tariff/tariff-definitions.ts` - Alle Preise in Euro  
✅ `src/pages/Pricing.tsx` - Preisdarstellung in Euro  
✅ `src/pages/Home.tsx` - Preisvorschau in Euro, Receipt → FileText  
✅ `src/pages/Auth.tsx` - Tarif-Auswahl in Euro  
✅ `src/components/dashboard/UrgentActionsWidget.tsx` - Receipt → FileText  
✅ `src/components/invoices/InvoiceFormDialog.tsx` - Receipt → FileText  
✅ `src/components/layout/AppSidebar.tsx` - Receipt → FileText  
✅ `src/lib/dashboard-automation/kpi-generator.ts` - Receipt → FileText (2x)  
✅ `src/pages/Auftraege.tsx` - Receipt → FileText  
✅ `src/pages/Index.tsx` - Receipt → FileText  
✅ `src/pages/MobileMenu.tsx` - Receipt → FileText

### Systemweite Änderung

**ALLE Receipt-Icons** (Lucide) wurden durch **FileText-Icons** ersetzt, da Receipt-Icons Dollar-Zeichen ($) darstellen, was gegen die deutsche Lokalisierung verstößt.

---

## ⚠️ WARTUNG & UPDATES

Bei **JEDEM** neuen Feature mit Preisangaben:

1. ✅ Preise MÜSSEN mit Euro-Zeichen (€) dargestellt werden
2. ✅ Format: `[Betrag] €` (z.B. `"49 €"`)
3. ✅ Keine Dollar-Zeichen oder andere Währungen verwenden
4. ✅ Dokumentation in dieser Datei aktualisieren

---

## 📞 FEHLERPRÄVENTION

Falls Dollar-Zeichen im Code gefunden werden:

```bash
# Suche nach Dollar-Zeichen in Preisangaben
grep -r "\$" src/pages/*.tsx
grep -r "USD" src/**/*.ts
```

**Sofort korrigieren auf:**

- `€` (Euro-Zeichen)
- `"0 €"` statt `"$0"`
- `"49 €/Monat"` statt `"$49/month"`

---

## 🌍 LOKALISIERUNG

**WICHTIG:** Sollte MyDispatch in Zukunft internationalisiert werden:

- Verwende i18n-Libraries (z.B. `react-intl`)
- Definiere Währungsformate pro Locale
- Standard bleibt: **Euro (€)** für deutschen Markt

---

**NIEMALS DIESE VORGABEN ÄNDERN OHNE PROJEKTLEITER-GENEHMIGUNG!**
