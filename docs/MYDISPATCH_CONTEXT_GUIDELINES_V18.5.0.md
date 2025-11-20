# MYDISPATCH CONTEXT GUIDELINES V18.5.0

> **MyDispatch-Kontext für alle Entwicklungsarbeiten**  
> **Version:** 18.5.0  
> **Letzte Aktualisierung:** 2025-01-26

---

## 🎯 GRUNDREGEL

**JEDE** Entwicklungsarbeit muss den vollständigen MyDispatch-Kontext berücksichtigen.

---

## 📋 WAS IST MYDISPATCH?

### Produkt

**MyDispatch** ist eine cloudbasierte Dispositions- und Flottenmanagement-Software für:

- Kurierdienste
- Logistikunternehmen
- Transportdienstleister
- Entsorgungsunternehmen

### Kernfunktionen

1. **GPS-Flottentracking** - Echtzeit-Fahrzeugverfolgung
2. **Tourenplanung** - Optimierte Routenberechnung
3. **Auftragsmanagement** - Digitale Auftragsverwaltung
4. **Kundenverwaltung** - Kontakt- und Adressdatenbank
5. **Reporting** - Auswertungen und Statistiken
6. **API-Integration** - Anbindung an Drittsysteme

---

## 👥 ZIELGRUPPE

### Primäre Zielgruppe

- **Geschäftsführer** kleiner/mittelständischer Kurier- und Logistikunternehmen
- **Disponenten** in Transportbetrieben
- **Flottenmanager** in Entsorgungsbetrieben

### Charakteristika

- 🇩🇪 Deutschsprachig
- 💼 Mittelstand (5-50 Mitarbeiter typisch)
- 🚚 Täglicher Einsatz im operativen Geschäft
- ⏰ Zeitkritische Prozesse
- 📱 Mobile Nutzung (Fahrer-Apps)

### Erwartungen

- **Professionalität** - Seriöser, vertrauenswürdiger Auftritt
- **Klarheit** - Verständliche, deutsche Fachsprache
- **Transparenz** - Klare Preise, keine versteckten Kosten
- **Rechtssicherheit** - DSGVO-konform, deutsche Rechtstexte
- **Support** - Deutschsprachiger Support

---

## 📐 DEUTSCHE DESIGN-ERWARTUNGEN

### Grafik & Visuals

- ✅ Hochwertig, individuell, informativ
- ✅ Realistische Screenshots/Dashboards
- ✅ CI-konforme Farben (MyDispatch-Blau/Beige)
- ❌ Generische Stock-Fotos
- ❌ Bunte, verspielte Illustrationen
- ❌ Amerikanische "Flashy"-Designs

### Typografie

- ✅ Seriöse, gut lesbare Schriften
- ✅ Silbentrennung bei deutschen Texten (`hyphens-auto`)
- ✅ Ausreichend Weißraum
- ❌ Zu viele Schriftarten
- ❌ Übertrieben große Headlines
- ❌ Textwüsten ohne Struktur

### Farbgebung

- ✅ Gedämpfte, professionelle Farben
- ✅ Hohe Kontraste für Lesbarkeit
- ✅ CI-konforme Farben
- ❌ Grelle Neonfarben
- ❌ Zu viele verschiedene Farben
- ❌ Niedrige Kontraste

---

## ⚖️ RECHTLICHE ASPEKTE (DEUTSCHLAND)

### Pflicht-Angaben (§5 TMG)

- Vollständiges Impressum
- Datenschutzerklärung (DSGVO-konform)
- AGB
- Widerrufsbelehrung (bei Online-Verkauf)

### Preisangaben

- ✅ Bruttopreise (inkl. MwSt.)
- ✅ "pro Monat", "jährlich", etc. klar kennzeichnen
- ✅ Kündigungsfristen transparent
- ❌ "Ab"-Preise ohne Erklärung
- ❌ Versteckte Kosten
- ❌ Automatische Vertragsverlängerungen ohne Hinweis

### Datenschutz (DSGVO)

