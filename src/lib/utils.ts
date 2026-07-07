// src/lib/utils.ts
// Shared, pure utility functions for Smart Bharat.
// Kept side-effect free so they are easy to unit test.

/**
 * Generates a human-readable civic complaint tracking ID.
 * Format: SB-YYYY-NNNN  (e.g. "SB-2026-0421")
 *
 * @param year   - The year to embed in the ID (defaults to 2026).
 * @param random - A number in [0, 1) used to derive the 4-digit suffix.
 *                 Injectable so the function stays deterministic in tests.
 */
export function generateTrackingId(year = 2026, random = 0.5): string {
  const suffix = Math.floor(1000 + random * 9000); // always 4 digits
  return `SB-${year}-${suffix}`;
}

export type Priority = "Low" | "Medium" | "High";

/**
 * Maps a triage priority to a Tailwind colour token used for the badge.
 * Falls back to a neutral colour for unknown values.
 */
export function getPriorityColor(priority: string): string {
  switch (priority) {
    case "High":
      return "red";
    case "Medium":
      return "amber";
    case "Low":
      return "green";
    default:
      return "zinc";
  }
}

/**
 * Safely parses a JSON string that may be wrapped in markdown code fences
 * (```json ... ```), which LLMs sometimes add despite instructions.
 * Returns the parsed value, or `null` if parsing fails.
 */
export function safeParseJson<T = unknown>(raw: string): T | null {
  if (!raw) return null;
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    return null;
  }
}

/** The set of AI modes the /api/ai route accepts. */
export const AI_MODES = ["chat", "scheme", "issue"] as const;
export type AiMode = (typeof AI_MODES)[number];

/** Type guard: is the given string a valid AI mode? */
export function isValidMode(mode: string): mode is AiMode {
  return (AI_MODES as readonly string[]).includes(mode);
}
