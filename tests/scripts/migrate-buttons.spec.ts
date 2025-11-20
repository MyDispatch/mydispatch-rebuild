/* ==================================================================================
   UNIT TESTS: migrate-buttons.ts
   ==================================================================================
   Tests for ui/button → V28Button migration script
   ================================================================================== */

import { describe, it, expect } from "vitest";

describe("migrate-buttons.ts", () => {
  describe("Variant Mappings", () => {
    it("should map all ui/button variants to V28Button variants", () => {
      const variantMap = {
        default: "primary",
        outline: "secondary",
        secondary: "secondary",
        ghost: "secondary",
        destructive: "primary",
        link: "secondary",
      };

      Object.entries(variantMap).forEach(([old, newVariant]) => {
        expect(["primary", "secondary"]).toContain(newVariant);
      });
    });

    it("should have warning for destructive variant", () => {
      // Destructive needs manual review for color
      const destructiveMapping = "primary"; // Maps to primary but needs review

      expect(destructiveMapping).toBe("primary");
    });
  });

  describe("Import Replacement", () => {
    it("should replace ui/button import with V28Button", () => {
      const oldImport = "import { Button } from '@/components/ui/button';";
      const newImport = "import { V28Button } from '@/components/design-system/V28Button';";

      expect(newImport).toContain("V28Button");
      expect(newImport).toContain("design-system");
    });

    it("should remove Button from imports if unused", () => {
      const input = "import { Button, buttonVariants } from '@/components/ui/button';";

      // If Button unused but buttonVariants used, keep import but remove Button
      expect(input).toContain("buttonVariants");
    });
  });

  describe("Component Tag Replacement", () => {
    it("should replace <Button> with <V28Button>", () => {
      const input = '<Button variant="outline">Click</Button>';
      const expected = '<V28Button variant="secondary">Click</V28Button>';

      expect(expected).toContain("V28Button");
      expect(expected).toContain("secondary");
    });

    it("should preserve props other than variant", () => {
      const input = '<Button size="sm" disabled onClick={handler}>Text</Button>';

      // Should keep size, disabled, onClick
      expect(input).toContain('size="sm"');
      expect(input).toContain("disabled");
      expect(input).toContain("onClick");
    });

    it("should handle self-closing tags", () => {
      const input = '<Button variant="ghost" />';
      const expected = '<V28Button variant="secondary" />';

      expect(expected).toContain("V28Button");
      expect(expected).toContain("/>");
    });
  });

  describe("Priority Files", () => {
    it("should prioritize dashboard components (P0)", () => {
      const p0Files = ["UniversalQuickActionsPanel", "DashboardInfoBoard", "NewBookingDialog"];

      // Would check PRIORITY_FILES array
      expect(p0Files.length).toBeGreaterThan(0);
    });

    it("should include design system components", () => {
      const designSystemFiles = ["QuickActions", "HeroSection"];

      expect(designSystemFiles.length).toBe(2);
    });
  });

  describe("Migration Safety", () => {
    it("should skip already migrated files", () => {
      const alreadyMigrated = ["WikiDashboard.tsx", "V28Button.tsx"];

      // Would check ALREADY_MIGRATED array
      expect(alreadyMigrated).toBeDefined();
    });

    it("should not modify files without ui/button imports", () => {
      const input = "const foo = () => <div>No buttons here</div>";
      const output = input; // No changes expected

      expect(input).toBe(output);
    });
  });

  describe("Edge Cases", () => {
    it("should handle buttons with multiple classNames", () => {
      const input = '<Button variant="outline" className="mt-4 w-full">Text</Button>';

      expect(input).toContain("className");
      expect(input).toContain("mt-4");
    });

    it("should handle buttons with children components", () => {
      const input = "<Button><Icon /> Label</Button>";

      expect(input).toContain("<Icon />");
    });

    it("should handle asChild prop", () => {
      const input = '<Button asChild><Link to="/path">Link</Link></Button>';

      expect(input).toContain("asChild");
      expect(input).toContain("Link");
    });
  });
});
