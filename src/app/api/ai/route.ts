// src/app/api/ai/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { CIVIC_CHAT_PROMPT, SCHEME_FINDER_PROMPT, ISSUE_TRIAGE_PROMPT } from "@/lib/prompts";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM: Record<string, string> = {
  chat: CIVIC_CHAT_PROMPT,
  scheme: SCHEME_FINDER_PROMPT,
  issue: ISSUE_TRIAGE_PROMPT,
};

export async function POST(req: Request) {
  try {
    const { mode, input } = await req.json();
    const system = SYSTEM[mode];
    if (!system) return Response.json({ error: "bad mode" }, { status: 400 });

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
