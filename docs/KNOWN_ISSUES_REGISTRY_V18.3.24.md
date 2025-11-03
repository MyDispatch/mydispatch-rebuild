# 🐛 KNOWN ISSUES REGISTRY V18.3.24
**Zentrale Fehler-Datenbank - Fehler niemals wiederholen!**

Datum: 18.01.2025  
Version: V18.3.24  
Status: 🔴 AKTIV - Bei JEDEM Arbeitsschritt konsultieren!

---

## 🎯 ZWECK

Diese Datei ist die **zentrale Fehler-Datenbank** für alle bereits gemachten Fehler im MyDispatch-Projekt. Sie dient dazu:

1. **Fehler nur einmal zu machen** - Nicht denselben Fehler wiederholen
2. **Aus Fehlern lernen** - Muster erkennen und vermeiden
3. **Systematische Prävention** - Anti-Patterns dokumentieren
4. **Quality Assurance** - Automatische Checks ableiten

**🔴 META-VORGABE:** Diese Datei MUSS bei JEDEM Arbeitsschritt konsultiert werden, bevor Code geschrieben wird!

---

## 📋 FEHLER-KATEGORIEN

### Kategorie A: Design-Violations
### Kategorie B: Component-Fehler
### Kategorie C: State-Management-Fehler
### Kategorie D: Security-Violations
### Kategorie E: Performance-Issues
### Kategorie F: Accessibility-Violations
### Kategorie G: Branding-Violations

---

## 🔴 KATEGORIE A: DESIGN-VIOLATIONS

### A.1 accent-Farbe verwendet (KRITISCH)

**Fehler:**
```tsx
// ❌ FALSCH:
<Button className="bg-accent hover:bg-accent/90" />
<Icon className="text-accent" />
<div className="border-accent" />
```

**Korrekt:**
```tsx
// ✅ RICHTIG:
<Button className="bg-primary hover:bg-primary/90" />
<Icon className="text-foreground" />
<div className="border-primary" />
```

**Grund:** accent-Farbe wurde in V18.3.24 systemweit entfernt  
**Dokument:** MASTER_VORGABEN_CHECKLISTE_V18.3.24.md  
**Datum:** 18.01.2025  
**Status:** ❌ VERBOTEN

---

### A.2 Ampelfarben auf Icons

**Fehler:**
```tsx
// ❌ FALSCH:
<CheckIcon className="text-status-success" />
<AlertIcon className="text-status-error" />
<WarningIcon className="text-status-warning" />
```

**Korrekt:**
```tsx
// ✅ RICHTIG:
<CheckIcon className="text-foreground" />
<AlertIcon className="text-foreground" />
<WarningIcon className="text-foreground" />

// Ampelfarben nur hier:
<Badge variant="success">Aktiv</Badge>
<StatusIndicator status="error" />
<Alert variant="destructive">...</Alert>
```

**Grund:** Icons verwenden IMMER text-foreground (CI-Konformität)  
**Dokument:** ICON_GUIDELINES.md  
**Datum:** 16.01.2025  
**Status:** ❌ VERBOTEN

---

### A.3 Layout-Höhen geändert

**Fehler:**
```tsx
// ❌ FALSCH:
<Header className="h-20" />  // statt h-16
<Sidebar className="w-72" /> // statt w-16/w-60
<Footer className="py-4" />  // statt py-2
```

**Korrekt:**
```tsx
// ✅ RICHTIG (NIEMALS ändern):
<Header className="h-16" />  // 60px fixiert
<Sidebar className="w-16 lg:w-60" /> // 64px/240px fixiert
<Footer className="py-2" />  // 8px fixiert
```

**Grund:** Layout-Freeze - Geschützte Komponenten  
**Dokument:** MASTER_VORGABEN_CHECKLISTE_V18.3.24.md  
**Datum:** 16.01.2025  
**Status:** 🔒 GESCHÜTZT

---

### A.4 Direkte Hex-Farben verwendet

**Fehler:**
```tsx
// ❌ FALSCH:
<div style={{ backgroundColor: '#EADEBD' }} />
<p style={{ color: '#323D5E' }} />
```

**Korrekt:**
```tsx
// ✅ RICHTIG:
<div className="bg-primary" />
<p className="text-foreground" />

// Oder in CSS:
background: hsl(var(--primary));
color: hsl(var(--foreground));
```

**Grund:** Alle Farben als HSL CSS-Variablen für Theme-Konsistenz  
**Dokument:** QUALITY_GATES_V18.3.24.md  
**Datum:** 18.01.2025  
**Status:** ❌ VERBOTEN

---

