/* ==================================================================================
   ROUTE VALIDATION SCRIPT - V18.5.13
   ==================================================================================
   Prüft ob alle PUBLIC-Routen aus APP_ROUTES in routes.config.tsx implementiert sind
   
   Usage: npx tsx scripts/validate-routes.ts
   ================================================================================== */

import { APP_ROUTES } from "../src/config/app-routes";
import { routes } from "../src/config/routes.config";

// Helper: Flatten nested APP_ROUTES object
const flattenRoutes = (obj: any, prefix = ""): string[] => {
  let result: string[] = [];

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      result.push(value);
    } else if (typeof value === "object" && value !== null) {
      result = [...result, ...flattenRoutes(value, key)];
    }
  }

  return result;
};

// Get all routes from APP_ROUTES
const allAppRoutes = flattenRoutes(APP_ROUTES);

// Filter PUBLIC routes (exclude protected areas)
const publicRoutes = allAppRoutes.filter(
  (route) =>
    !route.startsWith("/auth") &&
    !route.startsWith("/dashboard") &&
    !route.startsWith("/portal") &&
    !route.startsWith("/driver") &&
    !route.startsWith("/mobile") &&
    !route.startsWith("/einstellungen") &&
    !route.includes("?") // Exclude query-based routes
);

// Get all routes from routes.config.tsx
const configPaths = routes.map((r) => r.path);

// Find missing routes
const missingInConfig = publicRoutes.filter((route) => !configPaths.includes(route));

// Find dead routes (in config but not in APP_ROUTES)
const deadInConfig = configPaths.filter(
  (path) =>
    !allAppRoutes.includes(path) &&
    !path.startsWith("/driver") && // Driver routes are valid
    !path.startsWith("/features/") && // Feature detail pages are dynamic
    !path.startsWith("/pricing/") && // Pricing detail pages are dynamic
    path !== "/:slug" // Dynamic tenant route
);

// ========== RESULTS ==========
console.log("╔════════════════════════════════════════════════════════════════╗");
console.log("║          ROUTE VALIDATION REPORT - V18.5.13                    ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

console.log("📊 STATISTICS:");
console.log("─".repeat(65));
console.log(`Total APP_ROUTES (all):        ${allAppRoutes.length}`);
console.log(`Public APP_ROUTES:             ${publicRoutes.length}`);
console.log(`Total routes.config routes:    ${configPaths.length}`);
console.log("─".repeat(65));

// ========== MISSING ROUTES ==========
if (missingInConfig.length > 0) {
  console.log("\n❌ MISSING ROUTES IN routes.config.tsx:");
  console.log("─".repeat(65));
  missingInConfig.forEach((route) => {
    console.log(`  🔴 ${route}`);
  });
  console.log("\n💡 ACTION REQUIRED:");
  console.log("   Add these routes to src/config/routes.config.tsx");
  console.log("   or remove them from src/config/app-routes.ts\n");
} else {
  console.log("\n✅ ALL PUBLIC ROUTES IMPLEMENTED!");
}

// ========== DEAD ROUTES ==========
if (deadInConfig.length > 0) {
  console.log("\n⚠️  ROUTES IN CONFIG BUT NOT IN APP_ROUTES:");
  console.log("─".repeat(65));
  deadInConfig.forEach((route) => {
    console.log(`  🟡 ${route}`);
  });
  console.log("\n💡 RECOMMENDATION:");
  console.log("   Consider adding these routes to APP_ROUTES");
  console.log("   or verify they are intentionally standalone\n");
}

// ========== SIDEBAR SYNC CHECK ==========
console.log("\n📝 SIDEBAR MENU VALIDATION:");
console.log("─".repeat(65));

// Known sidebar links from MarketingLayout
const sidebarLinks = ["/", "/pricing", "/docs", "/faq", "/nexify-support", "/contact"];

const missingSidebarRoutes = sidebarLinks.filter((link) => !configPaths.includes(link));

if (missingSidebarRoutes.length > 0) {
  console.log("❌ SIDEBAR LINKS MISSING IN CONFIG:");
  missingSidebarRoutes.forEach((link) => {
    console.log(`  🔴 ${link}`);
  });
} else {
  console.log("✅ All sidebar links are valid routes");
}

// ========== SUMMARY ==========
console.log("\n" + "═".repeat(65));
const hasErrors = missingInConfig.length > 0 || missingSidebarRoutes.length > 0;
if (hasErrors) {
  console.log("🚨 VALIDATION FAILED - Action required!");
  process.exit(1);
} else {
  console.log("✅ VALIDATION PASSED - All routes synchronized!");
  process.exit(0);
}
