import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { V28CookieConsent } from "@/components/shared/V28CookieConsent";
import { useAuth } from "@/hooks/use-auth";

// Mock useAuth hook
vi.mock("@/hooks/use-auth", () => ({
  useAuth: vi.fn(),
}));

// Mock supabase client
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: vi.fn(() => ({
      upsert: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
  },
}));

describe("V28CookieConsent", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue({ profile: null });
  });

  it("shows banner when no consent is stored", () => {
    render(<V28CookieConsent />);
    expect(screen.getByText("Cookie-Einstellungen")).toBeInTheDocument();
  });

  it("does not show banner when consent exists", () => {
    localStorage.setItem(
      "mydispatch_cookie_consent",
      JSON.stringify({ necessary: true, functional: false, analytics: false })
    );

    render(<V28CookieConsent />);
    expect(screen.queryByText("Cookie-Einstellungen")).not.toBeInTheDocument();
  });

  it("accepts all cookies", async () => {
    render(<V28CookieConsent />);

    const acceptAllButton = screen.getByText("Alle akzeptieren");
    fireEvent.click(acceptAllButton);

    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem("mydispatch_cookie_consent") || "{}");
      expect(stored.necessary).toBe(true);
      expect(stored.functional).toBe(true);
      expect(stored.analytics).toBe(true);
    });
  });

  it("accepts only necessary cookies", async () => {
    render(<V28CookieConsent />);

    const acceptNecessaryButton = screen.getByText("Nur notwendige");
    fireEvent.click(acceptNecessaryButton);

    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem("mydispatch_cookie_consent") || "{}");
      expect(stored.necessary).toBe(true);
      expect(stored.functional).toBe(false);
      expect(stored.analytics).toBe(false);
    });
  });

  it("opens settings dialog", async () => {
    render(<V28CookieConsent />);

    const settingsButtons = screen.getAllByText("Einstellungen");
    fireEvent.click(settingsButtons[0]);

    await waitFor(() => {
      expect(screen.getByText("Notwendige Cookies")).toBeInTheDocument();
      expect(screen.getByText("Funktionale Cookies")).toBeInTheDocument();
      expect(screen.getByText("Analytische Cookies")).toBeInTheDocument();
    });
  });

  it("handles corrupted localStorage gracefully", () => {
    localStorage.setItem("mydispatch_cookie_consent", "invalid-json");

    render(<V28CookieConsent />);

    // Should show banner when localStorage is corrupted
    expect(screen.getByText("Cookie-Einstellungen")).toBeInTheDocument();

    // Should clear corrupted data
    expect(localStorage.getItem("mydispatch_cookie_consent")).toBeNull();
  });

  it("validates cookie preferences structure", () => {
    localStorage.setItem("mydispatch_cookie_consent", JSON.stringify({ invalid: "structure" }));

    render(<V28CookieConsent />);

    // Should show banner with invalid structure
    expect(screen.getByText("Cookie-Einstellungen")).toBeInTheDocument();
  });

  it("has accessible labels and ARIA attributes", () => {
    render(<V28CookieConsent />);

    // Check for accessible button labels
    expect(screen.getByText("Alle akzeptieren")).toBeInTheDocument();
    expect(screen.getByText("Nur notwendige")).toBeInTheDocument();
  });
});