### A.5 Badge mit Hover-Effekten (NEU!)

**Fehler:**
```tsx
// ❌ FALSCH:
<Badge className="hover:bg-primary/90 cursor-pointer" />
<Badge className="transition-transform hover:scale-105" />
```

**Korrekt:**
```tsx
// ✅ RICHTIG:
<Badge className="pointer-events-none" />  // Keine Interaktion
<Badge>Empfohlen</Badge>  // Standard ohne Hover
```

**Grund:** Badges sind informative Labels, keine interaktiven Elemente  
**Dokument:** Dieser Registry-Eintrag  
**Datum:** 18.01.2025  
**Status:** ❌ VERBOTEN

---

### A.6 Dialog-Footer außerhalb/falsche Farbe

**Fehler:**
```tsx
// ❌ FALSCH:
</DialogContent>
<div className="px-6 py-4 bg-muted/20">  // Außerhalb!
  <Button variant="outline">Schließen</Button>  // Weiß auf weiß!
</div>
```

**Korrekt:**
```tsx
// ✅ RICHTIG:
  <div className="px-6 py-4 border-t bg-background">  // Innerhalb + korrekte Farbe
    <Button variant="secondary">Schließen</Button>  // Sichtbar!
  </div>
</DialogContent>
```

**Grund:** Footer muss innerhalb DialogContent sein, mit sichtbarem Kontrast  
**Dokument:** Dieser Registry-Eintrag  
**Datum:** 18.01.2025  
**Status:** ❌ VERBOTEN

---

## 🔴 KATEGORIE B: COMPONENT-FEHLER

### B.1 Inline-Formatierung statt Utils

**Fehler:**
```tsx
// ❌ FALSCH:
const formatted = `${value.toFixed(2)} €`;
const date = new Date().toLocaleDateString('de-DE');
```

**Korrekt:**
```tsx
// ✅ RICHTIG:
import { formatCurrency, formatDate } from '@/lib/format-utils';

const formatted = formatCurrency(value);  // "1.234,56 €"
const date = formatDate(new Date());      // "18.01.2025"
```

**Grund:** Zentrale Formatierung (DIN 5008), keine Duplikation  
**Dokument:** INSTRUCTIONS_GUIDELINES_V18.3_FINAL.md  
**Datum:** 16.01.2025  
**Status:** ❌ VERBOTEN

---

### B.2 TypeScript any verwendet

**Fehler:**
```tsx
// ❌ FALSCH:
const handleSubmit = (data: any) => { ... }
const response: any = await fetch(...);
```

**Korrekt:**
```tsx
// ✅ RICHTIG:
interface FormData {
  name: string;
  email: string;
}
const handleSubmit = (data: FormData) => { ... }

interface ApiResponse {
  success: boolean;
  data: Booking[];
}
const response: ApiResponse = await fetch(...);
```

**Grund:** Type-Safety, Auto-Completion, Fehler-Prävention  
**Dokument:** INSTRUCTIONS_GUIDELINES_V18.3_FINAL.md  
**Datum:** 16.01.2025  
**Status:** ❌ VERBOTEN

---

### B.3 Fehlende Error-Boundaries

**Fehler:**
```tsx
// ❌ FALSCH:
try {
  await supabase.from('bookings').insert(data);
  // Kein Error-Handling!
} catch (error) {
  console.error(error);  // Nur Console-Log
}
```

**Korrekt:**
```tsx
// ✅ RICHTIG:
import { handleError, handleSuccess } from '@/lib/error-handlers';

try {
  await supabase.from('bookings').insert(data);
  handleSuccess('Auftrag erfolgreich erstellt');
} catch (error) {
  handleError(error, 'Fehler beim Erstellen des Auftrags');
}
```

**Grund:** Zentrale Error-Handling, User-Feedback (Toast)  
**Dokument:** INSTRUCTIONS_GUIDELINES_V18.3_FINAL.md  
**Datum:** 16.01.2025  
**Status:** ❌ VERBOTEN

---

### B.4 Keys fehlen bei Listen

**Fehler:**
```tsx
// ❌ FALSCH:
{items.map(item => (
  <div>{item.name}</div>  // Kein key!
))}
```

**Korrekt:**
```tsx
// ✅ RICHTIG:
{items.map(item => (
  <div key={item.id}>{item.name}</div>
))}
```

**Grund:** React-Performance, Vermeidung von Re-Renders  
**Dokument:** React Best Practices  
**Datum:** 16.01.2025  
**Status:** ❌ VERBOTEN

---

## 🔴 KATEGORIE C: STATE-MANAGEMENT-FEHLER

