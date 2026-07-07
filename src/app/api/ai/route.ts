// src/app/api/ai/route.ts
//
// Single AI endpoint powering all three Smart Bharat features (chat | scheme | issue).
// Design notes:
//  - Models are built ONCE at module load (not per request) to avoid redundant setup.
//  - Each mode has a tuned generationConfig: structured modes force JSON output and use
//    a low temperature for reliability; chat uses a warmer temperature.
//  - Identical requests are served from a small in-memory cache to save latency and quota.
import {
  GoogleGenerativeAI,
  type GenerativeModel,
  type GenerationConfig,
} from "@google/generative-ai";
import { CIVIC_CHAT_PROMPT, SCHEME_FINDER_PROMPT, ISSUE_TRIAGE_PROMPT } from "@/lib/prompts";
import { isValidMode, type AiMode } from "@/lib/utils";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const MODEL_NAME = "gemini-2.5-flash";

// Per-mode generation settings. Structured modes request pure JSON so the client
// never has to strip markdown fences, and bounded output tokens keep responses efficient.
const GENERATION_CONFIG: Record<AiMode, GenerationConfig> = {
  chat: { temperature: 0.7, topP: 0.95, maxOutputTokens: 2048 },
  scheme: {
    temperature: 0.4,
    topP: 0.9,
    maxOutputTokens: 4096,
    responseMimeType: "application/json",
  },
  issue: {
    temperature: 0.4,
    topP: 0.9,
    maxOutputTokens: 1536,
    responseMimeType: "application/json",
  },
};

const SYSTEM_PROMPT: Record<AiMode, string> = {
  chat: CIVIC_CHAT_PROMPT,
  scheme: SCHEME_FINDER_PROMPT,
  issue: ISSUE_TRIAGE_PROMPT,
};

// Build one reusable model per mode at startup instead of on every request.
const models: Record<AiMode, GenerativeModel> = {
  chat: genAI.getGenerativeModel({
    model: MODEL_NAME,
    systemInstruction: SYSTEM_PROMPT.chat,
    generationConfig: GENERATION_CONFIG.chat,
  }),
  scheme: genAI.getGenerativeModel({
    model: MODEL_NAME,
    systemInstruction: SYSTEM_PROMPT.scheme,
    generationConfig: GENERATION_CONFIG.scheme,
  }),
  issue: genAI.getGenerativeModel({
    model: MODEL_NAME,
    systemInstruction: SYSTEM_PROMPT.issue,
    generationConfig: GENERATION_CONFIG.issue,
  }),
};

// Lightweight in-memory cache for identical (mode, input) pairs. Bounded so it
// cannot grow unbounded on a long-lived server instance.
const MAX_CACHE_ENTRIES = 100;
const responseCache = new Map<string, string>();

function cacheGet(key: string): string | undefined {
  return responseCache.get(key);
}

function cacheSet(key: string, value: string): void {
  if (responseCache.size >= MAX_CACHE_ENTRIES) {
    // Evict the oldest entry (Map preserves insertion order).
    const oldest = responseCache.keys().next().value;
    if (oldest !== undefined) responseCache.delete(oldest);
  }
  responseCache.set(key, value);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const mode = typeof body?.mode === "string" ? body.mode : "";
    const input = typeof body?.input === "string" ? body.input.trim() : "";

    // Validate the request before spending an API call.
    if (!isValidMode(mode)) {
      return Response.json({ error: "Invalid mode" }, { status: 400 });
    }
    if (!input) {
      return Response.json({ error: "Input is required" }, { status: 400 });
    }
    if (input.length > 4000) {
      return Response.json({ error: "Input too long" }, { status: 400 });
    }

    // Serve identical requests from cache to save latency and API quota.
    const cacheKey = `${mode}::${input}`;
    const cached = cacheGet(cacheKey);
    if (cached !== undefined) {
      return Response.json({ text: cached, cached: true });
    }

    const result = await models[mode].generateContent(input);
    const text = result.response.text();

    cacheSet(cacheKey, text);
    return Response.json({ text });
  } catch (e) {
    console.error("AI route error:", e instanceof Error ? e.message : e);
    return Response.json({ error: "AI request failed" }, { status: 500 });
  }
}
