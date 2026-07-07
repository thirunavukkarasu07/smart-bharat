// src/app/api/ai/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { CIVIC_CHAT_PROMPT, SCHEME_FINDER_PROMPT, ISSUE_TRIAGE_PROMPT } from "@/lib/prompts";
import { isValidMode } from "@/lib/utils";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM: Record<string, string> = {
  chat: CIVIC_CHAT_PROMPT,
  scheme: SCHEME_FINDER_PROMPT,
  issue: ISSUE_TRIAGE_PROMPT,
};

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

    const system = SYSTEM[mode];

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: system,
    });

    const result = await model.generateContent(input);
    const text = result.response.text();
    return Response.json({ text });
  } catch (e) {

    return Response.json({ error: "AI request failed"}, { status: 500 });
  }
}
