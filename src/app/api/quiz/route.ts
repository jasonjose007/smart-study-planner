import { NextRequest, NextResponse } from "next/server";
import { callNebius, MODELS } from "@/lib/nebius";
import { quizPrompt } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  try {
    const { topic, subject } = await req.json();
    if (!topic) {
      return NextResponse.json({ error: "Missing topic" }, { status: 400 });
    }

    const prompt = quizPrompt(topic, subject || "General");
    const result = await callNebius({
      messages: [{ role: "user", content: prompt }],
      model: MODELS.fast,
      temperature: 0.5,
      maxTokens: 2048,
    });

    const cleaned = result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleaned);

    const questions = parsed.map((q: { question: string; options: string[]; correctIndex: number; explanation: string }, i: number) => ({
      id: `q-${Date.now()}-${i}`,
      topic,
      question: q.question,
      options: q.options,
      correctIndex: q.correctIndex,
      explanation: q.explanation,
    }));

    return NextResponse.json(questions);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
