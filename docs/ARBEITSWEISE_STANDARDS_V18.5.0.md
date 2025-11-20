# ARBEITSWEISE-STANDARDS V18.5.0

> **Version:** 18.5.0  
> **Status:** ✅ APPROVED  
> **Zweck:** Professionelle Entwicklungs-Workflows für MyDispatch

---

## 🎯 KERNPRINZIPIEN

### **1. VERSTEHEN BEVOR HANDELN**

> "Niemals Code schreiben, bevor das Problem vollständig verstanden ist."

**Pflicht-Schritte vor jeder Aufgabe:**

1. **Anforderung analysieren** - Was will der User wirklich?
2. **IST-Zustand erfassen** - Aktuellen Code LIVE prüfen (nicht nur Docs)
3. **Dependencies ermitteln** - Welche Dateien/APIs/Systeme sind betroffen?
4. **Edge-Cases identifizieren** - Was kann schiefgehen?
5. **Best-Practice recherchieren** - Gibt es bewährte Lösungen?

### **2. VOLLSTÄNDIGKEIT VOR GESCHWINDIGKEIT**

> "Lieber 1 Stunde planen als 5 Stunden debuggen."

**Qualitäts-Gates:**

- ✅ Alle Fehler gefunden (nicht nur der erste!)
- ✅ Fehlerursachen analysiert (nicht nur Symptome)
- ✅ Abhängigkeiten geprüft (Datenbankschema, APIs, UI)
- ✅ Tests geschrieben (Unit + Integration)
- ✅ Dokumentation aktualisiert

### **3. EHRLICHKEIT ÜBER OPTIMISMUS**

> "Ein offengelegter Fehler ist besser als ein versteckter."

**Transparenz-Pflicht:**

- ❌ **NIEMALS** Fehler verschweigen oder beschönigen
- ✅ **IMMER** ehrlichen IST-Zustand kommunizieren
- ✅ **IMMER** Probleme mit Lösungsvorschlägen melden
- ✅ **IMMER** Unsicherheiten ansprechen

---

## 🔄 STANDARD-WORKFLOW (PFLICHT)

### **Phase 1: TASK RECEIPT (Aufgabe erhalten)**

#### **Schritt 1.1: Verstehen**

```markdown
**Fragen vor Code-Beginn:**

1. Was ist das gewünschte Endergebnis?
2. Welche User-Story steckt dahinter?
3. Gibt es ein konkretes Problem oder Feature-Request?
4. Welche Akzeptanzkriterien gelten?
```

#### **Schritt 1.2: Kontextaufbau**

```typescript
// ✅ Immer diese Dateien prüfen:
1. Dokumentation lesen (docs/*.md)
2. IST-Code prüfen (nicht nur Docs glauben!)
3. Datenbank-Schema checken (src/integrations/supabase/types.ts)
4. API-Endpoints prüfen (supabase/functions/*)
5. UI-Komponenten analysieren (src/components/*)
```

#### **Schritt 1.3: Rückfragen stellen**

```markdown
**Bei Unklarheiten (IMMER fragen!):**

- "Verstehe ich richtig, dass...?"
- "Soll Feature X auch für Tarif Y verfügbar sein?"
- "Gibt es Design-Vorgaben dafür?"
- "Ist das Breaking Change oder Feature-Add?"
```

---

### **Phase 2: ANALYSIS (Analyse)**

#### **Schritt 2.1: IST-Zustand erfassen**

```bash
# ✅ Live-Code prüfen (nicht nur Docs!)
npm run type-check           # TypeScript-Fehler?
npm run build                # Build erfolgreich?
grep -r "FEATURE_NAME" src/  # Existiert schon Code dazu?
```

#### **Schritt 2.2: Dependencies-Map erstellen**

