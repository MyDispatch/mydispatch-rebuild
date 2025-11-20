# GRAPHICS GUIDELINES V18.5.14

> **Version:** 18.5.14  
> **Letzte Aktualisierung:** 2025-10-25  
> **Status:** ✅ SYSTEMWEIT GÜLTIG

---

## 🎯 ABSOLUTE REGEL: KEINE GENERISCHEN GRAFIKEN

**NIEMALS:**

- ❌ Stock-Photos von generischen Dashboards
- ❌ Billige Mockups ohne echten Content
- ❌ Grafiken mit Lorem Ipsum oder Platzhalter-Daten
- ❌ Standard-Icons außerhalb des CI-Icon-Systems
- ❌ Langweilige, austauschbare Visualisierungen

**IMMER:**

- ✅ MyDispatch-spezifische Dashboards und Interfaces
- ✅ Echte Daten und realistische Inhalte
- ✅ CI-konforme Farben (HSL-Tokens)
- ✅ Ausschließlich CI-Icon-System (Lucide)
- ✅ Höchste Qualität und Individualität

---

## 🎨 CI-FARBEN FÜR GRAFIKEN

### Primäre Farben (PFLICHT)

```css
/* Primary (Gold/Braun) */
--primary: 31 26% 38%; /* #856d4b */
--primary-glow: 31 26% 48%; /* Hellere Variante */

/* Foreground (Dunkelblau-Grau) */
--foreground: 225 31% 28%; /* #323D5E */

/* Akzent */
--accent: 31 26% 38%; /* #856d4b */
```

### Status-Farben (nur für Ampel-System)

```css
--status-success: 142 76% 36%; /* Grün: #16a34a */
--status-warning: 38 92% 50%; /* Gelb: #f59e0b */
--status-error: 0 84% 60%; /* Rot: #ef4444 */
```

### UI-Farben

```css
--background: 0 0% 100%; /* Weiß */
--muted: 210 40% 96.1%; /* Helles Grau */
--border: 214.3 31.8% 91.4%; /* Border Grau */
```

---

## 📐 GRAFIK-TYPEN FÜR MYDISPATCH

### 1. Dashboard-Screenshots

**Verwendung:** Hero-Bereiche, Feature-Präsentationen

**Inhalte:**

- Echtzeit-GPS-Karte mit Fahrzeug-Markern (Taxi-Icons)
- Live-Dispositions-Panel mit Fahrernamen
- KPI-Cards: "12 Aktive Fahrten", "8 Verfügbare Fahrer", "€2,847 Tagesumsatz"
- Status-Indikatoren (Ampel-System)
- Deutsche Straßennamen und Orte

**Technische Specs:**

- Format: JPG/PNG
- Auflösung: 1920×1080px (16:9 für Hero)
- Qualität: Ultra High Resolution
- Dateiname: `hero-dashboard-screenshot.jpg`
- Speicherort: `src/assets/`

**Beispiel-Prompt:**

```
Professional MyDispatch fleet management dashboard showing:
- GPS map with taxi markers in German city
- Live dispatch panel with driver names and status
- KPI cards in HSL(31 26% 38%) and HSL(225 31% 28%)
- Traffic light status indicators
- Ultra high resolution, 16:9 aspect ratio
```

---

### 2. API/Code-Visualisierungen

**Verwendung:** Entwickler-Dokumentation, Integration-Features

**Inhalte:**

- Echte MyDispatch API-Endpoints
- Code-Snippets mit Syntax-Highlighting in CI-Farben
- Request/Response-Beispiele
- Webhook-Flows

**Beispiel:**

```javascript
// MyDispatch API - Fahrzeug erstellen
POST /api/v1/vehicles
{
  "licensePlate": "B-MY-1234",
  "model": "Mercedes E-Klasse",
  "status": "available"
}
```

**Farbschema:**

- Hintergrund: `hsl(225 31% 28%)` (dunkel)
- Keywords: `hsl(31 26% 38%)` (gold)
- Strings: Weiß
- Kommentare: Grau

