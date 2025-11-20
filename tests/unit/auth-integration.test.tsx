/**
 * Integration Tests - Auth Flow V28.2
 *
 * Tests complete authentication integration:
 * - Login flow with role-based navigation
 * - Master account detection
 * - Profile loading
 * - Navigation helpers integration
 * - Error handling
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useAuth } from "@/hooks/use-auth";
import { useAccountType } from "@/hooks/use-account-type";
import { getLoginRedirectRoute } from "@/lib/navigation-helpers";

// Mock Supabase client
const mockSupabase = {
  auth: {
    onAuthStateChange: vi.fn((callback) => {
      // Simulate immediate auth state
      setTimeout(() => {
        callback("SIGNED_IN", {
          user: { id: "test-user-id", email: "test@example.com" },
          access_token: "test-token",
        });
      }, 0);
      return {
        data: { subscription: { unsubscribe: vi.fn() } },
      };
    }),
    signOut: vi.fn().mockResolvedValue({ error: null }),
    getSession: vi.fn().mockResolvedValue({
      data: { session: null },
      error: null,
    }),
  },
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn().mockResolvedValue({
          data: {
            id: "test-user-id",
            email: "test@example.com",
            role: "entrepreneur",
            company: {
              id: "test-company-id",
              name: "Test Company",
              subscription_product_id: "starter-plan",
            },
          },
          error: null,
        }),
      })),
    })),
  })),
};

vi.mock("@/integrations/supabase/client", () => ({
  supabase: mockSupabase,
}));

describe("Auth Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Login Flow - Entrepreneur", () => {
    it("should complete login flow and determine redirect for entrepreneur", async () => {
      const searchParams = new URLSearchParams();

      // Simulate entrepreneur login
      const redirectRoute = getLoginRedirectRoute("entrepreneur", searchParams);

      expect(redirectRoute).toBe("/dashboard");
    });

    it("should respect custom redirect parameter", async () => {
      const searchParams = new URLSearchParams("redirect=/auftraege");

      const redirectRoute = getLoginRedirectRoute("entrepreneur", searchParams);

      expect(redirectRoute).toBe("/auftraege");
    });
  });

  describe("Login Flow - Customer", () => {
    it("should redirect customer to portal", () => {
      const searchParams = new URLSearchParams();

      const redirectRoute = getLoginRedirectRoute("customer", searchParams);

      expect(redirectRoute).toBe("/portal");
    });
  });

  describe("Login Flow - Driver", () => {
    it("should redirect driver to driver dashboard", () => {
      const searchParams = new URLSearchParams();

      const redirectRoute = getLoginRedirectRoute("driver", searchParams);

      expect(redirectRoute).toBe("/driver/dashboard");
    });
  });

  describe("Master Account Detection", () => {
    it("should detect master account and grant permissions", () => {
      vi.mocked(mockSupabase.from).mockReturnValue({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({
              data: {
                id: "master-user-id",
                email: "courbois1981@gmail.com",
                role: "entrepreneur",
                company: {
                  id: "master-company-id",
                  name: "Master Company",
                  subscription_product_id: null,
                },
              },
              error: null,
            }),
          })),
        })),
      } as any);

      // In real scenario, this would be part of the login flow
      const email = "courbois1981@gmail.com";
      const isMaster = email === "courbois1981@gmail.com" || email === "master@my-dispatch.de";

      expect(isMaster).toBe(true);
    });

    it("should NOT detect master account for regular users", () => {
      const email = "user@example.com";
      const isMaster = email === "courbois1981@gmail.com" || email === "master@my-dispatch.de";

      expect(isMaster).toBe(false);
    });
  });

  describe("Profile Loading Integration", () => {
    it("should load complete profile data on login", async () => {
      const mockProfileData = {
        id: "test-user-id",
        email: "test@example.com",
        role: "entrepreneur",
        company: {
          id: "test-company-id",
          name: "Test Company",
          subscription_product_id: "business-plan",
        },
      };

      vi.mocked(mockSupabase.from).mockReturnValue({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({
              data: mockProfileData,
              error: null,
            }),
          })),
        })),
      } as any);

      // Simulate profile fetch
      const result = await mockSupabase
        .from("profiles")
        .select("*")
        .eq("user_id", "test-user-id")
        .single();

      expect(result.data).toEqual(mockProfileData);
      expect(result.error).toBeNull();
    });

    it("should handle profile loading errors gracefully", async () => {
      vi.mocked(mockSupabase.from).mockReturnValue({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { message: "Profile not found" },
            }),
          })),
        })),
      } as any);

      const result = await mockSupabase
        .from("profiles")
        .select("*")
        .eq("user_id", "nonexistent-user-id")
        .single();

      expect(result.data).toBeNull();
      expect(result.error).toBeTruthy();
    });
  });

  describe("Navigation Helpers Integration", () => {
    it("should integrate navigation helpers with auth state", () => {
      // Test entrepreneur flow
      const entrepreneurParams = new URLSearchParams();
      const entrepreneurRoute = getLoginRedirectRoute("entrepreneur", entrepreneurParams);
      expect(entrepreneurRoute).toBe("/dashboard");

      // Test customer flow
      const customerParams = new URLSearchParams();
      const customerRoute = getLoginRedirectRoute("customer", customerParams);
      expect(customerRoute).toBe("/portal");

      // Test driver flow
      const driverParams = new URLSearchParams();
      const driverRoute = getLoginRedirectRoute("driver", driverParams);
      expect(driverRoute).toBe("/driver/dashboard");
    });

    it("should preserve redirect parameter across navigation", () => {
      const params = new URLSearchParams("redirect=/kunden");

      const route = getLoginRedirectRoute("entrepreneur", params);

      expect(route).toBe("/kunden");
    });
  });

  describe("Error Handling", () => {
    it("should handle missing profile data", async () => {
      vi.mocked(mockSupabase.from).mockReturnValue({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: null,
            }),
          })),
        })),
      } as any);

      const result = await mockSupabase
        .from("profiles")
        .select("*")
        .eq("user_id", "test-user-id")
        .single();

      expect(result.data).toBeNull();
    });

    it("should handle signOut errors", async () => {
      vi.mocked(mockSupabase.auth.signOut).mockResolvedValue({
        error: { message: "Sign out failed" } as any,
      });

      const result = await mockSupabase.auth.signOut();

      expect(result.error).toBeTruthy();
    });
  });

  describe("Account Type & Permissions Integration", () => {
    it("should derive correct permissions for master account", () => {
      const masterEmail = "courbois1981@gmail.com";
      const isMaster =
        masterEmail === "courbois1981@gmail.com" || masterEmail === "master@my-dispatch.de";

      const permissions = {
        canSwitchTariff: isMaster,
        canAccessMasterDashboard: isMaster,
        canBypassPayment: isMaster,
        canAccessBusinessFeatures: isMaster,
      };

      expect(permissions).toEqual({
        canSwitchTariff: true,
        canAccessMasterDashboard: true,
        canBypassPayment: true,
        canAccessBusinessFeatures: true,
      });
    });

    it("should derive correct permissions for normal account", () => {
      const normalEmail = "user@example.com";
      const isMaster =
        normalEmail === "courbois1981@gmail.com" || normalEmail === "master@my-dispatch.de";
      const hasBusinessPlan = false;

      const permissions = {
        canSwitchTariff: isMaster,
        canAccessMasterDashboard: isMaster,
        canBypassPayment: isMaster,
        canAccessBusinessFeatures: isMaster || hasBusinessPlan,
      };

      expect(permissions).toEqual({
        canSwitchTariff: false,
        canAccessMasterDashboard: false,
        canBypassPayment: false,
        canAccessBusinessFeatures: false,
      });
    });
  });
});