```markdown
**Betroffene Bereiche identifizieren:**

- [ ] Frontend (welche Komponenten?)
- [ ] Backend (welche Edge Functions?)
- [ ] Datenbank (neue Tabellen/Spalten?)
- [ ] APIs (externe Dienste?)
- [ ] Design-System (neue UI-Elemente?)
- [ ] Dokumentation (neue Docs?)
```

#### **Schritt 2.3: Fehler-Inventur**

```markdown
**Alle Fehler sammeln (nicht nur ersten!):**

1. TypeScript-Errors in Console
2. Linter-Warnings
3. Broken Links in Docs
4. Fehlende Imports
5. Veraltete Dependencies

**Pro Fehler erfassen:**

- Fehlertyp (Syntax/Logic/Design)
- Fehlerursache (Root-Cause)
- Betroffene Dateien
- Lösungsansatz
```

---

### **Phase 3: PLANNING (Planung)**

#### **Schritt 3.1: Lösungsdesign**

```markdown
**Architektur-Entscheidungen dokumentieren:**

**Option A: [Lösungsansatz 1]**

- ✅ Vorteile: [...]
- ❌ Nachteile: [...]
- ⚠️ Risiken: [...]

**Option B: [Lösungsansatz 2]**

- ✅ Vorteile: [...]
- ❌ Nachteile: [...]
- ⚠️ Risiken: [...]

**Empfehlung:** Option [A/B], weil [Begründung]
```

#### **Schritt 3.2: Implementation-Plan**

```markdown
**Umsetzungs-Reihenfolge:**

1. Datenbank-Migration (falls nötig)
2. Backend-Logik (Edge Functions)
3. Frontend-Komponenten
4. Testing
5. Dokumentation
6. Deployment

**Pro Schritt:**

- Geschätzter Aufwand
- Risiken
- Rollback-Plan
```

#### **Schritt 3.3: Testing-Strategie**

```typescript
// ✅ Immer Unit-Tests schreiben
describe("FeatureName", () => {
  it("should handle happy path", () => {});
  it("should handle edge case A", () => {});
  it("should handle errors gracefully", () => {});
});

// ✅ Integration-Tests für API-Calls
describe("API Integration", () => {
  it("should call Stripe API correctly", () => {});
  it("should handle API errors", () => {});
});

// ✅ E2E-Tests für kritische Flows
test("User can complete booking", async ({ page }) => {
  await page.goto("/auftraege");
  await page.click("text=Neue Buchung");
  // ...
});
```

---

### **Phase 4: IMPLEMENTATION (Umsetzung)**

#### **Schritt 4.1: Code schreiben**

```typescript
// ✅ Immer mit JSDoc dokumentieren
/**
 * Berechnet den Preis für Multi-Stop-Routing
 * @param stops - Array von Zwischenstopps
 * @param basePrice - Grundpreis
 * @returns Gesamtpreis inkl. Aufschläge
 */
export function calculateMultiStopPrice(stops: Stop[], basePrice: number): number {
  // Implementation...
}

// ✅ Immer Error-Handling
try {
  const result = await fetchData();
} catch (error) {
  logger.error("[FunctionName] Fehler", error as Error);
  throw new Error("User-friendly message");
}

// ✅ Immer Logging
logger.info("[FunctionName] Started", { userId, bookingId });
logger.debug("[FunctionName] Intermediate result", { data });
logger.error("[FunctionName] Failed", error as Error);
```

#### **Schritt 4.2: Code-Review (Self-Check)**

```markdown
**Vor Commit prüfen:**

- [ ] TypeScript-Errors behoben?
- [ ] Design-System verwendet (keine direkten Farben)?
- [ ] Error-Boundaries implementiert?
- [ ] Loading-States hinzugefügt?
- [ ] Mobile-responsive?
- [ ] Accessibility (ARIA-Labels)?
- [ ] Tests geschrieben?
- [ ] Dokumentation aktualisiert?
```

#### **Schritt 4.3: Testing**

