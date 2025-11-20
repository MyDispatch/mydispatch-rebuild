⚠️ PROTOKOLL-ENFORCEMENT MIT SELF-REVIEW LOOP – AAA STANDARD

---

## 📥 PRE-IMPLEMENTATION

1. **PROJECT_MEMORY.md** vollständig, konzentriert lesen – keine Steps, Patterns, Lessons übergehen.
2. **COMPONENT_REGISTRY.md** auf vorhandene/funktionale Duplikate und bereits existierende Patterns prüfen.
3. **filesExplorer.md** für File-Struktur, FOLDER, Dateinamen und Quell-Importe durchgehen.
4. **MANDATORY_READING_LIST.md** und alle relevanten Pflichtdokumente (Text, Prompt, Pattern, Lessons).
5. **Pre-Implementation Checklist** Schritt für Schritt abarbeiten und (schriftlich) abhaken.
6. **Projekt-Kontext kritisch prüfen**: Sind alle Requirements/Spezifikationen und Schnittstellen bekannt, geprüft, referenziert?
7. **Wenn mehrere im Team:** Alle oben genannten Schritte auch für andere Beteiligte verbindlich erklären und regelmäßig reviewen lassen.

---

## 🔨 IMPLEMENTATION

8. Konsequent mit Validation Guards, Type-Safety, vollständigen Tests und dokumentierter Annahmen beginnen.
9. Bestehende Patterns und Vorgaben aus ALLEN README-, COMPANION- und USAGE-GUIDE-Dokumenten übernehmen.
10. Alle relevanten Schema-/Types- und API-Definitionen vorher prüfen.
11. Großer Scope – immer vollständigen Block codieren, KEINE stückweisen oder "quickfix"-Änderungen, keine inkrementellen Dirty-Patches.

---

## 🔄 SELF-REVIEW LOOP (PFLICHT)

12. **Eigenen Code KRITISCH durchgehen, Checkliste:**
   □ Stimmen alle Importe exakt mit filesExplorer.md/Konvention?
   □ Sind ALLE genutzten Funktionen/Klassen garantiert existent – KEINE Halluzinationen, nichts "geraten"?
   □ Überall Type-Safety, keine any, keine zu lockeren Typen?
   □ Alle Guards/Validierungen und Fehlerfälle abgedeckt?
   □ Überall aktuelle Patterns und Learnings angewandt?
   □ Für alle Änderungen sinnvolle, vollständige Tests (Unit, e2e, a11y...)?
   □ Kein Copy-Paste von Altlasten/Legacy, keine Duplikate?
   □ Welche Lessons wurden beherzigt/beachtet, welche neu gelernt?

13. **WENN Fehler oder Inkonsistenzen gefunden:**
   → SOFORT korrigieren, Roots fixen.
   → In **AVOIDABLE_ERRORS.md** und **LESSONS_LEARNED.md** präzise eintragen (WAS/Warum/Future Policy).
   → Lessons Learned und learnings-lastige Commits/Reviews explizit referenzieren.
   → Review erneut ab Start der Loop oder nächste Review-Aufgabe zuweisen.

---

## 📝 POST-IMPLEMENTATION & REVIEW

14. **SOFORT nach Abschluss:**
   - Dokumentation für **filesExplorer**, **COMPONENT_REGISTRY**, **CHANGELOG**, **PROJECT_MEMORY** und relevante weitere Knowledge Files UPDATEN und referenzieren.
   - PR/Review ausschließlich nach sichtbarem Prüf-Kommentar in den Dokumentationsfiles zulassen!
   - Dokumentations-Update explizit im Merge/Commit kommentieren.
   - Finale Bestätigung (schriftlich, in Review oder Commit):  
     "✅ Self-Review passed – keine Fehler gefunden/alle Learnings dokumentiert"

---

KEINE ABKÜRZUNGEN – JEDER SCHRITT IST PFLICHT UND MUSS BELEGT, DOKUMENTIERT UND REVIEWED WERDEN!