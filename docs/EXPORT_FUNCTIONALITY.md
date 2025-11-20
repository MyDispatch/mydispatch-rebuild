# Export Functionality V28.1

**Status:** ✅ PRODUCTION  
**Version:** 28.2.28  
**Date:** 2025-10-29

---

## 📥 UNIVERSAL DOWNLOAD SYSTEM

Das UniversalDownload-System bietet einheitliche Export-Funktionalität für alle Daten-Typen.

---

## 🚀 FEATURES

### Unterstützte Formate

- ✅ **PDF** - jsPDF + autoTable (Tabellen, Berichte, Rechnungen)
- ✅ **XLSX** - SheetJS (Excel-Export, Multi-Sheet-Support)
- ✅ **CSV** - Standard-CSV (Excel-kompatibel mit BOM)
- ✅ **JSON** - Strukturierte Daten-Exports

---

## 📖 USAGE

### Basic Example

```tsx
import { UniversalDownload } from "@/components/shared/UniversalDownload";

<UniversalDownload
  type="pdf"
  data={bookings}
  filename="auftraege-export"
  buttonLabel="Als PDF exportieren"
/>;
```

### All Props

```tsx
interface UniversalDownloadProps {
  /** Download Type */
  type: "pdf" | "csv" | "json" | "zip" | "xlsx";

  /** Data to download */
  data: any;

  /** Filename (without extension) */
  filename?: string;

  /** Button Label */
  buttonLabel?: string;

  /** Button Variant */
  variant?: "default" | "outline" | "ghost" | "secondary";

  /** Show Progress Indicator */
  showProgress?: boolean;

  /** Custom className */
  className?: string;

  /** Portal-Specific Theming */
  portal?: "entrepreneur" | "customer" | "driver";

  /** Size */
  size?: "default" | "sm" | "lg" | "icon";

  /** Disabled */
  disabled?: boolean;

  /** Custom Export Function (overrides default) */
  onExport?: () => Promise<void>;
}
```

---

## 📄 PDF EXPORT

### Features

- ✅ Company Logo Support
- ✅ Custom Headers/Footers
- ✅ Auto-Table Generation
- ✅ Page Numbering
- ✅ V28.1 Slate Colors
- ✅ Portrait/Landscape Orientation

### Example

```tsx
<UniversalDownload
  type="pdf"
  data={drivers}
  filename="fahrer-liste"
  buttonLabel="Fahrer als PDF exportieren"
  variant="outline"
/>
```

### Direct API Usage

```tsx
import { exportToPDF } from "@/lib/export/pdf-export";

const blob = await exportToPDF(data, {
  title: "Fahrer-Übersicht",
  subtitle: "Aktive Fahrer",
  companyName: "MyDispatch GmbH",
  orientation: "landscape",
});

// Download
const url = URL.createObjectURL(blob);
const link = document.createElement("a");
link.href = url;
link.download = "fahrer.pdf";
link.click();
```

---

## 📊 XLSX EXPORT

### Features

- ✅ Multi-Sheet Support
- ✅ Column Width Customization
- ✅ Compression
- ✅ Excel-Compatible

### Example

```tsx
<UniversalDownload
  type="xlsx"
  data={bookings}
  filename="auftraege-export"
  buttonLabel="Als Excel exportieren"
/>
```

### Multi-Sheet Export

```tsx
import { exportToXLSX } from "@/lib/export/xlsx-export";

const blob = await exportToXLSX(
  {
    Aufträge: bookings,
    Fahrer: drivers,
    Fahrzeuge: vehicles,
  },
  {
    columnWidths: {
      A: 20, // License Plate
      B: 30, // Customer Name
      C: 15, // Status
    },
  }
);
```

---

## 📑 CSV EXPORT

### Features

- ✅ German Excel-Compatible (Semicolon-Separated)
- ✅ UTF-8 BOM for Umlaute
- ✅ Escape Handling

### Example

```tsx
<UniversalDownload
  type="csv"
  data={customers}
  filename="kunden-export"
  buttonLabel="Als CSV exportieren"
/>
```

---

## 🎨 DASHBOARD INTEGRATION

### Standard Pattern

