import { NextRequest, NextResponse } from "next/server";
import { callNebius, MODELS } from "@/lib/nebius";
import { flashcardPrompt } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  try {
    const { topic, subject } = await req.json();
    if (!topic) {
      return NextResponse.json({ error: "Missing topic" }, { status: 400 });
    }

    const prompt = flashcardPrompt(topic, subject || "General");
    const result = await callNebius({
      messages: [{ role: "user", content: prompt }],
      model: MODELS.fast,
      temperature: 0.6,
      maxTokens: 2048,
    });

    const cleaned = result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleaned);

    const cards = parsed.map((card: { front: string; back: string }, i: number) => ({
      id: `fc-${Date.now()}-${i}`,
      topic,
      front: card.front,
      back: card.back,
    }));

    return NextResponse.json(cards);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