```bash
# ✅ Lokale Tests ausführen
npm run test:unit           # Unit-Tests
npm run test:integration    # Integration-Tests
npm run test:e2e:compliance # E2E-Tests

# ✅ Build-Check
npm run build
npm run preview             # Production-Build testen

# ✅ Lighthouse-Audit
npm run lighthouse
```

---

### **Phase 5: VERIFICATION (Verifikation)**

#### **Schritt 5.1: Live-Test**

```markdown
**Manueller Test-Flow:**

1. Feature im Dev-Environment testen
2. Happy-Path durchgehen
3. Edge-Cases testen (fehlerhafte Inputs)
4. Error-States prüfen (Netzwerk-Fehler simulieren)
5. Mobile-Device testen (iPhone/Android)
6. Browser-Kompatibilität (Chrome/Safari/Firefox)
```

#### **Schritt 5.2: Dokumentation aktualisieren**

```markdown
**Pflicht-Updates:**

- [ ] Feature-Dokumentation geschrieben
- [ ] API-Dokumentation aktualisiert
- [ ] CHANGELOG.md erweitert
- [ ] README.md angepasst (falls nötig)
- [ ] Tarif-Definitionen aktualisiert
```

#### **Schritt 5.3: Deployment-Checklist**

```markdown
**Pre-Deployment:**

- [ ] TypeScript: 0 Errors
- [ ] Design-System: 0 Violations
- [ ] Security-Scan: 0 CRITICAL
- [ ] Lighthouse: Score >90
- [ ] Mobile-Test: OK
- [ ] Staging-Deployment: Erfolgreich
- [ ] Smoke-Tests: Bestanden

**Post-Deployment:**

- [ ] Production-Monitoring aktiv
- [ ] Error-Rate <0.05%
- [ ] User-Feedback gesammelt
```

---

## 🚨 FEHLER-BEHANDLUNG (KRITISCH)

### **Regel 1: Alle Fehler finden**

```markdown
❌ **FALSCH:**
"Ich habe den TypeScript-Error behoben."
(aber 5 weitere Errors übersehen)

✅ **RICHTIG:**
"Ich habe alle 6 TypeScript-Errors behoben:

1. Missing import in booking-form.tsx
2. Type mismatch in driver-utils.ts
3. Unused variable in dashboard.tsx
4. [...weitere 3 Fehler]"
```

### **Regel 2: Root-Cause analysieren**

```markdown
❌ **FALSCH:**
"Das Layout ist kaputt."

✅ **RICHTIG:**
"Das Layout ist kaputt, weil:

1. MainLayout.tsx verwendet feste Breite (1200px)
2. Bei <1200px wird Content abgeschnitten
3. Root-Cause: Fehlende responsive Breakpoints
4. Lösung: tailwind.config.ts erweitern"
```

### **Regel 3: Ehrlich kommunizieren**

```markdown
❌ **FALSCH:**
"Feature ist fertig." (aber 3 Bugs bekannt)

✅ **RICHTIG:**
"Feature ist funktional fertig, aber:

- ⚠️ Edge-Case: Bei 0€ Preis crashes UI
- ⚠️ Mobile: Button zu klein (<44px)
- ⚠️ Loading-State fehlt bei API-Call
  Empfehlung: Fixes vor Production-Release"
```

---

## 📚 WISSENSAUFBAU (OBLIGATORISCH)

### **Vor jeder Aufgabe:**

```markdown
**Benötigtes Wissen laden:**

1. **Technisch:** Wie funktioniert Feature X?
   - Offizielle Docs lesen (React/Supabase/Stripe)
   - Best Practices recherchieren
   - Code-Beispiele sammeln

2. **Business:** Warum brauchen wir Feature X?
   - User-Story verstehen
   - Use-Cases kennen
   - Erfolgs-Metriken definieren

3. **Context:** Was gibt es schon?
   - Bestehenden Code analysieren
   - Abhängigkeiten verstehen
   - Design-Patterns erkennen

4. **Dependencies:** Was hängt davon ab?
   - Welche Komponenten nutzen es?
   - Welche APIs werden gebraucht?
   - Welche Datenbank-Tabellen betroffen?
```