### C.1 useState in Loops

**Fehler:**
```tsx
// ❌ FALSCH:
items.forEach(item => {
  const [selected, setSelected] = useState(false);  // Kein Hook in Loop!
});
```

**Korrekt:**
```tsx
// ✅ RICHTIG:
const [selectedIds, setSelectedIds] = useState<string[]>([]);

const isSelected = (id: string) => selectedIds.includes(id);
```

**Grund:** React Hooks Rules - Keine Hooks in Loops/Conditions  
**Dokument:** React Docs  
**Datum:** 16.01.2025  
**Status:** ❌ VERBOTEN

---

### C.2 Direkte State-Mutation

**Fehler:**
```tsx
// ❌ FALSCH:
const [items, setItems] = useState([...]);
items.push(newItem);  // Direkte Mutation!
setItems(items);
```

**Korrekt:**
```tsx
// ✅ RICHTIG:
setItems(prev => [...prev, newItem]);
```

**Grund:** React State Immutability - Trigger Re-Render  
**Dokument:** React Best Practices  
**Datum:** 16.01.2025  
**Status:** ❌ VERBOTEN

---

## 🔴 KATEGORIE D: SECURITY-VIOLATIONS

### D.1 Fehlender company_id Filter

**Fehler:**
```tsx
// ❌ FALSCH (KRITISCH!):
const { data } = await supabase
  .from('bookings')
  .select('*');  // Kein company_id Filter!
```

**Korrekt:**
```tsx
// ✅ RICHTIG:
const { data } = await supabase
  .from('bookings')
  .select('*')
  .eq('company_id', profile.company_id)  // PFLICHT!
  .eq('archived', false);
```

**Grund:** Multi-Tenant Security - Data-Leakage verhindern  
**Dokument:** MASTER_VORGABEN_CHECKLISTE_V18.3.24.md  
**Datum:** 16.01.2025  
**Status:** 🔒 KRITISCH

---

### D.2 DELETE statt Archiving

**Fehler:**
```tsx
// ❌ FALSCH (KRITISCH!):
await supabase
  .from('bookings')
  .delete()
  .eq('id', bookingId);
```

**Korrekt:**
```tsx
// ✅ RICHTIG:
await supabase
  .from('bookings')
  .update({ 
    archived: true, 
    archived_at: new Date().toISOString() 
  })
  .eq('id', bookingId);
```

**Grund:** Soft-Delete - Daten-Recovery, Audit-Trail  
**Dokument:** MASTER_VORGABEN_CHECKLISTE_V18.3.24.md  
**Datum:** 16.01.2025  
**Status:** 🔒 KRITISCH

---

### D.3 SQL-Injection-Risiko

**Fehler:**
```tsx
// ❌ FALSCH:
const query = `SELECT * FROM bookings WHERE customer_name = '${userInput}'`;
```

**Korrekt:**
```tsx
// ✅ RICHTIG:
const { data } = await supabase
  .from('bookings')
  .select('*')
  .ilike('customer_name', `%${userInput}%`);  // Parametrisiert
```

**Grund:** SQL-Injection-Prevention  
**Dokument:** Security Best Practices  
**Datum:** 16.01.2025  
**Status:** 🔒 KRITISCH

---

## 🔴 KATEGORIE E: PERFORMANCE-ISSUES

### E.1 Fehlende Memoization

**Fehler:**
```tsx
// ❌ FALSCH:
const expensiveCalculation = () => {
  // Läuft bei jedem Render!
  return items.reduce(...);
};
```

**Korrekt:**
```tsx
// ✅ RICHTIG:
const expensiveCalculation = useMemo(() => {
  return items.reduce(...);
}, [items]);  // Nur wenn items ändern
```

**Grund:** Performance - Vermeidung unnötiger Berechnungen  
**Dokument:** React Performance  
**Datum:** 16.01.2025  
**Status:** ⚠️ EMPFOHLEN

---

### E.2 Fehlende Pagination

**Fehler:**
```tsx
// ❌ FALSCH:
const { data } = await supabase
  .from('bookings')
  .select('*');  // Alle Aufträge laden!
```

**Korrekt:**
```tsx
// ✅ RICHTIG:
const { data } = await supabase
  .from('bookings')
  .select('*')
  .range(0, 49);  // Nur 50 laden
```

**Grund:** Performance - Reduzierung Daten-Transfer  
**Dokument:** Supabase Best Practices  
**Datum:** 16.01.2025  
**Status:** ⚠️ EMPFOHLEN

---

## 🔴 KATEGORIE F: ACCESSIBILITY-VIOLATIONS

