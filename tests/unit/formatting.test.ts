import { describe, it, expect } from "vitest";
import {
  formatCurrency,
  formatDate,
  formatNumber,
  formatPercentage,
  formatPhoneNumber,
  formatDuration,
  formatFileSize,
} from "@/lib/formatting";

describe("Formatting Functions (DIN 5008)", () => {
  describe("formatCurrency", () => {
    it("should format EUR correctly (DIN 5008)", () => {
      expect(formatCurrency(1234.56)).toBe("1.234,56 €");
      expect(formatCurrency(1000)).toBe("1.000,00 €");
      expect(formatCurrency(39.99)).toBe("39,99 €");
    });

    it("should handle zero values", () => {
      expect(formatCurrency(0)).toBe("0,00 €");
      expect(formatCurrency(0.0)).toBe("0,00 €");
    });

    it("should handle negative values", () => {
      expect(formatCurrency(-1234.56)).toBe("-1.234,56 €");
    });

    it("should handle invalid values", () => {
      expect(formatCurrency(NaN)).toBe("0,00 €");
      expect(formatCurrency(Infinity)).toBe("0,00 €");
    });

    it("should round to 2 decimal places", () => {
      expect(formatCurrency(1234.567)).toBe("1.234,57 €");
      expect(formatCurrency(1234.561)).toBe("1.234,56 €");
    });
  });

  describe("formatDate", () => {
    it("should format date as DD.MM.YYYY", () => {
      const date = new Date("2025-01-31");
      expect(formatDate(date)).toBe("31.01.2025");
    });

    it("should format date with time", () => {
      const date = new Date("2025-01-31T14:30:00");
      expect(formatDate(date, true)).toBe("31.01.2025 14:30");
    });

    it("should handle ISO strings", () => {
      expect(formatDate("2025-01-31")).toBe("31.01.2025");
    });

    it("should pad single digit days and months", () => {
      const date = new Date("2025-01-05");
      expect(formatDate(date)).toBe("05.01.2025");
    });

    it("should throw error for invalid dates", () => {
      expect(() => formatDate("invalid")).toThrow("Invalid date");
    });
  });

  describe("formatNumber", () => {
    it("should format numbers with thousand separators", () => {
      expect(formatNumber(1234567)).toBe("1.234.567");
      expect(formatNumber(1234)).toBe("1.234");
      expect(formatNumber(42)).toBe("42");
    });

    it("should format numbers with decimals", () => {
      expect(formatNumber(1234.56, 2)).toBe("1.234,56");
      expect(formatNumber(1234.5, 2)).toBe("1.234,50");
      expect(formatNumber(1234.567, 2)).toBe("1.234,57");
    });

    it("should handle zero", () => {
      expect(formatNumber(0)).toBe("0");
      expect(formatNumber(0, 2)).toBe("0,00");
    });

    it("should handle negative values", () => {
      expect(formatNumber(-1234)).toBe("-1.234");
    });

    it("should handle invalid values", () => {
      expect(formatNumber(NaN)).toBe("0");
      expect(formatNumber(Infinity)).toBe("0");
    });
  });

  describe("formatPercentage", () => {
    it("should format percentage with space before %", () => {
      expect(formatPercentage(42)).toBe("42 %");
      expect(formatPercentage(42.5, 1)).toBe("42,5 %");
    });

    it("should handle zero", () => {
      expect(formatPercentage(0)).toBe("0 %");
    });
  });

  describe("formatPhoneNumber", () => {
    it("should format German phone numbers", () => {
      expect(formatPhoneNumber("0123456789")).toBe("0123 456789");
      expect(formatPhoneNumber("+49123456789")).toBe("+49 123 456789");
    });

    it("should handle empty strings", () => {
      expect(formatPhoneNumber("")).toBe("");
    });
  });

  describe("formatDuration", () => {
    it("should format duration in hours and minutes", () => {
      expect(formatDuration(150)).toBe("2h 30min");
      expect(formatDuration(60)).toBe("1h");
      expect(formatDuration(45)).toBe("45min");
    });

    it("should handle zero", () => {
      expect(formatDuration(0)).toBe("0min");
    });
  });

  describe("formatFileSize", () => {
    it("should format file sizes", () => {
      expect(formatFileSize(1024)).toBe("1,00 KB");
      expect(formatFileSize(1048576)).toBe("1,00 MB");
      expect(formatFileSize(1073741824)).toBe("1,00 GB");
    });

    it("should handle bytes", () => {
      expect(formatFileSize(512)).toBe("512 B");
    });
  });
});
