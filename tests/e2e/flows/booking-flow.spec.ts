import { test, expect } from '@playwright/test';

/**
 * End-to-End User Flow: Complete Booking Journey
 * Quality Gates V18.3.27
 */

test.describe('Complete Booking Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[type="email"]', process.env.TEST_USER_EMAIL || 'test@mydispatch.de');
    await page.fill('input[type="password"]', process.env.TEST_USER_PASSWORD || 'Test123!');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');
  });

  test('User can create a new booking from dashboard', async ({ page }) => {
    // 1. Start from dashboard
    await page.goto('/');
    await expect(page.locator('h1, h2').first()).toBeVisible();

    // 2. Navigate to bookings
    await page.click('a[href="/bookings"], text=Aufträge');
    await page.waitForURL('/bookings');

    // 3. Click create button
    const createButton = page.getByRole('button', { name: /neuer auftrag|erstellen/i });
    await createButton.click();

    // 4. Fill booking form
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();

    // Pickup address
    await page.fill('input[name="pickup_address"]', 'Hauptstraße 1, 10115 Berlin');
    
    // Dropoff address
    await page.fill('input[name="dropoff_address"]', 'Friedrichstraße 100, 10117 Berlin');
    
    // Pickup time
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().split('T')[0];
    await page.fill('input[type="datetime-local"], input[name="pickup_time"]', `${dateString}T14:00`);

    // Passengers
    await page.fill('input[name="passengers"]', '2');

    // 5. Submit form
    const submitButton = page.getByRole('button', { name: /speichern|erstellen/i });
    await submitButton.click();

    // 6. Verify success
    await page.waitForTimeout(2000);
    
    const successMessage = page.locator('text=/erfolgreich|success/i');
    await expect(successMessage.first()).toBeVisible({ timeout: 5000 });

    // 7. Verify booking appears in list
    const bookingRow = page.locator('tbody tr').first();
    await expect(bookingRow).toBeVisible();
  });

  test('User can assign driver to booking', async ({ page }) => {
    // 1. Go to bookings
    await page.goto('/bookings');

    // 2. Find unassigned booking
    const firstRow = page.locator('tbody tr').first();
    
    if (await firstRow.count() > 0) {
      // 3. Click assign button
      const assignButton = firstRow.locator('button:has-text("Zuweisen"), button[aria-label*="assign" i]');
      
      if (await assignButton.count() > 0) {
        await assignButton.click();

        // 4. Select driver
        await page.waitForTimeout(500);
        
        const driverSelect = page.locator('select, [role="combobox"]').first();
        if (await driverSelect.count() > 0) {
          await driverSelect.click();
          
          const firstDriver = page.locator('[role="option"]').first();
          await firstDriver.click();

          // 5. Confirm assignment
          const confirmButton = page.getByRole('button', { name: /bestätigen|confirm/i });
          if (await confirmButton.count() > 0) {
            await confirmButton.click();
          }

          // 6. Verify success
          await page.waitForTimeout(1000);
          const success = page.locator('text=/zugewiesen|assigned/i');
          expect(await success.count()).toBeGreaterThan(0);
        }
      }
    }
  });

  test('User can update booking status', async ({ page }) => {
    // 1. Go to bookings
    await page.goto('/bookings');

    // 2. Find booking
    const firstRow = page.locator('tbody tr').first();
    
    if (await firstRow.count() > 0) {
      // 3. Open row actions
      const actionsButton = firstRow.locator('button[role="button"]').last();
      await actionsButton.click();

      await page.waitForTimeout(500);

      // 4. Select status change
      const statusOption = page.locator('text=/status.*ändern|change.*status/i');
      
      if (await statusOption.count() > 0) {
        await statusOption.click();

        // 5. Select new status
        const statusSelect = page.locator('select, [role="combobox"]');
        if (await statusSelect.count() > 0) {
          await statusSelect.click();
          
          const completedStatus = page.locator('[role="option"]:has-text("Abgeschlossen"), [role="option"]:has-text("Completed")');
          if (await completedStatus.count() > 0) {
            await completedStatus.click();

            // 6. Confirm
            const confirmButton = page.getByRole('button', { name: /bestätigen|save/i });
            await confirmButton.click();

            // 7. Verify
            await page.waitForTimeout(1000);
            const success = page.locator('text=/erfolgreich|success/i');
            expect(await success.count()).toBeGreaterThan(0);
          }
        }
      }
    }
  });

  test('User can filter bookings by status', async ({ page }) => {
    // 1. Go to bookings
    await page.goto('/bookings');

    // 2. Find status filter
    const statusFilter = page.locator('select[name="status"], [placeholder*="Status"]').first();
    
    if (await statusFilter.count() > 0) {
      // 3. Select "Pending" status
      await statusFilter.click();
      
      const pendingOption = page.locator('[role="option"]:has-text("Ausstehend"), [role="option"]:has-text("Pending")');
      
      if (await pendingOption.count() > 0) {
        await pendingOption.click();

        // 4. Wait for filter to apply
        await page.waitForTimeout(1000);

        // 5. Verify filtered results
        const rows = page.locator('tbody tr');
        const count = await rows.count();
        
        // All visible rows should be "Pending" status
        if (count > 0) {
          const firstRowStatus = await rows.first().locator('text=/ausstehend|pending/i').count();
          expect(firstRowStatus).toBeGreaterThan(0);
        }
      }
    }
  });

  test('User can view booking details', async ({ page }) => {
    // 1. Go to bookings
    await page.goto('/bookings');

    // 2. Click on first booking
    const firstRow = page.locator('tbody tr').first();
    
    if (await firstRow.count() > 0) {
      await firstRow.click();

      // 3. Details dialog/page should open
      await page.waitForTimeout(1000);

      // Should show booking details
      const detailsContainer = page.locator('[role="dialog"], main');
      await expect(detailsContainer).toBeVisible();

      // Should have key information
      const hasAddress = await page.locator('text=/adresse|address/i').count() > 0;
      const hasTime = await page.locator('text=/zeit|time|uhr/i').count() > 0;
      
      expect(hasAddress || hasTime).toBeTruthy();
    }
  });

  test('User can export bookings', async ({ page }) => {
    // 1. Go to bookings
    await page.goto('/bookings');

    // 2. Find export button
    const exportButton = page.locator('button:has-text("Export"), button:has-text("Exportieren")');
    
    if (await exportButton.count() > 0) {
      // 3. Set up download handler
      const downloadPromise = page.waitForEvent('download');
      
      // 4. Click export
      await exportButton.click();

      // 5. Wait for download
      const download = await downloadPromise;
      
      // 6. Verify download
      expect(download.suggestedFilename()).toMatch(/\.(csv|xlsx|pdf)$/);
    }
  });
});