---

### 3. GPS-Dashboard-Visualisierung

**Verwendung:** Flottenmanagement-Features, Tracking-Übersicht

**Inhalte:**

- Karte mit mehreren Fahrzeug-Pins
- Routenlinien zwischen Punkten
- Echtzeit-Statusanzeigen
- Deutsche Städte/Straßen

**Icons:** Ausschließlich aus Lucide (Car, MapPin, Navigation)

---

### 4. Statistik-Dashboards

**Verwendung:** Analytics-Features, Reporting-Seiten

**Inhalte:**

- Recharts-Komponenten mit CI-Farben
- Bar-Charts, Line-Charts, Pie-Charts
- KPI-Karten mit echten Metriken
- Zeitreihen-Daten (täglich/wöchentlich/monatlich)

**Farben für Charts:**

```typescript
const chartColors = {
  primary: "hsl(31 26% 38%)", // Gold für Hauptdaten
  secondary: "hsl(225 31% 28%)", // Dunkelblau für Vergleich
  success: "hsl(142 76% 36%)", // Grün für positive Trends
  warning: "hsl(38 92% 50%)", // Gelb für Warnungen
  error: "hsl(0 84% 60%)", // Rot für Fehler
};
```

---

### 5. Mobile-App-Screenshots

**Verwendung:** Mobile Features, Fahrer-App-Präsentation

**Inhalte:**

- iPhone/Android Mockups
- MyDispatch Fahrer-App UI
- Auftrags-Benachrichtigungen
- GPS-Navigation

**Format:** 9:19.5 (Mobile-Aspect-Ratio)

---

### 6. Hero-Banner-Grafiken (NEU V18.5.14)

**Verwendung:** Marketing-Seiten Hero-Bereiche, Abstrakte visuelle Verstärkung

**Konzept:**

- Abstrakte, organische freischwebende Formen
- Rein visuelle Elemente ohne Text, Icons oder Symbole
- Verstärken die Markenbotschaft ("Transparent & fair", "Modern", "Professionell")
- Subtile, nicht ablenkende Hintergrund-Grafiken

**Inhalte:**

- Transparente, überlappende organische Formen (Blob-Shapes)
- Fließende, weiche Kurven und Verläufe
- Mehrschichtige Komposition mit Tiefenwirkung
- Asymmetrische, dynamische Layouts

**Technische Specs:**

- Format: PNG (mit Transparenz)
- Auflösung: 1920×1080px (16:9)
- Qualität: Ultra High Resolution (flux.dev Modell)
- Dateiname: `hero-[seite]-abstract.png`
- Speicherort: `src/assets/`

**CI-Farben (ZWINGEND):**

```css
/* Primary Beige/Gold - 40-70% Opacity */
--primary: 40 31% 88%; /* #EADEBD */

/* Foreground Dark Blue - 40-70% Opacity */
--foreground: 225 31% 28%; /* #323D5E */
```

**Integration:**

```tsx
import heroAbstract from "@/assets/hero-pricing-abstract.png";

<div className="hidden lg:block relative" aria-hidden="true">
  <div className="absolute inset-0 flex items-center justify-center">
    <img
      src={heroAbstract}
      alt=""
      className="w-full h-auto max-w-2xl opacity-70 mix-blend-screen 
                 transition-all duration-700 hover:opacity-80 hover:scale-105"
      loading="eager"
    />
  </div>
</div>;
```

**Beispiel-Prompt (Tarifseite):**

