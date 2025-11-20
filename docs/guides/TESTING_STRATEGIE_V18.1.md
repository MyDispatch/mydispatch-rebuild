# 🧪 MyDispatch V18.1 - Testing-Strategie

## 📊 Test-Coverage-Ziele

```
Unit Tests:        80% Coverage
Integration Tests: 60% Coverage
E2E Tests:        40% kritischer Pfade
Performance Tests: Alle Haupt-Queries
Security Tests:   RLS Policies, Input Validation
```

---

## 🎯 Test-Kategorien

### 1. Unit Tests (Komponenten & Funktionen)

**Test-Files:**

```
src/
├── components/
│   └── search/
│       ├── GlobalSearch.test.tsx
│       ├── SearchResults.test.tsx
│       └── FilterPresets.test.tsx
├── hooks/
│   ├── use-global-search.test.tsx
│   └── use-bookings-query.test.tsx
└── lib/
    ├── search-utils.test.ts
    ├── auto-assignment.test.ts
    └── export-pdf.test.ts
```

**Beispiel-Tests:**

```typescript
// src/lib/auto-assignment.test.ts
import { calculateBestAssignment } from "./auto-assignment";

describe("Auto-Assignment Algorithm", () => {
  it("should select driver with highest proximity score", async () => {
    const booking = createMockBooking({
      pickup_location_coords: { lat: 48.1351, lng: 11.582 },
    });

    const result = await calculateBestAssignment(booking);

    expect(result).toBeDefined();
    expect(result.factors.proximity).toBeGreaterThan(80);
  });

  it("should return null if no drivers available", async () => {
    const booking = createMockBooking();
    mockNoAvailableDrivers();

    const result = await calculateBestAssignment(booking);

    expect(result).toBeNull();
  });
});
```

---

### 2. Integration Tests (API + DB)

**Test-Szenarien:**

```typescript
// tests/integration/bookings.test.ts

describe("Bookings API", () => {
  it("should create booking with auto-assignment", async () => {
    // 1. Setup: Verfügbarer Fahrer + Fahrzeug
    const driver = await createTestDriver({ shift_status: "available" });
    const vehicle = await createTestVehicle({ status: "available" });

    // 2. Action: Auftrag erstellen mit auto_assign=true
    const booking = await createBooking({
      vehicle_type: "Economy Class (1-4 Pax)",
      auto_assign: true,
    });

    // 3. Assert: Fahrer + Fahrzeug zugewiesen
    expect(booking.driver_id).toBe(driver.id);
    expect(booking.vehicle_id).toBe(vehicle.id);

    // 4. Assert: Status aktualisiert
    const updatedDriver = await getDriver(driver.id);
    expect(updatedDriver.shift_status).toBe("busy");
  });

  it("should respect company_id isolation", async () => {
    // Company A User versucht Company B Daten zu lesen
    const companyAUser = await createTestUser({ company_id: "company-a" });
    const companyBBooking = await createBooking({ company_id: "company-b" });

    const result = await supabase.from("bookings").select("*").eq("id", companyBBooking.id);

    // RLS sollte Zugriff verweigern
    expect(result.data).toHaveLength(0);
  });
});
```

---

### 3. E2E Tests (User Flows)

**Kritische Pfade:**

```typescript
// e2e/booking-workflow.spec.ts
import { test, expect } from "@playwright/test";

test("Complete booking workflow", async ({ page }) => {
  // 1. Login
  await page.goto("/auth");
  await page.fill('[name="email"]', "test@example.com");
  await page.fill('[name="password"]', "password123");
  await page.click('button[type="submit"]');

  // 2. Dashboard öffnen
  await expect(page).toHaveURL("/");
  await expect(page.locator("h1")).toContainText("Dashboard");

  // 3. Neuer Auftrag
  await page.click("text=Neuer Auftrag");

  // 4. Formular ausfüllen
  await page.fill('[name="pickup_location"]', "München Hauptbahnhof");
  await page.fill('[name="dropoff_location"]', "Flughafen München");
  await page.selectOption('[name="vehicle_type"]', "Economy Class (1-4 Pax)");

  // 5. Auto-Assignment aktivieren
  await page.check('[name="auto_assign"]');

  // 6. Speichern
  await page.click('button:has-text("Auftrag erstellen")');

  // 7. Erfolgsmeldung
  await expect(page.locator(".toast")).toContainText("Auftrag erstellt");

  // 8. Zugewiesener Fahrer angezeigt
  await expect(page.locator('[data-testid="assigned-driver"]')).toBeVisible();
});
```

---

### 4. Performance Tests

**Query-Performance:**

```typescript
// tests/performance/queries.test.ts
import { performance } from "perf_hooks";

describe("Query Performance", () => {
  it("should load bookings in <100ms", async () => {
    const start = performance.now();

    const { data } = await supabase
      .from("bookings")
      .select("*")
      .eq("company_id", testCompanyId)
      .eq("archived", false)
      .limit(50);

    const end = performance.now();
    const duration = end - start;

    expect(duration).toBeLessThan(100);
    expect(data).toBeDefined();
  });

  it("should perform global search in <200ms", async () => {
    const start = performance.now();

    const results = await globalSearch({
      query: "München",
      company_id: testCompanyId,
    });

    const end = performance.now();
    const duration = end - start;

    expect(duration).toBeLessThan(200);
    expect(results.length).toBeGreaterThan(0);
  });
});
```

---

### 5. Security Tests

**RLS Policy Tests:**

```typescript
// tests/security/rls.test.ts

describe("Row Level Security", () => {
  it("should prevent cross-company access", async () => {
    const user1 = await createUser({ company_id: "company-1" });
    const user2 = await createUser({ company_id: "company-2" });

    // User 1 erstellt Auftrag
    const booking = await createBooking({
      company_id: "company-1",
      created_by: user1.id,
    });

    // User 2 versucht Zugriff
    const supabaseUser2 = createSupabaseClient(user2.token);
    const { data, error } = await supabaseUser2.from("bookings").select("*").eq("id", booking.id);

    expect(data).toHaveLength(0); // Kein Zugriff
  });

  it("should validate input data", async () => {
    const maliciousInput = {
      pickup_location: '<script>alert("XSS")</script>',
      price: -100, // Negativer Preis
    };

    await expect(createBooking(maliciousInput)).rejects.toThrow("Validation error");
  });
});
```

---

## 🔄 CI/CD Pipeline

```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install Dependencies
        run: npm ci

      - name: Run Unit Tests
        run: npm run test:unit

      - name: Run Integration Tests
        run: npm run test:integration
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}

      - name: Run E2E Tests
        run: npm run test:e2e

      - name: Check Coverage
        run: npm run test:coverage

      - name: Upload Coverage
        uses: codecov/codecov-action@v3
```

---

## 📈 Test-Metriken

### Definition of Done (DoD)

- [ ] Alle Unit Tests grün (>80% Coverage)
- [ ] Alle Integration Tests grün
- [ ] Kritische E2E-Pfade funktionieren
- [ ] Performance-Ziele erreicht (<100ms Queries)
- [ ] Security-Tests bestanden
- [ ] Keine TypeScript-Errors
- [ ] Bundle Size < 1.5MB
- [ ] Lighthouse Score > 85

---

**Status:** 🟢 Testing-Strategie definiert  
**Nächster Schritt:** Tests während Implementierung schreiben
