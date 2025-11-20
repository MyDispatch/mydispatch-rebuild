# HELP-SYSTEM DESIGN V26.1 - NUTZERFREUNDLICHKEIT

**Status:** ✅ MANDATORY  
**Version:** 26.1  
**Datum:** 2025-10-26  
**Agent:** NeXify AI Development

---

## 🎯 ZWECK

Dieses Dokument definiert das **Help-System** für MyDispatch, das höchste Nutzerfreundlichkeit in Design, Funktion, Logik und einfache Bedienung sicherstellt.

**VERPFLICHTEND:** Alle Bereiche MÜSSEN intuitive Hilfe-Funktionen bieten.

---

## 💬 HELP-SYSTEM KOMPONENTEN

### 1. INLINE HELP (Tooltips)

**Verwendung:** Für kurze Erklärungen direkt am UI-Element

**Design:**

```typescript
import { Tooltip } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

<Tooltip content="Hier können Sie einen neuen Auftrag erstellen">
  <HelpCircle className="h-4 w-4 text-muted-foreground" />
</Tooltip>
```

**Platzierung:**

- Rechts neben Label/Heading
- Konsistente Position systemweit
- Nicht im Fokus-Flow (kein Tab-Index)

---

### 2. CONTEXTUAL HELP (Info-Boxen)

**Verwendung:** Für längere Erklärungen zu Sektionen/Features

**Design:**

```typescript
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

<Alert variant="default" className="mb-4">
  <Info className="h-4 w-4" />
  <AlertDescription>
    Diese Funktion ermöglicht...
  </AlertDescription>
</Alert>
```

**Arten:**

- Info (blau): Allgemeine Informationen
- Success (grün): Erfolgsmeldungen
- Warning (gelb): Warnungen
- Error (rot): Fehlermeldungen

---

### 3. HELP SIDEBAR (Kontextuelle Hilfe)

**Verwendung:** Für umfangreiche Erklärungen parallel zur Arbeit

**Design:**

```typescript
<div className="fixed right-0 top-16 w-80 h-full bg-card border-l p-4 overflow-y-auto">
  <h3 className="font-bold mb-4">Hilfe: {currentSection}</h3>
  <div className="space-y-4">
    {helpContent}
  </div>
</div>
```

**Features:**

- Kontextabhängig (zeigt Hilfe zur aktuellen Seite)
- Durchsuchbar
- Mit Screenshots/Illustrationen
- Kollabierbar

---

### 4. QUICK START GUIDE (Onboarding)

**Verwendung:** Für neue Nutzer beim ersten Login

**Design:**

```typescript
import { WelcomeWizard } from '@/components/onboarding/WelcomeWizard';

// Zeigt Step-by-Step Anleitung
<WelcomeWizard
  steps={[
    { title: 'Willkommen', content: '...' },
    { title: 'Auftrag erstellen', content: '...' },
    { title: 'Fahrzeug zuweisen', content: '...' },
  ]}
  onComplete={() => {/* ... */}}
/>
```

**Features:**

- Interaktiver Walkthrough
- Überspringbar
- Wiederaufrufbar über Hilfe-Menü

---

### 5. VIDEO-FREE DOCUMENTATION

**Verwendung:** Schriftliche Dokumentation ohne Videos

**Struktur:**

```
docs/
├── GETTING_STARTED.md          # Erste Schritte
├── FEATURES/
│   ├── BOOKINGS.md            # Aufträge verwalten
│   ├── DRIVERS.md             # Fahrer verwalten
│   ├── VEHICLES.md            # Fahrzeuge verwalten
│   └── INVOICES.md            # Rechnungen erstellen
├── FAQ.md                      # Häufige Fragen
└── TROUBLESHOOTING.md         # Problemlösung
```

**Format:**

- Schritt-für-Schritt Anleitungen
- Screenshots mit Beschriftungen
- Klare Beispiele
- Suchbar & verlinkbar

---

### 6. SMART FORM VALIDATION

**Verwendung:** Hilfreiche Fehlermeldungen in Formularen

**Design:**

```typescript
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Bitte geben Sie eine gültige E-Mail-Adresse ein'),
  phone: z.string().regex(/^[0-9]{10,}$/, 'Telefonnummer muss mindestens 10 Ziffern haben'),
});

// Zeigt hilfreiche Meldung unter dem Feld
{errors.email && (
  <p className="text-sm text-destructive mt-1">
    {errors.email.message}
  </p>
)}
```

**Prinzipien:**

- Konkrete Fehlerbeschreibung (nicht "Ungültige Eingabe")
- Lösungsvorschlag (z.B. "Format: +49 123 456789")
- Inline neben Feld
- Rot mit Alert-Icon

---

### 7. EMPTY STATES (Leere Zustände)

**Verwendung:** Hilfreiche Anleitung wenn keine Daten vorhanden

**Design:**

```typescript
import { EmptyState } from '@/components/shared/EmptyState';

<EmptyState
  icon={FileText}
  title="Noch keine Aufträge"
  description="Erstellen Sie Ihren ersten Auftrag, um loszulegen."
  action={{
    label: "Auftrag erstellen",
    onClick: () => navigate('/auftraege/neu')
  }}
/>
```

**Prinzipien:**

- Erklärt Zustand
- Zeigt nächsten Schritt
- Call-to-Action Button
- Freundlicher Ton

---

### 8. PROGRESSIVE DISCLOSURE (Schrittweise Komplexität)

**Verwendung:** Erweiterte Features ausblendbar für Anfänger

**Design:**

