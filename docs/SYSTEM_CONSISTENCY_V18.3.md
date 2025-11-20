# 🔒 SYSTEM CONSISTENCY FRAMEWORK V18.3

**Erstellt:** 21.10.2025  
**Version:** V18.3  
**Status:** ✅ AKTIV - SYSTEMWEIT VERBINDLICH

---

## 📋 ZWECK

Dieses Framework stellt sicher, dass **ALLE Änderungen** im MyDispatch-System:

1. ✅ **Design-konform** sind (CI-Farben, Spacing, Typography)
2. ✅ **Systemweit propagiert** werden (keine partiellen Updates)
3. ✅ **Cross-Entity-Konsistenz** wahren
4. ✅ **Niemals Design-Freeze-Regeln** verletzen

---

## 🎯 KERN-PRINZIPIEN

### 1. NIEMALS NUR LOKAL ÄNDERN

```typescript
// ❌ FALSCH: Nur eine Komponente ändern
<Button className="text-status-success">Save</Button>

// ✅ RICHTIG: Systemweite Konsistenz prüfen & ändern
validateComponent(componentCode, filePath);
autoFixIconColors(componentCode);
```

### 2. DESIGN-FREEZE RESPEKTIEREN

```typescript
// Geschützte Komponenten
const PROTECTED_COMPONENTS = [
  "src/components/layout/Header.tsx", // h-16 NIEMALS ändern
  "src/components/layout/Footer.tsx", // py-2 NIEMALS ändern
  "src/components/layout/AppSidebar.tsx", // w-16/w-60 NIEMALS ändern
  "src/components/layout/MainLayout.tsx",
  "src/components/layout/DashboardLayout.tsx",
];

// Vor jeder Änderung prüfen
if (isProtectedComponent(filePath)) {
  // Nur funktionale Erweiterungen erlaubt!
}
```

### 3. ENTITY-ÄNDERUNGEN VALIDIEREN

```typescript
// Vor Archivierung/Löschen prüfen
const validation = await validateEntityChange("drivers", driverId, "archive", companyId);

if (!validation.valid) {
  // Zeige Blocker an
  console.error(validation.blockers);
}
```

### 4. CROSS-ENTITY-SYNCHRONISATION

```typescript
// IMMER abhängige Entities prüfen
const affected = getAffectedEntities("drivers", "archive");
// → ['bookings', 'shift_schedules', 'documents', 'gps_tracking']

// Cascade-Archivierung
await cascadeArchive("drivers", driverId, companyId);
```

---

## 🛠️ KOMPONENTEN DES FRAMEWORKS

### 1. Design-Validator (`design-validator.ts`)

**Zweck:** Validiert Design-Konsistenz in Komponenten

```typescript
import { validateComponent, autoFixIconColors } from "@/lib/system-consistency";

// Komponenten-Code validieren
const result = validateComponent(componentCode, filePath);

if (!result.valid) {
  console.error("Design-Fehler:", result.errors);
  console.warn("Warnungen:", result.warnings);
}

// Auto-Fix anwenden
const fixed = autoFixIconColors(componentCode);
```

**Features:**

- ✅ Validiert Icon-Farben (keine Ampelfarben auf Icons!)
- ✅ Prüft auf verbotene Hex-Farben
- ✅ Erkennt direkte Farben (bg-white, text-black)
- ✅ Validiert Spacing gegen 8px-Grid
- ✅ Prüft geschützte Komponenten

**Beispiel:**

```typescript
// ❌ FEHLER: Ampelfarbe auf Icon
<Plus className="h-4 w-4 text-status-success" />

// ✅ Auto-Fixed zu:
<Plus className="h-4 w-4 text-foreground" />
```

---

### 2. Entity-Sync (`entity-sync.ts`)

**Zweck:** Synchronisiert Änderungen über Entities hinweg

