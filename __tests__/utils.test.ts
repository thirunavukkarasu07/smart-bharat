import { describe, it, expect } from "vitest";
import {
  generateTrackingId,
  getPriorityColor,
  safeParseJson,
  isValidMode,
} from "../src/lib/utils";

describe("generateTrackingId", () => {
  it("produces the SB-YYYY-NNNN format", () => {
    expect(generateTrackingId(2026, 0.5)).toMatch(/^SB-2026-\d{4}$/);
  });

  it("always yields a 4-digit suffix at the boundaries", () => {
    expect(generateTrackingId(2026, 0)).toBe("SB-2026-1000");
    expect(generateTrackingId(2026, 0.9999)).toMatch(/^SB-2026-9\d{3}$/);
  });

  it("embeds the provided year", () => {
    expect(generateTrackingId(2030, 0.1)).toContain("SB-2030-");
  });
});

describe("getPriorityColor", () => {
  it("maps known priorities to colours", () => {
    expect(getPriorityColor("High")).toBe("red");
    expect(getPriorityColor("Medium")).toBe("amber");
    expect(getPriorityColor("Low")).toBe("green");
  });

  it("falls back to neutral for unknown values", () => {
    expect(getPriorityColor("Unknown")).toBe("zinc");
  });
});

describe("safeParseJson", () => {
  it("parses plain JSON", () => {
    expect(safeParseJson('{"a":1}')).toEqual({ a: 1 });
  });

  it("parses JSON wrapped in markdown code fences", () => {
    expect(safeParseJson('```json\n{"ok":true}\n```')).toEqual({ ok: true });
  });

  it("returns null on invalid input", () => {
    expect(safeParseJson("not json")).toBeNull();
    expect(safeParseJson("")).toBeNull();
  });
});

describe("isValidMode", () => {
  it("accepts the three supported modes", () => {
    expect(isValidMode("chat")).toBe(true);
    expect(isValidMode("scheme")).toBe(true);
    expect(isValidMode("issue")).toBe(true);
  });

  it("rejects anything else", () => {
    expect(isValidMode("delete")).toBe(false);
  });
});
