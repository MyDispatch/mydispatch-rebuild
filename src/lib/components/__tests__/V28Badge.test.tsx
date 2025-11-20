import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { V28Badge } from "../V28Badge";

describe("V28Badge", () => {
  it("renders label correctly", () => {
    const { container } = render(<V28Badge label="Test badge" variant="success" />);
    expect(container.textContent).toContain("Test badge");
  });

  it("applies success variant classes", () => {
    const { container } = render(<V28Badge label="Success" variant="success" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("bg-green-100");
    expect(badge.className).toContain("text-green-800");
  });

  it("applies warning variant classes", () => {
    const { container } = render(<V28Badge label="Warning" variant="warning" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("bg-yellow-100");
    expect(badge.className).toContain("text-yellow-800");
  });

  it("applies error variant classes", () => {
    const { container } = render(<V28Badge label="Error" variant="error" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("bg-red-100");
    expect(badge.className).toContain("text-red-800");
  });

  it("applies info variant classes", () => {
    const { container } = render(<V28Badge label="Info" variant="info" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("bg-blue-100");
    expect(badge.className).toContain("text-blue-800");
  });

  it("applies neutral variant classes", () => {
    const { container } = render(<V28Badge label="Neutral" variant="neutral" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("bg-slate-100");
    expect(badge.className).toContain("text-slate-800");
  });

  it("accepts custom className", () => {
    const { container } = render(
      <V28Badge label="Custom" variant="success" className="custom-class" />
    );
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("custom-class");
  });

  it("renders as a span element", () => {
    const { container } = render(<V28Badge label="Test" variant="success" />);
    expect(container.firstChild?.nodeName).toBe("SPAN");
  });
});
