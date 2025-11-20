# TODO-LISTE V18.3.22 - LOGGING-MIGRATION

**Datum:** 19.10.2025  
**Status:** 🔄 IN PROGRESS (60% Complete)

---

## 🔄 AKTUELLE AUFGABE

### Sprint 44: Logging-Migration

**Ziel:** Alle 130 `console.*` Aufrufe zu `logger.ts` migrieren

---

## ✅ PHASE 1 ABGESCHLOSSEN (4 Dateien)

1. ✅ ChatWindow.tsx (16 Violations → 0)
2. ✅ ConversationList.tsx (31 Violations → 3)
3. ✅ ParticipantSelector.tsx (3 Violations → 0)
4. ✅ HEREMapComponent.tsx (15 Violations → 0)

**Gesamt:** 65 → 3 Violations (-95%)

---

## 🔄 PHASE 2: VERBLEIBENDE 34 DATEIEN

### Priorität 1 (Maps & Location)

- [ ] `LiveMapHERE.tsx`
- [ ] `LiveMap.tsx`
- [ ] `LiveMapGoogle.tsx`
- [ ] `AddressInput.tsx`

### Priorität 2 (Hooks)

- [ ] `use-auth.tsx`
- [ ] `use-company.tsx`
- [ ] `use-bookings.tsx`
- [ ] `use-drivers.tsx`
- [ ] `use-vehicles.tsx`
- [ ] Weitere Hooks...

### Priorität 3 (Pages)

- [ ] Diverse Page-Komponenten

---

## 🎯 NÄCHSTE SCHRITTE

1. **Automatisches Bulk-Replace:**

   ```bash
   # Search-Replace in allen verbleibenden Dateien
   find src/ -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/console\.log/logDebug/g'
   ```

2. **Import-Statements hinzufügen:**

   ```typescript
   import { logDebug, logError, logWarning } from "@/lib/logger";
   ```

3. **Manuelle Korrekturen:**
   - ConversationList.tsx (3 verbleibende)
   - Komplexe Console-Aufrufe mit Variablen

4. **Verifikation:**
   ```bash
   grep -r "console\.(log|error|warn)" src/
   # Erwartetes Ergebnis: 0 Matches
   ```

---

## 📊 FORTSCHRITT

| Kategorie  | Violations | Behoben | Verbleibend |
| ---------- | ---------- | ------- | ----------- |
| Chat       | 50         | 47      | 3           |
| Dashboard  | 15         | 15      | 0           |
| Maps       | ~20        | 0       | ~20         |
| Hooks      | ~25        | 0       | ~25         |
| Pages      | ~20        | 0       | ~20         |
| **GESAMT** | **130**    | **62**  | **68**      |

**Fortschritt:** 47.7% ✅

---

## ✅ ERFOLGSKRITERIEN

- [ ] 0 `console.*` Violations in `src/`
- [ ] Alle Logs via `logger.ts`
- [ ] TypeScript Errors: 0
- [ ] Build erfolgreich
- [ ] Tests erfolgreich

---

## 📝 NACH ABSCHLUSS

- [ ] `SPRINT_44_LOGGING_MIGRATION.md` finalisieren
- [ ] `IST_ANALYSE_V18.3.22_FINAL.md` finalisieren
- [ ] `PROJECT_STATUS.md` aktualisieren
- [ ] Go-Live Freigabe

**ETA:** 19.10.2025, 20:00 Uhr
