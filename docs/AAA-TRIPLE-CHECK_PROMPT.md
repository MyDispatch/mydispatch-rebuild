🔴 TRIPLE-CHECK ENFORCEMENT LOOP:

PHASE 1: IMPLEMENTATION
→ Standard Implementation (Docs lesen, Code schreiben, aber noch KEIN Commit!)

PHASE 2: SELF-REVIEW ROUND 1 (TECHNICAL)
□ Import Validation: ALLE verwendeten Importe existieren laut filesExplorer.md!
□ Hallucination Check: Für JEDEN Funktionsaufruf/Methode Klasse explizit prüfen „existiert sie schon, ist sie richtig?“ Keine „phantom code/imagined functions“!
□ Type Safety: keine any, alle Types explizit und dokumentiert.
→ FEHLER gefunden? → SOFORT beheben, dann Doku (AVOIDABLE_ERRORS.md) pflegen und der Runde NEU beginnen (REPEAT ROUND 1!).

PHASE 3: SELF-REVIEW ROUND 2 (LOGICAL)
□ Pattern Compliance: Sind ALLE Regeln/Best Practices/Patterns aus LESSONS_LEARNED.md umgesetzt?
□ DRY-Prinzip: Keine Code-Duplikation, keine Copy-Paste-Altlast, alle Loops/Utils/Components optimal genutzt?
□ System-wide Impact: Gibt es Breaking Changes/System-Auswirkungen? Wenn ja, ist alles dokumentiert?
→ FEHLER gefunden? → SOFORT fixen, dokumentieren und die Runde neu starten (REPEAT ROUND 2!).

PHASE 4: SELF-REVIEW ROUND 3 (SECURITY & QUALITY)
□ Security Best Practices: KEINE Secrets im Code, Input-Validation überall, keine gefährlichen Defaults/Sandboxing-Lücken?
□ Test Coverage: Für ALLE Changes sinnvolle Unit-/Integrationstests geschrieben UND ausgeführt?
□ Performance: Keine unnötigen Re-Renders im UI, keine langsamen Queries/Algorithmen?
→ FEHLER gefunden? Fixen & dokumentieren (REPEAT ROUND 3!).

PHASE 5: ERROR DOCUMENTATION ENFORCEMENT
□ Sobald IRGENDEIN Fehler in einer Runde gefunden wurde:

AVOIDABLE_ERRORS.md und LESSONS_LEARNED.md für genau diesen Fehler sofort aktualisieren!

Lerneffekt explizit notieren („Wie verhindere ich das künftig?“)

Fehlerursache-Retrospektive IMMER direkt im Commit dokumentieren.

PHASE 6: DOKUMENTATIONS-CHECK
□ Nach Durchlauf aller Runden:

filesExplorer.md

COMPONENT_REGISTRY.md

CHANGELOG.md

LESSONS_LEARNED.md

PROJECT_MEMORY.md

ggf. weitere betroffene Docs aktualisieren

Erst wenn ALLE Phasen ohne Befund erfolgreich, committen erlaubt!
Andernfalls, Prozess ab Runde 1 NEU ausführen, bis kein Fehler mehr gefunden wird.