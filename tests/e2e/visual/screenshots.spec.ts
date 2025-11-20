import { test, expect } from "@playwright/test";

/**
 * Visual Regression Tests - Screenshot Baseline
 * Quality Gates V18.3.27
 */

const pages = [
  { path: "/", name: "dashboard" },
  { path: "/bookings", name: "bookings" },
  { path: "/financials", name: "financials" },
  { path: "/vehicles", name: "vehicles" },
  { path: "/drivers", name: "drivers" },
  { path: "/customers", name: "customers" },
  { path: "/settings", name: "settings" },
];

test.describe("Desktop Screenshots", () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto("/login");
    await page.fill('input[type="email"]', process.env.TEST_USER_EMAIL || "test@mydispatch.de");
    await page.fill('input[type="password"]', process.env.TEST_USER_PASSWORD || "Test123!");
    await page.click('button[type="submit"]');
    await page.waitForURL("/");
  });

  for (const pageInfo of pages) {
    test(`Screenshot: ${pageInfo.name} (Desktop)`, async ({ page }) => {
      await page.goto(pageInfo.path);
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(1000); // Wait for animations

      await expect(page).toHaveScreenshot(`${pageInfo.name}-desktop.png`, {
        fullPage: true,
        maxDiffPixels: 100,
      });
    });
  }

  test("Screenshot: Dashboard with dialog open", async ({ page }) => {
    await page.goto("/bookings");

    const createButton = page.getByRole("button", { name: /erstellen/i });

    if ((await createButton.count()) > 0) {
      await createButton.click();
      await page.waitForTimeout(500);

      await expect(page).toHaveScreenshot("bookings-create-dialog-desktop.png", {
        maxDiffPixels: 100,
      });
    }
  });
});

test.describe("Mobile Screenshots", () => {
  test.use({
    viewport: { width: 390, height: 844 }, // iPhone 12
  });

  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"]', process.env.TEST_USER_EMAIL || "test@mydispatch.de");
    await page.fill('input[type="password"]', process.env.TEST_USER_PASSWORD || "Test123!");
    await page.click('button[type="submit"]');
    await page.waitForURL("/");
  });

  for (const pageInfo of pages) {
    test(`Screenshot: ${pageInfo.name} (Mobile)`, async ({ page }) => {
      await page.goto(pageInfo.path);
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(1000);

      await expect(page).toHaveScreenshot(`${pageInfo.name}-mobile.png`, {
        fullPage: true,
        maxDiffPixels: 150,
      });
    });
  }

  test("Screenshot: Mobile menu open", async ({ page }) => {
    await page.goto("/");

    const menuButton = page.locator('[aria-label*="menu" i]').first();
    await menuButton.click();
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot("mobile-menu-open.png", {
      maxDiffPixels: 100,
    });
  });
});

test.describe("Tablet Screenshots", () => {
  test.use({
    viewport: { width: 1024, height: 1366 }, // iPad Pro
  });

  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"]', process.env.TEST_USER_EMAIL || "test@mydispatch.de");
    await page.fill('input[type="password"]', process.env.TEST_USER_PASSWORD || "Test123!");
    await page.click('button[type="submit"]');
    await page.waitForURL("/");
  });

  test("Screenshot: Dashboard (Tablet)", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot("dashboard-tablet.png", {
      fullPage: true,
      maxDiffPixels: 150,
    });
  });

  test("Screenshot: Bookings list (Tablet)", async ({ page }) => {
    await page.goto("/bookings");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot("bookings-tablet.png", {
      fullPage: true,
      maxDiffPixels: 150,
    });
  });
});

test.describe("Component Screenshots", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"]', process.env.TEST_USER_EMAIL || "test@mydispatch.de");
    await page.fill('input[type="password"]', process.env.TEST_USER_PASSWORD || "Test123!");
    await page.click('button[type="submit"]');
    await page.waitForURL("/");
  });

  test("Screenshot: KPI Cards", async ({ page }) => {
    await page.goto("/");

    const kpiCards = page.locator('[class*="kpi"], [class*="stat"]').first();

    if ((await kpiCards.count()) > 0) {
      await expect(kpiCards).toHaveScreenshot("kpi-cards.png", {
        maxDiffPixels: 50,
      });
    }
  });

  test("Screenshot: Data table", async ({ page }) => {
    await page.goto("/bookings");

    const table = page.locator("table").first();

    if ((await table.count()) > 0) {
      await expect(table).toHaveScreenshot("data-table.png", {
        maxDiffPixels: 100,
      });
    }
  });

  test("Screenshot: Navigation sidebar", async ({ page }) => {
    await page.goto("/");

    const sidebar = page.locator('[role="navigation"]').first();

    if ((await sidebar.count()) > 0) {
      await expect(sidebar).toHaveScreenshot("navigation-sidebar.png", {
        maxDiffPixels: 50,
      });
    }
  });
});

test.describe("Dark Mode Screenshots", () => {
  test.use({
    colorScheme: "dark",
  });

  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"]', process.env.TEST_USER_EMAIL || "test@mydispatch.de");
    await page.fill('input[type="password"]', process.env.TEST_USER_PASSWORD || "Test123!");
    await page.click('button[type="submit"]');
    await page.waitForURL("/");
  });

  test("Screenshot: Dashboard (Dark Mode)", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot("dashboard-dark.png", {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });

  test("Screenshot: Bookings (Dark Mode)", async ({ page }) => {
    await page.goto("/bookings");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot("bookings-dark.png", {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });
});