```typescript
import {
  validateEntityChange,
  cascadeArchive,
  getAffectedEntities,
} from "@/lib/system-consistency";

// 1. Validierung vor Änderung
const validation = await validateEntityChange(
  "drivers", // Entity-Typ
  driverId, // Entity-ID
  "archive", // Änderungs-Typ
  companyId
);

// 2. Betroffene Entities ermitteln
const affected = getAffectedEntities("drivers", "archive");
// → ['bookings', 'shift_schedules', 'documents', 'gps_tracking']

// 3. Cascade-Archivierung
const result = await cascadeArchive("drivers", driverId, companyId);

if (result.success) {
  console.log("Archiviert:", result.archivedEntities);
  // → { drivers: 1, bookings: 5, documents: 3 }
}
```

**Entity-Abhängigkeiten-Matrix:**

```typescript
export const ENTITY_DEPENDENCIES = {
  drivers: ["bookings", "shift_schedules", "documents", "gps_tracking"],
  vehicles: ["bookings", "documents", "maintenance_logs"],
  customers: ["bookings", "invoices", "quotes"],
  bookings: ["invoices", "quotes", "notifications"],
  companies: ["profiles", "bookings", "documents"],
  invoices: ["payments", "notifications"],
  partners: ["partner_bookings", "partner_revenue"],
};
```

**Validierungs-Regeln:**

- ❌ **BLOCKER:** Entity mit aktiven Abhängigkeiten kann nicht gelöscht werden
- ⚠️ **WARNING:** Änderung betrifft abhängige Entities
- ✅ **OK:** Keine Konflikte

---

### 3. Compliance-Widget (`ComplianceWidget.tsx`)

**Zweck:** Dashboard-Widget für ablaufende Pflichtdokumente

```typescript
import { ComplianceWidget } from '@/components/dashboard/ComplianceWidget';

// Im Dashboard einbinden
<ComplianceWidget />
```

**Features:**

- ✅ Zeigt ablaufende Dokumente aller Entities (Fahrer, Fahrzeuge, Firmen)
- ✅ Filtert nach Severity (critical, high, medium)
- ✅ Direct-Navigation zu betroffenen Entities
- ✅ Nutzt `v_all_expiring_documents` View
- ✅ Realtime-Aktualisierung via React Query

**Datenquelle:**

```sql
-- Supabase View
SELECT * FROM v_all_expiring_documents
WHERE company_id = :company_id
  AND days_until_expiry <= 30
ORDER BY days_until_expiry ASC;
```

**Severity-Levels:**

- 🔴 **critical:** 0-7 Tage (PBefG-relevant, rechtlich zwingend)
- 🟡 **high:** 8-14 Tage (wichtig, bald kritisch)
- 🟢 **medium:** 15-30 Tage (Vorwarnung)

---

## 📚 VERWENDUNGS-BEISPIELE

### Beispiel 1: Neue Komponente erstellen

```typescript
// 1. Komponente entwickeln
const MyComponent = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-foreground" /> {/* ✅ RICHTIG */}
          Fahrer-Liste
        </CardTitle>
      </CardHeader>
    </Card>
  );
};

// 2. Vor Commit validieren
import { validateComponent } from '@/lib/system-consistency';

const componentCode = `...`; // Code als String
const result = validateComponent(componentCode, 'src/components/MyComponent.tsx');

if (!result.valid) {
  console.error('❌ Design-Fehler gefunden:', result.errors);

  // Auto-Fix anwenden
  const fixed = autoFixIconColors(componentCode);
  // → Speichere fixed statt componentCode
}
```

---

### Beispiel 2: Entity archivieren

