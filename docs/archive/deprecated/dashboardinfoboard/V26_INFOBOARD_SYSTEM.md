# V26.0 INFOBOARD SYSTEM

> **Version:** 26.0  
> **Letzte Aktualisierung:** 2025-01-26  
> **Status:** ✅ Production Ready

---

## 🎯 ÜBERSICHT

Das Infoboard-System (auch "Notice Board", "Hinweis-Panel") ist ein standardisiertes System für konsistente Informations-Darstellung in MyDispatch. Es ersetzt alle Custom-Notice-Boxen und gewährleistet visuelle Konsistenz.

---

## 🎨 KOMPONENTE: V26InfoBox

**Datei:** `src/components/design-system/V26InfoBox.tsx`

### Design-Spezifikation

| Element           | Wert                               | Beschreibung                                |
| ----------------- | ---------------------------------- | ------------------------------------------- |
| **Hintergrund**   | `#F9FAFB` (Canvas)                 | Neutrale, nicht-ablenkende Hintergrundfarbe |
| **Border-Radius** | `8px` (rounded-lg)                 | Konsistent mit Card-Design                  |
| **Padding**       | `16px` (p-4)                       | Ausreichend Luft für Lesbarkeit             |
| **Text-Farbe**    | `#374151` (text_secondary)         | Optimale Lesbarkeit auf Canvas              |
| **Titel-Farbe**   | `#111827` (text_primary)           | Hervorhebung wichtiger Informationen        |
| **Icon-Größe**    | `16px` (h-4 w-4)                   | Proportional zum Text                       |
| **Schriftgröße**  | `12px / 14px` (text-xs sm:text-sm) | Responsive Typografie                       |

### Typen & Icons

#### 1. Info (Standard)

```tsx
<V26InfoBox type="info" title="Hinweis">
  Allgemeine Informationen für den Nutzer.
</V26InfoBox>
```

- **Icon:** `Info` (ℹ️)
- **Icon-Farbe:** Dunkelblau (`#323D5E`)
- **Verwendung:** Standard-Hinweise, Feature-Erklärungen, Tooltips

#### 2. Warning

```tsx
<V26InfoBox type="warning" title="Achtung">
  Wichtige Warnung für den Nutzer.
</V26InfoBox>
```

- **Icon:** `AlertTriangle` (⚠️)
- **Icon-Farbe:** Orange (`#F59E0B`)
- **Verwendung:** Warnungen, nicht-rückgängig machbare Aktionen

#### 3. Legal

```tsx
<V26InfoBox type="legal" title="Rechtlicher Hinweis">
  DSGVO- oder PBefG-relevante Information.
</V26InfoBox>
```

- **Icon:** `Scale` (⚖️)
- **Icon-Farbe:** Dunkelblau (`#323D5E`)
- **Verwendung:** DSGVO, PBefG, Compliance-Hinweise

---

## 📋 VERWENDUNGS-SZENARIEN

### 1. PBefG-Hinweise (Aufbewahrungspflicht)

**Kontext:** Auftragsverwaltung, Detailansichten  
**Typ:** `legal`

```tsx
<V26InfoBox type="legal" title="PBefG § 51 Hinweis">
  Auftragsdaten werden gemäß PBefG § 51 für 10 Jahre gespeichert. Diese Frist ist gesetzlich
  vorgeschrieben und kann nicht verkürzt werden.
</V26InfoBox>
```

**Platzierung:** Footer von Dialogen, unterhalb von Formularen

---

### 2. DSGVO-Hinweise (Datenschutz)

**Kontext:** Kunden-/Fahrer-Formulare, Dateneingabe  
**Typ:** `legal`

```tsx
<V26InfoBox type="legal" title="DSGVO-Hinweis">
  Personenbezogene Daten werden nur für die Auftragsabwicklung verwendet. Weitere Informationen
  finden Sie in unserer{" "}
  <a
    href="/datenschutz"
    className="underline font-semibold"
    style={{ color: KERNFARBEN.dunkelblau }}
  >
    Datenschutzerklärung
  </a>
  .
</V26InfoBox>
```

**Platzierung:** Oberhalb von Formularen mit personenbezogenen Daten

---

### 3. Pflichtfeld-Hinweise

**Kontext:** Formulare  
**Typ:** `info`

```tsx
<V26InfoBox>
  * Pflichtfelder müssen ausgefüllt werden, bevor das Formular gespeichert werden kann.
</V26InfoBox>
```

**Platzierung:** Unterhalb von Formular-Titeln, vor Eingabefeldern

---

### 4. Feature-Erklärungen

**Kontext:** Onboarding, neue Features  
**Typ:** `info`

```tsx
<V26InfoBox title="Neue Funktion: Smart Assignment">
  Mit Smart Assignment werden Aufträge automatisch dem optimalen Fahrer zugewiesen. Die KI
  berücksichtigt Standort, Verfügbarkeit und historische Daten.
</V26InfoBox>
```

**Platzierung:** Oberhalb von Feature-Bereichen, in Onboarding-Flows

---

### 5. Warnungen (Nicht-rückgängig)

**Kontext:** Lösch-Dialoge, kritische Aktionen  
**Typ:** `warning`

```tsx
<V26InfoBox type="warning" title="Achtung: Diese Aktion ist nicht rückgängig">
  Gelöschte Aufträge können nicht wiederhergestellt werden. Die Daten werden dauerhaft aus dem
  System entfernt.
</V26InfoBox>
```

**Platzierung:** Innerhalb von Bestätigungs-Dialogen

---

### 6. Business-Tier-Hinweise

