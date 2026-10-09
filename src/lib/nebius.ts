const NEBIUS_BASE = "https://api.tokenfactory.nebius.com/v1";

interface ChatCompletionMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface NebisRequestOptions {
  messages: ChatCompletionMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export async function callNebius({
  messages,
  model = "nvidia/Llama-3.3-Nemotron-Super-49B-v1",
  temperature = 0.7,
  maxTokens = 2048,
}: NebisRequestOptions): Promise<string> {
  const apiKey = process.env.NEBIUS_API_KEY;
  if (!apiKey) throw new Error("NEBIUS_API_KEY not set");

  const res = await fetch(`${NEBIUS_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Nebius API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

export const MODELS = {
  reasoning: "nvidia/Llama-3.1-Nemotron-Ultra-253B-v1",
  balanced: "nvidia/Llama-3.3-Nemotron-Super-49B-v1",
  fast: "nvidia/Llama-3.1-Nemotron-Nano-8B-v1",
};
