interface ChatCompletionMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface RequestOptions {
  messages: ChatCompletionMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

function getConfig() {
  const nebiusKey = process.env.NEBIUS_API_KEY;
  const nvidiaKey = process.env.NVIDIA_API_KEY;

  if (nebiusKey) {
    return {
      baseUrl: "https://api.tokenfactory.nebius.com/v1",
      apiKey: nebiusKey,
      provider: "nebius" as const,
    };
  }
  if (nvidiaKey) {
    return {
      baseUrl: "https://integrate.api.nvidia.com/v1",
      apiKey: nvidiaKey,
      provider: "nvidia" as const,
    };
  }
  throw new Error("Set NEBIUS_API_KEY or NVIDIA_API_KEY in .env.local");
}

export async function callNebius({
  messages,
  model,
  temperature = 0.7,
  maxTokens = 2048,
}: RequestOptions): Promise<string> {
  const config = getConfig();

  const useModel = model || MODELS.balanced;

  const res = await fetch(`${config.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: useModel,
      messages,
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

export const MODELS = {
  reasoning: "nvidia/llama-3.1-nemotron-ultra-253b-v1",
  balanced: "nvidia/llama-3.1-nemotron-nano-8b-v1",
  fast: "nvidia/llama-3.1-nemotron-nano-8b-v1",
};
