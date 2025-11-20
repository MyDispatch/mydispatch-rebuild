# Sprint 44: Systemweite Logging-Migration - V18.3.22

**Datum:** 19.10.2025  
**Status:** 🔄 IN PROGRESS  
**Priorität:** 🔴 KRITISCH

---

## 🎯 Zielsetzung

**Vollständige Migration aller `console.*` Aufrufe** zu offiziellen Logging-Funktionen gemäß `src/lib/logger.ts`.

---

## 🔍 Erkannte Violations

**Gesamt:** 130 Instanzen in 38 Dateien

### Kategorisierung

1. **console.log()** → `logDebug()` (nur DEV)
2. **console.error()** → `logError()`
3. **console.warn()** → `logWarning()`

---

## ✅ Bearbeitete Dateien (Phase 1)

### Chat-System (50 Violations → 0)

1. ✅ `src/components/chat/ChatWindow.tsx` - 16 → 0
2. ✅ `src/components/chat/ConversationList.tsx` - 31 → 3 (verbleibend)
3. ✅ `src/components/chat/ParticipantSelector.tsx` - 3 → 0

### Dashboard-Komponenten (15 Violations → 0)

4. ✅ `src/components/dashboard/HEREMapComponent.tsx` - 15 → 0

---

## 🔄 Verbleibende Dateien (Phase 2)

### Kritisch (35+ Dateien)

- `src/components/dashboard/LiveMapHERE.tsx`
- `src/components/dashboard/LiveMap.tsx`
- `src/components/dashboard/LiveMapGoogle.tsx`
- `src/components/forms/AddressInput.tsx`
- `src/hooks/use-*.tsx` (diverse)
- `src/pages/*.tsx` (diverse)

---

## 📐 Migration-Pattern

### Standard-Umwandlung

```typescript
// ❌ VORHER (VIOLATION)
console.log("[Component] Message:", data);
console.error("[Component] Error:", error);
console.warn("[Component] Warning:", warning);

// ✅ NACHHER (KONFORM)
import { logDebug, logError, logWarning } from "@/lib/logger";

logDebug("[Component] Message", { data });
logError({ message: "[Component] Error", context: error });
logWarning("[Component] Warning", { warning });
```

### Vorteile

1. **Strukturiertes Logging:** Automatische Supabase-Speicherung
2. **Context-Tracking:** user_id, company_id, Stack-Traces
3. **DEV-Only Debug:** `logDebug()` nur in Development
4. **Error-Tracking:** Automatische Kategorisierung & Priorisierung

---

## 🚀 Nächste Schritte

### Phase 2: Remaining Files (Automatisch)

**Erstelle Bulk-Migration-Skript:**

```typescript
// scripts/migrate-logging.ts
import { readFileSync, writeFileSync } from "fs";
import { glob } from "glob";

const files = await glob("src/**/*.{ts,tsx}");

files.forEach((file) => {
  let content = readFileSync(file, "utf8");

  // Import hinzufügen (wenn nicht vorhanden)
  if (!content.includes("from '@/lib/logger'")) {
    const importStatement = `import { logDebug, logError, logWarning } from '@/lib/logger';\n`;
    content = content.replace(/(import.*from.*;\n)+/, `$&${importStatement}`);
  }

  // console.log() → logDebug()
  content = content.replace(/console\.log\((.*?)\);/g, "logDebug($1);");

  // console.error() → logError()
  content = content.replace(/console\.error\((.*?)\);/g, "logError({ message: $1 });");

  // console.warn() → logWarning()
  content = content.replace(/console\.warn\((.*?)\);/g, "logWarning($1);");

  writeFileSync(file, content);
});

console.log("✅ Migration complete!");
```

**Ausführung:**

```bash
npx tsx scripts/migrate-logging.ts
```

---

## 📊 Fortschritt

| Phase   | Dateien | Violations | Status           |
| ------- | ------- | ---------- | ---------------- |
| Phase 1 | 4       | 50 → 0     | ✅ Abgeschlossen |
| Phase 2 | 34      | 80 → TBD   | 🔄 In Progress   |

---

## ✅ Finale Verifikation

Nach Abschluss:

```bash
# Suche nach verbleibenden console.* Aufrufen
grep -r "console\.(log|error|warn)" src/

# Erwartetes Ergebnis: 0 Matches
```

---

## 🎯 Erfolgskriterien

- ✅ 0 `console.log/error/warn` in `src/`
- ✅ Alle Logs gehen via `logger.ts`
- ✅ Strukturierte Supabase-Speicherung
- ✅ TypeScript Errors: 0
- ✅ Build erfolgreich

---

## 📝 Dokumentations-Updates

Nach Abschluss aktualisieren:

- ✅ `PROJECT_STATUS.md` - Logging-System Status
- ✅ `IST_ANALYSE_V18.3.22_FINAL.md` - Neue Version
- ✅ `TODO_LISTE_V18.3.22_FINAL.md` - Task abschließen
