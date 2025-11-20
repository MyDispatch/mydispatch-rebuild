# V26.0 MIGRATIONS-PROZESS - STANDARD-VORGEHEN
> **Version:** 26.0  
> **Erstellt:** 2025-01-26  
> **Status:** ✅ Verbindlich für alle Migrationen

---

## 🎯 ZIEL

Dieser Prozess beschreibt das Standard-Vorgehen für die Migration bestehender Seiten/Komponenten auf das V26.0 "BALANCED" Design System.

---

## 📋 STANDARD-PROZESS (7 SCHRITTE)

### SCHRITT 1: ANALYSE

**Aktionen:**
1. Bestehende Seite/Komponente öffnen und analysieren
2. UI-Elemente identifizieren (Buttons, Cards, Inputs, etc.)
3. Prüfen: Welche V26-Komponenten existieren bereits?
4. Prüfen: Welche V26-Komponenten müssen neu erstellt werden?

**Output:** Liste der benötigten Komponenten

---

### SCHRITT 2: KOMPONENTEN KOPIEREN

**Aktionen:**
1. Bestehende V26-Komponenten als Vorlage verwenden
2. Kopieren und anpassen für spezifischen Use-Case
3. Neue Komponente mit eindeutigem Namen erstellen

**Beispiel:**
```tsx
// VORLAGE: V26Button.tsx
// KOPIERT & ANGEPASST: V26AuthButton.tsx (falls spezifische Auth-Funktionalität nötig)
// ODER: V26Button direkt verwenden (bevorzugt!)
```

**Regel:** Nur neue Komponenten erstellen, wenn wirklich spezialisiertes Verhalten nötig ist!

---

### SCHRITT 3: NEUE KOMPONENTEN ERSTELLEN

**Aktionen:**
1. Neue Komponente in `src/components/design-system/` erstellen
2. KERNFARBEN aus `pricing-colors.ts` importieren
3. Props-Interface mit TypeScript definieren
4. Hover-Effekte mit `onMouseEnter`/`onMouseLeave`
5. Responsive Sizing (Mobile-First)

**Template:**
```tsx
import { KERNFARBEN } from '@/lib/design-system/pricing-colors';
import { cn } from '@/lib/utils';

interface V26[Name]Props {
  // Props definieren
}

export function V26[Name]({ ...props }: V26[Name]Props) {
  return (
    <div
      className={cn(
        'rounded-2xl transition-all duration-300',
        // ... weitere Klassen
      )}
      style={{
        backgroundColor: KERNFARBEN.weiss,
        borderColor: KERNFARBEN.border_neutral,
        // ... weitere Styles
      }}
    >
      {/* Inhalt */}
    </div>
  );
}
```

---

### SCHRITT 4: KOMPONENTEN DOKUMENTIEREN

**Aktionen:**
1. Markdown-Dokumentation in `docs/` erstellen
2. Props-Tabelle mit Typen
3. Verwendungsbeispiele
4. Design-Specs (Farben, Größen, Hover)
5. Verbotene Patterns

**Template:**
```markdown
# V26.[NAME] COMPONENT

## Props
| Prop | Typ | Default | Beschreibung |
|------|-----|---------|--------------|
| ... | ... | ... | ... |

## Verwendung
```tsx
<V26[Name] {...props} />
```

## Design-Specs
- Farbe: ...
- Hover: ...
```

---

### SCHRITT 5: EXPORTS AKTUALISIEREN

**Aktionen:**
1. Komponente in `src/components/design-system/index.ts` exportieren
2. Sicherstellen: Bestehende Exports bleiben erhalten!

**Code:**
```tsx
// V26 [Category] Components
export { V26NewComponent } from './V26NewComponent';
```

---

### SCHRITT 6: SEITE MIGRIEREN

**Aktionen:**
1. Alte UI-Elemente durch V26-Komponenten ersetzen
2. KERNFARBEN für alle Inline-Styles verwenden
3. Direct Colors eliminieren (`text-white`, `bg-[#...]`)
4. `font-sans` auf allen Text-Elementen
5. Responsive Klassen (`text-sm sm:text-base`)

**Migrations-Reihenfolge:**
1. Imports ergänzen
2. Buttons migrieren
3. Cards migrieren
4. Inputs migrieren
5. Notice-Boxen migrieren
6. Verbleibende Styles auf KERNFARBEN umstellen

