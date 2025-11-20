# FEHLERLOG V18.5.14

> **Erstellt:** 2025-01-26  
> **Zweck:** Zentrale Dokumentation aller Implementierungsfehler mit Root-Cause-Analyse

---

## 🔴 FEHLER #001: Add-On Card Border zu hell (Pricing Page)

**Datum:** 2025-01-26  
**Datei:** `src/pages/Pricing.tsx` Line 372  
**Schweregrad:** Medium (Visuell)

### Problem

Rechte Add-On Card hatte `border-2 border-primary` auf weißem Hintergrund - visuell kaum sichtbar.

### Root Cause

```css
--primary: 40 31% 88%; /* 88% Helligkeit */
--background: 0 0% 100%; /* 100% Helligkeit */
```

Kontrast-Delta nur 12% → nicht ausreichend für Premium-Design.

### Lösung

```tsx
// ❌ VORHER
<Card className="border-2 border-primary bg-background">

// ✅ NACHHER
<Card className="border-2 border-secondary bg-primary">
```

**Begründung:**

- `border-secondary` (Dunkelblau, 28% Helligkeit) → 72% Kontrast zu Weiß
- `bg-primary` (Beige) → harmonische CI-Farbe für Card-Hintergrund
- Visuell ausgewogen mit linker Card (`border-foreground`)

### Präventionsregel

**ARCA-Regel #003:** Bei hellen CI-Farben (`--primary`) auf hellen Hintergründen (`--background`) IMMER `--secondary` oder `--foreground` für Borders verwenden.

---

## 🔴 FEHLER #002: Zentrierte Beschreibungstexte linksbündig

**Datum:** 2025-01-26  
**Dateien:** `Pricing.tsx:308`, `Contact.tsx:108`, `Home.tsx:595`, `NeXifySupport.tsx:343,426,476,514,646`  
**Schweregrad:** Medium (UX/Design)

### Problem

Beschreibungstexte mit `max-w-3xl mx-auto` waren horizontal zentriert, aber Text-Alignment war linksbündig → unharmonisches Erscheinungsbild.

### Root Cause

**Inkomplettes Design-Pattern:**

```tsx
// ❌ VORHER - Nur Container zentriert, Text linksbündig
<p className="max-w-3xl mx-auto text-lg text-muted-foreground">Text hier...</p>
```

**Design-System-Lücke:** Pattern `max-w-3xl mx-auto` wurde eingeführt ohne explizite Text-Alignment-Regel.

### Lösung

```tsx
// ✅ NACHHER - Container UND Text zentriert
<p className="max-w-3xl mx-auto text-center text-lg text-muted-foreground">Text hier...</p>
```

**Systematische Anwendung:**

- ✅ Pricing.tsx Line 308
- ✅ Contact.tsx Line 108
- ✅ Home.tsx Line 595
- ✅ NeXifySupport.tsx Lines 343, 426, 476, 514, 646

### Präventionsregel

**ARCA-Regel #004:** Bei `max-w-[Breite] mx-auto` Pattern für Beschreibungstexte IMMER `text-center` hinzufügen.

**Design-Pattern (MANDATORY):**

```tsx
// Standard zentrierte Beschreibung
<p className="max-w-3xl mx-auto text-center text-lg text-muted-foreground">
  Beschreibungstext
</p>

// Alternative für kürzere Texte
<p className="max-w-2xl mx-auto text-center text-base text-muted-foreground">
  Kürzerer Text
</p>
```

---

## 📝 FEHLER-KATEGORIEN

- **Design-System:** Farb-Kontraste, Semantic Tokens
- **Logic:** Business-Logik, State-Management
- **Performance:** Rendering, Caching
- **Legal/Compliance:** DSGVO, AI Act
- **UX:** Touch-Targets, Accessibility

---

## 🎯 LESSONS LEARNED

### Design-System

1. **Kontrast-Prüfung:** Helligkeit-Delta > 40% für Premium-Look
2. **CI-Farben:** Nicht automatisch für alle Anwendungsfälle geeignet
3. **Semantic Tokens:** `secondary` (dunkel) für Kontrast auf hellen BG
4. **Text-Alignment:** `mx-auto` Container brauchen `text-center` für harmonisches Gesamtbild
5. **Pattern-Vollständigkeit:** Design-Patterns müssen ALLE Styling-Aspekte definieren (Container + Content)

---

**Nächster Eintrag:** #003