```typescript
const [showAdvanced, setShowAdvanced] = useState(false);

<div>
  {/* Basis-Felder */}
  <Input label="Name" />
  <Input label="E-Mail" />

  {/* Erweiterte Felder */}
  <button
    onClick={() => setShowAdvanced(!showAdvanced)}
    className="text-sm text-primary mt-2"
  >
    {showAdvanced ? 'Weniger Optionen' : 'Erweiterte Optionen'}
  </button>

  {showAdvanced && (
    <div className="mt-4 space-y-4 border-t pt-4">
      <Input label="Abteilung" />
      <Input label="Notizen" />
    </div>
  )}
</div>
```

**Prinzipien:**

- Einfache Basis-Ansicht
- Erweiterte Features auf Wunsch
- Klar gekennzeichnet
- Status bleibt erhalten

---

### 9. KEYBOARD SHORTCUTS (Hilfe-Overlay)

**Verwendung:** Tastaturkürzel für Power-User

**Design:**

```typescript
import { Dialog } from '@/components/ui/dialog';

// Öffnen mit '?' oder 'Ctrl+/'
<Dialog open={showShortcuts}>
  <DialogTitle>Tastaturkürzel</DialogTitle>
  <DialogContent>
    <table>
      <tr>
        <td><kbd>Ctrl</kbd> + <kbd>N</kbd></td>
        <td>Neuer Auftrag</td>
      </tr>
      <tr>
        <td><kbd>Ctrl</kbd> + <kbd>S</kbd></td>
        <td>Speichern</td>
      </tr>
      <tr>
        <td><kbd>Esc</kbd></td>
        <td>Dialog schließen</td>
      </tr>
    </table>
  </DialogContent>
</Dialog>
```

---

### 10. SEARCH-INTEGRATED HELP

**Verwendung:** Hilfe durchsuchen direkt in der App

**Design:**

```typescript
import { Command } from '@/components/ui/command';

<Command>
  <CommandInput placeholder="Hilfe durchsuchen..." />
  <CommandList>
    <CommandGroup heading="Häufige Themen">
      <CommandItem onSelect={() => navigate('/help/bookings')}>
        Wie erstelle ich einen Auftrag?
      </CommandItem>
      <CommandItem onSelect={() => navigate('/help/drivers')}>
        Wie weise ich einen Fahrer zu?
      </CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
```

**Features:**

- Fuzzy Search
- Kategorisiert
- Mit Direktlinks
- Schnellzugriff mit Ctrl+K

---

## 📐 DESIGN STANDARDS

### Hilfe-Icons

**MANDATORY:** Immer `HelpCircle` verwenden

```typescript
import { HelpCircle } from 'lucide-react';

<HelpCircle className="h-4 w-4 text-muted-foreground" />
```

### Farben

- Info: `text-primary` / `bg-primary/10`
- Success: `text-status-success` / `bg-status-success/10`
- Warning: `text-status-warning` / `bg-status-warning/10`
- Error: `text-status-error` / `bg-status-error/10`

### Positioning

```typescript
// Tooltip neben Label
<div className="flex items-center gap-2">
  <Label>Feldname</Label>
  <Tooltip content="Hilfetext">
    <HelpCircle className="h-4 w-4" />
  </Tooltip>
</div>
```

---

## 🎓 CONTENT GUIDELINES

### Ton & Stil

- **Freundlich:** "Willkommen" statt "Bitte beachten Sie"
- **Konkret:** "Klicken Sie auf 'Speichern'" statt "Bestätigen Sie"
- **Kurz:** Max. 2-3 Sätze pro Tooltip
- **Aktiv:** "Erstellen Sie" statt "Es kann erstellt werden"

### Struktur

1. **Was:** Was macht diese Funktion?
2. **Warum:** Warum ist sie nützlich?
3. **Wie:** Wie verwende ich sie?

**Beispiel:**

```
Auftrag erstellen
-----------------
Erfassen Sie neue Transportaufträge mit allen Details.
Dies ermöglicht die Zuweisung von Fahrzeugen und Fahrern.

1. Klicken Sie auf "Neuer Auftrag"
2. Füllen Sie die Pflichtfelder aus
3. Speichern Sie den Auftrag
```

---

## 📱 MOBILE HELP

### Touch-Friendly

- Touch-Targets ≥44px
- Tooltips auf Touch öffnen (nicht Hover)
- Swipe-Gestures für Hilfe-Sidebar

### Vereinfachte Ansicht

- Weniger Text auf Mobile
- Größere Icons
- Bottom Sheets statt Sidebar

---

## 🔧 IMPLEMENTATION CHECKLIST

Für jede neue Seite/Feature:

- [ ] Inline Help (Tooltips) bei komplexen Feldern
- [ ] Contextual Help (Info-Box) am Seiten-Anfang
- [ ] Empty States für leere Listen/Tabellen
- [ ] Progressive Disclosure für erweiterte Features
- [ ] Smart Form Validation mit hilfreichen Meldungen
- [ ] Keyboard Shortcuts dokumentiert
- [ ] Mobile-Optimierung
- [ ] Dokumentation geschrieben

---

## ✅ QUALITÄTSSICHERUNG

### Testing

1. **Usability Test:** Neuer Nutzer ohne Schulung
2. **A11y Test:** Screen Reader kompatibel
3. **Mobile Test:** Touch-Bedienung funktioniert
4. **Content Test:** Hilfe-Texte verständlich

---

**Status:** ✅ MANDATORY  
**Version:** V26.1  
**Compliance:** Alle neuen Features MÜSSEN Help-System integrieren
