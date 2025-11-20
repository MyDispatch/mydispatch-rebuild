import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MarketingLayout } from "@/components/layout/MarketingLayout";
import { BrowserRouter } from "react-router-dom";
import { useDeviceType } from "@/hooks/use-device-type";

// Mock hooks
vi.mock("@/hooks/use-device-type", () => ({
  useDeviceType: vi.fn(() => ({ isMobile: false })),
}));

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("MarketingLayout", () => {
  it("renders children correctly", () => {
    renderWithRouter(
      <MarketingLayout>
        <div>Test Content</div>
      </MarketingLayout>
    );

    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("shows mobile menu button on mobile", () => {
    vi.mocked(useDeviceType).mockReturnValue({ isMobile: true });

    renderWithRouter(
      <MarketingLayout>
        <div>Content</div>
      </MarketingLayout>
    );

    const menuButton = screen.getByLabelText("Navigationsmenü öffnen");
    expect(menuButton).toBeInTheDocument();
  });

  it("logo button is keyboard accessible", () => {
    renderWithRouter(
      <MarketingLayout>
        <div>Content</div>
      </MarketingLayout>
    );

    const logoButton = screen.getByLabelText("Zur Startseite");
    expect(logoButton).toBeInTheDocument();
    expect(logoButton.tagName).toBe("BUTTON");
  });

  it("mobile menu button has proper ARIA attributes", () => {
    vi.mocked(useDeviceType).mockReturnValue({ isMobile: true });

    renderWithRouter(
      <MarketingLayout>
        <div>Content</div>
      </MarketingLayout>
    );

    const menuButton = screen.getByLabelText("Navigationsmenü öffnen");
    expect(menuButton).toHaveAttribute("aria-label");
    expect(menuButton).toHaveAttribute("aria-expanded");
    expect(menuButton).toHaveAttribute("aria-controls");
  });

  it("renders navigation links", () => {
    renderWithRouter(
      <MarketingLayout currentPage="home">
        <div>Content</div>
      </MarketingLayout>
    );

    // Desktop sidebar navigation should exist
    expect(screen.getByText("Startseite")).toBeInTheDocument();
    expect(screen.getByText("Preise & Tarife")).toBeInTheDocument();
    expect(screen.getByText("FAQ")).toBeInTheDocument();
  });

  it("renders footer with legal links", () => {
    renderWithRouter(
      <MarketingLayout>
        <div>Content</div>
      </MarketingLayout>
    );

    expect(screen.getByText(/© 2025 my-dispatch.de/)).toBeInTheDocument();
    expect(screen.getByText("Impressum")).toBeInTheDocument();
    expect(screen.getByText("Datenschutz")).toBeInTheDocument();
  });
});
