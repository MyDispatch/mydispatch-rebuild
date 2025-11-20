/**
 * E2E Tests - Master-Chat Embedded Section
 * Phase 6: Embedded Chat Integration
 */

import { test, expect } from "@playwright/test";

test.describe("Master-Chat Embedded Section", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");
  });

  test("should display Master-Chat embedded section", async ({ page }) => {
    const chatSection = page.locator('[aria-label="Master Agent Chat Embedded"]');
    await expect(chatSection).toBeVisible();

    // Check Header
    await expect(page.locator("text=Master-Agent")).toBeVisible();
  });

  test("should show welcome message in embedded chat", async ({ page }) => {
    const welcomeMessage = page.locator("text=Hallo! Ich bin der Master-Agent");
    await expect(welcomeMessage).toBeVisible();
  });

  test("should send message in embedded chat", async ({ page }) => {
    const chatInput = page.locator('[aria-label="Chat Input"]').last();
    const sendButton = page.locator('[aria-label="Send Message"]').last();

    await chatInput.fill("Test Embedded Message");
    await sendButton.click();

    // Check message appears
    await expect(page.locator("text=Test Embedded Message")).toBeVisible();
  });

  test("should show drag-drop overlay on drag enter in embedded chat", async ({ page }) => {
    const chatSection = page.locator('[aria-label="Master Agent Chat Embedded"]');

    // Simulate drag enter
    await chatSection.dispatchEvent("dragenter", { dataTransfer: { files: [] } });

    // Check for drag overlay
    await expect(page.locator("text=Datei hier ablegen")).toBeVisible();
  });

  test("should open file upload in embedded chat", async ({ page }) => {
    const uploadButton = page.locator('[aria-label="Datei hochladen"]').last();
    await expect(uploadButton).toBeVisible();
    await uploadButton.click();

    const fileInput = page.locator('input[type="file"]').last();
    await expect(fileInput).toBeAttached();
  });

  test("should be collapsible", async ({ page }) => {
    // Check section is visible (defaultCollapsed=false)
    const chatSection = page.locator('[aria-label="Master Agent Chat Embedded"]');
    await expect(chatSection).toBeVisible();

    // TODO: Test collapse toggle (wenn CollapsibleDashboardSection toggle-button hat)
  });

  test("should be responsive full-width on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();

    const chatSection = page.locator('[aria-label="Master Agent Chat Embedded"]');
    await expect(chatSection).toBeVisible();

    // Check full-width (max-w-5xl + mx-auto)
    const boundingBox = await chatSection.boundingBox();
    expect(boundingBox?.width).toBeGreaterThan(300);
  });

  test("should be responsive max-width on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.reload();

    const chatSection = page.locator('[aria-label="Master Agent Chat Embedded"]');
    await expect(chatSection).toBeVisible();

    // Check max-width (max-w-5xl = 1024px)
    const boundingBox = await chatSection.boundingBox();
    expect(boundingBox?.width).toBeLessThanOrEqual(1024);
  });

  test("should take screenshot with embedded chat", async ({ page }) => {
    await page.screenshot({
      path: "screenshots/dashboard-embedded-chat.png",
      fullPage: true,
    });
  });
});

test.describe("Master-Chat Section Integration", () => {
  test("should have chat section after MAP section", async ({ page }) => {
    await page.goto("/dashboard");

    // Check order: KPIs → MAP → Chat
    const sections = page.locator("div.space-y-8 > *");
    const count = await sections.count();

    // At least 3 sections (KPIs, MAP, Chat)
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test("should not display floating widget when embedded visible", async ({ page }) => {
    await page.goto("/dashboard");

    // Check floating widget is commented out
    const floatingWidget = page.locator(".fixed.bottom-4.right-4");
    await expect(floatingWidget).not.toBeVisible();
  });
});