### **Brain-Check vor Code:**

```markdown
**Selbst-Fragen:**

- [ ] Verstehe ich das Problem wirklich?
- [ ] Habe ich alle Dependencies identifiziert?
- [ ] Kenne ich Best Practices dafür?
- [ ] Gibt es ähnlichen Code im Projekt?
- [ ] Welche Fehler könnten auftreten?

**Falls NEIN bei einer Frage:**
→ Mehr recherchieren
→ Rückfragen stellen
→ Code-Review anfordern
```

---

## 🎓 BEST PRACTICES (PFLICHT)

### **1. Code-Qualität**

```typescript
// ✅ Immer Type-Safe
type BookingStatus = 'pending' | 'confirmed' | 'cancelled';
// ❌ Nie: status: string

// ✅ Immer Zod-Validation
const bookingSchema = z.object({
  pickupAddress: z.string().min(5),
  dropoffAddress: z.string().min(5),
});
// ❌ Nie: unvalidierter Input

// ✅ Immer Error-Boundaries
<ErrorBoundary fallback={<ErrorPage />}>
  <BookingForm />
</ErrorBoundary>

// ✅ Immer Loading-States
{isLoading && <Spinner />}
{error && <ErrorToast />}
{data && <BookingList data={data} />}
```

### **2. Design-System**

```tsx
// ✅ Semantic Tokens verwenden
<Button className="bg-primary text-primary-foreground">

// ❌ Nie direkte Farben
<Button className="bg-blue-500 text-white">

// ✅ Design-System-Tokens
import { spacing, iconSizes } from '@/lib/design-system';
<div className={spacing.lg}>

// ✅ Responsive Typography
<h1 className="text-h1"> // automatisch responsive
```

### **3. Performance**

```typescript
// ✅ React Query Caching
const { data } = useQuery({
  queryKey: ["bookings", companyId],
  queryFn: fetchBookings,
  staleTime: 5 * 60 * 1000, // 5 Minuten
});

// ✅ Lazy Loading
const BookingDetails = lazy(() => import("./BookingDetails"));

// ✅ useMemo für teure Berechnungen
const totalRevenue = useMemo(() => bookings.reduce((sum, b) => sum + b.price, 0), [bookings]);
```

---

## ✅ ERFOLGS-METRIKEN

### **Pro Aufgabe messen:**

- **Zeit:** Geplant vs. Tatsächlich
- **Fehler:** Anzahl Bugs nach Release
- **Qualität:** Code-Review-Score (0-10)
- **Tests:** Coverage >80%
- **Docs:** Vollständigkeit >95%

### **Team-Ziele:**

- **Velocity:** Features/Sprint
- **Bug-Rate:** <5% pro Release
- **Tech-Debt:** <10% der Entwicklungszeit
- **User-Satisfaction:** >4.5/5 Sterne

---

## 🎯 ZUSAMMENFASSUNG

### **Der perfekte Workflow:**

```
1. Verstehen (Was ist das Ziel?)
2. Analysieren (IST-Zustand ehrlich erfassen)
3. Planen (Lösungsdesign + Tests)
4. Umsetzen (Code + Docs gleichzeitig)
5. Verifizieren (Alle Tests + Live-Check)
6. Deployen (Quality Gates bestehen)
7. Monitoren (Fehler-Rate + User-Feedback)
```

### **Die 3 Gebote:**

1. **Verstehen vor Handeln**
2. **Vollständigkeit vor Geschwindigkeit**
3. **Ehrlichkeit über Optimismus**

---

**Version:** V18.5.0  
**Status:** ✅ APPROVED  
**Gilt für:** Alle Entwickler, AI-Assistenten, Code-Reviews
