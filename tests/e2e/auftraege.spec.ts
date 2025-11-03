/**
 * AUFTRÄGE E2E TESTS - MyDispatch V18.3
 * - Order Creation Flow (End-to-End)
 * - ePOD (Elektronischer Nachweis)
 * - Inline-Customer-Creation
 * - Validation & Error Handling
 * - Multi-Step-Formular
 */

import { test, expect } from '@playwright/test';

// ==================================================================================
// HELPER: Login
// ==================================================================================
async function login(page: any) {
  await page.goto('/auth');
  await page.fill('input[name="email"]', 'test@mydispatch.de');
  await page.fill('input[name="password"]', 'TestPassword123!');
  await page.click('button[type="submit"]');
  await page.waitForURL('/dashboard', { timeout: 10000 });
}

// ==================================================================================
// TEST 1: Order Creation Flow (Complete E2E)
// ==================================================================================
test.describe('Order Creation Flow', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    
    // Navigiere zu Aufträge
    await page.click('text=/Aufträge/');
    await page.waitForURL(/\/auftraege/, { timeout: 5000 });
  });

  test('Vollständiger Auftrag: Kunde → Abholung → Fahrer → Abschluss', async ({ page }) => {
    // 1. Öffne "Neuer Auftrag" Dialog
    await page.click('button:has-text("Neuer Auftrag")');
    
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible({ timeout: 5000 });
    
    // 2. Kunde auswählen (Bestehender Kunde)
    const customerSelect = dialog.locator('[data-testid="customer-select"]').or(dialog.locator('button:has-text("Kunde auswählen")'));
    await customerSelect.click();
    
    // Wähle ersten Kunden aus Dropdown
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    
    // 3. Abholort eingeben (HERE Maps Autosuggest)
    await dialog.locator('input[placeholder*="Abholort"]').fill('München Hauptbahnhof');
    await page.waitForTimeout(1000); // Warte auf Autosuggest
    
    // Wähle ersten Vorschlag
    const firstSuggestion = page.locator('[data-testid="address-suggestion"]').first();
    if (await firstSuggestion.isVisible({ timeout: 3000 })) {
      await firstSuggestion.click();
    }
    
    // 4. Zielort eingeben
    await dialog.locator('input[placeholder*="Zielort"]').fill('München Flughafen');
    await page.waitForTimeout(1000);
    
    const targetSuggestion = page.locator('[data-testid="address-suggestion"]').first();
    if (await targetSuggestion.isVisible({ timeout: 3000 })) {
      await targetSuggestion.click();
    }
    
    // 5. Datum & Uhrzeit (Zukunft)
    await dialog.locator('input[type="datetime-local"]').fill('2025-12-31T14:00');
    
    // 6. Preis eingeben
    await dialog.locator('input[placeholder*="Preis"]').fill('45.50');
    
    // 7. Fahrer zuweisen (Optional)
    const driverSelect = dialog.locator('[data-testid="driver-select"]');
    if (await driverSelect.isVisible()) {
      await driverSelect.click();
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');
    }
    
    // 8. Auftrag erstellen
    await dialog.locator('button[type="submit"]').click();
    
    // 9. Erwarte Success-Toast
    await expect(page.locator('text=/erfolgreich erstellt|Auftrag angelegt/')).toBeVisible({ timeout: 10000 });
    
    // 10. Dialog sollte geschlossen sein
    await expect(dialog).not.toBeVisible({ timeout: 5000 });
    
    // 11. Neuer Auftrag sollte in Tabelle erscheinen
    await expect(page.locator('text=/München Hauptbahnhof|München Flughafen/')).toBeVisible({ timeout: 5000 });
  });

  test('Inline-Customer-Creation (Neuer Kunde während Auftragserstellung)', async ({ page }) => {
    // Öffne Dialog
    await page.click('button:has-text("Neuer Auftrag")');
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();
    
    // "Neuer Kunde" Button
    const newCustomerBtn = dialog.locator('button:has-text("Neuer Kunde")').or(dialog.locator('[data-testid="create-customer-inline"]'));
    
    if (await newCustomerBtn.isVisible({ timeout: 3000 })) {
      await newCustomerBtn.click();
      
      // Inline-Formular erscheint
      const inlineForm = dialog.locator('[data-testid="inline-customer-form"]');
      await expect(inlineForm).toBeVisible();
      
      // Fülle Kunde aus
      await inlineForm.locator('input[name="first_name"]').fill('Max');
      await inlineForm.locator('input[name="last_name"]').fill('Mustermann');
      await inlineForm.locator('input[name="email"]').fill('max.mustermann@test.de');
      await inlineForm.locator('input[name="phone"]').fill('+49 170 1234567');
      
      // Speichern
      await inlineForm.locator('button[type="submit"]').click();
      
      // Erwarte dass Kunde nun ausgewählt ist
      await expect(dialog.locator('text=/Max Mustermann/')).toBeVisible({ timeout: 5000 });
    }
  });

  test('Validation: Pflichtfelder & Fehlerbehandlung', async ({ page }) => {
    // Öffne Dialog
    await page.click('button:has-text("Neuer Auftrag")');
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();
    
    // Versuche ohne Pflichtfelder zu speichern
    await dialog.locator('button[type="submit"]').click();
    
    // Erwarte Validierungs-Fehler
    await expect(dialog.locator('text=/erforderlich|Pflichtfeld|muss ausgefüllt/i')).toBeVisible({ timeout: 3000 });
    
    // Dialog sollte NICHT geschlossen werden
    await expect(dialog).toBeVisible();
  });

  test('Auftrag mit Airport-Pickup (Flugnummer)', async ({ page }) => {
    await page.click('button:has-text("Neuer Auftrag")');
    const dialog = page.locator('[role="dialog"]');
    
    // Airport-Pickup Checkbox
    const airportCheckbox = dialog.locator('input[type="checkbox"]').filter({ hasText: /Flughafen|Airport/ });
    
    if (await airportCheckbox.isVisible({ timeout: 3000 })) {
      await airportCheckbox.check();
      
      // Zusatzfelder erscheinen
      await expect(dialog.locator('input[placeholder*="Flugnummer"]')).toBeVisible();
      await dialog.locator('input[placeholder*="Flugnummer"]').fill('LH1234');
      
      await expect(dialog.locator('input[placeholder*="Terminal"]')).toBeVisible();
      await dialog.locator('input[placeholder*="Terminal"]').fill('Terminal 2');
    }
  });
});