**Beispiel:**
```tsx
// ❌ ALT
<button className="bg-primary text-white rounded-lg px-4 py-2">
  Aktion
</button>

// ✅ NEU
import { V26Button } from '@/components/design-system';

<V26Button variant="primary" onClick={handleAction}>
  Aktion
</V26Button>
```

---

### SCHRITT 7: MIGRATIONS-LOG ERSTELLEN

**Aktionen:**
1. Neues Markdown-Dokument in `docs/` erstellen
2. Änderungen dokumentieren (Was, Warum, Vorher/Nachher)
3. Verwendete KERNFARBEN auflisten
4. Screenshots/Metriken hinzufügen

**Template:**
```markdown
# MIGRATION LOG V26.0 - [SEITEN-NAME]

## ZIEL
Migration der [Seite/Komponente] auf V26.0 Design System

## DURCHGEFÜHRTE ÄNDERUNGEN
1. [Component].tsx - [Was wurde geändert]
2. ...

## VERWENDETE KERNFARBEN
- dunkelblau: [Verwendung]
- beige: [Verwendung]
...

## ERGEBNIS
✅ 100% KERNFARBEN-Compliance
✅ Alle Direct Colors eliminiert
```

---

## ✅ QUALITY CHECKLIST

Nach jeder Migration prüfen:

### Design-Compliance
- [ ] Nur KERNFARBEN verwendet (keine Direct Colors)
- [ ] Nur V26-Komponenten verwendet
- [ ] `font-sans` auf allen Text-Elementen
- [ ] Responsive Klassen (`text-sm sm:text-base`)
- [ ] Touch-Targets ≥ 44px

### Funktionalität
- [ ] Alle Funktionen arbeiten wie vorher
- [ ] Keine Regression (Visual Testing)
- [ ] Keine Console-Errors
- [ ] TypeScript-Errors behoben

### Dokumentation
- [ ] Neue Komponenten dokumentiert
- [ ] Migrations-Log erstellt
- [ ] Exports in index.ts ergänzt

---

## 🚫 HÄUFIGE FEHLER

### 1. Bestehende Exports überschreiben
```tsx
// ❌ FALSCH - Überschreibt alles
export { V26Button } from './V26Button';

// ✅ RICHTIG - Erweitert bestehende Exports
// ... bestehende Exports
export { V26Button } from './V26Button';
```

### 2. Direct Colors verwenden
```tsx
// ❌ FALSCH
className="text-white bg-[#323D5E]"

// ✅ RICHTIG
import { KERNFARBEN } from '@/lib/design-system/pricing-colors';
style={{ color: KERNFARBEN.beige, backgroundColor: KERNFARBEN.dunkelblau }}
```

### 3. Unnötige Komponenten erstellen
```tsx
// ❌ FALSCH - Neue Komponente für Standard-Button
export function MyCustomButton() { ... }

// ✅ RICHTIG - Bestehende V26Button verwenden
<V26Button variant="primary" {...props} />
```

### 4. Inkonsistente Hover-Effekte
```tsx
// ❌ FALSCH - Custom Hover
className="hover:bg-primary"

// ✅ RICHTIG - V26-Standard-Hover (scale(1.02))
onMouseEnter={(e) => {
  e.currentTarget.style.transform = 'scale(1.02)';
}}
```

---

## 📊 ERFOLGS-METRIKEN

Jede Migration sollte folgende Ziele erreichen:

| Metrik | Ziel |
|--------|------|
| KERNFARBEN-Compliance | 100% |
| V26-Komponenten-Verwendung | 100% |
| Direct Colors eliminiert | 100% |
| TypeScript-Errors | 0 |
| Funktionalitäts-Erhalt | 100% |
| Dokumentations-Coverage | 100% |

---

## 🔄 NÄCHSTE SCHRITTE NACH MIGRATION

1. **Visual Testing:** Screenshots vorher/nachher vergleichen
2. **Code Review:** Pull Request mit Migrations-Log erstellen
3. **Deploy:** Änderungen in Production deployen
4. **Monitor:** Auf Fehler/Regression prüfen
5. **Dokumentation:** Update in Master-Dokumentation

---

**Erstellt am:** 2025-01-26  
**Version:** V26.0  
**Status:** ✅ Verbindlich für alle Migrationen