### F.1 Fehlende Alt-Texte

**Fehler:**
```tsx
// ❌ FALSCH:
<img src={logoUrl} />
```

**Korrekt:**
```tsx
// ✅ RICHTIG:
<img src={logoUrl} alt="MyDispatch Logo" />
```

**Grund:** Accessibility - Screen-Reader-Support  
**Dokument:** WCAG 2.1 Guidelines  
**Datum:** 16.01.2025  
**Status:** ❌ VERBOTEN

---

### F.2 Fehlende ARIA-Labels

**Fehler:**
```tsx
// ❌ FALSCH:
<button onClick={handleDelete}>
  <TrashIcon />  // Nur Icon, kein Text!
</button>
```

**Korrekt:**
```tsx
// ✅ RICHTIG:
<button 
  onClick={handleDelete}
  aria-label="Auftrag löschen"
>
  <TrashIcon />
</button>
```

**Grund:** Accessibility - Screen-Reader-Support  
**Dokument:** WCAG 2.1 Guidelines  
**Datum:** 16.01.2025  
**Status:** ❌ VERBOTEN

---

### F.3 Zu kleine Touch-Targets (Mobile)

**Fehler:**
```tsx
// ❌ FALSCH:
<button className="h-8 w-8" />  // 32px zu klein!
```

**Korrekt:**
```tsx
// ✅ RICHTIG:
<button className="min-h-[44px] min-w-[44px]" />  // 44px Standard
```

**Grund:** Mobile UX - Touch-Target-Größe (Apple HIG)  
**Dokument:** INSTRUCTIONS_GUIDELINES_V18.3_FINAL.md  
**Datum:** 16.01.2025  
**Status:** ❌ VERBOTEN

---

## 🔴 KATEGORIE G: BRANDING-VIOLATIONS

### G.1 "Lovable" erwähnt

**Fehler:**
```tsx
// ❌ FALSCH:
<p>Powered by Lovable</p>
<a href="https://lovable.dev">Lovable Docs</a>
```

**Korrekt:**
```tsx
// ✅ RICHTIG:
<p>Powered by MyDispatch</p>
<a href="/docs">MyDispatch Dokumentation</a>
```

**Grund:** Branding - Keine externen Marken  
**Dokument:** BRANDING_VORGABEN_V18.3.24_FINAL.md  
**Datum:** 17.01.2025  
**Status:** ❌ VERBOTEN

---

### G.2 "Supabase" öffentlich erwähnt

**Fehler:**
```tsx
// ❌ FALSCH (öffentliche Seite):
<p>Datenbank: Supabase</p>
<a href="https://supabase.com/dashboard">Dashboard öffnen</a>
```

**Korrekt:**
```tsx
// ✅ RICHTIG:
<p>Sichere Cloud-Infrastruktur</p>
<p>Gehostet auf Google Cloud Platform</p>
```

**Grund:** Branding - Keine technischen Details öffentlich  
**Dokument:** BRANDING_VORGABEN_V18.3.24_FINAL.md  
**Datum:** 17.01.2025  
**Status:** ❌ VERBOTEN

---

### G.3 Test-Account-Versprechen

**Fehler:**
```tsx
// ❌ FALSCH:
<Button>Jetzt kostenlos testen</Button>
<p>14 Tage Geld-zurück-Garantie</p>
```

**Korrekt:**
```tsx
// ✅ RICHTIG:
<Button>Jetzt starten</Button>
<p>Monatlich kündbar, keine Mindestlaufzeit</p>
```

**Grund:** MyDispatch bietet keine Test-Accounts  
**Dokument:** BRANDING_VORGABEN_V18.3.24_FINAL.md  
**Datum:** 17.01.2025  
**Status:** ❌ VERBOTEN

---

## 📊 FEHLER-STATISTIK

### Nach Kategorie

| Kategorie | Anzahl Fehler | Status |
|-----------|---------------|--------|
| A - Design | 6 | 🔴 Kritisch |
| B - Components | 4 | 🟡 Wichtig |
| C - State | 2 | 🟡 Wichtig |
| D - Security | 3 | 🔴 Kritisch |
| E - Performance | 2 | 🟢 Empfohlen |
| F - Accessibility | 3 | 🟡 Wichtig |
| G - Branding | 3 | 🔴 Kritisch |
| **GESAMT** | **23** | - |

### Nach Schweregrad

- 🔴 **Kritisch (12):** Sofort beheben, blockiert Commit
- 🟡 **Wichtig (9):** Priorität bei Refactoring
- 🟢 **Empfohlen (2):** Nice-to-have

---

