import { NextRequest, NextResponse } from "next/server";
import { callNebius, MODELS } from "@/lib/nebius";
import { analyzePrompt } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  try {
    const { syllabus, examDate } = await req.json();
    if (!syllabus || !examDate) {
      return NextResponse.json({ error: "Missing syllabus or examDate" }, { status: 400 });
    }

    const prompt = analyzePrompt(syllabus, examDate);
    const result = await callNebius({
      messages: [{ role: "user", content: prompt }],
      model: MODELS.balanced,
      temperature: 0.4,
      maxTokens: 4096,
    });

    const cleaned = result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return NextResponse.json(parsed);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