// ==================================================================================
// TEST 2: ePOD (Elektronischer Nachweis) - Signatur & Abschluss
// ==================================================================================
test.describe('ePOD - Elektronischer Liefernachweis', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.click('text=/Aufträge/');
    await page.waitForURL(/\/auftraege/);
  });

  test('Auftrag abschließen mit Signatur', async ({ page }) => {
    // Wähle ersten "Bestätigt" Auftrag
    const confirmedBooking = page.locator('[data-testid="booking-row"]').filter({ hasText: /Bestätigt|Confirmed/ }).first();
    
    if (await confirmedBooking.isVisible({ timeout: 5000 })) {
      await confirmedBooking.click();
      
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      
      // "Auftrag abschließen" Button
      const completeBtn = dialog.locator('button:has-text("Abschließen")').or(dialog.locator('button:has-text("Fertigstellen")'));
      
      if (await completeBtn.isVisible()) {
        await completeBtn.click();
        
        // ePOD-Dialog mit Signatur-Canvas
        const epodDialog = page.locator('[data-testid="epod-dialog"]').or(page.locator('text=/Signatur/'));
        await expect(epodDialog).toBeVisible({ timeout: 5000 });
        
        // Signatur-Canvas (Canvas-Element)
        const signatureCanvas = page.locator('canvas');
        await expect(signatureCanvas).toBeVisible();
        
        // Simuliere Signatur (Maus-Bewegung)
        const box = await signatureCanvas.boundingBox();
        if (box) {
          await page.mouse.move(box.x + 50, box.y + 50);
          await page.mouse.down();
          await page.mouse.move(box.x + 150, box.y + 100);
          await page.mouse.up();
        }
        
        // Bestätigen
        await page.locator('button:has-text("Bestätigen")').click();
        
        // Erwarte Success
        await expect(page.locator('text=/erfolgreich abgeschlossen|Abgeschlossen/')).toBeVisible({ timeout: 10000 });
        
        // Status sollte auf "Abgeschlossen" wechseln
        await page.waitForTimeout(2000);
        await expect(page.locator('text=/Abgeschlossen|Completed/')).toBeVisible();
      }
    }
  });

  test('ePOD-PDF herunterladen', async ({ page }) => {
    // Wähle abgeschlossenen Auftrag
    const completedBooking = page.locator('[data-testid="booking-row"]').filter({ hasText: /Abgeschlossen|Completed/ }).first();
    
    if (await completedBooking.isVisible({ timeout: 5000 })) {
      await completedBooking.click();
      
      const dialog = page.locator('[role="dialog"]');
      
      // "ePOD PDF" Button
      const downloadBtn = dialog.locator('button:has-text("ePOD PDF")').or(dialog.locator('[data-testid="download-epod"]'));
      
      if (await downloadBtn.isVisible()) {
        // Download starten
        const downloadPromise = page.waitForEvent('download');
        await downloadBtn.click();
        const download = await downloadPromise;
        
        // Erwarte PDF-Datei
        expect(download.suggestedFilename()).toMatch(/\.pdf$/i);
      }
    }
  });
});