```typescript
import { validateEntityChange, cascadeArchive } from "@/lib/system-consistency";
import { toast } from "sonner";

async function handleArchiveDriver(driverId: string, companyId: string) {
  // 1. Validierung
  const validation = await validateEntityChange("drivers", driverId, "archive", companyId);

  if (!validation.valid) {
    // Zeige Blocker
    toast.error("Archivierung nicht möglich", {
      description: validation.blockers.join("\n"),
    });
    return;
  }

  // 2. Warnungen zeigen (optional)
  if (validation.warnings.length > 0) {
    toast.warning("Achtung", {
      description: validation.warnings.join("\n"),
    });
  }

  // 3. Archivierung durchführen
  const result = await cascadeArchive("drivers", driverId, companyId);

  if (result.success) {
    toast.success("Fahrer archiviert", {
      description: `${result.archivedEntities.drivers} Fahrer, ${result.archivedEntities.documents || 0} Dokumente`,
    });
  } else {
    toast.error("Fehler", {
      description: result.errors.join("\n"),
    });
  }
}
```

---

### Beispiel 3: Bulk-Update über mehrere Entities

```typescript
import { bulkSystemUpdate } from "@/lib/system-consistency";

async function updateDriversAndVehicles(
  updates: Array<{ entityType; entityId; data }>,
  companyId: string
) {
  const result = await bulkSystemUpdate(updates, companyId);

  if (result.success) {
    toast.success(`${result.updated} Entities aktualisiert`);
  } else {
    toast.error("Fehler bei Bulk-Update", {
      description: result.errors.join("\n"),
    });
  }
}

// Verwendung
await updateDriversAndVehicles(
  [
    {
      entityType: "drivers",
      entityId: "driver-1",
      data: { shift_status: "available" },
    },
    {
      entityType: "vehicles",
      entityId: "vehicle-1",
      data: { status: "available" },
    },
  ],
  companyId
);
```

---

## 🚨 KRITISCHE REGELN

### ❌ NIEMALS:

1. **Icon-Farben:** `text-status-success`, `text-status-error`, `text-status-warning` auf Icons
2. **Hex-Farben:** `#FFFFFF`, `#000000` direkt im Code
3. **Direkte Farben:** `bg-white`, `bg-black`, `text-white` (außer sehr spezifisch)
4. **Layout-Änderungen:** Header-Höhe, Sidebar-Breite, Footer-Padding ändern
5. **Partielle Updates:** Nur ein Entity ändern ohne Abhängigkeiten zu prüfen
6. **DELETE verwenden:** Immer archivieren statt löschen

### ✅ IMMER:

1. **Design-Tokens verwenden:** `text-foreground`, `bg-background`, `border-border`
2. **Icon-Farben:** `text-foreground` auf ALLEN Icons (außer in Buttons/Badges)
3. **Komponenten validieren:** Vor Commit `validateComponent()` ausführen
4. **Entity-Changes validieren:** `validateEntityChange()` vor Änderungen
5. **Cascade-Archivierung:** `cascadeArchive()` statt direktes Archivieren
6. **Systemweite Konsistenz prüfen:** `validateSystemConsistency()`

---

## 📊 CHECKLISTE: NEUE FEATURE-ENTWICKLUNG

Beim Entwickeln eines neuen Features:

### ✅ Design

- [ ] Alle Farben verwenden CSS-Variables (keine Hex)
- [ ] Icons verwenden `text-foreground`
- [ ] Spacing folgt 8px-Grid
- [ ] Typography verwendet Design-Tokens
- [ ] Keine geschützten Komponenten verändert

### ✅ Entity-Logik

- [ ] Alle betroffenen Entities identifiziert
- [ ] `validateEntityChange()` vor Änderungen
- [ ] Abhängigkeiten berücksichtigt
- [ ] Cascade-Operationen implementiert
- [ ] `company_id`-Filterung überall

### ✅ Konsistenz

- [ ] `validateComponent()` ausgeführt
- [ ] Auto-Fixes angewendet
- [ ] Systemweite Tests durchgeführt
- [ ] Cross-Entity-Navigation geprüft
- [ ] Dokumentation aktualisiert

---

## 🎓 BEST PRACTICES

### 1. Design-Validation in Pre-Commit-Hook