```
Create an ultra-modern, pure abstract composition with organic floating shapes.

STRICT REQUIREMENTS:
- ABSOLUTELY NO TEXT of any kind
- ABSOLUTELY NO icons, symbols, or recognizable objects
- ONLY pure abstract organic shapes

Color Palette (EXACT colors):
- Beige/Gold: #EADEBD with 40-70% opacity
- Dark Blue: #323D5E with 40-70% opacity
- Subtle gradients between these colors

Visual Style:
- Large, smooth organic blob shapes
- Overlapping translucent layers creating depth
- Fluid, flowing forms suggesting movement
- Multiple layers with varying opacity
- Soft edges and smooth curves
- 3D depth through layering and shadows

Composition:
- Asymmetric, dynamic layout
- Shapes appearing to float in space
- Professional B2B aesthetic
- Minimalist and clean

Technical:
- Ultra high resolution 1920x1080
- 16:9 aspect ratio
- Suitable for dark video background overlay
```

**Integration-Regeln:**

- IMMER als `aria-hidden="true"` kennzeichnen (rein dekorativ)
- IMMER in rechter Spalte des Hero-Grid (2-spaltiges Layout)
- IMMER mit `hidden lg:block` (nur Desktop)
- IMMER mit Fade-in Animation (`animate-fade-in`)
- Mix-Blend-Mode: `screen` oder `soft-light` für Video-Overlays
- Opacity: 60-80% für subtile Wirkung
- Hover-Effekte: leichtes Scale und Opacity-Erhöhung

**NIEMALS:**

- ❌ Grafiken mit Text oder Icons
- ❌ Erkennbare Objekte oder Symbole
- ❌ Bunte Farben außerhalb CI-Palette
- ❌ Harte Kanten oder geometrische Formen
- ❌ Zu auffällige oder ablenkende Designs

---

## 🚀 ERSTELLUNGSPROZESS

### Schritt 1: Konzept definieren

```markdown
Welchen Aspekt von MyDispatch sollen wir zeigen?

- Disposition? → Dashboard mit GPS & Fahrerliste
- Flottenmanagement? → Fahrzeug-Übersicht mit Status
- Statistiken? → Charts & KPI-Cards
- API? → Code-Snippet mit Endpoints
```

### Schritt 2: AI-Image-Generation nutzen

```typescript
imagegen--generate_image({
  model: "flux.dev",  // Höchste Qualität für Hero-Grafiken
  width: 1920,
  height: 1080,
  prompt: "Detaillierter Prompt mit CI-Farben, echten Daten, Lucide Icons",
  target_path: "src/assets/[beschreibender-name].jpg"
})
```

### Schritt 3: Import & Verwendung

```tsx
import heroDashboard from "@/assets/hero-dashboard-screenshot.jpg";

<img
  src={heroDashboard}
  alt="MyDispatch Echtzeit-Dashboard mit GPS-Tracking und Live-Disposition"
  className="rounded-xl shadow-2xl border border-primary/20"
/>;
```

### Schritt 4: Asset-Library aktualisieren

```markdown
docs/ASSETS_LIBRARY_V18.5.0.md

- Neue Grafik dokumentieren
- Verwendungszweck beschreiben
- Technische Details ergänzen
```

---

## ✅ QUALITY CHECKLIST

### Vor Verwendung jeder Grafik prüfen:

- [ ] Verwendet ausschließlich CI-Farben (HSL-Tokens)
- [ ] Icons nur aus Lucide/CI-Icon-System
- [ ] Zeigt echte MyDispatch-Funktionalität (keine generischen Inhalte)
- [ ] Deutsche Lokalisierung (Straßennamen, Texte, Formate)
- [ ] Hochauflösend (min. 1920px Breite für Hero)
- [ ] Professionell und individuell (nicht austauschbar)
- [ ] Optimiert für Web (JPG für Fotos, PNG für UI mit Transparenz)
- [ ] Alt-Text für Accessibility vorhanden
- [ ] Responsive (funktioniert auf Mobile, Tablet, Desktop)

---

## 🎯 BEISPIEL-PROMPTS FÜR AI-GENERATION

### Dashboard-Screenshot