// ==================================================================================
// TEST 3: Auftrags-Status-Workflow
// ==================================================================================
test.describe('Auftrags-Status-Workflow', () => {
  test('Status-Änderung: Pending → Confirmed → Completed', async ({ page }) => {
    await login(page);
    await page.click('text=/Aufträge/');
    await page.waitForURL(/\/auftraege/);
    
    // Wähle "Pending" Auftrag
    const pendingBooking = page.locator('[data-testid="booking-row"]').filter({ hasText: /Ausstehend|Pending/ }).first();
    
    if (await pendingBooking.isVisible({ timeout: 5000 })) {
      await pendingBooking.click();
      
      const dialog = page.locator('[role="dialog"]');
      
      // Status-Dropdown
      const statusSelect = dialog.locator('[data-testid="status-select"]').or(dialog.locator('select[name="status"]'));
      
      if (await statusSelect.isVisible()) {
        // Ändere zu "Bestätigt"
        await statusSelect.selectOption('confirmed');
        
        // Speichern
        await dialog.locator('button:has-text("Speichern")').click();
        
        // Erwarte Success
        await expect(page.locator('text=/aktualisiert|gespeichert/')).toBeVisible({ timeout: 5000 });
        
        // Status sollte sich ändern
        await page.waitForTimeout(1000);
        await pendingBooking.click();
        await expect(dialog.locator('text=/Bestätigt|Confirmed/')).toBeVisible();
      }
    }
  });

  test('Auftrag stornieren mit Grund', async ({ page }) => {
    await login(page);
    await page.click('text=/Aufträge/');
    await page.waitForURL(/\/auftraege/);
    
    const booking = page.locator('[data-testid="booking-row"]').first();
    await booking.click();
    
    const dialog = page.locator('[role="dialog"]');
    
    // "Stornieren" Button
    const cancelBtn = dialog.locator('button:has-text("Stornieren")');
    
    if (await cancelBtn.isVisible()) {
      await cancelBtn.click();
      
      // Bestätigungs-Dialog
      const confirmDialog = page.locator('[role="alertdialog"]').or(page.locator('text=/Möchten Sie wirklich/'));
      await expect(confirmDialog).toBeVisible();
      
      // Storno-Grund (Optional)
      const reasonInput = confirmDialog.locator('textarea');
      if (await reasonInput.isVisible({ timeout: 2000 })) {
        await reasonInput.fill('Kunde hat abgesagt');
      }
      
      // Bestätigen
      await confirmDialog.locator('button:has-text(/Ja|Bestätigen/)').click();
      
      // Erwarte Success
      await expect(page.locator('text=/storniert|cancelled/')).toBeVisible({ timeout: 10000 });
    }
  });
});