## 🔍 AUTOMATISCHE PRÜFUNG

### Grep-Commands (aus QUALITY_GATES_V18.3.24.md)

```bash
# A.1 accent-Farbe
grep -r "text-accent\|bg-accent\|border-accent" src/

# A.2 Ampelfarben auf Icons
grep -r "className=.*text-status-.*Icon" src/

# D.1 company_id Filter
grep -r "from.*select" src/ | grep -v "company_id"

# D.2 DELETE-Operationen
grep -r "\.delete()" src/

# G.1/G.2 Branding
grep -r "Lovable\|Supabase" src/pages/

# G.3 Test-Accounts
grep -r "kostenlos testen\|free trial" src/
```

---

## 🔄 PFLEGE-PROZESS

### Wann neue Fehler hinzufügen?

1. **Bei jedem gemachten Fehler**
   - Fehler identifiziert? → Sofort hier dokumentieren
   - Root-Cause analysiert? → Pattern dokumentieren
   - Lösung gefunden? → Best Practice hinzufügen

2. **Bei Code-Reviews**
   - Anti-Pattern gefunden? → Registry erweitern
   - Häufiger Fehler? → Automatischen Check hinzufügen

3. **Bei Refactorings**
   - Alte Pattern entfernt? → Als Fehler dokumentieren
   - Neue Vorgabe etabliert? → Anti-Pattern definieren

### Format für neue Einträge

```markdown
### X.Y Fehler-Titel

**Fehler:**
```tsx
// ❌ FALSCH:
[Code-Beispiel]
```

**Korrekt:**
```tsx
// ✅ RICHTIG:
[Code-Beispiel]
```

**Grund:** [Erklärung warum falsch]
**Dokument:** [Referenz-Dokument]
**Datum:** [TT.MM.YYYY]
**Status:** ❌ VERBOTEN / ⚠️ EMPFOHLEN / 🟢 OPTIONAL
```

---

## 🎯 META-VORGABE: VERWENDUNG DIESER DATEI

### ✅ ZWINGEND BEI JEDEM ARBEITSSCHRITT:

**VOR dem Code schreiben:**
```
1. KNOWN_ISSUES_REGISTRY_V18.3.24.md öffnen
2. Relevante Kategorien durchlesen
3. Ähnliche Fehler identifizieren
4. Anti-Patterns vermeiden
```

**NACH dem Code schreiben:**
```
1. Code gegen Registry prüfen
2. Neue Fehler gefunden? → Hinzufügen!
3. Grep-Commands durchlaufen
4. Quality Gates bestanden? → Commit
```

**BEI Code-Reviews:**
```
1. Fehler im PR gefunden? → Registry checken
2. Bereits dokumentiert? → PR ablehnen mit Hinweis
3. Neues Anti-Pattern? → Registry erweitern
```

---

## 🔗 VERKNÜPFUNG MIT ANDEREN VORGABEN

### Haupt-Dokumente

1. **MASTER_VORGABEN_CHECKLISTE_V18.3.24.md**
   - Pre-/Post-Work Checklisten
   - Diese Fehler-Registry ist Teil der Quality Gates

2. **QUALITY_GATES_V18.3.24.md**
   - Automatische Prüfung mit Grep
   - Pre-Commit Hook nutzt diese Registry

3. **INSTRUCTIONS_GUIDELINES_V18.3_FINAL.md**
   - Coding Standards
   - Fehler hier stammen aus Guidelines

4. **BRANDING_VORGABEN_V18.3.24_FINAL.md**
   - Branding-Violations (Kategorie G)
   - Direkte Referenz

---

## 📝 ÄNDERUNGSHISTORIE

### V18.3.24 (18.01.2025) - INITIAL
- ✅ Registry erstellt (23 Fehler dokumentiert)
- ✅ 7 Kategorien definiert (A-G)
- ✅ Automatische Checks verknüpft
- ✅ Meta-Vorgabe etabliert
- ✅ Neue Fehler: Badge-Hover (A.5), Dialog-Footer (A.6)

### Zukünftige Updates
- [ ] Weitere Fehler aus Code-Reviews hinzufügen
- [ ] ESLint-Rules aus Registry generieren
- [ ] CI/CD-Integration erweitern
- [ ] Statistik-Dashboard erstellen

---

**🔴 DIESE REGISTRY MUSS BEI JEDEM ARBEITSSCHRITT KONSULTIERT WERDEN!**

**Version:** V18.3.24  
**Letzte Aktualisierung:** 18.01.2025  
**Status:** ✅ AKTIV  
**Änderungsvorbehalt:** info@my-dispatch.de
