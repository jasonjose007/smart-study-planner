import { NextRequest, NextResponse } from "next/server";
import { callNebius, MODELS } from "@/lib/nebius";
import { chatSystemPrompt } from "@/lib/prompts";
import { ChatMessage } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const { messages, subjects, topics } = (await req.json()) as {
      messages: ChatMessage[];
      subjects: string[];
      topics: string[];
    };

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "No messages" }, { status: 400 });
    }

    const systemMsg = chatSystemPrompt(subjects || [], topics || []);
    const apiMessages = [
      { role: "system" as const, content: systemMsg },
      ...messages.slice(-10).map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    const result = await callNebius({
      messages: apiMessages,
      model: MODELS.fast,
      temperature: 0.7,
      maxTokens: 1024,
    });

    return NextResponse.json({ content: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