**Kontext:** Feature-Locks, Tarif-Upgrades  
**Typ:** `info`

```tsx
<V26InfoBox title="Business-Feature">
  Diese Funktion ist nur im Business-Tarif verfügbar.{" "}
  <a href="/pricing" className="underline font-semibold" style={{ color: KERNFARBEN.dunkelblau }}>
    Jetzt upgraden
  </a>
</V26InfoBox>
```

**Platzierung:** Unterhalb von gesperrten Features

---

## 🎨 DESIGN-REGELN

### Typografie

- **Titel:** `font-semibold`, `text_primary`
- **Body:** `font-normal`, `text_secondary`
- **Links:** `underline`, `font-semibold`, Dunkelblau

### Spacing

- **Padding:** `p-4` (16px)
- **Margin Bottom (Titel):** `mb-2` (8px)
- **Gap (Icon + Titel):** `gap-2` (8px)

### Farben

- **Hintergrund:** IMMER `KERNFARBEN.canvas`
- **Text:** IMMER `KERNFARBEN.text_secondary` (Body), `KERNFARBEN.text_primary` (Titel)
- **Icons:** Typ-abhängig (siehe oben)

### Responsive

- **Text-Größe:** `text-xs sm:text-sm` (12px → 14px)
- **Padding:** Gleichbleibend auf allen Geräten

---

## 🚫 VERBOTEN

### Direct Background-Colors

```tsx
// ❌ FALSCH
<div className="bg-gray-50 p-4">
  Hinweis
</div>

// ✅ RICHTIG
<V26InfoBox>
  Hinweis
</V26InfoBox>
```

### Inkonsistente Icons

```tsx
// ❌ FALSCH - Custom Icon ohne Komponente
<div className="flex items-center gap-2">
  <AlertTriangle className="h-4 w-4 text-yellow-500" />
  <p>Warnung</p>
</div>

// ✅ RICHTIG - V26InfoBox mit type="warning"
<V26InfoBox type="warning" title="Warnung">
  Wichtige Warnung
</V26InfoBox>
```

### Mehrere Typen in einer Box

```tsx
// ❌ FALSCH - Vermischung von Typen
<V26InfoBox type="warning">
  <Scale className="h-4 w-4" /> {/* Legal-Icon in Warning-Box */}
  DSGVO-Hinweis
</V26InfoBox>

// ✅ RICHTIG - Konsistenter Typ
<V26InfoBox type="legal" title="DSGVO-Hinweis">
  Personenbezogene Daten werden geschützt.
</V26InfoBox>
```

---

## 📊 PLATZIERUNGS-MATRIX

| Kontext              | Typ     | Platzierung       | Beispiel               |
| -------------------- | ------- | ----------------- | ---------------------- |
| **Formular (DSGVO)** | Legal   | Oberhalb Formular | Kunden-/Fahrer-Anlage  |
| **Dialog (PBefG)**   | Legal   | Footer            | Auftrags-Details       |
| **Pflichtfelder**    | Info    | Unterhalb Titel   | Alle Formulare         |
| **Lösch-Aktion**     | Warning | Innerhalb Dialog  | Bestätigungs-Dialog    |
| **Feature-Lock**     | Info    | Unterhalb Feature | Business-Tarif-Hinweis |
| **Onboarding**       | Info    | Oberhalb Feature  | Neue Funktionen        |

---

## 🔄 MIGRATION VON ALT-SYSTEMEN

### Schritt 1: Identifizieren

Suche nach Custom-Notice-Boxen:

```bash
grep -r "bg-muted" src/
grep -r "bg-gray-50" src/
grep -r "rounded-lg.*p-4" src/
```

### Schritt 2: Typ bestimmen

- **Rechtlich (DSGVO, PBefG)?** → `type="legal"`
- **Warnung?** → `type="warning"`
- **Standard-Info?** → `type="info"` (Standard)

### Schritt 3: Ersetzen

```tsx
// ALT
<div className="bg-muted/50 p-4 rounded-lg text-xs sm:text-sm text-muted-foreground">
  <strong>⚖️ PBefG-Hinweis:</strong> Auftragsdaten werden für 10 Jahre gespeichert.
</div>

// NEU
<V26InfoBox type="legal" title="PBefG-Hinweis">
  Auftragsdaten werden für 10 Jahre gespeichert.
</V26InfoBox>
```

### Schritt 4: Testen

- [ ] Visuelle Konsistenz (Canvas-Hintergrund)
- [ ] Icon korrekt (Typ-abhängig)
- [ ] Responsive (Mobile + Desktop)
- [ ] Lesbarkeit (Kontrast WCAG AA)

---

## ✅ QUALITY CHECKLIST

Für jede InfoBox:

- [ ] Korrekte Komponente (`V26InfoBox`) verwendet
- [ ] Passender `type` gewählt (info/warning/legal)
- [ ] Titel vorhanden (falls relevant)
- [ ] Text in `text_secondary` (automatisch)
- [ ] Links in Dunkelblau mit Underline
- [ ] `font-sans` aktiv (automatisch)
- [ ] Platzierung logisch (siehe Matrix)

---

## 📈 METRIKEN

| Metrik              | Ziel         | Status |
| ------------------- | ------------ | ------ |
| **Konsistenz**      | 100%         | ✅     |
| **Typen-Abdeckung** | 3 Typen      | ✅     |
| **Accessibility**   | WCAG AA      | ✅     |
| **Performance**     | < 1ms Render | ✅     |

---

**Erstellt am:** 2025-01-26  
**Version:** V26.0  
**Status:** ✅ Production Ready