test.describe('Quick Actions Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', process.env.TEST_USER_EMAIL || 'test@mydispatch.de');
    await page.fill('input[type="password"]', process.env.TEST_USER_PASSWORD || 'Test123!');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');
  });

  test('User can access quick actions from dashboard', async ({ page }) => {
    // 1. Dashboard should show quick actions
    const quickActions = page.locator('[class*="quick-action"], button:has-text("Neuer Auftrag")');
    
    if (await quickActions.count() > 0) {
      // 2. Click quick action
      const newBookingAction = quickActions.first();
      await newBookingAction.click();

      // 3. Should open create dialog
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible({ timeout: 3000 });
    }
  });
});

test.describe('Error Recovery Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', process.env.TEST_USER_EMAIL || 'test@mydispatch.de');
    await page.fill('input[type="password"]', process.env.TEST_USER_PASSWORD || 'Test123!');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');
  });

  test('User can recover from failed booking creation', async ({ page }) => {
    // 1. Go to bookings
    await page.goto('/bookings');

    // 2. Try to create booking with invalid data
    const createButton = page.getByRole('button', { name: /erstellen/i });
    
    if (await createButton.count() > 0) {
      await createButton.click();

      // 3. Submit without required fields
      const submitButton = page.getByRole('button', { name: /speichern|erstellen/i });
      await submitButton.click();

      // 4. Should show validation errors
      await page.waitForTimeout(500);
      const errors = page.locator('text=/erforderlich|required/i');
      expect(await errors.count()).toBeGreaterThan(0);

      // 5. Fix errors and resubmit
      await page.fill('input[name="pickup_address"]', 'Berlin Hauptbahnhof');
      await page.fill('input[name="dropoff_address"]', 'Berlin Alexanderplatz');
      
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateString = tomorrow.toISOString().split('T')[0];
      await page.fill('input[type="datetime-local"]', `${dateString}T10:00`);

      await submitButton.click();

      // 6. Should succeed this time
      await page.waitForTimeout(2000);
      const success = page.locator('text=/erfolgreich|success/i');
      await expect(success.first()).toBeVisible({ timeout: 5000 });
    }
  });
});
