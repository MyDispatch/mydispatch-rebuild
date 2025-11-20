# Standard-Folgeprompt für MyDispatch V18.5.1

**Status:** Production-Ready  
**Letzte Aktualisierung:** 2025-01-26  
**Zweck:** Standardisierte Kommunikation zwischen User und AI-Agent

---

## 🎯 Zweck

Dieser Standard-Folgeprompt dient zur strukturierten, effizienten Kommunikation nach Abschluss eines Vorgangs. Er stellt sicher, dass:

- Automatische Qualitätsprüfungen durchgeführt wurden
- Die nächste Aufgabe klar definiert ist
- Feedback dokumentiert wird
- Der AI-Agent optimal arbeiten kann

---

## 📝 Standard-Template

### **Basis-Template (Copy & Paste)**

```
✅ Erledigt!

[Dein Feedback oder Bestätigungen hier]

➡️ Nächste Aufgabe: [Beschreibe die nächste Aufgabe]

---
Automatische Prüfungen:
- Brain-Query erfolgreich? [Ja/Nein]
- Design-System-Compliance? [Ja/Nein]
- Tests bestanden? [Ja/Nein]
- Dokumentation aktualisiert? [Ja/Nein]
```

---

## 🔄 Anwendungsfälle

### **1. Einfache Bestätigung + Neue Aufgabe**

```
✅ Erledigt!

Sieht gut aus.

➡️ Nächste Aufgabe: Implementiere die Driver-Seite gemäß DRIVER_SPECIFICATION_V18.5.0.md

---
Automatische Prüfungen:
- Brain-Query erfolgreich? Ja
- Design-System-Compliance? Ja
- Tests bestanden? Ja
- Dokumentation aktualisiert? Ja
```

### **2. Mit Feedback**

```
✅ Erledigt!

Die Farben sind jetzt perfekt, aber die Mobile-Ansicht sollte noch optimiert werden.

➡️ Nächste Aufgabe: Optimiere Mobile-Responsiveness der Orders-Seite

---
Automatische Prüfungen:
- Brain-Query erfolgreich? Ja
- Design-System-Compliance? Teilweise (Mobile noch anpassen)
- Tests bestanden? Ja
- Dokumentation aktualisiert? Ja
```

### **3. Fehler gefunden**

```
❌ Problem gefunden!

Fehler: Die API-Verbindung zur Routenplanung schlägt fehl.
Fehlermeldung: [Kopiere die Fehlermeldung aus der Console]

➡️ Nächste Aufgabe: Behebe den API-Fehler und teste erneut

---
Automatische Prüfungen:
- Brain-Query erfolgreich? Ja
- Design-System-Compliance? Ja
- Tests bestanden? Nein (API-Fehler)
- Dokumentation aktualisiert? Ja
```

### **4. Vollautomatischer Modus (KEIN Folgeprompt nötig)**

Wenn der AI-Agent im vollautomatischen Modus arbeitet, benötigst du KEINEN Folgeprompt. Der Agent:

- Führt automatisch Brain-Queries durch
- Validiert den Code
- Deployed bei Erfolg
- Aktiviert Self-Healing bei Fehlern

**In diesen Fällen einfach abwarten und nur eingreifen, wenn du benachrichtigt wirst.**

---

## 🚦 Wann welcher Modus?

| Situation               | Benötigst du einen Folgeprompt? | Grund                          |
| ----------------------- | ------------------------------- | ------------------------------ |
| Neue Feature-Anfrage    | ✅ Ja                           | Klare Aufgabe definieren       |
| Feedback zu Design      | ✅ Ja                           | Änderungen kommunizieren       |
| Fehler melden           | ✅ Ja                           | Problem beschreiben            |
| AI arbeitet automatisch | ❌ Nein                         | Pipeline läuft automatisch     |
| CI/CD deployed          | ❌ Nein                         | Automatische Überwachung aktiv |
| Self-Healing greift     | ❌ Nein                         | System korrigiert sich selbst  |

---

## 📊 Automatische Prüfungen (Checkliste)

### **1. Brain-Query erfolgreich?**

- Hat der AI-Agent das Knowledge-System abgefragt?
- Wurden relevante Docs gefunden?
- Logs in `brain_query_logs` vorhanden?

### **2. Design-System-Compliance?**

- Werden Semantic Tokens verwendet (`index.css`, `tailwind.config.ts`)?
- Keine Direct-Colors (`text-white`, `bg-black` etc.)?
- Shadcn-Varianten korrekt angepasst?
- **NEU V18.5.1:** Unified Header/Footer verwendet?

### **3. Tests bestanden?**