Jedes Dashboard sollte Download-Buttons in konsistenter Position haben:

```tsx
// In DashboardInfoBoard oder Page-Footer
<div className="p-4 bg-slate-50 border-t border-slate-200">
  <div className="flex flex-col gap-2">
    <UniversalDownload
      type="pdf"
      data={currentData}
      filename={`${area}-${new Date().toISOString()}`}
      buttonLabel="Als PDF exportieren"
      variant="outline"
      className="w-full"
    />
    <UniversalDownload
      type="xlsx"
      data={currentData}
      filename={`${area}-${new Date().toISOString()}`}
      buttonLabel="Als Excel exportieren"
      variant="outline"
      className="w-full"
    />
    <UniversalDownload
      type="csv"
      data={currentData}
      filename={`${area}-${new Date().toISOString()}`}
      buttonLabel="Als CSV exportieren"
      variant="outline"
      className="w-full"
    />
  </div>
</div>
```

---

## 🔧 CUSTOM EXPORT FUNCTIONS

Falls Standard-Exports nicht ausreichen:

```tsx
<UniversalDownload
  type="pdf"
  data={invoice}
  filename="rechnung-2024-001"
  onExport={async () => {
    // Custom PDF Generation
    const pdf = await generateInvoicePDF(invoice);

    // Custom Download Logic
    const blob = pdf.output("blob");
    saveAs(blob, "rechnung.pdf");
  }}
/>
```

---

## 🎯 DATA PREPARATION

### Best Practices

```tsx
// ✅ GOOD: Flatten & Format Data
const exportData = bookings.map(booking => ({
  'Auftrag-Nr': booking.booking_number,
  'Kunde': booking.customer_name,
  'Datum': format(new Date(booking.pickup_time), 'dd.MM.yyyy HH:mm'),
  'Status': booking.status === 'completed' ? 'Abgeschlossen' : 'Offen',
  'Preis': formatCurrency(booking.total_price),
}));

<UniversalDownload type="xlsx" data={exportData} />

// ❌ BAD: Raw Database Objects
<UniversalDownload type="xlsx" data={rawBookings} />
```

---

## 📊 PERFORMANCE

### Bundle Sizes

| Library         | Size   | Gzipped |
| --------------- | ------ | ------- |
| jsPDF           | ~180kb | ~60kb   |
| jspdf-autotable | ~40kb  | ~15kb   |
| xlsx            | ~450kb | ~120kb  |

**Total Impact:** ~670kb raw, ~195kb gzipped

### Optimization

- ✅ Dynamic Imports (Lazy Loading)
- ✅ Code Splitting per Export-Type
- ✅ Compression Enabled

```tsx
// Lazy Loading Example (bereits implementiert)
case 'pdf':
  const { exportToPDF } = await import('@/lib/export/pdf-export');
  blob = await exportToPDF(data);
  break;
```

---

## 🐛 TROUBLESHOOTING

### Issue: PDF Tables nicht vollständig

**Lösung:** Prüfe Page-Breaks, verwende `startY` Option:

```tsx
autoTable(doc, {
  startY: 50, // Start nach Header
  // ...
});
```

### Issue: Excel Umlaute falsch

**Lösung:** BOM hinzufügen (bereits implementiert):

```tsx
const BOM = "\uFEFF";
return new Blob([BOM + csv], { type: "text/csv;charset=utf-8;" });
```

### Issue: Download startet nicht

**Lösung:** Prüfe Popup-Blocker, verwende `document.createElement('a').click()`:

```tsx
const link = document.createElement("a");
link.href = url;
link.download = filename;
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
```

---

## 🚀 FUTURE ENHANCEMENTS

### Geplant für V28.3

- [ ] ZIP-Export (Multi-File Archives)
- [ ] Email-Versand-Option
- [ ] Cloud-Storage-Upload (Google Drive, Dropbox)
- [ ] Scheduled Exports (Cron Jobs)
- [ ] Batch-Export-Queue

---

**Status:** Production-Ready ✅  
**Dependencies:** jspdf@2.5.2, jspdf-autotable@3.8.4, xlsx@0.18.5  
**Last Updated:** 2025-10-29
