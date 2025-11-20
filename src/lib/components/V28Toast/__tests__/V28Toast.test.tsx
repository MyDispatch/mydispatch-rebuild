import { render } from "@testing-library/react";
import { V28Toast, V28ToastProvider } from "../index";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";

describe("V28Toast", () => {
  it("renders when open", () => {
    const { getByText } = render(
      <V28ToastProvider>
        <V28Toast open={true} onOpenChange={() => {}} title="Test Toast" />
      </V28ToastProvider>
    );
    expect(getByText("Test Toast")).toBeInTheDocument();
  });

  it("renders title and description", () => {
    const { getByText } = render(
      <V28ToastProvider>
        <V28Toast
          open={true}
          onOpenChange={() => {}}
          title="Success"
          description="Operation completed successfully"
        />
      </V28ToastProvider>
    );
    expect(getByText("Success")).toBeInTheDocument();
    expect(getByText("Operation completed successfully")).toBeInTheDocument();
  });

  it("applies variant styles correctly", () => {
    const { container, rerender } = render(
      <V28ToastProvider>
        <V28Toast open={true} onOpenChange={() => {}} title="Test" variant="success" />
      </V28ToastProvider>
    );
    expect(container.querySelector(".bg-green-50")).toBeInTheDocument();

    rerender(
      <V28ToastProvider>
        <V28Toast open={true} onOpenChange={() => {}} title="Test" variant="error" />
      </V28ToastProvider>
    );
    expect(container.querySelector(".bg-red-50")).toBeInTheDocument();
  });
});
