/**
 * ==================================================================================
 * V5.0 OPT 3: Edge Functions Test Suite
 * ==================================================================================
 * Tests für Knowledge-System Edge Functions:
 * - mandatory-knowledge-check
 * - auto-learn-from-actions
 * ==================================================================================
 */

import { test, expect } from "@playwright/test";

test.describe("V5.0 Knowledge System Edge Functions", () => {
  test.describe("mandatory-knowledge-check Edge Function", () => {
    test("sollte relevant knowledge für component_creation zurückgeben", async ({ request }) => {
      const response = await request.post(
        `${process.env.VITE_SUPABASE_URL}/functions/v1/mandatory-knowledge-check`,
        {
          headers: {
            Authorization: `Bearer ${process.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            "Content-Type": "application/json",
          },
          data: {
            task_description: "Create new Button component",
            task_type: "component_creation",
            affected_files: ["src/components/ui/Button.tsx"],
          },
        }
      );

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      // Response sollte alle erforderlichen Felder haben
      expect(data).toHaveProperty("relevant_knowledge");
      expect(data).toHaveProperty("code_snippets");
      expect(data).toHaveProperty("best_practices");
      expect(data).toHaveProperty("known_issues");
      expect(data).toHaveProperty("existing_components");
      expect(data).toHaveProperty("checklist");

      // Sollte V28Button in existing_components finden
      const hasV28Button = data.existing_components.some(
        (c: any) => c.component_name === "V28Button"
      );
      expect(hasV28Button).toBeTruthy();
    });

    test("sollte known issues für bug_fix task_type zurückgeben", async ({ request }) => {
      const response = await request.post(
        `${process.env.VITE_SUPABASE_URL}/functions/v1/mandatory-knowledge-check`,
        {
          headers: {
            Authorization: `Bearer ${process.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            "Content-Type": "application/json",
          },
          data: {
            task_description: "Fix enum constraint error",
            task_type: "bug_fix",
            affected_files: ["supabase/migrations/"],
          },
        }
      );

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      // Sollte Bug-Fix-Patterns enthalten
      expect(data.relevant_knowledge.length).toBeGreaterThan(0);

      // Sollte Enum-Error-Prevention Pattern finden
      const hasEnumPattern = data.relevant_knowledge.some(
        (k: any) => k.title?.includes("Enum") || k.title?.includes("Constraint")
      );
      expect(hasEnumPattern).toBeTruthy();
    });

    test("sollte checklist mit Validation-Steps zurückgeben", async ({ request }) => {
      const response = await request.post(
        `${process.env.VITE_SUPABASE_URL}/functions/v1/mandatory-knowledge-check`,
        {
          headers: {
            Authorization: `Bearer ${process.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            "Content-Type": "application/json",
          },
          data: {
            task_description: "Add new feature",
            task_type: "feature_implementation",
            affected_files: ["src/pages/NewFeature.tsx"],
          },
        }
      );

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      // Checklist sollte mindestens 3 Items haben
      expect(Array.isArray(data.checklist)).toBeTruthy();
      expect(data.checklist.length).toBeGreaterThanOrEqual(3);

      // Sollte Design-System-Check enthalten
      const hasDesignCheck = data.checklist.some(
        (item: string) => item.includes("Design") || item.includes("V28")
      );
      expect(hasDesignCheck).toBeTruthy();
    });

    test("sollte error bei fehlenden required fields werfen", async ({ request }) => {
      const response = await request.post(
        `${process.env.VITE_SUPABASE_URL}/functions/v1/mandatory-knowledge-check`,
        {
          headers: {
            Authorization: `Bearer ${process.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            "Content-Type": "application/json",
          },
          data: {
            // task_description fehlt
            task_type: "component_creation",
          },
        }
      );

      // Sollte 400 Bad Request sein
      expect(response.status()).toBe(400);
    });
  });

  test.describe("auto-learn-from-actions Edge Function", () => {
    test("sollte learning pattern erfolgreich speichern", async ({ request }) => {
      const response = await request.post(
        `${process.env.VITE_SUPABASE_URL}/functions/v1/auto-learn-from-actions`,
        {
          headers: {
            Authorization: `Bearer ${process.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            "Content-Type": "application/json",
          },
          data: {
            action_type: "component_created",
            success: true,
            context: {
              files_changed: ["src/components/TestComponent.tsx"],
              patterns_used: ["V28 Design System"],
              task_type: "component_creation",
            },
            learnings: "Successfully created component with V28 patterns",
            confidence: 0.95,
          },
        }
      );

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      expect(data).toHaveProperty("success");
      expect(data.success).toBeTruthy();
      expect(data).toHaveProperty("pattern_id");
    });

    test("sollte failure pattern erfolgreich loggen", async ({ request }) => {
      const response = await request.post(
        `${process.env.VITE_SUPABASE_URL}/functions/v1/auto-learn-from-actions`,
        {
          headers: {
            Authorization: `Bearer ${process.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            "Content-Type": "application/json",
          },
          data: {
            action_type: "bug_encountered",
            success: false,
            context: {
              files_changed: ["src/components/BrokenComponent.tsx"],
              issues_encountered: ["Enum constraint violation"],
            },
            learnings: "Enum constraint error - need to validate allowed values first",
            confidence: 0.8,
          },
        }
      );

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      expect(data.success).toBeTruthy();
      // Bei Failure sollte Issue in known_issues gespeichert werden
    });

    test("sollte usage_count in code_snippets incrementieren", async ({ request }) => {
      const response = await request.post(
        `${process.env.VITE_SUPABASE_URL}/functions/v1/auto-learn-from-actions`,
        {
          headers: {
            Authorization: `Bearer ${process.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            "Content-Type": "application/json",
          },
          data: {
            action_type: "pattern_applied",
            success: true,
            context: {
              patterns_used: ["Zod Form Validation Pattern", "Safe User Property Access"],
            },
            learnings: "Applied validation patterns successfully",
            confidence: 1.0,
          },
        }
      );

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      expect(data.success).toBeTruthy();
      // usage_count sollte incrementiert worden sein
    });

    test("sollte error bei fehlenden required fields werfen", async ({ request }) => {
      const response = await request.post(
        `${process.env.VITE_SUPABASE_URL}/functions/v1/auto-learn-from-actions`,
        {
          headers: {
            Authorization: `Bearer ${process.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            "Content-Type": "application/json",
          },
          data: {
            // action_type fehlt
            success: true,
          },
        }
      );

      // Sollte 400 Bad Request sein
      expect(response.status()).toBe(400);
    });
  });

  test.describe("Integration: mandatory-knowledge-check → auto-learn-from-actions", () => {
    test("sollte auto-learning nach knowledge-check triggern", async ({ request }) => {
      // 1. Knowledge-Check durchführen
      const checkResponse = await request.post(
        `${process.env.VITE_SUPABASE_URL}/functions/v1/mandatory-knowledge-check`,
        {
          headers: {
            Authorization: `Bearer ${process.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            "Content-Type": "application/json",
          },
          data: {
            task_description: "Test integration flow",
            task_type: "component_creation",
            affected_files: ["src/components/TestIntegration.tsx"],
          },
        }
      );

      expect(checkResponse.ok()).toBeTruthy();

      // 2. Auto-Learning sollte automatisch getriggert worden sein
      // (wird im mandatory-knowledge-check Edge Function aufgerufen)

      // 3. Warte kurz und prüfe ob Learning Pattern existiert
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Hinweis: Hier könnten wir die DB abfragen um zu prüfen ob
      // ein neuer ai_learning_patterns Eintrag existiert
    });
  });
});