// ==================================================================================
// TEST 4: Bulk-Aktionen (Multi-Select)
// ==================================================================================
test.describe('Bulk-Aktionen', () => {
  test('Mehrere Aufträge auswählen & Status ändern', async ({ page }) => {
    await login(page);
    await page.click('text=/Aufträge/');
    await page.waitForURL(/\/auftraege/);
    
    // Multi-Select-Checkboxen
    const checkboxes = page.locator('[data-testid="booking-checkbox"]');
    const count = await checkboxes.count();
    
    if (count >= 2) {
      // Wähle erste 2 Aufträge
      await checkboxes.nth(0).check();
      await checkboxes.nth(1).check();
      
      // Bulk-Action-Bar sollte erscheinen
      const bulkBar = page.locator('[data-testid="bulk-action-bar"]');
      await expect(bulkBar).toBeVisible();
      
      // "Status ändern" Button
      const statusChangeBtn = bulkBar.locator('button:has-text("Status ändern")');
      
      if (await statusChangeBtn.isVisible()) {
        await statusChangeBtn.click();
        
        // Status-Auswahl-Dialog
        await page.locator('button:has-text("Bestätigt")').click();
        
        // Erwarte Success-Toast
        await expect(page.locator('text=/Aufträge aktualisiert|erfolgreich geändert/')).toBeVisible({ timeout: 10000 });
      }
    }
  });

  test('Bulk-PDF-Export', async ({ page }) => {
    await login(page);
    await page.click('text=/Aufträge/');
    await page.waitForURL(/\/auftraege/);
    
    const checkboxes = page.locator('[data-testid="booking-checkbox"]');
    const count = await checkboxes.count();
    
    if (count >= 1) {
      await checkboxes.first().check();
      
      const bulkBar = page.locator('[data-testid="bulk-action-bar"]');
      const exportBtn = bulkBar.locator('button:has-text("PDF exportieren")');
      
      if (await exportBtn.isVisible()) {
        const downloadPromise = page.waitForEvent('download');
        await exportBtn.click();
        const download = await downloadPromise;
        
        expect(download.suggestedFilename()).toMatch(/\.pdf$/i);
      }
    }
  });
});

// ==================================================================================
// TEST 5: Auftrags-Suche & Filter
// ==================================================================================
test.describe('Suche & Filter', () => {
  test('Suche nach Kundennamen', async ({ page }) => {
    await login(page);
    await page.click('text=/Aufträge/');
    await page.waitForURL(/\/auftraege/);
    
    // Such-Input
    const searchInput = page.locator('input[placeholder*="Suche"]').or(page.locator('[data-testid="search-input"]'));
    await searchInput.fill('Mustermann');
    
    // Warte auf Ergebnisse
    await page.waitForTimeout(500);
    
    // Erwarte gefilterte Ergebnisse
    const rows = page.locator('[data-testid="booking-row"]');
    const count = await rows.count();
    
    if (count > 0) {
      await expect(rows.first()).toContainText(/Mustermann/i);
    }
  });

  test('Filter nach Status', async ({ page }) => {
    await login(page);
    await page.click('text=/Aufträge/');
    await page.waitForURL(/\/auftraege/);
    
    // Status-Filter-Dropdown
    const statusFilter = page.locator('[data-testid="status-filter"]').or(page.locator('select:has-text("Status")'));
    
    if (await statusFilter.isVisible()) {
      await statusFilter.selectOption('confirmed');
      
      // Warte auf Filter-Anwendung
      await page.waitForTimeout(500);
      
      // Alle sichtbaren Zeilen sollten "Bestätigt" sein
      const rows = page.locator('[data-testid="booking-row"]');
      const count = await rows.count();
      
      for (let i = 0; i < Math.min(count, 5); i++) {
        await expect(rows.nth(i)).toContainText(/Bestätigt|Confirmed/);
      }
    }
  });
});