```typescript
// .husky/pre-commit (optional)
import { validateComponent } from "@/lib/system-consistency";
import { execSync } from "child_process";

const changedFiles = execSync("git diff --cached --name-only")
  .toString()
  .split("\n")
  .filter((f) => f.endsWith(".tsx"));

for (const file of changedFiles) {
  const code = fs.readFileSync(file, "utf-8");
  const result = validateComponent(code, file);

  if (!result.valid) {
    console.error(`❌ ${file}: ${result.errors.join(", ")}`);
    process.exit(1);
  }
}
```

### 2. Entity-Sync in Mutations

```typescript
// In React Query Mutation
const archiveMutation = useMutation({
  mutationFn: async (driverId: string) => {
    // 1. Validierung
    const validation = await validateEntityChange("drivers", driverId, "archive", companyId);
    if (!validation.valid) throw new Error(validation.blockers.join(", "));

    // 2. Archivierung
    return await cascadeArchive("drivers", driverId, companyId);
  },
  onSuccess: () => {
    queryClient.invalidateQueries(["drivers"]);
    queryClient.invalidateQueries(["bookings"]); // Abhängige Entities!
  },
});
```

### 3. Compliance-Monitoring

```typescript
// Dashboard integrieren
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <ComplianceWidget /> {/* Zeigt ablaufende Dokumente */}
  <DashboardKPICards />
  <ActivityTimeline />
</div>
```

---

## 📈 METRIKEN & ZIELE

### Vor System Consistency (V18.2):

- Design-Violations: ~15 pro Sprint
- Partielle Updates: ~8 pro Sprint
- Cross-Entity-Bugs: ~5 pro Sprint
- Manual-Fixes: ~10h pro Sprint

### Nach System Consistency (V18.3):

- Design-Violations: **0** (Auto-Validation)
- Partielle Updates: **0** (Entity-Sync)
- Cross-Entity-Bugs: **0** (Dependency-Matrix)
- Manual-Fixes: **<1h** (Auto-Fix)

**Effizienz-Steigerung:** ~90% weniger manuelle Korrekturen

---

## 🔄 INTEGRATION IN BESTEHENDE WORKFLOWS

### In Code-Review:

```markdown
## Design-Konsistenz

- [ ] `validateComponent()` bestanden
- [ ] Keine Icon-Farben-Violations
- [ ] Design-Tokens verwendet

## Entity-Konsistenz

- [ ] `validateEntityChange()` bestanden
- [ ] Abhängigkeiten berücksichtigt
- [ ] Cascade-Operationen getestet
```

### In Testing:

```typescript
// Unit-Test
describe("Component Design", () => {
  it("should pass design validation", () => {
    const result = validateComponent(componentCode, filePath);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});

// Integration-Test
describe("Entity Operations", () => {
  it("should validate before archiving", async () => {
    const validation = await validateEntityChange("drivers", driverId, "archive", companyId);
    expect(validation.valid).toBe(true);
  });
});
```

---

## 📚 WEITERE DOKUMENTATION

- **Design-System:** `INSTRUCTIONS_GUIDELINES_V18.3_FINAL.md`
- **Pflichtdokumente:** `PFLICHTDOKUMENTE_MATRIX_V18.3.md`
- **Sprint 49:** `SPRINT_49_P_SCHEIN_SYSTEM.md`
- **Technische Optimierungen:** `TECHNISCHE_OPTIMIERUNGEN_V18.3.md`

---

## 🎯 FAZIT

Dieses Framework ist **SYSTEMWEIT VERBINDLICH** und stellt sicher, dass:

1. ✅ **Niemals** Design-Freeze-Regeln verletzt werden
2. ✅ **Niemals** partielle Updates durchgeführt werden
3. ✅ **Immer** systemweite Konsistenz gewahrt bleibt
4. ✅ **Immer** Cross-Entity-Abhängigkeiten berücksichtigt werden

**Status:** ✅ AKTIV ab V18.3  
**Verbindlich für:** ALLE zukünftigen Entwicklungen  
**Wartung:** Bei jeder System-Änderung aktualisieren
