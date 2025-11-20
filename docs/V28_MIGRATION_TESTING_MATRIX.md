# 🧪 V28 MIGRATION TESTING MATRIX V28.2.0

**Status:** ✅ PRODUCTION  
**Version:** 28.2.0  
**Zweck:** Vollständige Test-Matrix für Dashboard V28.1 Migration

---

## 📊 TEST CATEGORIES (8)

1. **Visual Tests** - Screenshot Comparison
2. **Functional Tests** - Feature Functionality
3. **API Tests** - Backend Integration
4. **Realtime Tests** - Live Updates
5. **Performance Tests** - Lighthouse Metrics
6. **Accessibility Tests** - WCAG 2.1 AA
7. **Responsive Tests** - Mobile/Tablet/Desktop
8. **Error Handling Tests** - Fallbacks & Edge Cases

---

## 🎯 DASHBOARD (Index.tsx) - 19 FEATURES

### Visual Tests
- [ ] Header Styling (Slate-900 text, correct spacing)
- [ ] KPI Cards Layout (4 cards, correct grid)
- [ ] Quick Actions Section (3 buttons, correct alignment)
- [ ] Map Container (white bg, slate-200 border)
- [ ] Overall Color Palette (100% Slate, no Beige/Dunkelblau)

### Functional Tests
- [ ] Live Time Display updates every second
- [ ] KPI: Heutige Aufträge shows correct count
- [ ] KPI: Umsatz shows correct amount (formatted)
- [ ] KPI: Verfügbare Fahrer shows correct count
- [ ] KPI: Verfügbare Fahrzeuge shows correct count
- [ ] Quick Action: Neuer Auftrag opens dialog
- [ ] Quick Action: Schichtzettel navigates to /schichtzettel
- [ ] Quick Action: Team-Chat navigates to /kommunikation
- [ ] Welcome Wizard opens on first login
- [ ] Mobile: < 768px shows MobileDashboard

### Realtime Tests
- [ ] New booking → KPI updates
- [ ] Driver status change → Map updates
- [ ] Vehicle status change → Map updates

### Performance Tests
- [ ] Lighthouse Score > 90
- [ ] Map loads < 2s

---

## 📦 AUFTRÄGE (Auftraege.tsx) - 20 FEATURES

### Functional Tests
- [ ] Table: Sort by all columns
- [ ] Table: Filter by status works
- [ ] Table: Date range filter works
- [ ] Table: Search by customer name
- [ ] Bulk: Select multiple bookings
- [ ] Bulk: Email action works
- [ ] Bulk: PDF export works
- [ ] Detail Dialog: Opens on row click
- [ ] Booking Creation: Address autocomplete works
- [ ] Realtime: New booking appears in table

**Playwright Test:**
```typescript
test('Auftraege - Table Sort', async ({ page }) => {
  await page.goto('/auftraege');
  await page.click('[data-testid="table-header-date"]');
  const firstRow = await page.locator('[data-testid="booking-row"]').first().textContent();
  expect(firstRow).toContain('2025');
});
```

---

**Total Test Cases:** 150+  
**Estimated Test Time:** 2-3h Full Suite