```
Professional MyDispatch fleet management dashboard, ultra high resolution:
- Left: GPS map with 8+ taxi markers (yellow icons), route lines, German street names
- Right: Live dispatch panel showing driver names, vehicle status (green/yellow/red dots)
- Top: Navigation bar with MyDispatch logo in HSL(31 26% 38%)
- KPI cards: "12 Aktive Fahrten", "€2,847 Tagesumsatz", "8 Verfügbare Fahrer"
- Modern UI with glassmorphism, subtle shadows
- Color scheme: HSL(31 26% 38%) gold, HSL(225 31% 28%) dark blue-gray
- 16:9 aspect ratio, photorealistic interface design
```

### Statistik-Dashboard

```
MyDispatch analytics dashboard screenshot:
- 3 KPI cards at top showing daily revenue, trips completed, active drivers
- Large area chart showing revenue trend over 30 days
- Pie chart showing trip types distribution (City/Airport/Long-distance)
- Bar chart comparing driver performance
- Color palette: Primary HSL(31 26% 38%), Secondary HSL(225 31% 28%)
- Clean, modern design with subtle gradients
- German labels: "Tagesumsatz", "Fahrten", "Fahrer"
```

### GPS-Tracking

```
Real-time GPS tracking interface for MyDispatch:
- Centered map of Berlin with 12 taxi vehicle markers
- Active route lines in gold HSL(31 26% 38%)
- Driver info cards on right showing name, vehicle, current location
- Status indicators: available (green), busy (red), break (yellow)
- Modern map UI with zoom controls
- Professional design, high contrast
```

---

## 📦 DATEIBENENNUNG

```
[bereich]-[typ]-[beschreibung].[ext]

Beispiele:
hero-dashboard-screenshot.jpg
feature-gps-tracking-interface.png
api-code-example-vehicles.png
stats-revenue-chart-mockup.jpg
mobile-driver-app-screenshot.png
```

---

## 🚫 HÄUFIGE FEHLER VERMEIDEN

### ❌ FALSCH

```
- Generic stock photo eines Dashboards
- Lorem Ipsum Texte in der UI
- Icons aus Font Awesome oder anderen Quellen
- Farben außerhalb der CI-Palette
- Niedrige Auflösung (<1200px)
- Englische Texte statt Deutsch
```

### ✅ RICHTIG

```
- MyDispatch-spezifisches Dashboard mit echten Features
- Deutsche Texte: "Aktive Fahrten", "Verfügbare Fahrer"
- Ausschließlich Lucide Icons (Car, MapPin, Users, etc.)
- Exakte CI-Farben: HSL(31 26% 38%), HSL(225 31% 28%)
- Ultra High Resolution (1920×1080px+)
- Vollständig auf Deutsch lokalisiert
```

---

## 📚 INTEGRATION MIT ANDEREN VORGABEN

Diese Guidelines arbeiten zusammen mit:

- `ICON_GUIDELINES.md` - CI-konformes Icon-System
- `DESIGN_SYSTEM_HERO_VORGABEN.md` - Hero-Bereiche
- `ASSETS_LIBRARY_V18.5.0.md` - Asset-Verwaltung
- `UI_LIBRARY_SYSTEM_V18.5.0.md` - UI-Komponenten

---

## 📝 CHANGELOG V18.5.14

### NEU: Hero-Banner-Grafiken (2025-10-25)

- **Neue Kategorie:** Abstrakte freischwebende Hero-Grafiken
- **Zweck:** Visuelle Verstärkung der Markenbotschaft ohne Ablenkung
- **Implementiert:** Tarifseite Hero-Banner (`hero-pricing-abstract.png`)
- **Specs:** Rein abstrakte organische Formen, CI-Farben, 40-70% Opacity
- **Integration:** Rechte Spalte Hero-Grid, mix-blend-screen, aria-hidden
- **Prompting:** Strikte Anforderungen gegen Text/Icons dokumentiert

**Assets:**

- `src/assets/hero-pricing-abstract.png` (1920×1080, flux.dev)

---

**SYSTEMWEITE VORGABE - BEI ALLEN GRAFIKEN ANWENDEN!**