- ✅ Cookie-Consent vor Tracking
- ✅ Datenverarbeitung transparent erklären
- ✅ Auskunfts- und Löschrechte
- ✅ Auftragsverarbeitung (AVV) bei Kundennutzung
- ❌ Daten ohne Einwilligung sammeln
- ❌ Tracking ohne Opt-In

### Marketing-Aussagen

- ✅ Nachweisbare Fakten
- ✅ Vergleichbare, objektive Aussagen
- ❌ Superlative ohne Nachweis ("Bestes System")
- ❌ Irreführende Vergleiche
- ❌ Fake-Testimonials

---

## 💬 TONALITÄT & SPRACHE

### Schreibstil

- **Professionell, aber zugänglich**
  - "Optimieren Sie Ihre Disposition" ✅
  - "Mach deine Touren cooler" ❌

- **Fachsprachlich korrekt**
  - "Tourenplanung mit Echtzeit-GPS-Tracking" ✅
  - "Mega krasse Live-Ortung" ❌

- **Konkret & nutzenorientiert**
  - "Sparen Sie bis zu 30% Kraftstoffkosten durch optimierte Routen" ✅
  - "Werden Sie erfolgreicher mit unserer Software" ❌

### Deutsche Besonderheiten

- **Du vs. Sie:** IMMER "Sie" (B2B-Kontext)
- **Gendern:** Neutral oder Doppelnennung ("Disponenten/Disponentinnen")
- **Anglizismen:** Sparsam einsetzen, nur wenn etabliert
  - ✅ "Dashboard", "API", "GPS"
  - ❌ "Feature", "Supply Chain Optimization"

---

## 🎨 CI-RICHTLINIEN (CORPORATE IDENTITY)

### Farben (HSL)

- **Primary (Blau):** `hsl(215, 25%, 27%)` → #323D5E
- **Primary-Foreground (Beige):** `hsl(40, 45%, 83%)` → #EADEBD
- **Accent (Bronze/Gold):** Für Highlights

### Icons

**NUR Lucide Icons in CI-Farben:**

- `text-foreground` (Primary-Blau)
- `text-muted-foreground` (Grau)
- `text-accent` (Bronze/Gold, selten)

**VERBOTEN:**

- Status-Farben auf Icons (Grün/Gelb/Rot)
- Bunte Icons
- Nicht-Lucide Icons

### Buttons

- **Primär:** `bg-primary` (Beige) + `text-foreground` (Blau)
- **Sekundär:** `bg-secondary` (Dunkelblau) + `text-foreground`
- **Outline:** Transparent mit Border

---

## ✅ DEVELOPMENT CHECKLIST

Vor jeder Implementierung:

### 1. Kontext-Check

```
[ ] Passt die Lösung zur MyDispatch-Zielgruppe?
[ ] Entspricht es deutschen Design-Erwartungen?
[ ] Ist die Sprache professionell und korrekt?
[ ] Sind alle rechtlichen Aspekte berücksichtigt?
```

### 2. Design-Check

```
[ ] CI-konforme Farben (nur Semantic Tokens)?
[ ] Icons in CI-Farben (text-foreground/muted)?
[ ] Mobile-First Responsive Design?
[ ] Touch-Targets min-h-[44px]?
```

### 3. Content-Check

```
[ ] Preise transparent und korrekt dargestellt?
[ ] Keine Superlative ohne Nachweis?
[ ] DSGVO-konforme Datenverarbeitung?
[ ] Silbentrennung bei deutschen Texten?
```

### 4. Technical-Check

```
[ ] Alle Komponenten über zentrale Systeme?
[ ] Keine Inline-Styles oder direkte Farben?
[ ] Accessibility (ARIA, Alt-Texte)?
[ ] SEO (Meta, Headings, Semantik)?
```

---

## 📚 SIEHE AUCH

- `SYSTEM_DESIGN_PRINCIPLES_V18.5.0.md` - Design-Prinzipien
- `MARKETING_CONTENT_STANDARDS_V18.5.0.md` - Content-Standards
- `ICON_GUIDELINES.md` - Icon-Regeln
- `BUTTON_USAGE_GUIDE_V18.5.0.md` - Button-Guide

---

**KRITISCH:** Dieser Kontext ist bei JEDER Entwicklungsarbeit zu berücksichtigen.