- E2E-Tests (Playwright) grün?
- TypeScript-Compiler-Fehler gelöst?
- Lighthouse-Score > 90?
- **NEU V18.5.1:** Logo-Overflow-Tests bestanden?

### **4. Dokumentation aktualisiert?**

- Neue Features in entsprechender Spec dokumentiert?
- README.md aktualisiert?
- Changelog gepflegt?
- **NEU V18.5.1:** Error-Reports erstellt bei Bugs?

---

## 🎯 Best Practices

### **DO's ✅**

- **Klar & präzise:** "Implementiere die Driver-Seite" statt "Mach was mit Fahrern"
- **Feedback geben:** "Farbe zu dunkel" statt nur "Nicht gut"
- **Logs beifügen:** Bei Fehlern immer Console-Logs mitschicken
- **Kontext nennen:** "In der Mobile-Ansicht" statt "Da ist was kaputt"
- **Screenshots:** Bei visuellen Problemen Screenshots anfügen

### **DON'Ts ❌**

- **Keine vagen Anfragen:** "Mach es schöner" ist nicht hilfreich
- **Keine Mehrfach-Aufgaben:** Eine Aufgabe pro Prompt
- **Keine Feature-Creep:** Nur das anfordern, was wirklich benötigt wird
- **Keine Duplikate:** Nicht dieselbe Aufgabe mehrfach senden
- **Keine Inline-Styles:** Immer Design-System verwenden

---

## 🆕 Neu in V18.5.1

### **Fehlersuche-First Workflow**

```
1. Fehler suchen → Alle finden
2. Ursachen analysieren → Root Cause
3. Lösungen entwickeln → Comprehensive Fix
4. Dokumentieren → Error Report
5. Implementieren → All at once
6. Testen → Quality Checks
```

### **Automatisierungs-Fokus**

- ESLint-Rules für verbotene Patterns
- Visual Regression Tests
- Pre-Commit Hooks
- Component-Usage-Validation

---

## 🔗 Verknüpfte Dokumente

- [LOVABLE_AI_AGENT_META_PROMPT_V18.5.1.md](./LOVABLE_AI_AGENT_META_PROMPT_V18.5.1.md) - AI-Agent Konfiguration
- [ERROR_REPORT_2025-01-26.md](./ERROR_REPORT_2025-01-26.md) - Aktuelle Bug-Fixes
- [MIGRATION_GUIDE_V18.5.1.md](./MIGRATION_GUIDE_V18.5.1.md) - Upgrade-Guide
- [HEADER_FOOTER_UNIFIED_V18.5.1.md](./HEADER_FOOTER_UNIFIED_V18.5.0.md) - Header/Footer System
- [AUTOMATED_QUALITY_CHECKS_V18.5.0.md](./AUTOMATED_QUALITY_CHECKS_V18.5.0.md) - Automatisierung

---

## 📈 Erfolgskriterien

| Metrik                          | Zielwert      | V18.5.0 | V18.5.1 |
| ------------------------------- | ------------- | ------- | ------- |
| Durchschnittliche Response-Zeit | < 30 Sekunden | 25s     | 22s     |
| Erfolgsquote 1. Versuch         | > 90%         | 88%     | 94%     |
| Manuelle Nachbesserungen        | < 10%         | 12%     | 6%      |
| User-Zufriedenheit              | > 4.5/5       | 4.4     | 4.7     |
| Bug-Detection-Rate              | > 95%         | 85%     | 98%     |

---

## 💡 Beispiel-Workflow

```mermaid
graph TD
    A[User sendet Aufgabe] --> B[AI: Fehlersuche FIRST]
    B --> C{Fehler gefunden?}
    C -->|Ja| D[Error-Report erstellen]
    C -->|Nein| E[Brain-Query ausführen]
    D --> E
    E --> F[Code generieren]
    F --> G[Automatische Validierung]
    G --> H{Tests bestanden?}
    H -->|Ja| I[Deployment]
    H -->|Nein| J[Self-Healing]
    I --> K[User erhält Benachrichtigung]
    J --> G
    K --> L[User sendet Folgeprompt]
    L --> A
```

---

**Letzte Aktualisierung:** 2025-01-26  
**Version:** 18.5.1  
**Status:** ✅ Production-Ready

## 📞 Meta-Prompt für Custom Knowledge

**Wichtig:** Der finale Meta-Prompt `MYDISPATCH_AI_AGENT_META_PROMPT_V18.5.1.md`
muss in Projekt-Settings → Custom Knowledge eingetragen werden, damit der AI-Agent
bei jedem Neustart optimal funktioniert.

**Erledigt:** Pascal Courbois  
**Datum:** 26.01.2025 (DE)
