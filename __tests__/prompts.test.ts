import { describe, it, expect } from "vitest";
import {
  CIVIC_CHAT_PROMPT,
  SCHEME_FINDER_PROMPT,
  ISSUE_TRIAGE_PROMPT,
} from "../src/lib/prompts";

describe("system prompts", () => {
  const prompts = {
    CIVIC_CHAT_PROMPT,
    SCHEME_FINDER_PROMPT,
    ISSUE_TRIAGE_PROMPT,
  };

  it("are all non-empty strings", () => {
    for (const [name, value] of Object.entries(prompts)) {
      expect(typeof value, name).toBe("string");
      expect(value.length, name).toBeGreaterThan(50);
    }
  });

  it("instruct multilingual (Hindi/Tamil/English) behaviour", () => {
    expect(CIVIC_CHAT_PROMPT).toMatch(/Hindi/);
    expect(CIVIC_CHAT_PROMPT).toMatch(/Tamil/);
    expect(CIVIC_CHAT_PROMPT).toMatch(/English/);
  });

  it("scheme & issue prompts request structured JSON output", () => {
    expect(SCHEME_FINDER_PROMPT).toMatch(/JSON/);
    expect(ISSUE_TRIAGE_PROMPT).toMatch(/JSON/);
  });

  it("chat prompt enforces a verify-source disclaimer for trust/transparency", () => {
    expect(CIVIC_CHAT_PROMPT).toMatch(/verify/i);
  });
});
